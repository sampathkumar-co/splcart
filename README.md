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

The five-service `compose.hq.yml` (HQ web, HQ database, browser research worker, creative FFmpeg worker, internal-DB-only local 16-role reporting worker) is a **deployment scaffold, not a deployed site**. It keeps the database on its own internal network and exposes the web app only on the server's loopback port. Production research remains fail-closed without a token-authenticated browser worker and a verified host-level outbound firewall. Read [SECURITY_AND_DEPLOYMENT.md](docs/SECURITY_AND_DEPLOYMENT.md) before any deployment. Never merge the draft PR or use the SPLCART server/database.

Schema changes are now captured in the dedicated HQ `prisma/migrations` directory. Use `npm run db:deploy` after taking a backup; do not apply destructive schema pushes to persistent data.

A dedicated **HQ-only** backup script is available at `scripts/hq-backup.sh`. GitHub Actions verifies actual `pg_dump` and `pg_restore` into an isolated temporary PostgreSQL database using `scripts/ci-backup-restore.sh`. An encrypted off-host backup plan and target-host recovery test remain separate deployment requirements. The browser policy also forbids automated research against SPLCART domains, though a public SPLCART product link can still appear in the HQ catalogue.

## No paid AI API key creative and agent workflows

**Owner photos → actual local FFmpeg Reels.** Register a genuine independent product reference, upload an original JPEG/PNG photo to Creative Studio, queue a Reel, and let the local FFmpeg worker render a real **20-second silent 720×1280 H.264 MP4**. Only a successfully rendered file can be approved. Approval is for manual use, not an Instagram/YouTube post. There are no paid AI-video calls, no generated human models, and no invented discounts or testimonials.

**Opt-in daily 2–3 Reels.** The owner may enable two or three locally rendered photo-based videos per India-local day, subject to existing distinct owner photos and bounded queue size. Disabled by default; repeated checks are deduplicated. Videos are never automatically sent or published.

**Manual post and marketing feedback.** An owner can copy grounded Instagram/YouTube captions, publish manually from their own account, then record the official post link and directly observed metrics. Every external link and metric is labeled **OWNER_REPORTED**, never platform-verified. Marketing Performance can prepare an on-demand source-linked report but no authenticated platform analytics is connected.

**Optional daily local 16-role briefing.** The owner may explicitly enable a single source-based readiness sweep each day at **08:30 Asia/Kolkata**. The dedicated `hq-agents` container accesses only the HQ database through an internal Docker network and persists role outcomes with a transaction-guarded once-per-day marker, even if several workers race. Unsupported social, voice and inbound-conversation roles remain `BLOCKED`. The owner can disable future runs in the workstation console. No external AI or messaging APIs are called and no actual customers/revenue are implied. This is not a fully autonomous 16-agent company.

**16 roles, without fake autonomous staff.** The 3D scene and accessible roster expose sixteen named jobs. Fourteen have real **owner-triggered local deterministic reporting/evidence tools** that persist outcomes and cost labels in `AgentTask`. Tasks needing records can explicitly return `BLOCKED`. Outbound calling, connected inbound message automation, and Instagram cold lead discovery remain unconfigured without compliant external connections, permissions or platform access. The new Customer Inbox supports ONLY owner-transcribed, customer-initiated enquiries and manual reply logging, never automatic WhatsApp/Instagram reading or sending. No 16 always-on AI models are running.

**Computing is not free.** The implemented local model API charge is zero, but electricity, CPU/GPU time, VPS, storage, manual work and production monitoring are **not metered**. Do not confuse `modelCostPaise=0` with total business operating cost ₹0.

The authoritative walkthrough is [NO_API_KEYS_OPERATIONS.md](docs/NO_API_KEYS_OPERATIONS.md), including image rights, proof labels, 2/3-Reel scheduling, publishing handoff, role task limits and CI tests.

## Real open-source office reuse and quality gates

- Reused the **MIT-licensed Hermes3D camera-navigation pattern** with attribution and copyright retained in [docs/third-party/Hermes3D-LICENSE.txt](docs/third-party/Hermes3D-LICENSE.txt). Added original jewellery-branded architectural geometry and data-driven workstation placement; **the full Hermes3D application has not been imported**. [Foundation audit](docs/GITHUB_FOUNDATIONS.md).
- Real Playwright Chromium UI acceptance test: `scripts/office-e2e.mjs`. Verifies 16 status-linked workstations, 3D canvas, 2D fallback, responsive viewport and browser screenshots. Its canvas pixel-diversity assertion detects an empty WebGL scene.
- GitHub Actions CI also runs the API/PostgreSQL workflow and `scripts/real-browser-smoke.mjs`, an actual two-tab HTTPS visit to neutral IANA `example.com`. **The sample domain is never treated as a business lead.** External networking can make this smoke check fail; inspect its log rather than claiming success.
- The 3D canvas must remain useful on laptop GPUs, and the full sales workflow must remain possible through the 2D controls.
- Every new coding chat must first inspect [AGENTS.md](AGENTS.md), current PR and latest CI; update the chronological handoff after substantive changes.
- Both source-evidence review and quote approval have automated HTTP + PostgreSQL regression checks, and the quote clipboard can be exercised in a real Chromium session. See `tests/source-evidence.test.ts`, `tests/quotation.test.ts`, `scripts/smoke.mjs`, and `scripts/office-e2e.mjs`.

## Known blockers and safety

- **SPLCART storefront integration is explicitly out of scope.** There is no storefront API connection, database access, webhook, checkout change or authorized write. HQ stores only independently owner-entered product references. Verified revenue requires separate trustworthy financial evidence; no paid order reconciliation is implemented.
- No automatic outreach, no Instagram DMs, no promotional calls, no external publishing, no unapproved spending. A recorded manual social URL is not platform verification.
- An observed competitor price is **not** a proven comparable wholesale offer. `OWNER_ATTESTED` prices do not qualify for competitive advantage points.
- Public contact details do not grant permission to send messages. Website terms, robots constraints and Indian calling/messaging requirements must be respected.
- The initial app demonstrates a verifiable operator-assisted pipeline, **not** an already-running autonomous 16-agent business.

See [AGENTS.md](AGENTS.md) for the design, completion standard and next milestone.

## Customer Conversation (manual owner-recorded inbox)

The separate HQ **Customer Inbox** records only actual customer-initiated messages the owner personally transcribes. Each record is `OWNER_RECORDED` (not platform-verified), includes the original channel, nickname, category, limited text and status. No contact details are required. A local category-matched product reference may generate an **editable** draft, but current price, stock, delivery and specifications are NOT verified. The owner must personally send through the original channel and explicitly confirm that manual act before it can be recorded; repeated replies are rejected. This feature does **not** connect to social accounts or provide automatic inbound support. No unsolicited marketing consent is inferred. All data belongs to HQ, not SPLCART.

### Customer privacy controls (HQ only)

The Customer Inbox now supports explicitly confirmed live-record erasure and an owner-triggered, closed-only retention purge for enquiries last updated over 30/90/180 days ago (max 100 per action). Open/unclosed replied enquiries survive bulk purge. Private nicknames in old Customer Conversation task reports and copied closure notes are redacted. **Previously created encrypted backups require a separate expiry process** and are not implicitly erased. No automatic data purge or connected social inbox is operating. Detailed instructions: [No API Keys Operations](docs/NO_API_KEYS_OPERATIONS.md). Full-project progress: [Completion Scorecard](docs/PROJECT_COMPLETION_SCORECARD.md).


### Intelligence Atelier · real interactive 3D architecture

The four-room office is an actual React Three Fiber/Three.js scene, not a background
image or simulated employee animation. The code-native visual layer features
procedurally veined marble, an open brass/stone architectural pavilion, jeweller's
sculptures and showcases, upholstered desks/chairs and distinct CEO, Sales,
Marketing and Strategy interiors. Every workstation continues to display the
authenticated HQ agent state rather than invented activity. Owners can click desks,
orbit freely, focus all four rooms, and use the accessible 2D fallback.

The scene also offers **Cinema** (physically larger WebGL viewport), **After hours**
(real lighting changes) and **Performance** (less decorative detail and capped lower
DPR) controls, plus reduced-motion camera transitions. No commercial 3D assets,
generative-video service or paid model keys were added. Exact implementation,
visual acceptance procedure and honest performance limitations are documented in
[The Intelligence Atelier · 3D design](docs/3D_CINEMATIC_DESIGN.md).

These visual improvements are not evidence of real 16-agent autonomy or measured
60fps on the owner's GPU; independent host deployment and physical-device
performance tests remain required.


### Evidence-lit jewel-tone 3D workstations

All 16 real role desks now have individually designed **operational micro-screen
textures** that show their actual persisted role state, latest recorded task,
recent real history (or a clearly empty history), and source. The Web Research,
Reel Generator, Customer Conversation, Social Publishing, General Manager and
Sales Manager screens additionally read truthfully counted HQ research runs,
real recent FFmpeg jobs, owner-recorded incoming enquiry counts, owner-reported
posts and prospective wholesale approvals. No social or voice integration is
invented. Explicitly unavailable Instagram automation and phone calling
remain **NOT CONFIGURED**.

The office also has four larger 3D source-based room information walls, a
richer dark-obsidian/champagne-gold material language, emerald Sales, plum
Creative, gold Executive and sapphire Strategy accents, plus static mood
illumination and slow non-work-related ambient reflection (disabled for
reduced-motion). All decorative textures/meshes are generated by code locally,
use no paid model/provider or externally downloaded 3D assets, and reuse
low-resolution surfaces when the 15-second dashboard poll returns unchanged
data. The 2D-only owner route remains supported.

### New in the Intelligence Atelier: actual workstation camera tour

The real 3D office now supports a physically targeted **Inspect selected desk**
camera, direct clicking on its 16 real workstations, and **Previous / Next**
role navigation. Selected panels display the authenticated role status
(`RUNNING`, `ON_DEMAND`, `NOT_CONFIGURED`) and its recorded evidence,
not simulated agents. The source-of-truth layout is
[`lib/office-layout.ts`](lib/office-layout.ts) with 16 unique camera positions,
and the actual Chromium screenshots verify an unobstructed station perspective.
No paid AI APIs or unlicensed 3D models are involved.

### Operator-only local encrypted-backup expiry

[`scripts/hq-backup-retention.mjs`](scripts/hq-backup-retention.mjs)
is a manual local retention utility for **dedicated HQ `.age` archives only**.
It is read-only by default, requires exact explicit confirmation to apply
and preserves the newest two. It never touches SPLCART, unknown files or
an offsite provider. Review [the operating and safety contract](docs/SECURITY_AND_DEPLOYMENT.md)
before use. No real backup deletion or offsite retention is scheduled,
authorized or claimed by the test suite.

### Evidence explorer inside each real 3D workstation

The browser-research and Reel Generation desks additionally show their
**actual saved website inspections and FFmpeg render jobs**, with source
references or real render states. These are not required to have a
separate local agent report before appearing in the 3D evidence explorer.

The selected desk now shows its recent **persisted** HQ task outcomes,
recorded India-local timestamps, safe source citations, and a direct
link to the matching existing owner workspace. There are no fabricated
calls, browser tabs, leads or progress bars. Authorized `ON_DEMAND`
roles can initiate their existing **local evidence check directly from
the 3D desk**; its real recorded result appears in the task history.
Unconfigured phone and Instagram roles cannot run. See
[3D design and verification](docs/3D_CINEMATIC_DESIGN.md).


**Source health:** stale network data never silently looks live. A failed
Headquarters source refresh shows **SOURCE NOT VERIFIED**, disables local
agent controls, and indicates that prior on-screen statuses may be old.
Successful signed HQ refresh restores controls; no external account
permissions are bypassed.
