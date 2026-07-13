# Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the portfolio’s current dark editorial identity while replacing its active Three.js trace with a lightweight SVG journey, restoring mobile content/navigation, and completing the accessibility, performance, and visual-polish pass.

**Architecture:** The active route becomes a composition-only `App.jsx` backed by focused shell, navigation, trace, and section components. Pure trace geometry and reactive preference/section hooks are testable independently; the HTML portfolio remains primary and the SVG trace is progressive enhancement. The inactive diorama implementation stays in the repository and is not imported by the active route.

**Tech Stack:** React 18, Vite 5, Framer Motion 11, React Icons, SVG, CSS, Vitest, jsdom, Testing Library, Playwright CLI for end-to-end verification.

## Global Constraints

- Work on branch `arrowarcher1/portfolio-refinement`.
- Preserve the current black, off-white, lime, grid, Manrope, and IBM Plex Mono visual system.
- Use continuous section numbering: `01 Home`, `02 About`, `03 Experience`, `04 Work`, `05 Capabilities`, `06 Contact`.
- Keep Converge, Truth Trail, and ProfPair as the featured projects.
- Do not delete or edit the inactive diorama implementation under `src/scene/` (other than removing the new active-only `src/scene/ScrollTraceCanvas.jsx`), `src/ui/`, or its model assets.
- Do not remove Three.js/R3F dependencies from `package.json`; the inactive implementation still depends on them.
- The active page must not import Three.js, React Three Fiber, drei, postprocessing, `SceneWorld`, `Overlay`, or `ScrollTraceCanvas`.
- Reduced-motion mode must contain no scroll-linked parallax, clip-path reveal, scale interpolation, moving trace cursor, or animated path progress.
- Project repositories/demos, professional profiles, and the résumé open in a new tab with visually hidden “opens in a new tab” text. Email and in-page links remain in the current context.
- Do not invent metrics, employers, project claims, or capabilities not present in `src/data/content.js`.
- Preserve the existing uncommitted trace-portfolio baseline before refactoring it.
- Follow red-green-refactor for every new function, hook, and interactive behavior.

---

## Locked File Structure

### Create

- `src/data/journey.js` — canonical six-section navigation metadata.
- `src/hooks/useReducedMotionPreference.js` — reactive media-query preference hook.
- `src/hooks/useActiveSection.js` — IntersectionObserver active-section hook with scroll fallback.
- `src/utils/traceGeometry.js` — pure anchor normalization, SVG path, and progress helpers.
- `src/components/ScrollTrace.jsx` — observer-driven decorative SVG trace.
- `src/components/SiteHeader.jsx` — wordmark, desktop navigation, résumé, and mobile-menu trigger.
- `src/components/MobileJourneyMenu.jsx` — accessible mobile section panel and focus/body-lock behavior.
- `src/components/JourneyIndex.jsx` — desktop section index, socials, and thin page-progress indicator.
- `src/components/ExternalLinkText.jsx` — visually hidden new-tab announcement.
- `src/components/sections/HeroSection.jsx`
- `src/components/sections/AboutSection.jsx`
- `src/components/sections/ExperienceSection.jsx`
- `src/components/sections/ProjectsSection.jsx`
- `src/components/sections/CapabilitiesSection.jsx`
- `src/components/sections/ContactSection.jsx`
- `src/test/setup.js` — jsdom cleanup and browser API defaults.
- Co-located `*.test.jsx` / `*.test.js` files for the modules above.
- `public/favicon.svg` — compact AVO favicon.

### Modify

- `package.json` — test scripts and development dependencies.
- `vite.config.js` — Vitest jsdom configuration.
- `src/App.jsx` — composition-only active route.
- `src/data/content.js` — active capability evidence, current portfolio metadata, and stale comment correction.
- `src/index.css` — SVG trace, navigation, responsive, reduced-motion, readability, and section composition rules.
- `index.html` — reference compact SVG favicon.

### Remove after replacement

- `src/scene/ScrollTraceCanvas.jsx` — active-only R3F trace superseded by `src/components/ScrollTrace.jsx`.

### Explicitly untouched

- `src/scene/SceneWorld.jsx`, `src/scene/CameraRig.jsx`, `src/scene/props.jsx`, `src/scene/islands/**`, `src/scene/environment/**`
- `src/ui/Chrome.jsx`, `src/ui/Overlay.jsx`, `src/ui/StaticFallback.jsx`
- `public/models/**` and legacy project media not referenced by the active route

---

### Task 1: Checkpoint the Current WIP Baseline

**Files:**
- Commit existing: `index.html`
- Commit existing: `src/App.jsx`
- Commit existing: `src/data/content.js`
- Commit existing: `src/index.css`
- Commit existing: `src/scene/ScrollTraceCanvas.jsx`
- Commit existing: `public/images/converge-convo.webp`
- Commit existing: `public/images/truth-trail.webp`
- Commit existing: `public/images/profpair.webp`
- Commit existing: `public/images/logos/**`
- Do not add: `2026-06-14-110328-ok-i-want-to-fully-remake-this-personal-portfoli.txt`

**Interfaces:**
- Consumes: the user’s current uncommitted trace-based portfolio.
- Produces: a reviewable baseline commit before the refinement changes begin.

- [ ] **Step 1: Verify the baseline production build**

Run:

```bash
npm run build
```

Expected: exit 0, with the known `ScrollTraceCanvas-*.js` chunk around 800KB minified and Vite’s large-chunk warning.

- [ ] **Step 2: Confirm the intended baseline files only**

Run:

```bash
git status --short
```

Expected: the files listed above plus the unrelated transcript text file. Do not stage the transcript.

- [ ] **Step 3: Commit the active WIP baseline**

```bash
git add index.html src/App.jsx src/data/content.js src/index.css \
  src/scene/ScrollTraceCanvas.jsx \
  public/images/converge-convo.webp public/images/truth-trail.webp public/images/profpair.webp \
  public/images/logos
git commit -m "Establish trace portfolio baseline"
```

- [ ] **Step 4: Confirm the unrelated transcript remains untracked**

Run:

```bash
git status --short
```

Expected: only `?? 2026-06-14-110328-ok-i-want-to-fully-remake-this-personal-portfoli.txt` remains.

---

### Task 2: Add the Test Harness and Canonical Journey Metadata

**Files:**
- Modify: `package.json:6-10`
- Modify: `vite.config.js:1-6`
- Create: `src/test/setup.js`
- Create: `src/data/journey.js`
- Create: `src/data/journey.test.js`

**Interfaces:**
- Produces: `JOURNEY_ITEMS: Array<{ number: string, label: string, id: string }>`.
- Produces: `npm test` and `npm run test:watch`.
- Later tasks consume `JOURNEY_ITEMS` from `src/data/journey.js`.

- [ ] **Step 1: Install the project test dependencies**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/user-event
```

Expected: `package.json` and `package-lock.json` include the four test dependencies.

- [ ] **Step 2: Write the failing journey metadata test**

Create `src/data/journey.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { JOURNEY_ITEMS } from './journey'

describe('JOURNEY_ITEMS', () => {
  it('defines one continuous number for every public section', () => {
    expect(JOURNEY_ITEMS).toEqual([
      { number: '01', label: 'Home', id: 'top' },
      { number: '02', label: 'About', id: 'about' },
      { number: '03', label: 'Experience', id: 'experience' },
      { number: '04', label: 'Work', id: 'work' },
      { number: '05', label: 'Capabilities', id: 'capabilities' },
      { number: '06', label: 'Contact', id: 'contact' },
    ])
  })
})
```

- [ ] **Step 3: Configure Vitest and verify RED**

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
```

Create `src/test/setup.js`:

```js
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

window.requestAnimationFrame ??= (callback) => window.setTimeout(callback, 0)
window.cancelAnimationFrame ??= (handle) => window.clearTimeout(handle)
window.matchMedia ??= vi.fn(() => ({
  matches: false,
  media: '',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))
```

Run:

```bash
npm test -- src/data/journey.test.js
```

Expected: FAIL because `src/data/journey.js` does not exist.

- [ ] **Step 4: Implement the canonical journey metadata**

Create `src/data/journey.js`:

```js
export const JOURNEY_ITEMS = [
  { number: '01', label: 'Home', id: 'top' },
  { number: '02', label: 'About', id: 'about' },
  { number: '03', label: 'Experience', id: 'experience' },
  { number: '04', label: 'Work', id: 'work' },
  { number: '05', label: 'Capabilities', id: 'capabilities' },
  { number: '06', label: 'Contact', id: 'contact' },
]
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
npm test -- src/data/journey.test.js
```

Expected: 1 passing test.

- [ ] **Step 6: Commit the harness**

```bash
git add package.json package-lock.json vite.config.js src/test/setup.js src/data/journey.js src/data/journey.test.js
git commit -m "Add portfolio test harness"
```

---

### Task 3: Add Reactive Motion and Active-Section Hooks

**Files:**
- Create: `src/hooks/useReducedMotionPreference.js`
- Create: `src/hooks/useReducedMotionPreference.test.jsx`
- Create: `src/hooks/useActiveSection.js`
- Create: `src/hooks/useActiveSection.test.jsx`

**Interfaces:**
- Produces: `useReducedMotionPreference(): boolean`.
- Produces: `useActiveSection(items = JOURNEY_ITEMS): string`.
- The active-section hook observes a 2% reading band centered near 46% viewport height and falls back to requestAnimationFrame-throttled geometry reads when `IntersectionObserver` is unavailable.

- [ ] **Step 1: Write the failing reduced-motion tests**

Create `src/hooks/useReducedMotionPreference.test.jsx`:

```jsx
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useReducedMotionPreference } from './useReducedMotionPreference'

function installMatchMedia(initial) {
  let matches = initial
  const listeners = new Set()
  window.matchMedia = vi.fn(() => ({
    get matches() { return matches },
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
    setMatches(next) {
      matches = next
      listeners.forEach((listener) => listener({ matches }))
    },
  }))
}

describe('useReducedMotionPreference', () => {
  it('reads and reacts to the operating-system preference', () => {
    installMatchMedia(false)
    const { result } = renderHook(() => useReducedMotionPreference())
    expect(result.current).toBe(false)

    act(() => window.matchMedia.mock.results[0].value.setMatches(true))
    expect(result.current).toBe(true)
  })
})
```

Run:

```bash
npm test -- src/hooks/useReducedMotionPreference.test.jsx
```

Expected: FAIL because the hook does not exist.

- [ ] **Step 2: Implement the reduced-motion hook**

Create `src/hooks/useReducedMotionPreference.js`:

```js
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia?.(QUERY)
    if (!media) return undefined
    const update = (event) => setReducedMotion(event.matches)
    setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reducedMotion
}
```

Run the focused test and expect PASS.

- [ ] **Step 3: Write the failing active-section tests**

Create `src/hooks/useActiveSection.test.jsx` with a fake observer that captures the callback:

```jsx
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JOURNEY_ITEMS } from '../data/journey'
import { useActiveSection } from './useActiveSection'

let observerCallback

beforeEach(() => {
  document.body.innerHTML = JOURNEY_ITEMS.map(({ id }) => `<section id="${id}"></section>`).join('')
  window.IntersectionObserver = vi.fn((callback) => {
    observerCallback = callback
    return { observe: vi.fn(), disconnect: vi.fn() }
  })
})

describe('useActiveSection', () => {
  it('starts at the first journey item', () => {
    const { result } = renderHook(() => useActiveSection())
    expect(result.current).toBe('top')
  })

  it('uses an intersecting section as the active location', () => {
    const { result } = renderHook(() => useActiveSection())
    act(() => observerCallback([{ isIntersecting: true, target: document.getElementById('work') }]))
    expect(result.current).toBe('work')
  })
})
```

Run and expect FAIL because the hook does not exist.

- [ ] **Step 4: Implement the active-section hook**

Create `src/hooks/useActiveSection.js`:

```js
import { useEffect, useState } from 'react'
import { JOURNEY_ITEMS } from '../data/journey'

export function useActiveSection(items = JOURNEY_ITEMS) {
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? 'top')

  useEffect(() => {
    const sections = items.map(({ id }) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (current) setActiveSection(current.target.id)
      }, { rootMargin: '-45% 0px -53% 0px', threshold: 0 })
      sections.forEach((section) => observer.observe(section))
      return () => observer.disconnect()
    }

    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.46
      const next = sections.reduce(
        (current, section) => section.getBoundingClientRect().top <= readingLine ? section.id : current,
        sections[0].id,
      )
      setActiveSection(next)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [items])

  return activeSection
}
```

- [ ] **Step 5: Verify all hook tests**

Run:

```bash
npm test -- src/hooks
```

Expected: all hook tests pass with no act warnings.

- [ ] **Step 6: Commit**

```bash
git add src/hooks
git commit -m "Add responsive journey state hooks"
```

---

### Task 4: Replace the Three.js Trace with SVG

**Files:**
- Create: `src/utils/traceGeometry.js`
- Create: `src/utils/traceGeometry.test.js`
- Create: `src/components/ScrollTrace.jsx`
- Create: `src/components/ScrollTrace.test.jsx`
- Modify: `src/App.jsx:1-37,428-445`
- Modify: `src/index.css:67-83,570`
- Remove: `src/scene/ScrollTraceCanvas.jsx`

**Interfaces:**
- Produces: `buildTracePath(points, width, height): string`.
- Produces: `clampProgress(value): number`.
- Produces: `<ScrollTrace reducedMotion={boolean} />`.
- Consumes: existing `[data-trace-anchor]` elements and optional `data-trace-depth` only as horizontal-bend hints; SVG remains `aria-hidden` and pointer-inert.

- [ ] **Step 1: Write failing geometry tests**

Create `src/utils/traceGeometry.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { buildTracePath, clampProgress } from './traceGeometry'

describe('buildTracePath', () => {
  it('builds a smooth document-space path through ordered anchors', () => {
    expect(buildTracePath([{ x: 80, y: 0 }, { x: 20, y: 100 }], 100, 100))
      .toBe('M 80 0 C 80 50, 20 50, 20 100')
  })

  it('returns a stable fallback when fewer than two anchors are available', () => {
    expect(buildTracePath([], 100, 200)).toBe('M 72 0 L 50 200')
  })
})

describe('clampProgress', () => {
  it.each([[-1, 0], [0.5, 0.5], [2, 1]])('clamps %s to %s', (value, expected) => {
    expect(clampProgress(value)).toBe(expected)
  })
})
```

Run and expect FAIL because the module does not exist.

- [ ] **Step 2: Implement the pure geometry helpers**

Create `src/utils/traceGeometry.js`:

```js
export const clampProgress = (value) => Math.min(1, Math.max(0, value))

export function buildTracePath(points, width, height) {
  if (points.length < 2) return `M ${Math.round(width * 0.72)} 0 L ${Math.round(width * 0.5)} ${Math.round(height)}`
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const middleY = Math.round((previous.y + point.y) / 2)
    return `${path} C ${Math.round(previous.x)} ${middleY}, ${Math.round(point.x)} ${middleY}, ${Math.round(point.x)} ${Math.round(point.y)}`
  }, `M ${Math.round(points[0].x)} ${Math.round(points[0].y)}`)
}
```

Run the geometry tests and expect PASS.

- [ ] **Step 3: Write the failing SVG component tests**

Create `src/components/ScrollTrace.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ScrollTrace from './ScrollTrace'

beforeEach(() => {
  window.ResizeObserver = class { observe() {} disconnect() {} }
  document.body.innerHTML = '<main><i data-trace-anchor></i><i data-trace-anchor></i></main>'
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 100, top: 100, width: 1, height: 1, right: 101, bottom: 101,
  })
})

describe('ScrollTrace', () => {
  it('renders a decorative SVG with base and traveled paths', () => {
    render(<ScrollTrace reducedMotion={false} />)
    expect(screen.getByTestId('scroll-trace')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('trace-base')).toBeInTheDocument()
    expect(screen.getByTestId('trace-active')).toBeInTheDocument()
  })

  it('omits moving progress elements in reduced-motion mode', () => {
    render(<ScrollTrace reducedMotion />)
    expect(screen.queryByTestId('trace-active')).not.toBeInTheDocument()
    expect(screen.queryByTestId('trace-cursor')).not.toBeInTheDocument()
  })
})
```

Add to `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
```

Install the matcher package:

```bash
npm install --save-dev @testing-library/jest-dom
```

Run the component test and expect FAIL because `ScrollTrace.jsx` does not exist.

- [ ] **Step 4: Implement `ScrollTrace.jsx`**

Implement these exact behaviors:

```jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { buildTracePath, clampProgress } from '../utils/traceGeometry'

export default function ScrollTrace({ reducedMotion }) {
  const basePathRef = useRef(null)
  const [layout, setLayout] = useState({ width: 1, height: 1, path: 'M 1 0 L 1 1' })
  const [progress, setProgress] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const measure = useCallback(() => {
    const width = window.innerWidth
    const height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
    const measured = [...document.querySelectorAll('[data-trace-anchor]')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + window.scrollY + rect.height / 2 }
      })
      .sort((a, b) => a.y - b.y)
    const points = [{ x: width * 0.72, y: 0 }, ...measured, { x: width * 0.5, y: height }]
    setLayout({ width, height, path: buildTracePath(points, width, height) })
  }, [])

  useEffect(() => {
    measure()
    document.fonts?.ready?.then(measure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(document.body)
    window.addEventListener('resize', measure)
    document.addEventListener('load', measure, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
      document.removeEventListener('load', measure, true)
    }
  }, [measure])

  useEffect(() => {
    if (reducedMotion) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const readingY = window.scrollY + window.innerHeight * 0.46
      const next = clampProgress(readingY / Math.max(1, layout.height))
      setProgress(next)
      const path = basePathRef.current
      if (path?.getTotalLength) {
        const length = path.getTotalLength()
        const point = path.getPointAtLength(length * next)
        setCursor({ x: point.x, y: point.y })
      }
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [layout.height, reducedMotion])

  return (
    <svg
      className="scroll-trace"
      data-testid="scroll-trace"
      aria-hidden="true"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      preserveAspectRatio="none"
    >
      <path ref={basePathRef} data-testid="trace-base" className="trace-path trace-path-base" d={layout.path} />
      {!reducedMotion && (
        <>
          <path
            data-testid="trace-active"
            className="trace-path trace-path-active"
            d={layout.path}
            pathLength="1"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress }}
          />
          <circle data-testid="trace-cursor" className="trace-cursor" cx={cursor.x} cy={cursor.y} r="7" />
        </>
      )}
    </svg>
  )
}
```

Replace the font-readiness line in the implementation with the following rejection-safe form; do not introduce polling:

```js
const fontReady = document.fonts?.ready
fontReady?.then(measure).catch(() => {})
```

- [ ] **Step 5: Mount SVG in the active app and remove the active R3F trace**

In `src/App.jsx`:

```jsx
import ScrollTrace from './components/ScrollTrace'
import { useReducedMotionPreference } from './hooks/useReducedMotionPreference'
```

Remove `lazy`, `Suspense`, and `const ScrollTraceCanvas = lazy(...)`. In `App()`:

```jsx
const reducedMotion = useReducedMotionPreference()

return (
  <div className="site-shell">
    <ScrollTrace reducedMotion={reducedMotion} />
    <ScrollProgress />
    <Header />
    <SideIndex />
    <main>
      <Hero />
      <About />
      <Experience />
      <Work />
      <Capabilities />
    </main>
    <Contact />
  </div>
)
```

Delete `src/scene/ScrollTraceCanvas.jsx`.

- [ ] **Step 6: Replace trace CSS**

Replace `.scroll-trace-canvas` rules with:

```css
.scroll-trace {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  opacity: 0.88;
}
.trace-path { fill: none; vector-effect: non-scaling-stroke; }
.trace-path-base { stroke: rgba(233, 233, 223, 0.36); stroke-width: 1; }
.trace-path-active { stroke: var(--lime); stroke-width: 1.25; }
.trace-cursor { fill: var(--black); stroke: var(--lime); stroke-width: 2; vector-effect: non-scaling-stroke; }
```

At mobile width, set `.scroll-trace { opacity: .64; }`.

- [ ] **Step 7: Verify tests and bundle removal**

Run:

```bash
npm test -- src/utils/traceGeometry.test.js src/components/ScrollTrace.test.jsx
npm run build
find dist/assets -maxdepth 1 -type f -name '*ScrollTraceCanvas*' -print
```

Expected: tests pass, build exits 0, and `find` prints nothing.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/test/setup.js src/utils src/components/ScrollTrace.jsx \
  src/components/ScrollTrace.test.jsx src/App.jsx src/index.css src/scene/ScrollTraceCanvas.jsx
git commit -m "Replace WebGL trace with SVG journey"
```

---

### Task 5: Extract the Shell, Hero, and About Components

**Files:**
- Create: `src/components/SiteHeader.jsx`
- Create: `src/components/JourneyIndex.jsx`
- Create: `src/components/ExternalLinkText.jsx`
- Create: `src/components/sections/HeroSection.jsx`
- Create: `src/components/sections/AboutSection.jsx`
- Create: `src/App.test.jsx`
- Modify: `src/App.jsx:1-197,428-445`
- Modify: `src/index.css:120-317,642-645`

**Interfaces:**
- `SiteHeader({ activeSection })`; Task 6 adds internal mobile-menu state without changing the public signature.
- `JourneyIndex({ activeSection })`.
- `HeroSection({ reducedMotion })`.
- `AboutSection({ reducedMotion })`.
- `ExternalLinkText()` returns `<span className="sr-only"> (opens in a new tab)</span>`.

- [ ] **Step 1: Write a failing application-shell accessibility test**

Create `src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/ScrollTrace', () => ({ default: () => null }))

describe('App shell', () => {
  it('provides skip navigation, landmarks, and continuous public section numbers', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByRole('navigation', { name: /page sections/i })).toBeInTheDocument()
    expect(screen.getAllByText(/^(01|02|03|04|05|06)$/)).not.toHaveLength(0)
  })
})
```

Run and expect FAIL because the current app lacks the skip link, main ID, navigation landmark, and corrected numbering.

- [ ] **Step 2: Create the shared external-link announcement**

Create `src/components/ExternalLinkText.jsx`:

```jsx
export default function ExternalLinkText() {
  return <span className="sr-only"> (opens in a new tab)</span>
}
```

- [ ] **Step 3: Extract `SiteHeader` and `JourneyIndex`**

Move the current header markup from `src/App.jsx:99-116` into `SiteHeader.jsx`. Use `JOURNEY_ITEMS` for desktop links and render résumé as:

```jsx
<a className="header-resume" href={LINKS.resume} target="_blank" rel="noreferrer">
  Résumé <FaDownload aria-hidden="true" size={10} />
  <ExternalLinkText />
</a>
```

Move `ScrollProgress` and the side index from `src/App.jsx:77-142` into `JourneyIndex.jsx`. Replace the `<aside>` with:

```jsx
<nav className="side-index" aria-label="Page sections">
  <div className="index-links">
    {JOURNEY_ITEMS.map(({ number, label, id }) => (
      <a
        key={id}
        href={`#${id}`}
        className={activeSection === id ? 'is-active' : undefined}
        aria-current={activeSection === id ? 'location' : undefined}
      >
        <span>{number}</span>{label}
      </a>
    ))}
  </div>
  <div className="index-socials">
    <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub, opens in a new tab"><FaGithub /></a>
    <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn, opens in a new tab"><FaLinkedin /></a>
    <a href={`mailto:${LINKS.email}`} aria-label="Email"><FaEnvelope /></a>
  </div>
</nav>
```

Give GitHub and LinkedIn accessible names ending with “opens in a new tab.” Give all index links at least an icon-sized padded hit area without changing the visible rail width.

- [ ] **Step 4: Extract Hero and About with reduced-motion-safe reveal props**

In each section file define:

```jsx
const revealProps = (reducedMotion) => reducedMotion
  ? { initial: false }
  : {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { amount: 0.15, once: true },
      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
    }
```

Move the existing Hero markup from `src/App.jsx:144-164` and About markup from `src/App.jsx:166-197` into the new files. Add `data-trace-anchor` to one meaningful stop in each section; remove redundant decorative hero anchors so section nodes correspond to real stops.

Open the hero résumé in a new tab and append `<ExternalLinkText />`.

- [ ] **Step 5: Make `App.jsx` the first-stage composition shell**

At the top of `App()`:

```jsx
const reducedMotion = useReducedMotionPreference()
const activeSection = useActiveSection()
```

Render:

```jsx
<div className="site-shell">
  <a className="skip-link" href="#main-content">Skip to main content</a>
  <ScrollTrace reducedMotion={reducedMotion} />
  <SiteHeader activeSection={activeSection} />
  <JourneyIndex activeSection={activeSection} />
  <main id="main-content">
    <HeroSection reducedMotion={reducedMotion} />
    <AboutSection reducedMotion={reducedMotion} />
    <Experience />
    <Work />
    <Capabilities />
  </main>
  <Contact />
</div>
```

Remove the old `NAV_ITEMS`, `useActiveSection`, `ScrollProgress`, `Header`, `SideIndex`, `Hero`, and `About` definitions from `App.jsx`.

- [ ] **Step 6: Add shell accessibility CSS**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: .75rem;
  left: .75rem;
  padding: .75rem 1rem;
  color: var(--black);
  background: var(--lime);
  transform: translateY(-180%);
}
.skip-link:focus { transform: translateY(0); }
section[id], footer[id] { scroll-margin-top: 5.5rem; }
```

Change `--dim` from `#666963` to a value at least as bright as `#7f827b`, and raise desktop functional header/index text to at least `0.72rem` while leaving purely decorative coordinate labels smaller.

- [ ] **Step 7: Verify and commit**

Run:

```bash
npm test -- src/App.test.jsx
npm run build
```

Expected: tests and build pass.

```bash
git add src/App.jsx src/App.test.jsx src/components src/hooks src/index.css
git commit -m "Extract accessible portfolio shell"
```

---

### Task 6: Add the Mobile Journey Menu

**Files:**
- Create: `src/components/MobileJourneyMenu.jsx`
- Create: `src/components/MobileJourneyMenu.test.jsx`
- Modify: `src/components/SiteHeader.jsx`
- Modify: `src/index.css:120-161,550-574`

**Interfaces:**
- `MobileJourneyMenu({ activeSection, open, onClose, triggerRef })`.
- `SiteHeader({ activeSection })` owns `open` state and the trigger ref.

- [ ] **Step 1: Write failing menu interaction tests**

Create `src/components/MobileJourneyMenu.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SiteHeader from './SiteHeader'

describe('mobile journey menu', () => {
  it('opens with an expanded state and closes after section selection', async () => {
    const user = userEvent.setup()
    render(<SiteHeader activeSection="about" />)
    const trigger = screen.getByRole('button', { name: /open journey menu/i })
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: /mobile page sections/i })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /work/i }))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<SiteHeader activeSection="top" />)
    const trigger = screen.getByRole('button', { name: /open journey menu/i })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
```

Run and expect FAIL because the trigger/menu do not exist.

- [ ] **Step 2: Implement the menu panel**

`MobileJourneyMenu.jsx` must:

```jsx
import { useEffect } from 'react'
import { JOURNEY_ITEMS } from '../data/journey'

export default function MobileJourneyMenu({ activeSection, open, onClose, triggerRef }) {
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open, triggerRef])

  if (!open) return null
  return (
    <nav className="mobile-journey-menu" aria-label="Mobile page sections">
      {JOURNEY_ITEMS.map(({ number, label, id }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeSection === id ? 'location' : undefined}
          onClick={onClose}
        >
          <span>{number}</span><strong>{label}</strong>
        </a>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Integrate the trigger in `SiteHeader`**

Use a labeled text-plus-lines control, not an icon-only hamburger:

```jsx
const [menuOpen, setMenuOpen] = useState(false)
const triggerRef = useRef(null)

<button
  ref={triggerRef}
  className="journey-menu-trigger"
  type="button"
  aria-expanded={menuOpen}
  aria-controls="mobile-journey-menu"
  aria-label={menuOpen ? 'Close journey menu' : 'Open journey menu'}
  onClick={() => setMenuOpen((open) => !open)}
>
  <span>Journey</span><i aria-hidden="true" />
</button>
<MobileJourneyMenu
  activeSection={activeSection}
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
  triggerRef={triggerRef}
/>
```

Give the menu `<nav id="mobile-journey-menu">` so `aria-controls` resolves.

- [ ] **Step 4: Add responsive menu CSS**

Desktop hides `.journey-menu-trigger` and `.mobile-journey-menu`. At `max-width: 760px`:

- Show a 44px-minimum trigger between wordmark and résumé.
- Use a three-column header: wordmark / journey / résumé.
- Position the menu immediately under the 70px header.
- Render six full-width rows with 44px minimum height, mono numbers, readable 0.8rem labels, border separators, and lime current-state treatment.
- Keep the panel above the trace and below the skip link.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/components/MobileJourneyMenu.test.jsx
npm run build
git add src/components/SiteHeader.jsx src/components/MobileJourneyMenu.jsx \
  src/components/MobileJourneyMenu.test.jsx src/index.css
git commit -m "Add mobile journey navigation"
```

---

### Task 7: Extract and Correct Experience and Project Interactions

**Files:**
- Create: `src/components/sections/ExperienceSection.jsx`
- Create: `src/components/sections/ExperienceSection.test.jsx`
- Create: `src/components/sections/ProjectsSection.jsx`
- Create: `src/components/sections/ProjectsSection.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css:319-451,577-615`

**Interfaces:**
- `ExperienceSection({ reducedMotion })`.
- `ProjectsSection({ reducedMotion })`.
- Every experience trigger controls `experience-panel-${index}`.
- Every linkless additional-work trigger controls `additional-panel-${project.id}`.

- [ ] **Step 1: Write failing experience semantics tests**

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ExperienceSection from './ExperienceSection'

describe('ExperienceSection', () => {
  it('connects each heading, trigger, and detail region', async () => {
    const user = userEvent.setup()
    render(<ExperienceSection reducedMotion />)
    const trigger = screen.getByRole('button', { name: /vitu/i })
    expect(trigger).toHaveAttribute('aria-controls', 'experience-panel-0')
    expect(screen.getByRole('heading', { level: 3, name: 'Vitu' })).toBeInTheDocument()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
```

Run and expect FAIL before the extracted component exists.

- [ ] **Step 2: Extract and correct Experience**

Move `src/App.jsx:199-249` into `ExperienceSection.jsx` and change each row to:

```jsx
const triggerId = `experience-trigger-${index}`
const panelId = `experience-panel-${index}`

<button
  id={triggerId}
  type="button"
  className="experience-trigger"
  onClick={() => setActive(isActive ? -1 : index)}
  aria-expanded={isActive}
  aria-controls={panelId}
>
  <span className="row-index">{String(index + 1).padStart(2, '0')}</span>
  <span className="company-mark">
    {experience.logo ? <img src={experience.logo} alt="" /> : experience.company}
  </span>
  <span className="role-block">
    <small>{experience.role}</small>
    <h3>{experience.company}</h3>
    <span>{experience.period}</span>
    <span>{experience.location}</span>
  </span>
  <FaPlus className="plus" aria-hidden="true" />
</button>
<div
  id={panelId}
  className="experience-detail"
  role="region"
  aria-labelledby={triggerId}
  hidden={!isActive && reducedMotion}
>
  {experience.summary ? <p className="experience-summary">{experience.summary}</p> : null}
  <ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
  <div className="tech-line">{experience.tech.join(' · ')}</div>
</div>
```

For animated mode retain the grid-row transition; for reduced motion use final open/closed state without transition.

- [ ] **Step 3: Write failing project tests**

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ProjectsSection from './ProjectsSection'

describe('ProjectsSection', () => {
  it('keeps every featured project description in the document', () => {
    render(<ProjectsSection reducedMotion />)
    expect(screen.getByText(/private reservation prices/i)).toBeInTheDocument()
    expect(screen.getByText(/immutable audit trails/i)).toBeInTheDocument()
    expect(screen.getByText(/10,000\+ course reviews/i)).toBeInTheDocument()
  })

  it('exposes linkless additional work as a disclosure', async () => {
    const user = userEvent.setup()
    render(<ProjectsSection reducedMotion />)
    const trigger = screen.getByRole('button', { name: /lcrs/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: /lcrs/i })).toHaveTextContent('Vertex AI')
  })
})
```

Run and expect FAIL before extraction/semantics.

- [ ] **Step 4: Extract projects with static reduced-motion variants**

Move `ProjectMedia`, `ProjectRow`, and `Work` from `src/App.jsx:251-359` into `ProjectsSection.jsx`.

Split animated and static media so reduced motion never instantiates `useScroll`:

```jsx
function ProjectMediaFrame({ project, number, mediaRef, frameStyle, imageStyle }) {
  return (
    <motion.a
      ref={mediaRef}
      className="project-media"
      href={project.link}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title}: ${project.linkLabel}, opens in a new tab`}
      style={frameStyle}
    >
      <motion.img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        decoding="async"
        style={imageStyle}
      />
      <span>{number}</span>
    </motion.a>
  )
}

function StaticProjectMedia({ project, number }) {
  return <ProjectMediaFrame project={project} number={number} />
}

function AnimatedProjectMedia({ project, number }) {
  const mediaRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.035, 1, 1.035])
  const mediaClip = useTransform(scrollYProgress, [0.02, 0.32], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])
  const mediaOpacity = useTransform(scrollYProgress, [0.02, 0.24], [0.6, 1])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.32, 0.44, 0.56, 0.68, 1], [0.58, 0.68, 1, 1, 0.68, 0.58])
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.28, 0.44, 0.56, 0.72, 1],
    [
      'saturate(.16) contrast(.96) brightness(.58)',
      'saturate(.22) contrast(.98) brightness(.66)',
      'saturate(1) contrast(1.03) brightness(1)',
      'saturate(1) contrast(1.03) brightness(1)',
      'saturate(.22) contrast(.98) brightness(.66)',
      'saturate(.16) contrast(.96) brightness(.58)',
    ],
  )
  return (
    <ProjectMediaFrame
      project={project}
      number={number}
      mediaRef={mediaRef}
      frameStyle={{ clipPath: mediaClip, opacity: mediaOpacity }}
      imageStyle={{ y: imageY, scale: imageScale, filter: imageFilter, opacity: imageOpacity }}
    />
  )
}

const Media = reducedMotion ? StaticProjectMedia : AnimatedProjectMedia
```

All external project links include `<ExternalLinkText />`. Project descriptions remain in markup at all widths. Linkless additional work uses `aria-expanded`, `aria-controls`, a labeled panel, and a rotating plus only outside reduced-motion mode.

- [ ] **Step 5: Integrate the extracted sections**

Replace the inline Experience and Work definitions/usages in `App.jsx` with:

```jsx
<ExperienceSection reducedMotion={reducedMotion} />
<ProjectsSection reducedMotion={reducedMotion} />
```

- [ ] **Step 6: Update section CSS**

- Change `.role-block strong` to `.role-block h3` with `margin: 0`.
- Set desktop `.experience-trigger` minimum height to `118px` and mobile minimum height to `112px`.
- Increase role metadata and project functional text to at least `0.72rem`.
- Remove `.project-description { display: none; }` from mobile; use `font-size: .76rem` and `line-height: 1.65` without line clamping.
- Give project and additional-work links/buttons 44px minimum touch height on mobile.
- Normalize all project media to `aspect-ratio: 16 / 10` and keep object-fit consistent.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- src/components/sections/ExperienceSection.test.jsx src/components/sections/ProjectsSection.test.jsx
npm run build
git add src/App.jsx src/components/sections/ExperienceSection* src/components/sections/ProjectsSection* src/index.css
git commit -m "Improve experience and project accessibility"
```

---

### Task 8: Replace the Capability Inventory and Finish Section Extraction

**Files:**
- Modify: `src/data/content.js:1,69-94,156-178`
- Create: `src/data/content.test.js`
- Create: `src/components/sections/CapabilitiesSection.jsx`
- Create: `src/components/sections/CapabilitiesSection.test.jsx`
- Create: `src/components/sections/ContactSection.jsx`
- Create: `src/components/sections/ContactSection.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css:453-539,616-639`

**Interfaces:**
- Produces: `CAPABILITIES: Array<{ label, summary, evidence, tech }>`.
- `CapabilitiesSection({ reducedMotion })` renders four evidence-led rows.
- `ContactSection({ reducedMotion })` renders section number `06` and current-context/new-tab behavior from the spec.

- [ ] **Step 1: Write failing content tests**

Create `src/data/content.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { ARCHIPELAGO_PROJECTS, CAPABILITIES } from './content'

describe('active portfolio content', () => {
  it('describes four proof-backed capabilities', () => {
    expect(CAPABILITIES.map(({ label }) => label)).toEqual([
      'Distributed and verifiable systems',
      'Compiler and systems research',
      'Applied AI systems',
      'Production engineering',
    ])
    expect(CAPABILITIES.every(({ evidence, tech }) => evidence.length > 0 && tech.length > 0)).toBe(true)
  })

  it('describes the current portfolio as an SVG journey', () => {
    const portfolio = ARCHIPELAGO_PROJECTS.find(({ id }) => id === 'portfolio')
    expect(portfolio.tech).toEqual(['React', 'SVG', 'Framer Motion', 'Vite'])
  })
})
```

Run and expect FAIL because `CAPABILITIES` does not exist and portfolio metadata is stale.

- [ ] **Step 2: Add exact evidence-led capability data**

Keep legacy `SKILL_CATEGORIES`, `STOPS`, and `PAGES` exports untouched for the inactive implementation. Correct the file header to state that active and legacy implementations share the module.

Add:

```js
export const CAPABILITIES = [
  {
    label: 'Distributed and verifiable systems',
    summary: 'Trust-sensitive workflows where ownership, authorization, and state transitions must remain auditable.',
    evidence: 'Vehicle-title custody workflows · Oracle blockchain authorization · forensic evidence trails',
    tech: ['Go', 'Solidity', 'Cryptography', 'Distributed systems'],
  },
  {
    label: 'Compiler and systems research',
    summary: 'Performance work close to storage, memory, and communication boundaries.',
    evidence: 'LLVM optimization · non-volatile memory · RDMA abstractions',
    tech: ['LLVM', 'C++', 'NVM', 'RDMA'],
  },
  {
    label: 'Applied AI systems',
    summary: 'Model-backed product workflows with deterministic orchestration around probabilistic components.',
    evidence: 'Negotiation agents · professor matching · evidence classification',
    tech: ['Agent SDKs', 'SageMaker', 'Vertex AI', 'Python'],
  },
  {
    label: 'Production engineering',
    summary: 'Full-stack services designed for real users, live state, and operational constraints.',
    evidence: 'Real-time production tracking · SSE negotiation · cloud-backed applications',
    tech: ['React', 'Node.js', 'WebSocket', 'Docker', 'SQL'],
  },
]
```

Change the active portfolio item to:

```js
tech: ['React', 'SVG', 'Framer Motion', 'Vite']
```

Run the content test and expect PASS.

- [ ] **Step 3: Write failing capability/contact component tests**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CapabilitiesSection from './CapabilitiesSection'

it('renders capability proof rather than a keyword-only inventory', () => {
  render(<CapabilitiesSection reducedMotion />)
  expect(screen.getByRole('heading', { name: 'Distributed and verifiable systems' })).toBeInTheDocument()
  expect(screen.getByText(/vehicle-title custody workflows/i)).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Languages' })).not.toBeInTheDocument()
})
```

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ContactSection from './ContactSection'

it('keeps email local and announces external destinations', () => {
  render(<ContactSection reducedMotion />)
  expect(screen.getByRole('link', { name: /andrew@andrewvo.dev/i })).not.toHaveAttribute('target')
  expect(screen.getByRole('link', { name: /github.*opens in a new tab/i })).toHaveAttribute('target', '_blank')
  expect(screen.getByText('06')).toBeInTheDocument()
})
```

Run and expect FAIL before the files exist.

- [ ] **Step 4: Implement `CapabilitiesSection`**

Render section number `05`, heading “Technical capabilities,” and four rows from `CAPABILITIES`. Use semantic `article` elements with `h3`, summary, evidence, and technology metadata. Do not use `useScroll`; use the trace and CSS hover/focus state as the only emphasis system. In reduced motion the markup is identical and all rows are immediately visible.

- [ ] **Step 5: Implement `ContactSection`**

Move `src/App.jsx:394-426` into the new component, change the section number to `06`, and use this exact supporting copy:

```text
I’m looking for systems, infrastructure, and technically demanding product work where correctness and performance matter.
```

Use data objects instead of tuple position:

```js
const CONTACT_LINKS = [
  { Icon: FaEnvelope, label: LINKS.email, href: `mailto:${LINKS.email}`, external: false },
  { Icon: FaGithub, label: 'github.com/arrowarcher1', href: LINKS.github, external: true },
  { Icon: FaLinkedin, label: 'linkedin.com/in/andrew-v-o', href: LINKS.linkedin, external: true },
  { Icon: SiLeetcode, label: 'leetcode.com/u/avanostrand', href: LINKS.leetcode, external: true },
  { Icon: FaDownload, label: 'View Résumé (PDF)', href: LINKS.resume, external: true },
]
```

External rows receive `target="_blank"`, `rel="noreferrer"`, and `<ExternalLinkText />`.

- [ ] **Step 6: Finish `App.jsx` composition**

`App.jsx` should now contain only imports and:

```jsx
export default function App() {
  const reducedMotion = useReducedMotionPreference()
  const activeSection = useActiveSection()

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollTrace reducedMotion={reducedMotion} />
      <SiteHeader activeSection={activeSection} />
      <JourneyIndex activeSection={activeSection} />
      <main id="main-content">
        <HeroSection reducedMotion={reducedMotion} />
        <AboutSection reducedMotion={reducedMotion} />
        <ExperienceSection reducedMotion={reducedMotion} />
        <ProjectsSection reducedMotion={reducedMotion} />
        <CapabilitiesSection reducedMotion={reducedMotion} />
      </main>
      <ContactSection reducedMotion={reducedMotion} />
    </div>
  )
}
```

- [ ] **Step 7: Update capability/contact CSS**

- Keep the large `05` capability number but use four denser rows.
- Make summary body text readable (`>= .78rem`) and evidence/tech mono metadata (`>= .68rem`).
- Remove capability scroll-color motion rules and bracket motion values.
- Ensure contact rows are at least 58px desktop and 52px mobile.
- Use `--muted` rather than `--dim` for functional footer metadata.

- [ ] **Step 8: Verify and commit**

```bash
npm test -- src/data/content.test.js src/components/sections/CapabilitiesSection.test.jsx \
  src/components/sections/ContactSection.test.jsx src/App.test.jsx
npm run build
git add src/App.jsx src/data/content.js src/data/content.test.js src/components/sections src/index.css
git commit -m "Make portfolio evidence led"
```

---

### Task 9: Complete Responsive, Reduced-Motion, and Visual Polish

**Files:**
- Modify: `src/index.css:5-645`
- Modify: `src/components/sections/AboutSection.jsx`
- Modify: `src/components/sections/ExperienceSection.jsx`
- Modify: `src/components/sections/ProjectsSection.jsx`
- Modify: `src/components/sections/CapabilitiesSection.jsx`
- Modify: `src/components/sections/ContactSection.jsx`
- Create: `src/components/reducedMotion.test.jsx`

**Interfaces:**
- All section components consume the same `reducedMotion` boolean.
- No reduced-motion component mounts a scroll-linked Framer Motion subcomponent.

- [ ] **Step 1: Write a failing reduced-motion composition test**

Create `src/components/reducedMotion.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProjectsSection from './sections/ProjectsSection'
import CapabilitiesSection from './sections/CapabilitiesSection'

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return { ...actual, useScroll: vi.fn(() => { throw new Error('scroll motion mounted') }) }
})

describe('reduced-motion composition', () => {
  it('renders projects and capabilities without scroll-linked motion hooks', () => {
    render(<><ProjectsSection reducedMotion /><CapabilitiesSection reducedMotion /></>)
    expect(screen.getByRole('heading', { name: 'Converge' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Production engineering' })).toBeInTheDocument()
  })
})
```

Run and expect FAIL if any reduced-motion branch still mounts a component that calls `useScroll`.

- [ ] **Step 2: Remove remaining reduced-motion scroll effects**

- Ensure animated `ProjectMedia`, project bracket, and any section reveal live in child components rendered only when `reducedMotion === false`.
- Reduced motion uses plain elements or `motion.*` with `initial={false}` and no transform motion values.
- Remove capability scroll interpolation entirely.
- Confirm `ScrollTrace` renders no active path/cursor in reduced mode.

Run the reduced-motion test until PASS.

- [ ] **Step 3: Apply the readability and layout pass**

Update CSS with these measurable floors:

- Header/index/project/contact functional text: at least 11.5px desktop and 12px mobile.
- Body/project descriptions: at least 12px desktop and mobile.
- Primary mobile buttons/menu/contact rows: at least 44px touch height.
- `--dim` is decorative only; functional metadata uses `--muted`.
- `section[id], footer[id]` use `scroll-margin-top: 5.5rem` desktop and `4.75rem` mobile.
- About desktop copy expands from columns `6 / 10` to `5 / 10`; facts remain `10 / 13`.
- Experience closed rows tighten without clipping logos or headings.
- Mobile project descriptions remain visible.
- Mobile footer metadata wraps without shrinking below the text floor.
- Focus indicators remain visible over lime buttons using an inverse outline where needed.

- [ ] **Step 4: Add narrow and intermediate breakpoints**

Add a `@media (max-width: 1040px)` adjustment for balanced About/Experience columns and a `@media (max-width: 420px)` adjustment that:

- Allows hero actions to wrap.
- Keeps the wordmark, Journey trigger, and résumé from colliding.
- Keeps project indices from forcing copy below 320px content width.
- Stacks footer metadata vertically with left-aligned text.

- [ ] **Step 5: Verify automated behavior**

```bash
npm test
npm run build
```

Expected: all tests pass, build exits 0, and there is no `ScrollTraceCanvas` chunk.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components src/hooks
git commit -m "Polish responsive and reduced motion layouts"
```

---

### Task 10: Replace the Oversized Favicon and Run End-to-End Verification

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html:5`
- Keep: `public/favicon.ico` (legacy asset; do not delete in this pass)

**Interfaces:**
- Browser requests `/favicon.svg` instead of the 556KB PNG-disguised-as-ICO.

- [ ] **Step 1: Write the favicon verification before creating the asset**

Run:

```bash
test -f public/favicon.svg
```

Expected: exit 1 because the compact favicon does not exist.

- [ ] **Step 2: Create the compact SVG favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#080a09"/>
  <path d="M14 44 25 18h5l11 26h-6l-2.5-6H22.4L20 44h-6Zm10.4-11h6.1L27.4 25l-3 8Z" fill="#f2f1ea"/>
  <circle cx="49" cy="43" r="4" fill="#c7ff22"/>
</svg>
```

- [ ] **Step 3: Point HTML to the SVG**

Replace `index.html:5` with:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

Run:

```bash
test -f public/favicon.svg && wc -c public/favicon.svg
```

Expected: exit 0 and well under 2KB.

- [ ] **Step 4: Run the complete automated verification**

```bash
npm test
npm run build
```

Expected:

- All Vitest suites pass.
- Vite build exits 0.
- No active `ScrollTraceCanvas` chunk.
- Main JS remains materially smaller than the baseline total active JS.

- [ ] **Step 5: Launch and drive the real site**

Start Vite:

```bash
npm run dev -- --host 127.0.0.1
```

Using Playwright/Chromium with `--use-angle=metal` if needed, verify:

1. Desktop `1440×1000`: home, About, Experience open/close, all three projects, Capabilities, Contact.
2. Intermediate `900×900`: no collisions or horizontal overflow.
3. Mobile `390×844` and `360×800`: open menu, select Work, descriptions visible, disclosures usable.
4. Reduced-motion desktop and mobile: static trace, no parallax/clip reveal/moving cursor.
5. Keyboard-only: skip link, desktop/mobile navigation, experience rows, additional-work disclosure, projects, contact.
6. Direct URLs `/#about`, `/#experience`, `/#work`, `/#capabilities`, and `/#contact` land with headings below the fixed header.
7. `document.body.scrollWidth === window.innerWidth` at every viewport.
8. Browser console and page-error collections are empty.

Capture screenshots for home, About, open Experience, Work, Capabilities, Contact, mobile menu, and mobile Work.

- [ ] **Step 6: Run the project verify skill**

Invoke `/verify` and drive the same affected flows end to end. Fix any observed runtime regression with a failing test first, then rerun the focused test, full suite, build, and browser flow.

- [ ] **Step 7: Review the final diff without touching inactive files**

```bash
git status --short
git diff --stat "$(git merge-base main HEAD)"..HEAD
git diff -- src/scene/SceneWorld.jsx src/ui/Overlay.jsx src/ui/Chrome.jsx
```

Expected: the inactive-file diff command prints nothing. The unrelated transcript remains untracked.

- [ ] **Step 8: Commit the final asset and verification fixes**

```bash
git add public/favicon.svg index.html
# Add only any source/test files changed while fixing verified regressions.
git commit -m "Finish portfolio refinement verification"
```

---

## Final Acceptance Checklist

- [ ] Current WIP baseline is preserved in its own commit.
- [ ] All new behavior was implemented test-first with observed RED and GREEN runs.
- [ ] Active route contains no Three.js/R3F trace import.
- [ ] `ScrollTraceCanvas-*.js` is absent from `dist/assets`.
- [ ] SVG trace uses observers/events, not polling or a continuous render loop.
- [ ] Reduced motion is reactive and visually static.
- [ ] Mobile has section navigation and visible project descriptions.
- [ ] Section numbering is continuous from 01 through 06.
- [ ] Skip navigation, landmarks, headings, disclosure relationships, focus, and external-link announcements are correct.
- [ ] Capability content is evidence-led and grounded in existing work.
- [ ] Functional text and targets meet the specified readability floors.
- [ ] Compact SVG favicon is active.
- [ ] Desktop, intermediate, mobile, reduced-motion, keyboard, hash-navigation, console, and overflow checks pass.
- [ ] Inactive diorama files and assets are unchanged.
- [ ] `npm test` and `npm run build` pass.
