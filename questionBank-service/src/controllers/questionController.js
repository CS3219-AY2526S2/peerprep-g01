const db = require('../config/db');

exports.getAllQuestions = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    let query = 'SELECT * FROM "question" WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (difficulty) {
      query += ` AND "difficulty" = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }
    if (category) {
      query += ` AND "category" = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ' ORDER BY "questionId"';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const result = await db.query(
      'SELECT * FROM "question" WHERE "questionId" = $1',
      [questionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};
