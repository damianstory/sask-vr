# Roadmap: Career Explorer Micro-Site

## Overview

This roadmap delivers a complete VR-bookend micro-site for the Saint Luke School pilot (April 6, 2026). Four phases move from project foundation through content screens and the card builder to a final polish pass. The structure follows the natural dependency chain: content schema and session state must exist before screens can consume them, Screen 2's task selections must work before the Card Builder can use them, and analytics/accessibility verification requires the full flow to exist.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation + Shell** - Project scaffold, content architecture, session state, routing, and page skeletons
- [ ] **Phase 2: Content Screens** - Screens 1-4, Screen 6, and Post-VR checklist with full interactivity
- [ ] **Phase 3: Card Builder** - Screen 5 with name input, icon picker, live preview, Canvas compositing, and PNG download
- [ ] **Phase 4: Analytics + Polish** - GA4 event tracking, accessibility audit, performance verification, and deployment validation

## Phase Details

### Phase 1: Foundation + Shell
**Goal**: Students can navigate between landing page, Pre-VR flow, and Post-VR page with working routing, progress indication, and session state that survives backward navigation
**Depends on**: Nothing (first phase)
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, FLOW-01, FLOW-02, FLOW-03, FLOW-04, CONT-01, CONT-02, CONT-03, CONT-04, PERF-05
**Success Criteria** (what must be TRUE):
  1. Student can tap Pre-VR or Post-VR on the landing page and arrive at the correct route
  2. Pre-VR flow renders six placeholder screens within a single /pre-vr route, navigable forward and backward without losing state
  3. Progress bar visually reflects current screen position (1 of 6 through 6 of 6)
  4. All screen content is driven by a typed JSON file (carpentry.json) with placeholder data populated for every screen
  5. Post-VR route (/post-vr) is directly accessible via URL for QR code entry
**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffold, content schema, brand tokens, and landing page with path cards
- [x] 01-02-PLAN.md — Pre-VR flow with session state, progress bar, navigation, screen shells, and Post-VR page
- [x] 01-03-PLAN.md — Gap closure: centralize content loading for occupation-agnostic architecture (CONT-03)

### Phase 2: Content Screens
**Goal**: Students experience all six Pre-VR screens and the Post-VR checklist as interactive, content-rich pages that build context for the VR simulation and guide post-VR reflection
**Depends on**: Phase 1
**Requirements**: HOOK-01, HOOK-02, HOOK-03, HOOK-04, TILE-01, TILE-02, TILE-03, TILE-04, TILE-05, MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, PATH-01, PATH-02, PATH-03, PATH-04, PREP-01, PREP-02, PREP-03, PREP-04, BRDG-01, BRDG-02, BRDG-03, BRDG-04, BRDG-05
**Success Criteria** (what must be TRUE):
  1. Screen 1 displays an animated salary counter that ticks up to the Saskatchewan carpenter salary, with supporting stat cards
  2. Screen 2 presents six task tiles where the student can select 2-3 (no more), and those selections persist when navigating away and back
  3. Screen 3 shows a MapLibre GL map of Regina with tappable employer pins that open and close company cards
  4. Screen 4 displays a career pathway timeline with expandable accordion steps referencing Saskatchewan programs
  5. Screen 6 shows VR prep content with observation prompts and no required interactions
  6. Post-VR page displays a 6-item checkable checklist with progress count and a prominent myBlueprint link that opens in a new tab
**Plans:** 6 plans

Plans:
- [ ] 02-00-PLAN.md — Wave 0 test scaffolds: six stub test files for Nyquist compliance
- [ ] 02-01-PLAN.md — Content schema updates (types, JSON, CSS keyframes) and Screen 1 salary counter hook
- [ ] 02-02-PLAN.md — Screen 2 task tile grid with selection logic and Screen 4 career pathway timeline
- [ ] 02-03-PLAN.md — Screen 3 employer map with mapcn/MapLibre GL, pins, and bottom sheet cards
- [ ] 02-04-PLAN.md — Screen 6 VR prep prompt cards and Post-VR interactive checklist
- [ ] 02-05-PLAN.md — Gap closure: vitest matchMedia mock + PATH-04 content fixes

### Phase 3: Card Builder
**Goal**: Students create a personalized Carpenter Card by entering their name and choosing an icon, then download it as a tangible PNG artifact they keep
**Depends on**: Phase 2 (requires Screen 2 task selections in session state)
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, CARD-06, CARD-07, CARD-08, CARD-09, PERF-03
**Success Criteria** (what must be TRUE):
  1. Student can enter their first name (1-30 chars) and select one of six icons, with the live card preview updating in real time
  2. Task selections from Screen 2 appear as non-editable tag chips on the card builder and on the card itself
  3. Download button produces a 1200x675px PNG file with the student's name, icon, task labels, and a background variant determined by their selections
  4. Download button is disabled until both name and icon are provided; student name never leaves the browser
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Analytics + Polish
**Goal**: The complete micro-site is instrumented with GA4 analytics, meets WCAG AA accessibility standards, and performs within budget on school Chromebooks
**Depends on**: Phase 3
**Requirements**: ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ANLY-06, ANLY-07, ANLY-08, ANLY-09, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, PERF-01, PERF-02, PERF-04, PERF-06
**Success Criteria** (what must be TRUE):
  1. GA4 fires page view events for every screen transition and tracks tile selections, pin taps, pathway expansions, card interactions, and checklist checks with zero PII in any event
  2. Every interactive element is keyboard-focusable and operable; screen readers announce semantic roles (aria-pressed, aria-expanded, role="dialog")
  3. All text meets WCAG AA contrast ratios (4.5:1 text, 3:1 UI) and all touch targets are minimum 44x44px
  4. Landing page LCP is under 3 seconds on a school Chromebook, screen transitions are under 500ms, and total JS bundle is under 150KB gzipped
  5. Site is responsive from 320px mobile through 1366x768 Chromebook, deployed on Vercel with static generation
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Shell | 3/3 | Complete | 2026-03-19 |
| 2. Content Screens | 4/6 | In Progress|  |
| 3. Card Builder | 0/1 | Not started | - |
| 4. Analytics + Polish | 0/2 | Not started | - |
