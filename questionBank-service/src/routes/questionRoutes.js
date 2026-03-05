const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// 1. Static routes go FIRST
router.get('/', questionController.getAllQuestions);
router.post('/add', questionController.addQuestion); // Move this up!

//topic table api
router.get('/topics', questionController.getAllTopics);
router.post('/topics', questionController.addTopic);

// 2. Dynamic/Parameter routes go LAST
router.get('/:questionId', questionController.getQuestionById);

module.exports = router;