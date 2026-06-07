# Clario Internal Intelligence Dashboard

Internal operating system for discovering public contract technology roles, scoring partnership opportunities, and moving leads into outreach.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

To use live Greenhouse/Lever/Ashby connector calls, run the API proxy in a second terminal:

```bash
npm run api
```

Then log in as `Employee`, open `Settings / Sources`, and run a connector with a public board token/company slug.

Examples:

- Greenhouse: `stripe`
- Lever: `netflix`
- Ashby: `ashby`

## Internal workflow

1. On Home, choose `Employee`.
2. Log in with any email/password in the mock flow.
3. Use `Clario Ops` to review discovered roles, outreach tasks, staffing leads, direct leads, company intelligence, scripts, and sources.

## Backend/database scaffolding

This repo includes a production-minded Prisma schema in `prisma/schema.prisma` and API route stubs in `server/routes`.

Recommended next steps:

1. Provision PostgreSQL.
2. Copy `.env.example` to `.env`.
3. Install backend dependencies: `prisma`, `@prisma/client`, `express`, `zod`, `bcrypt`, `jsonwebtoken`, and optionally `bullmq`, `ioredis`, `playwright`.
4. Run Prisma migrations and seed demo data.
5. Move mock frontend data into database-backed services.

## Prisma seed

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

The current seed creates an admin user and documents where to wire the demo intelligence data once the backend is connected.

## Compliance

Clario should only collect public business/job information from sources that allow APIs, RSS, CSV import, or normal public browser access. Do not bypass login walls, CAPTCHAs, paywalls, private APIs, LinkedIn restrictions, rate limits, robots.txt, or site terms. Candidate submission requires consent and authorization.
