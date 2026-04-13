function isValidDifficulty(difficulty) {
  return typeof difficulty === 'string' && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase());
}
function isValidTopics(topics) {
  return Array.isArray(topics) && topics.length > 0 &&
    topics.every(t => typeof t === 'number' && Number.isInteger(t) && t > 0);
}

module.exports = { isValidDifficulty, isValidTopics };
