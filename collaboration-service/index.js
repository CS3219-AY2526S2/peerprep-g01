require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const sessionRoutes = require('./src/routes/sessionRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const authMiddleware = require('./src/middleware/authMiddleware');
const roleMiddleware = require('./src/middleware/roleMiddleware');
const { initSocketServer } = require('./src/websocket/socketServer');

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

server.listen(PORT, () => console.log(`Collaboration service on port ${PORT}`));
