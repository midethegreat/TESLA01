import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import { initializeDatabase } from "./db"
import {
  createUser,
  getUserByEmail,
  getUserById,
  createEmailToken,
  verifyEmailToken,
  createSession,
  validateSession,
  comparePasswords,
} from "./auth"
import { sendVerificationEmail } from "./email"
import { generateId } from "./utils"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// Initialize database
initializeDatabase()

// Configure file uploads
const uploadDir = path.join(__dirname, "../public/uploads")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${generateId()}-${file.originalname}`
    cb(null, uniqueName)
  },
})
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }) // 50MB limit

// Middleware to validate auth token
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  const session = validateSession(token)
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }

  req.userId = session.userId
  next()
}

// Auth Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, country } = req.body

    if (!email || !password || !firstName || !lastName || !country) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const user = await createUser(email, password, firstName, lastName, country)
    const verificationToken = createEmailToken(user.id)

    await sendVerificationEmail(email, verificationToken, firstName)

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: user.id,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Verify Email
app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const { userId, token } = req.body

    if (!userId || !token) {
      return res.status(400).json({ error: "Missing userId or token" })
    }

    const isValid = verifyEmailToken(userId, token)

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    const user = getUserById(userId)
    const authToken = createSession(userId)

    res.json({
      success: true,
      message: "Email verified successfully",
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        emailVerified: true,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const user = getUserByEmail(email) as any

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    if (!user.emailVerified) {
      return res.status(400).json({ error: "Email not verified. Check your inbox." })
    }

    const isPasswordValid = await comparePasswords(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    const token = createSession(user.id)

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get Current User
app.get("/api/auth/me", authMiddleware, (req: any, res) => {
  try {
    const user = getUserById(req.userId)
    res.json(user)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Document Routes

// Upload Document
app.post("/api/documents/upload", authMiddleware, upload.single("file"), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const db = require("./db").default
    const docId = generateId()
    const now = new Date().toISOString()

    const stmt = db.prepare(`
      INSERT INTO documents (id, userId, fileName, fileType, filePath, fileSize, uploadedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      docId,
      req.userId,
      req.file.originalname,
      req.file.mimetype,
      `/uploads/${req.file.filename}`,
      req.file.size,
      now,
    )

    res.json({
      success: true,
      document: {
        id: docId,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        uploadedAt: now,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get User Documents
app.get("/api/documents", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const stmt = db.prepare("SELECT * FROM documents WHERE userId = ? ORDER BY uploadedAt DESC")
    const documents = stmt.all(req.userId)

    res.json({ documents })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Delete Document
app.delete("/api/documents/:id", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const { id } = req.params

    const stmt = db.prepare("SELECT * FROM documents WHERE id = ? AND userId = ?")
    const document = stmt.get(id, req.userId) as any

    if (!document) {
      return res.status(404).json({ error: "Document not found" })
    }

    const fs = require("fs")
    const filePath = path.join(__dirname, "../public", document.filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    const deleteStmt = db.prepare("DELETE FROM documents WHERE id = ?")
    deleteStmt.run(id)

    res.json({ success: true, message: "Document deleted" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Admin Routes

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const db = await import("./db")
    const data = db.getDatabase()

    // Demo admin credentials (change in production)
    const admins = [
      { email: "admin@example.com", password: "password123", role: "admin" },
      { email: "superadmin@example.com", password: "password123", role: "superadmin" },
    ]

    const admin = admins.find((a) => a.email === email && a.password === password)

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = createSession(`admin_${Date.now()}`)

    res.json({
      success: true,
      token,
      admin: {
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Admin Dashboard Stats
app.get("/api/admin/dashboard", authMiddleware, async (req: any, res) => {
  try {
    const db = await import("./db")
    const data = db.getDatabase()

    const totalUsers = data.users.length
    const emailVerified = data.users.filter((u: any) => u.emailVerified).length
    const kycVerified = data.users.filter((u: any) => u.kycVerified).length
    const kycPending = data.users.filter((u: any) => u.kycStatus === "submitted").length

    res.json({
      totalUsers,
      emailVerified,
      kycVerified,
      kycPending,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get All Users (Admin)
app.get("/api/admin/users", authMiddleware, async (req: any, res) => {
  try {
    const db = await import("./db")
    const data = db.getDatabase()

    const users = data.users.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      gender: user.gender,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus || "none",
      kycVerified: user.kycVerified || false,
      createdAt: user.createdAt,
      referralCount: data.users.filter((u: any) => u.referrerId === user.id && u.emailVerified).length,
    }))

    res.json(users)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get KYC Requests (Admin)
app.get("/api/admin/kyc-requests", authMiddleware, async (req: any, res) => {
  try {
    const db = await import("./db")
    const data = db.getDatabase()

    const kycRequests = data.users
      .filter((user: any) => user.kycStatus === "submitted" && user.kyc)
      .map((user: any) => ({
        userId: user.id,
        fullName: user.kyc.fullName,
        dob: user.kyc.dob,
        idType: user.kyc.idType,
        idFrontPath: user.kyc.idFront,
        idBackPath: user.kyc.idBack,
        selfiePath: user.kyc.selfie,
        submittedAt: user.kyc.submittedAt,
        status: "pending",
      }))

    res.json(kycRequests)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Approve KYC (Admin)
app.post("/api/admin/kyc/:userId/approve", authMiddleware, async (req: any, res) => {
  try {
    const { userId } = req.params
    const db = await import("./db")
    const data = db.getDatabase()

    const userIndex = data.users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = data.users[userIndex]

    // Update user KYC status
    user.kycStatus = "verified"
    user.kycVerified = true
    user.kyc.verifiedAt = new Date().toISOString()
    user.kyc.verifiedBy = "admin"

    // Create notification for user
    if (!data.notifications) {
      data.notifications = []
    }

    data.notifications.push({
      id: generateId(),
      userId: userId,
      type: "kyc_approved",
      title: "KYC Approved!",
      message: "Congratulations! Your KYC verification has been approved. You can now access all features.",
      read: false,
      createdAt: new Date().toISOString(),
    })

    db.saveDatabase()

    // Send email notification
    try {
      await sendVerificationEmail(user.email, "", user.firstName, "kyc_approved")
    } catch (emailError) {
      console.error("[v0] Failed to send KYC approval email:", emailError)
    }

    res.json({ success: true, message: "KYC approved successfully" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Reject KYC (Admin)
app.post("/api/admin/kyc/:userId/reject", authMiddleware, async (req: any, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body
    const db = await import("./db")
    const data = db.getDatabase()

    const userIndex = data.users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" })
    }

    const user = data.users[userIndex]

    // Update user KYC status
    user.kycStatus = "rejected"
    user.kycVerified = false
    user.kyc.rejectedAt = new Date().toISOString()
    user.kyc.rejectedBy = "admin"
    user.kyc.rejectionReason = reason

    // Create notification for user
    if (!data.notifications) {
      data.notifications = []
    }

    data.notifications.push({
      id: generateId(),
      userId: userId,
      type: "kyc_rejected",
      title: "KYC Rejected",
      message: `Your KYC verification was rejected. Reason: ${reason}. Please resubmit with correct documents.`,
      read: false,
      createdAt: new Date().toISOString(),
    })

    db.saveDatabase()

    // Send email notification
    try {
      await sendVerificationEmail(user.email, "", user.firstName, "kyc_rejected", reason)
    } catch (emailError) {
      console.error("[v0] Failed to send KYC rejection email:", emailError)
    }

    res.json({ success: true, message: "KYC rejected" })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get User Notifications
app.get("/api/notifications", authMiddleware, async (req: any, res) => {
  try {
    const db = await import("./db")
    const data = db.getDatabase()

    if (!data.notifications) {
      data.notifications = []
    }

    const userNotifications = data.notifications
      .filter((n: any) => n.userId === req.userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    res.json({ notifications: userNotifications })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Mark Notification as Read
app.post("/api/notifications/:id/read", authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params
    const db = await import("./db")
    const data = db.getDatabase()

    if (!data.notifications) {
      return res.status(404).json({ error: "Notification not found" })
    }

    const notification = data.notifications.find((n: any) => n.id === id && n.userId === req.userId)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    notification.read = true
    db.saveDatabase()

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get Analytics (Admin)
app.get("/api/admin/analytics", authMiddleware, async (req: any, res) => {
  try {
    const db = await import("./db")
    const data = db.getDatabase()

    const totalUsers = data.users.length
    const emailVerified = data.users.filter((u: any) => u.emailVerified).length
    const kycVerified = data.users.filter((u: any) => u.kycVerified).length
    const kycPending = data.users.filter((u: any) => u.kycStatus === "submitted").length

    // Group by country
    const byCountry: any = {}
    data.users.forEach((user: any) => {
      const country = user.country || "Unknown"
      byCountry[country] = (byCountry[country] || 0) + 1
    })

    res.json({
      totalUsers,
      emailVerified,
      kycVerified,
      kycPending,
      byCountry,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// KYC Submission
app.post(
  "/api/kyc/submit",
  authMiddleware,
  upload.fields([
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  async (req: any, res) => {
    try {
      const { fullName, dob, idType } = req.body
      const files = req.files

      if (!fullName || !dob || !idType || !files.idFront || !files.idBack || !files.selfie) {
        return res.status(400).json({ error: "Missing required fields or files" })
      }

      const db = await import("./db")
      const data = db.getDatabase()

      const userIndex = data.users.findIndex((u: any) => u.id === req.userId)
      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" })
      }

      const user = data.users[userIndex]

      // Store KYC data
      user.kyc = {
        fullName,
        dob,
        idType,
        idFront: `/uploads/${files.idFront[0].filename}`,
        idBack: `/uploads/${files.idBack[0].filename}`,
        selfie: `/uploads/${files.selfie[0].filename}`,
        submittedAt: new Date().toISOString(),
        verified: false,
      }
      user.kycStatus = "submitted"

      db.saveDatabase()

      res.json({ success: true, message: "KYC submitted successfully for review" })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },
)

// Get All Uploads (Admin Only)
app.get("/api/admin/uploads", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const stmt = db.prepare(`
      SELECT d.*, u.email, u.firstName, u.lastName
      FROM documents d
      JOIN users u ON d.userId = u.id
      ORDER BY d.uploadedAt DESC
    `)
    const documents = stmt.all()

    res.json({ documents })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Profile Image Routes

// Upload Profile Image
app.post("/api/profile/image", authMiddleware, upload.single("file"), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const db = require("./db").default
    const imageId = generateId()
    const now = new Date().toISOString()
    const imagePath = `/uploads/${req.file.filename}`

    // Delete old image if exists
    const oldStmt = db.prepare("SELECT imagePath FROM profile_images WHERE userId = ?")
    const oldImage = oldStmt.get(req.userId) as any

    if (oldImage) {
      const fs = require("fs")
      const oldFilePath = path.join(__dirname, "../public", oldImage.imagePath)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }

      const deleteStmt = db.prepare("DELETE FROM profile_images WHERE userId = ?")
      deleteStmt.run(req.userId)
    }

    const insertStmt = db.prepare(`
      INSERT INTO profile_images (id, userId, imagePath, uploadedAt)
      VALUES (?, ?, ?, ?)
    `)

    insertStmt.run(imageId, req.userId, imagePath, now)

    res.json({
      success: true,
      imagePath,
      uploadedAt: now,
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get Profile Image
app.get("/api/profile/image", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const stmt = db.prepare("SELECT * FROM profile_images WHERE userId = ?")
    const image = stmt.get(req.userId)

    res.json({ image })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update Profile
app.put("/api/profile", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const { firstName, lastName, country } = req.body
    const now = new Date().toISOString()

    const stmt = db.prepare(`
      UPDATE users SET firstName = ?, lastName = ?, country = ?, updatedAt = ?
      WHERE id = ?
    `)

    stmt.run(firstName, lastName, country, now, req.userId)

    const user = getUserById(req.userId)

    res.json({ success: true, user })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Real-time Updates Route
app.get("/api/updates", authMiddleware, (req: any, res) => {
  try {
    const db = require("./db").default
    const stmt = db.prepare("SELECT * FROM user_updates WHERE userId = ? ORDER BY createdAt DESC LIMIT 50")
    const updates = stmt.all(req.userId)

    res.json({ updates })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
