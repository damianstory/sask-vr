# Screen 2 — Regression Coverage

## Summary

This wave is a test-hardening pass for Screen 2 only. Do not redesign product behavior. Lock in the current task-selection UX, max-selection rejection, CTA gating, and tile analytics with automated tests.

## Requirements

- Replace the `todo` placeholders in `tests/screen-two.test.tsx` with real RTL/Vitest coverage.
- Preserve the current Screen 2 behavior:
  - 6 content-driven task tiles render with heading and instruction copy.
  - Tapping an unselected tile appends it and tracks `trackTileSelect(tileId, 'select')`.
  - Tapping a selected tile removes it and tracks `trackTileSelect(tileId, 'deselect')`.
  - `aria-pressed` reflects seeded session state.
  - The local CTA shows `Pick at least 2`, `Pick 1 more`, and `Continue →` based on selection count.
  - The local CTA stays disabled until at least 2 tiles are selected.
  - A fourth selection is rejected at max 3, shows `You can pick up to 3!`, applies `animate-shake` to the rejected tile, then clears on the existing timers.
- Use mocked `useSession`, mocked `content.screenTwo`, and mocked `trackTileSelect` in the test file.
- Use fake timers for the overflow test so the timer-driven UI reset is deterministic.
- Add at most one focused flow guardrail in `tests/pre-vr-flow.test.tsx`:
  - Verify the local Screen 2 CTA does not advance when fewer than 2 tiles are selected, and does advance once 2 tiles are chosen.

## Constraints

- No public API, route, schema, analytics payload, or content-shape changes.
- No QA hooks or app-side test-only logic.
- Do not change production code unless the new tests expose a real mismatch.
- Do not update `prompts/ui-integration-tracker.md` unless a genuine regression is discovered.

## Test Plan

- `npm run type-check`
- `npx vitest run tests/screen-two.test.tsx tests/pre-vr-flow.test.tsx`
