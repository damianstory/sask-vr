# Post-VR Page — Checklist & Bridge

## Context

This is a standalone page (separate from the pre-VR flow) that students visit after completing the VR simulation. They arrive here by scanning a QR code or tapping a link. The page congratulates them, provides a checklist of next steps, and includes a call-to-action linking to the myBlueprint platform.

The tone is celebratory and action-oriented — "You just did something cool. Here's what to do next." It should maintain the energy from the VR experience and channel it into concrete steps.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, checklist labels)
- Primary Blue: #0092FF (checked checkbox, progress count, CTA button, focus ring)
- Off-White: #F6F6FF (page background)
- Neutral-1: #E5E9F1 (row bottom border)
- Neutral-2: #D9DFEA (unchecked checkbox border)
- Neutral-3: #AAB7CB (checked label text — strikethrough)
- Neutral-4: #65738B (progress counter text)
- Neutral-5: #485163 (subtext)
- Blue Dark: #0070CC (CTA button hover)
- Button radius: 8px
- Checkbox radius: 4px (rounded square)
- Focus ring: 3px solid #0092FF, 3px offset
- Min touch target: 44x44px

## Requirements

### Congrats Section
- Heading: "You just tried carpentry in VR." — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: one sentence acknowledging the achievement — 20px desktop / 18px mobile, weight 300, Neutral-5, centered
- Must have `data-screen-heading` attribute on heading

### Checklist Section
- Section heading: e.g., "Your next steps" — 20px desktop / 24px mobile, weight 800, Navy
- Progress counter: "0 of 6 complete" — 16px, weight 300, Neutral-4. The number turns Primary Blue + weight 800 when > 0.
- Max width: 640px, centered

### Checklist Items
- 6 items (content-driven), stacked vertically, 12px gap
- Each item is a `<button>` element (entire row is tappable)
- Layout: checkbox on left + label text on right, 12px gap
- Bottom border per row: 1px Neutral-1
- Focus: 3px Primary Blue ring, rounded

**Checkbox (left):**
- Size: 24x24px
- Unchecked: 2px Neutral-2 border, white fill, rounded (4px)
- Checked: Primary Blue fill, white checkmark SVG inside, bounce animation (scale 1→1.15→1, 250ms ease-out)

**Label (right):**
- Unchecked: 20px desktop / 24px mobile, weight 300, Navy
- Checked: same size, Neutral-3 (#AAB7CB) text, `line-through` decoration

### CTA Button
- Below checklist, 32px margin above
- Label: e.g., "Open myBlueprint" — links to external URL, opens in new tab
- Full-width on mobile, max 280px on desktop, centered
- Min height: 44px, rounded 8px
- Primary Blue bg, white text, weight 800
- Hover: Blue Dark bg
- Focus: 3px Primary Blue ring, 3px offset
- This is an `<a>` tag (external link), not a button

## States

### Checkbox
- Unchecked: white fill, Neutral-2 border
- Checked: Primary Blue fill, white check SVG, bounce animation
- Focus: 3px Primary Blue ring on the whole row

### Checklist Label
- Unchecked: Navy text
- Checked: Neutral-3 text + line-through

### CTA Button
- Default: Primary Blue bg
- Hover: Blue Dark bg
- Focus: 3px ring + 3px offset

## Interactions

- Tap a checklist row to toggle checked/unchecked
- Checking an item updates the progress counter
- Unchecking an item is also allowed (toggle behavior)
- CTA button opens external URL in new tab
- Keyboard: Tab through checklist items and CTA, Enter/Space to toggle/activate
- Each checklist item has `role="checkbox"` and `aria-checked="true/false"`

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` on heading
- Checklist items are `<button>` elements with `role="checkbox"` and `aria-checked`
- `toggleItem` function handles check/uncheck state
- `trackChecklistCheck(item.id, item.label)` analytics call when checking (not unchecking)
- `checkedItems` state array tracks which items are checked
- Progress counter updates reactively based on `checkedItems.length`
- CTA link URL and label come from content (`content.postVr.myblueprintLink`)
- Checklist items come from content (`content.postVr.checklist[]`)

## Safe Replacement Boundary

- **REPLACE:** Congrats section typography/spacing, checklist row layout/styling, checkbox visual design, CTA button styling, progress counter styling, overall page layout
- **PRESERVE:** `checkedItems` state + `toggleItem` logic, `trackChecklistCheck` calls, `role="checkbox"` + `aria-checked` semantics, content bindings (`content.postVr.*`), CTA link behavior (`target="_blank"`, `rel="noopener noreferrer"`)

## Constraints

- Checklist item count varies by occupation (4–8 typical)
- Label text varies in length — rows must handle wrapping gracefully
- This is a standalone page with its own URL (/post-vr), not part of the pre-VR flow
- No progress bar or navigation chrome — this page has its own layout
- Use carpentry examples but keep structure generic
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
