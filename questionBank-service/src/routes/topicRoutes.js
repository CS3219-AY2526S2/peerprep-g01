const express = require('express');
const router = express.Router();

const topicController = require('../controllers/topicController');

//topic table api
router.get('/topics', topicController.getAllTopics);
router.post('/topics', topicController.addTopic);

module.exports = router;