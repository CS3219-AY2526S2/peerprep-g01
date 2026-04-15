const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");

//topic table api
router.get("/topic", topicController.getAllTopics);
router.get("/topic/difficulty", topicController.getAllTopicsWithDifficulty);
router.post("/topic", topicController.addTopic);
router.delete("/topic/:id", topicController.deleteTopic);

module.exports = router;
