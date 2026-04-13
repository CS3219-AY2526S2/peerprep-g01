# Frontend

React single-page application for PeerPrep. Built with TypeScript, Vite, and Material UI.

## Local Development

```bash
cd frontend
pnpm install
pnpm run dev
```

Runs on **http://localhost:5173** by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API Gateway URL | `http://localhost:3000` |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite dev server with HMR |
| `pnpm run build` | Type-check and build for production |
| `pnpm run preview` | Preview production build locally |
| `pnpm run lint` | Run ESLint |
| `pnpm run test` | Run tests in watch mode (Vitest) |
| `pnpm run test:run` | Run tests once |

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Material UI 7 (MUI)
- Zustand (state management)
- React Router 7
- Monaco Editor (code editor)
- Socket.IO + Y.js (real-time collaboration)
