# Portfolio Refinement Design

**Date:** 2026-07-13  
**Status:** Approved  
**Branch:** `arrowarcher1/portfolio-refinement`

## Goal

Refine the new trace-based portfolio into the canonical active experience without changing its core identity. Preserve the dark editorial grid, precise typography, lime signal color, and continuous journey metaphor while making the site lighter, more accessible, more useful on mobile, and more clearly tied to Andrew's systems-engineering work.

The portfolio remains a creative statement piece rather than a generic recruiter template. Improvements should increase clarity and robustness without flattening the composition into a conventional card-based site.

## Scope

This pass will:

- Replace the active Three.js trace with a lightweight responsive SVG trace.
- Add a compact mobile journey menu and retain meaningful project context on mobile.
- Implement a genuinely static reduced-motion presentation.
- Improve functional text sizes, contrast, touch targets, section jumps, and keyboard behavior.
- Strengthen semantic structure and disclosure accessibility.
- Rework the Capabilities section from a keyword inventory into proof-backed engineering strengths.
- Correct numbering and refine spacing/composition in About, Experience, Work, and Contact.
- Optimize active entry-point assets such as the favicon.
- Verify desktop, mobile, reduced-motion, keyboard, and production-build behavior.

This pass will not delete the inactive diorama implementation, its assets, or its dependencies. Cleanup and archival of that implementation will be handled separately.

## Visual Direction

The current visual system remains the foundation:

- Near-black background with a subtle technical grid.
- Off-white display typography.
- Lime used as a signal, not as broad decoration.
- Monospaced utility labels for coordinates, metadata, and section markers.
- Large editorial compositions with deliberate negative space.

Refinements:

- Renumber the journey continuously: `01 Home`, `02 About`, `03 Experience`, `04 Work`, `05 Capabilities`, `06 Contact`.
- Reserve sub-10px type for nonessential decorative coordinates only.
- Raise navigation, metadata, project links, and mobile controls to readable functional sizes.
- Increase muted-text contrast while preserving hierarchy.
- Keep the trace out of dense body-copy regions wherever practical.
- Tighten oversized Experience rows and improve the balance of the About composition.
- Keep project imagery in a consistent frame and aspect-ratio system without inventing new project content.

## Architecture

The active page remains a single React route. `App.jsx` will become a composition layer rather than owning every section and interaction.

Proposed active structure:

```text
src/
├── App.jsx
├── components/
│   ├── SiteHeader.jsx
│   ├── MobileJourneyMenu.jsx
│   ├── JourneyIndex.jsx
│   ├── ScrollTrace.jsx
│   └── sections/
│       ├── HeroSection.jsx
│       ├── AboutSection.jsx
│       ├── ExperienceSection.jsx
│       ├── ProjectsSection.jsx
│       ├── CapabilitiesSection.jsx
│       └── ContactSection.jsx
├── hooks/
│   ├── useActiveSection.js
│   └── useReducedMotionPreference.js
└── data/content.js
```

Use the component boundaries shown above. `App.jsx` owns page composition and shared hook outputs; each section owns its markup and section-local interaction; navigation and trace components consume only the active section, reduced-motion state, and stable section metadata.

## SVG Trace System

`ScrollTraceCanvas.jsx` will no longer be mounted by the active application. A new `ScrollTrace.jsx` will render an inert, `aria-hidden` SVG layer.

### Geometry

- Each major section exposes a stable trace anchor using a data attribute.
- The trace measures anchor positions relative to the full document.
- A smooth path is generated through those points with controlled lateral bends.
- The path is rendered twice: a muted base path and a lime traveled path.
- A small node marks the current journey position.
- Section nodes correspond to real content stops rather than arbitrary animation points.

### Updates

Geometry updates only when layout can change:

- Initial mount and font readiness.
- Viewport resize.
- `ResizeObserver` notifications from the document/content container.
- Active project-image load completion.
- Mobile-menu state changes if they affect layout.

The component will not poll layout or run a continuous render loop.

### Scroll behavior

- Scroll progress updates the traveled-path dash offset and current node position.
- Updates are scheduled through `requestAnimationFrame` and skipped when no value changed.
- `IntersectionObserver` tracks the active section for the journey navigation.
- The trace remains decorative and never intercepts pointer events.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- The full base trace renders as a static composition.
- The traveled-path interpolation and moving node are removed.
- Framer Motion reveals, parallax, clipping, filters, and scale interpolation resolve directly to final states.
- The preference is reactive to operating-system changes while the page is open.

## Navigation and Mobile Experience

### Desktop

- Keep the fixed header and left journey index.
- Change the journey index to a navigation landmark.
- Keep active-section indication synchronized through `IntersectionObserver`.
- Add section `scroll-margin-top` values so fixed UI never clips headings.

### Mobile

- Keep the compact wordmark and résumé action.
- Add a keyboard-operable journey-menu control with a clear text label and icon.
- The menu opens a restrained full-width panel beneath the header containing all six section links.
- The current section is indicated in lime.
- Selecting a destination closes the menu and moves focus/scroll to the destination without trapping the user.
- Body scrolling is disabled only while the menu is open and is restored on close/unmount.
- Escape closes the menu and returns focus to the menu trigger.

The menu should look like part of the measured journey system, not a generic hamburger drawer.

## Content and Section Changes

### Hero

- Preserve the existing headline and systems-focused thesis.
- Keep both primary work and résumé actions.
- Improve mobile action sizing and wrapping.
- Keep the trace as the single signature visual.

### About

- Preserve the direct professional copy.
- Give the central narrative slightly more width on desktop.
- Use the left column more deliberately through section labeling and spacing rather than adding decorative content.
- Keep the education/current/research facts concise.

### Experience

- Preserve expandable detail for each role.
- Reduce excessive closed-row height while retaining editorial pacing.
- Give each role a real heading.
- Add stable control/panel IDs, `aria-controls`, and labeled regions.
- Decorative logos use empty alternative text because the company name is already present.
- Expansion state remains keyboard-operable and visible.

### Work

- Keep Converge, Truth Trail, and ProfPair as the featured projects.
- Preserve a concise two- or three-sentence description on mobile rather than hiding it.
- Keep project technologies readable but secondary.
- Standardize media frames, image treatment, and link placement across projects.
- Use accessible external-link labels consistently.
- Additional work uses a real disclosure relationship rather than swapping unlabeled text.

### Capabilities

Replace the broad six-row keyword inventory with a smaller evidence-led set. Each capability pairs a technical strength with work already represented elsewhere on the page. No unsupported metrics or new claims will be invented.

Proposed groups:

1. **Distributed and verifiable systems** — vehicle-title custody workflows, blockchain evidence architecture, real-time coordination.
2. **Compiler and systems research** — LLVM, non-volatile memory, RDMA, correctness and performance work.
3. **Applied AI systems** — agent workflows, matching systems, model-backed product features, cloud AI platforms.
4. **Production engineering** — React/Node services, cloud infrastructure, data systems, testing, and operational tooling.

Technology names remain available as supporting metadata rather than being the section's primary message.

### Contact

- Preserve “Let's build something rigorous.”
- Tighten the supporting copy toward the kinds of technical teams and problems Andrew wants.
- Increase contact-row target sizes and functional text contrast.
- Keep the measured endpoint/node treatment.

## Accessibility

- Add a skip-to-main-content link visible on focus.
- Give `main` a stable target ID.
- Use navigation landmarks for both desktop and mobile journey controls.
- Maintain one `h1`, section `h2`s, and meaningful item `h3`s.
- Provide visible `:focus-visible` treatment that remains clear over the grid and trace.
- Ensure interactive targets are at least 24px in both dimensions and primary mobile controls approach 44px.
- Ensure normal text reaches at least WCAG AA contrast.
- Project repositories/demos, professional profiles, and the résumé open in a new tab to preserve the journey; each accessible name includes visually hidden “opens in a new tab” text. In-page navigation and email remain in the current context.
- Keep decorative canvas/SVG/logo elements out of the accessibility tree.
- Preserve usable content if SVG measurement or animation logic fails.

## Failure Handling

The HTML portfolio is the primary experience. The trace is progressive enhancement.

- If SVG geometry cannot be measured, render a simple static vertical path or omit the path without affecting content.
- Observer setup and cleanup must tolerate unavailable APIs.
- The mobile menu restores document state during cleanup even if navigation occurs while open.
- Image-loading failures retain the project text and media frame without destabilizing layout.
- No site-level error boundary is required for the SVG trace because it uses native DOM primitives, but its measurement code must fail closed and remain decorative.

## Performance

Success criteria:

- The active page no longer imports the Three.js/R3F trace chunk.
- No continuous animation/render loop runs while the page is idle.
- Layout geometry is observer-driven rather than polled.
- Scroll handlers are passive and animation-frame throttled.
- Mobile uses restrained image sizes and readable content without duplicating large media.
- The favicon is replaced with a compact active asset.
- The production build completes without the current active `ScrollTraceCanvas` chunk warning.

The inactive old implementation may still keep its dependencies in `package.json`; removing those dependencies is outside this pass.

## Testing and Verification

### Automated/component behavior

- Reduced-motion hook reacts to media-query changes.
- Active-section tracking selects the expected section around boundaries.
- Mobile menu exposes correct expanded state, closes on Escape and selection, and restores focus/body scrolling.
- Experience and additional-work disclosures expose correct `aria-expanded` and `aria-controls` relationships.
- SVG trace geometry helpers produce valid paths for desktop, mobile, missing anchors, and zero-height layouts.

Tests will follow the repository's existing test capabilities. If no unit-test harness exists, pure geometry/behavior helpers will be verified with focused scripts and the runtime flows will be exercised end to end.

### Browser verification

Inspect at minimum:

- Desktop: 1440×1000.
- Tablet/narrow desktop: approximately 900px wide.
- Mobile: 390×844 and a narrower 360px viewport.
- Reduced-motion desktop and mobile.
- Keyboard-only navigation through header, menu, disclosures, projects, and contact links.
- Direct section links and browser hash navigation.
- Trace behavior after opening disclosures and loading project images.
- Console and page errors.

### Build verification

- `npm run build` passes.
- The active production bundle no longer emits the 823KB `ScrollTraceCanvas` chunk.
- No unintended horizontal overflow occurs at tested sizes.

## Non-goals

- Reintroducing the full diorama journey.
- Deleting or archiving the old Three.js implementation.
- Adding a CMS, router, theme switcher, analytics system, or new project claims.
- Replacing the core black/lime editorial identity.
- Creating new project artwork from scratch in this pass.
