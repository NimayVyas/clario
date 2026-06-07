# Clario

Clario is a contract-job matching and staffing operations prototype. It has three separate workspaces:

- Candidate workspace for uploading a resume, parsing profile signals, viewing contract matches, and applying to Clario-staffed roles.
- Clario employee workspace for reviewing resumes, managing staffing-company outreach, importing sourcing lists, generating outreach messages, and tracking tasks.
- Recruiter/business workspace for searching screened candidates without exposing candidate-only or internal employee dashboards.

The current app is a production-shaped prototype: the UI, routing, role gates, local API, outreach persistence, CSV import, and public ATS connectors are implemented. Auth, outreach data, job data, candidates, and resume parsing still need a production database/provider before real users should rely on it.

## Run Locally

Install dependencies:

```bash
npm install
```

Run the React app:

```bash
npm run dev -- --host localhost
```

Run the local API in a second terminal:

```bash
npm run api
```

Open:

```text
http://localhost:5173
```

Demo logins:

- Employee: `ops@clario.com` / `clario123`
- Recruiter: `recruiter@example.com` / `clario123`
- Candidate: use any email/password and upload a TXT resume, or use the quick-start mock parser path.

## Pages Created

### Public / Candidate

- `Home`: landing and login page. Candidates upload a resume and create a password. Employees and recruiters use their own login tabs.
- `Matches`: candidate match page showing ranked Clario-staffed contract roles.
- `Jobs`: contract role browser with filters, rate display, job cards/tables, and application actions.
- `Overview`: candidate-facing dashboard metrics.
- `Profile`: candidate settings/profile page.

### Clario Employee

The employee workspace uses one dashboard component with different sections:

- `Dashboard`: outreach and staffing operations summary.
- `Accounts`: staffing-company accounts and target companies.
- `Contacts`: buyer/recruiter contacts attached to accounts.
- `Lead Queue`: prioritized staffing-company outreach targets.
- `Campaigns`: campaign performance and enrollment overview.
- `Tasks`: outreach follow-up task queue.
- `Research`: sourcing pipeline for CSV import and manual company research queues.
- `Messages`: generated email/LinkedIn/follow-up drafts.
- `Analytics`: outreach and sourcing performance charts.
- `Settings`: employee workspace settings.

### Recruiter / Business

- `Recruiter Portal`: simplified candidate search and shortlist workspace. It is intentionally less cluttered than the employee dashboard and does not show candidate-only or internal operations pages.

### Additional Internal Pages

The repo also contains internal intelligence/source components and older scaffold pages:

- `Sources`: public ATS connector runner.
- `Analytics`: role and market analytics.
- `InternalIntelligenceDashboard`: internal role intelligence prototype.
- `EmployeeDashboard`: earlier employee dashboard scaffold.

Not every scaffold page is exposed in the current role navigation.

## APIs In Use

The local API lives in `server/index.mjs` and runs on `http://127.0.0.1:3001`. Vite proxies `/api` requests to that server.

### Health

- `GET /api/health`

Returns local API status.

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/session`
- `POST /api/auth/logout`

This is local JSON-backed demo auth in `server/authStore.mjs`. It supports candidate registration, employee login, recruiter login, session restoration, logout, and role checks. It is not production-grade auth.

### Employee Outreach

Protected by employee role:

- `GET /api/outreach`
- `GET /api/outreach/accounts`
- `POST /api/outreach/accounts`
- `GET /api/outreach/contacts`
- `POST /api/outreach/contacts`
- `GET /api/outreach/tasks`
- `PATCH /api/outreach/tasks/:id`
- `GET /api/outreach/activity`
- `POST /api/outreach/messages/generate`
- `POST /api/outreach/send`

These endpoints are backed by `server/outreachStore.mjs`. They persist local state to `server/data/outreach-state.json`, which is ignored by git.

### Sourcing Pipeline

Protected by employee role:

- `GET /api/sourcing/runs`
- `GET /api/sourcing/providers`
- `POST /api/sourcing/import-csv`
- `POST /api/sourcing/research-queue`

CSV import is the most real part of the sourcing pipeline: it ingests user-provided company/contact rows and creates accounts, contacts, tasks, and run history. Manual research queue creates follow-up research tasks without inventing contacts.

### Public ATS Connectors

Protected by employee role:

- `POST /api/sources/run`
- `GET /api/connectors/:provider/:identifier/jobs`

The connector layer in `server/connectors.mjs` can fetch public job-board data from:

- Greenhouse public job board endpoints
- Lever public postings endpoints
- Ashby public posting API

These connectors fetch public ATS job data when given a real public company board slug/token. They do not scrape private pages, bypass login walls, or submit applications.

## Demo Data vs Production Data

### Demo Data

These are mock/seed/prototype data sources:

- Candidate list in `src/data/mockCandidates.ts`
- Contract job list in `src/data/mockJobs.ts`
- Source list in `src/data/mockSources.ts`
- Outreach seed data in `src/outreach/data/outreachMock.ts`
- Locally generated auth/session state in `server/data/auth-state.json`
- Locally generated outreach state in `server/data/outreach-state.json`
- Resume parsing fallback for PDF/DOCX files, which uses mock parsing instead of extracting real document text
- Generated outreach copy, which is template-based and not AI/provider-backed yet

The staffing companies and contacts in the seed state are placeholders. They are not verified real leads.

### Persistent Local Data

These are real within the local development app, but not production data:

- Candidate auth sessions created through local auth
- Employee outreach accounts/contacts/tasks created through the local API
- CSV-imported sourcing accounts and contacts
- Manual research queue runs
- Outreach activity logged through the app

They persist only in ignored JSON files under `server/data`.

### Production-Capable Data

These flows can work with real input today, but still need production storage and validation:

- CSV import from real Apollo/Clay/Google Sheets/manual exports
- Manual company research queue
- Public ATS connector calls for real Greenhouse, Lever, and Ashby board identifiers
- Candidate role matching using the current local job dataset

### Not Production Yet

The following need real infrastructure before launch:

- Production authentication provider, such as Supabase Auth, Clerk, or Auth0
- PostgreSQL database for users, candidates, resumes, roles, applications, organizations, and outreach
- Secure resume storage, such as Supabase Storage, S3, or Cloudflare R2
- Real PDF/DOCX resume text extraction
- Resume parser service or LLM extraction pipeline
- Recruiter organization permissions and row-level access rules
- Email delivery provider for actual outreach
- Audit logging for employee/recruiter access
- Rate limiting, monitoring, and deployment secrets

## Current Auth Model

The app has working role-based demo auth:

- Candidate users can register locally.
- Employee and recruiter users use seeded credentials.
- The frontend stores a bearer token in localStorage.
- API requests send `Authorization: Bearer <token>`.
- Employee-only APIs reject recruiter/candidate/no-token requests.

This is intended to prove the product flow. For production, replace `server/authStore.mjs` and `src/services/authService.ts` with a managed auth provider and backend JWT verification.

## Recommended Production Stack

Recommended next stack:

- Supabase Auth for free production-level email/password auth
- Supabase Postgres for candidate, recruiter, application, and outreach tables
- Supabase Storage for resumes
- Row Level Security for candidate/recruiter/employee permissions
- Server-side resume parsing worker for PDF/DOCX extraction and profile normalization

Clerk or Auth0 would also work for auth, but Supabase is the cleanest free starting point because Clario needs auth, database, and file storage.

## Compliance

Clario should only collect public business/job information from sources that allow APIs, RSS, CSV import, or normal public browser access. Do not bypass login walls, CAPTCHAs, paywalls, private APIs, LinkedIn restrictions, rate limits, robots.txt, or site terms. Candidate submission requires consent and authorization.
