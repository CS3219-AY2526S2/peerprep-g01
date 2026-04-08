require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { authMiddleware } = require("./middleware/authMiddleware");
const { roleMiddleware, methodRoleMiddleware } = require("./middleware/roleMiddleware");

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
const COLLAB_SERVICE_URL = process.env.COLLAB_SERVICE_URL;
const MATCH_SERVICE_URL = process.env.MATCH_SERVICE_URL;

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
  roleMiddleware(["2", "3"]),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/users/" },
  }),
);

app.use(
  "/api/question_history",
  authMiddleware,
  roleMiddleware(["2", "3"]),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/question_history/" },
  }),
);

app.use(
  "/api/admins",
  authMiddleware,
  roleMiddleware(["3"]),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/admins/" },
  }),
);

app.use(
  "/api/questions",
  authMiddleware,
  methodRoleMiddleware,
  createProxyMiddleware({
    target: QUESTION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/questions/" },
  }),
);

app.use(
  "/api/collab",
  authMiddleware,
  roleMiddleware(["2", "3"]),
  createProxyMiddleware({
    target: COLLAB_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/collab/" },
  }),
);

app.use(
  "/api/match",
  express.json(),
  authMiddleware,
  createProxyMiddleware({
    target: MATCH_SERVICE_URL, // matching service port
    changeOrigin: true,
    pathRewrite: { "^/": "/match/" },
    on: {
      proxyReq: (proxyReq, req) => {
        console.log("proxyReq fired, req.body:", req.body);
        if (req.body) {
          const body = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(body));
          proxyReq.write(body);
        }
      },
    },
  }),
);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
