# Screen 5 — Card Preview Polish (Refinement)

## Context

This is a follow-up refinement for the card preview component on Screen 5 of a career exploration app. The two-panel layout and control panel are already in place from the first pass. Now we're polishing the live card preview specifically — the 16:9 card that students personalize and download as a PNG.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C
- White: #FFFFFF
- Card radius: 12px
- Neutral-2: #D9DFEA (card border)

## What to Polish

Focus on these specific elements of the card preview:

1. **Card title treatment** — "CARPENTER CARD" header text. Currently plain uppercase white. Consider letter-spacing, size, or weight adjustment to make it feel more like a collectible card title.

2. **Icon circle** — the selected emoji in a white circle. Consider sizing, padding, or subtle shadow to make it feel like a badge or emblem on the card.

3. **Name typography** — the student's name displayed large. Ensure it's the visual hero of the card. Consider how it handles short names ("Jo") vs. long names ("Christopher"). The "Your Name" placeholder should feel distinctly different (lighter, suggestive).

4. **Task tag pills** — translucent white pills showing selected tasks. Consider spacing, size, and how 2 vs 3 tags balance visually.

5. **Overall card composition** — the arrangement of all elements within the 16:9 frame. Ensure visual balance and breathing room. The card should look good both as a live preview and as a standalone downloaded image.

6. **Gradient background** — the card uses `linear-gradient(135deg, from, to)` with colors determined by task selection. Ensure all content remains readable over any gradient variant.

## Critical Constraint

**Everything in this preview must be reproducible by Canvas API.** The `generateCardPng()` function recreates this card on a `<canvas>` element for PNG export. This means:

- No `backdrop-filter` or `blur()`
- No `box-shadow` on internal elements (border of the outer card is fine)
- No CSS `mix-blend-mode`
- No CSS gradients beyond what `CanvasRenderingContext2D.createLinearGradient()` can reproduce
- No `text-shadow` (Canvas doesn't support it natively)
- Simple `border-radius` is fine (Canvas can clip to rounded rect)
- `rgba()` colors for translucency are fine

If a visual effect can't be done with Canvas 2D drawing calls, don't use it here.

## Constraints

- CardPreview is a separate component — do not merge it into the parent
- Aspect ratio is fixed at 1200:675 (16:9)
- Data bindings (name, iconEmoji, taskLabels, gradientVariant) must remain as props
- Must handle empty state (no name, no icon selected) gracefully
