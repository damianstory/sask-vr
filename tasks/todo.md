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

- [x] **1C. Career Pathway — remove Grade 7/8 step**
  - Removed step-1 from JSON, 5 steps starting with High School
  - Head start widget stays in new step 1 (High School)

- [x] **1A. Salary Hook redesign**
  - Added `hourlyRange`, `annualRange`, `selfEmployment` to schema and JSON
  - Odometer for median annual ($67K), range bar ($19–$45/hr), self-employment callout (37%, $80K+)
  - Removed duplicate 37% stat card, changed label to "Median Annual Salary"
  - Added `formatMoney` helper, accessible `aria-label` on odometer

- [x] **1B. Task Ranking rework**
  - Full rewrite with @dnd-kit/sortable drag-and-drop ranking
  - Up/down arrow buttons (first-class), shuffle on first mount
  - Tie-group scoring via `lib/scoring.ts` (returns `tieGroups` for reveal)
  - Reveal phase: two-column comparison, bracketed 14% tie group, per-row match indicators
  - Locked after submit — revisit shows reveal directly
  - Updated flow tests, a11y tests, content-schema tests

- [x] **Phase 1 gate**
  - `npm run type-check` — clean
  - `npx vitest run` — 98 passed, 0 failed
  - New files: `lib/scoring.ts`, `tests/scoring.test.ts`
  - Updated: `tests/pre-vr-flow.test.tsx`, `tests/a11y/screens.a11y.test.tsx`

---

## Phase 2 — New Screens (parallel-safe)

- [x] **2A. Video Snippets** (`ScreenVideo.tsx`)
  - 6 YouTube Shorts carousel with arrow buttons
  - `youtube-nocookie.com`, `loading="lazy"`, `rel=0`, 9:16 portrait
  - No autoplay after navigation, focus to carousel region container
  - Single keyed iframe (swap src), accessible prev/next labels
  - File: `app/pre-vr/components/ScreenVideo.tsx` (new)

- [x] **2B. No-Debt Speed Run** (`ScreenSpeedRun.tsx`)
  - Side-by-side animated timelines (carpenter vs university)
  - Lockstep row reveal, `disclaimer` field for illustrative values
  - Timer cleanup on unmount, reduced-motion: all milestones visible immediately
  - File: `app/pre-vr/components/ScreenSpeedRun.tsx` (new)

- [x] **2C. AI Can't Build This** (`ScreenAI.tsx`)
  - Sort 6 tasks into AI/Human buckets, one at a time
  - Non-color-only feedback ("Correct!" / "Not quite"), score + punchline after all 6
  - `gated: true` — `onComplete()` only on first completion, not on revisit
  - Revisit: complete→show score, partial→restore by answered IDs (Set + filter)
  - Buttons disabled during feedback window, nextResults pattern for stale-state safety
  - Results rendered from canonical data.tasks order via Map lookup
  - File: `app/pre-vr/components/ScreenAI.tsx` (new)

- [x] **Phase 2 gate**
  - `npm run type-check` — clean
  - `npm run lint` — no new errors (7 pre-existing)
  - Targeted tests: 46 passed across 4 files (content-schema, screen-video, screen-speed-run, screen-ai)
  - New files: `ScreenVideo.tsx`, `ScreenSpeedRun.tsx`, `ScreenAI.tsx`, 3 test files
  - Schema additions: `videoSnippets`, `speedRun`, `aiSorting` in types.ts + carpentry.json

---

## Phase 3 — Flow Wiring + File Renames

- [x] **Wire 8 screens into SCREENS array**
  - Final order: videoSnippets, salaryHook, speedRun, taskRanking, employerMap, careerPathway, aiSorting, vrPrep
  - `gated: true` on taskRanking and aiSorting

- [x] **Rename component files**
  - `ScreenOne.tsx` → `ScreenSalary.tsx`
  - `ScreenTwo.tsx` → `ScreenTaskRanking.tsx`
  - Updated all imports in page.tsx, tests, and a11y import paths

- [x] **Phase 3 gate**
  - `npm run type-check` — clean
  - `npm run lint` — no new errors (7 pre-existing)
  - Targeted tests: 83 passed across 7 files
  - Flow test updated for 8 screens, both gated checkpoints, employer-map focus on screen 5

---

## Phase 4 — Post-VR Tiny House Designer

- [x] **TinyHouseDesigner component**
  - Top-down 6×3 CSS grid (24×12ft), 5 pre-defined slots with tap→pick room overlay
  - Skills mapping sidebar: 10 skills, active/inactive states, source room attribution
  - Canvas PNG download (1200×675px, navy-to-blue gradient, room rectangles, skill chips)
  - Filename: `tiny-house-${sanitizeName(firstName)}.png` with 20-char truncation, fallback 'student'
  - Focus trap in picker, Escape dismissal, keyboard-accessible slot buttons
  - Local state only, `firstName` read-only from SessionContext
  - Files: `app/post-vr/components/TinyHouseDesigner.tsx` (new), `app/post-vr/page.tsx`

- [x] **Phase 4 gate**
  - `npm run type-check` — clean
  - `npm run lint` — no new errors (7 pre-existing)

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
