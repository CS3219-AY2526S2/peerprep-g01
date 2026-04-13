[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HpD0QZBI)

# CS3219 Project (PeerPrep) - AY2526S2

**Group: G01**

PeerPrep is a collaborative coding interview preparation platform. Students match with peers by topic and difficulty, then solve coding questions together in a real-time collaborative editor.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, MUI 7, Zustand, Monaco Editor, Socket.IO, Y.js |
| Backend | Node.js 20, Express 5 (JavaScript) |
| Databases | PostgreSQL 16 (x3), Redis 7 |
| Infrastructure | Docker Compose, pnpm |

## Architecture

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React SPA |
| API Gateway | 3000 | JWT authentication, routing, role enforcement |
| User Service | 3001 | Auth, profiles, admin management, question history |
| Question Bank Service | 3002 | CRUD questions and topics |
| Matching Service | 3003 | Peer matching via Redis sorted sets |
| Collaboration Service | 3004 | Real-time code editor (Socket.IO + Y.js CRDT) |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Getting Started

```bash
git clone https://github.com/CS3219-AY2526S2/peerprep-g01.git
cd peerprep-g01
docker compose up --build
```

| URL | Description |
|-----|-------------|
| http://localhost | Frontend |
| http://localhost:3000 | API Gateway |
| http://localhost:5050 | pgAdmin (admin@admin.com / admin) |

## Useful Docker Commands

```bash
docker compose up --build       # Build and start all services
docker compose up -d            # Start in background
docker compose down             # Stop all services
docker compose down -v          # Stop all and wipe DB volumes
docker compose logs <service>   # View logs for a service
```

For individual service setup and local development, refer to each service's own README.

## License

[MIT](LICENSE)
