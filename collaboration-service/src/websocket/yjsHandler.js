const Y = require('yjs');
const { getRoom } = require('./roomManager');

/**
 * Sets up Y.js document sync and awareness relay for a connected socket.
 *
 * Protocol (client must implement the same):
 *   Server → client  'yjs-state'        Uint8Array — full doc state on connect (apply with Y.applyUpdate)
 *   Client → server  'yjs-update'       Uint8Array — incremental update (server applies + broadcasts to partner)
 *   Server → client  'yjs-update'       Uint8Array — broadcast of partner's update
 *   Client → server  'awareness-update' Uint8Array — cursor/presence data (server relays to partner)
 *   Server → client  'awareness-update' Uint8Array — relayed awareness from partner
 */
function setupYjs(socket, roomId) {
  const room = getRoom(roomId);
  if (!room || !room.yjsDoc) return;

  const doc = room.yjsDoc;

  // Send full current state so the joining client is in sync
  socket.emit('yjs-state', Y.encodeStateAsUpdate(doc));

  // Client sends an incremental update — apply to server doc, tagged with this socket's id as origin
  socket.on('yjs-update', (update) => {
    try {
      Y.applyUpdate(doc, new Uint8Array(update), socket.id);
    } catch (err) {
      console.error(`[yjs] Failed to apply update from ${socket.id}:`, err.message);
    }
  });

  // Only broadcast updates that originated from THIS socket (avoids double-broadcast when
  // multiple sockets have listeners on the same shared doc)
  const handleUpdate = (update, origin) => {
    if (origin !== socket.id) return;
    socket.to(roomId).emit('yjs-update', update);
  };
  doc.on('update', handleUpdate);

  // Clean up doc listener on disconnect to avoid stale handlers accumulating
  socket.on('disconnect', () => {
    doc.off('update', handleUpdate);
  });

  // Relay awareness updates (cursor positions, user presence) to partner
  socket.on('awareness-update', (update) => {
    socket.to(roomId).emit('awareness-update', update);
  });
}

module.exports = { setupYjs };
