const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();

require("dotenv").config();
const { router: authRouter, authMiddleware } = require("./routes/auth");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Public routes
app.use("/api/auth", authRouter);
app.use("/api/products", require("./routes/products"));

// Protected routes
app.use("/api", authMiddleware, routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
