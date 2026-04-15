const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 *
 * Body: { userName, email, password, role? }
 *
 * Registers a new user.
 * The password is hashed with bcrypt before being stored.
 * Default role is '1' (User).
 */
exports.register = async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'userName, email, and password are required.' });
    }

    // Always register as regular user; promotion via /api/admins/create only
    const requestedRole = '1';

    try {
        // check for duplicate email
        const existing = await db.query(
            'SELECT "userId" FROM "user" WHERE LOWER("email") = LOWER($1)',
            [email]
        );
        if (existing.rowCount > 0) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // hash password with bcrypt
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS); // 10 rounds

        // insert user into db
        const result = await db.query(
            `INSERT INTO "user" ("userName", "email", "passwordHash", "role")
             VALUES ($1, LOWER($2), $3, $4)
             RETURNING "userId", "userName", "email", "role", "createdAt"`,
            [userName, email, passwordHash, requestedRole]
        );

        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'User registered successfully.',
            user: {
                userId: newUser.userId,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * Returns a JWT containing userId and role.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const result = await db.query(
            'SELECT "userId", "userName", "email", "passwordHash", "role" FROM "user" WHERE LOWER("email") = LOWER($1)',
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // sign JWT with userId and role, expires in 24 hours
        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.status(200).json({
            message: 'Login successful.',
            user: {
                userId: user.userId,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * POST /api/auth/logout
 *
 * Stateless JWT — the client simply discards the token.
 * This endpoint exists as a conventional hook (e.g. for future token
 * blacklisting or cookie clearing).
 */
exports.logout = async (_req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    return res.status(200).json({ message: 'Logged out successfully.' });
};

module.exports = exports;