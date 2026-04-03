# Screen 3 — Employer Card Polish (Refinement)

## Context

This is a follow-up refinement for the employer popup card on Screen 3 of a career exploration app. The map frame and overall layout are already in place from the first pass. Now we're polishing the employer info card specifically — the floating card that appears when students tap a pin on the map.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (company name)
- Primary Blue: #0092FF (focus rings)
- Light Blue: #C6E7FF (logo placeholder background)
- Neutral-1: #E5E9F1 (close button hover bg)
- Neutral-4: #65738B (employee count, quote)
- Neutral-5: #485163 (description)
- Card radius: 12px
- Card shadow: 0 8px 24px rgba(34,34,76,0.12)
- Focus ring: 3px solid #0092FF

## What to Polish

Focus on these specific elements of the employer card:

1. **Card layout and spacing** — ensure generous breathing room between company logo, name, description, stats, and quote. The card should not feel cramped even with longer descriptions.

2. **Company logo placeholder** — the 48x48px circle with the company initial. Make this feel more polished — consider a subtle border or shadow treatment.

3. **Quote treatment** — when an employer has an optional quote, it should feel visually distinct from the description. Consider a left border accent, different background tint, or typographic treatment that makes it feel like a pullquote.

4. **Close button** — ensure it's clearly visible but doesn't compete with the content. The X should feel tappable and obvious.

5. **Mobile bottom-sheet feel** — on mobile, the card slides up from the bottom. Ensure it feels like a proper bottom sheet with appropriate top padding and a visual handle/indicator if appropriate.

6. **Entry animation** — scale 0.9→1.0 + fade-in, 250ms ease-out. Should feel snappy and settled.

## Constraints

- Only restyle the card visuals — do not change card structure, content order, or behavior
- Card content comes from data (name, description, employeeCount, optional quote) — variable lengths
- All existing aria attributes, focus management, and keyboard behavior must remain
- Card must work at max-width 320px
