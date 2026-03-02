# Question Bank Microservice

Question bank microservice for PeerPrep. Uses PostgreSQL with init.sql for schema and sample data.

## Setup

### 1. Install dependencies
```bash
cd questionBank-service
npm install
```

### 2. Start the database (PostgreSQL on port 5433)
```bash
docker compose up -d
```

This runs `init.sql` to create the `question` table and seed sample questions.

### 3. Configure environment
Create `.env` in the project root (or copy from `.env.example`):
```
PORT=3002
DATABASE_URL=postgresql://postgres:password123@localhost:5433/peerprep_question_db
```

### 4. Run the service
```bash
npm run dev
```

The service runs on **port 3002** by default.

## API Endpoints

- `GET /health` - Health check
- `GET /api/questions` - List all questions (optional query: `?difficulty=easy&category=Array`)
- `GET /api/questions/:questionId` - Get question by ID (e.g. Q-0001)

## Running alongside user-service

- **User service**: port 3001, DB on 5432 (peerprep_db)
- **Question bank**: port 3002, DB on 5432 (peerprep_question_db)
