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
