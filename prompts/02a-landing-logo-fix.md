# Landing — Restore myBlueprint Logo Asset

## Context

Manual QA on March 23, 2026 verified that the Landing page route cards, skip link, keyboard focus, and dev analytics all behave correctly at `375px`, `768px`, and `1366px`. The remaining blocker on this slice is visual and asset-related: the myBlueprint logo does not render.

## Regression

The Landing page requests `/logos/myblueprint-logo.svg`, but that path returns `404`. The UI shows the browser's broken-image state with the `alt` text instead of the actual logo.

## Reproduction

1. Run `npm run dev`.
2. Open `/` at any viewport (`375px`, `768px`, or `1366px`).
3. Look at the logo row above the `Career Explorer` text.
4. Observe that the image is broken and the alt text is displayed.

## Expected

The myBlueprint logo graphic renders correctly above the landing cards at all supported breakpoints.

## Actual

`/logos/myblueprint-logo.svg` returns `404 Not Found`, so the landing page renders a broken image placeholder plus alt text.

## Likely Files In Play

- `app/page.tsx`
- `public/logos/*`

## Constraints

- Fix only the missing logo asset/rendering issue for Landing.
- Do not redesign the landing layout or change route-card behavior.
- Preserve the existing `alt="myBlueprint logo"` text and current placement/styling unless an asset-path adjustment requires a minimal markup change.
