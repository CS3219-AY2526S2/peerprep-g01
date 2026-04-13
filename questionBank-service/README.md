# Question Bank Service

Manages coding questions and topics. Uses PostgreSQL with `init.sql` for schema and sample data.

## Local Development

```bash
cd questionBank-service
pnpm install
pnpm run dev
```

Requires a PostgreSQL database. Start one via Docker:

```bash
docker compose up -d questionbank-db
```

Runs on **port 3002** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3002` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `USER_SERVICE_URL` | User service URL (for cascade deletes) | — |
| `SERVICE_SECRET` | Shared secret for S2S auth | — |

## API Endpoints

### Questions
- `GET /api/questions/` — List all questions (query: `?difficulty=easy&category=Array`)
- `GET /api/questions/:questionId` — Get question by ID
- `POST /api/questions/add` — Create a question
- `PUT /api/questions/:questionId` — Update a question
- `DELETE /api/questions/:questionId` — Delete a question

### Topics
- `GET /api/questions/topics` — List all topics

### Health
- `GET /health` — Health check
