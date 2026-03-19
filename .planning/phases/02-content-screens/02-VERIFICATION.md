---
phase: 02-content-screens
verified: 2026-03-19T16:10:00Z
status: gaps_found
score: 5/7 must-have truths verified
re_verification: false
gaps:
  - truth: "Pre-VR flow integration tests pass with ScreenOne rendered in context"
    status: failed
    reason: "ScreenOne.tsx calls window.matchMedia in useEffect, but the vitest jsdom environment in pre-vr-flow.test.tsx does not mock window.matchMedia. This breaks 8 pre-existing Phase 1 tests (FLOW-01, FLOW-02, FLOW-04)."
    artifacts:
      - path: "app/pre-vr/components/ScreenOne.tsx"
        issue: "useReducedMotion hook calls window.matchMedia which is undefined in jsdom without a mock"
    missing:
      - "Add window.matchMedia mock to vitest setup file (e.g. vitest.setup.ts) OR guard the matchMedia call with typeof window !== 'undefined' && window.matchMedia check"
  - truth: "PATH-04: Pathway content references Miller Collegiate, SaskPolytech, and Saskatchewan Youth Internship Program"
    status: failed
    reason: "carpentry.json step-2 does not name Miller Collegiate (uses generic 'High School'). Step-3 programs lists 'Saskatchewan Polytechnic' and 'SIIT' — not 'SaskPolytech'. 'Saskatchewan Youth Internship Program' is absent entirely."
    artifacts:
      - path: "content/carpentry.json"
        issue: "screenFour.steps[1] has no 'Miller Collegiate' reference. screenFour.steps[2].programs contains ['Saskatchewan Polytechnic', 'SIIT'] but not 'SaskPolytech' or 'Saskatchewan Youth Internship Program'."
    missing:
      - "Add 'Miller Collegiate' reference in step-2 (subtitle or courses)"
      - "Add 'Saskatchewan Youth Internship Program' in one of the later steps (e.g. step-4 programs)"
      - "Note: 'Saskatchewan Polytechnic' is acceptable for 'SaskPolytech' IF the requirement text is not literal — flag for human confirmation"
human_verification:
  - test: "MAP-01 implementation approach"
    expected: "Requirement says 'Static SVG illustrated map' but implementation uses live MapLibre GL tiles. The CONTEXT.md pre-approved this divergence. Confirm the product owner accepts MapLibre GL as satisfying MAP-01."
    why_human: "This is a requirements-vs-implementation divergence that was documented as intentional. A human must confirm whether the requirement text should be updated to reflect the actual implementation."
  - test: "Screen 1 salary counter animation (HOOK-01)"
    expected: "Counter ticks from 0 to $72,000 with ease-out odometer digit rolls over ~2 seconds"
    why_human: "Animation behavior requires visual inspection in a browser — cannot verify CSS transform timing programmatically"
  - test: "Screen 2 tile selection visual feedback (TILE-02)"
    expected: "Selected tile shows Primary Blue border + checkmark badge in top-right corner"
    why_human: "Visual state requires browser rendering to confirm"
  - test: "Screen 3 employer map renders with pins (MAP-02)"
    expected: "MapLibre GL map loads centered on Regina with 5 blue pin buttons visible and tappable"
    why_human: "MapLibre GL requires WebGL which is not available in CI/jsdom; visual verification needed in browser"
  - test: "Screen 4 accordion animation (PATH-02/PATH-03)"
    expected: "Expanding a step smoothly animates open using grid-template-rows transition; only one step expanded at a time"
    why_human: "CSS grid-template-rows transition requires visual inspection"
---

# Phase 2: Content Screens Verification Report

**Phase Goal:** Students experience all six Pre-VR screens and the Post-VR checklist as interactive, content-rich pages that build context for the VR simulation and guide post-VR reflection
**Verified:** 2026-03-19T16:10:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Salary counter animates from 0 to $72,000 with odometer-style digit roll | VERIFIED | ScreenOne.tsx: OdometerDigit component uses CSS translateY(-{digit*10}%) with 2000ms transition, stagger delays, requestAnimationFrame trigger |
| 2 | Stat cards appear in staggered fade-in sequence after counter lands | VERIFIED | ScreenOne.tsx: animate-stat-fade-in class + animationDelay 2300ms/2500ms/2700ms per card |
| 3 | prefers-reduced-motion shows final salary immediately with no animations | VERIFIED | ScreenOne.tsx: useReducedMotion hook checks window.matchMedia; when reduced=true, isVisible=true immediately and animate prop=false |
| 4 | Six task tiles render with emoji illustrations in responsive grid | VERIFIED | ScreenTwo.tsx: maps data.tiles with emoji circle (24px emoji in 48px circle), grid-cols-2 md:grid-cols-3 |
| 5 | Employer map centered on Regina with tappable pins | VERIFIED (human needed) | ScreenThree.tsx: maplibregl.Map with REGINA_CENTER=[-104.6189, 50.4452], 5 employer markers with DOM button elements and aria-labels |
| 6 | PATH-04: Pathway references Miller Collegiate, SaskPolytech, Saskatchewan Youth Internship Program | FAILED | carpentry.json: step-2 has no Miller Collegiate, step-3 has 'Saskatchewan Polytechnic'+'SIIT', no Youth Internship Program anywhere |
| 7 | Pre-VR flow integration tests pass with ScreenOne in context | FAILED | 8 tests in pre-vr-flow.test.tsx fail: "window.matchMedia is not a function" — ScreenOne.tsx useReducedMotion breaks jsdom environment |

**Score:** 5/7 truths verified (+ 2 human-verification items)

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `tests/screen-one.test.tsx` | Stub tests for HOOK-01, HOOK-02, HOOK-04 | VERIFIED | 7 it.todo() tests in salary-counter, stat-cards, reduced-motion describe blocks |
| `tests/screen-two.test.tsx` | Stub tests for TILE-01 through TILE-05 | VERIFIED | 10 it.todo() tests across tiles, select, max, continue, session |
| `tests/screen-three.test.tsx` | Stub tests for MAP-02, MAP-03 with maplibre-gl mock | VERIFIED | vi.mock('maplibre-gl') + 5 it.todo() tests |
| `tests/screen-four.test.tsx` | Stub tests for PATH-01, PATH-02, PATH-03 | VERIFIED | 8 it.todo() tests across timeline, expand, accordion |
| `tests/screen-six.test.tsx` | Stub tests for PREP-01 | VERIFIED | 3 it.todo() tests in prompts block |
| `tests/post-vr.test.tsx` | Stub tests for BRDG-01 through BRDG-05 | VERIFIED | 8 it.todo() tests across checklist, toggle, progress, myblueprint |
| `content/types.ts` | emoji field on tiles, lng/lat on employer pinPosition | VERIFIED | Line 30: `emoji: string`; line 44: `pinPosition: { lng: number; lat: number }` |
| `content/carpentry.json` | Real content with emoji, coordinates, salary=$72K | VERIFIED | amount=72000, emoji on all 6 tiles, lng/lat on all 5 employers |
| `styles/globals.css` | @keyframes shake, stat-fade-in, check-bounce | VERIFIED | Lines 75-90: all 3 keyframes present with utility classes + reduced-motion rules |
| `app/pre-vr/components/ScreenOne.tsx` | Odometer counter + stat badges | VERIFIED | 143-line implementation with OdometerDigit, useReducedMotion, staggered badges |
| `app/pre-vr/components/ScreenTwo.tsx` | Interactive tile grid with session persistence | VERIFIED | 136-line implementation with useSession, aria-pressed, shake, dynamic button |
| `app/pre-vr/components/ScreenThree.tsx` | MapLibre map with employer pins and bottom sheet | VERIFIED | 181-line implementation with maplibregl.Map, 5 markers, role="dialog", Escape handler |
| `app/pre-vr/components/ScreenFour.tsx` | Career pathway timeline with accordion | VERIFIED | 137-line implementation with expandedStepId, gridTemplateRows, aria-expanded, pulse node |
| `app/pre-vr/components/ScreenSix.tsx` | VR prep screen with observation prompt cards | VERIFIED | 38-line server component (no use client), 3 prompt cards, aria-hidden icons |
| `app/post-vr/page.tsx` | Post-VR checklist with toggle state and myBlueprint CTA | VERIFIED | 110-line implementation with checkedItems state, role="checkbox", progress count, target="_blank" |
| `app/pre-vr/page.tsx` | Updated to lazy-load ScreenThree | VERIFIED | Line 9: `const ScreenThree = lazy(() => import('./components/ScreenThree'))` + Suspense wrapper |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `ScreenOne.tsx` | `content/config.ts` | `import { content } from '@/content/config'` | WIRED | Line 4: import present; line 6: `const data = content.screenOne` |
| `ScreenTwo.tsx` | `context/SessionContext.tsx` | `useSession().setSelectedTiles()` | WIRED | Line 5: import present; line 11: `const { selectedTiles, setSelectedTiles } = useSession()`; line 17: setSelectedTiles called in toggle handler |
| `ScreenTwo.tsx` | `content/config.ts` | `content.screenTwo` | WIRED | Line 4: import; line 8: `const data = content.screenTwo` |
| `ScreenThree.tsx` | `content/config.ts` | `content.screenThree` | WIRED | Line 4: import; line 12: `const data = content.screenThree` |
| `ScreenFour.tsx` | `content/config.ts` | `content.screenFour` | WIRED | Line 4: import; line 7: `const data = content.screenFour` |
| `ScreenSix.tsx` | `content/config.ts` | `content.screenSix` | WIRED | Line 1: import; line 3: `const data = content.screenSix` |
| `app/post-vr/page.tsx` | `content/config.ts` | `content.postVr` | WIRED | Line 4: import; line 7: `const data = content.postVr` |
| `app/pre-vr/page.tsx` | `ScreenThree.tsx` | `React.lazy(() => import(...))` | WIRED | Line 9: lazy import present; line 19: wrapped in Suspense with "Loading map..." fallback |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| HOOK-01 | 02-00, 02-01 | Animated counter ticks up to Saskatchewan carpenter salary | SATISFIED | OdometerDigit with 2000ms ease-out translateY transition |
| HOOK-02 | 02-01 | 2-3 additional headline stat cards | SATISFIED | 3 stat cards (4200+ jobs, 12% growth, 350+ employers) with stagger |
| HOOK-03 | 02-01 | Saskatchewan-specific hardcoded content | SATISFIED | "Saskatchewan Labour Market Information, 2025" source, "Jobs in Saskatchewan" labels |
| HOOK-04 | 02-00, 02-01 | prefers-reduced-motion shows final number immediately | SATISFIED | useReducedMotion hook; when reduced=true, isVisible=true immediately, animate prop=false |
| TILE-01 | 02-02 | Six tiles in responsive grid | SATISFIED | 6 tiles in grid-cols-2 md:grid-cols-3, each with emoji circle |
| TILE-02 | 02-00, 02-02 | Select 2-3 tiles with visual selected state | SATISFIED | aria-pressed, Primary Blue border + checkmark badge when isSelected |
| TILE-03 | 02-02 | Fourth selection prevented with inline feedback | SATISFIED | maxSelections check triggers animate-shake + "You can pick up to 3!" message |
| TILE-04 | 02-02 | Continue button disabled until 2 tiles selected | SATISFIED | isDisabled = selectedTiles.length < data.minSelections; dynamic buttonLabel |
| TILE-05 | 02-02 | Tile selections persisted in session state | SATISFIED | useSession() — selectedTiles/setSelectedTiles from SessionContext (survives navigation) |
| MAP-01 | 02-03 | Static SVG illustrated map with 4-6 pins | PARTIAL | Implementation uses MapLibre GL (live tiles) not SVG — pre-approved in CONTEXT.md. Needs human confirmation requirement text should be updated. |
| MAP-02 | 02-00, 02-03 | Pin tap opens company card | SATISFIED | DOM button elements with click handlers → setSelectedEmployer → employer card with role="dialog" |
| MAP-03 | 02-00, 02-03 | Card closes via X, backdrop, Escape | SATISFIED | closeCard on X button, backdrop div onClick=closeCard, keydown Escape handler |
| MAP-04 | 02-03 | Map not zoomable/pannable | SATISFIED | interactive:false on map init + explicit disables for scrollZoom, dragPan, doubleClickZoom, touchZoomRotate, keyboard |
| MAP-05 | 02-03 | Employer data structured as JSON | SATISFIED | content/carpentry.json with employer objects containing id, name, description, employeeCount, pinPosition |
| PATH-01 | 02-00, 02-02 | Vertical timeline 5 steps starting "You are here" | SATISFIED | 5 steps rendered, step-1 title "You are here - Grade 7/8", pulse-dot on first node |
| PATH-02 | 02-02 | Tapping step expands with details | SATISFIED | toggleStep handler, gridTemplateRows 0fr/1fr transition, description + badges + courses rendered |
| PATH-03 | 02-00, 02-02 | One step expanded at a time (accordion) | SATISFIED | setExpandedStepId(prev => prev === stepId ? null : stepId) — single ID state |
| PATH-04 | 02-02 | References Miller Collegiate, SaskPolytech, Saskatchewan Youth Internship Program | FAILED | carpentry.json has 'Saskatchewan Polytechnic'+'SIIT' in step-3; no Miller Collegiate, no Youth Internship Program |
| PREP-01 | 02-00, 02-04 | VR simulation description displayed | SATISFIED | ScreenSix: heading + subtext from content.screenSix rendered |
| PREP-02 | 02-04 | 2-3 observation prompts as visual cards | SATISFIED | 3 prompt cards with soft blue (#E0F0FF) background, emoji icon, prompt.text |
| PREP-03 | 02-04 | Navigate back with state preserved | SATISFIED | ScreenSix is screen 6 in PreVRPage; Navigation component handles back nav; SessionContext persists state |
| PREP-04 | 02-04 | No required interactions (read-only) | SATISFIED | ScreenSix has no useState, no onClick handlers — pure server component |
| BRDG-01 | 02-00, 02-04 | Congratulatory message acknowledging VR completion | SATISFIED | "Nice work, explorer!" heading + "You just experienced what it's like..." subtext |
| BRDG-02 | 02-00, 02-04 | Six checklist items with toggle state | SATISFIED | 6 items with role="checkbox", aria-checked, toggleItem handler; note: labels are placeholder text |
| BRDG-03 | 02-04 | Checklist state is session-only | SATISFIED | useState<string[]>([]) — no localStorage, no SessionContext |
| BRDG-04 | 02-00, 02-04 | Progress count (N of 6 complete) | SATISFIED | `{checkedItems.length} of {data.checklist.length} complete` with blue highlight on N when N>0 |
| BRDG-05 | 02-00, 02-04 | myBlueprint link opens in new tab | SATISFIED | `<a target="_blank" rel="noopener noreferrer" href={data.myblueprintLink.url}>` |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/pre-vr/components/ScreenOne.tsx` | 15 | `window.matchMedia` called without environment guard | Blocker | Breaks 8 pre-existing Phase 1 integration tests in pre-vr-flow.test.tsx (TypeError: window.matchMedia is not a function) |
| `content/carpentry.json` | 144 | PATH-04 specific institutions missing (Miller Collegiate, Youth Internship Program) | Warning | PATH-04 requirement not satisfied — Saskatchewan-specific named institutions listed in requirements are absent |

---

## Human Verification Required

### 1. MAP-01 Requirements Divergence

**Test:** Open REQUIREMENTS.md MAP-01 and compare with ScreenThree implementation.
**Expected:** MAP-01 says "Static SVG illustrated map" but implementation uses live MapLibre GL tiles. CONTEXT.md pre-approved this. Product owner should confirm MAP-01 text should be updated to "MapLibre GL interactive map (pins only, non-pannable/zoomable)" or the current text is acceptable as satisfied.
**Why human:** Requirements text diverges from implementation intent. Needs stakeholder sign-off.

### 2. Screen 1 Salary Counter Animation (HOOK-01)

**Test:** Navigate to /pre-vr in a browser. Watch Screen 1 load.
**Expected:** Dollar digits roll from 0 to each target digit over ~2 seconds with ease-out easing and 50ms stagger between digits. Three stat badge cards fade in starting at 2300ms.
**Why human:** CSS transform animations require visual inspection; cannot verify timing programmatically.

### 3. Screen 2 Tile Selection Visual States (TILE-02)

**Test:** Select and deselect tiles on Screen 2.
**Expected:** Selected tiles show Primary Blue (#0092FF) border, Light Blue background, and white checkmark badge in top-right. 4th tap shows shake animation and "You can pick up to 3!" message.
**Why human:** Conditional CSS class application requires visual confirmation.

### 4. Screen 3 Employer Map (MAP-02, MAP-04)

**Test:** Navigate to Screen 3. Confirm map loads, pins appear, tapping a pin opens a card.
**Expected:** MapLibre GL map centered on Regina, 5 blue pin buttons visible, tapping opens bottom sheet with employer details. Map does not pan or zoom.
**Why human:** WebGL/MapLibre GL cannot run in jsdom; requires browser.

### 5. Screen 4 Accordion Animation (PATH-02, PATH-03)

**Test:** Tap different steps on Screen 4.
**Expected:** Steps expand smoothly via grid-template-rows transition. Only one step open at a time. First step starts expanded.
**Why human:** grid-template-rows transition requires visual inspection.

---

## Gaps Summary

Two gaps block full goal achievement:

**Gap 1 — Test Regression (Blocker):** Phase 2 ScreenOne.tsx calls `window.matchMedia` in a `useEffect`, but the Phase 1 integration test file `tests/pre-vr-flow.test.tsx` renders `PreVRPage` (which includes ScreenOne) without mocking `window.matchMedia`. This causes 8 pre-existing Phase 1 tests to fail with `TypeError: window.matchMedia is not a function`. The fix requires either (a) adding a `window.matchMedia` mock to the vitest setup file, or (b) guarding the `matchMedia` call in `useReducedMotion` with an environment check.

**Gap 2 — PATH-04 Content (Warning):** `carpentry.json` does not include the three Saskatchewan-specific institutions named in PATH-04: "Miller Collegiate" (a Regina high school), "SaskPolytech" (the correct abbreviation used in the requirement), and "Saskatchewan Youth Internship Program". The current data uses generic labels ("High School", "Saskatchewan Polytechnic", "SIIT"). While placeholder content is acceptable per HOOK-03, PATH-04 specifically requires these named institutions.

These two gaps prevent the phase from being declared fully passed. The blocker gap (window.matchMedia regression) will cause CI failures.

---

_Verified: 2026-03-19T16:10:00Z_
_Verifier: Claude (gsd-verifier)_
