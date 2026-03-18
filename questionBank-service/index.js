require('dotenv').config();
const express = require('express');
const questionRoutes = require('./src/routes/questionRoutes');
const topicRoutes = require('./src/routes/topicRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.use('/api/questions', topicRoutes);
app.use('/api/questions', questionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'questionbank-service' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => console.log(`Question bank service on port ${PORT}`));
