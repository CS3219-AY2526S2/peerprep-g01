const adminOnlyMiddleware = (req, res, next) => {
    // Roles: '1' = User, '2' = Admin, '3' = SuperAdmin
    if (req.user.role === '2' || req.user.role === '3') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin rights required.' });
    }
};

module.exports = adminOnlyMiddleware;
