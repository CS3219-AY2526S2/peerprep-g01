const express = require('express');
const router = express.Router();
const serviceAuthMiddleware = require('../middleware/serviceAuthMiddleware');
const { getUsers, getUserById, deleteUser, getUserQuestionHistoryId } = require('../controllers/userController');

// Role checks are enforced by the API Gateway before requests reach here.

// GET /api/users — list users with pagination
router.get('/', getUsers);

// GET /api/users/:id — single user with question history
router.get('/:id', getUserById);

// DELETE /api/users/:id — admin only (enforced at gateway)
router.delete('/:id', deleteUser);

// GET /api/users/question_history/:userId — get IDs of user's question history
router.get('/question_history/:userId', serviceAuthMiddleware, getUserQuestionHistoryId);

module.exports = router;