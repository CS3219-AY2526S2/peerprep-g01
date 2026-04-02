const db = require('../config/db');

// POST /api/internal/question_history
// Called by other services (Collaboration, Matching) to record a history entry.
const createHistoryInternal = async (req, res) => {
  try {
    const { userId, questionId, attemptStatus, partnerId, sessionEndAt } = req.body;

    if (!userId || !questionId) {
      return res.status(400).json({ success: false, message: 'userId and questionId are required' });
    }

    const validStatuses = ['completed', 'attempted'];
    if (attemptStatus && !validStatuses.includes(attemptStatus)) {
      return res.status(400).json({
        success: false,
        message: `attemptStatus must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const result = await db.query(
      `INSERT INTO "question_history" ("userId", "questionId", "attemptStatus", "partnerId", "sessionEndAt")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "historyId", "userId", "questionId", "attemptStatus", "partnerId", "sessionEndAt"`,
      [
        userId,
        questionId,
        attemptStatus || 'attempted',
        partnerId || null,
        sessionEndAt || new Date(),
      ]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('POST /api/internal/question_history error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/internal/question_history/:userId
// Called by other services to retrieve a user's question history.
const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      limit = 10,
      offset = 0,
      sort = 'sessionEndAt',
      order = 'desc',
    } = req.query;

    const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const sanitizedOffset = Math.max(parseInt(offset) || 0, 0);

    const allowedSortFields = ['sessionEndAt', 'questionId', 'attemptStatus'];
    const sanitizedSort = allowedSortFields.includes(sort) ? sort : 'sessionEndAt';
    const sanitizedOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const dataQuery = `
      SELECT "historyId", "questionId", "attemptStatus", "partnerId", "sessionEndAt"
      FROM "question_history"
      WHERE "userId" = $1
      ORDER BY "${sanitizedSort}" ${sanitizedOrder}
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM "question_history"
      WHERE "userId" = $1
    `;

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQuery, [userId, sanitizedLimit, sanitizedOffset]),
      db.query(countQuery, [userId]),
    ]);

    const total = parseInt(countResult.rows[0].total);

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        limit: sanitizedLimit,
        offset: sanitizedOffset,
        hasMore: sanitizedOffset + sanitizedLimit < total,
      },
    });
  } catch (err) {
    console.error('GET /api/internal/question_history/:userId error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createHistoryInternal, getUserHistory };
