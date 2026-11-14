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

## 2026-11-14 owner directive — finish using existing GitHub foundations

**Current priority:** deliver the most complete independently testable wholesale acquisition vertical possible, backed by a usable ultra-premium 3D office. The owner explicitly prefers adapting existing, license-verified GitHub code rather than rebuilding established components. This instruction supersedes any earlier preference to craft every 3D interaction from scratch.

**Reuse contract:** [Hermes3D](https://github.com/iamlukethedev/Hermes3D) is the primary MIT-licensed source for office camera/scene/agent-runtime patterns. Preserve notices in `docs/third-party`; audit imported code and assets before each import. Adapt in isolated components. Do not transplant Hermes-specific services, sample businesses or simulated agent runs. Reuse [browser-use](https://github.com/browser-use/browser-use) only once an isolated Python/browser worker and its site permissions, network policies and metered model costs are tested; owner-triggered direct Playwright research is the current safe real-browser fallback. Full comparison: `docs/GITHUB_FOUNDATIONS.md`.

**Product acceptance criteria for the first customer-acquisition release:**
1. One independently permitted business website can be inspected through a real, recorded Playwright browser execution with actionable evidence and honest failure states. No Google/Maps mass scraping, CAPTCHA bypass, or pretend browser sessions.
2. An independently source-linked retailer is deduplicated and associated with owner-entered or genuinely read-only-verified SPLCART products. Every source, price and material assertion carries provenance; unknown price/availability = unknown.
3. Deterministic scoring cannot assign verified price advantage without same units/materials, genuine confirmed catalogue and delivered-price evidence.
4. Owner can approve/reject, document contact eligibility, manually record actual outreach/quote, and reconcile a genuine sale only after confirming payment through an inspected trusted order source. Reported sales are never verified revenue.
5. A high-fidelity dark champagne-gold architectural office exposes *all sixteen role workstations* without falsely implying they run. Real browser, approval and sales states can be inspected from an accessible 2D alternative.
6. GitHub CI checks type safety, unit/domain rules, PostgreSQL/API workflow and Next production build. Chromium/WebGL visual QA and external integration results must be explicitly reported separately.
7. Existing live SPLCART storefront remains untouched. HQ stays a separate app, on a draft PR until actual browser/source-policy, security and deployment gates pass.

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