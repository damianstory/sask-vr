# Phase 1: Foundation + Shell - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffold (Next.js App Router on Vercel), content architecture (carpentry.json + TypeScript interfaces), session state (React Context), routing (landing page, /pre-vr with 6 internal screens, /post-vr), progress indicator, screen transition animations, and placeholder screen skeletons. All six Pre-VR screens and the Post-VR page exist as layout shells — real content and interactivity come in Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Progress Indicator
- Segmented dots style — six dots in a row, filled for completed/current, hollow for upcoming
- Primary Blue filled dots, Neutral-3 hollow dots
- Current dot has a subtle pulse animation (scale 1.0–1.2 on 2s loop), respecting prefers-reduced-motion
- Include text label below dots: "3 of 6" format
- Positioned top center of the screen content area

### Landing Page Copy & Tone
- First-person casual tone for path card headings: "I'm about to do VR" / "I just finished VR"
- myBlueprint logo at top + occupation title heading ("Carpentry Career Explorer") above the two path cards
- Subtext on cards is hardcoded (not from JSON) for Phase 1
- Pre-VR card subtext: "Learn what carpentry in Saskatchewan is really like."
- Post-VR card subtext: Claude's discretion, matching the same casual tone
- Copywriting skills (direct response copy, hook creator, positioning angles) are available and should be leveraged for any copy refinement

### Placeholder Screen Depth
- Layout shells with real structure — correct layout grids, section containers, and placeholder shapes matching DESIGN_SPECS
- Placeholder screens pull structure (number of tiles, steps, pins, etc.) from carpentry.json — data-driven from the start
- Static gray boxes for placeholders (Neutral-1 background, Neutral-2 borders) — not shimmer/skeleton loading effects
- Back/Next navigation fully functional including slide transitions, disabled states, and progress dot updates

### Content Schema Structure
- carpentry.json organized by screen: top-level keys map to screen1, screen2, screen3, screen4, screen5, screen6, postVr
- All copy text included in JSON: headings, subtext, instructions, button labels — not just data values
- Include a top-level "meta" or "landing" section with occupation title, display name, and landing page metadata (even though landing copy is hardcoded for Phase 1)
- Use obvious dummy data for Phase 1: "Task 1", "Company A", salary = 99999 — makes it clear what needs replacing
- TypeScript interface (OccupationContent) defines and enforces the schema shape

### Claude's Discretion
- Post-VR card subtext wording (matching casual tone)
- Exact slide transition easing and duration (DESIGN_SPECS says 400ms ease-out)
- Session state shape and React Context structure
- TypeScript interface field naming conventions
- ESLint/Prettier configuration details
- Tailwind config token setup
- File/folder naming within the prescribed structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design & Visual Specs
- `DESIGN_SPECS.md` — Complete component specifications, color system, typography scale, spacing grid, animation inventory, responsive breakpoints, interaction states, and empty/loading/error states
- `DESIGN_SPECS.md` §3.1 — Landing page path selection component spec (card dimensions, hover states, accessibility)
- `DESIGN_SPECS.md` §4.2 — Animation inventory (screen transitions: slide-left/right, 400ms ease-out)
- `DESIGN_SPECS.md` §5.1 — Breakpoint-specific layout changes per screen

### Technical Architecture
- `TECH_SPECS.md` — Full technical specification including architecture, routing, session state, content schema, analytics event taxonomy, and card generation
- `TECH_SPECS.md` §1 — Architecture overview, technology stack, system diagram

### Product Requirements
- `PRD.md` — Product definition, success metrics, user persona, scope boundaries

### Codebase Structure
- `.planning/codebase/STRUCTURE.md` — Prescribed directory layout, file locations, naming conventions
- `.planning/codebase/CONVENTIONS.md` — Coding conventions, import organization, error handling, accessibility patterns
- `.planning/codebase/STACK.md` — Technology stack details, dependencies, configuration

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — this is a greenfield project. Phase 1 creates the entire scaffold.

### Established Patterns
- Prescribed patterns from TECH_SPECS/CONVENTIONS: PascalCase components, kebab-case utilities, @/ path alias, strict TypeScript, Prettier with single quotes, no semicolons
- Next.js App Router conventions: app/ directory routing, page.tsx entry points, layout.tsx for root

### Integration Points
- carpentry.json consumed by all screen components via import or dynamic loading
- SessionContext.tsx provides session state to all Pre-VR screens
- Progress indicator component consumed by the Pre-VR page wrapper
- Navigation component shared across all Pre-VR screens

</code_context>

<specifics>
## Specific Ideas

- Landing page subtext uses Saskatchewan-specific framing: "Learn what carpentry in Saskatchewan is really like."
- Dummy data should be obviously fake (Task 1, Company A, 99999) so nothing gets mistaken for real content
- Copywriting skills are available for copy refinement — direct response copy, hook creator, positioning angles
- The site should feel like a game, not a worksheet (per DESIGN_SPECS design principles)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-shell*
*Context gathered: 2026-03-19*
