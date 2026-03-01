const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminOnlyMiddleware = require('../middleware/roleMiddleware');
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');

// All user routes require authentication
router.use(authMiddleware);

// GET /api/users — list users with pagination
router.get('/', getUsers);

// GET /api/users/:id — single user with question history
router.get('/:id', getUserById);

// DELETE /api/users/:id — admin only
router.delete('/:id', adminOnlyMiddleware, deleteUser);

module.exports = router;