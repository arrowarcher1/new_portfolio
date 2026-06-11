# Portfolio Three.js Redesign — Design Spec

**Date:** 2026-06-10
**Status:** Approved (user delegated final decisions via /goal: "do whatever you think would look best and most impressive and implement until you have finished")

## Concept

Full remake of andrewvo.dev as an **immersive scroll journey** (creative statement piece — user chose wow-factor over skim-speed). The entire site is one Three.js scene: scrolling moves the camera along a path through a **dreamlike aurora void** in which **low-poly diorama islands** float as destinations. Chosen during brainstorming from four concept directions and four world themes; the hybrid "dioramas in a dream void" was selected over pure dreamscape and pure low-poly.

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| Concept direction | A — immersive scroll journey (whole site is one 3D scene) |
| Primary goal | Creative statement piece; exploring is the point |
| World theme | Hybrid: abstract aurora/particle void + low-poly diorama islands |
| Featured projects | Top 3 as islands: **Converge, Truth Trail, ProfPair** (chosen as the most substantial/award-winning); LCRS, ASL, and the portfolio itself in a compact "archipelago" cluster |
| Project detail UX | Glass side panel (decided by Claude under /goal): glassmorphic HTML panel slides in when camera settles at an island — most readable, accessible, proven pattern; subtle in-world flourishes allowed |

## Journey structure (scroll order)

1. **Hero** — name + title floating in the void, slow camera drift, scroll hint
2. **About** — short bio panel while drifting past ambient geometry
3. **Experience** — Oracle / Lehigh / Vomar as a floating timeline (constellation-like markers)
4. **Featured projects** — camera glides to each island: Converge → Truth Trail → ProfPair; glass side panel with description, tech tags, achievements, gallery image, links
5. **Archipelago** — LCRS, ASL, Portfolio as compact cards near a small island cluster
6. **Skills** — skill categories as orbiting/floating clusters with HTML panel
7. **Contact / Resume** — final clearing: email, GitHub, LinkedIn, LeetCode, resume PDF link

A slim progress nav (dots/labels) lets visitors jump between journey stops.

## Architecture

- **Stack:** Vite + React 18 + three + @react-three/fiber + @react-three/drei. Framer Motion stays for HTML overlay animation. Tailwind stays for overlay styling. CRA (react-scripts) is removed.
- **Scroll:** drei `ScrollControls` (pages = journey length); camera rig interpolates along a `CatmullRomCurve3` from scroll offset, with per-stop look-at targets and gentle mouse parallax.
- **Dioramas:** procedural — built from Three.js primitives in code (no external model assets). Each island: rock base + themed scene (Converge: two hologram agents exchanging offers; Truth Trail: linked chain of glowing evidence cubes; ProfPair: tiny campus with matching beams).
- **Background:** custom shader plane / large sphere with animated aurora gradients + instanced star/particle field + fog.
- **HTML overlay:** drei `Scroll html` layer; sections positioned per page offset; glass panels (backdrop-blur) animate in/out based on scroll proximity.
- **Data:** existing PROJECTS / SKILL_CATEGORIES / EXPERIENCES / links extracted unchanged into `src/data/content.js`.

### File layout

```
index.html                 (Vite root)
src/main.jsx
src/App.jsx                (Canvas + ScrollControls + overlay)
src/data/content.js
src/scene/CameraRig.jsx
src/scene/VoidBackground.jsx
src/scene/Particles.jsx
src/scene/islands/*.jsx
src/ui/*.jsx               (panels, nav, sections)
src/styles/index.css
```

## Error handling & fallbacks

- **No WebGL:** detect and render a clean static HTML version (same content, no canvas).
- **prefers-reduced-motion:** disable camera parallax/idle animation amplitude; scroll still works (it's user-initiated).
- **Performance:** `dpr={[1, 2]}` + drei `AdaptiveDpr`, instanced particles, low-poly geometry budgets, fog culling; reduced particle counts on small screens.

## Out of scope

- Dark/light toggle is dropped — the void is inherently dark; one polished dark aesthetic.
- React Router (single journey page).
- CMS/data changes — content is identical to current site.

## Testing / verification

- `npm run build` passes.
- Manual visual verification in dev server (screenshots at each journey stop).
- Existing CRA test scaffolding removed with CRA.

## Deployment

Vercel auto-detects Vite (`dist/` output). `public/` assets (images, resume.pdf) carry over unchanged.
