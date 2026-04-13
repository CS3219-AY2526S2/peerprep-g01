# API Gateway Service

Central entry point for all client requests. Verifies JWTs, enforces role-based access, and proxies requests to downstream microservices.

## Local Development

```bash
cd api-gateway-service
pnpm install
pnpm run dev
```

Runs on **port 3000** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost` |
| `JWT_SECRET` | Secret for JWT verification | — |
| `USER_SERVICE_URL` | User service base URL | — |
| `QUESTION_SERVICE_URL` | Question bank service base URL | — |
| `MATCH_SERVICE_URL` | Matching service base URL | — |
| `COLLAB_SERVICE_URL` | Collaboration service base URL | — |

## Routes

| Route | Auth | Role | Target Service |
|-------|------|------|---------------|
| `/api/auth/*` | None | Any | User Service |
| `/api/users/*` | JWT | Admin, SuperAdmin | User Service |
| `/api/admins/*` | JWT | SuperAdmin | User Service |
| `/api/question_history/*` | JWT | Admin, SuperAdmin | User Service |
| `/api/questions/*` | JWT | Any (GET), Admin+ (POST/PUT/DELETE) | Question Bank |
| `/api/match/*` | JWT | Any | Matching Service |
| `/api/collab/*` | JWT | Admin, SuperAdmin | Collaboration Service |
| `/health` | None | Any | Local |
