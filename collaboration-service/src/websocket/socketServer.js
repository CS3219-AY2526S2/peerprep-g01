const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { getRoom, addUser, setUserStatus } = require('./roomManager');

const RECONNECT_TIMEOUT_MS = 30 * 1000;

// Pending reconnect timers: userId → timeoutId
const reconnectTimers = new Map();

function initSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost',
      credentials: true,
    },
  });

  // Verify JWT before allowing connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized: no token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Unauthorized: invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = socket;
    const { roomId } = socket.handshake.query;

    // Room must exist
    const room = getRoom(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      socket.disconnect();
      return;
    }

    // User must be a participant
    if (userId !== room.userOneId && userId !== room.userTwoId) {
      socket.emit('error', { message: 'Forbidden: not a participant in this room' });
      socket.disconnect();
      return;
    }

    // Cancel any pending disconnect timer (reconnect case)
    if (reconnectTimers.has(userId)) {
      clearTimeout(reconnectTimers.get(userId));
      reconnectTimers.delete(userId);
    }

    addUser(roomId, userId, socket.id);
    socket.join(roomId);

    // Send question data to the joining user
    socket.emit('question', room.question);

    // Notify partner
    socket.to(roomId).emit('partner_joined', { userId });

    // User explicitly leaves the session
    socket.on('leave_session', () => {
      setUserStatus(roomId, userId, 'left');
      socket.to(roomId).emit('partner_left', { userId });
      checkBothLeft(io, roomId);
      socket.leave(roomId);
    });

    // Socket disconnected (tab closed, network drop, etc.)
    socket.on('disconnect', () => {
      const r = getRoom(roomId);
      if (!r) return;

      const entry = r.users.get(userId);
      if (!entry || entry.status !== 'connected') return;

      setUserStatus(roomId, userId, 'disconnected', Date.now());
      socket.to(roomId).emit('partner_disconnected', { userId });

      // Grace period — treat as left if no reconnect within 30s
      const timer = setTimeout(() => {
        reconnectTimers.delete(userId);
        const r2 = getRoom(roomId);
        if (!r2) return;
        const e = r2.users.get(userId);
        if (!e || e.status !== 'disconnected') return;

        setUserStatus(roomId, userId, 'left');
        io.to(roomId).emit('partner_left', { userId });
        checkBothLeft(io, roomId);
      }, RECONNECT_TIMEOUT_MS);

      reconnectTimers.set(userId, timer);
    });
  });

  return io;
}

function checkBothLeft(io, roomId) {
  const room = getRoom(roomId);
  if (!room) return;
  const allLeft = Array.from(room.users.values()).every((u) => u.status === 'left');
  if (allLeft) {
    // TODO PR6: endSession(roomId)
  }
}

module.exports = { initSocketServer };
