const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getQuestionById);

module.exports = router;
