const express = require("express");
const router = express.Router();
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/authUtils");

// Middleware untuk verifikasi token
const authMiddleware = (req, res, next) => {
  try {
    // Cek header Authorization
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("No Authorization header found");
      return res.status(401).json({ error: "Tidak ada token, akses ditolak" });
    }

    // Ekstrak token dari header Authorization
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.log("No token found in Authorization header");
      return res.status(401).json({ error: "Token tidak valid" });
    }

    // Verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-very-secure-secret"
    );

    // Tambahkan user ke request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token sudah kadaluarsa" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token tidak valid" });
    }
    return res.status(401).json({ error: "Gagal memverifikasi token" });
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nama, email, dan password wajib diisi" });
    }

    // Cek email sudah terdaftar
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }
        if (user) {
          return res.status(400).json({ error: "Email sudah terdaftar" });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Simpan user baru
        db.run(
          "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
          [name, email, phone, hashedPassword],
          function (err) {
            if (err) {
              return res.status(500).json({ error: "Gagal mendaftarkan user" });
            }

            // Dapatkan user yang baru dibuat
            db.get(
              "SELECT * FROM users WHERE id = ?",
              [this.lastID],
              (err, newUser) => {
                if (err || !newUser) {
                  return res
                    .status(500)
                    .json({ error: "Gagal mendapatkan data user" });
                }

                // Generate token
                const token = generateToken(newUser);

                // Jangan kembalikan password
                delete newUser.password;

                res.status(201).json({
                  message: "Registrasi berhasil",
                  user: newUser,
                  token,
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi" });
    }

    // Cari user
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Server error" });
        }
        if (!user) {
          return res.status(401).json({ error: "Email atau password salah" });
        }

        // Bandingkan password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Email atau password salah" });
        }

        // Generate token
        const token = generateToken(user);

        // Jangan kembalikan password
        delete user.password;

        res.json({
          message: "Login berhasil",
          user,
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", authMiddleware, (req, res) => {
  try {
    // Di sisi server, kita hanya perlu mengirim response sukses
    // Penanganan token di sisi client akan dilakukan di frontend
    res.json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint untuk verifikasi token
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});

module.exports = { router, authMiddleware };
