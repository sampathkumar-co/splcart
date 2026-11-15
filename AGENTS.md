# PRASANTH JEWELLERS AI HEADQUARTERS — CANONICAL PROJECT MEMORY

**Status:** Active engineering contract. Read this entire file before any coding task, in *every* new agent/chat/session. This is the single source of truth for the mission, roadmap, decisions and handoff. Update its `Progress / handoff` section after each completed milestone. **Do not claim a feature exists unless tests and real evidence demonstrate it.**

**HARD OWNER OVERRIDE (2026-11-14): HQ IS A DIFFERENT SYSTEM FROM SPLCART. NEVER MERGE THE SYSTEMS OR THE DRAFT PR. DO NOT CHANGE ANY STORE CODE, DATABASE, API, CHECKOUT OR DEPLOYMENT. SPLCART IS ONLY AN OPTIONAL EXTERNAL PRODUCT REFERENCE/BUYING DESTINATION.** See [docs/SYSTEM_BOUNDARY.md](docs/SYSTEM_BOUNDARY.md). This directive supersedes older archived integration requests anywhere below.

## Mission and owner intent
Build a high-quality, secure, independently deployed AI sales and marketing headquarters for **Prasanth Jewellers**. Its CRM, lead research, approval records and quote documents belong entirely to Headquarters, not SPLCART. The live `https://splcart.in` store may be used only as an external product-reference or shopping link. Prioritize the first auditable wholesale workflow:

**Owner-triggered permitted web research → source-attributed jewellery product matching → evidence-based wholesale lead scoring → owner review → permitted manual outreach → approved manual quotation → owner-reported conversion tracking.** Payment-verified revenue is NOT available without future, separately authorized independent payment evidence.

Design the user experience as a **truly premium, navigable 3D office**, not as a flat dashboard with a decorative model. Rooms: CEO Office, Sales Floor, Marketing Studio, Meeting Room. Deep black/charcoal, champagne gold, warm ivory, realistic architectural lighting, responsive accessible 2D alternative. Make desks clickable, show task evidence/URLs, transparent progress, actionable approvals. **Never fake agent activity, revenue, browser screens, completed Reels, or availability.** Inactive agents must visibly read `Idle` or `Not configured`.

## Repository and safety boundary (verified 2026-11-14)
- GitHub repository selected by owner: `sampathkumar-co/splcart` (default `main`). The repository was **empty**, without any commits, branches or production storefront source as of inspection. Do not assert that this repository contains the SPLCART production frontend/backend; it does not.
- This repository is the starting home for a **separate, independently deployable AI Headquarters**. Do not change or access the running storefront's source, API credentials, checkout, deployment or database. No integrated SPLCART sync is planned or required.
- Work only on the isolated HQ feature branch. The owner explicitly forbids merging the HQ draft PR or integrating its files with any store. Never merge without a future explicit reversal of this instruction.
- Code foundations: Next.js 16 / React 19, React Three Fiber + Drei / Three.js, Prisma + PostgreSQL, Zod. These existing libraries are used under their applicable open-source licenses; do not import third-party paid assets or claim we copied an existing 3D office kit.

## Non-negotiable business rules
- Real execution, real evidence, real commercial outcomes. Every action records origin, timestamp, actor, source, outcome, error and cost where measurable. Distinguish recorded, independently verified, unverified, and blocked.
- Owners approve external publishing, outreach and quotes. No auto unsolicited Instagram DMs, no bulk unauthorized scraping, no unlawful robocalls, no non-consensual messaging, no committed spend without owner authorization.
- Public business contact information **does not equal consent**. Do not store Google Maps listing data in the CRM by copying it out through a browser. Owner opens Google Search normally and chooses an independent permitted business website; Playwright visits that website once on explicit command. Store separately sourced website evidence only to the extent permitted by that site. Browser automation must obey access and data rules.
- Never assert a competitive price advantage without verified material/purity, product type, quantity/packaging, shipping and price observations, as well as freshness. Price discrepancies alone do not prove equivalent wholesale supply.
- Store product references in HQ as **OWNER_ATTESTED**, including the external SPLCART shop link if the owner supplies one. Do not fetch private SPLCART API data, infer live stock, require product sync, or claim real-time pricing.
- A deal marked `WON_REPORTED` is owner-reported, **not payment-confirmed revenue**. Never mark `WON_VERIFIED` or show verified revenue without independently authorized, reliable payment evidence. No SPLCART private access is authorized.
- No Operations or Finance department. Owner retains inventory/admin/accounting decisions. Monthly *initial target*, not guaranteed quote: ₹10,000–₹15,000. Meter paid calls and implement budget ceilings before automation at scale.

## Agent hierarchy: 16 roles (future full build)
1. AI General Manager.
**Marketing:** 2. Marketing Manager, 3. Trend Research, 4. Creative Director, 5. Reel Generation, 6. Social Publishing, 7. Marketing Performance.
**Sales:** 8. Sales Manager, 9. Customer Conversation, 10. Jewellery Recommendation, 11. Lead Follow-up, 12. Wholesale Relationship, 13. Customer Retention, 14. Instagram Lead Discovery, 15. Google & Web Wholesale Lead Discovery, 16. AI Wholesale Phone Calling.
One orchestrator with shared provider infrastructure, not 16 expensive always-on LLMs. All agents have specific permissions, durable checkpoints, bounded retries and truthful task statuses. No virtual autonomous role without genuinely working tools.

## Architecture and domain contracts
- **App boundary:** isolated Next.js App Router service; dedicated Postgres schema via Prisma; role-restricted credentials; do not share storefront write privileges.
- **Research:** owner-triggered real Playwright Chromium visits of independently hosted public business sites. The owner can use normal Google Search interactively to find candidate websites, then submit an official website URL. Store website evidence and real browser execution status. Never automate prohibited Google/Maps scraping or suggest browser use exempts source terms. No blanket crawling, no synthetic activity. Future scheduled compliant search requires separate provider/source authorization.
- **Catalogue:** user-entered, explicitly source-attributed products remain `OWNER_ATTESTED` even when linking to the external SPLCART shop. Matching a product to a retailer requires category relevance; competitor material, units and prices are optional, and missing data yields **zero** price-advantage points. There is no API sync.
- **Scoring (100-point maximum):** wholesale intent/potential 30; verified price advantage 30; verified product similarity and demand 20; business credibility 10; legal contact eligibility 10. Missing evidence scores zero for that part. Explanations are visible for every score. No fabricated confidence.
- **Pipeline:** DISCOVERED → RESEARCHED → QUALIFIED → APPROVED → CONTACTED → INTERESTED → QUOTATION → NEGOTIATION → WON_REPORTED → WON_VERIFIED / LOST / FOLLOW_UP. Transitions require backend validation, append-only activity entries, explicit owner approval for outbound contact, evidence and idempotency for external actions.
- **Outreach:** MVP only prepares copy or lets owner open public site and log *manual* outreach. It does not send anything; subsequent approved outbound adapters must independently enforce consent, suppression and platform rules.
- **Conversions:** owner-reported orders stored separately from verified payment records. Display aggregate verified revenue only from reconciled verified orders, never self-reporting.
- **Security:** separate HQ owner login with HMAC-signed HttpOnly eight-hour session, HTTPS-only production cookie, CSRF same-origin mutation checks, PostgreSQL-backed login/action/research throttles and separate browser-worker authentication. This is implemented and verified in CI; production still requires real TLS, firewall/Chromium sandbox verification, backup/restore and owner MFA/identity policy as appropriate. No paid search keys configured.
- **Activity:** marketing agents default `NOT_CONFIGURED`. Sales research room reflects actual search state; stage data from persisted evidence. The 3D office must not animate simulated work.

## Premium design specification
A cinematic architectural headquarters rather than a toy office. Dark obsidian terrazzo floor with subtle brass inlays, ivory walls, glass partitions, suspended linear warm lights, emissive branding, high-end workstations and soft reflected shadows. Navigation by room/desk; selected desk opens a live side inspector with actions and sources. Maintain 60fps on typical laptop GPUs by capping DPR, using low-poly geometry, no external unlicensed models, frameloop idle when practical, and supporting reduced motion / 2D mode. A premium 2D operations dashboard must have full functionality if WebGL is unavailable.

## Milestones in priority order
1. **M0 — Repository, contract and foundations:** canonical AGENTS.md, clean app scaffold, provisional owner auth, schema, tests, independently deployable configs.
2. **M1 — Real acquisition vertical:** manually triggered Playwright research of permitted independent public business websites; independently sourced prospect import/dedup/evidence; owner-attested SPLCART products; conservative matching and scoring; owner approval; manual outreach record; owner-reported/verified conversion distinction; audit and API tests.
3. **M2 — Office connected to real executions:** polished 3D CEO/Sales/Marketing/Meeting spaces with clickable desks, actual logs, blocked/idle state, 2D fallback, browser evidence viewer.
4. **M3 — Standalone release hardening:** secure HQ owner sessions and browser isolation, proper database migrations/backups, genuine allowed-source research and a separately deployed HQ preview. Do not integrate with SPLCART.
5. **M4 — Creative studio:** original code-rendered 9:16 Reels from authentic product photos, FFmpeg/Remotion or Motion Canvas, quality review and owner-approved publishing; licensed audio only.
6. **M5 — Inbound customer conversations, follow-ups and retention with explicit consent; compliant WhatsApp/Instagram/telephony adapters; measured profitability and bounded cost.**

## Implementation and testing rules for all future chats
1. Read this file and latest Git commit/PR before planning; check current schema and tests; do not assume a tool or integration is ready.
2. Inspect existing implementations before edits; assign file ownership to simultaneous agents; prefer small PRs and no direct production changes.
3. Every planned task must have an acceptance test and a verifiable user journey; ship backend and interface together where possible.
4. Preserve API invariants and real/source-attributed records. Write unit, API integration and UI/browser tests when infrastructure permits. Explicitly report unrun tests.
5. After each milestone update the progress/handoff below with changed paths, tests and results, known blockers, next task, PR URL/branch and measured costs. Keep the full vision intact; do not rewrite history.

## 2026-11-14 owner directive — finish using existing GitHub foundations

**Current priority:** deliver the most complete independently testable wholesale acquisition vertical possible, backed by a usable ultra-premium 3D office. The owner explicitly prefers adapting existing, license-verified GitHub code rather than rebuilding established components. This instruction supersedes any earlier preference to craft every 3D interaction from scratch.

**Reuse contract:** [Hermes3D](https://github.com/iamlukethedev/Hermes3D) is the primary MIT-licensed source for office camera/scene/agent-runtime patterns. Preserve notices in `docs/third-party`; audit imported code and assets before each import. Adapt in isolated components. Do not transplant Hermes-specific services, sample businesses or simulated agent runs. Reuse [browser-use](https://github.com/browser-use/browser-use) only once an isolated Python/browser worker and its site permissions, network policies and metered model costs are tested; owner-triggered direct Playwright research is the current safe real-browser fallback. Full comparison: `docs/GITHUB_FOUNDATIONS.md`.

**Product acceptance criteria for the first customer-acquisition release:**
1. One independently permitted business website can be inspected through a real, recorded Playwright browser execution with actionable evidence and honest failure states. No Google/Maps mass scraping, CAPTCHA bypass, or pretend browser sessions.
2. An independently source-linked retailer is deduplicated and associated with **owner-entered independent HQ product references**. SPLCART can appear only as a public external product/shopping URL. No SPLCART API, database or store access. Unknown price/availability = unknown.
3. Deterministic scoring cannot assign verified price advantage without same units/materials, genuine confirmed catalogue and delivered-price evidence.
4. Owner can approve/reject, document contact eligibility, manually record outreach/approved HQ quotes, and record owner-reported conversions **without ever claiming payment verification**. No live store/payment integration is authorized.
5. A high-fidelity dark champagne-gold architectural office exposes *all sixteen role workstations* without falsely implying they run. Real browser, approval and sales states can be inspected from an accessible 2D alternative.
6. GitHub CI checks type safety, unit/domain rules, PostgreSQL/API workflow and Next production build. Chromium/WebGL visual QA and external integration results must be explicitly reported separately.
7. Existing live SPLCART storefront stays untouched. The owner **forbids any merge of HQ into SPLCART or any merge of this draft PR**. All development stays in the separate feature branch and all releases must be independently deployed under explicit owner authorization.

**Completion semantics:** UI/code/CI done ≠ autonomous revenue generation done. Never mark SPLCART catalogue sync, AI calling, creative Reels, Google search automation or paid revenue verified without a real integration and test proof.

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

### 2026-11-14 — CI verified core backend against isolated Postgres
- Draft PR: https://github.com/sampathkumar-co/splcart/pull/1
- CI run: https://github.com/sampathkumar-co/splcart/actions/runs/43584565641 (SUCCESS).
- Verified: Node 22 dependency installation, Prisma 6.19.3 generation, TypeScript typecheck, Vitest (5/5 unit tests), temporary PostgreSQL 17 schema application, Next.js production build, and **17/17 genuine HTTP API + transaction smoke assertions** in `scripts/smoke.mjs`.
- CI's lead, product, permission and order records were ONLY fixtures in an ephemeral test database; no real customers/sales were invented in the production workspace.
- The owner's authorization is required before outreach; contact state now additionally requires documented eligibility and an evidence URL.
- Browser Chromium launch against genuine retailer sites, 3D office visual QA, actual SPLCART product sync/order verification, secure deployment/auth, full migrations, external calling/social/Reels remain unverified/not built. PR stays DRAFT.
- Next: migrate from basic auth to session/RBAC, restrict browser network and robots/access policies; inspect SPLCART API response/schema for read-only product synchronization; launch a real owner-authorized research session; verify UX in browser; implement migration and backup plan.

### 2026-11-14 — Open-source foundation audit and first real source reuse
- Owner reaffirmed that reusable *existing GitHub code* should be evaluated first, not just underlying libraries. Reviewed [Hermes3D](https://github.com/iamlukethedev/Hermes3D), [JuniorXcoder/hermes-virtual-office](https://github.com/JuniorXcoder/hermes-virtual-office), [browser-use](https://github.com/browser-use/browser-use), [OpenBot](https://github.com/CopilotKit/OpenBot) and smaller 3D office repositories. Full comparison, license caveats, and integration decisions live in [docs/GITHUB_FOUNDATIONS.md](docs/GITHUB_FOUNDATIONS.md).
- Hermes3D is primary source for **incremental reuse of the office engine and interaction patterns** (verified upstream MIT), not a complete drop-in application because its state/routing are tied to its own agent runtime. Browser-use is an optional later Python/CDP worker; current operator-assisted Playwright inspector is unchanged.
- **Implemented:** adapted Hermes3D camera fly-to interpolation into `components/office-camera.tsx` with local CEO/Sales/Marketing/Meeting/Overview presets, room click integration in `components/office.tsx`, accessible Overview reset control in `app/globals.css`, and retained the required MIT copyright/license at `docs/third-party/Hermes3D-LICENSE.txt`.
- **Important limitation:** this is *one real reused scene subsystem*, not the full Hermes3D building or autonomous agent system. No paid OpenBot/CopilotKit Intelligence dependency installed, no demo agents or fabricated activity, no complete scene visual QA yet.
- New GitHub CI jobs are triggered by source changes; do not mark them passing without reading completed results. The previously passed API/DB quality gate remains the last verified baseline until this branch's new build checks complete.
- **Next:** ensure CI passes on latest branch commit; run actual WebGL visual/accessibility checks; incrementally port licensed architectural/lighting assets with dependency audit; only connect office states to persisted real tasks; build first real authorized lead discovery and SPLCART sync.

### 2026-11-14 — Sixteen-role office + real multi-tab browser milestone
- Replaced the simple four-desk stage with a **sixteen-workstation** black-and-champagne-gold four-room headquarters in `components/office.tsx`. The React Three Fiber scene has selectable agent desks, architectural brass/glass, real room-focus navigation, an overview reset, a reduced-motion-aware camera, and an accessible 2D operations alternative. All status-driven workstations come from `lib/agent-roster.ts`; `app/api/dashboard/route.ts` reads persisted browser work. Non-running roles explicitly read NOT_CONFIGURED, ON_DEMAND or MANUAL_ONLY.
- `components/headquarters.tsx` now has an accessible 16-role selector and evidence-focused inspector. Source-referenced browser history shows up to three actual tabs and their error/status outcomes.
- `lib/browser.ts` implements **one owner-triggered real Chromium session** with up to three independent tabs on the SAME retailer website; it blocks internal targets, listed restricted social/search hosts, cross-site resource navigation and external redirects. `app/api/research/route.ts` persists each tab's real result or error; `lib/validation.ts` caps tabs at three. **This is NOT automated Google Search, site crawling, or a complete autonomous discovery worker.** Browser DNS-rebinding defense requires a deployed network-level egress firewall/sandbox and site terms review.
- `tests/agent-roster.test.ts` and `tests/browser-policy.test.ts` verify truthful statuses and URL policy; `scripts/office-e2e.mjs` performs a real headless Chromium 3D/WebGL pixel-diversity test plus 2D/mobile/navigation checks and saves screenshots; `scripts/real-browser-smoke.mjs` performs a genuine 2-tab request to IANA `example.com` in a disposable CI database. This neutral connectivity test is NOT a real wholesale lead.
- **Confirmed green GitHub Actions** on commit `2130de783952fb83df3c5cc0cddb624acbf94b68`, [run 43587746039](https://github.com/sampathkumar-co/splcart/actions/runs/43587746039): Prisma, TypeScript, Next production build, **12/12 Vitest tests**, PostgreSQL + HTTP API smoke, **17 domain/API assertions**, real Chromium 3D/UI acceptance, canvas pixel-diversity **207 distinct sampled RGB values**, and **a real two-tab HTTPS public-page fetch**. Screenshots are uploaded as the `hq-office-visual-qa` Actions artifact. Later changes must pass their own fresh quality gate before claiming final green.
- Verified source credits: reused the MIT-licensed **Hermes3D camera navigation algorithm/pattern**, retained copyright/notice at `docs/third-party/Hermes3D-LICENSE.txt`, and created original HQ geometry. **The full Hermes3D engine, agents or its 3D assets have NOT been imported.** The owner still wants additional audited source reuse where practical.
- No real retailer leads or verified sales have been generated by this app. No authenticated SPLCART product/order sync was demonstrated. Telephony, auto-outreach, generated Reels, background orchestration, strong production sessions, domain-level outbound restrictions, payment reconciliation, and separate deployment are NOT COMPLETE. Draft PR remains unmerged and production storefront unchanged.
- **Next critical engineering steps:** inspect actual SPLCART read-only product/order contract; add source-backed product reconciliation; harden auth and browser isolation/rate limits; conduct a real authorized retailer research session; validate 3D on the owner's machine and responsive layouts; deploy secured HQ preview; verify one genuine lead-to-paid-order conversion. Only after that expand to code-generated Reels and consent-aware customer agents.

### 2026-11-14 — Owner hard separation and independently persisted quote workflow
- Owner explicitly prohibited changes to live SPLCART and prohibited **merging**; SPLCART may only be an external product-link/shopping helper. Added definitive [docs/SYSTEM_BOUNDARY.md](docs/SYSTEM_BOUNDARY.md). This override supersedes earlier M3 SPLCART sync ambitions. No storefront files, accounts, endpoints, checkouts, databases or deployments were touched; GitHub PR #1 remains DRAFT/unmerged.
- Built a new independent HQ quotation ledger: `prisma/schema.prisma` Quote/QuoteStatus, pure `lib/quotation.ts` totals/eligibility/owner-only share text, `lib/validation.ts` Zod actions, `app/api/actions/route.ts` create/approve/void actions and audit entries, `lib/serialize.ts` owner quote details, and `components/headquarters.tsx` draft/approve/copy/void interface. Approved quotes require explicit owner assertions of current price and availability, owner-approved lead, documented contact eligibility and stage. Copy is manual only, never automated contact. The QUOTATION pipeline transition now requires a saved currently approved quote; a reported order requires an approved quote. Seven-day validity for sharing; owner's reported sale does not become verified revenue.
- Removed the false requirement to know competitor prices before matching products. `add_match` accepts price-free relevance matches and preserves unknown values as null; published price advantage remains zero without independently sourced comparable evidence.
- Added a source-linked `record_wholesale_intent` action and owner UI, increasing only evidence-backed wholesale potential in the conservative lead score.
- Added optional unique `businessHost` for new prospect records, to deduplicate the same retailer using different names/paths; existing databases need controlled backfill before enforcement for their historical rows. Updated `scripts/smoke.mjs` and `tests/quotation.test.ts`.
- Current HQ product links are outbound external references only. `app/api/dashboard/route.ts` reports SPLCART as EXTERNAL_SHOPPING_REFERENCE_ONLY. Do not add private API calls.
- **Verification:** previous CI baseline for core quote workflow: [run 43591326414](https://github.com/sampathkumar-co/splcart/actions/runs/43591326414) succeeded with unit tests, PostgreSQL/API smoke, real Chromium visual and IANA two-tab source checks. **Latest multi-feature changes must pass a new CI run before they can be called green.** Never count CI sample leads/orders as real customers or sales.
- **Remaining work:** finish standalone security/rate-limit/browser network isolation, rigorous source-policy checking, migrations and backup path, quote UX browser acceptance, stronger design QA on target machine and a separate secure HQ deployment. No automated Google Search, Reels, calls, outreach, authentic paid conversion or autonomous 16 agents claimed.

### 2026-11-14 — External product independence and source-verified lead scores
- Further enforced the owner directive that **SPLCART and Headquarters must remain separate forever unless the owner explicitly changes it**. Headquarters accepts owner-supplied public HTTPS product references from **any** permitted domain, including optional public SPLCART shopping links. No SPLCART API, source, database or deployment was accessed or altered. The legacy database field `splcartProductId` is interpreted as an owner reference SKU only; renaming it safely is a future migration.
- `lib/domain.ts` reserves verified price-advantage points for an independently verified equivalent-price source, **not a SPLCART-specific API**. `OWNER_ATTESTED` items and unavailable competitor prices still earn zero verified price advantage. `tests/domain.test.ts` updated accordingly.
- Fixed a credibility issue: `add_prospect` no longer marks a business verified simply because any URL loaded. `verify_business` action requires a completed browser run for the same host and a 16+ character category-related excerpt actually found in the **successfully captured page content**. Owner reviewed status, source URL and excerpt are independently recorded in HQ and exposed in the lead UI; `lib/source-evidence.ts` has separate adversarial unit tests. A reachable irrelevant website cannot automatically earn business-verification points. This is still **owner-reviewed source verification**, not external KYC/business-license verification.
- Owner-entered product reference URL validation no longer restricts sources to `splcart.in`. CI smoke now verifies both an external independent source and a SPLCART public shopping link.
- The draft PR remains isolated on `feature/ai-headquarters-browser-wholesale-v1`. The `main` branch was verified unchanged at `9994e4929f7ae1ed34388ca6213cead20a59c9bc`.
- **CI:** the existing full quote/product/lead pipeline check [run 43592178410](https://github.com/sampathkumar-co/splcart/actions/runs/43592178410) passed on commit `c71bbe524622035eacdb8b2f0ffd4ce00a5880df`. Additional real-source verification changes have fresh workflow runs; confirm their final results before claiming the entire latest branch green.
- **Confirmed latest full engineering quality gate:** [GitHub Actions run 43592466449](https://github.com/sampathkumar-co/splcart/actions/runs/43592466449), on functional commit `72d55e588f7520754f13e5c9a2ab8af19dd908d0`, SUCCESS. **19/19 Vitest unit tests across 5 files**; Node 22, Prisma generation, TypeScript, Next production build; temporary PostgreSQL 17 and all updated HTTP/database smoke assertions including denied fabricated business evidence, deduplicated leads, source-backed buying intent, owner-approved quotes, optional competitor prices, independent non-SPLCART product references, and owner-reported zero-verified-revenue rule. Real Chromium rendered actual 3D canvas (225 sampled RGB colors), accessible 2D/mobile views, actual approved-quote clipboard text, and a genuine two-tab HTTPS fetch to IANA `example.com`. All lead/product/order records were disposable CI-only invented fixtures. Later docs-only CI may run separately; report its status precisely.
- **Unfinished:** genuine business website source-policy research, production browser egress isolation, session auth, DB migration history, secure HQ preview and owner sales usage; 16 virtual roles are truthful office placeholders, **not 16 autonomous operational employees**. No proven real sales, verified payment or live HQ deployment.

### 2026-11-14 — Full canonical review, private sessions, isolated browser worker and initial release hardening
- **Source review:** reviewed the ENTIRE 1,210-line `AGENTS.md` (including archived master prompt), current standalone HQ source, database schema, tests, workflows, and `docs/SYSTEM_BOUNDARY.md`. Original owner vision is preserved verbatim in archived appendix; newer separation override always supersedes its older integration/merge instructions.
- **Owner authentication:** added `lib/auth.ts` cryptographically signed, expiring eight-hour HttpOnly SameSite=Strict session cookies; fail-closed 16+ character dedicated HQ owner password and 32+ character signing key; production HTTPS exact origin requirement; `app/login/page.tsx`, `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `proxy.ts` CSRF same-origin JSON mutation checks and security headers, sign-out in `components/headquarters.tsx`. Legacy HTTP Basic credentials no longer unlock the HQ. The logout deletes the current browser cookie; other devices remain signed in until expiry or secret rotation.
- **Shared request limits:** PostgreSQL `RateLimitBucket`, `lib/rate-limit.ts` atomic count; login 8 attempts / 15 min, 180 owner API actions / minute, 12 research starts / hour. A failed/missing database prevents successful login/research. No shop credentials or store databases used. `tests/auth.test.ts`, `scripts/ci-auth.mjs`, API smoke and real Chromium login/out checks verify credentials, signed sessions, expiry, tampering and CSRF enforcement.
- **Real browser policy:** reused MIT `robots-parser` v3.0.1 (`lib/source-policy.ts`, license in `docs/third-party/robots-parser-LICENSE.txt`); source-site robots Disallow and bounded crawl delay, a true browser visit for /robots.txt, sequential up to three tabs, no automatic Google/Instagram scraping. Runtime fails closed for restricted hosts, private network IPs, off-host navigation and robots error. Source terms/legal eligibility remain the owner's responsibility.
- **Service boundary:** separate `scripts/browser-worker.ts` with 32+ character bearer token, single in-flight visit, no HQ or SPLCART DB/password env; `lib/browser-client.ts` delegates production requests to that worker only. `Dockerfile`, `.dockerignore`, `compose.hq.yml` define **a separate, not deployed** HQ web service, Postgres 17 and browser-only service. Source worker is not on DB-only Docker network, web binds loopback `127.0.0.1:3400`; production browsing is blocked unless independent host egress firewall is really configured and attested. An environment flag is NOT itself a firewall. No changes to live SPLCART.
- **Database and recovery foundations:** committed `prisma/migrations/20261114_initial_headquarters/migration.sql`, `20261114_owner_research_control/migration.sql`, `migration_lock.toml`, switched CI to non-destructive `prisma migrate deploy` + `migrate status`, `npm run db:deploy`; README, `.env.example`, and `docs/SECURITY_AND_DEPLOYMENT.md` document independent credentials/TLS/egress/backup/restore prerequisites. Target-host encrypted backup and restore are NOT yet validated.
- **Owner operational control:** real `SystemControl` and append-only `SystemAudit` models, Zod `set_research_pause` action, server-side `/api/research` HTTP 423 gate before browser launch, Dashboard state and manual pause/resume controls with reasons and audit. Pause affects NEW sessions only; it does not interrupt already opened tabs.
- **Verified quality gate:** GitHub Actions [run 43596996326](https://github.com/sampathkumar-co/splcart/actions/runs/43596996326) SUCCESS at commit `01e63def7a59db1483b8950e876d83b29b5a540c`: **27/27 Vitest** (7 files), TypeScript, Next production build, PostgreSQL 17 two committed migrations and status, Docker Compose syntax, full real HTTP/Postgres smoke incl. owner pause/resume and audit, real Chromium browser owner login/3D/2D/mobile/quote clipboard, actual two-tab IANA example.com inspection, and **separate real browser worker auth/robots/two-tab HTTP test**. All CI “leads/sales/orders” were disposable invented test data, not real customers or verified revenue.
- **Unfinished/blocked:** no genuine wholesale lead-to-paid-sale execution, no separate publicly reachable HQ site, no host firewall/sandbox test, encrypted off-host backup/restore, real-world robots/terms/consent review, owner GPU visual approval, real automated Google/Instagram discovery, programmatic Reels, social/phone/WhatsApp integrations, or complete 16-agent orchestration. Do not claim production readiness; publish no invented Reels/metrics. No storefront integration or merge authorized, ever.
- **Next:** test target host egress isolation/Chromium sandbox and backup restore; complete separate TLS HQ deployment with dedicated secrets and owner review; run permitted live retailer workflow before expanding to content generation. Original archived agent roadmap remains aspirational until concrete tool and permission gates pass.

### 2026-11-15 — Concurrent daily no-key Reel scheduling hardening
- **Scope:** `lib/creative-schedule.ts` and `scripts/creative-schedule-smoke.mjs` only; no production store, API, database or deployment accessed. Remains isolated in the HQ draft feature branch, never merge.
- **Implementation:** the complete scheduler read/check/queue/audit operation now holds a PostgreSQL *transaction-scoped advisory lock* across multiple creative workers. Owner opt-in remains required; two or three daily 20-second product-photo jobs are bounded by available distinct products and a five-job pending queue. Nothing is posted, called or messaged.
- **Regression acceptance added:** ephemeral CI PostgreSQL test uploads CI-only synthetic photos for two different products plus a second photo of the first product; starts three local workers concurrently; asserts exactly two scheduled jobs for two distinct products, idempotent rerun and owner disable. These are TEST fixtures, not authentic jewellery Reels, real audiences or customer sales.
- **Verification status:** implementation committed for GitHub CI verification; inspect the newest PR-head Actions job before claiming the concurrency regression passed. Operating FFmpeg/compute infrastructure has not been cost-metered, and no paid AI/video model API is configured.
- **Next:** independently secure/deploy HQ with dedicated secrets/egress firewall, confirm source-permitted real retailer research and authentic owner assets, then verify local generated Reels and manual social engagement reporting against actual owner activity. No live external publishing or revenue claim.


### 2026-11-15 — Social owner-reporting API payload validation regression fixed
- **Detected from real GitHub Actions CI** [run 43687703324](https://github.com/sampathkumar-co/splcart/actions/runs/43687703324): the manual metrics HTTP smoke returned `INVALID_OWNER_METRICS` (400) for an otherwise valid owner-reported publication snapshot. The helper accidentally validated every `Object.values` entry, including `publicationId`/`evidenceUrl` strings; this escaped unit tests which passed only bare metric fields.
- **Fixed:** `lib/social-reporting.ts` now checks only `views`, `likes` and `enquiries`; `tests/social-reporting.test.ts` adds a realistic request-shaped payload regression. No platform calls, posts, assumed verified impressions or real customers were created.
- **Evidence:** that same CI run passed concurrent 2/day creative scheduling, real 20-second H.264 output, original 3D/mobile Chromium UI, authorised research smoke and database/backup checks, then failed specifically in owner-reporting HTTP smoke. This patch requires a NEW completed CI run before the entire latest branch may be declared green. PR remains draft/unmerged; live SPLCART untouched.


### 2026-11-15 — No-paid-API creative video pipeline, on-demand 16-role local actions, source-labeled marketing insights
- **Owner request:** “complete fully ... we are not using any api keys and continue completing”. The boundary override is still absolute: **HQ is separate from SPLCART, never change the live store or its auth/checkouts/database/deployment, never merge this draft PR.** Public external SPLCART product URLs are shopping references only. No paid AI, Instagram, YouTube, WhatsApp or phone provider API keys were introduced. Private HQ owner, worker and DB authentication credentials remain essential and are NOT paid AI provider API keys.
- **Actual local creative production:** added `lib/creative.ts` (bounded JPEG/PNG owner upload, Sharp re-encode, independent HQ photo storage, local code-native silent 20-second 720×1280 vertical H.264 FFmpeg renderer), `scripts/creative-worker.ts`, `CreativeAsset` and `ReelJob` schema/migrations, `app/api/creative/{assets,reels}` routes with queue, status, owner approval, void, retry, private video stream, and actual `components/creative-studio.tsx` preview/controls. A job is only RENDERED if a real MP4 exists; approval is owner-only and does not post. HQ media uses separate `hq_media_data` Docker volume; fourth independent `hq-creative` service has no public port, no social credentials and no outbound network.
- **Verified actual video render:** GitHub Actions [run 43685626165](https://github.com/sampathkumar-co/splcart/actions/runs/43685626165) SUCCESS: real CI-only synthetic source image uploaded, full 20.0-second 720×1280 H.264 MP4 produced and validated with ffprobe (45,239-byte synthetic-source sample), playable video shown in Chromium, and explicit owner approval recorded. Sample color image is NOT a real jewelry product or footage of human wearing jewellery. 35/35 Vitest at this milestone.
- **No-key daily scheduling:** `CreativeSchedule`, `lib/creative-schedule.ts`, `app/api/creative/schedule`, dedicated migrations, owner opt-in 2 or 3 reels/day, Asia/Kolkata daily calendar, deduplication by source asset/day, one distinct product per scheduled Reel, queue bounds, owner disable, no auto approval/publishing. If not enough genuine photos, do NOT invent videos. `scripts/creative-schedule-smoke.mjs` verifies real database behavior in ephemeral CI.
- **Manual social handoff:** `lib/creative-caption.ts` generates truthful owner-data-only Instagram and YouTube captions and explicit manual publishing links; no platform sign-in or publishing. New `SocialPublication` and `SocialMetric` tables + migrations, `lib/social-reporting.ts`, `app/api/creative/{publications,metrics}`, studio interface and tests allow owner to store an official post URL and observed views/likes/enquiries with provenance. Every external publication/metric is **OWNER_REPORTED**; it is NOT verified through any platform API, and historical snapshots of the same post are not cumulative independent views.
- **Sixteen roles: real local execution rather than decoration:** `AgentTask` durable schema + migration; `lib/local-agents.ts` and `app/api/agents/run` support 13 owner-triggered deterministic on-demand reports: executive evidence, marketing workload, genuine-browser research summaries, real-photo creative briefs, actual FFmpeg render status, approved manual publishing handoff, owner-reported social performance, sales oversight, owner product category matching, eligible manual follow-up, permissioned wholesale relationship, retention candidates, and current browser evidence. Missing evidence produces a truthful persisted BLOCKED result. Customer conversation, Instagram automated discovery and AI phone calling remain NOT_CONFIGURED without consent-aware/provider infrastructure. 3D agent desks and accessible roster select and run actual tasks, show persisted reports, sources, blocked reasons and `modelCostPaise=0, computeCost=NOT_METERED` (CPU, memory, electricity, storage, VPS etc are not free).
- **Verified broader no-key HQ quality gate:** [GitHub Actions run 43686656344](https://github.com/sampathkumar-co/splcart/actions/runs/43686656344) SUCCESS, **44/44 Vitest**, full Prisma migrations/PostgreSQL API smoke, signed owner sessions, real Chromium/3D/2D/mobile and actual 20-second MP4, scheduler idempotence, real local role tasks, platform/phone blocked outcomes, no store access or external publishing. Later changes include HMAC test flake correction (tamper significant signature bits), secure streaming upload size limits, preserving selected photo across refresh, additional marketing data provenance, 3D visual polish and source-specific CI tests. **Do not assert final current-HEAD CI success until its completed workflow confirms it.**
- **3D quality improvement:** inspected the actual Chromium screenshots, found dim/distant scene and oversized gold roof frames. Updated `components/office.tsx` and `components/office-camera.tsx` for a closer cinematic overview, thinner framing, brighter non-fake ambient/spot lighting, more legible real status monitors. New screenshots on CI need inspection before claiming target-device visual acceptance.
- **Documentation:** see `docs/NO_API_KEYS_OPERATIONS.md` (owner photo/video/daily Reels, truthful 16 role descriptions and social proof labels), `docs/SECURITY_AND_DEPLOYMENT.md` (updated four-service Docker topology and separate owner media-volume backup requirement), README, and this permanent handoff. Note HQ Postgres backup/restore CI does **not** back up stored photos or MP4s; independent media volume backup and restore on target host are still required.
- **Not completed despite user's 100% goal:** actual authenticated owner-domain deployment, host egress firewall and sandbox verification, media backup/restore proof, real sourced jewellery photos, genuine permitted retailer acquisition and validated payment/ROI, photorealistic human-wearing-jewellery videos, genuine third-party platform analytics, authenticated automated social publication, opt-in message/phone integration, and autonomous self-running networked 16-agent workforce. No external accounts/credentials for these were provided and none are fabricated. Product reference labels and reported outcomes remain honest; no live SPLCART changes, no PR merge.
- **Next:** check latest green GitHub CI after social reporting/visual updates, fix any failures; inspect newer actual screenshot; preserve owner boundary and no-key design; implement only safe source-backed local features unless account/host setup is explicitly authorized.

### 2026-11-15 — Green concurrent scheduling and no-key social reporting quality gate
- **Verified full CI:** [GitHub Actions run 43688021280](https://github.com/sampathkumar-co/splcart/actions/runs/43688021280) is **SUCCESS** for tested functional commit [`8cc85a3276768d32c8705eb616be2c83f87c3c9e`](https://github.com/sampathkumar-co/splcart/commit/8cc85a3276768d32c8705eb616be2c83f87c3c9e). 47/47 Vitest across 12 files; TypeScript, Prisma migrations/consistency, Next.js production build, actual PostgreSQL/HTTP domain smoke, dedicated HQ backup/restore, four-service Compose config, actual Chromium 3D/2D/mobile acceptance, owner session/logout and real IANA `example.com` research all passed.
- **New acceptance proof:** a real CI-only FFmpeg H.264 720×1280 20-second MP4 was rendered and owner-approval-gated; **three concurrent creative-worker processes** safely scheduled exactly two videos across two independent CI fixture products, deduplicated multiple photos of one product, reran without duplicate work, and respected owner disable. The social API persisted a CI-only manually reported Instagram URL and view/like/enquiry snapshot, denied a duplicate and invalid host, and the local marketing-performance role reported the results as **OWNER_REPORTED, not platform-verified**. 16-role task checks confirmed compliant phone/Instagram blocker statuses; no external publishing or messages were performed.
- The prior [run 43687703324](https://github.com/sampathkumar-co/splcart/actions/runs/43687703324) failed only the social-metrics HTTP step because metadata was included in count validation; commit `8cc85a3` fixed the helper and added the full request-shaped regression. Verified succeeded in the new run. The later `96d1d88...` change is documentation-only and retains this tested functional code.
- **Scope and claims:** all jewellery products/photos, prospect records, metrics and reported orders used in CI were synthetic, ephemeral **test fixtures**. No real customer, paid conversion, user-provided production photo, Instagram/YouTube post or host deployment has been verified. Zero paid external model API calls, but compute/hosting costs have NOT been fully metered. SPLCART live service untouched, main untouched, HQ draft PR unmerged.
- **Next engineering release gates:** independently secured HQ hosting/TLS, verified network egress & Chromium sandbox, dedicated backup of both database and media files, owner-supplied authentic jewellery photos and permitted business website evidence, accessibility/visual QA on target GPU, and measurable real permitted customer outcomes. Do not enable unauthorized Instagram/Google scraping, cold DMs, promotional calls or auto-publishing.


### 2026-11-15 — Luxury 3D visual inspection and owner-controlled all-sixteen-role readiness briefing
- **Owner request:** finish the entire 16-role system and verify a significantly more beautiful working 3D office. The existing hard boundary remains in force: Headquarters is separate from SPLCART; its feature PR remains DRAFT and must NEVER be merged into the live storefront. No live store code/API, deployment, database or credentials were touched.
- **Actual inspected baseline:** downloaded GitHub CI [run 43688021280](https://github.com/sampathkumar-co/splcart/actions/runs/43688021280) visual artifact and reviewed real `hq-office-canvas.png`, desktop and 2D/mobile screenshots. The previous scene looked like a dim roofless architectural outline: excessive overhead rail lines, dark small desks and distant camera.
- **3D visual upgrade:** commit [`f54fe67345e7dfe397a3ec597b4a44406e93958f`](https://github.com/sampathkumar-co/splcart/commit/f54fe67345e7dfe397a3ec597b4a44406e93958f) changes `components/office.tsx`, `components/office-camera.tsx`, `app/globals.css` and `scripts/office-e2e.mjs`: original procedural black-stone plinth, brass trim, taller smoked architectural wall panels and brand typography, room signage, warm wall-washed fixtures instead of overhead grid, clearer status monitors and chair detailing, planted decorative geometry, tuned room/overview cameras, foreground contrast and responsive UI. No paid/unlicensed 3D models or simulated staff added.
- **Verified real visual QA:** [GitHub Actions run 43689084282](https://github.com/sampathkumar-co/splcart/actions/runs/43689084282) SUCCESS for the redesigned scene; inspected actual 1274×651 WebGL screenshots and three focused room captures. A later change [`a484a57fee70b9da4464373c455e88c34044dbc8`](https://github.com/sampathkumar-co/splcart/commit/a484a57fee70b9da4464373c455e88c34044dbc8) adds owner-accessible/touch/keyboard four-room focus controls and fourth strategy-room Chromium visual acceptance. [Run 43689543250](https://github.com/sampathkumar-co/splcart/actions/runs/43689543250) reached and PASSED all four focused Chromium screenshot checks, 2D/mobile/interactive office, real FFmpeg preview, research, migrations and domain tests; its overall outcome FAILED *later* in the new agent readiness HTTP smoke due to an invalid rate-limit bucket name, not a 3D rendering failure.
- **Shared evidence and all 16 roles:** commit [`c2db28b8410a68a369047279b789c033a0aea271`](https://github.com/sampathkumar-co/splcart/commit/c2db28b8410a68a369047279b789c033a0aea271) adds `lib/agent-context.ts` (one consistent real database evidence snapshot), `lib/agent-readiness.ts` (truthful counts and blockers), `app/api/agents/briefing/route.ts` (owner-requested, rate-limited, audited, transactional persistence of 16 real local evaluations), UI 'Assess all 16 roles' and test `tests/agent-readiness.test.ts` plus API smoke. Missing evidence returns BLOCKED; no external message, social post, phone call, paid-model request, or fabricated autonomous work is performed. Thirteen roles have local on-demand evidence workflows; customer conversation, Instagram automation and compliant AI phone-calling remain independently blocked without real service accounts, permission and proof.
- **Regressions caught during honest CI:** run 43689334732 caught a missing JSX conditional close after UI integration, fixed in `037049ac...`. Run 43689543250 caught `INVALID_RATE_LIMIT` because the new PostgreSQL bucket had digits forbidden by the rate limiter; fixed in [`ce0bd07a085784d0fab93656bd87601e442546df`](https://github.com/sampathkumar-co/splcart/commit/ce0bd07a085784d0fab93656bd87601e442546df) by using `owner-role-readiness`. **Latest full CI run 43689954843 must be checked for completed result before claiming the integrated newest branch is green.**
- **Screenshot evidence:** before/after and latest four-room screenshots are generated from Chromium CI real WebGL output (software renderer, not product mock-ups). First redesign has noticeably clearer room signage/furniture and larger composition. Visual design is improved but is still original procedural low-poly architecture rather than an independently approved photorealistic commercial 3D scene. Owner-device GPU FPS, material appearance and final visual approval are **unverified**; the previously linked personal laptop was offline at inspection.
- **Still not 100% autonomous:** no configured local large language model/runtime or external social/telephony connectors, owner-supplied real jewellery photos, independently authorized automatic Google/Instagram discovery or compliant sending, verified buyers/payments, separately secured HQ hostname, real target-host firewall/seccomp, and off-host media/database backup validation. Do not invent results or treat 16 readiness summaries as 16 autonomous AI agents.
- **Next verifiable release gates:** confirm latest GitHub green run; inspect final four room images; run target-device 3D/WebGL QA when that device becomes available; separately deploy HQ with fresh independent secrets and verified security. Maintain no-store-access hard boundary and an unmerged PR.


### 2026-11-15 — Integrated 3D and sixteen-role readiness gate GREEN
- **GitHub Actions fully SUCCESS:** [run 43689954843](https://github.com/sampathkumar-co/splcart/actions/runs/43689954843) for functional head `ce0bd07a085784d0fab93656bd87601e442546df`: **49/49 Vitest tests across 13 files**, TypeScript, Next production build, Prisma migrations/PostgreSQL and HTTP workflow, HQ-only backup/restore and Compose syntax, *actual* 20.0 s 720×1280 H.264 local video, real four-room WebGL focus screenshots/2D/mobile owner workflow, real IANA example.com browser smoke, source-linked social-owner-reported smoke, concurrent daily scheduler and real 16-role readiness batch. All steps completed successfully, no failing steps. Later `AGENTS.md`-only commit does not change tested functional code.
- **Source-backed batch acceptance verified:** real disposable HQ PostgreSQL now persists 16 role evaluations in one atomic owner-requested batch with explicit BLOCKED status for missing compliant phone/Instagram/inbound channels, and no paid model actions. This confirms an internal *readiness coordinator* NOT a deployed autonomous sixteen-LLM company.
- **3D QA limitation:** Chromium software-WebGL renders were inspected; user GPU and FPS/real production deployment are still not independently verified. Original geometry is premium-styled procedural low-poly, not a photoreal production 3D scene, and further owner design review can improve it.
- **Safety:** no live SPLCART source/API/database/checkout/deployment access; default branch remains intact. Draft PR #1 remains UNMERGED. Real customers, external posting/calling, genuine paid revenue and authenticated domain deployment are not claimed.


### 2026-11-15 — Encrypted standalone HQ media recovery + power-saving verified 3D
- **Owner continuation:** finish the separate Prasanth Jewellers 3D 16-role Headquarters, keep no paid external AI API keys, and never change/merge/deploy to SPLCART live store. This milestone fixes a confirmed production-recovery gap and measures actual 3D user interactions; does NOT falsely claim 16 autonomous connected AI models.
- **Real backup gap closed in code:** added `scripts/hq-backup-encrypted.sh` (operator-triggered, cold, dedicated `pj-ai-headquarters` Docker Compose project only; temporarily stop/restart previously running HQ web + FFmpeg creative writers; dump own Postgres plus archive OWN media volume; SHA-256 record references; `age` X25519 encryption with public recipient; restrictive plaintext temp stages; no offsite transfer claimed), `scripts/hq-verify-encrypted-backup.sh` (read-only encrypted archive decryption, expected flat members, checksum verification, path/special-file restrictions), and `scripts/hq-media-manifest.mjs` (read-only owner-photo and finished-Reel database-to-file SHA-256 integrity, symlink rejection, strict UUID filenames, refuses non-HQ DB). The older `scripts/hq-backup.sh` remains database-only.
- **Green genuine encrypted full recovery gate:** [GitHub Actions run 43691358241](https://github.com/sampathkumar-co/splcart/actions/runs/43691358241) **SUCCESS**, with **49/49 Vitest across 13 files**, production build, independent PostgreSQL migrations/API/quote/research/session tests, actual FFmpeg synthetic-source 20s 720×1280 H.264, then offline `age` encryption/decryption of **real temporary PostgreSQL custom dump and HQ media tar**, fully restored into a NEW independent `hq_media_restore_check` PostgreSQL database and separate filesystem, and positively verified matching **1 real CI-only PNG and 1 real CI-only MP4** against all restored media rows. Tests intentionally corrupt restored PNG and remove MP4 and confirm recovery verification fails closed. All records/photos/videos were CI synthetic fixtures, not real sales or owner jewellery imagery. The encrypted backup staging and production Docker Compose script were NOT executed on a real deployment host.
- **3D performance and interactive testing:** `components/office.tsx` + `components/office-camera.tsx` now use React Three Fiber `frameloop="demand"` with explicit camera-transition invalidation, preserving orbit control interactions while avoiding continuous rendering when office is idle. `scripts/office-e2e.mjs` records real Chromium WebGL images for all four focus rooms and asserts an actual mouse drag changes the scene image. This acceptance, mobile/2D inspector and login/logout all PASSED in the same run `43691358241`. This is a power-saving architecture improvement, **not** an FPS benchmark or proof of target-owner GPU speed.
- **Hardened CI:** `.github/workflows/hq-ci.yml` installs offline-free `age` and invokes `scripts/ci-combined-recovery.sh` after a real video render; it exercises both recovery AND all preexisting owner/browser/agent controls. Early iterations failed due CI recipient parsing and media-tar naming/regex; fixed and green in commit `656b71efd0c8ce5e3ef9bfb0c4d82c6edc4f6efc` after regressions. `docs/SECURITY_AND_DEPLOYMENT.md` now includes explicit age public/private key separation, cold backup commands and a fresh-project restore procedure.
- **Current head:** last **functional tested head** [`656b71efd0c8ce5e3ef9bfb0c4d82c6edc4f6efc`](https://github.com/sampathkumar-co/splcart/commit/656b71efd0c8ce5e3ef9bfb0c4d82c6edc4f6efc). Isolated draft PR remains [#1](https://github.com/sampathkumar-co/splcart/pull/1), **DO NOT MERGE**. The other historical 16-role briefings still measure truthful real local on-demand work; three external-channel roles remain BLOCKED without legitimate provider/account and consent.
- **Operational blockers unchanged:** no deployed independently protected HQ host/TLS, attested egress firewall/Chromium seccomp on real host, scheduled offsite encrypted retention, production backup restore proof, owner GPU frame profiling, genuine wholesale buyers, permitted external social/phone integrations, verified receipts or 16 autonomous connected LLMs. These cannot be invented from synthetic passing CI. New recovery script requires operator invocation and protected age identity; no background backup is secretly running.
- **Next:** do a real separate HQ host setup and test on authorized device (with genuine owner product photos, GPU visual QA, isolated firewall/sandbox and off-host backup+restore) before operating for real customers; further expand role tools only with proper permissions.


### 2026-11-15 — Owner-opted-in autonomous local daily reporting across all 16 desks (GREEN)
- **Mission & isolation:** The owner asked to keep progressing toward a completely operating 16-role premium 3D Headquarters **without paid external AI API keys**. All changes remain inside standalone HQ feature branch `feature/ai-headquarters-browser-wholesale-v1` of `sampathkumar-co/splcart`. No SPLCART storefront code/API/database/checkout/deployment access, integration, or PR merge.
- **Working new autonomous local capability:** added `AgentSchedule` to `prisma/schema.prisma`, migration `20261115_daily_local_agent_reports/migration.sql`; `lib/agent-schedule.ts` uses **owner opt-in (OFF by default), 08:30 Asia/Kolkata local day**, rechecks owner enablement inside a Postgres transaction-scoped advisory lock, records exactly **one batch of 16 local evidence evaluations per India-local date**, and persists all 16 `AgentTask` outcomes, source references, truthful `BLOCKED` reasons, last-run marker, and an audit event as one atomic transaction. It does NOT browse, send DMs, post, call, spend, assume verified sales, or run 16 paid models. After a crash or concurrent worker startup, new runs see the committed daily marker; two independent owners toggling consent are serialized by the same advisory lock.
- **Isolated runtime and owner interface:** `scripts/agent-worker.ts` and `npm run agents:worker` implement a dedicated 5-minute polling HQ-only database worker; `Dockerfile` and `compose.hq.yml` add a fifth `hq-agents` service attached to internal `hq_db_only` Docker network **without browser/phone/social credentials or public port**, with `cap_drop`, `no-new-privileges`, and resource bounds. The owner can enable/disable in the 3D HQ's 16-workstation console with real persisted `app/api/agents/schedule/route.ts` and `app/api/dashboard/route.ts`; `components/headquarters.tsx` and `app/globals.css` render the schedule, latest India-local run date, and explicit no-external-actions text. The owner can still run manual 'Assess all 16 roles' independently.
- **Verified real CI:** [GitHub Actions 43693164914](https://github.com/sampathkumar-co/splcart/actions/runs/43693164914) is **SUCCESS** for functional commit [`9feadc22edd2b571d157c764fffdaa727493f3bf`](https://github.com/sampathkumar-co/splcart/commit/9feadc22edd2b571d157c764fffdaa727493f3bf): **51/51 Vitest across 14 files**, TypeScript, committed Prisma migrations and status, production build, Docker Compose config, isolated PostgreSQL/HTTP owner workflows, genuine CI-only 20-second 720×1280 FFmpeg MP4, encrypted restore of actual CI-only DB+PNG+MP4, accessible 3D/mobile Chromium including real owner schedule toggle and all four room cameras/orbit, concurrent real Reel scheduling, IANA example.com real browser research, owner-reported social metrics, real 16-role readiness API, and separate browser worker smoke all pass.
- **New concurrency proof:** `scripts/agent-schedule-smoke.mjs` is called from `scripts/agent-task-smoke.mjs` after one genuine owner-login cookie and launches **three independent** CLI processes against the same disposable HQ Postgres; asserts exactly one `RECORDED`, two nonduplicate results, **16 distinct persisted real role outcomes**, blocked phone/Instagram statuses, zero paid model cost, retry idempotence and reversible owner disable. `tests/agent-schedule.test.ts` verifies the India 08:30 due clock; Chromium verifies enable/disable button. The first integration run hit the genuine global 8-logins-per-15-minute security cap because each new test logged in separately; fixed test harness by reusing an existing CI owner session **without weakening login security**. See old failed CI runs 43692657429 and 43692724002 for the caught regression.
- **Docs:** `docs/NO_API_KEYS_OPERATIONS.md`, `docs/SECURITY_AND_DEPLOYMENT.md` and `README.md` accurately describe five independent services, the owner-opted-in daily local role worker and absence of external platform automation. After the functional green commit, only these documentation files and `AGENTS.md` changed; test claims attach to the functional commit.
- **Important limitation:** Scheduled local evidence summaries are **not** self-directed LLM reasoning, real external customer acquisition, autonomous Google/Instagram discovery, compliant calling, social account publishing or independent 16-model AI agents. Three channel-dependent roles remain **NOT_CONFIGURED/BLOCKED** pending actual permissions and technical service connections. The 3D scene was validated in CI software WebGL; the owner's GPU/FPS and premium visual approval remain unverified. No separately secured HQ domain, production egress firewall/sandbox, real lead-to-payment results or paid compute metering exist. CI-only photo, prospect, social and order records are synthetic and never claimed as real.
- **Next:** once authorized separate HQ host exists, validate five-service container running with real host network firewall, TLS, Chromium sandbox and offsite backups; add authentic owner jewellery photos and an independently permitted wholesale first journey, then consider consent-gated inbound integrations. Continue no-key/local-first development without inventing production evidence. **NEVER MERGE PR #1.**


### 2026-11-15 — Owner-recorded customer inbox integrated with 16-agent office (GREEN)
- **Owner continuation:** advance the separate Prasanth Jewellers AI HQ toward fully functioning low-cost agents and premium 3D office. The user forbids any SPLCART store code/API/DB/checkout/deployment change and forbids merging PR #1. Remain on `feature/ai-headquarters-browser-wholesale-v1`; store references remain owner-entered public links only.
- **A true local 14th role, NOT a platform-connected bot:** created independent HQ-only `CustomerInquiry` model, `InquiryChannel` and `InquiryStatus` enums and committed `prisma/migrations/20261115_owner_recorded_inbound_inquiry/migration.sql`. Owner-only `/api/customer-inquiries` GET/POST records the original channel as owner attestation, nickname/category/short actual incoming message, explicit `customerInitiated:true`, owner-reported manual reply with explicit `ownerConfirmedSent:true`, and owner close reason. Status transitions OPEN → REPLIED_REPORTED → CLOSED reject a second reply/close; server writes one audited event per accepted operation, no chat transcript in audit reason. No phone/email needed. Source always `OWNER_RECORDED`; no platform verification or connected WhatsApp/Instagram, automated retrieval, outbound DMs, social sends or marketing consent inference.
- **Owner UI and deterministic helper:** `components/customer-inbox.tsx` plus `components/headquarters.tsx` and `app/globals.css` add accessible Customer Inbox navigation and direct Customer Conversation workstation handoff. Owner may enter a real customer-initiated enquiry, see the private inbox and open-count, see same-category owner-attested HQ product links, copy/edit a no-claims reply draft, personally send via original channel and only then record the manual reply, or close with a reason. `lib/customer-inquiry.ts` uses *exact category* matching; reply asks the owner to verify current availability, product facts, price and delivery before quoting. No external API calls, models, real-time stock sync or authenticated social access. Empty inbox displays zero records, not fake leads.
- **Role provenance:** `lib/local-agents.ts`, `lib/agent-context.ts`, and `lib/agent-roster.ts` now permit a real local Customer Conversation evidence report ONLY when genuine `OWNER_RECORDED` incoming rows exist; otherwise `BLOCKED` persists. This increases locally implemented reporting workstations from **13 to 14**. **Only Instagram discovery automation and compliant wholesale phone calling remain NOT_CONFIGURED** as platform-dependent roles. An inbound social/WhatsApp platform connector is still not configured, and owner-transcribed evidence cannot be described as verified platform communication.
- **Fully green verification:** [GitHub Actions 43696331548](https://github.com/sampathkumar-co/splcart/actions/runs/43696331548) **SUCCESS** on functional commit [`01e7382e93e918697ff49c24d38214b9da1a8c58`](https://github.com/sampathkumar-co/splcart/commit/01e7382e93e918697ff49c24d38214b9da1a8c58): **55/55 Vitest across 15 files**, TypeScript, Prisma migration/apply/status, production Next build, isolated Postgres/API workflows, real 20s FFmpeg MP4, age-encrypted genuine CI-only DB+media restore, true WebGL four-room mouse orbit and mobile/2D UI, owner sign-in/out and daily role schedule, real IANA example.com browser smoke, source-attributed social/manual workflows and three concurrent DB-only role workers, all passing. `scripts/office-e2e.mjs` actually creates CI-only incoming inquiry and explicitly reports a manual reply via the browser, captures `hq-inbox-manual-workflow.png`. `scripts/inbox-smoke.mjs` reuses an existing CI owner session to verify private API, reject no-inbound attestation, reject missing owner manual-send confirmation, forbid duplicate reply/close, preserve source label and no connected channels. All customer records/photos/platform links in CI are **synthetic fixtures**, not real business evidence.
- **Visual QA:** downloaded and inspected actual software-WebGL CI screenshot `hq-office-canvas.png`, and full-page `hq-inbox-manual-workflow.png` from CI 43696331548. The office remains premium-styled dark-and-brass procedural low-poly, with four workrooms; inbox is responsive dark-luxury and renders actual source-labeled record/reply. This is not high-end photorealistic 3D and has NOT been measured on owner GPU. Browser stage confirmed genuine 3D geometry/orbit, not just compilation.
- **Regression fixed:** first CI 43696212385 caught stale `tests/agent-roster.test.ts` assertion expecting Customer Conversation NOT_CONFIGURED; corrected to `ON_DEMAND` with zero completions before use, while Instagram and phone remain NOT_CONFIGURED. The next full run 43696331548 is GREEN, demonstrating no omitted code-quality gate. `README.md`, `docs/NO_API_KEYS_OPERATIONS.md`, and `docs/SECURITY_AND_DEPLOYMENT.md` document the manual inbox/permissions and retention limitations; changes after the green code commit are documentation only.
- **Operational limitations / next:** no real customer account connected or verified message delivery, no permitted Instagram platform automation/calling account, no independent HQ host/TLS/egress firewall/seccomp production validation, no guaranteed offsite encrypted backup retention, no owner photos or genuine paid conversions, and no production-tested source GDPR/DPDP retention/deletion tools. Before real customer use implement an owner-controlled record deletion/retention policy; backups may retain records until expiry. Do not merge into SPLCART. Focus next on robust, consent-aware workflows and truly authorized deployment, never pretend 16 always-on AI models.


### 2026-11-15 — Owner-controlled inquiry erasure, safe closed-only retention and 55% overall scorecard (GREEN)
- **Owner ask:** continue completing independent Prasanth Jewellers AI Headquarters and quantify total percentage. The **engineering-estimated overall project completion is ~55%**, explicitly **NOT** 87.5% based on having 14/16 named local workstations. See `docs/PROJECT_COMPLETION_SCORECARD.md`: weighted independent architecture, wholesale journey, premium 3D, video production, depth of real autonomy, operational deployment and actual external permitted channels/business outcomes. The percentage is subjective and contingent on verified host/business readiness; do not claim a precise measured KPI.
- **Real owner privacy feature:** `app/api/customer-inquiries/route.ts` accepts owner-only `erase` only with explicit `confirm:"ERASE"` and owner-only `purge_closed` only with explicit `confirm:"PURGE"` and a 30/90/180-day policy; no automatic purge or external account access. A transaction deletes a single HQ inquiry or up to 100 `CLOSED` cases with `updatedAt` before cutoff, NEVER bulk-deletes `OPEN` or `REPLIED_REPORTED`. The GET endpoint exposes actual eligible counts by window. An append-only audit records the action without transcribing message content; historical close-audit text for selected records is sanitized. Both operations replace historical customer-conversation `AgentTask.resultJson` text with a fixed redacted summary to erase aliases copied by older reports.
- **Privacy by default:** `lib/local-agents.ts` now emits only aggregate category/channel-independent local customer-conversation work counts in role reports; customer nicknames, private transcript text and individual case IDs are never copied into any **new** AgentTask summary. `lib/inquiry-retention.ts` defines bounded controls and redaction text; `tests/inquiry-retention.test.ts` and `tests/local-agents.test.ts` cover eligibility and no alias leaks. The normal private inbox still shows the owner's current live cases until manually erased.
- **Owner interface:** `components/customer-inbox.tsx` and `app/globals.css` expose typed single-case deletion and a separate closed-only 30/90/180-day bulk retention panel with preview counts, 100-row batch limit, no auto deletion, and visible explicit warning that existing encrypted HQ DB+media backups follow separate expiry. Only HEADQUARTERS data is affected; no SPLCART source/API/DB/checkout/deployment access or live store merge.
- **Full GREEN acceptance:** functional commit [`98c0c685cbd2dabdfe7a440ed1740faacd6a5d20`](https://github.com/sampathkumar-co/splcart/commit/98c0c685cbd2dabdfe7a440ed1740faacd6a5d20) passed [GitHub Actions 43698228885](https://github.com/sampathkumar-co/splcart/actions/runs/43698228885) with **57/57 Vitest in 16 files**, TypeScript, Prisma migrations, Next production build, real independent PostgreSQL/API, genuine CI-only 20s MP4, age-encrypted HQ DB/photo/video restore, real Chromium WebGL four rooms/orbit and mobile/2D UI, real Chromium owner-confirmed enquiry erasure screenshot `hq-inbox-privacy.png`, concurrent local agents/Reels, independent permitted browser test and browser worker; 33 successful CI steps.
- **Specific privacy acceptance:** `scripts/inbox-smoke.mjs` uses disposable Postgres fixtures to prove wrong confirmation is rejected, a 100-day-old CLOSED case is actually erased by 90-day purge, an OPEN case survives, individual erasure succeeds exactly once, old `AgentTask` customer alias text is overwritten, and a legacy audit closure note is sanitized; `scripts/office-e2e.mjs` creates and erases a CI-only enquiry through real Chromium. Screenshots from run 43698228885 have been inspected: 3D remains a compact authored low-poly room layout; private inbox is dark-luxury and the retention panel is visible. These tests do not imply a production independent host or real customers.
- **Docs and limitation:** `README.md`, `docs/NO_API_KEYS_OPERATIONS.md`, `docs/SECURITY_AND_DEPLOYMENT.md` and the weighted scorecard document owner-only live data erasure and separate encrypted offsite backup retention. A successful live deletion cannot honestly guarantee removal from historical encrypted backup files, social network accounts, user devices or external caches. Still no automated retention job or validated legal privacy compliance; no real permitted Instagram cold discovery, phone calling, WhatsApp account bridge, full self-directed 16-agent workforce, owner GPU QA or independently deployed public HQ. No paid model API keys used; compute/power remains unmetered.
- **Next priority:** continue the premium 3D office quality/desktop owner acceptance and genuinely permitted independently sourced wholesale workflows; implement separate backup expiry/offsite deletion and real host security once independently authorized. Keep PR #1 **DRAFT/UNMERGED**, never modify SPLCART production.


### 2026-11-15 — Architectural luxury 3D HQ rebuild and cinematic controls
- **Owner directive and strict boundary:** significantly elevate the genuine interactive four-room 3D office to an extraordinary jewellery-brand experience, continue engineering. Remain on branch `feature/ai-headquarters-browser-wholesale-v1` inside `sampathkumar-co/splcart`; **do not merge draft PR #1** or touch live SPLCART store/API/DB/checkout/deployment. Never label eye-candy as verified agent activity. All original design remains code-native and editable, with MIT Hermes3D camera adaptation notice retained.
- **New original visual system:** `components/office-luxury.tsx` builds deterministic code-generated 256² veined stone textures, gilded open pavilion, bronze/obsidian plinth, lighting, hanging pendants, jewellery sculptures and glass exhibits, CEO luxury lounge, Sales gallery, Marketing vertical-Reel recording set/ring-light, Strategy conference decor. Removed visually obstructing front roof/lattice after inspecting genuine Chromium screenshots. `components/office.tsx` adds bronze-bordered workstation furniture, upholstered seating and screen labels driven only by persisted agent states. All sixteen clickable desks, real inspector, camera transitions, accessible 2D workspace and reduced-motion support preserved. `app/globals.css` adds polished cinematic architecture controls.
- **Genuinely interactive owner presentation:** physically larger **Cinema** WebGL view; **After hours** lighting that changes actual pixels; reversible **Performance / Signature** detail changes (DPR cap 1.2/1.5); camera navigation, real pointer orbit and task status remain truthful. These controls never simulate agent work.
- **Performance mitigation:** `components/office-luxury.tsx` now uses shared module-scope immutable box/cylinder GPU geometries scaled across hundreds of architectural elements; existing `components/office.tsx` `Block` uses shared box geometry. Shared buffers have `dispose={null}` on GPU mesh owners so 2D/3D and detail-mode unmounts cannot accidentally release buffers still used elsewhere. Demand-driven WebGL and no paid models retained. No owner-GPU FPS measurements have been taken.
- **Real visual QA evidence:** Chromium software-WebGL pixel diversity >860 colors; real screenshots inspected for four focused rooms and before/after comparison. QA asserts signature vs after-hours and performance changes produce different true WebGL frames, Cinema physically changes viewport size, room navigation, direct orbit screenshot inequality and live agent status remain correct. Saved `/mnt/data/prasanth-headquarters-3d-four-rooms.png` and `/mnt/data/prasanth-headquarters-3d-visual-before-after.png` are derived from true Chromium screenshot artifacts, not synthetic mockups. The aesthetic is appreciably richer but not photorealistic/path-traced, and user Windows 60fps is unverified.
- **Acceptance-gate regression and fix:** Full GitHub QA (previous green baseline 57/57 Vitest) continued passing typecheck, unit tests, real Prisma migrations, Next production build, actual 20s video and age-encrypted independent DB+media recovery. The new larger scene made serial software-WebGL full-page camera screenshots and later normal app clicks CPU-sensitive: early CI attempts 43701705636 (CSS cinema transition), 43701928526 (room element screenshots), 43702199379 and 43702266640 (orbit locator screenshots), 43702994358 (2D button after prolonged GPU stress), 43703877188 (Customer Inbox click after prolonged stress) all found timing/resource issues. The visual assertions themselves passed; updated `scripts/office-e2e.mjs` uses viewport screenshot clips and fresh authenticated context/tab to test 2D/business interactions after 3D GPU stress. **DO NOT CLAIM COMPLETE GATE GREEN until the current functional run does pass every stage.** Current candidate functional HEAD `e0fe72ed722f98c6d130ea028aa8b27c869bd0db`, GitHub Actions 43704298768 under verification. The preceding shared-buffer run 43703983305 is also being monitored.
- **Docs:** `docs/3D_CINEMATIC_DESIGN.md` details real production geometry, visual QA, performance limits and provenance; `README.md` links design guide. Project-wide completion estimate ~55% remains engineering judgement because independent secure deployment, genuine autonomous multi-step lead research, permitted Instagram/social/phone integration and actual wholesale results are still missing.
- **Next:** verify latest full CI including fresh authenticated 2D fallback and business flows; capture latest rendered room screenshots; update this handoff with accurate GREEN proof or explicit blocker, update PR #1 description without merging. Continue proper performance on owner GPU/real host only when authorized.


### 2026-11-15 — Verified luxury HQ GREEN, genuine 16-workstation zoom and guided tour
- **Reconciled previous milestone:** [GitHub Actions 43705225058](https://github.com/sampathkumar-co/splcart/actions/runs/43705225058) is conclusively **SUCCESS (33/33 CI steps)** for the premium 3D Headquarters, protected `/2d` low-power route, nightly presentation/performance/Cinema controls, all four real Chromium room views/orbit, owner login/business UI, Prisma PostgreSQL real API, original 20-second MP4, `age` encrypted independent DB+media recovery, browser worker, role reports and controlled creative scheduling. Real Chromium screenshots (18 artifacts) were downloaded and reviewed; no real GPU 60fps benchmark or public HQ deployment claimed.
- **New independent 3D spatial source:** `lib/office-layout.ts` now owns four room coordinates, all 16 actual role workstations and their shared world transforms; `components/office.tsx` and `components/office-camera.tsx` consume that contract so every 3D focus target corresponds to the actual room/desk, not a guessed placeholder. `tests/office-layout.test.ts` checks all 16 unique locations, lawful bounds, deterministic transforms, camera distance and rejection of imaginary roles.
- **True close-up and tour:** the owner can click an actual rendered workstation or the accessible **Inspect selected desk** button and move the camera to the station; a live role panel shows only authenticated status and completed-report count, with **Previous workstation**, **Next workstation**, **Return to room** and **Overview**. The tour visits the 16 actual roles and visibly says `NOT CONFIGURED` at the phone-calling desk; it does NOT simulate a call or virtual worker. Three.js demand-render canvas is unchanged; controller is keyboard-operable.
- **Visual review caught an actual defect:** the first low-angle camera image was obscured by the Strategy room's giant foreground `EVIDENCE FIRST` banner despite passing pixel-difference tests. Updated `lib/office-layout.ts` to bring the lens higher and nearer so sightlines clear interior signage and light rails. `tests/office-layout.test.ts` explicitly checks a high lens and shallow horizontal offset. Do not describe the initial obstructed screenshot as current proof.
- **Acceptance CI:** latest functional code `8e798e70c9f1babb1180830e50bf1cbdd2a94238`; [run 43708730607](https://github.com/sampathkumar-co/splcart/actions/runs/43708730607) tests new high-angle focus, guided desk tour, truthful phone role status, and full normal business journey. Prior attempt 43708014746 already passed focus and reversible view but had software-GPU resource contention during the later daily report; `scripts/office-e2e.mjs` now evaluates the daily-report owner operation in a fresh authenticated `/2d` tab after WebGL stress. **DO NOT CLAIM the latest focused guided tour release green until run 43708730607 is explicitly SUCCESS.**
- **Accessible accuracy fix:** the `/2d` CEO, Sales and Marketing room cards now correctly describe owner evidence, permitted-source leads and **working local code-rendered Reels**, rather than the obsolete claim Marketing is entirely unconfigured. Previous overall 55% weighted project estimate stands; richer visuals and deterministic role desks do not imply live Instagram/phone connectivity, autonomous revenue generation or production readiness.
- **Boundary and continuation:** PR #1 stays DRAFT/UNMERGED on isolated HQ branch; SPLCART production is never changed. Next: inspect the latest actual focused Chromium screenshot and finish green QA, update this handoff with evidence and PR description, then pursue real owner-device FPS/protected host and genuinely permitted live wholesale prospects without any paid AI API keys or fabricated customer communication.


### 2026-11-15 — HIGH-ANGLE 16-DESK TOUR GREEN; manual local encrypted-backup retention tests
- **Visual acceptance now verified:** [GitHub Actions run 43708730607](https://github.com/sampathkumar-co/splcart/actions/runs/43708730607) is **SUCCESS, 33/33 steps**, for functional commit `8e798e70c9f1babb1180830e50bf1cbdd2a94238`. It tests 16 source-grounded desks, real selected-camera focus, actual **Next / Previous** role tour including the blocked `NOT CONFIGURED` phone agent, reversible camera and genuinely changed WebGL screenshots, all four rooms and pointer orbit, client-owner 2D fallback, full site workflow, actual 20s HQ-only MP4, combined encrypted DB+media recovery, browser worker, roles, social manual records and quote handling. TypeScript and all tests pass. Actual `hq-office-selected-desk.png` was downloaded and **visually inspected**; the high-angle lens clears the previous Strategy banner obstruction, showing the exact selected station with real-data overlay and ring.
- **Operator backup retention newly implemented:** `scripts/hq-backup-retention.mjs` is a separately invoked **dry-run-only by default** local `.age` archive inventory/owner-confirmed expiry script. It accepts only a dedicated absolute owner-owned HQ folder, never a SPLCART path or symlink; supports 30/60/90/180 day threshold and strict filename matching; preserves the newest two archives, and actual deletion requires `--apply --confirm DELETE_EXPIRED_HQ_BACKUPS`. It does NOT decrypt files, delete any unknown files, run automatically, access remote/offsite storage or guarantee all erasure copies are gone. `tests/hq-backup-retention.test.mjs` uses temporary fake archives to check dry-run, owner approval, old confirmed deletions, preserving last two, unknown files and protections against symlinks, wrong days, store/root paths.
- **Testing distinction:** the new retention code is **unit-test green** in [run 43709456435](https://github.com/sampathkumar-co/splcart/actions/runs/43709456435) (unit/build/migration/backup/creative stages passed; actual full browser integration still in progress as this note was written). Do NOT claim a latest complete 33/33 run or actual production backup deletion unless it really completes. The last fully GREEN **combined 3D** baseline is 43708730607.
- **Documentation:** `docs/3D_CINEMATIC_DESIGN.md` explains actual routed camera and true status; `docs/SECURITY_AND_DEPLOYMENT.md` documents explicit local retention, risks, and remaining offsite expiry proof; `README.md` links both. No generated assets require paid AI keys. Local CPU/GPU/vCPU and backup transfer costs are unmetered.
- **Strict separation:** Work remains only in the isolated Headquarters app on the DRAFT unmerged PR #1; no SPLCART storefront/source/private API/DB/order/checkout deployment or admin mutation. Next after full-green: truthful owner host/GPU measurements, real permitted retailer evidence and explicit consent-based outreach, independent secure deployment and offsite backup lifecycle. Owner-requested whole-project weighted estimate stays approximately 55% until evidence supports a change.


### 2026-11-15 — Evidence-Lit Atelier: truthful 16-screen operational displays and premium room identity
- **User directive:** replace lifeless decorative workstation screens with genuinely informative agent activity, improve jewellery-brand materials, atmosphere, colors and legibility; build directly through connected GitHub. Work **only** on isolated standalone HQ branch `feature/ai-headquarters-browser-wholesale-v1`, [draft unmerged PR #1](https://github.com/sampathkumar-co/splcart/pull/1). No SPLCART production store/API/DB/payments/checkout/merge and no paid AI keys.
- **Genuine workstations:** `lib/workstation-display.ts` (pure model) defines all 16 unique source-grounded micro-displays with actual authenticated `AgentRecord` statuses and persisted `AgentTask` timeline/report sources. `components/workstation-screen.tsx` uses original CanvasTexture drawn locally for each **physical monitor**. No pretend graph/typing/calls; empty task history stays empty. A role that's not connected stays `NOT CONFIGURED`, including prohibited unconfigured Instagram discovery and AI phone calls. Ancient `RUNNING` rows cannot be shown as actively executing.
- **Real operational counts:** `app/api/dashboard/route.ts` now adds **data-minimized** aggregated HQ-only signals: recent 100 local ReelJob statuses (QUEUED / fresh RENDERING / stale / RENDERED / APPROVED), `CustomerInquiry` OPEN owner-recorded count, `SocialPublication` owner-reported count, HQ prospect owner-review/approved counts, recent 30 browser runs (RUNNING only if fresh within 90sec). Only owner-session HQ databases are queried; no third-party social/API/store integrations. `lib/agent-roster.ts` now uses genuine fresh FFmpeg job state to mark Reel Generation `RUNNING` consistently across real monitors and role badges. Stalled render jobs are flagged for review, not made permanently active. `components/headquarters.tsx` passes authenticated `agentTasks` and `workstationSignals` to the 3D canvas, delaying initial scene mount until signed data loads.
- **Living but not fabricated visuals:** `components/office.tsx` integrates the 16 textured physical displays and four larger brass-framed room evidence wallboards with actual current counts, plus truthful selected-workstation inspector details. `components/office-luxury.tsx` adds distinct physical subtle gallery accents and rim lighting. `app/globals.css` uses warm obsidian `#0B0F12`, champagne gold `#D4B06A`, ivory `#F3E9D7`, Sales emerald `#33BA99`, Creative plum `#B18DD4`, Strategy sapphire `#6DB4E8` and soft ruby for unsupported work. Ambient slow CSS reflections are explicitly decorative and honor reduced motion. No animated fake employees or fabricated data bars.
- **GPU safeguards:** reused screen plane geometry and small 384×240 monitor / 576×240 wall CanvasTextures. Stable content signatures preserve textures on unchanged 15-second dashboard polls. Cleanup on actual data change/unmount, `frameloop="demand"`, owner-accessible `/2d` fallback and Cinema/Performance controls retained.
- **Verification work:** `tests/workstation-display.test.ts` covers all sixteen roles, empty DB sources, true task record provenance, stale run safeguards, blocked phone/Instagram and real render/research/inquiry/prospect signals. `scripts/office-e2e.mjs` extends actual signed-in Chromium WebGL acceptance with source-truth assertions and phone blocker, and captures the real high-angle chosen desk. First runs caught TS errors, then a stale test assertion and a CPU software-WebGL pointer click timeout after heavy multi-frame rendering; resolved types/assertions, reduced texture size/caching and used actual DOM click on the post-stress return control. **Final full CI for functional commit [`1f26cbc798c3528c29aa265c642bb2e1f87f2056`](https://github.com/sampathkumar-co/splcart/commit/1f26cbc798c3528c29aa265c642bb2e1f87f2056) and subsequent FFmpeg-run freshness fix [`8f8e5356bade35a525b18d6916d1b457f0d40709`](https://github.com/sampathkumar-co/splcart/commit/8f8e5356bade35a525b18d6916d1b457f0d40709) was under verification when written.** Do not call this release GREEN until latest accepted run finishes.
- **Docs:** `docs/3D_CINEMATIC_DESIGN.md`, `README.md` explain the real data contract, palette, decorative non-work ambience and reduced GPU memory. The standalone HQ is NOT publicly deployed. No Windows GPU performance benchmark, real owner inventory, actual lead outreach, Instagram/YT API publication, consented phone call or payment-verified conversion has been established. Overall 55% remains approximate weighted engineering progress, not an operating business readiness guarantee.
- **Next:** verify actual GitHub Actions success + inspect real rendered screenshot artifacts (16 monitors/wall panels visible), fix any failure, update this milestone with green proof and PR metadata. Then continue owner-device FPS verification, independent secure hosting, and permitted real customer acquisition.


## Original owner specification (archived for completeness)
The complete original mission supplied by the owner follows verbatim. It is retained so future chats have *all* original requirements in this one file. **The latest decisions and security gates above supersede older proposed implementation methods below**. Do not treat an aspirational capability in this appendix as implemented or authorized.

---

# MASTER DEVELOPMENT PROMPT
## PRASANTH JEWELLERS — AUTONOMOUS AI GROWTH HEADQUARTERS

### YOUR ROLE

You are a principal AI systems architect, senior full-stack engineer, autonomous agent engineer, creative technology director, cybersecurity engineer, product designer and growth automation strategist.

Your mission is to design, build, integrate, test and deploy a production-ready **Autonomous AI Marketing and Sales Headquarters for Prasanth Jewellers**.

Think like you are building a serious commercial AI workforce, not a prototype or a dashboard demonstrating imaginary agent activity.

The final system must be capable of performing genuine, measurable business tasks with the minimum human intervention that is safe, legally permitted and commercially appropriate.

The owner should be able to operate most of the digital marketing and sales organization from a single beautiful 3D virtual headquarters.

**Core principle: Real execution. Real evidence. Real business outcomes.**

---

# 1. BUSINESS CONTEXT

Business: **Prasanth Jewellers**

Industry:
- One-gram gold jewellery
- Gold-plated and fashion jewellery
- CZ jewellery
- Mehandi jewellery
- Silver jewellery
- Retail and wholesale jewellery

Existing e-commerce platform:
- Website: https://splcart.in
- API: https://api.splcart.in
- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL with Prisma
- Deployment: Docker and Caddy on a VPS
- Payments: Razorpay

The business operates physical jewellery shops and wants to increase its online sales, wholesale orders, retailer relationships and repeat customers.

**The existing SPLCART production platform must remain stable.**

Before integrating, inspect the real application structure, API contracts and authentication. Do not assume endpoints exist.

Build the AI Headquarters as an independent, separately deployable application. Integrate with SPLCART through secure, documented interfaces.

Do not rewrite or destabilize the existing e-commerce application.

### Business objective

Build an autonomous growth system that:

1. Discovers potential retail and wholesale customers.
2. Finds jewellery retailers selling comparable products.
3. Identifies genuine price advantages.
4. Ranks qualified sales opportunities.
5. Creates 2–3 promotional Reels per day.
6. Handles authorized incoming customer conversations.
7. Recommends products using SPLCART.
8. Follows up with eligible interested customers.
9. Makes compliant AI-powered calls to qualified wholesale prospects.
10. Tracks resulting sales and customer relationships.
11. Continuously improves decisions using measured results.

**Do not implement an Operations department or a Finance department.**

Inventory administration, accounting, business spending decisions and financial management remain with the owner.

---

# 2. AUTONOMOUS AI ORGANIZATION

Create a hierarchical organization with **16 AI roles**, grouped under two departments and one General Manager.

## LEADERSHIP

### Agent 1: AI General Manager

The central coordinator.

Responsibilities:
- Accept business goals from the owner.
- Translate goals into executable plans.
- Allocate tasks among department managers.
- Track dependencies, budgets and deadlines.
- Review evidence from completed tasks.
- Detect duplicate work and agent failures.
- Reassign tasks when necessary.
- Prioritize activities that produce qualified leads and profitable sales.
- Generate daily and weekly executive reports.
- Request owner approvals for important actions.

It must not merely call all other agents sequentially. It should support dependency-aware delegation, bounded parallel execution, retries, recovery and human approval.

## DEPARTMENT A: AI MARKETING

### Agent 2: Marketing Manager

Coordinates the marketing specialists, approves internal creative plans, manages campaign schedules and monitors marketing effectiveness.

### Agent 3: Trend Research Agent

Research:
- Jewellery trends.
- Relevant public Instagram content.
- Successful jewellery content formats.
- Seasonal shopping trends.
- Festivals and upcoming occasions.
- Competing jewellery campaigns.
- Popular jewellery aesthetics.
- Potentially effective creative hooks.

Generate original, evidence-backed content ideas. Do not copy copyrighted competitor videos.

### Agent 4: Creative Director Agent

Transform trend research into:
- Video concepts.
- Storyboards.
- Scripts.
- Hooks.
- Captions.
- Product selection.
- Motion design instructions.
- Typography directions.
- Creative briefs.
- Calls to action.

The content must respect Prasanth Jewellers' identity and real product specifications.

### Agent 5: Reel Generation Agent

**Target: 2–3 finished Reels per day, approximately 60–90 per month.**

Implement two creation methods.

**Method A: Programmatic motion graphics**

Use Claude Code or another coding agent to produce executable animations with appropriate open-source rendering tools such as Motion Canvas, HTML/CSS animation, Three.js, FFmpeg and compatible rendering engines.

Potential features:
- Product photography animation.
- Smooth zoom and camera movements.
- Lighting effects.
- Jewellery highlighting.
- Typography animation.
- Cinematic transitions.
- Background compositing.
- Parallax effects.
- Dynamic layouts.
- Promotional price displays.
- Festival creatives.
- Template variations.
- Audio synchronization.

Use actual product photographs and verified prices. Avoid visually modifying jewellery in ways that misrepresent the item.

**Method B: Generative AI video**

Offer optional generative video providers through interchangeable adapters.

Use paid video models selectively when they provide meaningful quality improvements.

Track generation cost, retry count, model, prompt, duration and output quality.

Never silently use expensive models.

Support:
- 9:16 vertical export.
- 1080×1920 output when supported.
- Instagram-ready MP4.
- Configurable video durations.
- Product attribution.
- Watermark and branding.
- Licensed or rights-cleared audio.
- Video preview.
- Approval and rejection.
- Regeneration.
- Automatic quality checks.

The system must verify that promoted jewellery resembles the real catalogue product.

Create a reusable motion-template library so the system does not generate every video from scratch.

### Agent 6: Social Media Publishing Agent

Responsibilities:
- Prepare Instagram posts and Reels.
- Manage the content calendar.
- Publish approved content through authorized APIs.
- Prepare captions, product links and hashtags.
- Manage publishing failures.
- Track published URLs.
- Monitor permitted comments and engagement.

The owner must be able to approve, reject or edit content before publication.

Support configurable automatic publishing only after explicit owner authorization.

### Agent 7: Marketing Performance Agent

Analyze:
- Views.
- Reach.
- Engagement.
- Watch time where available.
- Profile visits.
- Website clicks.
- Product enquiries.
- Attributable SPLCART orders.
- Conversion rates.
- Revenue associated with campaigns.

Identify successful creative patterns.

Recommend improvements based on evidence rather than fabricated statistics.

---

# 3. DEPARTMENT B: AI SALES

### Agent 8: Sales Manager

Supervises all sales specialists.

Responsibilities:
- Assign research tasks.
- Review lead quality.
- Manage the wholesale pipeline.
- Coordinate customer conversations.
- Prevent duplicated outreach.
- Monitor conversion.
- Escalate commercial decisions.
- Evaluate sales-agent performance.

### Agent 9: Customer Conversation Agent

Connect authorized Instagram and WhatsApp Business messaging services.

Capabilities:
- Understand incoming enquiries.
- Identify customer intent.
- Answer approved business questions.
- Provide product links.
- Answer questions about product specifications.
- Assist with purchase decisions.
- Hand off uncertain questions to human staff.
- Preserve relevant conversation context.
- Recognize when a human response is required.

Use actual SPLCART product information.

Do not invent stock, prices, discounts, delivery promises or refund policies.

Respect message windows, customer consent and platform requirements.

### Agent 10: Jewellery Recommendation Agent

Understand:
- Customer budget.
- Jewellery category.
- Design preferences.
- Occasion.
- Material preferences.
- Style.
- Price sensitivity.

Retrieve suitable products from SPLCART.

Provide recommendations with genuine product links, images, verified prices and availability.

Explain recommendations in clear, customer-friendly language.

### Agent 11: Lead Follow-up Agent

Manage:
- Interested customers.
- Unfinished enquiries.
- Requested callbacks.
- Eligible cart-recovery conversations.
- Pending product questions.
- Follow-up reminders.

Use consent-aware messaging.

Avoid excessive or repeated contact.

### Agent 12: Wholesale Relationship Agent

Manage:
- Qualified retailer leads.
- Wholesale requirements.
- Interested businesses.
- Product quantities.
- Requested catalogues.
- Owner-approved quotations.
- Negotiation progress.
- Repeat-order opportunities.

The agent may prepare offers but must not approve prices below owner-defined thresholds.

### Agent 13: Customer Retention Agent

Identify eligible repeat-customer opportunities.

Prepare:
- New collection announcements.
- Relevant product recommendations.
- Festival campaigns.
- Reorder suggestions.
- Retention messaging.

Respect consent, communication preferences and platform restrictions.

### Agent 14: Instagram Lead Discovery Agent

**One of the highest-priority agents.**

Its purpose is to find potential wholesale customers and resellers through permitted Instagram and public-web discovery.

Research:
- Jewellery boutiques.
- Retail jewellery sellers.
- Reseller accounts.
- Fashion accessories retailers.
- Businesses offering similar jewellery.
- Public buying requests.
- Relevant business profiles.

Analyze:
- Product similarity.
- Publicly advertised prices.
- Potential resale opportunities.
- Likely business fit.
- Evidence of wholesale demand.
- Account credibility.
- Relevance of our catalogue.

Compare discoveries with SPLCART.

If a genuinely comparable jewellery item is more expensive elsewhere, calculate the verified price difference.

Do not claim a price advantage merely because products look similar. Consider materials, quantity, quality and delivery costs.

Score and rank leads.

Provide:
- Instagram profile link.
- Business name.
- Relevant product evidence.
- Matching SPLCART products.
- Price comparison.
- Confidence level.
- Lead priority.
- Suggested personalized introduction.
- Reason for recommendation.

**Critical rule: Do not send unsolicited Instagram DMs automatically.**

The owner personally opens the recommended profile and sends the message.

Browser access must not be used to bypass Instagram's collection, automation or messaging restrictions.

### Agent 15: Google & Web Wholesale Lead Discovery Agent

Use authorized Google Search services, public business websites and browser-based research.

Find:
- Jewellery retailers.
- Fashion boutiques.
- Artificial jewellery shops.
- One-gram gold jewellery sellers.
- Wholesale resellers.
- Accessories retailers.
- Potential distribution partners.

Research markets such as:
- Visakhapatnam.
- Vizianagaram.
- Hyderabad.
- Vijayawada.
- Bengaluru.
- Other relevant Indian commercial locations.

Extract only information whose collection and use are permitted.

Identify:
- Business name.
- Location.
- Official website.
- Public business enquiry channel.
- Relevant product categories.
- Publicly advertised product prices.
- Business fit.
- Available evidence of purchasing intent.

Deduplicate prospects and verify sources.

Do not build a mass-scraping system for Google Maps or circumvent access restrictions.

### Agent 16: AI Wholesale Phone Calling Agent

Provide a multilingual AI voice agent supporting:
- Telugu.
- Hindi.
- English.

Connect to an authorized telephony and voice AI provider.

The system must:
1. Receive qualified Google/Web leads.
2. Verify that the contact is legally eligible to receive the proposed type of business call.
3. Check consent, calling restrictions, suppression lists and permitted calling hours.
4. Place authorized calls.
5. Clearly disclose that the caller is an AI assistant representing Prasanth Jewellers.
6. Introduce the jewellery supply business.
7. Discuss approved product categories and wholesale opportunities.
8. Determine whether the retailer is interested.
9. Collect relevant requirements and callback preferences.
10. Generate a call summary.
11. Transfer promising prospects to the owner.

Track call outcomes and usage costs.

Do not implement unrestricted cold-call robocalling.

Finding a public number does not establish permission to call. A real browser or human-like voice does not bypass Indian promotional-calling requirements.

Start with opted-in leads, requested callbacks and other legally verified contacts.

---

# 4. SHARED LEAD INTELLIGENCE SYSTEM

All sales agents must share one structured lead database.

The system should remember:
- Business identity.
- Lead origin.
- Original source URL.
- Discovery timestamp.
- Relevant products.
- Evidence.
- Price comparisons.
- Contact eligibility.
- Interaction history.
- Lead score.
- Current stage.
- Follow-up status.
- Interested product categories.
- Conversion outcomes.

### Lead scoring

Initial suggested model:

- Wholesale purchasing potential: 30 points.
- Verified pricing advantage: 30 points.
- Product similarity and demand: 20 points.
- Business credibility: 10 points.
- Legitimate contact channel: 10 points.

Total: 100 points.

Support configurable scoring rules and later empirical calibration.

Never manufacture missing information.

Every lead must have explainable scoring and evidence.

### Sales stages

Discovered → Researched → Qualified → Approved for outreach → Contacted → Interested → Quotation → Negotiation → Won / Lost / Follow-up.

Record owner-initiated Instagram outreach without automating unsolicited messages.

---

# 5. BROWSER-POWERED AGENT WORKSPACE

Build a real browser automation subsystem using an appropriate browser-control framework such as Playwright or Browser Use.

Give authorized agents browser sessions for tasks where browser interaction is permitted.

Capabilities:
- Open multiple tabs.
- Search approved sources.
- Visit business websites.
- Navigate pages.
- Read visible permitted content.
- Compare product information.
- Capture supporting references.
- Report findings.
- Resume interrupted research.
- Respect rate limits.

The browser must not be used to evade website restrictions, bypass CAPTCHAs, scrape prohibited information or perform unauthorized account actions.

### Browser viewer in 3D headquarters

Clicking an agent should show:
- Current research task.
- Active browser tabs.
- Visible browser session when technically available.
- Visited-source history.
- Extracted findings.
- Evidence links.
- Task progress.
- Failures and retries.

Browser automation should run in isolated environments with restricted credentials and network access.

Treat website content as untrusted data to prevent prompt injection.

---

# 6. PREMIUM 3D VIRTUAL OFFICE

Build a beautiful, professional headquarters with a polished dark luxury aesthetic suitable for a premium jewellery brand.

Design direction:
- Deep black.
- Charcoal.
- Champagne gold.
- Warm ivory.
- Subtle metallic accents.
- Elegant typography.
- Premium lighting.
- Refined glass and metal surfaces.
- Smooth transitions.
- Professional visual hierarchy.

Avoid cartoonish, cluttered or childish design.

Use Three.js or React Three Fiber where appropriate.

### Required environments

**CEO Office**
- Executive dashboard.
- Revenue intelligence.
- Priority alerts.
- Pending approvals.
- Active projects.
- Business goals.
- Agent expenditure.

**Marketing Studio**
- Trend researcher workstation.
- Creative director workstation.
- Reel production workstation.
- Publishing desk.
- Performance analysis dashboard.

**Sales Department**
- Customer conversation workspace.
- Jewellery recommendation desk.
- Wholesale relationship workspace.
- Instagram discovery desk.
- Google research desk.
- AI phone calling station.

**Meeting Room**
- AI General Manager.
- Marketing Manager.
- Sales Manager.
- Shared planning.
- Task delegation.
- Decision history.

### Real activity representation

When an agent is researching, its workstation should show the real research task.

When an agent is generating a Reel, the UI should show actual rendering progress and preview availability.

When an AI phone call is running, show the actual call status and permitted live telemetry.

When an agent is idle, show it as idle.

**Never fabricate activity to make the office look busy.**

### Additional interface requirements

- Clickable workstations.
- Camera navigation.
- Agent detail panels.
- Smooth animations.
- Live status updates.
- Task history.
- Browser session viewer.
- Reels preview.
- Lead comparison dashboard.
- Call summaries.
- Approval centre.
- Searchable logs.
- Responsive interface.
- Accessibility support.
- Reduced-motion option.
- Lightweight 2D fallback for lower-powered devices.

The owner must also be able to manage the system without navigating the 3D environment.

---

# 7. TECHNICAL ARCHITECTURE

Propose the architecture after inspecting the existing environment.

A suitable baseline:

**Frontend**
- Next.js.
- TypeScript.
- React.
- React Three Fiber / Three.js.
- Accessible UI components.
- Real-time status updates.

**Backend**
- NestJS or compatible service-oriented backend.
- PostgreSQL.
- Prisma.
- Redis-backed queue.
- Job scheduling.
- Event-driven workflows.
- Secure REST and WebSocket interfaces.

**Agent orchestration**
- Hierarchical manager/specialist coordination.
- Structured tool invocation.
- Task dependency graphs.
- Controlled parallel execution.
- Durable jobs.
- Retry policies.
- Checkpoints.
- Human approval gates.
- Idempotency and cancellation.

**AI**
- Configurable LLM providers.
- Cost-aware model routing.
- Structured outputs.
- Tool-permission enforcement.
- Vision-capable product comparison.
- Speech processing.
- Text-to-speech.
- Voice AI provider adapter.

**Creative production**
- Programmatic animation engine.
- FFmpeg rendering pipeline.
- Optional generative video providers.
- Asset storage.
- Preview and approval services.

**Integrations**
- SPLCART.
- Instagram professional account APIs.
- WhatsApp Business Platform.
- Authorized web search.
- Browser automation.
- Telephony.
- Notifications.

Do not require 16 continuously running premium models.

Implement role-specific agents using shared model infrastructure and independent execution contexts.

Use cheaper models for routine classification and extraction, stronger models when genuine reasoning or creative quality requires them.

---

# 8. REVENUE OPTIMIZATION ENGINE

Implement a system that measures actual incremental commercial results.

Track:
- Qualified leads.
- Owner-approved outreach.
- Contact attempts.
- Response rates.
- Interested prospects.
- Wholesale quotations.
- First orders.
- Repeat orders.
- Average order value.
- Retail and wholesale sales.
- Reel-attributed visits.
- Completed purchases.
- Agent expenses.
- Cost per qualified lead.
- Cost per acquired customer.
- Incremental contribution.

### Revenue scenarios

Build an editable owner dashboard that supports conservative, base and aggressive business forecasts.

Use configurable inputs:
- Retail order volume.
- Retail average order value.
- Retail contribution margin.
- Wholesale order volume.
- Wholesale average order value.
- Wholesale contribution margin.
- AI operating expense.
- Customer acquisition cost.
- Repeat-order frequency.

Do not present projected revenue as guaranteed.

Separate:
- Revenue.
- Contribution.
- Operating cost.
- Profit estimates.
- Verified actual results.

Avoid double-counting existing offline purchases transferred to online channels.

The system should prioritize profitable, repeatable growth rather than vanity metrics.

---

# 9. AUTONOMY AND APPROVAL POLICY

Create an explicit permission system.

### Automatically permitted

Subject to source policies and configuration:
- Internal planning.
- Trend analysis.
- Approved public research.
- Lead scoring.
- Internal content drafting.
- Reel rendering.
- Summarizing.
- Data validation.
- Internal reporting.

### Requires owner authorization or configured approval

- Public content publishing.
- Promotional campaigns.
- Customer communication outside preapproved workflows.
- Wholesale quotations.
- Discounts.
- New paid subscriptions.
- External commitments.
- AI calling campaigns.
- Access to sensitive integrations.

### Never automatically permitted

- Unauthorized Instagram cold DMs.
- Unlawful promotional calls.
- Purchasing or committing funds without authorization.
- Inventing jewellery prices.
- Fabricating sales or leads.
- Unauthorized scraping.
- Circumventing site security or platform restrictions.
- Exposing customer personal information.

Provide audit logs and an emergency stop for all agents.

---

# 10. SECURITY AND RELIABILITY

Implement:
- Role-based access control.
- Secure authentication.
- Encrypted credentials.
- Protected API secrets.
- Tool-specific permissions.
- Tenant and workspace isolation where relevant.
- Network and browser sandboxing.
- Prompt-injection protections.
- Customer-data minimization.
- Retention and deletion controls.
- Idempotent external actions.
- Rate limits.
- Circuit breakers.
- Retry and recovery mechanisms.
- Monitoring.
- Backups.
- Cost limits.
- Security audit logs.

External actions must be attributable to the responsible agent, initiating task and authorization.

An agent's generated text must never be mistaken for evidence that an external action succeeded.

---

# 11. OPERATING COST TARGET

Design for a cost-efficient initial deployment.

Preferred initial monthly budget:
**₹10,000–₹15,000**, subject to actual usage and vendor pricing.

Target:
- 16 coordinated AI roles.
- 60–90 mainly code-generated Reels per month.
- Qualified Google and Instagram research.
- Approved customer conversations.
- Limited compliant AI phone calling.
- Shared backend and infrastructure.
- Operational reporting.

Build a cost dashboard showing:
- Cost by agent.
- Cost by AI provider.
- Cost per Reel.
- Cost per lead.
- Cost per completed phone call.
- Daily spend.
- Monthly spend.
- Estimated month-end spend.

Provide configurable hard spending limits.

If projected costs exceed budget, queue low-priority work or request approval rather than silently spending more.

---

# 12. DEVELOPMENT STRATEGY

Do not attempt an uncontrolled big-bang release.

### Phase 0: Audit and design

- Inspect existing projects and infrastructure.
- Identify real SPLCART interfaces.
- Review available credentials without exposing secrets.
- Evaluate open-source 3D headquarters options.
- Evaluate browser, voice and video providers.
- Produce architecture and feasibility reports.
- Document platform limitations.
- Establish acceptance tests.

### Phase 1: Core headquarters

- Build the premium 3D frontend.
- Implement authentication.
- Create the owner dashboard.
- Implement General Manager and department managers.
- Create task orchestration and database.
- Implement agent activity telemetry.
- Add approval controls.

### Phase 2: Customer acquisition

- Google/Web Lead Hunter.
- Instagram Lead Hunter.
- Browser research subsystem.
- SPLCART product matching.
- Lead scoring.
- Wholesale opportunity dashboard.
- Manual Instagram outreach workflow.

### Phase 3: Marketing production

- Trend Research.
- Creative Director.
- Programmatic Reel Generator.
- Video previews.
- Approval workflow.
- Social publishing.
- Performance measurement.

### Phase 4: Sales automation

- Customer Conversation Agent.
- Jewellery Recommendation Agent.
- Follow-up Agent.
- Wholesale Relationship Agent.
- Customer Retention Agent.
- Compliant AI Calling Agent.

### Phase 5: Continuous optimization

- Conversion tracking.
- Revenue intelligence.
- Repeat-order workflows.
- Cost optimization.
- Agent evaluation.
- Controlled experiments.
- Performance and security hardening.

Each phase must produce working, testable functionality.

---

# 13. DEVELOPER DELIVERABLES

Deliver:

1. Complete architecture documentation.
2. Modular project source code.
3. Database schema and migrations.
4. AI agent definitions and tool permissions.
5. Orchestration engine.
6. Premium interactive 3D office.
7. Functional owner dashboard.
8. Real task monitoring.
9. Browser research integrations.
10. Instagram lead ranking.
11. Google wholesale lead discovery.
12. SPLCART integration.
13. Reel generation pipeline.
14. Social publishing integration.
15. Customer messaging integrations.
16. Voice-agent integration.
17. Consent and approval controls.
18. Revenue analytics.
19. Cost monitoring.
20. Automated tests.
21. Security tests.
22. Deployment configuration.
23. Setup and operating documentation.
24. Failure recovery documentation.
25. User guide for the business owner.

Include integration tests, workflow tests and end-to-end tests.

Never mark a feature complete merely because a UI screen exists.

---

# 14. DEFINITION OF DONE

An agent is only considered implemented when:

- It has clearly defined responsibilities.
- It has appropriate real tools or data sources.
- It can accept an assigned task.
- It performs the task or reports an explicit blocker.
- It produces verifiable output.
- It records evidence.
- It handles failures.
- It respects permissions.
- Its cost is measurable.
- It can be supervised and stopped.
- Its status in the 3D office reflects reality.

No placeholder data in production dashboards.

No fabricated API responses.

No fake browser sessions.

No dummy Reels presented as completed deliverables.

No simulated sales presented as real revenue.

No hardcoded successful agent status.

If an integration requires permissions, credentials, compliance verification or external approval, implement the functioning internal interface and clearly mark the integration as blocked until those requirements are met.

Never claim the integration is production-ready before testing it.

---

# 15. FINAL EXPERIENCE

The business owner opens the AI Headquarters.

The 3D office displays agents working in real time.

The Marketing Manager is coordinating daily jewellery campaigns.

The Trend Agent is researching relevant content.

The Creative Director is preparing scripts.

The Reel Generator is rendering videos.

The Social Publisher is managing approved posts.

The Instagram Agent is researching potential resellers.

The Google Agent is discovering wholesale businesses.

The Sales Manager is evaluating qualified opportunities.

The Voice Agent is handling authorized wholesale calls.

The Customer Agent is responding to eligible incoming messages.

The Jewellery Advisor is matching real SPLCART products.

The General Manager is evaluating task completion, cost and business outcomes.

The owner sees:
- What every agent is doing.
- What work has been completed.
- Which leads are worth contacting.
- Which videos are ready to publish.
- Which customers need attention.
- Which wholesale prospects are interested.
- How much the system has spent.
- What sales can be attributed to its work.
- What requires approval.

The system should continuously improve using actual business feedback.

**Success is measured by qualified customers, profitable sales and repeat wholesale relationships, not the number of AI agents or animations displayed.**

---

# 16. EXECUTION INSTRUCTIONS

Start by analyzing the existing environment and determining what is feasible.

Do not immediately generate a large untested codebase.

First:
1. Inspect the existing project and its dependencies.
2. Identify reusable open-source components and verify their licenses.
3. Evaluate technical and legal constraints.
4. Propose the final architecture.
5. Create a prioritized implementation plan with measurable milestones.
6. Establish a working development environment.
7. Implement the first real vertical workflow end-to-end.
8. Test it with genuine authorized data.
9. Expand systematically to the remaining workflows.
10. Verify the completed system through actual UI and backend tests.

Where independent implementation tasks can safely run concurrently, use separate development agents with clear file ownership and integration contracts.

Avoid conflicting code changes.

Preserve existing production applications.

Do not stop at documentation, mockups or scaffolding. Progress to functioning implementation within the available environment and permissions.

At the end of each implementation milestone, provide:
- Features implemented.
- Files created or changed.
- Actual tests executed.
- Verified working functionality.
- Known limitations.
- Credentials or permissions still required.
- Actual or measured costs.
- Next highest-priority engineering tasks.

**Build the system as if Prasanth Jewellers will depend on it to acquire customers and generate real commercial revenue every day.**

The final standard is a secure, beautiful, reliable and economically sustainable autonomous AI workforce, with meaningful owner control and measurable outcomes.