# Operating the no-paid-API-key AI Headquarters

This guide is for **the separate Prasanth Jewellers AI Headquarters**. The owner explicitly forbids merging it with the SPLCART storefront. The store, its code, credentials, checkout, database and deployment remain untouched. [Read the permanent system boundary](SYSTEM_BOUNDARY.md).

## What "no API keys" actually means

- **No paid AI/model API keys or social platform API tokens** are required for the implemented local research recording, deterministic lead matching, quotation workflow, image processing, FFmpeg rendering, daily local scheduling, or source-based role reports.
- The HQ **still needs independent local authentication secrets**, a private database password and a browser-worker bearer secret. These are internal security credentials, **not paid AI API keys**. Never reuse store credentials.
- FFmpeg, Sharp, PostgreSQL, Playwright, Next.js and TypeScript run on your own compute; that still consumes hardware time, electricity, storage, memory and any applicable VPS charges. **Model API charges of ₹0 do not mean total operating cost ₹0.** The database records `modelCostPaise=0` and correctly marks compute cost as `NOT_METERED`.
- No live Instagram/YouTube/WhatsApp login, posting, mass private-messaging, compliant public telephone caller, or proprietary photorealistic human-wearing-jewellery generator exists just because source code can open a browser. Such integrations require separate permissions, real authenticated sessions/services and compliance checks. We do not pretend they are working.

## Daily jewellery video workflow

1. Open **Product Intelligence** and register a genuine owner-stated jewellery title, material, quantity, owner SKU, and a public HTTPS product reference. This does **not** fetch from or write to the SPLCART store.
2. Open **Creative Studio**. Choose the registered product and **upload your own licensed JPEG or PNG photograph** (up to 3 MB, minimum ~350×350 pixels after processing). No artificial catalogue data or fake customer testimonials are inserted.
3. Click **Queue original 20-second Reel**. The local `hq-creative` worker writes a real 20-second silent 720×1280 H.264 MP4 using image movement and code-native gold/ivory typography. A render is **RENDERED** only after FFmpeg successfully produces and validates a file; an error becomes **FAILED**.
4. Watch the actual HTML5 video, review product facts, and choose **Approve video**. This is an owner-only action; it does **not** post or send messages.
5. Copy the Instagram/YouTube caption, download the approved MP4, and **manually publish from your own account**. The studio will not access the social account or upload without permitted integration.
6. After real manual publishing, optionally enter the official Reel/Short URL. This produces a **SocialPublication** marked `OWNER_REPORTED`, not verified by the platform.
7. Enter views, likes and enquiries you personally observed, with a public source/reference link. Each new entry is a time-stamped **owner-reported snapshot**. Unknown metrics stay unknown (not silently zero), and prior snapshots must never be added together as separate views. The local **Marketing Performance** workstation can summarize these records but cannot claim independent platform verification.

### Optional two or three Reels per day

- Choose **2 Reels/day** or **3 Reels/day** in the Creative Studio. This setting is **off by default** and saved with an audit event.
- If enabled, the dedicated local worker checks about every five minutes and queues new 20-second video jobs according to the **Asia/Kolkata calendar day**.
- The schedule uses owner-uploaded photos from **different product records** for that day. With only one eligible real product photo, it creates **one** job rather than inventing the missing video.
- Repeated checks are deduplicated by `(assetId,scheduleDate)`; the worker bounds its queue and does **not** auto-approve, publish or call external services.
- Choose **Disable** at any time to stop future scheduling. Existing render jobs are not silently deleted. Voiding pending jobs is a separate explicit action.

## Real 16-workstation HQ

The office shows sixteen **named roles**, but does not invent sixteen always-on paid models. Thirteen roles have implemented owner-triggered **local evidence/report tools**, which read real HQ database records and create auditable `AgentTask` rows. An on-demand task can finish with a truthful **BLOCKED** result if its required owner-supplied evidence does not exist.

The implemented local actions: executive evidence report, marketing workload, browser-source research archive, real-photo creative briefs, real render status, owner-approved manual social handoff, owner-reported marketing metrics, sales lead review, category-only jewellery matching, eligible/manual follow-up list, permissioned wholesale relationships, owner-reported retention candidates and existing manual Playwright web research.

Three platform-dependent roles remain **NOT_CONFIGURED**: customer conversation (no opted-in incoming account), Instagram lead discovery (owner manually researches; no platform scraping/unsolicited DMs) and AI wholesale calling (no compliant authorized calling service). Website public contact details are not permission to call.

### Optional daily local 16-role evidence reports

The **Headquarters** workstation console now offers **Enable daily briefing** and
**Disable daily briefing**. This is disabled by default, owned and audited by the
HQ owner, and checks the HQ-only database at **08:30 Asia/Kolkata** on each
India-local calendar day. The separate `hq-agents` service has **only the isolated
HQ database network**: no outbound internet, public listening port, browser,
phone number, messaging adapter, paid model key or social account credentials.

A daily run records sixteen distinct `AgentTask` results, not sixteen paid
AI conversations or simulated employees. Each role evaluates *real saved HQ
evidence* using the existing deterministic local reporter; if an external
service, evidence, or permission is missing its result is **BLOCKED**.
The CEO can inspect historical results using the same 16-workstation panel.
A PostgreSQL advisory lock, a once-per-local-day marker and a single transaction
prevent multiple workers from duplicating a scheduled batch.

The owner can still run the **Assess all 16 roles** button independently.
Turning off the daily schedule prevents future scheduled batches but does not
delete audit history, interfere with owner-triggered reports, or cancel existing
videos. Worker start alone does not enable it.

**This is scheduled local evidence reporting, not full autonomous social sales,
customer messaging, Google/Instagram acquisition, legal voice calling, or
an independent 16-model LLM workforce.** Local compute/electricity remains
`NOT_METERED`; paid model API usage stays zero.

### No fabricated proof

- A captured website is not a legally verified retailer; business evidence requires owner source review.
- A lead is not an opted-in contact; explicit eligibility and owner approval are separate.
- A quote is not an actual paid order; an owner-reported order is not payment-reconciled revenue.
- A local rendered MP4 is not a social publication; an owner-entered social link is not an independently verified platform event.
- Source-generated marketing plans are not authentic market forecasts.

## How to run locally

Run a **standalone** Node 22+/PostgreSQL 17 HQ with dedicated secrets and HQ-only data. Read [SECURITY_AND_DEPLOYMENT.md](SECURITY_AND_DEPLOYMENT.md) before using any server. The repository ships a dedicated five-service `compose.hq.yml`: Postgres, owner web app, isolated Playwright worker, isolated FFmpeg creative worker and an internal-DB-only daily role worker. The creative worker has **no outbound social network and no API keys**; browser egress policy is separate and must be audited on the host.

Important verification files:
- `scripts/creative-smoke.mjs`: upload a synthetic **CI-ONLY** image, render a real 20-second H.264 MP4, ffprobe duration, read protected video and require owner approval.
- `scripts/creative-schedule-smoke.mjs`: opt-in 2/day, use the one available test photo, deduplicate and disable.
- `scripts/social-reporting-smoke.mjs`: record a **FAKE CI-ONLY** social URL for database testing, not an actual post; save owner-labeled metric sample and confirm the Marketing Performance task uses source-labeled values.
- `scripts/agent-task-smoke.mjs`: run actual local no-key evidence tasks, refuse missing external calling/Instagram capability, never count verified revenue.
- `scripts/agent-schedule-smoke.mjs`: exercise real owner opt-in/disable, three competing isolated role workers, one source-labeled 16-role batch, truthful platform blockers, and daily deduplication.
- `scripts/office-e2e.mjs`: inspect 3D, source-based GM task, 2D fallback, approved real MP4/quote, owner pause and mobile UI using actual Chromium.

All CI sample customers/photos/links are disposable **fixtures**, never business results. A successful CI pass establishes tested code paths, not a secure external deployment or automatic customer acquisition.

## What remains dependent on a real operator/host

A separately secured HQ domain and HTTPS, a real host-enforced browser egress firewall, a browser sandbox verification, real owner product photographs, manual permission/terms review for independent retail websites, real buyers, customer outreach consent, authentic store-independent payment evidence if verified revenue is desired, backups including media plus PostgreSQL, and genuine operator approval of 3D UX on their computer. None requires modifying or merging SPLCART.

**Project rule: Keep PR #1 draft and unmerged. No changes to live SPLCART.**
