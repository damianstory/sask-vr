# Flow Restructure: 4 New Screens + Architecture Overhaul

**Plan:** `.claude/plans/abstract-coalescing-wozniak.md` (v7)
**Started:** 2026-04-03

---

## Phase 0 — Architectural Refactors (temporary 5-screen flow)

- [x] **0A. Config-driven screen flow**
  - Convert `app/pre-vr/page.tsx` from `ScreenNumber` union + `Record` to `SCREENS: ScreenConfig[]`
  - Implement `completedScreens: Record<string, boolean>` with session-derived initialization for gated screens
  - `ScreenThreeWrapper` local to page.tsx
  - Extract `useReducedMotion()` to `lib/hooks.ts` (shared across all screens)
  - Files: `app/pre-vr/page.tsx`, `lib/hooks.ts` (new)

- [x] **0B. SessionContext cleanup**
  - Remove: `selectedTiles`, `selectedIcon`, `generatedCardUrl` + setters
  - Add: `shuffledTileOrder`, `rankedTiles`, `rankingSubmitted`, `rankingScore`, `aiSortResults` (with `chosen` field), `aiSortComplete`
  - Keep: `firstName`
  - File: `context/SessionContext.tsx`

- [x] **0C. Content keys → semantic**
  - Rename in `types.ts`: screenOne→salaryHook, screenTwo→taskRanking, screenThree→employerMap, screenFour→careerPathway, screenFive→(remove), screenSix→vrPrep
  - Add new keys: videoSnippets, speedRun, aiSorting, tinyHouse (empty/placeholder schemas for now)
  - Rename in `carpentry.json`
  - Update all component imports
  - Update all test mocks
  - Verify: `rg "screenOne|screenTwo|screenThree|screenFour|screenFive|screenSix" content app lib tests context components` → zero results
  - Files: `content/types.ts`, `content/carpentry.json`, all screen components, all tests

- [x] **0D. Update analytics**
  - Remove: `trackIconSelect`, `trackCardDownload`, `trackTileSelect`
  - Rename: `trackNameEntered` → `trackStudentNameEntered` (single-fire via ref)
  - Add: `trackVideoNavigate`, `trackRankingSubmit` (array→join), `trackRankingScore`, `trackAISortAttempt`, `trackAISortComplete`, `trackTinyHouseDownload`
  - `trackScreenView` uses snake_case keys: `video_snippets`, `salary_hook`, etc.
  - File: `lib/analytics.ts`

- [x] **0E. Install @dnd-kit**
  - `npm install @dnd-kit/core @dnd-kit/sortable`
  - Files: `package.json`, `package-lock.json`

- [x] **0F. Remove card builder files** (AFTER 0A/0B/0C)
  - Delete: `ScreenFive.tsx`, `CardPreview.tsx`, `IconPicker.tsx`, `TaskTagChips.tsx`, `card-gradients.ts`, `screen-five.test.tsx`
  - Keep: `generate-card.ts` (reuse for tiny house PNG)

- [x] **Phase 0 gate**
  - `npm install && npm run type-check && npm run lint`
  - `npx vitest run tests/content-schema.test.ts`
  - Manual: verify 5-screen flow in browser, no console errors

---

## Phase 1 — Screen Updates

- [ ] **1A. Salary Hook redesign**
  - Schema: `hourlyRange`, `annualRange`, `selfEmployment` in salaryHook
  - Odometer for median annual, range bar below, self-employment callout card
  - File: `app/pre-vr/components/ScreenOne.tsx`, `content/carpentry.json`

- [ ] **1B. Task Ranking rework**
  - Replace tile selection with drag-and-drop ranking of all 6
  - @dnd-kit/sortable + visible up/down arrow buttons (first-class, not fallback)
  - Phase 1: ranking list, Phase 2: side-by-side reveal
  - Shuffle on first mount → `shuffledTileOrder` in session
  - Scoring: tie groups (14% tiles interchangeable in positions 3-5)
  - `gated: true` — calls `onComplete()` after submit
  - Revisit: show reveal directly if `rankingSubmitted`
  - File: `app/pre-vr/components/ScreenTwo.tsx`, `content/carpentry.json`

- [ ] **1C. Career Pathway — remove Grade 7/8 step**
  - Remove step-1 from JSON, 5 steps starting with High School
  - Head start widget stays in new step 1 (High School)
  - File: `content/carpentry.json`

- [ ] **Phase 1 gate**
  - `npm run type-check && npm run lint`
  - `npx vitest run tests/content-schema.test.ts`
  - Targeted: ranking behavior test (6 items render, reorder works, reveal shows)

---

## Phase 2 — New Screens (parallel-safe)

- [ ] **2A. Video Snippets** (`ScreenVideo.tsx`)
  - 6 YouTube Shorts carousel with arrow buttons
  - `youtube-nocookie.com`, `loading="lazy"`, `rel=0`, 9:16 portrait
  - No autoplay after navigation, focus to carousel region container
  - Single iframe at a time (swap src)
  - File: `app/pre-vr/components/ScreenVideo.tsx` (new)

- [ ] **2B. No-Debt Speed Run** (`ScreenSpeedRun.tsx`)
  - Side-by-side animated timelines (carpenter vs university)
  - `disclaimer` field for illustrative values
  - Timer cleanup on unmount, reduced-motion: milestones immediate
  - File: `app/pre-vr/components/ScreenSpeedRun.tsx` (new)

- [ ] **2C. AI Can't Build This** (`ScreenAI.tsx`)
  - Sort 6 tasks into AI/Human buckets, one at a time
  - Green/red feedback, score + punchline after all 6
  - `gated: true` — `onComplete()` after all sorted
  - Revisit: complete→show score, partial→restore progress (content order minus completed IDs)
  - Timer cleanup on unmount, reduced-motion: skip animations
  - File: `app/pre-vr/components/ScreenAI.tsx` (new)

- [ ] **Phase 2 gate**
  - `npm run type-check && npm run lint`
  - Targeted smoke tests: each screen renders without crashing

---

## Phase 3 — Flow Wiring + File Renames

- [ ] **Wire 8 screens into SCREENS array**
  - Final order: videoSnippets, salaryHook, speedRun, taskRanking, employerMap, careerPathway, aiSorting, vrPrep
  - `gated: true` on taskRanking and aiSorting

- [ ] **Rename component files**
  - `ScreenOne.tsx` → `ScreenSalary.tsx`
  - `ScreenTwo.tsx` → `ScreenTaskRanking.tsx`
  - Update all imports

- [ ] **Phase 3 gate**
  - `npm run type-check && npm run lint`
  - Run Phase 1/2 targeted tests
  - Manual: click through all 8 screens, progress bar "X of 8", gating on 4 and 7

---

## Phase 4 — Post-VR Tiny House Designer

- [ ] **TinyHouseDesigner component**
  - Top-down grid (24x12ft), pre-defined slots, tap→pick room
  - Skills mapping sidebar
  - Canvas PNG download (reuse generate-card.ts pattern)
  - Filename: `tiny-house-{sanitized}.png` (lowercase, strip non-alnum, collapse hyphens, fallback 'student')
  - 1200x675px, 20-char name truncation, URL.revokeObjectURL cleanup
  - Local state only (not SessionContext), `firstName` from session
  - File: `app/post-vr/components/TinyHouseDesigner.tsx` (new), `app/post-vr/page.tsx`

- [ ] **Phase 4 gate**
  - `npm run type-check && npm run lint`

---

## Phase 5 — Test Rewrite

- [ ] **5A. Flow navigation** — 8-screen progression, bounds
- [ ] **5A-gating. Navigation gating** — hide/reveal/reset/revisit cycle
- [ ] **5B. Content schema** — semantic keys, ordinal absent, array validations, ranking weight validation
- [ ] **5C. Task ranking** → `screen-task-ranking.test.tsx` — sortable, buttons, reveal, tie-group scoring, session, revisit
- [ ] **5D. AI sorting** → `screen-ai.test.tsx` — sort all 6, feedback, score, revisit restoration
- [ ] **5E. A11y** — axe for new screens, ARIA on sortables, keyboard nav
- [ ] **5F. Reduced-motion** — SpeedRun, AI Sorting, Career Pathway head start
- [ ] **5G. Video carousel** → `screen-video.test.tsx` — iframe src, title, no cross-origin testing
- [ ] **5H. Tiny house** → `tiny-house.test.tsx` — rooms, skills, download, sanitization, URL cleanup
- [ ] **5I. Remove obsolete** — delete screen-five.test.tsx, remove card builder flow assertions

- [ ] **Final gate**
  - `npm run type-check && npm run lint && npx vitest run`

---

## Context Window Handoff Notes

If continuing in a new context window:
1. Read this file first for current progress
2. Read the plan at `.claude/plans/abstract-coalescing-wozniak.md` for full design details
3. Check `git log --oneline -5` for latest commits
4. Check `git status` for uncommitted work
5. Key decisions are in the plan under "Key State Decisions" — don't re-derive them
