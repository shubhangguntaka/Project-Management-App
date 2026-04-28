require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiKeyAuth = require("./middleware/apiKey");

const app = express();

// CORS — allow React dev server and Vercel deployments
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  credentials: true
}));

app.use(express.json());

// API key authentication
app.use("/api/users", apiKeyAuth);
app.use("/api/tasks", apiKeyAuth);
app.use("/users", apiKeyAuth);
app.use("/tasks", apiKeyAuth);

const connectDB = require("./config/db");

// Establish Database Connection
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Project Management API is running" });
});
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Project Management API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

module.exports = app;