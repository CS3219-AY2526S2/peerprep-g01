const Y = require('yjs');
const db = require('../config/db');

// Debounce timers per roomId — avoid hammering the DB on every keystroke
const timers = new Map();
const DEBOUNCE_MS = 3000;

/**
 * Schedule a debounced save of the Y.Doc state to the DB.
 * Resets the timer on each call, so only flushes after 3s of inactivity.
 */
function scheduleDocPersist(roomId, doc) {
  if (timers.has(roomId)) clearTimeout(timers.get(roomId));

  const timer = setTimeout(async () => {
    timers.delete(roomId);
    try {
      const state = Buffer.from(Y.encodeStateAsUpdate(doc));
      await db.query(
        `UPDATE "session" SET "docState" = $1 WHERE "roomId" = $2`,
        [state, roomId]
      );
    } catch (err) {
      console.error(`[docPersist] Failed to save docState for room ${roomId}:`, err.message);
    }
  }, DEBOUNCE_MS);

  timers.set(roomId, timer);
}

/**
 * Cancel any pending persist for a room (e.g. on session end — do a final flush instead).
 */
function cancelDocPersist(roomId) {
  if (timers.has(roomId)) {
    clearTimeout(timers.get(roomId));
    timers.delete(roomId);
  }
}

/**
 * Immediately flush doc state to DB (call on session end, before deleteRoom).
 */
async function flushDocPersist(roomId, doc) {
  cancelDocPersist(roomId);
  try {
    const state = Buffer.from(Y.encodeStateAsUpdate(doc));
    await db.query(
      `UPDATE "session" SET "docState" = $1 WHERE "roomId" = $2`,
      [state, roomId]
    );
  } catch (err) {
    console.error(`[docPersist] Failed to flush docState for room ${roomId}:`, err.message);
  }
}

module.exports = { scheduleDocPersist, cancelDocPersist, flushDocPersist };
