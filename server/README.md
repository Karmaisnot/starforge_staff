# StarForge EDU — backend

Legacy local Fastify/Prisma service used by the original teacher-only prototype.
It remains runnable for backend development, but it is **not** the current Staff
frontend's API: this service exposes `/api/...`, while the supplied production
backend contract consumed by the app is `/api/v1/...`. Do not point the current
frontend proxy at port 4000 without an explicit compatibility adapter.

## Run it

From `server/`:

```bash
npm install
npm run prisma:migrate     # creates server/prisma/dev.db (SQLite — no infra needed)
npm run db:seed            # seeds one academy, teacher, cohorts, cards, tasks, ...
npm run dev                # API on http://localhost:4000
```

The standalone API can be exercised with the seeded teacher credentials:

- **username** `nigora.karimova`  **password** `demo1234`

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

`npm run dev | build | start | typecheck | prisma:migrate | db:seed | prisma:reset`
