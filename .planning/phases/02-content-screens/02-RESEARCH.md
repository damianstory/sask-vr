# Phase 2: Content Screens - Research

**Researched:** 2026-03-19
**Domain:** Interactive screen components (animations, map rendering, accordion patterns, form interactions)
**Confidence:** HIGH

## Summary

Phase 2 replaces six placeholder screen shells and the Post-VR page with fully interactive, content-rich implementations. The screens span five distinct interaction patterns: animated counter (Screen 1), multi-select tile grid (Screen 2), interactive map with employer pins (Screen 3), accordion timeline (Screen 4), read-only content cards (Screen 6), and checkable list (Post-VR). Screen 5 (Card Builder) is deferred to Phase 3.

The codebase from Phase 1 provides a solid foundation: all screen shells exist as placeholder components in `app/pre-vr/components/ScreenX.tsx`, content is typed and loaded from `carpentry.json` via `content/config.ts`, session state is managed by `SessionContext`, and navigation + progress bar are wired. Each screen implementation replaces the existing placeholder in-place -- same file, same export.

**Primary recommendation:** Build each screen as a self-contained component replacement, leveraging existing content data and session context. Use mapcn (shadcn-compatible MapLibre wrapper) for Screen 3, CSS transforms for the odometer animation on Screen 1, and standard React state patterns for all interactive screens. No heavy animation libraries needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Screen 1: Odometer-style digit animation with each digit rolling independently, ~2 seconds with ease-out, staggered stat card fade-in (200ms stagger, +0.3s/0.5s/0.7s after counter)
- Screen 1: Stat cards styled as navy background with white text "data badges"
- Screen 1: Hook question appears as bold static text immediately -- no animation on text
- Screen 1: prefers-reduced-motion shows final salary number immediately, stat cards appear without animation
- Screen 2: Primary Blue border glow + checkmark badge on selected tiles; 4th selection triggers shake + inline message auto-dismissing after 3 seconds
- Screen 2: Emoji on soft colored background circle for tile illustrations -- no SVG assets needed
- Screen 2: Dynamic continue button label: "Pick at least 2" (0) / "Pick 1 more" (1) / "Continue ->" (2-3)
- Screen 2: Tile selections persist in SessionContext via setSelectedTiles()
- Screen 3: Use mapcn (MapLibre GL) instead of custom SVG illustration
- Screen 3: Map centered on Regina, SK at fixed zoom, no pan/zoom controls, pins only interactive
- Screen 3: Company card as bottom sheet sliding up; employer data structured in carpentry.json
- Screen 4: Connected vertical timeline with filled "You are here" dot (pulse animation) and hollow future dots
- Screen 4: Solid-to-dashed connecting line; accordion behavior (one step expanded at a time)
- Screen 4: First step starts expanded by default; expanded content shows description, duration, earnings, programs
- Screen 6: Read-and-absorb only, observation prompts as visually distinct cards
- Post-VR: 6-item checkable checklist with toggle state, progress count, prominent myBlueprint link (new tab), session-only state

### Claude's Discretion
- Screen 6 VR prep card visual styling
- Post-VR checklist checkbox animation/style
- Exact pin marker design on map (color, size, shape)
- Spacing and padding details across all screens
- Screen transition timing within existing slide animation system

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOOK-01 | Animated counter ticks up to salary with ease-out over 2 seconds | CSS transform odometer pattern; each digit column scrolls independently via translateY |
| HOOK-02 | 2-3 headline stats as visual data cards | Navy background stat badges with staggered fade-in animation |
| HOOK-03 | Saskatchewan-specific career data hardcoded | Data already in carpentry.json screenOne.stats |
| HOOK-04 | Counter animation disabled for prefers-reduced-motion | CSS `@media (prefers-reduced-motion: reduce)` disables transforms; show final number |
| TILE-01 | Six tiles in responsive grid (3x2 desktop, 2-col mobile) | Standard Tailwind grid: `grid-cols-2 lg:grid-cols-3` |
| TILE-02 | Select 2-3 tiles with highlight + checkmark | `aria-pressed` buttons with conditional border/bg classes |
| TILE-03 | 4th selection prevented with inline feedback | Shake animation CSS keyframes + auto-dismiss message via setTimeout |
| TILE-04 | Continue disabled until 2 tiles selected | Dynamic button label from selectedTiles.length |
| TILE-05 | Selections persisted in session state | Wire to `useSession().setSelectedTiles()` from SessionContext |
| MAP-01 | Map of Regina with 4-6 employer pins | mapcn Map component with MapMarker children; free OpenStreetMap tiles |
| MAP-02 | Pin tap opens company card with details | MapMarker onClick triggers bottom sheet state; card shows employer data |
| MAP-03 | Card closes via X, tap outside, or Escape | onClose handler + Escape keydown listener + backdrop click |
| MAP-04 | Map not zoomable/pannable | MapLibre `interactive: false` or individual `scrollZoom={false}`, `dragPan={false}`, etc. |
| MAP-05 | Employer data structured as JSON | Already structured in carpentry.json screenThree.employers |
| PATH-01 | Vertical timeline with 5 expandable steps | Custom timeline component with connected line + circular nodes |
| PATH-02 | Expanded step shows courses, duration, earnings, programs | Render step.details fields from carpentry.json screenFour.steps |
| PATH-03 | Accordion behavior (one at a time) | Single `expandedStepId` state; clicking sets it or toggles null |
| PATH-04 | References Miller Collegiate, SaskPolytech, SYIP | Already in carpentry.json step details |
| PREP-01 | VR sim description displayed | Content from carpentry.json screenSix |
| PREP-02 | 2-3 observation prompts as distinct cards | Styled cards with Light Blue Soft background |
| PREP-03 | Navigate back preserves state | Already works -- session state + screen state preserved |
| PREP-04 | No required interactions | No form elements or required clicks on Screen 6 |
| BRDG-01 | Congratulatory message | Content from carpentry.json postVr |
| BRDG-02 | 6 checklist items with toggle state | Local useState array of checked IDs |
| BRDG-03 | Session-only checklist state | useState (no localStorage) in post-vr page |
| BRDG-04 | Progress indicator ("2 of 6 complete") | Derived from checkedItems.length |
| BRDG-05 | myBlueprint link opens new tab | `target="_blank"` with `rel="noopener noreferrer"` (already in placeholder) |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.0 | Framework | Already installed, App Router |
| React | 19.2.4 | UI library | Already installed |
| Tailwind CSS | 4.x | Styling | Already installed, CSS-first config |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class merging | Already installed |

### New Dependency
| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| mapcn (via shadcn CLI) | latest | Map component for Screen 3 | Decision locked in CONTEXT.md; installs maplibre-gl automatically |

### Not Needed
| Problem | Why No Library |
|---------|---------------|
| Odometer animation (Screen 1) | Pure CSS transforms + requestAnimationFrame; no library needed for 5-6 digits |
| Accordion (Screen 4) | Simple single-state toggle; no Radix Accordion overhead needed |
| Shake animation (Screen 2) | CSS @keyframes, 3 lines |
| Checklist (Post-VR) | useState with checkbox inputs |

**Installation:**
```bash
npx shadcn@latest add @mapcn/map
```

This installs `maplibre-gl` as a dependency and copies the Map, MapMarker, MapPopup, MapControls components into `components/ui/map.tsx`.

## Architecture Patterns

### Screen Component Replacement Pattern
Each screen replaces its placeholder shell in-place. The file path, default export name, and import in `pre-vr/page.tsx` all remain unchanged.

```
app/pre-vr/components/
  ScreenOne.tsx     # Replace placeholder with odometer + stat badges
  ScreenTwo.tsx     # Replace placeholder with tile grid + selection logic
  ScreenThree.tsx   # Replace placeholder with mapcn map + employer pins
  ScreenFour.tsx    # Replace placeholder with timeline accordion
  ScreenSix.tsx     # Replace placeholder with styled prompt cards
app/post-vr/
  page.tsx          # Replace placeholder with interactive checklist
```

### Content Data Access Pattern
All screens already import content via `import { content } from '@/content/config'`. This pattern continues -- each screen reads its data from the typed `content.screenX` object.

```typescript
import { content } from '@/content/config'
const data = content.screenOne
```

### Session State Pattern (Screen 2)
Screen 2 must wire tile selections into SessionContext:

```typescript
import { useSession } from '@/context/SessionContext'

export default function ScreenTwo() {
  const { selectedTiles, setSelectedTiles } = useSession()

  const handleTileToggle = (tileId: string) => {
    if (selectedTiles.includes(tileId)) {
      setSelectedTiles(selectedTiles.filter(id => id !== tileId))
    } else if (selectedTiles.length < data.maxSelections) {
      setSelectedTiles([...selectedTiles, tileId])
    } else {
      // Trigger shake animation + show inline message
    }
  }
}
```

### Content Type Updates Required
The current `OccupationContent` type and `carpentry.json` need updates to support the new screen features:

1. **Screen 2 tiles**: Add `emoji` field (decision: emoji on colored background, no SVG needed)
2. **Screen 4 steps**: Existing `details` structure already has `courses`, `duration`, `earnings`, `programs`, `description` -- matches requirements
3. **Post-VR checklist**: Existing structure has `id` and `label` -- sufficient

```typescript
// content/types.ts -- Screen 2 tile type needs emoji field
tiles: Array<{
  id: string
  title: string
  description: string
  emoji: string           // NEW: e.g., "🔨" for framing
  illustrationPath: string // can be kept for future use
}>
```

### Anti-Patterns to Avoid
- **Do NOT create separate component files for each sub-component (EmployerCard.tsx, PathwayStep.tsx, etc.) unless they are reused across screens.** Screen-specific sub-components should live inline or as local components within the screen file. The existing `components/` directory plan includes these files but the actual Phase 1 implementation keeps things simpler -- follow the simpler pattern.
- **Do NOT use `useEffect` for the odometer animation.** Use CSS transforms with animation-delay for each digit column. The browser handles the animation loop.
- **Do NOT add framer-motion or any animation library.** All animations in this phase (odometer, fade-in, shake, accordion expand, pulse) are achievable with CSS @keyframes + Tailwind classes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Interactive map with pins | Custom SVG map with positioned overlays | mapcn (MapLibre GL wrapper) | Real map tiles, proper geo coordinates, accessible markers out of the box |
| Map tile rendering | Canvas-based map renderer | OpenStreetMap free tiles via mapcn default | Free, no API key, loads fast |

**Key insight:** The only "don't hand-roll" item in this phase is the map. Everything else (odometer, accordion, tile grid, checklist) is simple enough that React state + CSS is the right approach. Adding libraries would increase bundle size for no benefit.

## Common Pitfalls

### Pitfall 1: MapLibre GL CSS Not Imported
**What goes wrong:** Map renders but tiles are misaligned, controls invisible, markers displaced
**Why it happens:** MapLibre GL requires its CSS stylesheet to be imported separately
**How to avoid:** mapcn should handle this automatically when installed via shadcn CLI. If not, add `import 'maplibre-gl/dist/maplibre-gl.css'` to the map component or globals.css
**Warning signs:** Map container renders but looks broken or has no tiles

### Pitfall 2: MapLibre GL Bundle Size on School Chromebooks
**What goes wrong:** maplibre-gl adds ~200KB gzipped to the bundle, which could impact the 150KB JS budget (PERF-04)
**Why it happens:** MapLibre is a full-featured GL map engine
**How to avoid:** Code-split Screen 3 using `React.lazy()` and `Suspense` -- the map only loads when the student reaches Screen 3. This keeps the initial bundle small.
**Warning signs:** Bundle analyzer shows maplibre-gl in main chunk

### Pitfall 3: Odometer Animation Janky on Low-End Devices
**What goes wrong:** Digit columns stutter during scroll animation
**Why it happens:** Using JavaScript to animate per-frame instead of CSS transforms
**How to avoid:** Use CSS `transform: translateY()` with `transition` for each digit column. CSS transforms are GPU-accelerated and run smoothly even on Chromebooks. Only use JS to determine the target translateY value.
**Warning signs:** Animation looks choppy on throttled CPU in DevTools

### Pitfall 4: Tile Selection State Lost on Navigation
**What goes wrong:** Student selects tiles on Screen 2, navigates forward, comes back, selections are gone
**Why it happens:** Component remounts when navigating away (key={currentScreen} pattern causes this)
**How to avoid:** Tile selections are stored in SessionContext, not component-local state. On mount, read `selectedTiles` from context, not from a local useState initializer.
**Warning signs:** State resets when navigating back to Screen 2

### Pitfall 5: Map Bottom Sheet Blocking Pin Interaction
**What goes wrong:** Employer card bottom sheet covers other pins on mobile
**Why it happens:** Bottom sheet slides up and may overlap pin positions
**How to avoid:** When bottom sheet is open, add a semi-transparent backdrop that intercepts taps (closes the sheet). Use `role="dialog"` with focus trap inside the card.
**Warning signs:** Student can't close the card or interact with other pins while card is open

### Pitfall 6: Accordion Content Height Animation Jumps
**What goes wrong:** Expanding a timeline step causes a jarring jump instead of smooth expansion
**Why it happens:** `height: auto` cannot be transitioned in CSS
**How to avoid:** Use `grid-template-rows: 0fr / 1fr` technique for smooth height transitions. Wrap expandable content in a div with `overflow: hidden` and transition `grid-template-rows`.
**Warning signs:** Accordion snaps open/closed instead of smoothly animating

### Pitfall 7: Emoji Rendering Inconsistency Across Devices
**What goes wrong:** Emoji look different on Chromebook vs iPhone vs Android
**Why it happens:** Each platform renders emoji with its own font
**How to avoid:** This is acceptable for the pilot -- emoji on all platforms are recognizable. The colored background circle behind the emoji provides visual consistency regardless of emoji style.
**Warning signs:** N/A -- cosmetic only, not functional

## Code Examples

### Odometer-Style Digit Animation (Screen 1)
```typescript
// Each digit gets its own column that scrolls via CSS transform
// Source: CSS odometer pattern (frontendmasters.com/blog/the-odometer-effect-in-css)

function OdometerDigit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <div className="h-[1em] overflow-hidden">
      <div
        className="transition-transform duration-[2000ms] ease-out"
        style={{
          transform: `translateY(-${digit * 10}%)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[1em] leading-[1em]">{n}</div>
        ))}
      </div>
    </div>
  )
}

// Usage: split salary into digits, render each with staggered delay
function SalaryCounter({ amount }: { amount: number }) {
  const digits = amount.toLocaleString().split('')
  return (
    <div className="flex">
      <span>$</span>
      {digits.map((char, i) =>
        char === ',' ? (
          <span key={i}>,</span>
        ) : (
          <OdometerDigit key={i} digit={parseInt(char)} delay={i * 50} />
        )
      )}
    </div>
  )
}
```

### Tile Selection with Shake Feedback (Screen 2)
```typescript
// Shake animation CSS (add to globals.css)
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   25% { transform: translateX(-4px); }
//   75% { transform: translateX(4px); }
// }
// .animate-shake { animation: shake 300ms ease-in-out; }

const [shakeId, setShakeId] = useState<string | null>(null)
const [overflowMessage, setOverflowMessage] = useState(false)

const handleTileToggle = (tileId: string) => {
  if (selectedTiles.includes(tileId)) {
    setSelectedTiles(selectedTiles.filter(id => id !== tileId))
  } else if (selectedTiles.length >= data.maxSelections) {
    setShakeId(tileId)
    setOverflowMessage(true)
    setTimeout(() => setShakeId(null), 300)
    setTimeout(() => setOverflowMessage(false), 3000)
  } else {
    setSelectedTiles([...selectedTiles, tileId])
  }
}
```

### mapcn Map with Non-Interactive Pins (Screen 3)
```typescript
'use client'

import { Map, MapMarker, MarkerContent } from '@/components/ui/map'

// Regina, SK coordinates
const REGINA_CENTER: [number, number] = [-104.6189, 50.4452]

export default function ScreenThree() {
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)

  return (
    <div className="h-[280px] w-full md:h-[400px] lg:h-[500px]">
      <Map
        center={REGINA_CENTER}
        zoom={11}
        interactive={false}  // Disables all map interactions
        styles={{
          light: 'https://tiles.openfreemap.org/styles/positron'
        }}
      >
        {data.employers.map((employer) => (
          <MapMarker
            key={employer.id}
            longitude={employer.pinPosition.lng}
            latitude={employer.pinPosition.lat}
          >
            <MarkerContent>
              <button
                onClick={() => setSelectedEmployer(employer.id)}
                className="h-10 w-10 rounded-full bg-[var(--myb-primary-blue)]
                           flex items-center justify-center shadow-md
                           hover:scale-110 transition-transform"
                aria-label={`View ${employer.name}`}
              >
                <PinIcon className="h-5 w-5 text-white" />
              </button>
            </MarkerContent>
          </MapMarker>
        ))}
      </Map>

      {selectedEmployer && (
        <EmployerBottomSheet
          employer={data.employers.find(e => e.id === selectedEmployer)!}
          onClose={() => setSelectedEmployer(null)}
        />
      )}
    </div>
  )
}
```

### Accordion Timeline Step (Screen 4)
```typescript
// Grid-row transition for smooth height animation
function TimelineStep({ step, isExpanded, isFirst, onToggle }) {
  return (
    <div className="relative flex gap-4">
      {/* Connecting line */}
      <div className="flex flex-col items-center">
        <button
          onClick={onToggle}
          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full
            ${isFirst
              ? 'bg-[var(--myb-primary-blue)] animate-pulse-dot'
              : 'border-2 border-[var(--myb-neutral-3)] bg-white'
            }`}
          aria-expanded={isExpanded}
        >
          {/* step number or icon */}
        </button>
        {/* Vertical line segment */}
        <div className={`w-0.5 flex-1 ${isFirst ? 'bg-[var(--myb-primary-blue)]' : 'border-l-2 border-dashed border-[var(--myb-neutral-3)]'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <button onClick={onToggle} className="text-left">
          <h3>{step.title}</h3>
          <p>{step.subtitle}</p>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            {/* Expanded content: description, duration, earnings, programs */}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Checklist with Toggle State (Post-VR)
```typescript
'use client'

import { useState } from 'react'
import { content } from '@/content/config'

export default function PostVRPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const data = content.postVr

  const toggleItem = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <main>
      <p>{checkedItems.length} of {data.checklist.length} complete</p>
      <ul>
        {data.checklist.map(item => (
          <li key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              role="checkbox"
              aria-checked={checkedItems.includes(item.id)}
            >
              {/* Checkbox visual + label */}
            </button>
          </li>
        ))}
      </ul>
      <a href={data.myblueprintLink.url} target="_blank" rel="noopener noreferrer">
        {data.myblueprintLink.label}
      </a>
    </main>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Maps / Mapbox for simple maps | MapLibre GL with free tiles (via mapcn) | 2024-2025 | No API keys, no cost, lighter bundle |
| `height: auto` transition hacks | `grid-template-rows: 0fr/1fr` | CSS Grid Level 2 (2023+) | Smooth accordion without JS height calc |
| JS-driven counter animations | CSS transform odometer pattern | Evergreen | GPU-accelerated, no JS animation loop |
| Odometer.js library | Pure CSS + minimal JS | 2024+ | No library dependency, smaller bundle |

## Content Schema Changes Required

The existing `carpentry.json` and `content/types.ts` need minor updates:

1. **Screen 2 tiles -- add `emoji` field:**
   ```json
   { "id": "task-1", "title": "Framing", "description": "...", "emoji": "🔨", "illustrationPath": "..." }
   ```

2. **Screen 3 employers -- change pinPosition to geo coordinates:**
   The CONTEXT.md decided to use mapcn (MapLibre) instead of SVG, so pin positions need real longitude/latitude instead of x/y percentages:
   ```json
   { "pinPosition": { "lng": -104.6189, "lat": 50.4452 } }
   ```
   The type interface needs updating: `pinPosition: { lng: number; lat: number }` (was `{ x: number; y: number }`)

3. **Screen 4 steps -- already correct:** The existing schema has `details.courses`, `details.duration`, `details.earnings`, `details.programs`, `details.description` which matches requirements.

4. **Screen 6 -- already correct:** `prompts` array with `id` and `text`.

5. **Post-VR -- already correct:** `checklist` array with `id` and `label`, `myblueprintLink` with `url` and `label`.

## Open Questions

1. **mapcn MapLibre `interactive` prop**
   - What we know: mapcn extends MapLibre MapOptions; MapLibre supports `interactive: false` or individual handler disables (`scrollZoom`, `dragPan`, `doubleClickZoom`, `touchZoomRotate`, `keyboard`)
   - What's unclear: Whether mapcn's Map component passes through the `interactive` prop directly or requires individual handler props
   - Recommendation: Try `interactive={false}` first. If not supported, set `scrollZoom={false} dragPan={false} doubleClickZoom={false} touchZoomRotate={false} keyboard={false}` individually. Verify during implementation.

2. **OpenFreeMap tile URL for minimal/light style**
   - What we know: mapcn uses free CARTO tiles by default; OpenFreeMap provides alternatives
   - What's unclear: The exact URL for a "light minimal" style with gray roads on white background
   - Recommendation: Try the CARTO positron style (light, minimal labels) which is the default light theme. If too detailed, try `https://tiles.openfreemap.org/styles/positron`. Verify visual fit during implementation.

3. **MapLibre GL CSS import with mapcn**
   - What we know: MapLibre GL requires its CSS to be imported for proper rendering
   - What's unclear: Whether the mapcn shadcn install automatically sets this up
   - Recommendation: Check after running `npx shadcn@latest add @mapcn/map`. If map looks broken, add `import 'maplibre-gl/dist/maplibre-gl.css'` to globals.css or the map component.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOOK-01 | Salary counter renders with correct value | unit | `npx vitest run tests/screen-one.test.tsx -t "salary"` | No -- Wave 0 |
| HOOK-04 | Reduced motion shows final number | unit | `npx vitest run tests/screen-one.test.tsx -t "reduced-motion"` | No -- Wave 0 |
| TILE-02 | Tile toggle changes selection state | unit | `npx vitest run tests/screen-two.test.tsx -t "select"` | No -- Wave 0 |
| TILE-03 | 4th selection prevented | unit | `npx vitest run tests/screen-two.test.tsx -t "max"` | No -- Wave 0 |
| TILE-04 | Continue disabled until 2 selected | unit | `npx vitest run tests/screen-two.test.tsx -t "continue"` | No -- Wave 0 |
| TILE-05 | Selections persist in session | unit | `npx vitest run tests/screen-two.test.tsx -t "session"` | No -- Wave 0 |
| MAP-03 | Card closes via Escape/backdrop | unit | `npx vitest run tests/screen-three.test.tsx -t "close"` | No -- Wave 0 |
| PATH-03 | Accordion allows only one expanded | unit | `npx vitest run tests/screen-four.test.tsx -t "accordion"` | No -- Wave 0 |
| BRDG-02 | Checklist toggle state works | unit | `npx vitest run tests/post-vr.test.tsx -t "toggle"` | No -- Wave 0 |
| BRDG-04 | Progress count updates | unit | `npx vitest run tests/post-vr.test.tsx -t "progress"` | No -- Wave 0 |

Note: Screen 3 (MapLibre) tests may need to mock maplibre-gl since it requires WebGL context not available in jsdom. Test the selection state logic and bottom sheet behavior, not map rendering.

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/screen-one.test.tsx` -- covers HOOK-01, HOOK-02, HOOK-04
- [ ] `tests/screen-two.test.tsx` -- covers TILE-01 through TILE-05
- [ ] `tests/screen-three.test.tsx` -- covers MAP-02, MAP-03 (mock maplibre-gl)
- [ ] `tests/screen-four.test.tsx` -- covers PATH-01, PATH-02, PATH-03
- [ ] `tests/post-vr.test.tsx` -- covers BRDG-01 through BRDG-05
- [ ] maplibre-gl mock setup for jsdom environment

## Sources

### Primary (HIGH confidence)
- Existing codebase: `app/pre-vr/components/Screen*.tsx`, `content/carpentry.json`, `content/types.ts`, `context/SessionContext.tsx` -- read directly
- mapcn official docs (https://mapcn.vercel.app/docs) -- installation, Map component API, MapMarker, MapPopup
- MapLibre GL MapOptions (https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/) -- interaction disable props
- DESIGN_SPECS.md -- animation inventory, component specifications, responsive breakpoints
- TECH_SPECS.md -- architecture, content schema, state management

### Secondary (MEDIUM confidence)
- Frontend Masters CSS odometer blog post -- CSS transform technique for digit animation
- MapLibre non-interactive map example (https://maplibre.org/maplibre-gl-js/docs/examples/display-a-non-interactive-map/)
- OpenFreeMap tile styles -- free tile URL patterns

### Tertiary (LOW confidence)
- Exact mapcn prop passthrough behavior for `interactive: false` -- needs implementation-time verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- existing codebase is well-understood, mapcn verified via official docs
- Architecture: HIGH -- pattern is clear (replace placeholder shells, same files/exports)
- Pitfalls: HIGH -- common React/CSS animation issues well-documented
- Map integration: MEDIUM -- mapcn API confirmed but `interactive` prop passthrough unverified

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable stack, no fast-moving dependencies)
