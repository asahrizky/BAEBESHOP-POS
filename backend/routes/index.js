const express = require("express");
const router = express.Router();

// Import semua routes
const productRoutes = require("./products");
const salesRoutes = require("./sales");

// Gabungkan routes
router.use("/products", productRoutes);
router.use("/sales", salesRoutes);

module.exports = router;
