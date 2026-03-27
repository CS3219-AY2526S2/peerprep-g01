const db = require('../config/db');
const { getRoom, getConnectedCount } = require('../websocket/roomManager');

/**
 * GET /api/collab/rooms
 * Admin only. Lists all active sessions, enriched with live connected user count.
 */
const listActiveRooms = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM "session" WHERE "status" = $1 ORDER BY "createdAt" DESC`,
      ['active']
    );

    const sessions = result.rows.map((session) => ({
      ...session,
      connectedUsers: getConnectedCount(session.roomId),
    }));

    return res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    console.error('GET /api/collab/rooms error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/collab/rooms/:roomId
 * Admin only. Returns a single session by roomId, enriched with live connected user count.
 */
const getRoomDetail = async (req, res) => {
  const { roomId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM "session" WHERE "roomId" = $1`,
      [roomId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const session = result.rows[0];
    const room = getRoom(roomId);
    const connectedUsers = room ? getConnectedCount(roomId) : 0;

    return res.status(200).json({
      success: true,
      data: { ...session, connectedUsers },
    });
  } catch (err) {
    console.error('GET /api/collab/rooms/:roomId error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { listActiveRooms, getRoomDetail };
