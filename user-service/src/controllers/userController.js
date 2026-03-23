const db = require('../config/db');

// GET /users — cursor pagination + sort + search + filter
const getUsers = async (req, res) => {
  try {
    const {
      limit = 10,
      cursor = null,
      sort = 'createdAt',
      order = 'asc',
      search = null,
      role = '1',
    } = req.query;

    const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const allowedSortFields = ['createdAt', 'userName', 'email'];
    const sanitizedSort = allowedSortFields.includes(sort) ? sort : 'createdAt';
    const sanitizedOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const values = [];
    const conditions = [];
    let paramIndex = 1;

    // Role filter
    conditions.push(`"role" = $${paramIndex}`);
    values.push(role);
    paramIndex++;

    // Search
    if (search) {
      conditions.push(`("userName" ILIKE $${paramIndex} OR "email" ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Cursor
    if (cursor) {
      const comparator = sanitizedOrder === 'ASC' ? '>' : '<';
      conditions.push(
        `("${sanitizedSort}", "userId") ${comparator} (SELECT "${sanitizedSort}", "userId" FROM "user" WHERE "userId" = $${paramIndex})`
      );
      values.push(cursor);
      paramIndex++;
    }

    const whereClause = 'WHERE ' + conditions.join(' AND ');

    const query = `
      SELECT "userId", "userName", "email", "role", "createdAt", "modifiedAt"
      FROM "user"
      ${whereClause}
      ORDER BY "${sanitizedSort}" ${sanitizedOrder}, "userId" ${sanitizedOrder}
      LIMIT $${paramIndex}
    `;
    values.push(sanitizedLimit + 1);

    const result = await db.query(query, values);

    const hasMore = result.rows.length > sanitizedLimit;
    const users = hasMore ? result.rows.slice(0, sanitizedLimit) : result.rows;
    const nextCursor = hasMore ? users[users.length - 1].userId : null;

    return res.status(200).json({
      success: true,
      data: users,
      pagination: { nextCursor, hasMore },
    });
  } catch (err) {
    console.error('GET /users error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /user/:id — single user with question history
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await db.query(
      `SELECT "userId", "userName", "email", "role", "createdAt", "modifiedAt"
       FROM "user"
       WHERE "userId" = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userResult.rows[0];

    const historyResult = await db.query(
      `SELECT "historyId", "questionId", "attemptStatus", "partnerId", "sessionEndAt"
       FROM "question_history"
       WHERE "userId" = $1
       ORDER BY "sessionEndAt" DESC`,
      [id]
    );

    user.questionHistory = historyResult.rows;

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('GET /user/:id error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /user/:id — delete user (question_history cascades automatically)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM "user" WHERE "userId" = $1 RETURNING "userId"`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE /user/:id error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/users/question_history/:userId
 * 
 * Returns the question history IDs for a specific user.
 */
const getUserQuestionHistoryId = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(
      `SELECT "questionId"
       FROM "question_history"
       WHERE "userId" = $1
       ORDER BY "sessionEndAt" DESC`,
      [userId]
    );
    return res.status(200).json({
      success: true,
      data: result.rows.map(row => row.questionId).join(','),
    });
  } catch (err) {
    console.error('GET /api/users/question_history/:userId error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { 
  getUsers, 
  getUserById, 
  deleteUser,
  getUserQuestionHistoryId
};