# PRASANTH JEWELLERS AI HEADQUARTERS — CANONICAL PROJECT MEMORY

**Status:** Active engineering contract. Read this entire file before any coding task, in *every* new agent/chat/session. This is the single source of truth for the mission, roadmap, decisions and handoff. Update its `Progress / handoff` section after each completed milestone. **Do not claim a feature exists unless tests and real evidence demonstrate it.**

## Mission and owner intent
Build a high-quality, secure, revenue-generating autonomous AI sales and marketing workforce for **Prasanth Jewellers**, tightly connected to the existing **SPLCART** e-commerce business (`https://splcart.in`, API at `https://api.splcart.in`). Prioritize the first **complete revenue vertical**:

**Compliant Google/Web prospect discovery → independently verified jewellery product matching → evidence-based wholesale lead scoring → owner review → permitted outreach → verified wholesale conversion tracking.**

Design the user experience as a **truly premium, navigable 3D office**, not as a flat dashboard with a decorative model. Rooms: CEO Office, Sales Floor, Marketing Studio, Meeting Room. Deep black/charcoal, champagne gold, warm ivory, realistic architectural lighting, responsive accessible 2D alternative. Make desks clickable, show task evidence/URLs, transparent progress, actionable approvals. **Never fake agent activity, revenue, browser screens, completed Reels, or availability.** Inactive agents must visibly read `Idle` or `Not configured`.

## Repository and safety boundary (verified 2026-11-14)
- GitHub repository selected by owner: `sampathkumar-co/splcart` (default `main`). The repository was **empty**, without any commits, branches or production storefront source as of inspection. Do not assert that this repository contains the SPLCART production frontend/backend; it does not.
- This repository is the starting home for a **separate, independently deployable AI Headquarters**. Do not change the running storefront or overwrite its database. SPLCART integration requires later inspection of real API contracts and authenticated read-only permissions.
- Work in feature branches and PRs rather than merge directly into production paths.
- Code foundations: Next.js 16 / React 19, React Three Fiber + Drei / Three.js, Prisma + PostgreSQL, Zod. These existing libraries are used under their applicable open-source licenses; do not import third-party paid assets or claim we copied an existing 3D office kit.

## Non-negotiable business rules
- Real execution, real evidence, real commercial outcomes. Every action records origin, timestamp, actor, source, outcome, error and cost where measurable. Distinguish recorded, independently verified, unverified, and blocked.
- Owners approve external publishing, outreach and quotes. No auto unsolicited Instagram DMs, no bulk unauthorized scraping, no unlawful robocalls, no non-consensual messaging, no committed spend without owner authorization.
- Public business contact information **does not equal consent**. Do not store Google Maps listing data in the CRM by copying it out through a browser. Owner opens Google Search normally and chooses an independent permitted business website; Playwright visits that website once on explicit command. Store separately sourced website evidence only to the extent permitted by that site. Browser automation must obey access and data rules.
- Never assert a competitive price advantage without verified material/purity, product type, quantity/packaging, shipping and price observations, as well as freshness. Price discrepancies alone do not prove equivalent wholesale supply.
- SPLCART product prices/availability must be obtained through an **inspected documented API** or explicitly owner-verified catalogue entries (marked as owner asserted). Unknown endpoint contracts are blockers, not opportunities to invent API routes.
- A deal marked `WON_REPORTED` is owner-reported, **not payment-confirmed revenue**. Only count `WON_VERIFIED` after checking authentic SPLCART order/payment evidence; no phantom sales.
- No Operations or Finance department. Owner retains inventory/admin/accounting decisions. Monthly *initial target*, not guaranteed quote: ₹10,000–₹15,000. Meter paid calls and implement budget ceilings before automation at scale.

## Agent hierarchy: 16 roles (future full build)
1. AI General Manager.
**Marketing:** 2. Marketing Manager, 3. Trend Research, 4. Creative Director, 5. Reel Generation, 6. Social Publishing, 7. Marketing Performance.
**Sales:** 8. Sales Manager, 9. Customer Conversation, 10. Jewellery Recommendation, 11. Lead Follow-up, 12. Wholesale Relationship, 13. Customer Retention, 14. Instagram Lead Discovery, 15. Google & Web Wholesale Lead Discovery, 16. AI Wholesale Phone Calling.
One orchestrator with shared provider infrastructure, not 16 expensive always-on LLMs. All agents have specific permissions, durable checkpoints, bounded retries and truthful task statuses. No virtual autonomous role without genuinely working tools.

## Architecture and domain contracts
- **App boundary:** isolated Next.js App Router service; dedicated Postgres schema via Prisma; role-restricted credentials; do not share storefront write privileges.
- **Research:** owner-triggered real Playwright Chromium visits of independently hosted public business sites. The owner can use normal Google Search interactively to find candidate websites, then submit an official website URL. Store website evidence and real browser execution status. Never automate prohibited Google/Maps scraping or suggest browser use exempts source terms. No blanket crawling, no synthetic activity. Future scheduled compliant search requires separate provider/source authorization.
- **Catalogue:** owner-entered, explicitly source-attributed SPLCART product data is `OWNER_ATTESTED` until independently reconciled with the real read-only SPLCART API. Product matching requires explicit category/material/units. Absence of information yields no claimed price advantage.
- **Scoring (100-point maximum):** wholesale intent/potential 30; verified price advantage 30; verified product similarity and demand 20; business credibility 10; legal contact eligibility 10. Missing evidence scores zero for that part. Explanations are visible for every score. No fabricated confidence.
- **Pipeline:** DISCOVERED → RESEARCHED → QUALIFIED → APPROVED → CONTACTED → INTERESTED → QUOTATION → NEGOTIATION → WON_REPORTED → WON_VERIFIED / LOST / FOLLOW_UP. Transitions require backend validation, append-only activity entries, explicit owner approval for outbound contact, evidence and idempotency for external actions.
- **Outreach:** MVP only prepares copy or lets owner open public site and log *manual* outreach. It does not send anything; subsequent approved outbound adapters must independently enforce consent, suppression and platform rules.
- **Conversions:** owner-reported orders stored separately from verified payment records. Display aggregate verified revenue only from reconciled verified orders, never self-reporting.
- **Security:** fail-closed owner auth, secure transport, CSRF mitigation on mutations, no secrets in git/browser, validated URLs, input length caps, CORS same-origin, log minimization, audit events, and no paid search until the owner configures a key. Before real deployment replace basic owner auth with a proper identity provider and configure backups, rate-limiting and secret rotation.
- **Activity:** marketing agents default `NOT_CONFIGURED`. Sales research room reflects actual search state; stage data from persisted evidence. The 3D office must not animate simulated work.

## Premium design specification
A cinematic architectural headquarters rather than a toy office. Dark obsidian terrazzo floor with subtle brass inlays, ivory walls, glass partitions, suspended linear warm lights, emissive branding, high-end workstations and soft reflected shadows. Navigation by room/desk; selected desk opens a live side inspector with actions and sources. Maintain 60fps on typical laptop GPUs by capping DPR, using low-poly geometry, no external unlicensed models, frameloop idle when practical, and supporting reduced motion / 2D mode. A premium 2D operations dashboard must have full functionality if WebGL is unavailable.

## Milestones in priority order
1. **M0 — Repository, contract and foundations:** canonical AGENTS.md, clean app scaffold, provisional owner auth, schema, tests, independently deployable configs.
2. **M1 — Real acquisition vertical:** manually triggered Playwright research of permitted independent public business websites; independently sourced prospect import/dedup/evidence; owner-attested SPLCART products; conservative matching and scoring; owner approval; manual outreach record; owner-reported/verified conversion distinction; audit and API tests.
3. **M2 — Office connected to real executions:** polished 3D CEO/Sales/Marketing/Meeting spaces with clickable desks, actual logs, blocked/idle state, 2D fallback, browser evidence viewer.
4. **M3 — Genuine SPLCART read-only sync:** review *actual* code and authenticated API responses; reconcile product identity/price/stock and wholesale order state; enforce freshness and fail closed.
5. **M4 — Creative studio:** original code-rendered 9:16 Reels from authentic product photos, FFmpeg/Remotion or Motion Canvas, quality review and owner-approved publishing; licensed audio only.
6. **M5 — Inbound customer conversations, follow-ups and retention with explicit consent; compliant WhatsApp/Instagram/telephony adapters; measured profitability and bounded cost.**

## Implementation and testing rules for all future chats
1. Read this file and latest Git commit/PR before planning; check current schema and tests; do not assume a tool or integration is ready.
2. Inspect existing implementations before edits; assign file ownership to simultaneous agents; prefer small PRs and no direct production changes.
3. Every planned task must have an acceptance test and a verifiable user journey; ship backend and interface together where possible.
4. Preserve API invariants and real/source-attributed records. Write unit, API integration and UI/browser tests when infrastructure permits. Explicitly report unrun tests.
5. After each milestone update the progress/handoff below with changed paths, tests and results, known blockers, next task, PR URL/branch and measured costs. Keep the full vision intact; do not rewrite history.

## Progress / handoff (update chronologically)
### 2026-11-14 — Project initiated
- User explicitly chose `sampathkumar-co/splcart` GitHub repository. It is empty, public, default branch `main`; the deployed SPLCART storefront is **not** present in this repo.
- Initial architecture chooses isolated HQ, not modifications to the running storefront.
- Starting implementation: M0 and beginning M1/M2 on a feature branch. Integration keys, real SPLCART API schema and production DB access are **not** provided; therefore real discovery calls, actual catalogue reconciliation and verified revenue cannot yet be claimed.
- Open-source foundation: Next.js, React Three Fiber/Drei and Playwright. Browser research must still respect source usage and website access terms.
- **Next action:** run dependency installation and domain/build checks, commit implementation on an isolated branch and open PR. Next: review SPLCART authenticated API contract, harden authentication and add authorized research sources.

### 2026-11-14 — First implementation increment (operator-assisted browser workflow)
- Replaced the early Places API prototype with one-request Playwright Chromium real browser inspection in `lib/browser.ts` and `/api/research`. The owner manually uses normal Google Search to identify a site; our app inspects a public HTTPS site directly, does not run mass searches/scrapes, and records actual outcomes.
- Implemented PostgreSQL schema for prospects, evidence-linked product matches, activities, conversion reports and browser runs. `/api/actions` validates inputs and records transitions and approval history; `/api/dashboard` exposes only persisted statuses.
- Added dark luxury interactive four-room React Three Fiber office with selectable desks and 2D fallback, research history, conservative product/lead workflow and real audit trail.
- Live SPLCART read-only contract, payment confirmation, full autonomous orchestration, phone calls, Reels and auto-outreach remain NOT BUILT / BLOCKED.
- **Safety / release gate:** the initial Basic owner authentication is only for a trusted development environment; production must add robust identity, authorization, rate limiting, hardened browser isolation and tests.
- **No claims of real generated revenue or genuine lead completion until evidence exists.**

### 2026-11-14 — GitHub milestone M0/M1 initial code committed
- GitHub PR (DRAFT): https://github.com/sampathkumar-co/splcart/pull/1
- Feature branch: `feature/ai-headquarters-browser-wholesale-v1`
- Source commit: `3ba9fcc7fd1fbe32b04ad98ce40004a5efb99104` (25 files, includes this canonical handoff in the PR).
- Unit logic independently verified with six Node-based assertions for conservative scoring and stage permissions: all passed. Full npm/Prisma/Next.js install, typecheck, test runner, interactive browser and database integration could not run here because npm installation timed out. **Production readiness is NOT established.**
- First functionality lives in `lib/browser.ts`, `app/api/{research,actions,dashboard}`, `lib/domain.ts`, `prisma/schema.prisma`, `components/{office,headquarters}.tsx`. All brand work exists in a separate new app; the actual storefront was not modified.
- Immediate next engineering gate: make CI green, instantiate PostgreSQL, install Chromium, run real permitted source research, create an independently verified lead using actual website evidence, verify UI navigation and data updates. Auth hardening and DNS/network browser sandboxing required before external production access.
- GitHub PR is draft and must NOT be merged until the above checks pass.