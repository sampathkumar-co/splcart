# GitHub foundation reuse decision (2026-11-14)

## Why this exists
The owner requested that the headquarters reuse existing, fully implemented open-source projects instead of rebuilding every feature. The original MVP primarily used libraries, which is not the same as evaluating and adapting a ready-made 3D agent office. This document is the checked foundation shortlist and incremental integration contract.

## Candidates checked at source
| Upstream | License | Reusable capability | Decision |
| --- | --- | --- | --- |
| [iamlukethedev/Hermes3D](https://github.com/iamlukethedev/Hermes3D) | MIT, verified against upstream LICENSE | Next.js 16 / React 19, 3D office scene, room camera fly-to, React Three Fiber controls, presence/activity and runtime adapter concepts; supports an HTTP custom-runtime seam | **Primary office reference.** Port isolated tested interactions and visual systems incrementally, with MIT attribution. Do not import Hermes-only services or demo agent data. |
| [JuniorXcoder/hermes-virtual-office](https://github.com/JuniorXcoder/hermes-virtual-office) | MIT (upstream) | Multi-floor office, genuine duty-state prioritization, desks and approval/verification flows | Secondary reference for truthful activity state; strongly tied to Hermes CLI and not ready for drop-in backend integration |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | MIT (upstream) | Model-driven browser computer use, persistent Chromium sessions, tab navigation and page interaction | Future research worker candidate; Python/CDP service boundary and extra isolation/cost controls needed. Current operator-triggered Playwright inspector remains until separately tested |
| [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot) | MIT *application shell*; CopilotKit Intelligence separately licensed | Tool permissions, per-agent computer sessions, AG-UI, activity/audit and approvals | Evaluate protocol/policies only until production licensing and runtime resource requirements are confirmed |
| [Gaurav2693/ai-office](https://github.com/Gaurav2693/ai-office) | MIT (upstream) | Small React 19 + Three.js isometric animated office | Not selected for primary foundation: no backend, miniature/cartoon styling conflicts with owner's premium jewellery aesthetic |
| [TobyKThurston/TheOffice](https://github.com/TobyKThurston/TheOffice) | Undetermined at review | 3D agent desk/terminal integration | **Do not copy** until redistribution license is established |

## Implemented reuse
- `components/office-camera.tsx`: reworked and attributed **Hermes3D's CameraAnimator pattern** to fit our four jewellery departments, without retaining its Hermes runtime dependencies; original upstream `src/features/retro-office/systems/cameraLighting.tsx`.
- `components/office.tsx`: clickable desks select real room camera targets; added an overview reset control. Camera transitions honor reduced-motion settings.
- `docs/third-party/Hermes3D-LICENSE.txt`: upstream MIT notice included for derived code.

## Architectural boundary
Our bespoke wholesale PostgreSQL domain and API remain authoritative. The 3D frontend is only a visualization of persisted execution evidence, not a simulated workforce. Do **not** start a demo gateway or display demo employees as genuine active agents. All browser research remains owner authorized, restricted to permitted independent business sites. External contact remains owner approved.

## Next reuse acceptance gates
1. Integrate additional Hermes3D room, geometry and lighting building blocks behind a scene adapter *only after* auditing all source imports, textures/models and their licenses. Do not overwrite our working wholesale UI.
2. Test on Chromium at 1920x1080 and a laptop-sized viewport: click each desk, camera flies to the correct room, overview resets, no clipping, text readable, 2D fallback functional.
3. Confirm reduced-motion preference produces instantaneous transitions and WebGL rendering is optional.
4. Feed office states from database research runs, not time-based mock activity.
5. Pilot browser-use as an isolated optional worker *after* DNS/IP sandboxing, site-policy checks, limits and real-site test evidence. Never use it to evade website restrictions.
6. Evaluate the Hermes3D custom-runtime HTTP seam and OpenBot AG-UI pattern, but preserve our own explicitly audited workflow permission gates.

## Transparency
These are **source-based evaluations and first adapted camera code**, not claims that the entire Hermes3D, browser-use or OpenBot products have been integrated. Upstream API stability, 3D render quality and live-browser end-to-end testing are not yet established.
