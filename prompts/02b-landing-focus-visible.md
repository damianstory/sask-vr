# Landing — Restore Visible Keyboard Focus On Route Cards

## Context

March 23, 2026 manual QA in headed Chrome against `http://localhost:3099` confirmed that the Landing logo now renders correctly from `/logos/myblueprint-logo.png`, the skip link works, both path cards still route correctly, and dev analytics still log for both paths at `375px`, `768px`, and `1366px`.

The remaining blocker on Landing is keyboard accessibility: the two route cards receive keyboard focus, but the focused state is not visibly indicated.

## Regression

Tabbing from the skip link onto either Landing route card focuses the button, but there is no visible ring, outline, or other clear focus treatment around the card in headed Chrome.

## Reproduction

1. Run `npm run dev`.
2. Open `http://localhost:3099/`.
3. Press `Tab` once to focus the skip link.
4. Press `Tab` again to focus the `I'm about to do VR` card.
5. Press `Tab` again to focus the `I just finished VR` card.
6. Observe that the focused card does not show a visible keyboard focus state.

## Expected

Both Landing route cards show a clear visible focus treatment when reached by keyboard navigation.

## Actual

The card buttons become the active element, but no visible focus ring or outline appears around either card.

## Likely Files In Play

- `app/page.tsx`
- `styles/globals.css`

## Constraints

- Fix only the visible keyboard focus treatment for the two Landing route cards.
- Preserve the existing logo row, layout, routing, analytics calls, copy, and `aria-label` text.
- Do not add QA-only code paths or change the skip link behavior.
