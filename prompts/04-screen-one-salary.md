# Screen 1 — Salary Hook

## Context

This is the first screen students see after entering the pre-VR flow in a career exploration app. Its job is to hook them with a surprising, bold salary reveal. The screen shows a large animated salary counter that rolls up from $0 to the target amount (e.g., $72,000), followed by 3 stat cards that fade in. This should feel like a "wow" reveal moment — the salary counter is the hero element.

The student is a 12–14-year-old who may not have thought about skilled trades as a viable career. This screen challenges that assumption with real data.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, salary counter)
- Primary Blue: #0092FF (accent option for counter)
- Blue Vivid: #3DA8FF (stat emphasis on dark backgrounds)
- Off-White: #F6F6FF (page background)
- Neutral-4: #65738B (source attribution, stat labels)
- Neutral-5: #485163 (body text)
- Card radius: 12px
- Shadow: none at rest

## Requirements

### Hook Question Heading
- Full-width, centered
- Example text: "How much does a carpenter in Saskatchewan actually make?"
- 40px desktop / 28px mobile, weight 800, line-height 1.2, Navy
- Max 2 lines
- Must have `data-screen-heading` attribute (used for focus management)

### Salary Counter (Hero Element)
- Centered below heading, generous spacing (32px above)
- Dollar sign prefix ($)
- Large digits: 64px desktop / 48px mobile, weight 800, Navy
- **The counter uses an odometer-style digit column animation.** Each digit is a vertical column of 0–9 that scrolls via CSS translateY to reveal the target digit. Digits stagger with 50ms delay between each. Total animation ~2 seconds with ease-out easing.
- **Do NOT flatten this to a plain animated number or CSS counter.** The odometer column structure is load-bearing.
- Include commas in the display (e.g., "72,000")
- Source attribution below: 14px, weight 300, Neutral-4, centered (e.g., "Saskatchewan Labour Market Information, 2025")

### Stat Cards
- 3 cards in a row on desktop (16px gap), stacked on mobile (12px gap)
- Max width: ~512px container
- Card background: Navy (#22224C)
- Card text: White
- Each card: bold number (20px desktop / 24px desktop, weight 800) + label below (14px, weight 300)
- Cards fade in with staggered delay (200ms between each), starting after the salary animation completes (~2300ms)
- Fade-in animation: opacity 0→1, translateY 8px→0, 400ms ease-out
- Card border-radius: 12px, padding: 16px

## States

- **Initial mount:** Counter at 0, stat cards invisible (opacity 0)
- **Animated:** Counter scrolls to target value over 2s, stat cards fade in after counter completes
- **Reduced motion:** Counter shows final value immediately (no animation), stat cards appear immediately (no fade)

## Interactions

- No interactive elements on this screen — it's a display/reveal screen
- Student advances via the shared Next button in the navigation chrome

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` attribute on the heading (focus target after screen transitions)
- `useReducedMotion` hook that detects `prefers-reduced-motion: reduce` and disables all animation
- Odometer digit column structure (`OdometerDigit` component with `translateY` animation)
- `requestAnimationFrame` trigger for animation start
- Stagger delay calculation for stat card fade-in
- `aria-label` on salary container with formatted value (e.g., "$72,000")
- `role="text"` on salary container
- Content is loaded from `content.screenOne.*` (hookQuestion, salary.amount, salary.source, stats[])

## Safe Replacement Boundary

- **REPLACE:** Overall section layout, heading typography/spacing, stat card visual design, spacing between elements, background treatment
- **PRESERVE:** `OdometerDigit` component and its translateY column structure (restyle the digits, don't restructure them), `useReducedMotion` hook, stagger delay logic, all aria attributes, content bindings

## Constraints

- Use carpentry salary data as example content, but the layout must handle different salary amounts (4–6 digits) and different stat counts (2–4 stats)
- The odometer column structure is not negotiable — this is the signature interaction of the screen
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
