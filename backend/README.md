# PREGO Backend

Node.js + Express + MongoDB (Mongoose) API for the PREGO antenatal app, written
in TypeScript. Full architecture, RBAC matrix, and hospital-integration design
live in the **PREGO 2.0 Notion doc** (Phases 2, 3, 5, 6) — this README is just
the "how do I run this" quick reference.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT secrets, etc.
docker compose up -d   # starts local Redis for rate limiting
npm run dev             # ts-node-dev, auto-restarts on save
npm run typecheck       # or: npx tsc --noEmit
npm run build           # compiles to dist/ for production (npm start runs the compiled output)
```

Every model exports both the Mongoose model and its TypeScript interface
(e.g. `models/User.ts` exports `default User` and `interface IUser`) — import
the interface anywhere you need to type a document shape without importing
the whole model.

Generate strong JWT secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## What's actually wired up vs. stubbed

**Working end-to-end:** `/health`, `/auth/signup`, `/auth/login`, `/patients/me`
(with authenticate + authorize middleware enforced).

**Stubbed, follow the pattern in `patients.routes.js`:** refresh-token
persistence/rotation, logs, hospitals, links, appointments, chat, media,
admin/audit routes. Each new module should live in its own
`src/modules/<name>/` folder with `.routes.js`, `.controller.js`,
`.validators.js` — copy the `auth/` or `patients/` folder as a template.

## Non-negotiables as you build more routes

1. Every mutating route gets a Zod schema in `validateRequest`.
2. Every route touching patient data checks `req.user.id` against the actual
   owner of the record — never trust an `:id` param alone (IDOR).
3. Anything sensitive (chat bodies, emergency contact) goes through
   `utils/fieldEncryption.js` (create this file when you build the chat
   module — AES-256-GCM with a key from your secrets manager, not `.env` in prod).
4. New write routes to patient clinical data should call `auditLogger` too.

## Next files to build, in order

1. `utils/fieldEncryption.ts` (AES-256-GCM helper)
2. `modules/logs/` (symptoms, weight — copy the `patients` pattern)
3. `modules/hospitals/` + `modules/hospital-connector/` (Phase 3 in Notion —
   this is the isolated module that talks to a hospital's own gateway,
   keep it separate from everything else so its blast radius stays small)
4. `modules/appointments/`
5. `modules/chat/` + Socket.IO wiring in `server.ts`
6. `modules/media/` (S3 signed URL generation only — never proxy file bytes through your API)
