require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const sessionRoutes = require('./src/routes/sessionRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authMiddleware = require('./src/middleware/authMiddleware');
const roleMiddleware = require('./src/middleware/roleMiddleware');
const { initSocketServer } = require('./src/websocket/socketServer');
const { createRoom } = require('./src/websocket/roomManager');
const db = require('./src/config/db');
const Y = require('yjs');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3004;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost', credentials: true }));
app.use(express.json());

app.use('/api/internal/sessions', sessionRoutes);
app.use('/api/collab', authMiddleware, roleMiddleware, adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'collaboration-service' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

initSocketServer(server);

async function restoreActiveSessions() {
  try {
    const result = await db.query(
      `SELECT * FROM "session" WHERE "status" = $1`,
      ['active']
    );
    for (const session of result.rows) {
      const yjsDoc = new Y.Doc();
      if (session.docState) Y.applyUpdate(yjsDoc, session.docState);
      createRoom(session.roomId, {
        sessionId: session.sessionId,
        questionId: session.questionId,
        question: session.question,
        userOneId: session.userOneId,
        userTwoId: session.userTwoId,
        yjsDoc,
        createdAt: session.createdAt,
      });
    }
    if (result.rows.length > 0) {
      console.log(`Restored ${result.rows.length} active session(s) from DB`);
    }
  } catch (err) {
    console.error('Failed to restore active sessions:', err.message);
  }
}

// Restore active sessions BEFORE the server starts accepting connections
// so reconnecting users never get an empty editor
(async () => {
  await restoreActiveSessions();
  server.listen(PORT, () => console.log(`Collaboration service on port ${PORT}`));
})();
