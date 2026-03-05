const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Static routes first
router.get('/', questionController.getAllQuestions);
router.post('/add', questionController.addQuestion);

// Dynamic/parameter routes last
router.get('/:questionId', questionController.getQuestionById);
router.put('/:questionId', questionController.updateQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;