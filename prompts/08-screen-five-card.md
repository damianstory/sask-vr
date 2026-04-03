# Screen 5 — Card Builder

## Context

Screen 5 of the pre-VR flow. This is the creative payoff — students build a personalized "Carpenter Card" by entering their name, choosing an icon, and seeing their task selections from Screen 2 reflected as tags. A live preview updates in real time. When they're happy, they download the card as a PNG image.

The student is 12–14 years old. This should feel like creating a collectible trading card or a game profile — personal, fun, and worth keeping.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, input text)
- Primary Blue: #0092FF (selected icon, download button, focus ring)
- Light Blue: #C6E7FF (icon picker background)
- Off-White: #F6F6FF (page background)
- Neutral-2: #D9DFEA (input border, card preview border)
- Neutral-3: #AAB7CB (disabled button, placeholder text)
- Neutral-4: #65738B (labels, secondary text)
- Neutral-5: #485163 (body text)
- Blue Dark: #0070CC (button hover)
- Card radius: 12px
- Input radius: 12px
- Badge/chip radius: 20px (pill)
- Focus ring: 3px solid #0092FF
- Min touch target: 44x44px

## Requirements

### Heading + Subtext
- Heading: "Build your Carpenter Card" — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: descriptive sentence — 16px, weight 300, Neutral-5
- Must have `data-screen-heading` attribute on heading

### Two-Panel Layout
- **Desktop (md+):** Side-by-side, 50/50 split, max-width ~1024px, 32px gap
- **Mobile:** Stacked — controls on top, preview below
- Left panel: controls (name input, icon picker, task tags)
- Right panel: live card preview + download/continue button

### Control Panel (Left/Top)

**Name Input:**
- Label: "Your first name" — 14px, weight 300, Neutral-4
- Full-width text input, max 30 characters
- Placeholder: e.g., "Your first name"
- Styling: Neutral-2 border, 12px radius, 16px padding, 16px font weight 300, Navy text
- Focus: 3px Primary Blue ring
- Error state: red-500 text below input ("Please enter your first name") — shown on blur if empty after typing

**Icon Picker:**
- Label: "Pick your icon" — 14px, weight 300, Neutral-4
- Grid of 6 emoji icons (3x2 on desktop, 2x3 on mobile)
- Each icon is a 64x64px tappable button, rounded-full
- Unselected: white background, subtle border
- Selected: Primary Blue background, white content
- Only one icon selectable at a time
- **This is a separate `IconPicker` component** — restyle it, don't inline its markup

**Task Tag Chips:**
- Displays the 2–3 tasks selected on Screen 2 as read-only tag pills
- Light Blue (#C6E7FF) background, Navy text, 14px font, rounded-full (20px radius)
- Not editable — display only
- **This is a separate `TaskTagChips` component** — restyle it, don't inline its markup

### Card Preview (Right/Bottom)

- Live-updating preview of the card at the correct 16:9 aspect ratio (1200x675)
- Max width: ~512px on desktop, full-width on mobile
- Border: 1px Neutral-2, 12px radius, overflow hidden
- Background: gradient fill (determined by task selections — `getGradientVariant()`)
- Shows: title label ("CARPENTER CARD"), icon in white circle, student name (or "Your Name" placeholder at 50% opacity), task tags as translucent white pills
- **Must remain compatible with Canvas PNG export** — avoid CSS effects (blur, backdrop-filter, complex multi-stop gradients, box-shadow on internal elements) that won't translate to the `generateCardPng()` output
- **This is a separate `CardPreview` component** — restyle it, don't inline its markup

### Download / Post-Download States

**Pre-download:**
- Download button: full-width within panel, min-height 44px, rounded 8px
- Label: "Download My Card"
- Disabled (name empty or no icon): Neutral-3 bg, white text, cursor-not-allowed
- Enabled: Primary Blue bg, white text, weight 800
- Hover: Blue Dark
- Loading: "Saving..." text while generating PNG

**Post-download (after successful download):**
- Download button is replaced with a celebration UI:
  - Green checkmark circle (32px, green-500 bg, white check SVG)
  - Text: "Your card is saved!" — 16px, weight 800, Navy
  - "Continue" button: full-width, Primary Blue, white text, weight 800 — advances to Screen 6
- Entrance: scale-fade-in animation (scale 0.9→1, opacity 0→1, 300ms ease-out)

## States

### Name Input
- Default: Neutral-2 border
- Focus: Primary Blue 3px ring
- Error: red-500 text below

### Icon Picker
- Unselected: white bg, subtle border
- Selected: Primary Blue bg
- Focus: 3px Primary Blue ring

### Download Button
- Disabled: Neutral-3 bg
- Enabled: Primary Blue bg
- Hover: Blue Dark bg
- Loading: "Saving..." text
- Post-download: replaced with celebration + continue

## Interactions

- Type name → live preview updates in real time
- Tap icon → live preview updates, previous selection deselects
- Download button generates PNG via Canvas API and triggers browser download
- After download completes, UI switches to celebration + continue state
- Continue button calls `onNext()` to advance to Screen 6
- Keyboard: Tab through input → icons → download/continue, standard form behavior

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` on heading
- `handleDownload` function: generates PNG via `generateCardPng()`, triggers `<a>` download, tracks `trackCardDownload()`
- `getGradientVariant(selectedTiles)` for card background color
- Session bindings: `firstName`, `selectedIcon`, `selectedTiles` via `useSession()`
- Analytics: `trackNameEntered()` on first keystroke, `trackIconSelect(iconId)` on icon tap, `trackCardDownload()` on download
- `isDownloaded` state toggles UI from download button to celebration+continue
- `nameError` state shows validation on blur
- `onNext` prop called by Continue button (not routing directly)
- `IconPicker`, `TaskTagChips`, `CardPreview` remain separate components — restyle, don't inline

## Safe Replacement Boundary

### Control Panel
- **REPLACE:** Layout, input styling, icon picker container styling, tag chip container styling, download button visual design, post-download celebration layout
- **PRESERVE:** `handleDownload` logic, session bindings, analytics calls, validation logic, `isDownloaded`/`nameError` state, component boundaries (IconPicker/TaskTagChips/CardPreview as separate imports)

### Card Preview
- **REPLACE:** Card visual treatment (gradient overlay, text positioning, tag pill styling, overall card art direction)
- **PRESERVE:** 16:9 aspect ratio (1200x675), `CARD_GRADIENTS` gradient application via inline style, data bindings (name, iconEmoji, taskLabels, gradientVariant), Canvas-compatible rendering (no CSS-only effects)

## Constraints

- Card preview must render identically (or very close) to the PNG export — this is the core UX promise
- Icon count is 6 (content-driven) but layout should handle 4–8
- Task tags come from Screen 2 selections (2–3 labels, variable length)
- Use carpentry examples but keep structure generic for occupation swaps
- Prefer semantic wrappers that slot into existing components
- Production-ready React/Tailwind with semantic HTML
