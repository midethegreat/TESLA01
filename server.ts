import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { promises as fs } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || "tesla-investment-secret-key-change-in-production"

const DB_PATH = path.join(__dirname, "data", "db.json")
const UPLOADS_PATH = path.join(__dirname, "public", "uploads")

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL || "*" : "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.use(express.json())

// Database helpers
async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return { users: [], documents: [], profileImages: [] }
  }
}

async function saveDB(db: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Middleware to verify JWT
function verifyToken(req: any, res: any, next: any) {
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

// Routes

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, country } = req.body

    if (!email || !password || !firstName || !lastName || !country) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const db = await getDB()

    if (db.users.some((u: any) => u.email === email)) {
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
      createdAt: new Date().toISOString(),
    }

    db.users.push(newUser)
    await saveDB(db)

    console.log(`[v0] User registered: ${email}`)

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

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const db = await getDB()
    const user = db.users.find((u: any) => u.email === email)

    if (!user) {
      console.log("[v0] Login attempt - user not found:", email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log("[v0] Login attempt - invalid password:", email)
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
    const user = db.users.find((u: any) => u.id === userId)

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
    const user = db.users.find((u: any) => u.id === (req.user as any).id)

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
    })
  } catch (error) {
    console.error("[v0] Get current user error:", error)
    return res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Update profile
app.put("/api/profile", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, country } = req.body

    const db = await getDB()
    const user = db.users.find((u: any) => u.id === (req.user as any).id)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (country) user.country = country

    await saveDB(db)

    console.log("[v0] Profile updated for user:", (req.user as any).id)

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      emailVerified: user.emailVerified,
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
    const userDocuments = (db.documents || []).filter((d: any) => d.userId === (req.user as any).id)
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
    const users = db.users.map((u: any) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      country: u.country,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
    }))
    return res.json(users)
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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, () => {
  console.log(`[v0] Server running on http://localhost:${PORT}`)
  console.log(`[v0] API available at http://localhost:${PORT}/api`)
})
