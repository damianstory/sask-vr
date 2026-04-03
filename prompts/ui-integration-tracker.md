# UI Integration Tracker

Canonical Stitch freeze artifact for the Sask-VR Stitch integration.

Project:
- `7333124104634965264` (`Sask-VR Stitch`)

Baseline at tracker creation:
- `HEAD`: `b5db61c`
- `npm run type-check`: passing after local `vitest-axe` matcher augmentation
- `npx vitest run`: passing (`8 passed`, `7 skipped`)
- `npm run build`: passing

## Slice Table

| Status | Slice | Mobile Screen ID | Desktop Screen ID | Commit Hash | Handoff Note |
| --- | --- | --- | --- | --- | --- |
| Done | Landing | `834683bf4d0f4ed2a42ddf054e3e8f3e` | `ece405f69b344aa8b631a92ed8044615` | `b5db61c+working` | `/logos/myblueprint-logo.png` renders cleanly, both route cards show visible keyboard focus, the skip link works, and dev analytics still log at `375px`, `768px`, and `1366px`. |
| Done | Pre-VR shell chrome | `8857d46afee64662bb613c8e8cbbc613` | `7d0159a8e45d4e6b810be6ac7e23b2ce` | `b5db61c+working` | Progress/nav remain correct through Screen 4, the Screen 3 `Loading map...` fallback appears, and heading focus now lands on Screen 3 after the lazy-loaded transition at `375px`, `768px`, and `1366px`. |
| Done | Screen 1 | `121bd932dfb34c4d83d8c3e0355ad539` | `0133e1c6e16a4cdfa5692f059c01e5ba` | `b5db61c+working` | Salary layout, heading focus, viewport behavior, and reduced-motion behavior passed manual QA. |
| Done | Screen 2 | `bc8656fbbb1e4c4f9efc0af57bbe5ce4` | `5a63872d17d34dbd8dbdbaade3df3044` | `b5db61c+working` | Tile selection flow, overflow rejection, CTA text, and keyboard selection passed manual QA at all target widths. |
| Done | Screen 3 | `60abb3c3920c4e428e2251b6f1afec83` | `9b2ddb51575f4386ad41acb53aaeb0d9` | `b5db61c+working` | Headed Chrome initialized MapLibre WebGL at `375px`, `768px`, and `1366px`; map framing, marker dialog open/close, Escape, click-outside, and focus return passed manual QA. |
| Done | Screen 4 | `26e5dbe938a5406b8418d0cc8c4cb003` | `069d6b2a081d42ae9995918a670fa528` | `b5db61c+working` | First step opens by default, only one step stays open at a time, course content remains readable, and mobile timeline spacing passed manual QA. |
| Done | IconPicker + TaskTagChips | `1848e0b5f9c447c18fd486d4b250d4f7` | `bbc23a1caaf847278458a0bfc08ce862` | `b5db61c+working` | Live `localhost:3099` QA confirmed the shared bottom `Next` navigation can naturally reach Screen 5 with zero selected tasks; the empty-state card rendered correctly at `375px` and `1366px`, and the seeded `Framing` + `Measuring & Layout` + `Finishing Work` chips still passed with `Ava` and the first icon selected. |
| Done | CardPreview | `1848e0b5f9c447c18fd486d4b250d4f7` | `bbc23a1caaf847278458a0bfc08ce862` | `b5db61c+working` | Live preview at `1366px` matched the downloaded PNG for gradient, title, icon badge, name placement, and chip layout using the seeded `Ava` + first-icon flow. |
| Done | Screen 5 parent | `1848e0b5f9c447c18fd486d4b250d4f7` | `bbc23a1caaf847278458a0bfc08ce862` | `b5db61c+working` | Name validation, first-keystroke analytics, icon select, download state, saved-state swap, and Continue-to-Screen-6 flow passed at `375px` and `1366px`. |
| Done | Screen 6 | `67c22754ceb344c19127a2aeec1549d5` | `e062e02b3ec149088a712f76701a08fb` | `b5db61c+working` | Prompt card spacing, non-interactive card behavior, and `aria-hidden` emoji icons passed headed-Chrome QA. |
| Done | Post-VR | `269d68ffd94e4c4cbb54aed8761706fd` | `c7d3e741276f4e52a5beb8849509e705` | `b5db61c+working` | Checklist toggles, progress text, keyboard behavior, and new-tab CTA passed manual QA at `375px`, `768px`, and `1366px`. |

## Slice References

### Landing
- `playbook_ref`: `Landing Page — app/page.tsx`
- `safe_replacement_boundary`: replace everything inside `<main>` only
- `must_preserve_behavior`: `useRouter`, both `trackPathSelect()` calls, `id="main-content"`, existing `aria-label`s, `content.meta` bindings
- `allowed_files`: `app/page.tsx`, `tests/landing.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/landing.test.tsx tests/analytics.test.ts`
- `manual_checks`: `375px`, `768px`, `1366px`; both cards route correctly; keyboard and skip link; analytics logs in dev
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 manual QA against `http://localhost:3099` in headed Chrome confirmed `/logos/myblueprint-logo.png` still loads cleanly without wrapping the `Career Explorer` row, both route cards show a visible blue focus ring at `375px`, `768px`, and `1366px`, both routes still navigate correctly, the skip link is visible and targets `#main-content`, and dev analytics still log for both paths; baseline gates also passed (`npm run type-check`, `npx vitest run tests/landing.test.tsx tests/analytics.test.ts tests/progress-bar.test.tsx tests/pre-vr-flow.test.tsx tests/screen-three.test.tsx`, `npm run build`).

### Pre-VR shell chrome
- `playbook_ref`: `Pre-VR Shell`, `ProgressBar`, `Navigation`
- `safe_replacement_boundary`: do not replace `app/pre-vr/page.tsx`; replace visual subtree inside the shared component wrappers only
- `must_preserve_behavior`: session wrapper, screen rendering, heading focus, transition direction, Suspense boundary, progressbar/navigation ARIA
- `allowed_files`: `components/ProgressBar.tsx`, `components/Navigation.tsx`, `tests/progress-bar.test.tsx`, `tests/pre-vr-flow.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/progress-bar.test.tsx tests/pre-vr-flow.test.tsx`
- `manual_checks`: screen transitions, back/next bounds, Screen 3 `Loading map...` fallback, keyboard focus order
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA confirmed `1 of 6` → `2 of 6` → `3 of 6` progress updates, Back is disabled on Screen 1, Next remains visible through Screen 4, the Screen 3 fallback appears at `375px`, `768px`, and `1366px`, and heading focus now lands correctly on Screen 1, Screen 2, and Screen 3 after the lazy-loaded map screen resolves.

### Screen 1
- `playbook_ref`: `Screen 1 — app/pre-vr/components/ScreenOne.tsx`
- `safe_replacement_boundary`: replace JSX inside `return (...)` only; preserve the full `OdometerDigit` and `useReducedMotion` implementations
- `must_preserve_behavior`: heading focus target, salary label/role, animation trigger timing, source text, stat rendering from content
- `allowed_files`: `app/pre-vr/components/ScreenOne.tsx`, `tests/screen-one.test.tsx`, `tests/a11y/screens.a11y.test.tsx`, `tests/pre-vr-flow.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-one.test.tsx tests/a11y/screens.a11y.test.tsx tests/pre-vr-flow.test.tsx`
- `manual_checks`: reduced motion, salary odometer readability, long stat labels, viewports `375px`, `768px`, `1366px`
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 manual QA passed at `375px`, `768px`, and `1366px`; salary remains legible, heading focus lands correctly, no horizontal overflow was observed, and a separate reduced-motion pass at `1366px` confirmed the odometer/stat animations are removed.

### Screen 2
- `playbook_ref`: `Screen 2 — app/pre-vr/components/ScreenTwo.tsx`
- `safe_replacement_boundary`: replace JSX inside `return (...)` only
- `must_preserve_behavior`: `useSession()` bindings, selection limits, overflow message, CTA label/disabled logic, `trackTileSelect()`, `aria-pressed`
- `allowed_files`: `app/pre-vr/components/ScreenTwo.tsx`, `tests/screen-two.test.tsx`, `tests/a11y/screens.a11y.test.tsx`, `tests/pre-vr-flow.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-two.test.tsx tests/a11y/screens.a11y.test.tsx tests/pre-vr-flow.test.tsx`
- `manual_checks`: 2-to-3 selection flow, fourth-tap overflow state, CTA enablement, keyboard tile navigation
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 manual QA passed at `375px`, `768px`, and `1366px`; CTA text moved from `Pick at least 2` to `Pick 1 more` to `Continue →`, keyboard activation selected tiles, a fourth tap showed `You can pick up to 3!`, and the fourth tile was correctly rejected.

### Screen 3
- `playbook_ref`: `Screen 3 — app/pre-vr/components/ScreenThree.tsx`
- `safe_replacement_boundary`: replace only heading, map container styling, overlay, and employer card layout; do not touch map init or marker creation logic
- `must_preserve_behavior`: all refs, all effects, `trackEmployerTap()`, dialog ARIA, close button labeling, `id` hooks used by click-outside logic
- `allowed_files`: `app/pre-vr/components/ScreenThree.tsx`, `tests/screen-three.test.tsx`, `tests/pre-vr-flow.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-three.test.tsx tests/pre-vr-flow.test.tsx`
- `manual_checks`: Suspense fallback appearance, marker card open/close, Escape, click-outside, focus return, map framing at `375px`, `768px`, `1366px`
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA at `375px`, `768px`, and `1366px` confirmed MapLibre initializes with a live canvas and all five employer markers, the map stays framed without horizontal overflow, and `screen_view {screen_name: screen_3}` logs as expected; a detailed `375px` pass also confirmed marker dialog open/close behavior, Escape, click-outside dismissal, and focus return to the triggering pin.

### Screen 4
- `playbook_ref`: `Screen 4 — app/pre-vr/components/ScreenFour.tsx`
- `safe_replacement_boundary`: replace JSX inside `return (...)` only
- `must_preserve_behavior`: `expandedStepId`, `toggleStep()`, `trackPathwayExpand()`, `aria-expanded`, `gridTemplateRows` animation contract
- `allowed_files`: `app/pre-vr/components/ScreenFour.tsx`, `tests/screen-four.test.tsx`, `tests/a11y/screens.a11y.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-four.test.tsx tests/a11y/screens.a11y.test.tsx`
- `manual_checks`: first step open by default, only one step open at a time, long program/course content, mobile timeline spacing
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA at `375px`, `768px`, and `1366px` confirmed the first step is open by default, opening `High School` collapses the initial step so only one pathway stays open, `pathway_expand` logs for the newly opened step, course content remains readable, and no horizontal overflow was observed.

### IconPicker + TaskTagChips
- `playbook_ref`: `Screen 5 child components`
- `safe_replacement_boundary`: restyle the existing child components only; do not inline them into Screen 5
- `must_preserve_behavior`: `aria-pressed`, icon selection event handoff, tile-title lookup, empty-state fallback messaging
- `allowed_files`: `app/pre-vr/components/IconPicker.tsx`, `app/pre-vr/components/TaskTagChips.tsx`, `tests/screen-five.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-five.test.tsx`
- `manual_checks`: 6-icon layout, selected/unselected states, zero-tile fallback, keyboard selection order
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 live `http://localhost:3099/pre-vr` Chromium QA confirmed a legitimate non-debug path to Screen 5 with `selectedTiles.length === 0` by advancing from Screen 1 to Screen 5 with the shared bottom `Next` button; at both `375px` and `1366px` the `Your skills` empty-state card rendered the `Go back to pick your tasks` message cleanly, while a separate seeded pass still showed the `Framing`, `Measuring & Layout`, and `Finishing Work` chips after entering `Ava` and selecting the first icon, with only that icon reporting `aria-pressed="true"`.

### CardPreview
- `playbook_ref`: `Screen 5 — Card Preview`, `08a-screen-five-preview-polish.md`
- `safe_replacement_boundary`: restyle the standalone preview component only; keep 16:9 structure and prop contract intact
- `must_preserve_behavior`: `CARD_GRADIENTS`, name/icon/task bindings, export-friendly canvas-compatible visuals
- `allowed_files`: `app/pre-vr/components/CardPreview.tsx`, `lib/generate-card.ts`, `tests/screen-five.test.tsx`, `tests/generate-card.test.ts`, `tests/card-gradients.test.ts`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-five.test.tsx tests/generate-card.test.ts tests/card-gradients.test.ts`
- `manual_checks`: compare live preview and downloaded PNG side-by-side at the same viewport width; verify gradient, title, icon badge, name placement, and chip layout
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA captured the live Screen 5 preview at `1366px` after the seeded `Framing` + `Measuring & Layout` + `Finishing Work` flow with `Ava` and the first icon option selected; the preview matched the downloaded PNG for gradient, title, icon badge, name placement, and chip layout.

### Screen 5 parent
- `playbook_ref`: `Screen 5 — app/pre-vr/components/ScreenFive.tsx`
- `safe_replacement_boundary`: replace JSX inside `return (...)` only and keep child-component boundaries intact
- `must_preserve_behavior`: `useSession()` bindings, validation, `handleDownload()`, post-download state swap, `trackNameEntered()`, `trackIconSelect()`, `trackCardDownload()`, `onNext`
- `allowed_files`: `app/pre-vr/components/ScreenFive.tsx`, `tests/screen-five.test.tsx`, `tests/pre-vr-flow.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-five.test.tsx tests/pre-vr-flow.test.tsx tests/generate-card.test.ts`
- `manual_checks`: name validation, first-keystroke tracking, download state, celebration state, continue-to-screen-6 flow
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA at `375px` and `1366px` confirmed blank-space blur triggers the name validation error, `name_entered` fires on the first real name input, choosing the first icon logs `icon_select`, download produces a PNG and swaps the CTA into the saved/continue state, `card_download` logs in dev, and Continue advances naturally to Screen 6.

### Screen 6
- `playbook_ref`: `Screen 6 — app/pre-vr/components/ScreenSix.tsx`
- `safe_replacement_boundary`: replace JSX inside `return (...)` only
- `must_preserve_behavior`: heading focus target, prompt icon mapping by index, read-only prompt list
- `allowed_files`: `app/pre-vr/components/ScreenSix.tsx`, `tests/screen-six.test.tsx`, `tests/a11y/screens.a11y.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/screen-six.test.tsx tests/a11y/screens.a11y.test.tsx`
- `manual_checks`: prompt-card spacing on small screens, no accidental interactive affordances, emoji icons remain `aria-hidden`
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 headed-Chrome QA at `375px` and `1366px` confirmed the three prompt cards remain readable without horizontal overflow, the cards expose no accidental interactive controls, and all prompt icons remain `aria-hidden="true"`.

### Post-VR
- `playbook_ref`: `Post-VR — app/post-vr/page.tsx`
- `safe_replacement_boundary`: replace everything inside `<main>` only
- `must_preserve_behavior`: checklist state, `trackChecklistCheck()` on check only, `role="checkbox"`, `aria-checked`, progress count, CTA link target
- `allowed_files`: `app/post-vr/page.tsx`, `tests/post-vr.test.tsx`, `tests/a11y/screens.a11y.test.tsx`
- `tests_to_run`: `npm run type-check`, `npx vitest run tests/post-vr.test.tsx tests/a11y/screens.a11y.test.tsx`
- `manual_checks`: checklist toggling, progress text, new-tab CTA, keyboard focus and checkbox semantics, viewports `375px`, `768px`, `1366px`
- `open_risks`: No open manual blocker after March 23, 2026 QA.
- `last_verified_state`: March 23, 2026 manual QA passed at `375px`, `768px`, and `1366px`; all six checklist controls expose checkbox semantics, keyboard Space toggles the first item, progress text updates `0 → 1 → 2 → 1`, and the CTA still opens `https://www.myblueprint.ca` in a new tab.

## Next Context Prompt

Current focus:
- No remaining UI integration QA carryover is open in this tracker.

Exact next action:
- Preserve the current verified baseline unless a new regression is discovered in a future slice-specific prompt.

Files in play:
- `app/pre-vr/components/IconPicker.tsx`
- `app/pre-vr/components/TaskTagChips.tsx`
- `app/pre-vr/components/ScreenFive.tsx`

Last passing checks:
- `npm run type-check`
- `npx vitest run tests/landing.test.tsx tests/analytics.test.ts tests/progress-bar.test.tsx tests/pre-vr-flow.test.tsx tests/screen-three.test.tsx` (`32 passed`, `5 todo`)
- `npm run build`

Checked viewports:
- Landing at `375px`, `768px`, and `1366px`
- Screen 1 at `375px`, `768px`, and `1366px`, plus reduced-motion at `1366px`
- Screen 2 at `375px`, `768px`, and `1366px`
- Screen 3 at `375px`, `768px`, and `1366px`
- Screen 4 at `375px`, `768px`, and `1366px`
- Screen 5 at `375px` and `1366px`
- Screen 6 at `375px` and `1366px`
- Post-VR at `375px`, `768px`, and `1366px`

Known regressions/blockers:
- No confirmed product regression or manual QA blocker remains after March 23, 2026 QA.
