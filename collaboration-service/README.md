# Collaboration Service

Real-time collaborative code editing sessions. Uses Socket.IO for WebSocket communication and Y.js CRDTs for conflict-free document synchronization. Session metadata is stored in PostgreSQL.

## Local Development

```bash
cd collaboration-service
pnpm install
pnpm run dev
```

Requires a PostgreSQL database. Start one via Docker:

```bash
docker compose up -d collab-db
```

Runs on **port 3004** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3004` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for verifying JWTs on WebSocket connections | — |
| `SERVICE_SECRET` | Shared secret for S2S auth | — |
| `USER_SERVICE_URL` | User service URL | — |
| `FRONTEND_URL` | Allowed CORS/Socket.IO origin | `http://localhost` |

## API Endpoints

### REST
- `POST /api/collab/sessions` — Create a new collaboration session
- `GET /api/collab/sessions/:sessionId` — Get session details
- `GET /health` — Health check

### WebSocket (Socket.IO)
- `connection` — Client joins with JWT auth
- `join-session` — Join a collaboration room
- `yjs-update` — Broadcast Y.js document updates
- `disconnect` — Leave session
