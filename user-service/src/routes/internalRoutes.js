const router = require('express').Router();
const serviceAuthMiddleware = require('../middleware/serviceAuthMiddleware');
const { createHistoryInternal, getUserHistory } = require('../controllers/internalController');

router.post('/question_history', serviceAuthMiddleware, createHistoryInternal);
router.get('/question_history/:userId', serviceAuthMiddleware, getUserHistory);

module.exports = router;
