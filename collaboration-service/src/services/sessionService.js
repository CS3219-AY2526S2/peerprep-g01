const db = require('../config/db');
const { getRoom, deleteRoom } = require('../websocket/roomManager');
const { flushDocPersist } = require('./docPersistService');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-app:3001';
const SERVICE_SECRET = process.env.SERVICE_SECRET;

/**
 * End a session: flush doc state, mark completed in DB, write history for both users, clean up room.
 * Called when both users have left (via checkBothLeft in socketServer).
 */
async function endSession(roomId) {
  const room = getRoom(roomId);
  if (!room) return;

  const { sessionId, questionId, userOneId, userTwoId, yjsDoc } = room;

  // 1. Flush final doc state to DB
  if (yjsDoc) {
    await flushDocPersist(roomId, yjsDoc);
  }

  // 2. Mark session as completed
  const now = new Date();
  try {
    await db.query(
      `UPDATE "session" SET "status" = $1, "endedAt" = $2 WHERE "roomId" = $3`,
      ['completed', now, roomId]
    );
  } catch (err) {
    console.error(`[sessionService] Failed to update session status for room ${roomId}:`, err.message);
  }

  // 3. Write question history for both users
  await Promise.allSettled([
    writeHistory(userOneId, questionId, userTwoId, now),
    writeHistory(userTwoId, questionId, userOneId, now),
  ]);

  // 4. Clean up in-memory room
  deleteRoom(roomId);

  console.log(`[sessionService] Session ${sessionId} (room ${roomId}) ended`);
}

/**
 * POST to User Service internal API to record a question history entry.
 */
async function writeHistory(userId, questionId, partnerId, sessionEndAt) {
  if (!SERVICE_SECRET) {
    console.error('[sessionService] SERVICE_SECRET not set — skipping history write');
    return;
  }

  try {
    const res = await fetch(`${USER_SERVICE_URL}/api/internal/question_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Secret': SERVICE_SECRET,
      },
      body: JSON.stringify({
        userId,
        questionId,
        attemptStatus: 'completed',
        partnerId,
        sessionEndAt: sessionEndAt.toISOString(),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[sessionService] History write failed for user ${userId}: ${res.status} ${body}`);
    }
  } catch (err) {
    console.error(`[sessionService] History write error for user ${userId}:`, err.message);
  }
}

module.exports = { endSession };
