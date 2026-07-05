# ArriveLink

Nigerian bus travel comparison platform. Travelers search routes, compare bus companies side-by-side, and unlock direct WhatsApp contact with a company rep for ₦200.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/arrivelink run dev` — run the frontend (port 20190)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter (routing) + TanStack Query + Tailwind CSS v4 + shadcn/ui
- API: Express 5 (port 8080)
- Data: In-memory mock-db (`artifacts/api-server/src/lib/mock-db.ts`) — no real PostgreSQL
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks (from codegen)
- `lib/api-zod/src/generated/` — generated Zod schemas (from codegen)
- `artifacts/api-server/src/lib/mock-db.ts` — in-memory data store + all DB logic
- `artifacts/api-server/src/routes/` — Express route handlers (cities, companies, routes, reviews, unlocks, operator, admin)
- `artifacts/arrivelink/src/pages/` — React page components (home, search, company, operator-login, operator-dashboard, admin)
- `artifacts/arrivelink/src/components/` — shared components (layout, star-rating, unlock-contact-modal)
- `artifacts/arrivelink/src/index.css` — CSS theme (green primary hsl(151 100% 21%), yellow secondary hsl(43 100% 50%))

## Architecture decisions

- **No real database** — all data lives in `mock-db.ts` in-memory arrays; resets on server restart. Intentional for the MVP.
- **OpenAPI-first** — all API contracts are in `openapi.yaml`; hooks and Zod schemas are generated, never hand-written.
- **Operator auth** — simple JWT-like token stored in `localStorage`; passed as `Authorization: Bearer <token>` header.
- **Admin auth** — single admin secret passed as `x-admin-secret` header; stored in `sessionStorage`.
- **Unlock flow** — test mode by default (no Paystack key); `initiateUnlock` returns `test_mode: true` which shows a "Simulate Payment" button. Add `PAYSTACK_SECRET_KEY` env var for real payments.

## Product

- **Home** (`/`) — city search, popular routes, featured companies, platform stats, how-it-works
- **Search** (`/search?from=1&to=2`) — route comparison cards with price, times, terminal, ratings, unlock button
- **Company** (`/company/:id`) — tabs: routes & pricing, about, traveler reviews + write-a-review form
- **Operator Login** (`/operator/login`) — tabs: login + create account (needs invite code from admin)
- **Operator Dashboard** (`/operator/dashboard`) — manage company profile (tagline, about, WhatsApp/phone), add/edit/delete routes
- **Admin** (`/admin`) — password-gated (secret), stats overview, manage unlocks/companies/operators

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After editing `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before touching frontend code.
- The mock-db resets on server restart — all created operators, reviews, and unlocks are lost.
- Operator invite codes are set via the Admin panel; default mock data has invite codes pre-set on each company.
- For real Paystack payments, set `PAYSTACK_SECRET_KEY` in environment secrets.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
