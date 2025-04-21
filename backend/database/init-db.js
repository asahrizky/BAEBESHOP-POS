const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Buat koneksi ke database
const dbPath = path.join(__dirname, "ecommerce.db");
const db = new sqlite3.Database(dbPath);

// Inisialisasi database
db.serialize(() => {
  // Hapus tabel jika sudah ada
  db.run("DROP TABLE IF EXISTS products");
  db.run("DROP TABLE IF EXISTS sales");

  // Buat tabel products
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      base_price REAL NOT NULL,
      image_url TEXT,
      size_prices TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Buat tabel sales
  db.run(`
    CREATE TABLE sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      buyer_name TEXT,
      quantity INTEGER,
      total_price REAL,
      sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  console.log("Database initialized successfully");
});

// Tutup koneksi database setelah 1 detik
setTimeout(() => {
  db.close();
  process.exit(0);
}, 1000);
