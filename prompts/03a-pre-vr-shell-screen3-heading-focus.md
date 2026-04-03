# Pre-VR Shell — Restore Screen 3 Heading Focus After Lazy Load

## Context

March 23, 2026 manual QA in headed Chrome against `http://localhost:3099/pre-vr` confirmed that the Pre-VR shell now reaches Screen 3 in a WebGL-capable browser, the `Loading map...` Suspense fallback appears, progress and navigation remain correct, and the Screen 3 map/dialog behavior can be exercised at `375px`, `768px`, and `1366px`.

The remaining shell blocker is focus handoff on the Screen 2 → Screen 3 transition.

## Regression

After selecting the seeded Screen 2 tasks and continuing to Screen 3, focus does not land on the Screen 3 heading once the lazy-loaded map screen finishes mounting.

## Reproduction

1. Run `npm run dev`.
2. Open `http://localhost:3099/pre-vr`.
3. Advance to Screen 2.
4. Select `Framing`, `Measuring & Layout`, and `Finishing Work`.
5. Activate the `Continue` CTA to move to Screen 3.
6. Wait for the `Loading map...` fallback to resolve and the `Who hires carpenters near you?` heading to render.
7. Observe that focus does not move to the Screen 3 heading.

## Expected

After Screen 3 finishes loading, keyboard focus lands on the Screen 3 heading just as it does on the other screens.

## Actual

Screen 3 renders correctly, but focus remains elsewhere instead of moving to the heading after the lazy-loaded screen resolves.

## Likely Files In Play

- `app/pre-vr/page.tsx`
- `app/pre-vr/components/ScreenThree.tsx`

## Constraints

- Fix only the shell focus handoff for the Screen 3 transition.
- Preserve the existing Suspense fallback, transition behavior, and Screen 3 map logic.
- Do not add QA harnesses, debug routes, or alternate navigation paths.
