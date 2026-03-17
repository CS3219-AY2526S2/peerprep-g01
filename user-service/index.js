require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const questionHistoryRoutes = require("./src/routes/questionHistoryRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost", credentials: true }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/question_history", questionHistoryRoutes);
app.use("/api/admins", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => console.log(`User service on port ${PORT}`));
