import express from "express"
import mysql from "mysql2"
import cors from "cors"
import session from "express-session"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import partsRoutes from "./routes/partsRoutes.js"
import salesRoutes from "./routes/salesRoutes.js"
import bodyParser from "body-parser"
import path from "path"

dotenv.config()

const app = express()

// 🔹 CORS Configuration (Corrected)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies/session data
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// 🔹 Middleware (Ensuring JSON and URL parsing work before routes)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))

// 🔹 Session Configuration
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  }),
)

// 🔹 Serve static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

// 🔹 Database Connection (MySQL Pool)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "motorcycle_parts_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// 🔹 Check Database Connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message)
    return
  }
  console.log("✅ Connected to MySQL database")
  connection.release()
})

// Add this route to check the database structure
app.get("/api/check-db-structure", async (req, res) => {
  try {
    // Check sales table structure
    const [salesTable] = await db.promise().query("DESCRIBE sales")

    // Check sale_items table structure
    const [saleItemsTable] = await db.promise().query("DESCRIBE sale_items")

    // Get a sample of data
    const [salesSample] = await db.promise().query("SELECT * FROM sales LIMIT 3")
    const [saleItemsSample] = await db.promise().query("SELECT * FROM sale_items LIMIT 5")

    res.json({
      salesTableStructure: salesTable,
      saleItemsTableStructure: saleItemsTable,
      salesSample,
      saleItemsSample,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🔹 Routes (Placed after middleware setup)
app.use("/api/auth", authRoutes)
app.use("/api/parts", partsRoutes)
app.use("/api/sales", salesRoutes) // ✅ Moved here to ensure it follows middleware

// 🔹 Client Authentication API Endpoints

// 🔸 Client Registration
app.post("/api/client/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    db.query("SELECT * FROM clients WHERE email = ?", [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      db.query(
        "INSERT INTO clients (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) throw err
          res.status(201).json({ message: "Client registered successfully" })
        },
      )
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// 🔸 Client Login
app.post("/api/client/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  db.query("SELECT * FROM clients WHERE email = ?", [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const client = results[0]

    const isMatch = await bcrypt.compare(password, client.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    req.session.client = { id: client.id, name: client.name, email: client.email }
    res.json({ message: "Login successful", client: req.session.client })
  })
})

// 🔸 Client Logout
app.post("/api/client/logout", (req, res) => {
  req.session.destroy()
  res.json({ message: "Logged out successfully" })
})

// 🔹 Start Server
const PORT = 5010
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

export { db }

