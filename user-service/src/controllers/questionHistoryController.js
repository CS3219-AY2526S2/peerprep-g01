const db = require('../config/db');

// GET /question_history — get history for the authenticated user
// Supports: pagination (offset), sort, search (by questionId), filter (by attemptStatus)
const getHistory = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      sort = 'sessionEndAt',
      order = 'desc',
      search = null,
      attemptStatus = null,
    } = req.query;

    const userId = req.user.userId;

    const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const sanitizedOffset = Math.max(parseInt(offset) || 0, 0);

    const allowedSortFields = ['sessionEndAt', 'questionId', 'attemptStatus'];
    const sanitizedSort = allowedSortFields.includes(sort) ? sort : 'sessionEndAt';
    const sanitizedOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const values = [];
    const conditions = [];
    let paramIndex = 1;

    // Always filter by the authenticated user
    conditions.push(`"userId" = $${paramIndex}`);
    values.push(userId);
    paramIndex++;

    // Filter by attemptStatus (e.g. 'completed' or 'attempted')
    if (attemptStatus) {
      conditions.push(`"attemptStatus" = $${paramIndex}`);
      values.push(attemptStatus);
      paramIndex++;
    }

    // Search by questionId
    if (search) {
      conditions.push(`"questionId" ILIKE $${paramIndex}`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    // Main data query
    const dataQuery = `
      SELECT "historyId", "questionId", "attemptStatus", "partnerId", "sessionEndAt"
      FROM "question_history"
      ${whereClause}
      ORDER BY "${sanitizedSort}" ${sanitizedOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(sanitizedLimit, sanitizedOffset);

    // Count query for total (reuse same conditions, minus limit/offset)
    const countValues = values.slice(0, paramIndex - 1);
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM "question_history"
      ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQuery, values),
      db.query(countQuery, countValues),
    ]);

    const total = parseInt(countResult.rows[0].total);
    const hasMore = sanitizedOffset + sanitizedLimit < total;

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        limit: sanitizedLimit,
        offset: sanitizedOffset,
        hasMore,
      },
    });
  } catch (err) {
    console.error('GET /question_history error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /question_history — create a new history entry for the authenticated user
const createHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { questionId, attemptStatus, partnerId, sessionEndAt } = req.body;

    // Validate required fields
    if (!questionId) {
      return res.status(400).json({ success: false, message: 'questionId is required' });
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

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error('POST /question_history error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /question_history/:questionId — delete a history entry by questionId for the authenticated user
const deleteHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { questionId } = req.params;

    const result = await db.query(
      `DELETE FROM "question_history"
       WHERE "userId" = $1 AND "questionId" = $2
       RETURNING "historyId"`,
      [userId, questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'History entry not found' });
    }

    return res.status(200).json({ success: true, message: 'History entry deleted successfully' });
  } catch (err) {
    console.error('DELETE /question_history/:questionId error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getHistory, createHistory, deleteHistory };

// DELETE /question_history/by-question/:questionId — internal service-to-service call
// Deletes ALL history entries for a given questionId across ALL users
const deleteHistoryByQuestion = async (req, res) => {
    try {
      const { questionId } = req.params;
  
      await db.query(
        `DELETE FROM "question_history" WHERE "questionId" = $1`,
        [questionId]
      );
  
      return res.status(200).json({
        success: true,
        message: `Question history for questionId ${questionId} deleted successfully`,
      });
    } catch (err) {
      console.error('DELETE /question_history/by-question error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  module.exports = { getHistory, createHistory, deleteHistory, deleteHistoryByQuestion };