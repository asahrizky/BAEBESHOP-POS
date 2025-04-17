const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Process new sale
router.post("/", (req, res) => {
  const { product_id, buyer_name, quantity, total_price } = req.body;

  db.serialize(() => {
    // Mulai transaction
    db.run("BEGIN TRANSACTION");

    // 1. Kurangi stok produk
    db.run(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, product_id],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(400).json({ error: err.message });
        }
      }
    );

    // 2. Catat penjualan
    db.run(
      `INSERT INTO sales (product_id, buyer_name, quantity, total_price) 
       VALUES (?, ?, ?, ?)`,
      [product_id, buyer_name, quantity, total_price],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(400).json({ error: err.message });
        }
      }
    );

    // Commit transaction jika semua berhasil
    db.run("COMMIT", (err) => {
      if (err) {
        return res.status(500).json({ error: "Transaction failed" });
      }
      res.json({ message: "Sale processed successfully" });
    });
  });
});

// Get sales report
router.get("/report", (req, res) => {
  const { date } = req.query;

  db.all(
    `SELECT s.*, p.name as product_name 
     FROM sales s
     JOIN products p ON s.product_id = p.id
     WHERE date(s.sale_date) = date(?)`,
    [date],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
