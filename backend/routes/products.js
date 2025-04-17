const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all products
router.get("/", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add new product
router.post("/", (req, res) => {
  const { name, price, stock } = req.body;
  db.run(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [name, price, stock],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Update product
router.put("/:id", (req, res) => {
  const { name, price, stock } = req.body;
  db.run(
    "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?",
    [name, price, stock, req.params.id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Delete product
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
