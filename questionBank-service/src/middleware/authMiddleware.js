/**
 * Lightweight auth middleware that trusts the API Gateway.
 *
 * The gateway verifies the JWT and forwards the decoded identity as
 * X-User-Id / X-User-Role headers. This middleware reads those headers
 * and attaches them to req.user so controllers can use req.user.userId.
 */
const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const role = req.headers["x-user-role"];

  if (userId) {
    req.user = { userId, role };
  }

  next();
};

module.exports = authMiddleware;
