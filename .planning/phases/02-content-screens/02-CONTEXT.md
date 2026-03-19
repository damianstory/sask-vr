# Phase 2: Content Screens - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all six Pre-VR placeholder screen shells and the Post-VR page with interactive, content-rich implementations. Screens 1-4, Screen 6, and the Post-VR checklist gain full interactivity and visual polish. Screen 5 (Card Builder) is Phase 3. Analytics instrumentation is Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Screen 1 — Salary Counter & Hook
- Odometer-style digit animation: each digit rolls independently like a mechanical counter, with slight stagger between digits
- Counter duration: ~2 seconds with ease-out easing
- Hook question text ("Ever wonder what a carpenter earns?") appears immediately as bold static text — no animation on the text itself
- Stat cards appear in staggered fade-in sequence after counter lands: 200ms stagger, each card slides up slightly as it fades in (first card at +0.3s after counter, then +0.5s, +0.7s)
- Stat cards styled as "data badges" — Navy background, white text, bold number on top with small label below, rounded corners
- prefers-reduced-motion: show final salary number immediately, stat cards appear without animation

### Screen 2 — Task Tiles
- Tile selection feedback: Primary Blue border glow + checkmark badge in top-right corner on selected tiles
- Unselected tiles stay with neutral/gray border
- 4th selection attempt: tile does a brief horizontal shake animation + inline message below grid ("You can pick up to 3!") that auto-dismisses after 3 seconds
- Tile illustrations: emoji on soft colored background circle (e.g., hammer emoji for framing, ruler for measuring) — no SVG illustration assets needed
- Continue button uses dynamic label that updates with selection count:
  - 0 selected: "Pick at least 2" (disabled)
  - 1 selected: "Pick 1 more" (disabled)
  - 2 selected: "Continue →" (enabled)
  - 3 selected: "Continue →" (enabled)
- Tile selections persist in SessionContext (already wired from Phase 1)

### Screen 3 — Employer Map
- Use mapcn component library (MapLibre GL) instead of custom SVG illustration
- Map centered on Regina, SK at fixed zoom level
- No pan/zoom controls — pins are the only interactive elements (per MAP-04 requirement)
- Light minimal tile style: gray roads on white background, subtle water features, minimal labels — pins are the visual focus
- Free OpenStreetMap tiles
- Pin markers for 4-6 employer locations
- Company card appears as bottom sheet sliding up from bottom of map area when pin is tapped
- Bottom sheet shows: company name, description, employee count, optional quote
- Close via X button, tap outside, or Escape key (per MAP-03)
- Employer data remains structured as JSON in carpentry.json (per MAP-05)

### Screen 4 — Career Pathway Timeline
- Connected vertical timeline with line connecting circular step markers
- "You are here — Grade 7/8" step dot: filled Primary Blue with subtle pulse ring animation
- Future step dots: hollow/outlined circles
- Connecting line transitions from solid (near-term steps) to dashed (future steps) — communicates "your future is ahead"
- First step ("You are here") starts expanded by default to teach the interaction pattern
- Accordion behavior: only one step expanded at a time (per PATH-03)
- Expanded step content shows structured fields:
  - Description paragraph
  - Duration badge (e.g., "4 years")
  - Earnings range (e.g., "$18-28/hr")
  - Program name tags (e.g., SaskPolytech, SYIP)
- Steps reference Miller Collegiate, SaskPolytech, Saskatchewan Youth Internship Program (per PATH-04)

### Screen 6 — VR Prep
- Read-and-absorb content only, no required interactions (per PREP-04)
- Observation prompts displayed as visually distinct cards
- Claude's discretion on card visual style — should feel inviting, not like homework

### Post-VR Checklist
- 6-item checkable checklist with toggle state
- Progress count display ("2 of 6 complete")
- Prominent myBlueprint link opens in new tab
- Checklist state is session-only (per BRDG-03)

### Claude's Discretion
- Screen 6 VR prep card visual styling
- Post-VR checklist checkbox animation/style
- Exact pin marker design on map (color, size, shape)
- Spacing and padding details across all screens
- Screen transition timing within the existing slide animation system

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design & Visual Specs
- `DESIGN_SPECS.md` — Component specifications, color system, typography, spacing, animation inventory, responsive breakpoints
- `DESIGN_SPECS.md` §4.2 — Animation inventory (screen transitions, prefers-reduced-motion handling)
- `DESIGN_SPECS.md` §5.1 — Breakpoint-specific layout changes per screen

### Technical Architecture
- `TECH_SPECS.md` — Architecture, routing, session state, content schema
- `TECH_SPECS.md` §1 — Architecture overview, technology stack

### Product Requirements
- `PRD.md` — Product definition, success metrics, scope boundaries

### Map Component Library
- `https://mapcn.vercel.app/` — mapcn React map component library (MapLibre GL + shadcn/ui styling). Use for Screen 3 employer map.

### Codebase Structure
- `.planning/codebase/STRUCTURE.md` — Directory layout, file locations, naming conventions
- `.planning/codebase/CONVENTIONS.md` — Coding conventions, accessibility patterns, analytics naming

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `context/SessionContext.tsx`: SessionProvider with `selectedTiles`, `firstName`, `selectedIcon`, `generatedCardUrl` — Screen 2 tile selections wire directly into this
- `components/Navigation.tsx`: Back/Next navigation already built with disabled states
- `components/ProgressBar.tsx`: Segmented dot progress indicator already functional
- `content/config.ts`: Typed content export from carpentry.json — all screens already import via `content.screenX`
- `content/types.ts`: `OccupationContent` interface defines schema for all screen data

### Established Patterns
- All screen components import content via `import { content } from '@/content/config'`
- CSS variables for brand tokens: `--myb-navy`, `--myb-primary-blue`, `--myb-neutral-1` through `--myb-neutral-5`
- Mobile-first responsive with Tailwind `md:` breakpoints
- Screen components are default exports in `app/pre-vr/components/ScreenX.tsx`

### Integration Points
- Each ScreenX.tsx replaces the existing placeholder shell — same file, same export, same import in pre-vr/page.tsx
- Screen 2 must call `setSelectedTiles()` from `useSession()` to persist selections
- Post-VR page (`app/post-vr/page.tsx`) needs local `useState` for checklist toggle state
- mapcn components will be a new dependency (`npm install`) for Screen 3

</code_context>

<specifics>
## Specific Ideas

- Salary counter should feel like a slot machine or gas pump counter — mechanical, satisfying
- Stat cards in navy with white text for visual punch — data should feel impressive, not informational
- Task tiles with emoji illustrations keep it playful for Grade 7/8s without needing design assets
- "Pick 1 more" / "Pick at least 2" dynamic button label gives students clear guidance without a separate instruction panel
- Shake animation on 4th tile attempt is playful, not punitive — matches the gamified tone
- mapcn provides a real map feel without the complexity of Google Maps or Mapbox API keys
- Timeline's solid-to-dashed line treatment reinforces the "your journey" metaphor

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-screens*
*Context gathered: 2026-03-19*
