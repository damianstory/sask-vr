# UI Integration Playbook

Reference doc for bringing Stitch-generated code back into the codebase. Follow this per screen.

## General Process

1. Copy the JSX layout from Stitch output
2. Open the target component file
3. Keep everything above the `return (...)` block untouched (imports, hooks, state, handlers)
4. Replace only the JSX inside `return (...)` with Stitch's markup
5. Re-bind all dynamic data (see per-screen tables below)
6. Run token cleanup (hex → CSS var)
7. Restore all aria/accessibility attributes
8. Verify with `npm run dev` + `npm run type-check`

## Token Cleanup (Every Screen)

Replace Stitch hardcoded hex values with CSS variables:

| Stitch Hex | Replace With |
|-----------|-------------|
| #0092FF | var(--myb-primary-blue) |
| #22224C | var(--myb-navy) |
| #C6E7FF | var(--myb-light-blue) |
| #F6F6FF | var(--myb-off-white) |
| #E5E9F1 | var(--myb-neutral-1) |
| #D9DFEA | var(--myb-neutral-2) |
| #AAB7CB | var(--myb-neutral-3) |
| #65738B | var(--myb-neutral-4) |
| #485163 | var(--myb-neutral-5) |
| #252A33 | var(--myb-neutral-6) |
| #0070CC | var(--myb-blue-dark) |
| #3DA8FF | var(--myb-blue-vivid) |
| #3A3A6B | var(--myb-navy-light) |
| #E0F0FF | var(--myb-light-blue-soft) |

## Import-Cleanup Rule

**Prefer adapting existing components before inlining duplicated UI.** If Stitch generates markup that overlaps with an existing component, restyle the existing component rather than duplicating its logic into the parent.

Components to protect:
- `components/Navigation.tsx` — restyle, don't inline nav buttons
- `components/ProgressBar.tsx` — restyle, don't inline progress dots
- `app/pre-vr/components/IconPicker.tsx` — restyle, don't inline icon grid
- `app/pre-vr/components/TaskTagChips.tsx` — restyle, don't inline chip list
- `app/pre-vr/components/CardPreview.tsx` — restyle, don't inline preview

---

## Per-Screen Integration Maps

### Landing Page — `app/page.tsx`

**Visual subtree to replace:** Everything inside `<main>` tag

**State/hooks to keep:**
- `const router = useRouter()`

**Analytics to keep:**
- `trackPathSelect('pre_vr')` on pre-VR card click
- `trackPathSelect('post_vr')` on post-VR card click

**A11y to keep:**
- `id="main-content"` on `<main>`
- `aria-label` on both cards with full action descriptions

**Data bindings:**
- `{content.meta.occupationTitle}` — heading
- `{content.meta.landingDescription}` — pre-VR card subtext

---

### Pre-VR Shell — `app/pre-vr/page.tsx`

**DO NOT replace this file's JSX.** Only restyle the `ProgressBar` and `Navigation` components by editing their own files.

**What stays untouched in this file:**
- `SessionProvider` wrapper
- `currentScreen` / `direction` / `isInitialMount` state
- `goNext()` / `goPrev()` handlers
- Screen rendering logic (`screens[currentScreen]`)
- Slide animation class application
- `trackScreenView` call
- Heading focus management (`data-screen-heading` + `requestAnimationFrame`)
- Suspense fallback for Screen 3

---

### ProgressBar — `components/ProgressBar.tsx`

**Visual subtree to replace:** Everything inside the outer `<div>`

**Props to keep:** `current: number`, `total: number`

**A11y to keep:**
- `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-hidden="true"` on individual dots
- Counter text provides accessible label

---

### Navigation — `components/Navigation.tsx`

**Visual subtree to replace:** Everything inside the outer `<div>`

**Props to keep:** `currentScreen`, `totalScreens`, `onNext`, `onPrev`

**A11y to keep:**
- `aria-label="Go to previous screen"` on Back
- `aria-label="Go to next screen"` on Next
- `disabled` attribute on Back when `currentScreen === 1`
- Next button not rendered when `currentScreen === totalScreens`

---

### Screen 1 — `app/pre-vr/components/ScreenOne.tsx`

**Visual subtree to replace:** JSX inside `return (...)` — but **preserve `OdometerDigit` component structure**

**State/hooks to keep:**
- `useReducedMotion()` custom hook (entire function)
- `OdometerDigit` component (entire function)
- `useState` for `isVisible`
- `useEffect` for animation trigger

**Analytics to keep:** None on this screen

**A11y to keep:**
- `data-screen-heading` on heading
- `aria-label={`$${formattedSalary}`}` on salary container
- `role="text"` on salary container

**Data bindings:**
- `data.hookQuestion` — heading text
- `data.salary.amount` — counter target (formatted with commas)
- `data.salary.source` — source attribution
- `data.stats.map(...)` — stat cards (value + label)

---

### Screen 2 — `app/pre-vr/components/ScreenTwo.tsx`

**Visual subtree to replace:** JSX inside `return (...)`

**State/hooks to keep:**
- `useSession()` for `selectedTiles`, `setSelectedTiles`
- `useState` for `shakeId`, `overflowMessage`
- `handleTileToggle` function (entire thing)
- `buttonLabel` computation
- `isDisabled` computation

**Analytics to keep:**
- `trackTileSelect(tileId, 'select'|'deselect')` inside `handleTileToggle`

**A11y to keep:**
- `data-screen-heading` on heading
- `aria-pressed={isSelected}` on each tile button

**Data bindings:**
- `data.heading`, `data.subtext`, `data.instruction`
- `data.tiles.map(...)` — tile grid (id, title, description, emoji)
- `selectedTiles.includes(tile.id)` — selected check
- `shakeId === tile.id` — shake animation trigger
- `overflowMessage` — overflow feedback visibility
- `buttonLabel` — CTA button text
- `isDisabled` — CTA disabled state
- `onNext` prop — CTA click handler

---

### Screen 3 — `app/pre-vr/components/ScreenThree.tsx`

**Visual subtree to replace:** JSX inside `return (...)` — heading, map container styling, employer card layout. **Do NOT touch MapLibre init or marker creation.**

**State/hooks to keep:**
- All `useRef` declarations (mapContainerRef, mapRef, pinRefs, closeButtonRef, lastPinRef)
- `useState` for `selectedEmployer`
- `closeCard` callback
- All `useEffect` hooks (focus management, escape key, click-outside, focus return, map init)

**Analytics to keep:**
- `trackEmployerTap(employer.id, employer.name)` in marker click handler

**A11y to keep:**
- `data-screen-heading` on heading
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="employer-card-name"` on card
- `aria-label="Close employer card"` on close button
- `aria-label="View ${employer.name}"` on pins (set in useEffect, not in JSX)
- `id="employer-card"` on card (used by click-outside handler)
- `id="employer-card-name"` on company name heading

**Data bindings:**
- `data.heading`, `data.subtext`
- `ref={mapContainerRef}` on map div
- `employer` derived from `selectedEmployer` + `data.employers.find(...)`
- Employer fields: `name`, `description`, `employeeCount`, `quote`

---

### Screen 4 — `app/pre-vr/components/ScreenFour.tsx`

**Visual subtree to replace:** JSX inside `return (...)`

**State/hooks to keep:**
- `useState` for `expandedStepId` (initialized to `data.steps[0]?.id`)
- `toggleStep` function

**Analytics to keep:**
- `trackPathwayExpand(step.id, step.title)` inside `toggleStep`

**A11y to keep:**
- `data-screen-heading` on heading
- `aria-expanded={isExpanded}` on each step button

**Data bindings:**
- `data.heading`, `data.subtext`
- `data.steps.map(...)` — step iteration with index
- `isExpanded = expandedStepId === step.id`
- `isFirst = index === 0`, `isLast = index === data.steps.length - 1`
- Step fields: `title`, `subtitle`, `details.description`, `details.duration`, `details.earnings`, `details.programs[]`, `details.courses[]`

**Key behavior:**
- `gridTemplateRows: isExpanded ? '1fr' : '0fr'` for expand/collapse animation

---

### Screen 5 — `app/pre-vr/components/ScreenFive.tsx`

**Visual subtree to replace:** JSX inside `return (...)`

**State/hooks to keep:**
- `useSession()` for `firstName`, `selectedIcon`, `selectedTiles`, setters
- `useState` for `nameError`, `isDownloading`, `isDownloaded`
- `useRef` for `nameEnteredRef`
- `handleDownload` async function
- All computed values (`trimmedName`, `canDownload`, `gradientVariant`, `selectedIconData`, `taskLabels`)

**Analytics to keep:**
- `trackNameEntered()` on first keystroke
- `trackIconSelect(iconId)` on icon tap
- `trackCardDownload()` inside `handleDownload`

**A11y to keep:**
- `data-screen-heading` on heading
- `htmlFor="card-name"` on label, `id="card-name"` on input

**Data bindings:**
- `data.heading`, `data.subtext`, `data.nameInputLabel`, `data.nameInputPlaceholder`, `data.iconSelectionLabel`, `data.downloadButtonLabel`
- `data.icons` → passed to `<IconPicker>`
- `firstName` / `setFirstName` → input value/onChange
- `selectedIcon` / `setSelectedIcon` → IconPicker props
- `selectedTiles` → TaskTagChips prop
- `trimmedName`, `selectedIconData?.emoji`, `taskLabels`, `gradientVariant` → CardPreview props
- `canDownload`, `isDownloading`, `isDownloaded` → button states

**Child components (restyle, don't inline):**
- `<IconPicker icons={...} selectedIcon={...} onSelect={...} />`
- `<TaskTagChips tileIds={...} />`
- `<CardPreview name={...} iconEmoji={...} taskLabels={...} gradientVariant={...} />`

---

### Screen 6 — `app/pre-vr/components/ScreenSix.tsx`

**Visual subtree to replace:** JSX inside `return (...)`

**State/hooks to keep:** None (stateless component)

**Analytics to keep:** None

**A11y to keep:**
- `data-screen-heading` on heading
- `aria-hidden="true"` on emoji icons

**Data bindings:**
- `data.heading`, `data.subtext`
- `data.prompts.map(...)` — prompt cards (id, text)
- `promptIcons[index]` — emoji icon per card

---

### Post-VR — `app/post-vr/page.tsx`

**Visual subtree to replace:** Everything inside `<main>` tag

**State/hooks to keep:**
- `useState` for `checkedItems`
- `toggleItem` function

**Analytics to keep:**
- `trackChecklistCheck(item.id, item.label)` when checking (not unchecking)

**A11y to keep:**
- `id="main-content"` on `<main>`
- `data-screen-heading` on heading
- `role="checkbox"` + `aria-checked={isChecked}` on each checklist button

**Data bindings:**
- `data.congratsHeading`, `data.congratsSubtext`, `data.checklistHeading`
- `data.checklist.map(...)` — items (id, label)
- `checkedItems.includes(item.id)` — checked state
- `checkedItems.length` — progress count
- `data.checklist.length` — total count
- `data.myblueprintLink.url` — CTA href
- `data.myblueprintLink.label` — CTA text

---

## Verification Checklist (After Each Screen)

- [ ] `npm run dev` — renders correctly at 375px, 768px, 1366px
- [ ] `npm run type-check` — no TypeScript errors
- [ ] All interactive elements work (tap, keyboard, focus)
- [ ] All `track*()` analytics events fire (check browser console)
- [ ] Skip-to-content link still works
- [ ] `data-screen-heading` focus on screen transitions
- [ ] `prefers-reduced-motion` behavior correct
- [ ] Variable content lengths don't break layout
- [ ] Screen 3 Suspense fallback looks coherent
