---
phase: 01-foundation-shell
plan: 03
subsystem: content
tags: [typescript, content-config, centralization, gap-closure]

# Dependency graph
requires:
  - phase: 01-foundation-shell
    provides: "Content types (OccupationContent), carpentry.json, screen components, landing page"
provides:
  - "Centralized content config layer (content/config.ts)"
  - "Single-point OCCUPATION constant for occupation switching"
  - "All consumers importing from config instead of direct JSON"
affects: [02-pre-vr-screens, 03-post-vr-screens]

# Tech tracking
tech-stack:
  added: []
  patterns: ["centralized content config with single OCCUPATION constant"]

key-files:
  created: [content/config.ts]
  modified: [app/pre-vr/components/ScreenOne.tsx, app/pre-vr/components/ScreenTwo.tsx, app/pre-vr/components/ScreenThree.tsx, app/pre-vr/components/ScreenFour.tsx, app/pre-vr/components/ScreenFive.tsx, app/pre-vr/components/ScreenSix.tsx, app/post-vr/page.tsx, app/page.tsx, tests/content-schema.test.ts]

key-decisions:
  - "Content config exports typed content directly -- consumers no longer need type assertions"

patterns-established:
  - "Content import pattern: always import { content } from '@/content/config', never from JSON directly"
  - "Landing page text uses content.meta fields for occupation-specific strings"

requirements-completed: [CONT-03]

# Metrics
duration: 2min
completed: 2026-03-19
---

# Phase 1 Plan 3: Content Config Layer Summary

**Centralized content loading via content/config.ts with OCCUPATION constant so adding a new occupation requires only a new JSON file and one config change**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-19T18:41:42Z
- **Completed:** 2026-03-19T18:43:28Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Created content/config.ts with OCCUPATION constant and typed content export
- Updated all 8 consumer files (6 screens + post-vr page + landing page) to import from config layer
- Landing page now uses content.meta fields for occupation-specific text instead of hardcoded strings
- Updated test suite to validate config layer exports; all 24 tests pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content config layer and update all consumers** - `e6be592` (feat)
2. **Task 2: Update content-schema test to use config layer** - `4ea13c1` (test)

## Files Created/Modified
- `content/config.ts` - Centralized content config with OCCUPATION constant and typed content export
- `app/pre-vr/components/ScreenOne.tsx` - Import from config instead of direct JSON
- `app/pre-vr/components/ScreenTwo.tsx` - Import from config instead of direct JSON
- `app/pre-vr/components/ScreenThree.tsx` - Import from config instead of direct JSON
- `app/pre-vr/components/ScreenFour.tsx` - Import from config instead of direct JSON
- `app/pre-vr/components/ScreenFive.tsx` - Import from config instead of direct JSON
- `app/pre-vr/components/ScreenSix.tsx` - Import from config instead of direct JSON
- `app/post-vr/page.tsx` - Import from config instead of direct JSON
- `app/page.tsx` - Import from config; use content.meta for dynamic occupation text
- `tests/content-schema.test.ts` - Import from config; added OCCUPATION validation tests

## Decisions Made
- Content config exports typed content directly so consumers no longer need OccupationContent type assertions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CONT-03 gap fully closed: switching occupation requires only a new JSON file and changing OCCUPATION in content/config.ts
- All screen components, pages, and tests use the centralized config layer
- Ready for Phase 2 screen builds which will continue using the config import pattern

---
*Phase: 01-foundation-shell*
*Completed: 2026-03-19*
