# Phase 3: Card Builder - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Screen 5 of the Pre-VR flow: students create a personalized Carpenter Card by entering their first name, choosing one of six tool icons, and downloading a 1200x675px PNG. Task selections from Screen 2 appear as non-editable tags on the card. The card is a tangible artifact students keep. Canvas API composites the final PNG client-side. Student name never leaves the browser.

</domain>

<decisions>
## Implementation Decisions

### Card Visual Layout
- Trading card style — bold, collectible feel that Grade 7/8s would want to show off
- "CARPENTER CARD" title text at the top of the card
- Hero-sized icon in center (emoji on colored circle background, ~30% of card height)
- Student's name prominently centered below the icon
- Task tag chips below the name (2-3 tags from Screen 2 selections)
- No career stats on the card — just name, icon, title, and task tags for a clean personal artifact

### Icon Style & Assets
- Emoji icons, consistent with Screen 2 tile pattern — no SVG assets needed
- Six tools: Hammer, Saw, Hard Hat, Tape Measure, Goggles, Level
- Each emoji displayed on a soft colored circle background on both the picker and the card
- Icon picker: 3x2 grid with tool name labels below each emoji
- Selected icon state uses Primary Blue border glow (consistent with Screen 2 tile selection feedback)

### Background Variants
- CSS/Canvas programmatic gradients — eliminates the pre-generated PNG blocker entirely
- Bold diagonal two-tone gradients using myBlueprint palette combos (navy-to-blue, blue-to-light-blue, etc.)
- Background determined by deterministic hash of the 2-3 selected task tile IDs — same selections always produce the same gradient
- 6-8 gradient combos from the brand color palette

### Builder Page Layout
- Side-by-side on desktop/Chromebook: controls (name input, icon picker, task tags) on left, live card preview on right
- Stacks vertically on mobile (controls above preview)
- Task selections from Screen 2 shown as read-only tag chips in the controls panel, labeled "Your skills" or similar
- Download button positioned below the card preview
- Download button disabled until both name and icon are provided (per CARD-08)

### Post-Download Flow
- Brief celebratory moment ("Your card is saved!") after successful download
- Continue button appears to advance to Screen 6 (VR Prep) — student controls the pace

### Claude's Discretion
- Exact gradient color combos and hash function implementation
- Card typography sizing and spacing
- Celebratory animation/feedback style after download
- Icon picker hover/focus states
- Mobile breakpoint stacking behavior
- Canvas rendering implementation details
- Name input validation UX (inline error messaging style)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design & Visual Specs
- `DESIGN_SPECS.md` — Component specifications, color system, typography, spacing, animation inventory, responsive breakpoints
- `DESIGN_SPECS.md` §5.1 — Breakpoint-specific layout changes per screen

### Technical Architecture
- `TECH_SPECS.md` — Architecture, routing, session state, content schema, card generation approach
- `TECH_SPECS.md` §1 — Architecture overview, technology stack

### Product Requirements
- `PRD.md` — Product definition, success metrics, scope boundaries

### Codebase Structure
- `.planning/codebase/STRUCTURE.md` — Directory layout, file locations, naming conventions
- `.planning/codebase/CONVENTIONS.md` — Coding conventions, accessibility patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `context/SessionContext.tsx`: Already has `firstName`, `selectedIcon`, `selectedTiles`, `generatedCardUrl` + setters — all state hooks pre-wired
- `app/pre-vr/components/ScreenFive.tsx`: Placeholder shell already wired to `content.screenFive` data, uses correct aspect ratio placeholder
- `content/carpentry.json` screenFive section: Has heading, subtext, nameInputLabel, nameInputPlaceholder, iconSelectionLabel, 6 icons with IDs and labels, downloadButtonLabel
- `content/types.ts`: TypeScript interface already defines screenFive schema shape (icons array with id, label, svgPath)

### Established Patterns
- Content import: `import { content } from '@/content/config'` then `content.screenFive`
- CSS variables for brand tokens: `--myb-navy`, `--myb-primary-blue`, `--myb-light-blue`, `--myb-neutral-*`
- Screen 2 tile selection: Primary Blue border glow + checkmark badge for selected state — reuse for icon picker
- Screen 2 emoji-on-colored-circle pattern — reuse for icon display
- Mobile-first responsive with Tailwind `md:` breakpoints

### Integration Points
- ScreenFive.tsx replaces existing placeholder — same file, same export, same import in pre-vr/page.tsx
- Must call `setFirstName()`, `setSelectedIcon()`, `setGeneratedCardUrl()` from `useSession()`
- Reads `selectedTiles` from `useSession()` to display task tag chips
- Canvas API for compositing final PNG (no external dependencies needed)
- Download triggers via programmatic anchor click with blob URL

</code_context>

<specifics>
## Specific Ideas

- Trading card feel is key — students should want to show this off, not just file it away
- Emoji icons keep it playful and consistent with Screen 2's tile pattern (no design asset dependency)
- Gradients over static PNGs eliminates the background asset blocker flagged in STATE.md
- "Your card is saved!" moment should feel like an achievement unlock, not just a file download
- Side-by-side layout gives instant feedback on Chromebook screens (1366x768 primary target)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-card-builder*
*Context gathered: 2026-03-19*
