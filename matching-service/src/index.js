require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requestMatch, cancelMatch, checkMatchStatus } = require('./handlers/matchingHandler');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.post('/match', requestMatch);
app.delete('/match', cancelMatch);
app.get('/match/status/:userId', checkMatchStatus);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => console.log(`Matching service running on port ${PORT}`));
