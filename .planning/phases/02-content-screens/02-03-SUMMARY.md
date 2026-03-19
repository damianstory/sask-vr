---
phase: 02-content-screens
plan: 03
subsystem: ui
tags: [maplibre-gl, react-lazy, suspense, map, employer-pins, bottom-sheet]

requires:
  - phase: 02-content-screens/02-01
    provides: Content schema with screenThree employer data and pinPosition coordinates
  - phase: 01-foundation-shell/01-02
    provides: Screen shell placeholders and navigation system
provides:
  - Interactive MapLibre GL map centered on Regina with employer pin markers
  - Bottom sheet employer card with close via X/backdrop/Escape
  - Code-split lazy loading of ScreenThree to keep maplibre-gl out of initial bundle
affects: [02-content-screens]

tech-stack:
  added: [maplibre-gl]
  patterns: [React.lazy code-splitting for heavy dependencies, programmatic MapLibre markers with DOM elements]

key-files:
  created: []
  modified:
    - app/pre-vr/components/ScreenThree.tsx
    - app/pre-vr/page.tsx
    - styles/globals.css
    - package.json

key-decisions:
  - "Used maplibre-gl directly instead of mapcn -- no components.json/shadcn setup in project"
  - "Programmatic markers via maplibregl.Marker with custom DOM button elements for pin interactivity"
  - "Code-split Screen 3 with React.lazy to keep ~200KB maplibre-gl out of initial bundle"

patterns-established:
  - "Heavy-dependency code-splitting: use React.lazy + Suspense for components with large library deps"
  - "Map marker pattern: create DOM button elements with aria-labels, attach click handlers, add to map via Marker API"

requirements-completed: [MAP-01, MAP-02, MAP-03, MAP-04, MAP-05]

duration: 3min
completed: 2026-03-19
---

# Phase 2 Plan 3: Employer Map Summary

**MapLibre GL map with 5 employer pins, bottom sheet cards, and React.lazy code-splitting for bundle optimization**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-19T20:02:40Z
- **Completed:** 2026-03-19T20:05:10Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- MapLibre GL map renders centered on Regina, SK at zoom 11 with CARTO positron tiles
- 5 employer pin markers visible and tappable with proper aria-labels
- Bottom sheet employer card with company name, description, employee count, and optional quote
- Card closes via X button, backdrop tap, or Escape key
- All map interactions disabled (no pan, zoom, rotate)
- ScreenThree lazy-loaded via React.lazy with Suspense fallback to keep maplibre-gl out of initial bundle

## Task Commits

Each task was committed atomically:

1. **Task 1: Install maplibre-gl and implement Screen 3 with map, pins, and employer bottom sheet** - `d9ccc08` (feat)
2. **Task 2: Code-split Screen 3 with React.lazy in pre-vr page** - `95cc106` (feat)

## Files Created/Modified
- `app/pre-vr/components/ScreenThree.tsx` - Full map implementation replacing placeholder
- `app/pre-vr/page.tsx` - React.lazy + Suspense wrapping for ScreenThree
- `styles/globals.css` - Added scale-fade-in keyframe for card entrance animation
- `package.json` - Added maplibre-gl dependency
- `package-lock.json` - Lock file updated

## Decisions Made
- Used maplibre-gl directly instead of mapcn since project has no components.json/shadcn setup
- Created programmatic markers with custom DOM button elements for pin interactivity and accessibility
- Used CARTO positron style for free, light, minimal map tiles

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used maplibre-gl directly instead of mapcn shadcn registry**
- **Found during:** Task 1
- **Issue:** No components.json in project; shadcn CLI would fail without initialization
- **Fix:** Installed maplibre-gl directly and built map component using the native API (plan explicitly covered this fallback path)
- **Files modified:** package.json, app/pre-vr/components/ScreenThree.tsx
- **Verification:** Build succeeds, type-check passes
- **Committed in:** d9ccc08

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Plan explicitly included this fallback. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Screen 3 is fully implemented with map rendering and employer interaction
- Ready for Screen 4 (Career Pathway Timeline) implementation
- maplibre-gl is properly code-split so it won't affect initial bundle performance

## Self-Check: PASSED

- All key files exist (ScreenThree.tsx, page.tsx, globals.css)
- All commits found (d9ccc08, 95cc106)
- TypeScript type-check passes
- Production build succeeds
- Tests pass (5 todo, 0 failures)

---
*Phase: 02-content-screens*
*Completed: 2026-03-19*
