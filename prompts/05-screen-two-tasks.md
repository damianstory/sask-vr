# Screen 2 — Task Tile Selection

## Context

Screen 2 of the pre-VR flow in a career exploration app. Students choose 2–3 carpentry tasks that interest them from a grid of 6 tiles. Each tile has an emoji icon, a title, and a short description. Their selections carry forward to the card builder on Screen 5 — this is the first point where the experience becomes personalized.

The student is 12–14 years old. The tiles should feel fun and tappable, like choosing features in a character creator or game loadout — not like filling out a survey.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, tile labels)
- Primary Blue: #0092FF (selected border, checkmark, CTA button, focus ring)
- Light Blue: #C6E7FF (selected tile background, emoji circle default)
- Off-White: #F6F6FF (page background)
- Neutral-2: #D9DFEA (unselected tile border)
- Neutral-3: #AAB7CB (unselected hover border, disabled button)
- Neutral-4: #65738B (tile descriptions, instructions)
- Neutral-5: #485163 (subtext)
- Blue Dark: #0070CC (CTA button hover)
- Tile radius: 12px
- Button radius: 8px
- Focus ring: 3px solid #0092FF
- Min touch target: 44x44px

## Requirements

### Heading + Instructions
- Heading: "What do carpenters actually do?" — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: "Tap the tasks that sound most interesting to you." — 16px, weight 300, Neutral-5
- Instruction: "Select 2 to 3 tasks" — 14px, weight 300, Neutral-4
- Must have `data-screen-heading` attribute on heading

### Tile Grid
- 6 tiles total: 3 columns on desktop (md:grid-cols-3), 2 columns on mobile (grid-cols-2)
- Gap: 16px
- Max width: ~512px container
- Each tile is a `<button>` element

### Individual Tile
- Min height: 140px, min width: 44px
- Structure (top to bottom): emoji circle → title → description
- **Emoji circle:** 48x48px, centered, rounded-full
  - Unselected: Light Blue (#C6E7FF) background
  - Selected: White background
- **Title:** 20px desktop / 16px mobile (weight 800, Navy), centered
- **Description:** 14px, weight 300, Neutral-4, centered
- **Checkmark badge (selected only):** Small circle (24px) in top-right corner, Primary Blue background, white checkmark SVG inside

### CTA Button
- Full-width within container, min height 44px, rounded 8px
- **Label changes based on selection count:**
  - 0 selected: "Pick at least 2"
  - 1 selected: "Pick 1 more"
  - 2–3 selected: "Continue →"
- **Disabled (0–1 selected):** Neutral-3 (#AAB7CB) background, white text, cursor-not-allowed
- **Enabled (2–3 selected):** Primary Blue (#0092FF) background, white text, weight 800
- **Hover (enabled):** Blue Dark (#0070CC)

### Overflow Feedback
- If student taps a 4th tile when 3 are already selected: show inline message "You can pick up to 3!" below the grid
- Message: 14px, weight 300, Neutral-4
- Auto-dismisses after 3 seconds

## States

### Tiles
- **Default:** White background, 1px Neutral-2 border
- **Hover:** Subtle shadow lift, border shifts to Neutral-3
- **Selected:** Light Blue (#C6E7FF) background, 2px Primary Blue border, checkmark badge in top-right
- **Active/Pressed:** Scale 0.98
- **Shake (overflow):** Brief horizontal shake animation (300ms) when trying to select a 4th tile
- **Focus:** 3px Primary Blue outline

### CTA Button
- **Disabled:** Neutral-3 bg, white text, not clickable
- **Enabled:** Primary Blue bg, white text
- **Hover:** Blue Dark bg
- **Focus:** 3px Primary Blue ring

## Interactions

- Tap a tile to toggle selection (select/deselect)
- Selecting a 4th tile triggers shake + overflow message instead of selecting
- CTA button calls `onNext()` when enabled and clicked
- Keyboard: Tab through tiles and button, Enter/Space to toggle/activate
- Each tile is `aria-pressed="true/false"`

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` attribute on heading
- Selection min (2) and max (3) enforcement with shake feedback
- CTA button label changes based on selection count (3 distinct labels)
- Overflow message auto-dismiss after 3 seconds
- `aria-pressed` on each tile button
- `trackTileSelect(tileId, 'select'|'deselect')` analytics call on each toggle
- Session context bindings: `selectedTiles` read/write via `useSession()`
- `onNext` prop called when CTA is clicked (not routing directly)

## Safe Replacement Boundary

- **REPLACE:** Tile grid layout, tile card styling, emoji circle styling, button visual design, overflow message styling, spacing/typography
- **PRESERVE:** `handleTileToggle` logic (min/max + shake + overflow state), `shakeId`/`overflowMessage` useState, `trackTileSelect` calls, `useSession().selectedTiles` bindings, CTA label computation, `onNext` prop, all aria attributes

## Constraints

- The grid must handle exactly 6 tiles (content-driven), but layout should not break with 4–8 tiles
- Use carpentry task examples but keep the tile structure generic
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
