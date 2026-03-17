const db = require('../config/db');

/**
 * GET /api/questions/topics
 * 
 * Returns all available topic names from the "topic" table.
 */
exports.getAllTopics = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM topic');
    res.status(200).json({
      data: rows
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/questions/topics
 * 
 * Body: { name }
 *
 * Adds a new topics to the "topic" table.
 * Ensures the topic name is unique.
 */
exports.addTopic = async (req, res) => {
  const { topicName } = req.body;

  try {
    const [result] = await db.execute('INSERT INTO topic (name) VALUES (?)', [topicName]);
    res.status(201).json({
      message: 'Topic added successfully',
      id: result.insertId,
      name: topicName
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Topic name already exists' 
      });
    }

    console.error('Error adding topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/questions/topics/:id (restricted)
 * 
 * Deletes a topic from the "topic" table based on its ID.
 * Ensure that there are no questions associated with the topic before deletion to maintain data integrity.
 */
exports.deleteTopic = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there are questions associated with the topic
    const [questions] = await db.execute('SELECT COUNT(*) AS count FROM question WHERE topic_id = ?', [id]);

    if (questions[0].count > 0) {
      return res.status(400).json({ error: 'Error deleting topic: Please delete questions associated with this topic first' });
    }

    // If no questions are associated, delete the topic
    await db.execute('DELETE FROM topic WHERE id = ?', [id]);
    res.status(200).json({
      message: 'Topic deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllTopics,
  addTopic
};