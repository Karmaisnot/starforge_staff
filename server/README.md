# StarForge EDU — backend

Real backend (Fastify + Prisma + SQLite, TypeScript) that replaces the frontend's
mock repositories. The teacher web app runs against this for **all** reads and writes —
nothing is demo: lists come from the database, every mutation persists.

## Run it

From `server/`:

```bash
npm install
npm run prisma:migrate     # creates server/prisma/dev.db (SQLite — no infra needed)
npm run db:seed            # seeds one academy, teacher, cohorts, cards, tasks, ...
npm run dev                # API on http://localhost:4000
```

Then start the frontend (repo root):

```bash
cd ..
# .env already sets VITE_USE_MOCK=false (use the real backend)
npm run dev                # app on http://localhost:5173 (proxies /api -> :4000)
```

Open http://localhost:5173. The app auto-establishes a session with the seeded
teacher (no login screen needed):

- **username** `nigora.karimova`  **password** `demo1234`

To go back to offline mock data, set `VITE_USE_MOCK=true` in the root `.env`.

## What's here

- `src/config` — zod-validated env (fail-fast).
- `src/db` — Prisma client factory.
- `src/shared` — domain error hierarchy, password hashing, localized-text helpers.
- `src/http` — Fastify app factory, JWT auth plugin (`request.auth` tenancy context),
  central error handler, route registry.
- `src/modules/<domain>` — per feature: `repository` (Prisma access, set-based
  aggregates — no N+1), `mapper` (row → fixture-shaped DTO), `service` (use-cases,
  tenancy, validation, concurrency), `routes` (Fastify plugin), `schemas` (zod).
- `src/container.ts` — composition root (the only place that wires concretes).
- `prisma/schema.prisma` — 28 tables; localized text stored as `{uz,ru,en}` JSON.
- `prisma/seed.ts` (+ `prisma/seeds/*`) — coherent demo data; every metric the UI
  shows is **computed** from these rows, so counts/attendance/stats are self-consistent.

## Design notes

- **Tenancy:** every tenant-owned row carries `academyId`; the repository layer always
  filters by the authenticated `request.auth` context — client ids are never trusted.
- **Localization:** the backend stores/returns `{uz,ru,en}`; the frontend Http adapters
  resolve to the active locale (mirrors the old mock `deepLocalize`), so the API is
  locale-agnostic and pages are unchanged.
- **AI** is behind an `IAiResponder` port: an offline fallback keeps chat fully working
  with no API key; set `ANTHROPIC_API_KEY` to use a live model.
- **Concurrency:** printer enqueue is serialized in a transaction (at most one `now`
  job per printer); AI usage is decremented transactionally; survey submit is idempotent.
- **Postgres:** swap `provider = "postgresql"` in `schema.prisma` + a Postgres
  `DATABASE_URL` (a ready `docker-compose.yml` with Postgres is included).

## Scripts

`npm run dev | build | start | typecheck | prisma:migrate | db:seed | prisma:reset | test`
