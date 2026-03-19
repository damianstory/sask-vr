---
phase: 02-content-screens
plan: 01
subsystem: ui
tags: [css-animations, odometer, tailwind, typescript, content-schema]

# Dependency graph
requires:
  - phase: 01-foundation-shell
    provides: Screen shells, content types, carpentry.json placeholders, globals.css with slide/pulse keyframes
provides:
  - Updated OccupationContent type with emoji on tiles and lng/lat on employers
  - Real carpentry content in carpentry.json (salary, stats, tiles, coordinates)
  - CSS keyframes for shake, stat-fade-in, check-bounce with reduced-motion handling
  - Interactive ScreenOne with odometer salary counter and staggered stat badges
affects: [02-02, 02-03, 02-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [odometer-digit-column, useReducedMotion-hook, staggered-css-animation-delay]

key-files:
  created: []
  modified:
    - content/types.ts
    - content/carpentry.json
    - styles/globals.css
    - app/pre-vr/components/ScreenOne.tsx

key-decisions:
  - "Used requestAnimationFrame for animation trigger instead of setTimeout(0) -- more reliable first-paint sync"
  - "Stat card stagger starts at 2300ms (counter 2000ms + 300ms gap) with 200ms between cards per UI-SPEC"

patterns-established:
  - "OdometerDigit: inline component using CSS translateY with transition-delay for staggered digit roll"
  - "useReducedMotion: shared hook pattern for prefers-reduced-motion detection with matchMedia listener"

requirements-completed: [HOOK-01, HOOK-02, HOOK-03, HOOK-04]

# Metrics
duration: 3min
completed: 2026-03-19
---

# Phase 2 Plan 01: Content Schema + Screen 1 Hook Summary

**Odometer-style salary counter ($72,000) with CSS digit rolls, staggered navy stat badges, and updated content schema with emoji/lng-lat fields for all Phase 2 screens**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-19T19:58:03Z
- **Completed:** 2026-03-19T20:01:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Updated OccupationContent type with emoji field on screenTwo tiles and lng/lat coordinates on screenThree employers
- Replaced all placeholder content in carpentry.json with real Saskatchewan carpentry data
- Added shake, stat-fade-in, check-bounce CSS keyframes with reduced-motion handling
- Built interactive ScreenOne with odometer digit animation (2000ms ease-out, 50ms stagger per digit) and staggered stat badge cards

## Task Commits

Each task was committed atomically:

1. **Task 1: Update content schema and CSS keyframes** - `bed67d8` (feat)
2. **Task 2: Implement Screen 1 Hook with odometer counter** - `539473c` (feat)

## Files Created/Modified
- `content/types.ts` - Added emoji field to tiles, changed pinPosition from x/y to lng/lat
- `content/carpentry.json` - Real salary ($72K), stats, tile content with emoji, Regina geo coordinates
- `styles/globals.css` - Three new keyframes (shake, stat-fade-in, check-bounce) + utility classes + reduced-motion rules
- `app/pre-vr/components/ScreenOne.tsx` - Full interactive implementation with odometer counter, stat badges, reduced-motion support

## Decisions Made
- Used requestAnimationFrame for animation trigger instead of setTimeout -- more reliable for first-paint sync
- Stat card stagger timing: 2300ms/2500ms/2700ms (counter 2000ms + 300ms gap + 200ms between cards)
- Font weight 800 (not 900) per project convention from Phase 1

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content schema updated for all Phase 2 screens (tiles have emoji, employers have geo coordinates)
- CSS animation library complete for Phase 2 (shake for tile overflow, stat-fade-in for counters, check-bounce for Post-VR)
- Screen 1 fully interactive, ready for integration testing
- Remaining screens (02-02 through 02-04) can consume updated types and content

## Self-Check: PASSED

All 4 files verified present. Both task commits (bed67d8, 539473c) verified in git log.

---
*Phase: 02-content-screens*
*Completed: 2026-03-19*
