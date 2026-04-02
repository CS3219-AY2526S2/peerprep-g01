const express = require('express');
const router = express.Router();
const { createSession, getSession } = require('../controllers/sessionController');

// POST /api/internal/sessions — create session (called by Matching Service)
router.post('/', createSession);

// GET /api/internal/sessions/:sessionId — get session status
router.get('/:sessionId', getSession);

module.exports = router;
