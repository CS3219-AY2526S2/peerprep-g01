const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getAllQuestions);
router.get('/:questionId', questionController.getQuestionById);
router.post('/add', questionController.addQuestion);

module.exports = router;
