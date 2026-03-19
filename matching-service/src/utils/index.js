function isValidDifficulty(difficulty) {
  return ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase());
}

function isValidTopic(topic) {
  return typeof topic === 'string' && topic.trim().length > 0;
}

module.exports = { isValidDifficulty, isValidTopic };
