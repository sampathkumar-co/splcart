# Prasanth Jewellers · AI Headquarters

> **Read [AGENTS.md](AGENTS.md) first, in every new coding chat.** It is the canonical project vision, decisions, implementation contract, roadmap and handoff. Update it after every milestone.

Standalone Next.js + PostgreSQL Headquarters in the user-chosen [`sampathkumar-co/splcart`](https://github.com/sampathkumar-co/splcart) GitHub repository, which was empty when this app began. **This is NOT the live SPLCART storefront. The systems must never be merged or share data, APIs, authentication, deployments or databases.** The shop is only an optional external product reference and purchase destination. See [HARD SYSTEM BOUNDARY](docs/SYSTEM_BOUNDARY.md).

## Vertical built first

1. Owner opens a Google search in their own browser and chooses an independently hosted public business website.
2. Owner submits up to **three explicit HTTPS pages from the same retailer website** to a single Playwright Chromium browser session. The app records each real tab's source, visible evidence or failure, and persisted run status. It does not automatically scrape Google or crawl arbitrary links. No mass scraping, Google Maps scraping, or authentication bypass.
3. Owner registers a retailer lead from a completed inspection, but **the website visit alone does not verify the business**. The owner must cite 16+ characters of actual captured category-related business evidence to grant website-verification points. Invented excerpts are rejected.
4. Owner registers product links and owner-entered snapshots from public jewellery listings, optionally pointing to SPLCART. These remain `OWNER_ATTESTED` and do not connect to or modify the store.
5. Owner matches products to retailer needs **without mandatory competitor pricing**. An independently sourced comparable price is optional. Scores are deterministic and conservative: unknown delivered prices or material/quantity equivalence never earn verified price-advantage points.
6. Owner records wholesale-intent evidence and approves or rejects leads, then documents permitted manual outreach. Quotes are real persisted standalone HQ drafts, with explicit owner price/availability confirmation, seven-day validity, audit history, and manual copy. No external message is sent. Owner-reported conversions are **never counted as verified revenue**.
7. Owner can pause **new** website research from the Web Discovery desk and resume it with an explicit reason. Every change is recorded in an append-only HQ system audit. This does not cancel a browser session already in progress.
8. The premium four-room 3D office now has **all 16 role workstations**, clickable desk focus and an always-available accessible 2D role panel. States come from actual persisted research work or are labelled ON_DEMAND, MANUAL_ONLY or NOT_CONFIGURED; no simulated personnel.

## Run locally

Requires Node 22+, PostgreSQL 16+, and Chromium dependencies.

```sh
cp .env.example .env
# Provide a DEDICATED HQ PostgreSQL database, a 16+ character owner password
# and a fresh 32+ character HQ_SESSION_SECRET.
# For local development only set HQ_PUBLIC_ORIGIN=http://localhost:3000
npm install
npm run browser:install
npm run db:generate
npm run db:deploy
npm run dev
```

Visit `http://localhost:3000`, then sign in using the **dedicated Headquarters owner login**. Basic authentication has been removed. The signed HttpOnly SameSite=Strict session expires after eight hours. The web app enforces same-origin writes; Postgres rate limits owner login, API actions and browser research. For production, a separate HTTPS `HQ_PUBLIC_ORIGIN`, proper secrets, real egress firewall and backups remain mandatory. **Never reuse SPLCART credentials**.

```sh
npm test
npm run typecheck
npm run build
```

For 3D use, WebGL must be available; the complete 2D view works without it. Research performs **one owner-triggered, up-to-three-tab, same-retailer HTTPS inspection**, not a queue of uncontrolled spiders. Playwright is an optional runtime dependency and will report an explicit failure if Chromium is not installed.


## Separate browser worker and deploy posture

The production web service will not start a Chromium browser in the Next.js process. It delegates to `scripts/browser-worker.ts` in the dedicated `hq-browser` container, which never receives DB or SPLCART credentials. The worker enforces exact host allowlists, robots.txt rules, crawl delays and single active research. Owner requests are rate-limited.

The three-service `compose.hq.yml` is a **deployment scaffold, not a deployed site**. It keeps the database on its own internal network and exposes the web app only on the server's loopback port. Production research remains fail-closed without a token-authenticated browser worker and a verified host-level outbound firewall. Read [SECURITY_AND_DEPLOYMENT.md](docs/SECURITY_AND_DEPLOYMENT.md) before any deployment. Never merge the draft PR or use the SPLCART server/database.

Schema changes are now captured in the dedicated HQ `prisma/migrations` directory. Use `npm run db:deploy` after taking a backup; do not apply destructive schema pushes to persistent data.

A dedicated **HQ-only** backup script is available at `scripts/hq-backup.sh`. GitHub Actions verifies actual `pg_dump` and `pg_restore` into an isolated temporary PostgreSQL database using `scripts/ci-backup-restore.sh`. An encrypted off-host backup plan and target-host recovery test remain separate deployment requirements. The browser policy also forbids automated research against SPLCART domains, though a public SPLCART product link can still appear in the HQ catalogue.

## Real open-source office reuse and quality gates

- Reused the **MIT-licensed Hermes3D camera-navigation pattern** with attribution and copyright retained in [docs/third-party/Hermes3D-LICENSE.txt](docs/third-party/Hermes3D-LICENSE.txt). Added original jewellery-branded architectural geometry and data-driven workstation placement; **the full Hermes3D application has not been imported**. [Foundation audit](docs/GITHUB_FOUNDATIONS.md).
- Real Playwright Chromium UI acceptance test: `scripts/office-e2e.mjs`. Verifies 16 status-linked workstations, 3D canvas, 2D fallback, responsive viewport and browser screenshots. Its canvas pixel-diversity assertion detects an empty WebGL scene.
- GitHub Actions CI also runs the API/PostgreSQL workflow and `scripts/real-browser-smoke.mjs`, an actual two-tab HTTPS visit to neutral IANA `example.com`. **The sample domain is never treated as a business lead.** External networking can make this smoke check fail; inspect its log rather than claiming success.
- The 3D canvas must remain useful on laptop GPUs, and the full sales workflow must remain possible through the 2D controls.
- Every new coding chat must first inspect [AGENTS.md](AGENTS.md), current PR and latest CI; update the chronological handoff after substantive changes.
- Both source-evidence review and quote approval have automated HTTP + PostgreSQL regression checks, and the quote clipboard can be exercised in a real Chromium session. See `tests/source-evidence.test.ts`, `tests/quotation.test.ts`, `scripts/smoke.mjs`, and `scripts/office-e2e.mjs`.

## Known blockers and safety

- **SPLCART storefront integration is explicitly out of scope.** There is no storefront API connection, database access, webhook, checkout change or authorized write. HQ stores only independently owner-entered product references. Verified revenue requires separate trustworthy financial evidence; no paid order reconciliation is implemented.
- No automatic outreach, no Instagram DMs, no promotional calls, no external publishing, no unapproved spending.
- An observed competitor price is **not** a proven comparable wholesale offer. `OWNER_ATTESTED` prices do not qualify for competitive advantage points.
- Public contact details do not grant permission to send messages. Website terms, robots constraints and Indian calling/messaging requirements must be respected.
- The initial app demonstrates a verifiable operator-assisted pipeline, **not** an already-running autonomous 16-agent business.

See [AGENTS.md](AGENTS.md) for the design, completion standard and next milestone.
