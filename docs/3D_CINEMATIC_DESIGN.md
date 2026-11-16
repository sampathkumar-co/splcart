# The Intelligence Atelier · 3D design and visual acceptance

The owner asked for a striking, premium, **genuinely interactive** 3D experience,
not a static image of an office. The separate Prasanth Jewellers Headquarters
is implemented in `components/office.tsx`, `components/office-camera.tsx`
and `components/office-luxury.tsx`. **Nothing here integrates into SPLCART.**

## Design language

- **Obsidian and veined marble.** Four different seeded, deterministic
  256-by-256 DataTextures are generated in code in
  `createStoneTexture`, using mineral-style veins, no remote texture CDN,
  paid asset pack or AI-generated picture to stand in for editable 3D.
- **Champagne gold and satin pewter.** Open Art Deco exterior, restrained rear
  ceiling ribs, stone pedestal and recessed brass lines. The front is
  deliberately open to the owner/camera, not a cage obscuring the desks.
- **Architectural lighting.** Open-roof gilded pendant rings, readable display
  panels, soft workstation lighting and a visually different "After hours"
  mood. The lighting is decorative only and does **not** indicate agent work.
- **Four differentiated rooms:** CEO executive lounge and jewellery sculpture;
  Sales with nine actual source-state workstations and restrained vitrines;
  Marketing with six workstations, physical code-native Reel set and ring
  lighting; Strategy room with conference table and sculpture.
- **Furniture and screens.** Rounded upholstered seats, stone-and-brass
  desk edges, real-role status screens driven by the authenticated HQ
  API's `AgentRecord`. `RUNNING` cannot appear without real task data.
- **Immersive presentation.** Camera-based room navigation, manual mouse/touch
  orbit, accessible keyboard room buttons, "Cinema" to resize the genuine
  WebGL viewport, "After hours" for physical light changes, "Performance"
  to omit richer décor and lower device pixel ratio; all modes are local
  visual preferences, not tasks or fabricated analytics.

All original source geometry is programmatically authored with
React Three Fiber, Drei and Three.js. The camera approach derives from
MIT-licensed Hermes3D; the retained notice is
`docs/third-party/Hermes3D-LICENSE.txt`. Do not remove it.

## Close-up workstation camera, with truthful data

The owner's **Inspect selected desk** control moves the real orbit camera from
the current room into a close-up of the *actual* selected role's workstation,
using a single shared room/desk spatial layout in
`lib/office-layout.ts`. Clicking any rendered desk also sets its true role
inspector and requests its corresponding 3D camera. This is reversible with
**Return to room** or **Overview**, and keyboard-accessible. A
genuine **Previous workstation / Next workstation** tour cycles across
the actual sixteen-role roster, including explicitly blocked roles
like Wholesale AI Phone Calling. Touring never executes or schedules
a task.

The highlighted workstation panel displays the authenticated role name,
persisted status (`ON_DEMAND`, `RUNNING`, etc.) and recorded completions.
It cannot invent AI work because no status or evidence metric is manufactured
by the scene. All 16 camera targets are verified against real desk positions
with `tests/office-layout.test.ts`. Unknown roles receive no camera target.
The first camera lens was physically obscured by a foreground wall banner;
actual screenshot inspection led to a higher, shallower overhead station
pose (the layout tests now check that sightline).
The independent Chromium test captures a **genuine focused WebGL screenshot**
and compares the rendered pixels to the overview frame.

## 3D Workstation Evidence Explorer (2026-11-16)

Clicking a real desk now opens a premium, compact **recorded work log** next to
the 3D camera view. It is strictly derived from the *same* authenticated
Headquarters task snapshot as the physical monitors. The owner sees up to three
most recent persisted checks for that selected role, their exact reported
statuses, India-local timestamps, short real outcome summaries and, when a
source URL is present and passes HTTPS/public-host validation, a clickable
**Inspect source** citation. Empty history says **No task recorded**.
A stale `RUNNING` DB row is visibly marked *not confirmed live* if the
role is no longer running. The currently loaded dashboard contains only
its most recent 25 tasks; the interface discloses this rather than claiming
an exhaustive history.

The action **Open [relevant] workspace** navigates straight from the 3D
desk to the real research, wholesale pipeline, owner catalogue, local creative
studio or manual customer inbox, depending on the authorized role. A blocked
voice/Instagram desk may open the existing owner-managed leads workspace
but **does not** claim a connected voice/Instagram integration.

For the 14 locally operational `ON_DEMAND` evidence roles, the desk also has
**Run local evidence check**. It calls the *existing* authenticated
`/api/agents/run` owner action, waits for its audited task outcome,
and reuses the current dashboard refresh to show the newly persisted
task history. The two unconfigured roles never expose this run button.
No third-party outreach, subscriptions, social posting, voice calls,
SPLCART application integration or paid-model inference is initiated.

Implementation: `lib/workstation-activity.ts` (pure safe routing,
time-ordered task derivation and HTTPS public-source checks),
`components/office-task-ledger.tsx` (accessible task explorer),
`components/office.tsx` (selected desk evidence controls),
`components/headquarters.tsx` (existing authorized callbacks) and
`app/globals.css` (warm black/brass/emerald responsive styling).
`tests/workstation-activity.test.ts` guards exactly the 16 roles,
true source attribution, stale task states, empty data and malicious
links; `scripts/office-e2e.mjs` exercises a genuine owner-triggered
local role check from the 3D view, verifies persisted history and
navigation to the actual research interface through Chromium.

All task records in automated acceptance are synthetic **CI-only fixtures**,
not evidence of customer conversions or independent autonomous browsing.
This feature does not establish production hosting or owner GPU FPS.


### Verified data source connectivity

The 15-second authenticated `/api/dashboard` refresh is the *only*
real-work telemetry source. A successful refresh sets **HQ SNAPSHOT LIVE**;
any failed refresh immediately replaces this with **SOURCE NOT VERIFIED**
and an explicit 3D warning that previously captured counts/states may be
outdated. Local role-check buttons, all-role readiness controls and daily
briefing toggles are paused while source health is unverified.
Restored authenticated source data re-enables controls without dropping
previously saved records. An absent connection never silently leaves a
frozen `RUNNING` badge presented as reliable real-time activity.

The browser QA deliberately aborts the dashboard endpoint in authenticated
2D mode, checks the offline notice and disabled controls, restores access,
then asserts a successful authenticated refresh re-enables work. This
test does not make any claim about continuous production uptime or real
WebSocket streaming. The UI is source-polled, not a telemetry socket.

## The Evidence-Lit Atelier: screen truth and jewel-tone atmosphere (2026-11-15)

**The office monitors are no longer status stickers.** The owner authenticated
`/api/dashboard` returns persisted `agents` and `agentTasks`; the
Headquarters passes both unmodified to the real Three.js scene. The new
`lib/workstation-display.ts` maps precisely the 16 authorized roles to
**actual source-grounded micro-screen models**. Each small monitor shows its
role title, specific capability, actual RUNNING / ON DEMAND / NOT CONFIGURED
status, persisted evidence count, last recorded report outcome and the
most recent **actual** task-history strip. An empty database shows
**NO RECORDED TASK HISTORY** and **NO TASK RECORD**, not fake bars, progress,
visitors, fake phone calls or made-up trends. Phone and Instagram remain
unconfigured even if an unrelated/stale task row appears. Last report
summaries are sanitized for whitespace and visually truncated.

The same authenticated dashboard additionally exposes **aggregate, data-minimized
operational signals**: fresh local FFmpeg render jobs (with stalled/queued
distinction), recently completed actual browser inspections, owner-recorded
open inquiries, owner-approved/prospect-review counts and manually logged
publications. These are taken from independent HQ PostgreSQL tables, never
SPLCART or external Instagram/WhatsApp/Google account APIs. Current rendering
and browser sessions are time-bounded, so an old unfinished row cannot
advertise a worker as permanently RUNNING. Small monitor text always labels
whether an observation covers recent 100 jobs or recent 30 browser runs.

The materialized display textures are generated at runtime by
`components/workstation-screen.tsx` using local Canvas 2D + Three.js
CanvasTexture. This is an **actual screen surface in WebGL**, not an
external video, baked image, or static marketing mockup. Textures are
disposed on update/unmount and geometry is shared. They update whenever
the existing 15-second source-only dashboard polling delivers changes.
No additional API keys or extra server/data/third-party model calls.

Each of the **four** rooms additionally has an integrated, legible,
brass-framed **authenticated evidence wall** showing room-specific total
roles, current running count, recent successful task records and unconfigured
roles; the strategy room's scope explicitly says **all HQ roles**.
These counts are computed solely from authenticated current role and recent
agent-task snapshots, not historical claims. The selected workstation inspector
also mirrors its current screen purpose/outcome, making tiny screen contents
accessible with keyboard and screen readers.

The new showroom palette is intentionally richer while retaining dark premium
materials, e.g.:

| Surface | Color | Hex | Role |
|---|---|---|---|
| Architecture | Obsidian | `#0B0F12` | Anchoring contrast |
| Glass, smoked metal | Graphite | `#121922` | Depth |
| Metal inlays | Champagne gold | `#D4B06A` | Jewellery luxury |
| Readable UI | Pearl ivory | `#F3E9D7` | Warm legibility |
| Executive | Champagne gold | `#D4B06A` | Leadership |
| Sales intelligence | Emerald | `#33BA99` | Evidence and wholesale |
| Marketing studio | Plum | `#B18DD4` | Creative distinction |
| Strategy room | Sapphire | `#6DB4E8` | Research and decisions |
| Not configured | Soft ruby | `#DE7B7D` | Truthful unavailability |

Original code-native wall illumination, warm brass-finished monitor frames,
recessed room edge lights and slow decorative ambient reflections add depth.
Decorative lighting **never** switches a status to RUNNING. No repetitive
fake worker avatars, fake progress bars or phantom activities. Reduced-motion
users get static ambience; the original zero-idle-animation WebGL demand
frame loop stays intact. The independent low-power `/2d` entry is unaffected.

**Acceptance:** `tests/workstation-display.test.ts` covers all sixteen
unique roles, real saved task evidence, empty-task states, unconfigured
provider safeguards and room-specific accents. `scripts/office-e2e.mjs`
asserts actual source-only web-desk screen text and disabled phone-screen
information in a real signed-in Chromium session, with PNG visual evidence
in GitHub Actions artifacts. CI-only inputs are fake fixtures, **not real
retailer demand or revenue**. Actual Windows GPU frame pacing and final
art-director visual approval remain to be measured.

## Visual quality acceptance

- `scripts/office-e2e.mjs` uses real Chromium and actual WebGL canvas pixel
  sampling to ensure the office is not a blank rectangle. It moves between
  four camera poses, clicks actual role controls, tests real mouse orbit,
  owner sessions and a fully usable 2D/mobile fallback.
- It captures real scene pixels for signature/daylight, after-hours,
  performance, cinema and all four room poses, checks that a change of
  mood/detail actually changes pixels, and checks that cinema physically
  enlarges the scene.
- Scene status data remains sourced from the authenticated HQ API. The
  3D materials do not fabricate busy workers, fake video outputs or sales.
- `frameloop="demand"` avoids continuous rendering while idle; the
  cinematic camera invalidates frames only during user-triggered transitions.
  Device pixel ratio is capped (signature 1.5, performance 1.2). The
  camera honors `prefers-reduced-motion`.
- Cloud Chromium uses **software WebGL**. That proves a real rendered scene
  and clickable browser controls, **not** measured 60fps on the owner's
  laptop GPU or photorealism on every display. Inspect artifact images on
  the current successful Actions run; never invent screenshots.

## Direct low-power Headquarters entry

The owner can open **`/2d`** on the independent protected Headquarters
domain, or use the visible **Low-power HQ** link beside the 3D mode button.
Unlike a 3D toggle after the main page already loaded, this route
server-renders `<Headquarters initialVisual={false}/>`, so **no WebGL Canvas
is mounted at all** until the owner deliberately chooses **3D OFFICE VIEW**.
The existing signed session proxy protects `/2d` exactly like `/`.
It does not bypass business permissions, load fake data or touch SPLCART.

Browser acceptance tests exercise premium 3D in one authenticated browser
tab, then run genuine customer enquiry/owner approval/business workflows in
fresh protected `/2d` tabs, preventing a software-GPU stress sequence from
blocking ordinary controls. Three.js static architecture also shares unit-box
and unit-cylinder GPU buffers (`dispose={null}` prevents premature cleanup
of shared geometry on mode changes) rather than allocating redundant buffers.

## Known limits

This is still a *procedurally built, architectural 3D interface*, not a
photoreal path-traced walkthrough with licensed design models or a full
first-person avatar simulation. A production-grade owner GPU profile,
measured frame pacing on Windows, anti-aliasing/lighting calibration,
accessibility audits on touch hardware and final visual owner approval
are outstanding. Prefer useful owner navigation and real evidence over
a large effect library that slows down the real sales interface.

The separately deployed Headquarters website/host is still NOT
production-verified. Storefront code, checkout, API and data remain
completely untouched. **Keep draft PR #1 unmerged.**
