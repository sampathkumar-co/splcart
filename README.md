# Prasanth Jewellers · AI Headquarters

> **Read [AGENTS.md](AGENTS.md) first, in every new coding chat.** It is the canonical project vision, decisions, implementation contract, roadmap and handoff. Update it after every milestone.

Standalone Next.js + PostgreSQL Headquarters in the user-chosen [`sampathkumar-co/splcart`](https://github.com/sampathkumar-co/splcart) GitHub repository, which was empty when this app began. **This is NOT the live SPLCART storefront. The systems must never be merged or share data, APIs, authentication, deployments or databases.** The shop is only an optional external product reference and purchase destination. See [HARD SYSTEM BOUNDARY](docs/SYSTEM_BOUNDARY.md).

## Vertical built first

1. Owner opens a Google search in their own browser and chooses an independently hosted public business website.
2. Owner submits up to **three explicit HTTPS pages from the same retailer website** to a single Playwright Chromium browser session. The app records each real tab's source, visible evidence or failure, and persisted run status. It does not automatically scrape Google or crawl arbitrary links. No mass scraping, Google Maps scraping, or authentication bypass.
3. Owner registers a source-backed retailer lead from a completed inspection, or adds an explicitly unverified entry.
4. Owner registers product links and owner-entered snapshots from public jewellery listings, optionally pointing to SPLCART. These remain `OWNER_ATTESTED` and do not connect to or modify the store.
5. Owner matches products to retailer needs **without mandatory competitor pricing**. An independently sourced comparable price is optional. Scores are deterministic and conservative: unknown delivered prices or material/quantity equivalence never earn verified price-advantage points.
6. Owner records wholesale-intent evidence and approves or rejects leads, then documents permitted manual outreach. Quotes are real persisted standalone HQ drafts, with explicit owner price/availability confirmation, seven-day validity, audit history, and manual copy. No external message is sent. Owner-reported conversions are **never counted as verified revenue**.
7. The premium four-room 3D office now has **all 16 role workstations**, clickable desk focus and an always-available accessible 2D role panel. States come from actual persisted research work or are labelled ON_DEMAND, MANUAL_ONLY or NOT_CONFIGURED; no simulated personnel.

## Run locally

Requires Node 22+, PostgreSQL 16+, and Chromium dependencies.

```sh
cp .env.example .env
npm install
npm run browser:install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

Visit `http://localhost:3000`. The app uses a fail-closed owner username/password (HTTP Basic) for initial development. **Deploy behind HTTPS and replace it with production-grade sessions/identity, CSRF and rate-limiting before exposing publicly.** Set a long random owner password and a private database password. No credentials belong in Git.

```sh
npm test
npm run typecheck
npm run build
```

For 3D use, WebGL must be available; the complete 2D view works without it. Research performs **one owner-triggered, up-to-three-tab, same-retailer HTTPS inspection**, not a queue of uncontrolled spiders. Playwright is an optional runtime dependency and will report an explicit failure if Chromium is not installed.

## Real open-source office reuse and quality gates

- Reused the **MIT-licensed Hermes3D camera-navigation pattern** with attribution and copyright retained in [docs/third-party/Hermes3D-LICENSE.txt](docs/third-party/Hermes3D-LICENSE.txt). Added original jewellery-branded architectural geometry and data-driven workstation placement; **the full Hermes3D application has not been imported**. [Foundation audit](docs/GITHUB_FOUNDATIONS.md).
- Real Playwright Chromium UI acceptance test: `scripts/office-e2e.mjs`. Verifies 16 status-linked workstations, 3D canvas, 2D fallback, responsive viewport and browser screenshots. Its canvas pixel-diversity assertion detects an empty WebGL scene.
- GitHub Actions CI also runs the API/PostgreSQL workflow and `scripts/real-browser-smoke.mjs`, an actual two-tab HTTPS visit to neutral IANA `example.com`. **The sample domain is never treated as a business lead.** External networking can make this smoke check fail; inspect its log rather than claiming success.
- The 3D canvas must remain useful on laptop GPUs, and the full sales workflow must remain possible through the 2D controls.
- Every new coding chat must first inspect [AGENTS.md](AGENTS.md), current PR and latest CI; update the chronological handoff after substantive changes.

## Known blockers and safety

- **SPLCART storefront integration is explicitly out of scope.** There is no storefront API connection, database access, webhook, checkout change or authorized write. HQ stores only independently owner-entered product references. Verified revenue requires separate trustworthy financial evidence; no paid order reconciliation is implemented.
- No automatic outreach, no Instagram DMs, no promotional calls, no external publishing, no unapproved spending.
- An observed competitor price is **not** a proven comparable wholesale offer. `OWNER_ATTESTED` prices do not qualify for competitive advantage points.
- Public contact details do not grant permission to send messages. Website terms, robots constraints and Indian calling/messaging requirements must be respected.
- The initial app demonstrates a verifiable operator-assisted pipeline, **not** an already-running autonomous 16-agent business.

See [AGENTS.md](AGENTS.md) for the design, completion standard and next milestone.
