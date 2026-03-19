---
phase: 02-content-screens
plan: 00
subsystem: testing
tags: [vitest, testing-library, maplibre-gl, user-event, test-stubs]

# Dependency graph
requires:
  - phase: 01-foundation-shell
    provides: Screen placeholder components, content config, SessionContext
provides:
  - Six test stub files with 43 pending test cases for Phase 2 screens
  - maplibre-gl jsdom mock pattern for Screen Three tests
  - SessionContext mock pattern for Screen Two tests
affects: [02-01-PLAN, 02-02-PLAN, 02-03-PLAN, 02-04-PLAN]

# Tech tracking
tech-stack:
  added: ["@testing-library/user-event"]
  patterns: ["vi.mock for content/config per-screen slicing", "maplibre-gl constructor mock for jsdom", "it.todo() for pending behavioral requirements"]

key-files:
  created:
    - tests/screen-one.test.tsx
    - tests/screen-two.test.tsx
    - tests/screen-three.test.tsx
    - tests/screen-four.test.tsx
    - tests/screen-six.test.tsx
    - tests/post-vr.test.tsx
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used it.todo() over it.skip() for vitest pending-test semantics"
  - "Mocked content/config per-file with only the slice each component needs"

patterns-established:
  - "Test mock pattern: vi.mock('@/content/config') with per-screen content slice"
  - "MapLibre mock: constructor returns object with chained method stubs"
  - "SessionContext mock: vi.mock with useSession returning controlled state"

requirements-completed: [HOOK-01, HOOK-04, TILE-02, TILE-03, TILE-04, TILE-05, MAP-02, MAP-03, PATH-01, PATH-02, PATH-03, PREP-01, BRDG-01, BRDG-02, BRDG-04, BRDG-05]

# Metrics
duration: 2min
completed: 2026-03-19
---

# Phase 2 Plan 00: Wave 0 Test Stubs Summary

**Six vitest stub files with 43 pending test cases covering all Phase 2 behavioral requirements, plus maplibre-gl jsdom mock**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-19T19:57:56Z
- **Completed:** 2026-03-19T19:59:39Z
- **Tasks:** 1
- **Files modified:** 8

## Accomplishments
- Created six test stub files with describe/it.todo blocks matching VALIDATION.md task IDs
- Established maplibre-gl mock pattern for jsdom (no WebGL) environment
- Installed @testing-library/user-event dependency
- All 43 todo tests reported as pending; 24 existing tests still passing (zero failures)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create six Wave 0 test stub files** - `99a4fdd` (test)

**Plan metadata:** pending

## Files Created/Modified
- `tests/screen-one.test.tsx` - Stubs for HOOK-01, HOOK-02, HOOK-04 (salary counter, stat cards, reduced motion)
- `tests/screen-two.test.tsx` - Stubs for TILE-01 through TILE-05 (tile rendering, selection, max, continue, session)
- `tests/screen-three.test.tsx` - Stubs for MAP-02, MAP-03 (employer pins, card close) with maplibre-gl mock
- `tests/screen-four.test.tsx` - Stubs for PATH-01, PATH-02, PATH-03 (timeline, expand, accordion)
- `tests/screen-six.test.tsx` - Stubs for PREP-01, PREP-04 (observation prompts, read-only)
- `tests/post-vr.test.tsx` - Stubs for BRDG-01, BRDG-02, BRDG-04, BRDG-05 (checklist, toggle, progress, myblueprint)
- `package.json` - Added @testing-library/user-event dev dependency
- `package-lock.json` - Lockfile updated

## Decisions Made
- Used `it.todo()` instead of `it.skip()` for proper vitest pending semantics (vitest reports them distinctly)
- Each test file mocks only the content slice its component uses, keeping mocks minimal and focused
- maplibre-gl mock returns chained method stubs to support any initialization pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All six test stub files ready for implementation plans 01-04 to flesh out with real assertions
- Implementation tasks can run `npx vitest run` after each change to verify progress
- maplibre-gl mock pattern established for Screen Three implementation

## Self-Check: PASSED

All 6 test files verified present. Commit 99a4fdd verified in git log.

---
*Phase: 02-content-screens*
*Completed: 2026-03-19*
