# Requirements: Career Explorer Micro-Site

**Defined:** 2026-03-19
**Core Value:** Students arrive at VR with real-world context and leave with a tangible, personal artifact and a clear path into myBlueprint.

## v1 Requirements

Requirements for pilot launch (week of April 6, 2026). Each maps to roadmap phases.

### Landing & Routing

- [x] **LAND-01**: Student can select Pre-VR or Post-VR path from two large, visually distinct tap targets on the landing page
- [x] **LAND-02**: Landing page loads and is fully interactive within 3 seconds on a school Chromebook
- [x] **LAND-03**: Post-VR bridge page is directly accessible via URL (/post-vr) for QR code entry
- [x] **LAND-04**: Landing page adapts to single-column layout on mobile with minimum 44x44px touch targets

### Pre-VR Flow

- [x] **FLOW-01**: Pre-VR experience is a single route (/pre-vr) with six screens managed by internal React state
- [x] **FLOW-02**: Student can navigate forward and backward through all six screens without losing session state
- [x] **FLOW-03**: Visual progress bar shows current position in the six-screen flow
- [x] **FLOW-04**: Screen transitions use smooth slide animations (respecting prefers-reduced-motion)

### Screen 1 — Hook

- [x] **HOOK-01**: Animated counter ticks up to average Saskatchewan carpenter salary with ease-out easing over 2 seconds
- [x] **HOOK-02**: Two to three additional headline stats displayed as visual data cards (job count, demand growth)
- [x] **HOOK-03**: All career data is Saskatchewan-specific and hardcoded as placeholder content
- [x] **HOOK-04**: Counter animation disabled when prefers-reduced-motion is active (shows final number immediately)

### Screen 2 — Task Tiles

- [ ] **TILE-01**: Six illustrated tiles displayed in a responsive grid (3x2 desktop, 2-column mobile)
- [x] **TILE-02**: Student can select between 2 and 3 tiles with clear visual selected state (highlight + checkmark)
- [x] **TILE-03**: Fourth selection is prevented with inline feedback message
- [x] **TILE-04**: Continue button is disabled until minimum 2 tiles are selected
- [x] **TILE-05**: Tile selections are persisted in session state and available on Screen 5 (Card Builder)

### Screen 3 — Employer Map

- [ ] **MAP-01**: Static SVG illustrated map of Regina area displayed with 4-6 employer pins
- [x] **MAP-02**: Tapping a pin opens a company card with name, description, employee count, and optional logo/quote
- [x] **MAP-03**: Company card closes when tapping outside it, tapping close button, or pressing Escape
- [ ] **MAP-04**: Map is not zoomable or pannable — pins are the only interactive elements
- [ ] **MAP-05**: Employer data is structured as JSON for easy future replacement

### Screen 4 — Career Pathway

- [x] **PATH-01**: Vertical timeline with 5 expandable steps starting at "You are here — Grade 7/8"
- [x] **PATH-02**: Tapping a step expands it with course names, duration, earnings, and programs (Saskatchewan-specific)
- [x] **PATH-03**: Only one step can be expanded at a time (accordion behavior)
- [ ] **PATH-04**: Pathway content references Miller Collegiate, SaskPolytech, and Saskatchewan Youth Internship Program

### Screen 5 — Card Builder

- [ ] **CARD-01**: First-name text input (1-30 characters, no empty/whitespace-only values accepted)
- [ ] **CARD-02**: Six icon options displayed in a grid — student selects exactly one
- [ ] **CARD-03**: Task selections from Screen 2 displayed as non-editable tag chips on the builder
- [ ] **CARD-04**: Live card preview updates in real time as student enters name, selects icon
- [ ] **CARD-05**: Card uses pre-generated background variant mapped to selections via deterministic hash
- [ ] **CARD-06**: Card renders at 1200x675px with name, icon, task labels, and career stats
- [ ] **CARD-07**: Download button saves card as PNG to device (filename: carpenter-card.png)
- [ ] **CARD-08**: Download button is disabled until name is entered and icon is selected
- [ ] **CARD-09**: Student's first name is never transmitted to any server — used only for client-side rendering

### Screen 6 — VR Prep

- [x] **PREP-01**: Brief description of the carpentry VR simulation displayed
- [ ] **PREP-02**: Two to three observation prompts displayed as visually distinct cards
- [ ] **PREP-03**: Student can navigate back to any previous screen with all state preserved
- [ ] **PREP-04**: No required interactions — read-and-absorb content only

### Post-VR Bridge

- [x] **BRDG-01**: Congratulatory message acknowledging VR simulation completion
- [x] **BRDG-02**: Six numbered checklist items displayed with checkable toggle state
- [ ] **BRDG-03**: Checklist state is local and session-only
- [x] **BRDG-04**: Progress indicator shows count of completed items (e.g., "2 of 6 complete")
- [x] **BRDG-05**: Prominent button linking to myBlueprint that opens in a new tab

### Analytics

- [ ] **ANLY-01**: GA4 page view events fire for each screen transition (screen_1 through screen_6, bridge)
- [ ] **ANLY-02**: Path selection tracked (pre_vr / post_vr)
- [ ] **ANLY-03**: Tile selections tracked (tile_id, select/deselect action)
- [ ] **ANLY-04**: Employer pin taps tracked (employer_id, employer_name)
- [ ] **ANLY-05**: Pathway step expansions tracked (step_id, step_label)
- [ ] **ANLY-06**: Card interactions tracked (icon_select, name_entered, card_download)
- [ ] **ANLY-07**: Checklist item checks tracked (item_id, item_label)
- [ ] **ANLY-08**: No PII sent to analytics — student name is never included in any event
- [ ] **ANLY-09**: Screen-to-screen funnel is configurable in GA4 dashboard

### Accessibility

- [ ] **A11Y-01**: All interactive elements are keyboard-focusable and operable via keyboard
- [ ] **A11Y-02**: All text meets WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI elements)
- [ ] **A11Y-03**: All touch targets are minimum 44x44px with adequate spacing
- [ ] **A11Y-04**: Screen reader support via semantic HTML, aria-pressed on tiles, aria-expanded on accordion, role="dialog" on employer cards
- [ ] **A11Y-05**: prefers-reduced-motion respected — animations replaced with instant state changes

### Performance & Infrastructure

- [ ] **PERF-01**: Landing page LCP under 3 seconds on school Chromebook (standard WiFi)
- [ ] **PERF-02**: Screen-to-screen transitions under 500ms perceived
- [ ] **PERF-03**: Card generation under 1 second (fallback path with pre-generated backgrounds)
- [ ] **PERF-04**: Total JS bundle under 150KB gzipped
- [x] **PERF-05**: Deployed on Vercel with static generation (SSG)
- [ ] **PERF-06**: Responsive at 320px (mobile), 768px (tablet), 1024px+ (Chromebook/laptop)

### Content Architecture

- [x] **CONT-01**: All screen content stored in a single JSON file per occupation (carpentry.json)
- [x] **CONT-02**: TypeScript interfaces define the content schema
- [x] **CONT-03**: Adding a new occupation requires only a new JSON file — no code changes
- [x] **CONT-04**: Placeholder content populated for all screens (salary, tasks, employers, pathway, checklist)

## v2 Requirements

Deferred to post-pilot validation.

### Expanded Content

- **EXPD-01**: Additional occupation content files (electrician, welder, HVAC, medical lab tech)
- **EXPD-02**: Sourced real employer data and verified salary figures for Saskatchewan
- **EXPD-03**: Museo Sans font integration when brand team provides web font files

### Enhanced Card Generation

- **ENHC-01**: NanoBanana Pro 2 API integration for dynamic AI-generated card backgrounds
- **ENHC-02**: Card sharing via generated URL or QR code (no backend needed)

### Platform

- **PLAT-01**: Multi-language support (French immersion)
- **PLAT-02**: Educator-facing aggregate analytics dashboard (no PII)
- **PLAT-03**: Deeper myBlueprint API integration for direct portfolio actions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Student login or authentication | Fully anonymous by design; PII concerns with minors; FOIP/PIPEDA implications |
| Persistent data storage or user accounts | Single-session stateless architecture; myBlueprint handles the portfolio |
| Changes to myBlueprint platform | Students use existing myBlueprint functionality via link |
| VR simulation or headset-side experience | Owned by Melcher/VR Hub |
| Leaderboards or competitive gamification | Research shows it alienates lower-performing students; antithetical to exploration |
| Video content or embedded media | Destroys load time on school Chromebooks; bandwidth-heavy |
| Google Maps or third-party mapping SDK | API costs, loading overhead, accessibility issues on older devices |
| CMS or admin interface | Content is hardcoded JSON for pilot; CMS is a future consideration |
| Real-time multiplayer or social features | Too complex for pilot; moderation concerns with minors |
| Complex parallax or heavy animations | Performance nightmare on school Chromebooks |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAND-01 | Phase 1 | Complete |
| LAND-02 | Phase 1 | Complete |
| LAND-03 | Phase 1 | Complete |
| LAND-04 | Phase 1 | Complete |
| FLOW-01 | Phase 1 | Complete |
| FLOW-02 | Phase 1 | Complete |
| FLOW-03 | Phase 1 | Complete |
| FLOW-04 | Phase 1 | Complete |
| HOOK-01 | Phase 2 | Complete |
| HOOK-02 | Phase 2 | Complete |
| HOOK-03 | Phase 2 | Complete |
| HOOK-04 | Phase 2 | Complete |
| TILE-01 | Phase 2 | Pending |
| TILE-02 | Phase 2 | Complete |
| TILE-03 | Phase 2 | Complete |
| TILE-04 | Phase 2 | Complete |
| TILE-05 | Phase 2 | Complete |
| MAP-01 | Phase 2 | Pending |
| MAP-02 | Phase 2 | Complete |
| MAP-03 | Phase 2 | Complete |
| MAP-04 | Phase 2 | Pending |
| MAP-05 | Phase 2 | Pending |
| PATH-01 | Phase 2 | Complete |
| PATH-02 | Phase 2 | Complete |
| PATH-03 | Phase 2 | Complete |
| PATH-04 | Phase 2 | Pending |
| CARD-01 | Phase 3 | Pending |
| CARD-02 | Phase 3 | Pending |
| CARD-03 | Phase 3 | Pending |
| CARD-04 | Phase 3 | Pending |
| CARD-05 | Phase 3 | Pending |
| CARD-06 | Phase 3 | Pending |
| CARD-07 | Phase 3 | Pending |
| CARD-08 | Phase 3 | Pending |
| CARD-09 | Phase 3 | Pending |
| PREP-01 | Phase 2 | Complete |
| PREP-02 | Phase 2 | Pending |
| PREP-03 | Phase 2 | Pending |
| PREP-04 | Phase 2 | Pending |
| BRDG-01 | Phase 2 | Complete |
| BRDG-02 | Phase 2 | Complete |
| BRDG-03 | Phase 2 | Pending |
| BRDG-04 | Phase 2 | Complete |
| BRDG-05 | Phase 2 | Complete |
| ANLY-01 | Phase 4 | Pending |
| ANLY-02 | Phase 4 | Pending |
| ANLY-03 | Phase 4 | Pending |
| ANLY-04 | Phase 4 | Pending |
| ANLY-05 | Phase 4 | Pending |
| ANLY-06 | Phase 4 | Pending |
| ANLY-07 | Phase 4 | Pending |
| ANLY-08 | Phase 4 | Pending |
| ANLY-09 | Phase 4 | Pending |
| A11Y-01 | Phase 4 | Pending |
| A11Y-02 | Phase 4 | Pending |
| A11Y-03 | Phase 4 | Pending |
| A11Y-04 | Phase 4 | Pending |
| A11Y-05 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| PERF-03 | Phase 3 | Pending |
| PERF-04 | Phase 4 | Pending |
| PERF-05 | Phase 1 | Complete |
| PERF-06 | Phase 4 | Pending |
| CONT-01 | Phase 1 | Complete |
| CONT-02 | Phase 1 | Complete |
| CONT-03 | Phase 1 | Complete |
| CONT-04 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 58
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after roadmap creation*
