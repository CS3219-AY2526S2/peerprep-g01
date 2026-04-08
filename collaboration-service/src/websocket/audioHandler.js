const { getRoom } = require('./roomManager');

/**
 * Get the partner's socketId for a given user in a room.
 * Returns null if partner isn't connected.
 */
function getPartnerSocketId(room, userId) {
  const partnerId = userId === room.userOneId ? room.userTwoId : room.userOneId;
  const entry = room.users.get(partnerId);
  if (!entry || entry.status !== 'connected') return null;
  return entry.socketId;
}

/**
 * Set up audio signaling relay for a connected socket.
 * All events are relayed to the partner's socket — server never processes audio data.
 */
function setupAudioHandler(socket, io, roomId) {
  socket.on('audio-ready', () => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('partner-audio-ready', { userId: socket.userId });
    }
  });

  socket.on('audio-offer', (data) => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('audio-offer', { offer: data.offer, from: socket.userId });
    }
  });

  socket.on('audio-answer', (data) => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('audio-answer', { answer: data.answer, from: socket.userId });
    }
  });

  socket.on('ice-candidate', (data) => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('ice-candidate', { candidate: data.candidate, from: socket.userId });
    }
  });

  socket.on('audio-muted', () => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('partner-audio-muted', { userId: socket.userId });
    }
  });

  socket.on('audio-unmuted', () => {
    const room = getRoom(roomId);
    if (!room) return;
    const partnerSocketId = getPartnerSocketId(room, socket.userId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('partner-audio-unmuted', { userId: socket.userId });
    }
  });
}

module.exports = { setupAudioHandler, getPartnerSocketId };
