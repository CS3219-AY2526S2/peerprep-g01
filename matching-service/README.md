# Matching Service

Matches users into pairs based on topic and difficulty preferences. Uses Redis sorted sets with Lua scripts for atomic matching operations.

## Local Development

```bash
cd matching-service
pnpm install
pnpm run dev
```

Requires Redis. Start one via Docker:

```bash
docker compose up -d matching-redis
```

Runs on **port 3003** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3003` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `MATCH_TIMEOUT` | Match timeout in ms | `30000` |
| `USER_SERVICE_URL` | User service URL | — |
| `QUESTION_SERVICE_URL` | Question bank service URL | — |
| `COLLAB_SERVICE_URL` | Collaboration service URL | — |
| `SERVICE_SECRET` | Shared secret for S2S auth | — |

## API Endpoints

- `POST /match/find` — Join the matching queue
- `GET /match/poll` — Long-poll for match result
- `DELETE /match/cancel` — Cancel a pending match
- `GET /health` — Health check
