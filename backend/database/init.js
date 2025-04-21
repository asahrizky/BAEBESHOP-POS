const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Path ke file database
const dbPath = path.join(__dirname, "ecommerce.db");

// Buat koneksi database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

// Baca file schema
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

// Jalankan schema
db.serialize(() => {
  // Drop tabel jika ada
  db.run("DROP TABLE IF EXISTS products", (err) => {
    if (err) {
      console.error("Error dropping table:", err);
      return;
    }
    console.log("Old table dropped");
  });

  // Buat tabel baru
  db.exec(schema, (err) => {
    if (err) {
      console.error("Error executing schema:", err);
      return;
    }
    console.log("New table created successfully");
  });

  // Verifikasi struktur tabel
  db.all("PRAGMA table_info(products)", (err, rows) => {
    if (err) {
      console.error("Error getting table info:", err);
      return;
    }
    console.log("Table structure:");
    rows.forEach((row) => {
      console.log(`- ${row.name} (${row.type})`);
    });
  });
});

// Tutup koneksi database
db.close((err) => {
  if (err) {
    console.error("Error closing database:", err);
    return;
  }
  console.log("Database connection closed");
});
