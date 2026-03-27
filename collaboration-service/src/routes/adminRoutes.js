const express = require('express');
const router = express.Router();
const { listActiveRooms, getRoomDetail } = require('../controllers/adminController');

// GET /api/collab/rooms — list all active sessions
router.get('/rooms', listActiveRooms);

// GET /api/collab/rooms/:roomId — get single session detail
router.get('/rooms/:roomId', getRoomDetail);

module.exports = router;
