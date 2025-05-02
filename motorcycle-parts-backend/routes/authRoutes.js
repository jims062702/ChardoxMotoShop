import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../server.js"; 

const router = express.Router();

// 🔹 Client Registration
router.post("/client/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    db.query("SELECT * FROM clients WHERE email = ?", [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query("INSERT INTO clients (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword], 
        (err, result) => {
          if (err) throw err;
          res.status(201).json({ message: "Client registered successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/client-session", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});


// 🔹 Client Login
router.post("/client-login", async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM clients WHERE email = ?";
  
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.json({ success: false, message: "User not found" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.json({ success: false, message: "Incorrect password" });

    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.json({ success: true, user: req.session.user });
  });
});


// admin side
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully!" });
    }
  );
});


router.post("/register-admin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(400).json({ error: "Admin email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Admin registered successfully!" });
    });
  });
});



router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    
    req.session.user = { id: user.id, email: user.email };
    
    res.json({ message: "Login successful", user: req.session.user });
  });
});

// admin logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid"); 
    res.json({ message: "Logged out successfully" });
  });
});

// 🔹 Client Logout
router.post("/client/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});


export default router;
