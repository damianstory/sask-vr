# Screen 6 — VR Prep Prompts

## Context

Screen 6 is the final screen of the pre-VR flow. It's a calm, focused cooldown before the student puts on the VR headset. The screen shows 2–3 observation prompts — things to pay attention to during the VR simulation. This is not interactive — it's a quiet moment to read and absorb.

The shift in energy is intentional. After the excitement of the card builder, this screen brings the tempo down. It should feel calm but purposeful, like the moment before a game starts.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (heading)
- Light Blue Soft: #E0F0FF (prompt card background)
- Neutral-5: #485163 (body text, prompt text)
- Off-White: #F6F6FF (page background)
- Card radius: 12px

## Requirements

### Heading + Subtext
- Heading: "Get Ready for VR" — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: one sentence about what to expect — 16px, weight 300, Neutral-5, centered
- Must have `data-screen-heading` attribute on heading

### Observation Prompt Cards
- 2–3 cards stacked vertically, 12px gap
- Max width: 640px, centered
- Card background: Light Blue Soft (#E0F0FF)
- Card padding: 16px
- Card border-radius: 12px
- Each card has:
  - Emoji icon on the left: 32x32px, flex-shrink-0 (icons like magnifying glass, eyes, lightbulb)
  - Prompt text on the right: 16px, weight 300, line-height 1.75, Neutral-5
- Layout: horizontal flex (icon left, text right), 12px gap, items-start alignment
- Emoji is `aria-hidden="true"` (decorative)

### Overall Feel
- Simple, single-column, centered
- Generous whitespace above and below the prompt cards
- No interactive elements — this is a read-only screen
- Student advances via the shared Back button in navigation (Next button is hidden on screen 6)

## States

- No interactive states — this is a static display screen
- No hover, selected, or disabled states needed

## Interactions

- None on this screen — it's purely informational
- Navigation is handled by the shell (Back button only, no Next on final screen)

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` attribute on heading
- Content from `content.screenSix.*` (heading, subtext, prompts array)
- Emoji icons mapped from a fixed array (`promptIcons = ['🔍', '👀', '💡']`)
- `aria-hidden="true"` on emoji icons

## Safe Replacement Boundary

- **REPLACE:** Card visual design, heading/subtext typography, spacing, overall section layout
- **PRESERVE:** Content bindings (`content.screenSix.*`), emoji icon mapping, aria attributes

## Constraints

- Prompt count varies (2–4 typical) — layout must handle variable count
- Prompt text varies in length (1–3 sentences) — cards must accommodate longer text
- Use carpentry VR prep examples but keep structure generic
- This is the simplest screen — don't over-design it. The calm feel is intentional.
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
