const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getHistory, createHistory, deleteHistory } = require('../controllers/questionHistoryController');

// GET /question_history — fetch authenticated user's question history
// Supports query params: limit, offset, sort, order, search, attemptStatus
router.get('/', authMiddleware, getHistory);

// POST /question_history — create a new question history entry for the authenticated user
router.post('/', authMiddleware, createHistory);

// DELETE /question_history — delete question history entry for the authenticated user
router.delete('/:questionId', authMiddleware, deleteHistory);
module.exports = router;