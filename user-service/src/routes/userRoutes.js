const express = require('express');
const router = express.Router();
// const { authMiddleware } = require('../../../api-gateway-service/middleware/authMiddleware');
const { methodRoleMiddleware } = require('../../../api-gateway-service/middleware/roleMiddleware'); //admin only for writes
const { getUsers, getUserById, deleteUser, getUserQuestionHistoryId } = require('../controllers/userController');

// All user routes require authentication
// router.use(authMiddleware);

// GET /api/users — list users with pagination
router.get('/', getUsers);

// GET /api/users/:id — single user with question history
router.get('/:id', getUserById);

// DELETE /api/users/:id — admin only
router.delete('/:id', methodRoleMiddleware, deleteUser);

// GET /api/users/question_history/:userId — get IDs of user's question history
router.get('/question_history/:userId', getUserQuestionHistoryId);

module.exports = router;