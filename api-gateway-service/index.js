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
const COLLAB_SERVICE_URL = process.env.COLLAB_SERVICE_URL;
const MATCH_SERVICE_URL = process.env.MATCH_SERVICE_URL;

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

function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
  };
}

function methodRoleMiddleware(req, res, next) {
  const writesMethods = ["POST", "PUT", "DELETE"];
  if (writesMethods.includes(req.method)) {
    return roleMiddleware(["2", "3"])(req, res, next);
  }
  next();
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

// Forward decoded user identity to downstream services via headers
function forwardUserHeaders(proxyReq, req) {
  if (req.user) {
    proxyReq.setHeader("X-User-Id", req.user.userId);
    proxyReq.setHeader("X-User-Role", req.user.role);
  }
}

app.use(
  "/api/users",
  authMiddleware,
  roleMiddleware(["2", "3"]),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/users/" },
    on: { proxyReq: forwardUserHeaders },
  }),
);

app.use(
  "/api/question_history",
  authMiddleware,
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/question_history/" },
    on: { proxyReq: forwardUserHeaders },
  }),
);

app.use(
  "/api/admins",
  express.json(),
  authMiddleware,
  roleMiddleware(["3"]),
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/admins/" },
    on: {
      proxyReq: (proxyReq, req) => {
        forwardUserHeaders(proxyReq, req);
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

app.use(
  "/api/questions",
  authMiddleware,
  methodRoleMiddleware,
  createProxyMiddleware({
    target: QUESTION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/questions/" },
    on: { proxyReq: forwardUserHeaders },
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
    on: { proxyReq: forwardUserHeaders },
  }),
);

app.use(
  "/api/match",
  express.json(),
  authMiddleware,
  createProxyMiddleware({
    target: MATCH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/": "/match/" },
    on: {
      proxyReq: (proxyReq, req) => {
        forwardUserHeaders(proxyReq, req);
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
