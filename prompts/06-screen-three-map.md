# Screen 3 — Employer Map

## Context

Screen 3 of the pre-VR flow. Students see a map of the Regina, Saskatchewan area with pins marking real local employers who hire for this occupation. Tapping a pin reveals a company info card. The goal is to make the career feel real and local — "these companies near your school are actually hiring."

The student is 12–14 years old. The map should feel clean and approachable, not like a complex GIS tool.

**Important: The map is non-interactive.** Pan, zoom, scroll, and keyboard map controls are all intentionally disabled. The only interactive elements are the employer pins overlaid on the map. This is a static map view with clickable markers — do not design for a fully interactive map experience.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, company name)
- Primary Blue: #0092FF (pin markers, focus rings)
- Light Blue: #C6E7FF (company logo placeholder background)
- Off-White: #F6F6FF (page background)
- Neutral-1: #E5E9F1 (borders)
- Neutral-4: #65738B (employee count, secondary text)
- Neutral-5: #485163 (body text, descriptions)
- Card radius: 12px
- Card shadow: 0 8px 24px rgba(34,34,76,0.12)
- Focus ring: 3px solid #0092FF
- Min touch target: 44x44px

## Requirements

### Heading + Subtext
- Heading: "Who hires carpenters near you?" — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: "Tap a pin to learn about real employers in the Regina area." — 16px, weight 300, Neutral-5
- Must have `data-screen-heading` attribute on heading

### Map Container
- Full-width within max-width container (~512px)
- Height: 280px mobile, 400px tablet, 500px desktop
- Border-radius: 12px, overflow hidden
- The actual map is rendered by MapLibre (a third-party map library) inside this container
- The map shows a static view centered on Regina, SK — no scrolling, no zooming

### Employer Pins (Overlaid on Map)
- Circular markers: 40x44px min (touch target)
- Primary Blue (#0092FF) fill, white icon inside (location pin SVG)
- Positioned on the map at specific coordinates (handled by MapLibre markers)
- Hover: slight scale-up (1.1x), shadow
- Focus: 3px Primary Blue ring
- Each pin is a `<button>` with `aria-label="View [Company Name]"`

### Employer Card (Popup)
- Appears when a pin is tapped
- **Mobile:** Fixed to bottom of screen, slides up, max-width 320px centered, rounded top corners (12px)
- **Desktop:** Absolutely positioned near the pin, max-width 320px, fully rounded (12px)
- White background, shadow (0 8px 24px rgba(34,34,76,0.12))
- Entrance animation: scale 0.9→1.0 + fade-in, 250ms ease-out

**Card content (top to bottom):**
- Close button (X icon): top-right, 32x32px, rounded-full, hover: Neutral-1 bg
- Company logo placeholder: 48x48px circle, Light Blue bg, first letter of company name in Navy weight 800
- Company name: 20px desktop / 24px mobile, weight 800, Navy
- Description: 14px, weight 300, Neutral-5
- Employee count: 14px, weight 300, Neutral-4 (e.g., "120 employees")
- Quote (optional): 14px, weight 300, italic, Neutral-4, with curly quotes

### Backdrop Overlay (Mobile)
- When card is open on mobile: semi-transparent black overlay (bg-black/20) covers the map
- Tapping the overlay closes the card

## States

### Pins
- Default: Primary Blue circle with white icon
- Hover: Scale 1.1x, shadow
- Focus: 3px Primary Blue ring

### Employer Card
- Open: Visible with entrance animation
- Closed: Not rendered

## Interactions

- Tap a pin → opens that employer's card, tracks analytics event
- Tap close button (X) → closes card, returns focus to the pin that was tapped
- Tap backdrop overlay (mobile) → closes card
- Press Escape key → closes card, returns focus to pin
- Only one card open at a time — tapping a different pin closes the current card and opens the new one
- Card has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the company name heading

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` on heading
- Map is initialized as `interactive: false` with all interaction methods disabled (scrollZoom, dragPan, doubleClickZoom, touchZoomRotate, keyboard)
- Pin markers are created programmatically and wired via MapLibre's Marker API
- Focus management: when card opens, focus moves to close button; when card closes, focus returns to the pin that triggered it
- Escape key closes the card
- Click-outside closes the card (with rAF delay to skip the opening click)
- `trackEmployerTap(employer.id, employer.name)` analytics call when pin is tapped
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="employer-card-name"` on card

## Safe Replacement Boundary

- **REPLACE:** Map container styling (border-radius, height, spacing), employer card visual design (layout, typography, spacing, animation), pin marker visual styling, backdrop overlay styling, heading/subtext typography
- **PRESERVE:** MapLibre initialization (`new maplibregl.Map(...)` with `interactive: false`), marker creation and coordinate wiring, `selectedEmployer` state, all focus management (close button focus, pin focus return), Escape/click-outside handlers, `closeButtonRef`/`pinRefs`/`lastPinRef` refs, `trackEmployerTap` calls, all aria/role attributes

## Constraints

- The map library (MapLibre) handles rendering the map tiles — Stitch only designs the container and overlay elements
- Employer count varies by occupation (4–6 employers is typical)
- Company descriptions and quotes vary in length — card layout must handle overflow gracefully
- Use carpentry employer examples but keep card structure generic
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
