const express = require('express');
const router = express.Router();
const serviceAuthMiddleware = require('../middleware/serviceAuthMiddleware');
const { createSession, getSession } = require('../controllers/sessionController');

// POST /api/internal/sessions — create session (called by Matching Service)
router.post('/', serviceAuthMiddleware, createSession);

// GET /api/internal/sessions/:sessionId — get session status
router.get('/:sessionId', getSession);

module.exports = router;
