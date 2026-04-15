const db = require('../config/db');

/**
 * GET /api/questions/topic
 * 
 * Returns all available topic names from the "topic" table.
 */
exports.getAllTopics = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT t."topicId", t."topicName"
       FROM "topic" t
       INNER JOIN "question_bank" q ON t."topicId" = q."topicId"
       ORDER BY t."topicId" ASC`
    );
    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/questions/topic
 * 
 * Body: { name }
 *
 * Adds a new topics to the "topic" table.
 * Ensures the topic name is unique.
 */
exports.addTopic = async (req, res) => {
  const { topicName } = req.body;

  if (!topicName || typeof topicName !== 'string' || !topicName.trim()) {
    return res.status(400).json({ error: 'topicName is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO "topic" ("topicName") VALUES ($1) RETURNING "topicId", "topicName"',
      [topicName.trim()]
    );

    res.status(201).json({
      message: 'Topic added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Topic name already exists' 
      });
    }

    console.error('Error adding topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/questions/topic/:id (restricted)
 * 
 * Deletes a topic from the "topic" table based on its ID.
 * Ensure that there are no questions associated with the topic before deletion to maintain data integrity.
 */
exports.deleteTopic = async (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ error: 'Valid topic id is required' });
  }

  try {
    // Check if there are questions associated with the topic
    const questions = await db.query(
      'SELECT COUNT(*)::int AS count FROM "question_bank" WHERE "topicId" = $1',
      [id]
    );

    if (questions.rows[0].count > 0) {
      return res.status(400).json({ error: 'Error deleting topic: Please delete questions associated with this topic first' });
    }

    // If no questions are associated, delete the topic
    const deleted = await db.query(
      'DELETE FROM "topic" WHERE "topicId" = $1 RETURNING "topicId"',
      [id]
    );

    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.status(200).json({
      message: 'Topic deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

