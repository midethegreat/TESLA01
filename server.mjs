import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { promises as fs } from "fs"
import fsSync from "fs"
import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || "tesla-investment-secret-key-change-in-production"

const DB_PATH = path.join(__dirname, "data", "db.json")

const uploadsDir = path.join(__dirname, "public", "uploads")
if (!fsSync.existsSync(uploadsDir)) {
  fsSync.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(express.static("public"))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
})

// Database helpers
async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return { users: [], documents: [], profileImages: [] }
  }
}

async function saveDB(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, country, referrerId } = req.body

    if (!email || !password || !firstName || !lastName || !country) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const db = await getDB()

    if (db.users.some((u) => u.email === email)) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = generateVerificationToken()
    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      country,
      emailVerified: false,
      verificationToken,
      referrerId: referrerId || null,
      createdAt: new Date().toISOString(),
      kycStatus: "not submitted", // Initialize kycStatus
      kycVerified: false,
    }

    db.users.push(newUser)
    await saveDB(db)

    console.log(`[v0] User registered: ${email}, token: ${verificationToken}`)

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId: newUser.id,
      verificationToken,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return res.status(500).json({ error: "Registration failed" })
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(`[v0] Login attempt for email: ${email}`)

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const db = await getDB()
    console.log(`[v0] Database has ${db.users.length} users`)
    
    const user = db.users.find((u) => u.email === email)

    if (!user) {
      console.log("[v0] User not found:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log(`[v0] Password valid: ${isValidPassword}`)

    if (!isValidPassword) {
      console.log("[v0] Invalid password for user:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    console.log("[v0] Login successful:", email)

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        emailVerified: user.emailVerified,
        kycStatus: user.kycStatus || "not submitted",
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return res.status(500).json({ error: "Login failed" })
  }
})

// Verify Email
app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const { userId, token: verificationToken } = req.body

    if (!userId || !verificationToken) {
      return res.status(400).json({ error: "Missing verification data" })
    }

    const db = await getDB()
    const user = db.users.find((u) => u.id === userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.verificationToken !== verificationToken) {
      console.log("[v0] Invalid verification token for user:", userId)
      return res.status(400).json({ error: "Invalid verification token" })
    }

    user.emailVerified = true
    delete user.verificationToken

    await saveDB(db)

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    console.log("[v0] Email verified for user:", userId)

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        emailVerified: true,
        kycStatus: user.kycStatus || "not submitted",
      },
    })
  } catch (error) {
    console.error("[v0] Email verification error:", error)
    return res.status(500).json({ error: "Verification failed" })
  }
})

// Get current user
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus || "not submitted",
      kycVerified: user.kycVerified || false,
    })
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Update profile
app.put("/api/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, username, gender, dateOfBirth, phone, country, city, zipCode, address } = req.body

    const db = await getDB()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Prevent editing if KYC is verified
    if (user.kycVerified) {
      return res.status(403).json({ error: "Cannot edit profile after KYC verification" })
    }

    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (username) user.username = username
    if (gender) user.gender = gender
    if (dateOfBirth) user.dateOfBirth = dateOfBirth
    if (phone) user.phone = phone
    if (country) user.country = country
    if (city) user.city = city
    if (zipCode) user.zipCode = zipCode
    if (address) user.address = address
    if (!user.joiningDate) user.joiningDate = new Date().toISOString().split("T")[0]

    await saveDB(db)

    console.log("[v0] Profile updated for user:", req.user.id)

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      country: user.country,
      city: user.city,
      zipCode: user.zipCode,
      address: user.address,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus || "not submitted",
      kycVerified: user.kycVerified || false,
    })
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return res.status(500).json({ error: "Profile update failed" })
  }
})

// Get documents
app.get("/api/documents", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const userDocuments = (db.documents || []).filter((d) => d.userId === req.user.id)
    return res.json(userDocuments)
  } catch (error) {
    console.error("[v0] Get documents error:", error)
    return res.status(500).json({ error: "Failed to fetch documents" })
  }
})

// Admin - get all users
app.get("/api/admin/users", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    
    // Calculate referral counts for each user
    const usersWithReferrals = db.users.map((u) => {
      const referralCount = db.users.filter((user) => user.referrerId === u.id && user.emailVerified).length
      return {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        gender: u.gender || "-",
        phone: u.phone || "-",
        country: u.country,
        createdAt: u.createdAt,
        emailVerified: u.emailVerified,
        kycStatus: u.kycStatus || "not submitted",
        kycVerified: u.kycVerified || false,
        referralCount: referralCount,
      }
    })
    return res.json(usersWithReferrals)
  } catch (error) {
    console.error("[v0] Get all users error:", error)
    return res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Admin - get all documents
app.get("/api/admin/uploads", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    return res.json(db.documents || [])
  } catch (error) {
    console.error("[v0] Get all documents error:", error)
    return res.status(500).json({ error: "Failed to fetch documents" })
  }
})

// Get referrals
app.get("/api/profile/referrals", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const referrals = db.users.filter(
      (u) => u.referrerId === req.user.id && u.emailVerified === true
    )
    return res.json({ referrals: referrals.length, users: referrals })
  } catch (error) {
    console.error("[v0] Referrals fetch error:", error)
    return res.status(500).json({ error: "Failed to fetch referrals" })
  }
})

// Fixed Profile image upload endpoint using synchronous fs
app.post("/api/profile/image", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const db = await getDB()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const fileName = `${req.user.id}-${Date.now()}-${req.file.originalname}`
    const filePath = `/uploads/${fileName}`
    const fullPath = path.join(uploadsDir, fileName)

    fsSync.writeFileSync(fullPath, req.file.buffer)

    user.profileImage = filePath
    await saveDB(db)

    console.log("[v0] Profile image uploaded for user:", req.user.id)

    return res.json({ imagePath: filePath, uploadedAt: new Date().toISOString() })
  } catch (error) {
    console.error("[v0] Profile image upload error:", error)
    return res.status(500).json({ error: "Profile image upload failed" })
  }
})

// Get profile image
app.get("/api/profile/image", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({ image: user.profileImage ? { imagePath: user.profileImage } : null })
  } catch (error) {
    console.error("[v0] Get profile image error:", error)
    return res.status(500).json({ error: "Failed to fetch profile image" })
  }
})

// KYC submission
app.post("/api/kyc/submit", verifyToken, upload.fields([
  { name: "idFront", maxCount: 1 },
  { name: "idBack", maxCount: 1 },
  { name: "selfie", maxCount: 1 }
]), async (req, res) => {
  try {
    const { fullName, dob, idType } = req.body
    const files = req.files || {}

    if (!fullName || !dob || !idType) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (!files.idFront || !files.idBack || !files.selfie) {
      return res.status(400).json({ error: "Missing required documents" })
    }

    const db = await getDB()
    const user = db.users.find((u) => u.id === req.user.id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.kycStatus === "submitted") {
      return res.status(400).json({ error: "KYC already submitted and pending review" })
    }

    // Save uploaded files
    const saveFile = (fileData, prefix) => {
      const fileName = `${req.user.id}-${prefix}-${Date.now()}-${fileData.originalname}`
      const filePath = `/uploads/${fileName}`
      const fullPath = path.join(uploadsDir, fileName)
      fsSync.writeFileSync(fullPath, fileData.buffer)
      return filePath
    }

    user.kyc = {
      fullName,
      dob,
      idType,
      idFront: saveFile(files.idFront[0], "front"),
      idBack: saveFile(files.idBack[0], "back"),
      selfie: saveFile(files.selfie[0], "selfie"),
      submittedAt: new Date().toISOString(),
      verified: false,
    }

    user.kycStatus = "submitted"
    user.kycVerified = false

    await saveDB(db)
    console.log("[v0] KYC submitted for user:", req.user.id)

    return res.json({ message: "KYC submitted successfully", kycStatus: "submitted" })
  } catch (error) {
    console.error("[v0] KYC submission error:", error)
    return res.status(500).json({ error: "KYC submission failed" })
  }
})

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Demo admin credentials (change in production)
    if (email === "admin@example.com" && password === "password123") {
      const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "7d" })
      return res.json({ token, role: "admin" })
    }

    if (email === "superadmin@example.com" && password === "password123") {
      const token = jwt.sign({ role: "superadmin", email }, JWT_SECRET, { expiresIn: "7d" })
      return res.json({ token, role: "superadmin" })
    }

    return res.status(401).json({ error: "Invalid credentials" })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return res.status(500).json({ error: "Login failed" })
  }
})

// Get dashboard stats
app.get("/api/admin/dashboard", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const totalUsers = db.users.length
    const emailVerified = db.users.filter((u) => u.emailVerified).length
    const kycPending = db.users.filter((u) => u.kycStatus === "submitted").length

    return res.json({ totalUsers, emailVerified, kycPending })
  } catch (error) {
    console.error("[v0] Dashboard stats error:", error)
    return res.status(500).json({ error: "Failed to fetch stats" })
  }
})

// Get all KYC requests
app.get("/api/admin/kyc-requests", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const kycRequests = db.users
      .filter((u) => u.kyc)
      .map((u) => ({
        userId: u.id,
        fullName: u.kyc.fullName,
        dob: u.kyc.dob,
        idType: u.kyc.idType,
        idFrontPath: u.kyc.idFront,
        idBackPath: u.kyc.idBack,
        selfiePath: u.kyc.selfie,
        submittedAt: u.kyc.submittedAt,
        status: u.kycStatus === "verified" ? "verified" : u.kycStatus === "submitted" ? "pending" : "rejected",
      }))

    return res.json(kycRequests)
  } catch (error) {
    console.error("[v0] KYC requests error:", error)
    return res.status(500).json({ error: "Failed to fetch requests" })
  }
})

// Approve KYC
app.post("/api/admin/kyc/:userId/approve", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params
    const db = await getDB()
    const user = db.users.find((u) => u.id === userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    user.kycVerified = true
    user.kycStatus = "verified"
    if (user.kyc) {
      user.kyc.verifiedAt = new Date().toISOString()
      user.kyc.verifiedBy = "admin"
    }

    await saveDB(db)
    console.log("[v0] KYC approved for user:", userId)

    return res.json({ message: "KYC approved" })
  } catch (error) {
    console.error("[v0] KYC approval error:", error)
    return res.status(500).json({ error: "Approval failed" })
  }
})

// Reject KYC
app.post("/api/admin/kyc/:userId/reject", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params
    const { reason } = req.body
    const db = await getDB()
    const user = db.users.find((u) => u.id === userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    user.kycVerified = false
    user.kycStatus = "rejected"
    if (user.kyc) {
      user.kyc.rejectionReason = reason
    }

    await saveDB(db)
    console.log("[v0] KYC rejected for user:", userId)

    return res.json({ message: "KYC rejected" })
  } catch (error) {
    console.error("[v0] KYC rejection error:", error)
    return res.status(500).json({ error: "Rejection failed" })
  }
})

// Get analytics
app.get("/api/admin/analytics", verifyToken, async (req, res) => {
  try {
    const db = await getDB()
    const totalUsers = db.users.length
    const emailVerified = db.users.filter((u) => u.emailVerified).length
    const kycVerified = db.users.filter((u) => u.kycVerified).length
    const kycPending = db.users.filter((u) => u.kycStatus === "submitted").length

    const registrationByCountry = {}
    db.users.forEach((u) => {
      if (u.country) {
        registrationByCountry[u.country] = (registrationByCountry[u.country] || 0) + 1
      }
    })

    return res.json({
      totalUsers,
      emailVerified,
      kycVerified,
      kycPending,
      registrationByCountry,
    })
  } catch (error) {
    console.error("[v0] Analytics error:", error)
    return res.status(500).json({ error: "Failed to fetch analytics" })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
  console.log(`[v0] API available at http://localhost:${PORT}/api`)
})
