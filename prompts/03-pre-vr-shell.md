# Pre-VR Shell — Progress Bar + Navigation

## Context

This is the static chrome that wraps all 6 screens of the pre-VR flow in a career exploration app for Grade 7–8 students. It provides a progress indicator (dots showing which screen you're on) and back/next navigation buttons. The screen content is injected into a content area between the progress bar and navigation — this prompt only designs the chrome frame, not the screen content or transitions.

Screen transitions (slide animations, direction logic) are handled separately and are NOT part of this design. This is about the static visual framing only.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Primary Blue: #0092FF (active dots, next button)
- Navy: #22224C (text)
- Neutral-3: #AAB7CB (inactive dots, disabled button text)
- Neutral-4: #65738B (secondary text like "3 of 6")
- Neutral-5: #485163 (body text)
- Blue Dark: #0070CC (next button hover)
- Off-White: #F6F6FF (page background)
- Focus ring: 3px solid #0092FF, 3px offset
- Min touch target: 44x44px
- Button radius: 8px

## Requirements

### Progress Bar (Top)
- Row of 6 dots, horizontally centered, with "X of 6" text below
- Dot size: 12px diameter (3 classes: w-3 h-3)
- Completed + current dots: Primary Blue (#0092FF) fill
- Future dots: Neutral-3 (#AAB7CB) fill
- Current dot: gentle pulse animation (scale 1.0 → 1.2 → 1.0, 2s loop)
- 8px gap between dots
- Counter text: "1 of 6" style, 14px, weight 300, Neutral-4
- The progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Vertical padding: 16px

### Navigation (Bottom)
- Horizontal bar with Back button (left) and Next button (right)
- **Back button:** Text-only, "Back", 16px weight 300, Neutral-5. Disabled on screen 1 (Neutral-3 text, cursor not-allowed). Min 44x44px touch target.
- **Next button:** Filled Primary Blue background, white text, "Next", 16px weight 800. Rounded 8px. Hover: Blue Dark (#0070CC). Focus: 3px Primary Blue ring, 3px offset. Hidden entirely on screen 6 (the final screen).
- Padding: 16px horizontal, 16px vertical

### Content Area (Middle)
- Flex-1, fills remaining vertical space between progress bar and navigation
- Overflow hidden (screen content handles its own scrolling)
- This is where individual screen components render — leave it as a clean container

## States

### Progress Dots
- Inactive: Neutral-3 fill
- Active/Completed: Primary Blue fill
- Current: Primary Blue fill + pulse animation

### Back Button
- Default: Neutral-5 text
- Disabled (screen 1): Neutral-3 text, not clickable
- Focus: 3px Primary Blue outline

### Next Button
- Default: Primary Blue bg, white text
- Hover: Blue Dark bg
- Active: Scale 0.98
- Focus: 3px Primary Blue ring, 3px offset
- Hidden: Not rendered on screen 6

## Interactions

- Back button calls `onPrev()`, Next button calls `onNext()` — these are passed as props
- `currentScreen` and `totalScreens` are passed as props to control dot state and button visibility
- Keyboard: Tab through Back → Next, Enter/Space to activate

## Non-Negotiable Behavior to Preserve

- Progress bar uses `role="progressbar"` with aria-value attributes
- Dots are `aria-hidden="true"` (the counter text provides the accessible label)
- Back button has `aria-label="Go to previous screen"`
- Next button has `aria-label="Go to next screen"`
- Back button is `disabled` (not hidden) when `currentScreen === 1`
- Next button is completely removed from DOM (not just hidden) when `currentScreen === totalScreens`

## Safe Replacement Boundary

- **REPLACE:** Visual styling of dots, counter text, back button, next button, overall layout
- **PRESERVE:** Props interface (`currentScreen`, `totalScreens`, `onNext`, `onPrev`), aria attributes, disabled/hidden logic

## Constraints

- This is two separate components (ProgressBar + Navigation), not one combined component
- Prefer semantic wrappers that slot into the existing component files
- Do not design screen transition animations — those are handled by the parent
- Production-ready React/Tailwind with semantic HTML
