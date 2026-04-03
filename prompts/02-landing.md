# Landing Page

## Context

This is the entry point of a career exploration app for Grade 7–8 students. The student arrives here (often via QR code scan in a classroom) and chooses one of two paths: "I'm about to do VR" or "I just finished VR." There is no login, no onboarding — just a clean choice between two clear options.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings)
- Primary Blue: #0092FF (hover borders, focus rings)
- Light Blue: #C6E7FF (card backgrounds)
- Off-White: #F6F6FF (page background)
- Neutral-5: #485163 (body text)
- Blue Dark: #0070CC (hover state on blue)
- Card radius: 12px
- Focus ring: 3px solid #0092FF, 3px offset
- Min touch target: 44x44px

## Requirements

- **Logo:** myBlueprint logo at top-center, reasonable clear space below
- **Heading:** Occupation title (e.g., "Carpentry Career Explorer"), 40px desktop / 28px mobile, weight 800, Navy, centered
- **Two path-selection cards** side by side on desktop (24px gap), stacked on mobile (16px gap)
  - Card 1: "I'm about to do VR" + one-line subtext describing what this path does
  - Card 2: "I just finished VR" + one-line subtext
  - Card dimensions: ~400x280px desktop, full-width x 180px mobile
  - Card background: Light Blue (#C6E7FF)
  - Card text: 24px desktop / 20px mobile, weight 800, Navy for heading; 16px weight 300 Neutral-5 for subtext
  - Each card is a single tappable button (entire card is the tap target)
- **Page background:** Off-White (#F6F6FF) full bleed
- Cards should feel bold, inviting, and clearly differentiated — this is the student's first impression

## States

- **Default:** Light Blue background, no border
- **Hover:** 2px border in Primary Blue (#0092FF), subtle lift shadow (0 8px 24px rgba(34,34,76,0.1))
- **Active/Pressed:** Scale 0.98
- **Focus:** 3px Primary Blue outline, 3px offset

## Interactions

- Tap/click either card to navigate to that path
- Keyboard: Tab between cards, Enter/Space to select
- Both cards are `<button>` elements, not links or divs

## Constraints

- Use carpentry as example content for tone, but the layout should work for any occupation title and description
- No navigation bar, no footer, no sidebar — this is a clean, centered, standalone page
- Prefer semantic wrappers that slot into an existing component without restructuring the parent
- Production-ready React/Tailwind with semantic HTML
