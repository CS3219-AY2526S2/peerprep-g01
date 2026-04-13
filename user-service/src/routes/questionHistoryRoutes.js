const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const serviceAuthMiddleware = require('../middleware/serviceAuthMiddleware');
const { getHistory, createHistory, deleteHistory, deleteHistoryByQuestion } = require('../controllers/questionHistoryController');

// GET /question_history — fetch authenticated user's question history
// Supports query params: limit, offset, sort, order, search, attemptStatus
router.get('/', authMiddleware, getHistory);

// POST /question_history — create a new question history entry for the authenticated user
router.post('/', authMiddleware, createHistory);

// DELETE /question_history — delete question history entry for the authenticated user
router.delete('/:questionId', authMiddleware, deleteHistory);

// DELETE /question_history/by-question/:questionId — internal service-to-service call
// Deletes ALL history entries across ALL users for a given questionId when a question is purged
router.delete('/by-question/:questionId', serviceAuthMiddleware, deleteHistoryByQuestion);

module.exports = router;