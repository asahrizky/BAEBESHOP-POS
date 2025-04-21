const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Middleware untuk parsing JSON
router.use(express.json());

// GET /api/products - Get all products
router.get("/", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";
  db.all(sql, [], (err, products) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Gagal mengambil data produk" });
    }

    // Parse size_prices for each product
    const parsedProducts = products.map((product) => {
      try {
        return {
          ...product,
          size_prices: JSON.parse(product.size_prices || "{}"),
        };
      } catch (parseError) {
        console.error("Error parsing size_prices:", parseError);
        return {
          ...product,
          size_prices: {},
        };
      }
    });

    res.json(parsedProducts);
  });
});

// GET /api/products/:id - Get single product
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  db.get(sql, [req.params.id], (err, product) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Gagal mengambil data produk" });
    }

    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    // Parse size_prices
    try {
      const parsedProduct = {
        ...product,
        size_prices: JSON.parse(product.size_prices || "{}"),
      };
      res.json(parsedProduct);
    } catch (parseError) {
      console.error("Error parsing size_prices:", parseError);
      res.json({
        ...product,
        size_prices: {},
      });
    }
  });
});

// POST /api/products - Create new product
router.post("/", (req, res) => {
  const { name, description, price, image_url, size_prices } = req.body;

  // Validasi input
  if (!name || !price) {
    return res.status(400).json({ error: "Nama dan harga produk wajib diisi" });
  }

  // Pastikan price adalah number
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    return res.status(400).json({ error: "Harga harus berupa angka" });
  }

  // Pastikan size_prices adalah string JSON yang valid
  let sizePricesStr;
  try {
    sizePricesStr =
      typeof size_prices === "string"
        ? size_prices
        : JSON.stringify(size_prices || {});
  } catch (error) {
    console.error("Error parsing size_prices:", error);
    sizePricesStr = "{}";
  }

  const sql = `
    INSERT INTO products (name, description, price, image_url, size_prices)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [name, description, numericPrice, image_url, sizePricesStr],
    function (err) {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Gagal membuat produk baru" });
      }

      // Ambil produk yang baru dibuat
      db.get(
        "SELECT * FROM products WHERE id = ?",
        [this.lastID],
        (err, product) => {
          if (err) {
            console.error("Error fetching new product:", err);
            return res
              .status(500)
              .json({ error: "Gagal mengambil data produk" });
          }

          // Parse size_prices
          try {
            product.size_prices = JSON.parse(product.size_prices || "{}");
          } catch (error) {
            console.error("Error parsing size_prices:", error);
            product.size_prices = {};
          }

          res.status(201).json({
            message: "Produk berhasil dibuat",
            product,
          });
        }
      );
    }
  );
});

// PUT /api/products/:id - Update product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?",
      [name, description, price, image_url, id]
    );

    res.json({
      id,
      name,
      description,
      price,
      image_url,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
