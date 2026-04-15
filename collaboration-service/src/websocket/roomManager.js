// In-memory store for active collaboration rooms.
// Keyed by roomId. Populated on session creation, cleaned up on session end.

const Y = require("yjs");
const rooms = new Map();

/**
 * Create a new room entry.
 * @param {string} roomId
 * @param {object} data - { sessionId, questionId, question, userOneId, userTwoId, createdAt }
 */
function createRoom(roomId, data) {
  rooms.set(roomId, {
    sessionId: data.sessionId,
    roomId,
    questionId: data.questionId,
    question: data.question,
    userOneId: data.userOneId,
    userTwoId: data.userTwoId,
    users: new Map(), // userId → { socketId, status, disconnectedAt }
    yjsDoc: data.yjsDoc || new Y.Doc(),
    createdAt: data.createdAt || new Date().toISOString(),
  });
}

/**
 * Get a room by roomId. Returns undefined if not found.
 */
function getRoom(roomId) {
  return rooms.get(roomId);
}

/**
 * Delete a room entry.
 */
function deleteRoom(roomId) {
  const room = rooms.get(roomId);
  if (room && room.yjsDoc) room.yjsDoc.destroy();
  rooms.delete(roomId);
}

/**
 * Get all rooms (for admin listing).
 */
function getAllRooms() {
  return Array.from(rooms.values());
}

/**
 * Add or update a user in a room.
 * @param {string} roomId
 * @param {string} userId
 * @param {string} socketId
 */
function addUser(roomId, userId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.set(userId, {
    socketId,
    status: "connected",
    disconnectedAt: null,
    markAsDone: "attempted",
  });
}

/**
 * Remove a user from a room.
 */
function removeUser(roomId, userId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.delete(userId);
}

/**
 * Set a user's status within a room.
 * @param {string} status - 'connected' | 'disconnected' | 'left'
 */
function setUserStatus(roomId, userId, status, disconnectedAt = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  const user = room.users.get(userId);
  if (!user) return;
  user.status = status;
  user.disconnectedAt = disconnectedAt;
}

/**
 * Get connected user count for a room (for admin view).
 */
function getConnectedCount(roomId) {
  const room = rooms.get(roomId);
  if (!room) return 0;
  let count = 0;
  for (const u of room.users.values()) {
    if (u.status === "connected") count++;
  }
  return count;
}

/**
 * Set a user's completion preference.
 */
function setUserDoneStatus(roomId, userId, isDone) {
  const room = rooms.get(roomId);
  if (!room) return;
  const user = room.users.get(userId);
  if (!user) return;
  user.markAsDone = isDone;
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  getAllRooms,
  addUser,
  removeUser,
  setUserStatus,
  getConnectedCount,
  setUserDoneStatus,
};
