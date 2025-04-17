const sqlite3 = require("sqlite3").verbose();

// Koneksi ke database (file akan dibuat otomatis jika tidak ada)
const db = new sqlite3.Database("./database/ecommerce.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Buat tabel products jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Buat tabel sales jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      buyer_name TEXT,
      quantity INTEGER,
      total_price REAL,
      sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Contoh data awal (opsional)
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (row.count === 0) {
        db.run(`INSERT INTO products (name, price, stock) VALUES 
                ('Kaos Polos Putih', 120000, 50),
                ('Celana Jeans Hitam', 250000, 30)`);
      }
    });
  });
}

module.exports = db;
