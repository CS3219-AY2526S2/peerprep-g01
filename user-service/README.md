# User Service

Handles user authentication, profile management, admin operations, and question history tracking. Uses PostgreSQL.

## Local Development

```bash
cd user-service
pnpm install
pnpm run dev
```

Requires a PostgreSQL database. Start one via Docker:

```bash
docker compose up -d user-db
```

Runs on **port 3001** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret for signing/verifying JWTs | — |
| `SERVICE_SECRET` | Shared secret for service-to-service auth | — |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost` |

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/auth/logout` — Logout

### Users
- `GET /api/users/` — List all users
- `GET /api/users/:userId` — Get user by ID
- `PUT /api/users/:userId` — Update user
- `DELETE /api/users/:userId` — Delete user

### Admins
- `POST /api/admins/create` — Create admin account
- `DELETE /api/admins/delete` — Delete admin account

### Question History
- `GET /api/question_history/` — Get authenticated user's history
- `POST /api/question_history/` — Create history entry
- `DELETE /api/question_history/:questionId` — Delete history entry
- `DELETE /api/question_history/by-question/:questionId` — (S2S) Delete all history for a question

### Health
- `GET /health` — Health check
