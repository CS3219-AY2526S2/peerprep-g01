function isValidDifficulty(difficulty) {
  return typeof difficulty === 'string' && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase());
}
function isValidTopic(topic) {
  return typeof topic === 'number' && Number.isInteger(topic) && topic > 0
}

module.exports = { isValidDifficulty, isValidTopic };
