---
name: ArriveLink mock-db
description: All app data is in-memory in mock-db.ts — no real PostgreSQL, resets on restart.
---

All data lives in `artifacts/api-server/src/lib/mock-db.ts`. It was copied from `.migration-backup/lib/mock-db.ts` during the Next.js → Vite+Express migration.

**Why:** This is an intentional MVP approach — no real DB setup required to run the app.

**How to apply:** If you see 404s or empty data after adding routes/operators/reviews, remember the server may have restarted and in-memory state was lost. To add persistent data, either add seed entries directly in mock-db.ts arrays, or wire up a real PostgreSQL DB via Drizzle (see `pnpm-workspace` skill).
