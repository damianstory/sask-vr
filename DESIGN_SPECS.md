# Career Explorer Micro-Site — Design Specification

**Version:** 1.0
**Date:** March 19, 2026
**Status:** Ready for Design
**PRD Reference:** PRD_Career_Explorer_Microsite.md
**Brand Reference:** myBlueprint Brand Style Guide

---

## 1. Design Principles

### 1.1 Audience Context

The primary user is a 12–14-year-old student in a school setting. They are digitally fluent but have short attention spans for anything that feels like schoolwork. They are using school Chromebooks (1366×768) or shared devices. The design must feel exciting and personal — closer to a game or a social media experience than a worksheet or government website.

### 1.2 Guiding Principles

| Principle | What It Means |
|-----------|--------------|
| **Bold, not busy** | Large typography, generous whitespace, strong visual hierarchy. Every screen has one clear focal point. Avoid cluttered layouts or dense information blocks. |
| **Personal, not generic** | The experience should feel like it was made for this student. Tile selections, the card builder, and the name input all create a sense of ownership. |
| **Quick, not deep** | Each screen should be completable in 1–3 minutes. Progressive disclosure (tap to learn more) over front-loading information. |
| **Gamified, not graded** | The tone is exploratory, not evaluative. There are no wrong answers. The card is a reward, not a test result. |
| **Accessible by default** | WCAG AA is not an afterthought — it shapes colour choices, touch targets, typography, and interaction patterns from the start. |

---

## 2. Brand Application

### 2.1 Colour System

The micro-site uses the myBlueprint brand palette as its foundation, applied with intention for a younger audience.

#### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--myb-primary-blue` | `#0092FF` | Primary CTAs, continue buttons, selected states, progress indicators, active links |
| `--myb-navy` | `#22224C` | Headings, primary text, navigation elements |
| `--myb-light-blue` | `#C6E7FF` | Card backgrounds, section highlights, hover tints, tile default background |
| `--myb-off-white` | `#F6F6FF` | Page backgrounds, content areas |

#### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--myb-neutral-1` | `#E5E9F1` | Borders, dividers |
| `--myb-neutral-2` | `#D9DFEA` | Card borders, subtle separators |
| `--myb-neutral-3` | `#AAB7CB` | Disabled states, placeholder text |
| `--myb-neutral-4` | `#65738B` | Secondary text, captions |
| `--myb-neutral-5` | `#485163` | Body text (primary readable weight) |
| `--myb-neutral-6` | `#252A33` | High-emphasis body text where Navy is too heavy |

#### Extended Brand Variants (Micro-site Specific)

For the gamified, youth-oriented tone, the micro-site uses tonal variants derived from the existing brand palette — no colours outside the brand family.

| Token | Hex | Derived From | Usage |
|-------|-----|-------------|-------|
| `--myb-blue-dark` | `#0070CC` | Primary Blue (darkened) | Hover states on Primary Blue elements, pressed states |
| `--myb-blue-vivid` | `#3DA8FF` | Primary Blue (lightened) | Salary counter highlight, stat callouts, achievement emphasis |
| `--myb-navy-light` | `#3A3A6B` | Navy (lightened) | Secondary emphasis, pathway progress nodes |
| `--myb-light-blue-soft` | `#E0F0FF` | Light Blue (lightened) | Subtle background tints, observation prompt cards |

For error states, use Neutral-4 text with a Neutral-1 background and a clear retry action — avoid introducing red or other non-brand colours.

#### Accessibility Notes on Colour

- Navy (`#22224C`) on white: contrast ratio 13.5:1 — passes AA and AAA for all text sizes
- Primary Blue (`#0092FF`) on white: contrast ratio 3.1:1 — passes AA for large text (≥18px bold or ≥24px regular) and UI components only. Do **not** use for small body text on white backgrounds
- Primary Blue (`#0092FF`) on Navy (`#22224C`): contrast ratio 4.3:1 — passes AA for large text
- Blue Vivid (`#3DA8FF`) on Navy (`#22224C`): contrast ratio 5.1:1 — passes AA for regular text
- All text-on-colour combinations must be verified during implementation with an automated contrast checker

### 2.2 Typography

#### Font Stack

```css
/* Primary — Museo Sans (if available from brand team) */
font-family: 'Museo Sans', 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;

/* Fallback — Open Sans (loaded via Google Fonts) */
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

For the pilot, assume Open Sans as the working font unless Museo Sans font files are provided. Open Sans is visually close enough for brand alignment and loads reliably on school devices.

#### Type Scale (Applied to Micro-site)

| Element | Size | Weight | Line Height | Colour | Usage |
|---------|------|--------|-------------|--------|-------|
| Screen heading | 40px (desktop) / 28px (mobile) | 900 | 1.2 | Navy | One per screen — the primary statement |
| Subheading | 22px (desktop) / 18px (mobile) | 500 | 1.4 | Neutral-5 | Supporting context below headings |
| Stat number | 64px (desktop) / 48px (mobile) | 900 | 1.0 | Navy or Primary Blue | Salary counter, headline data points |
| Stat label | 16px | 500 | 1.4 | Neutral-4 | Below stat numbers |
| Tile label | 18px (desktop) / 16px (mobile) | 700 | 1.3 | Navy | On task tiles (Screen 2) |
| Tile description | 14px | 300 | 1.5 | Neutral-5 | Below tile labels |
| Body text | 16px | 300 | 1.75 | Neutral-5 | Pathway expanded content, VR prep text, bridge page copy |
| Button label | 16px | 700 | 1.0 | White (on blue) | CTA buttons |
| Card text (on card) | Varies | 700 | — | White or Navy (on card background) | Name, stats, task labels rendered onto card |
| Checklist item | 18px | 500 | 1.5 | Navy (unchecked) / Neutral-3 (checked) | Bridge page items |

#### Typography Rules

- Maximum two font weights on any single screen (e.g., 900 for heading + 300 for body)
- No font size below 14px anywhere in the application (mobile readability)
- Headings are always Navy; body text is always Neutral-5 or Neutral-6
- Stat numbers can use Blue Vivid (`#3DA8FF`) on dark backgrounds for emphasis, or remain Navy on light backgrounds
- All uppercase is used only for subtitle/label elements (12px, 500 weight, `letter-spacing: 0.05em`)

### 2.3 Spacing & Grid

#### Base Unit

8px grid system, consistent with myBlueprint brand guidelines.

| Spacing Token | Value | Usage |
|--------------|-------|-------|
| `--space-1` | 4px | Tight internal padding (icon-to-label gap) |
| `--space-2` | 8px | Element padding, compact margins |
| `--space-3` | 16px | Standard padding inside cards and tiles |
| `--space-4` | 24px | Section padding, card internal margins |
| `--space-5` | 32px | Between sections on a screen |
| `--space-6` | 48px | Between major screen sections, screen top/bottom padding |
| `--space-7` | 64px | Page-level vertical rhythm (desktop) |

#### Layout Grid

| Breakpoint | Columns | Gutter | Margin |
|-----------|---------|--------|--------|
| < 640px (mobile) | 4 | 16px | 16px |
| 640px – 1023px (tablet) | 8 | 24px | 24px |
| ≥ 1024px (Chromebook/desktop) | 12 | 24px | Auto (max content width 1120px, centered) |

Maximum content width: **1120px**. On larger screens, content is centered with the Off-White background extending full-width.

### 2.4 Iconography

Task tile illustrations (Screen 2) and card builder icons (Screen 5) should follow a consistent style:

- **Style:** Line-based illustration with selective colour fills. Not flat solid icons, not 3D/realistic.
- **Colour:** Navy strokes with Light Blue or Primary Blue fills. No more than two colours per icon.
- **Weight:** 2px stroke weight, rounded caps and joins.
- **Grid:** All icons designed on a 48×48 base grid with 4px padding (40×40 live area).
- **Format:** SVG for resolution independence on all device targets.

The six card builder icons (hammer, saw, hard hat, tape measure, safety goggles, level) should feel like a cohesive set — as though they belong on the same collectible card.

### 2.5 Voice & Tone (Micro-copy)

The myBlueprint brand voice is professional yet approachable, focused on student empowerment. For this micro-site, the tone skews younger and more energetic — closer to "excited older sibling" than "guidance counsellor."

| Context | Tone Example |
|---------|-------------|
| Screen heading | "What does a carpenter in Saskatchewan actually earn?" (direct, conversational, surprising) |
| Tile description | "Build the skeleton of a home from the ground up" (action-oriented, concrete) |
| Pathway step | "You could start earning here" (possibility-focused, not prescriptive) |
| Card builder | "Your first name" (placeholder — minimal, no formal labels) |
| VR prep prompt | "Pay attention to the different tools you use" (specific, not vague) |
| Bridge page congrats | "You just tried carpentry in VR. That's a big deal." (acknowledgement without being patronizing) |
| CTA buttons | "Let's go" / "Next" / "Download my card" / "Open myBlueprint" (first-person, action verbs) |

**Avoid:** "Welcome to your learning journey," "Explore career pathways," or anything that sounds like a brochure. Students should not feel like they're being marketed to.

---

## 3. Component Specifications

### 3.1 Landing Page — Path Selection

**Layout:** Centred on screen. Two large, visually distinct cards side by side (desktop/tablet) or stacked (mobile). Each card is a single large tap target.

| Element | Specification |
|---------|--------------|
| Card size (desktop) | 400px × 280px each, side by side with 24px gap |
| Card size (mobile) | Full width (minus 32px margins), 180px tall, stacked with 16px gap |
| Card background | Light Blue (`#C6E7FF`) with subtle gradient or pattern treatment to differentiate them |
| Card heading | 24px, weight 900, Navy | "I'm about to do VR" / "I just finished VR" (or similar clear labels) |
| Card subtext | 16px, weight 300, Neutral-5 | One sentence explaining what this path does |
| Card hover/active | Border shifts to Primary Blue, subtle lift shadow (`0 8px 24px rgba(34,34,76,0.1)`) |
| Card tap target | Entire card is tappable — not just the text |
| Page background | Off-White full bleed |
| Logo | myBlueprint logo (icon + wordmark) positioned top-left or top-centre, with minimum clear space per brand guidelines |

**Accessibility:** Cards are `<button>` elements (not `<a>` tags or `<div>` with `onClick`). Focus ring visible on keyboard navigation. `aria-label` includes the full action description.

### 3.2 Screen 1 — The Hook

**Layout:** Full-width hero section. Content centred vertically and horizontally. No sidebar or secondary elements.

| Element | Specification |
|---------|--------------|
| Hook question | 40px heading (28px mobile), Navy, centred, max 2 lines |
| Salary counter | 64px stat number (48px mobile), weight 900. Animates from 0 to target value over 2 seconds using `requestAnimationFrame`. Navy text on light backgrounds, or Primary Blue on a dark treatment. |
| Supporting stats | Displayed as 2–3 horizontal cards below the counter (desktop) or stacked (mobile). Each card: a bold number (32px, 900 weight) + a label (14px, 500 weight, Neutral-4). Card background white with subtle border. |
| Continue prompt | A "Next" button (Primary Blue, full-width on mobile, max 200px on desktop) at the bottom. Alternatively, an animated downward chevron indicating scroll. |
| Background | Off-White with a large, subtle decorative illustration element (e.g., a faded blueprint grid pattern or construction line drawing) to add visual depth without competing with content. |

**Animation:** The counter animation should use an easing curve (ease-out) so it accelerates quickly and decelerates near the target — this feels more satisfying than linear. Respect `prefers-reduced-motion`: if set, display the final number immediately with no animation.

### 3.3 Screen 2 — Task Tiles

**Layout:** 2×3 grid on desktop/tablet; 2-column grid on mobile (6 tiles = 3 rows).

| Element | Specification |
|---------|--------------|
| Tile dimensions | Desktop: approximately 320px × 200px within the grid. Mobile: full half-width minus gutters, ~160px tall. |
| Tile structure | Illustration (top 60% of tile) + label (18px, 700, Navy) + description (14px, 300, Neutral-5, max 2 lines) |
| Tile background (unselected) | White with Neutral-2 border (`1px solid`), `border-radius: 12px` |
| Tile background (selected) | Light Blue (`#C6E7FF`) background, Primary Blue border (`2px solid #0092FF`), checkmark icon overlay in top-right corner (Primary Blue circle with white check) |
| Tile hover | Subtle shadow lift + border colour shifts to Neutral-3 |
| Tile tap | Immediate state change — no delay. Toggle between selected and unselected. |
| Selection counter | Text below the grid: "Select 2–3 tasks that interest you" + current count (e.g., "2 of 3 selected"). Navy text, weight 500. |
| Max selection feedback | If student taps a 4th tile while 3 are selected, show a brief inline message: "You can select up to 3 — tap one to deselect it." Neutral-4 text, appears below the grid. No modal or alert. |
| Continue button | Primary Blue button, disabled state (Neutral-3 background, Neutral-4 text) until minimum 2 tiles selected |

**Accessibility:** Each tile is a `<button>` with `aria-pressed="true/false"`. Selection state announced to screen readers. Focus order follows visual grid order (left-to-right, top-to-bottom).

### 3.4 Screen 3 — Employer Map

**Layout:** Full-width illustrated map with employer pins overlaid. Company card appears as a floating popup when a pin is tapped.

| Element | Specification |
|---------|--------------|
| Map | Static SVG illustration of the Regina area. Stylized — not geographic. Should convey "this is a local area" with recognizable landmarks or neighbourhood labels. Colour palette: Light Blue fills, Navy outlines, Off-White background. Dimensions: full content width, approximately 400–500px tall on desktop, 280px on mobile. |
| Pins | Circular markers (32px diameter desktop, 40px mobile for touch target). Primary Blue fill with white icon centre. Positioned via absolute/relative coordinates on the SVG. |
| Pin hover/focus | Slight scale-up (1.1×) + shadow. |
| Company card (popup) | White background, `border-radius: 12px`, shadow (`0 8px 24px rgba(34,34,76,0.12)`). Width: 320px desktop, 90% screen width mobile. Content: company name (18px, 700, Navy) + description (14px, 300, Neutral-5) + employee count (14px, 500, Neutral-4) + logo (48×48 placeholder if unavailable) + quote if available (14px, 300, italic, Neutral-4). Close button: × icon in top-right. |
| Card positioning | Desktop: positioned near the pin (offset right or left depending on pin location). Mobile: fixed to bottom of screen as a slide-up panel. |
| Backdrop | When a card is open on mobile, a semi-transparent overlay dims the map. Tapping the overlay closes the card. |

**Accessibility:** Pins are `<button>` elements with `aria-label` containing the employer name. Card popup uses `role="dialog"` with `aria-labelledby` pointing to the company name heading. Focus is trapped inside the card while it's open. Escape key closes the card.

### 3.5 Screen 4 — Pathway Timeline

**Layout:** Vertical stepping-stone timeline, centred on the page.

| Element | Specification |
|---------|--------------|
| Timeline structure | Vertical line (2px, Neutral-2) running down the left side (desktop) or centre (mobile). Each step is a node on the line. |
| Step node (collapsed) | Circle (40px diameter, Primary Blue fill, white number or icon inside) connected to a label (18px, 700, Navy) on the right. Subtext (14px, Neutral-4) below label: one line describing the stage. |
| Step node (expanded) | Same node, but below it an expanded content area appears with: course/program name (16px, 700), duration, estimated earnings (Primary Blue for salary numbers), and list of relevant programs. Background: white card with Light Blue left border (4px). |
| "You are here" marker | First node is visually distinct — larger (48px), Primary Blue fill with white interior icon, with a pin/location icon inside. Label: "You are here — Grade 7/8" in Navy, weight 900. |
| Final node | Employment/certification node — Navy Light (`#3A3A6B`) fill to signal completion/goal. |
| Animation | Expand/collapse transitions: 200ms ease-out height + opacity. Only one step expanded at a time. |
| Spacing | 32px vertical gap between collapsed steps. Expanded content adds height below the node before the next step. |

**Accessibility:** Each step is a `<button>` with `aria-expanded`. Content area uses `aria-hidden` when collapsed. Step labels include the sequence number for screen readers.

### 3.6 Screen 5 — Card Builder

**Layout:** Two-panel layout on desktop (builder inputs on the left, live card preview on the right). Stacked on mobile (inputs on top, preview below, sticky download button at bottom).

| Element | Specification |
|---------|--------------|
| Name input | Full-width text input (max 400px on desktop). Placeholder: "Your first name." Styled per brand input spec: Neutral-3 border, `border-radius: 8px`, 16px font, Primary Blue focus ring. |
| Icon picker | 6 icons displayed in a 3×2 grid (desktop) or 2×3 (mobile). Each icon is a 64px × 64px tappable button. Unselected: Navy stroke on white background. Selected: Primary Blue background with white icon. Only one selectable at a time. |
| Tile selections display | Below the icon picker, show the 2–3 task labels the student selected on Screen 2 as small tag-style chips (Light Blue background, Navy text, `border-radius: 20px`, 14px font). Not editable here — display only. |
| Card preview | Live-updating preview of the card at approximately 50% scale on desktop, full-width on mobile. Shows: background treatment, name, icon, task labels, and career stats updating in real time as the student makes changes. Before name is entered, shows "Your Name" as placeholder text in a lighter opacity. |
| Download button | Primary Blue, full-width on mobile, max 280px on desktop. Label: "Download My Card." Disabled (Neutral-3) until name is entered and icon is selected. After download, shows a brief green checkmark + "Saved!" feedback for 2 seconds. |
| Loading state | When the card background is generating via API: show a subtle pulsing animation on the card preview area with text "Creating your card..." (Neutral-4, 14px). Duration target: under 5 seconds. |

**Card Dimensions and Layout:**

The card renders at **1200 × 675 pixels** (16:9 aspect ratio — displays well on screens and in portfolios).

| Card Zone | Content | Position |
|-----------|---------|----------|
| Background | AI-generated or fallback variant image — full bleed | Full card area |
| Top-left | myBlueprint logo (small, white) | 32px from top, 32px from left |
| Centre-left | Student's first name (36px, 900 weight, white with subtle shadow) | Vertically centred, 48px from left |
| Below name | Selected task labels as tags (14px, white on semi-transparent Navy pill) | Below name, 8px gap between tags |
| Centre-right | Selected icon (large, 96px, white) | Vertically centred, 80px from right |
| Bottom strip | Career stats bar (salary range, demand, training years) in a semi-transparent Navy strip | Full width, 60px tall, bottom-aligned |

### 3.7 Screen 6 — VR Prep

**Layout:** Simple, centred, calm. One column of content. This is a cooldown screen.

| Element | Specification |
|---------|--------------|
| Heading | 32px (24px mobile), Navy, weight 900 | "Get Ready for VR" |
| Description | Body text (16px, Neutral-5), max 3 sentences describing what the carpentry sim involves. |
| Controller tips | 2–3 short tips with small icons (e.g., hand icon + "You'll use your hands to pick up tools"). Displayed as a simple list with 16px spacing. |
| Observation prompts | Visually distinct from the tips — displayed as 2–3 cards with a Light Blue background, Neutral-5 text. Each card has a small icon (eye, brain, hand) and one prompt sentence. Cards are stacked vertically with 12px gap. |
| Navigation | "Back" button (secondary style) to revisit previous screens. No forward button — this is the final screen. |
| Background | Off-White, clean. Possibly a subtle VR headset illustration in the background at low opacity for atmosphere. |

### 3.8 Bridge Page (Post-VR)

**Layout:** Single column, centred, max 640px content width. Congratulatory header at top, checklist below, myBlueprint link at bottom.

| Element | Specification |
|---------|--------------|
| Congrats heading | 32px (24px mobile), Navy, weight 900 | "You just tried carpentry in VR." |
| Congrats subtext | 18px, Neutral-5, weight 300 | One sentence acknowledging the achievement and teeing up what's next. |
| Checklist | 6 numbered items. Each item is a tappable row: checkbox (24px, rounded square, Neutral-2 border unchecked / Primary Blue fill checked with white checkmark) + label (18px, 500, Navy) + optional description (14px, 300, Neutral-4). Rows have 12px vertical gap and a subtle Neutral-1 bottom border. |
| Checked state | Checkbox fills with Primary Blue. Label gets a strikethrough effect (subtle — `text-decoration: line-through` + colour shifts to Neutral-3). A brief scale animation on the checkbox (micro-bounce). |
| Progress indicator | Small text above the checklist: "0 of 6 complete" updating as items are checked. Primary Blue for the count when > 0. |
| myBlueprint button | Large Primary Blue button below the checklist: "Open myBlueprint →". Opens in new tab. |
| Background | Off-White with same decorative treatment as Screen 1 for visual continuity. |

---

## 4. Motion & Animation

### 4.1 Animation Principles

- Animations are **functional, not decorative** — they guide attention, confirm actions, and smooth transitions
- Duration: 150–300ms for micro-interactions (state changes), 400–600ms for screen transitions and reveals
- Easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for state changes
- All animations must respect `prefers-reduced-motion` — when active, replace animations with instant state changes

### 4.2 Animation Inventory

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Salary counter (Screen 1) | Count-up from 0 to target | 2000ms | ease-out |
| Stat cards (Screen 1) | Fade-in + slide-up, staggered 150ms each | 400ms | ease-out |
| Tile selection (Screen 2) | Background colour transition + checkmark fade-in | 200ms | ease-in-out |
| Employer card (Screen 3) | Scale-up from 0.9 to 1.0 + fade-in | 250ms | ease-out |
| Employer card close | Fade-out + scale-down | 150ms | ease-in |
| Pathway expand (Screen 4) | Height auto-expand + content fade-in | 300ms | ease-out |
| Pathway collapse | Height collapse + content fade-out | 200ms | ease-in |
| Card preview update (Screen 5) | Cross-fade on content change | 200ms | ease-in-out |
| Card loading (Screen 5) | Pulsing skeleton on preview area | Continuous (1200ms loop) | ease-in-out |
| Download confirmation (Screen 5) | Checkmark scale-in + "Saved!" text fade-in | 300ms | ease-out (auto-dismiss after 2s) |
| Checklist check (Bridge) | Checkbox fill + micro-bounce | 250ms | spring-like (overshoot) |
| Screen transitions (Pre-VR) | Slide-left entrance + fade (forward) / slide-right (backward) | 400ms | ease-out |

---

## 5. Responsive Behaviour

### 5.1 Breakpoint-Specific Layout Changes

| Screen | < 640px (Mobile) | 640–1023px (Tablet) | ≥ 1024px (Chromebook/Desktop) |
|--------|-----------------|--------------------|-----------------------------|
| Landing | Cards stacked, full width, 180px tall each | Cards side by side, 50% width each | Cards side by side, 400×280px, centred |
| Screen 1 | Counter 48px, stats stacked vertically | Counter 56px, stats horizontal 2-up | Counter 64px, stats horizontal 3-up |
| Screen 2 | 2-column tile grid (3 rows) | 2-column tile grid (3 rows) | 3-column tile grid (2 rows) |
| Screen 3 | Map full width, 280px tall; cards slide up from bottom as panel | Map full width, 400px tall; cards float near pin | Map within content max-width, 500px tall; cards float |
| Screen 4 | Timeline centred, nodes on left, content full width | Timeline centred, content indented right | Timeline centred, content 60% width to the right |
| Screen 5 | Inputs stacked above preview; download button sticky at bottom | Two columns (60/40 split) | Two columns (50/50 split) |
| Screen 6 | Single column, full width | Single column, max 640px centred | Single column, max 640px centred |
| Bridge | Single column, full width | Single column, max 640px centred | Single column, max 640px centred |

### 5.2 Touch Target Rules

All interactive elements must meet minimum 44×44px tap target on all breakpoints. On mobile, increase tap targets to 48×48px where layout allows. Ensure a minimum 8px gap between adjacent tappable elements to prevent mis-taps.

---

## 6. Interaction States

### 6.1 State Matrix

| Component | Default | Hover | Active/Pressed | Selected | Disabled | Focus |
|-----------|---------|-------|----------------|----------|----------|-------|
| Path card (Landing) | White bg, Neutral-2 border | Shadow lift, border → Neutral-3 | Scale 0.98 | N/A | N/A | Primary Blue 3px outline, 3px offset |
| Task tile (Screen 2) | White bg, Neutral-2 border | Shadow lift, border → Neutral-3 | Scale 0.98 | Light Blue bg, Primary Blue border, checkmark | N/A | Primary Blue 3px outline |
| Employer pin (Screen 3) | Primary Blue circle | Scale 1.1, shadow | Scale 0.95 | N/A | N/A | Primary Blue 3px outline, 3px offset |
| Pathway step (Screen 4) | Navy label, Neutral-4 subtext | Label → Primary Blue | N/A | Expanded with card below | N/A | Primary Blue 3px outline |
| Icon option (Screen 5) | Navy stroke on white | Light Blue bg fill | N/A | Primary Blue bg, white icon | N/A | Primary Blue 3px outline |
| Continue button | Primary Blue bg, white text | Darker blue (#0080E6), lift shadow | Scale 0.98, darker (#006ACC) | N/A | Neutral-3 bg, Neutral-4 text | Primary Blue 3px outline, 3px offset |
| Download button | Same as continue | Same | Same | N/A | Same as continue disabled | Same |
| Checklist item (Bridge) | Neutral-2 border checkbox, Navy label | Row bg → Off-White | Checkbox fills | Checked state, label strikethrough | N/A | Primary Blue 3px outline on row |
| Text input (Screen 5) | Neutral-3 border | N/A | N/A | N/A | N/A | Primary Blue border + `0 0 0 3px rgba(0,146,255,0.1)` |

---

## 7. Empty, Loading & Error States

### 7.1 State Specifications

| Screen | State | Visual Treatment |
|--------|-------|-----------------|
| Screen 3 | Employer logo unavailable | 48×48 circle placeholder with company initial letter (Navy on Light Blue bg, 20px, 700 weight) |
| Screen 5 | Card preview before inputs | Card template at 50% opacity showing "Your Name" placeholder, empty icon circle, and task tag placeholders (Neutral-2 on Neutral-1 bg) |
| Screen 5 | Card generating (API call in progress) | Preview area shows pulsing skeleton animation. Text below: "Creating your card..." (14px, Neutral-4) |
| Screen 5 | Card generation failed | Preview area shows fallback card (pre-generated background). No error message shown to the student — the fallback is seamless. If both API and fallback fail (extremely unlikely), show: "Something went wrong — tap to try again" with retry button |
| Screen 5 | Download confirmed | Brief green checkmark animation on the download button + "Saved!" text for 2 seconds, then button returns to default label |
| Bridge | All items unchecked | Checklist is fully visible with all items unchecked. Progress indicator shows "0 of 6 complete" |

---

## 8. Asset Requirements

### 8.1 Illustrations & Icons Needed

| Asset | Format | Count | Notes |
|-------|--------|-------|-------|
| Task tile illustrations | SVG | 6 | One per carpentry task category. Consistent line-illustration style. Navy stroke + Light Blue and Primary Blue selective fills. |
| Card builder icons | SVG | 6 | Hammer, saw, hard hat, tape measure, safety goggles, level. Cohesive set. Must render well at 64px (picker) and 96px (on card, white). |
| Regina area illustrated map | SVG | 1 | Stylized, not geographic. Should convey "local area." Light Blue/Navy/Off-White palette. Include a few recognizable landmarks or labels. |
| Employer pin marker | SVG | 1 | 32px circle with interior icon. Primary Blue fill. |
| Employer logo placeholders | SVG or generated | 4–6 | Circle with company initial. Used only if real logos are unavailable. |
| VR prep illustrations | SVG | 2–3 | Small icons for controller tips and observation prompt cards (hand, eye, brain). |
| Background decorative pattern | SVG or CSS | 1 | Subtle blueprint/construction grid pattern for page backgrounds. Low opacity, non-competing. |
| Pre-generated card backgrounds | PNG | 6–12 | Optimized, max 200KB each. Variety of colour treatments mapped to selection combinations. Used as fallback when image gen API fails. |
| myBlueprint logo | SVG | 2 | Full logo (icon + wordmark) for landing page; icon-only for card. White variant for card overlay. |

### 8.2 Asset Style Consistency

All custom illustrations should follow the same visual language:
- 2px stroke weight, rounded caps
- Navy (`#22224C`) as primary stroke colour
- Light Blue (`#C6E7FF`) and Primary Blue (`#0092FF`) as fill accents
- Clean, friendly, approachable — not overly technical or childish
- No gradients within illustrations (flat fills only)

---

## 9. Design Deliverables Checklist

Before handoff to engineering, the following design artifacts should be completed:

- [ ] Screen-by-screen mockups for all 8 views (landing, screens 1–6, bridge) at Chromebook resolution (1366×768)
- [ ] Mobile mockups for all 8 views at 375px width
- [ ] Interaction state sheet showing all component states (default, hover, active, selected, disabled, focus)
- [ ] Animation specification sheet with timing, easing, and `prefers-reduced-motion` fallbacks
- [ ] Task tile illustrations (6 SVGs)
- [ ] Card builder icons (6 SVGs, both Navy and white variants)
- [ ] Regina illustrated map (SVG with pin placement coordinates)
- [ ] Card template layout at 1200×675px showing zone placement
- [ ] Pre-generated card background variants (6–12 PNGs)
- [ ] Brand token CSS file with all colour, spacing, and typography variables
- [ ] Accessibility annotation layer showing focus order, ARIA roles, and contrast ratios
