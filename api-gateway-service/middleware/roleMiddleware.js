
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
exports.roleMiddleware = roleMiddleware;
function methodRoleMiddleware(req, res, next) {
  const writesMethods = ["POST", "PUT", "DELETE"];
  if (writesMethods.includes(req.method)) {
    return roleMiddleware(["2", "3"])(req, res, next);
  }
  next();
}
exports.methodRoleMiddleware = methodRoleMiddleware;
