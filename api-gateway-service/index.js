require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost",
    credentials: true,
  }),
);

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL;

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Invalid or expired token." });
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/auth/" },
  }),
);

app.use(
  "/api/users",
  authMiddleware,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/users/" },
  }),
);

app.use(
  "/api/question_history",
  authMiddleware,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/question_history/" },
  }),
);

app.use(
  "/api/admins",
  authMiddleware,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/admins/" },
  }),
);

app.use(
  "/api/questions",
  authMiddleware,
  createProxyMiddleware({
    target: QUESTION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/questions/" },
  }),
);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
