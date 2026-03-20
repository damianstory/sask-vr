---
phase: 04-analytics-polish
plan: 01
subsystem: analytics
tags: [ga4, google-analytics, event-tracking, next-third-parties]

requires:
  - phase: 02-screen-builds
    provides: All interactive screen components (ScreenTwo through ScreenFive, PostVR)
  - phase: 03-card-builder
    provides: Card download and icon picker in ScreenFive
provides:
  - Centralized typed analytics module (lib/analytics.ts) with 9 track helpers
  - GA4 GoogleAnalytics component in root layout with env var guard
  - Analytics calls wired into all interactive components
affects: [04-analytics-polish]

tech-stack:
  added: ["@next/third-parties"]
  patterns: ["centralized analytics module with typed helpers", "dev mode console.log fallback", "env var conditional GA loading"]

key-files:
  created: [lib/analytics.ts, tests/analytics.test.ts]
  modified: [app/layout.tsx, app/page.tsx, app/pre-vr/page.tsx, app/pre-vr/components/ScreenTwo.tsx, app/pre-vr/components/ScreenThree.tsx, app/pre-vr/components/ScreenFour.tsx, app/pre-vr/components/ScreenFive.tsx, app/post-vr/page.tsx]

key-decisions:
  - "Used @next/third-parties sendGAEvent wrapper -- official Next.js GA4 integration, no raw gtag calls"
  - "trackNameEntered fires once via useRef guard -- prevents spamming on every keystroke"
  - "Expand-only tracking for accordion and checklist -- collapse/uncheck events add noise without insight"

patterns-established:
  - "Analytics pattern: all GA4 events flow through lib/analytics.ts typed helpers, never direct gtag"
  - "PII guard: trackNameEntered and trackCardDownload accept zero parameters by design"
  - "Dev mode: all track calls console.log instead of sending to GA4 when NODE_ENV=development"

requirements-completed: [ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ANLY-06, ANLY-07, ANLY-08, ANLY-09]

duration: 4min
completed: 2026-03-19
---

# Phase 04 Plan 01: GA4 Analytics Summary

**Centralized typed analytics module with 9 event helpers, GA4 in root layout, and tracking wired into all interactive components**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T00:38:10Z
- **Completed:** 2026-03-20T00:42:02Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Created lib/analytics.ts with 9 typed track helpers wrapping @next/third-parties sendGAEvent
- Added GoogleAnalytics component to root layout with NEXT_PUBLIC_GA_MEASUREMENT_ID env var guard
- Wired analytics calls into all 7 interactive components across landing, pre-vr, and post-vr flows
- 11 unit tests covering all helpers in production and development modes
- Zero PII in any event -- trackNameEntered and trackCardDownload send no parameters

## Task Commits

Each task was committed atomically:

1. **Task 1: Create centralized analytics module (RED)** - `28dd874` (test)
2. **Task 1: Create centralized analytics module (GREEN)** - `cdc17bd` (feat)
3. **Task 2: Integrate analytics into all components** - `837a656` (feat)

_TDD task 1 has separate RED and GREEN commits._

## Files Created/Modified
- `lib/analytics.ts` - Centralized typed analytics module with 9 exported track helpers
- `tests/analytics.test.ts` - 11 unit tests for all helpers in prod and dev modes
- `app/layout.tsx` - GoogleAnalytics component with env var conditional rendering
- `app/page.tsx` - trackPathSelect on pre-vr and post-vr button clicks
- `app/pre-vr/page.tsx` - trackScreenView on every screen transition via useEffect
- `app/pre-vr/components/ScreenTwo.tsx` - trackTileSelect on tile select/deselect
- `app/pre-vr/components/ScreenThree.tsx` - trackEmployerTap on employer pin click
- `app/pre-vr/components/ScreenFour.tsx` - trackPathwayExpand on accordion expand only
- `app/pre-vr/components/ScreenFive.tsx` - trackIconSelect, trackNameEntered (once), trackCardDownload
- `app/post-vr/page.tsx` - trackChecklistCheck on check only (not uncheck)

## Decisions Made
- Used @next/third-parties sendGAEvent wrapper -- official Next.js GA4 integration, avoids raw gtag calls
- trackNameEntered fires once via useRef guard -- prevents spamming on every keystroke
- Expand-only tracking for accordion (ScreenFour) and check-only for checklist (PostVR) -- collapse/uncheck events add noise without insight
- Used step.title for pathway_expand step_label since data schema has title (not label)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error in sendGAEvent call**
- **Found during:** Task 2 (verification)
- **Issue:** `sendGAEvent` second param typed as `Object`, but `undefined` passed when no params
- **Fix:** Added type assertion `as Record<string, string>` on params
- **Files modified:** lib/analytics.ts
- **Verification:** `npx tsc --noEmit` passes cleanly
- **Committed in:** 837a656 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type assertion needed for TypeScript strictness. No scope creep.

## Issues Encountered
None.

## User Setup Required
Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable to your GA4 measurement ID (e.g., `G-XXXXXXXXXX`) before deploying. Analytics gracefully no-ops when this variable is missing.

## Next Phase Readiness
- Analytics foundation complete, all 9 event types instrumented
- Ready for Phase 4 Plan 2 (performance/accessibility polish) and Plan 3 (validation)
- GA4 property ID still needed as noted in STATE.md blockers

## Self-Check: PASSED

All 10 files verified present. All 3 task commits verified in git log.

---
*Phase: 04-analytics-polish*
*Completed: 2026-03-19*
