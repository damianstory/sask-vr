# Codebase Concerns

**Analysis Date:** 2026-03-19

**Project Stage:** Specification phase (pre-implementation)

---

## Critical Blockers

### Domain / Subdomain Decision
**Issue:** Domain ownership and URL structure not finalized before QR codes must be printed and VR simulation configured.

**Files:** N/A (configuration)

**Impact:**
- QR codes printed with wrong domain become useless
- VR simulation must be reconfigured if domain changes post-launch
- Brand trust implications if subdomain strategy not aligned with myBlueprint infrastructure

**Status:** OPEN DECISION — awaiting stakeholder decision

**Fix approach:**
1. Make domain decision immediately (prefer myBlueprint subdomain for brand trust)
2. Confirm with Melcher/VR Hub team that QR code URLs will remain stable
3. Set up DNS before any QR codes are generated or printed

**Priority:** CRITICAL — must resolve before any public-facing URLs are created

---

## Known Risks & Technical Debt

### NanoBanana API Integration Coupling
**Issue:** Critical image generation flow depends entirely on third-party API (NanoBanana Pro 2) with no guaranteed SLA or documented behavior on school networks.

**Files:**
- `app/api/generate-card/route.ts` (to be created)
- `lib/image-gen.ts` (to be created)

**Impact:**
- If API is unavailable or slow, student card generation fails
- No fallback testing plan documented for API downtime
- Timeout strategy (8 seconds) is guessed, not validated
- School network bandwidth constraints may cause unpredictable latency

**Current mitigation:**
- Dual-path approach with pre-generated fallback backgrounds documented in spec
- 8-second timeout with fallback to deterministic hash-based variant selection

**Gaps:**
- API availability/SLA not documented
- No circuit breaker pattern described
- No monitoring/alerting strategy for API failures
- NanoBanana Pro 2 API documentation not referenced (may not exist or may have changed)

**Fix approach:**
1. Before implementation, validate NanoBanana Pro 2 API availability and latency on typical school WiFi (~25 Mbps, high contention)
2. Implement circuit breaker: if API fails 3x in a row, switch to fallback-only mode
3. Add server-side logging to track API success/failure rates
4. Generate 12–15 pre-generated fallback variants to ensure variety
5. Document API availability guarantee or cost considerations

**Priority:** HIGH — blocks Card Builder feature

---

### Canvas API Download Behavior on ChromeOS
**Issue:** File download mechanism untested on actual ChromeOS devices; spec notes different behavior but no validation plan.

**Files:**
- `components/DownloadButton.tsx` (to be created)

**Impact:**
- Download may fail silently on ChromeOS
- Students may not receive their card file despite UI suggesting success
- No user feedback mechanism if download fails
- Analytics event fires even if download fails

**Current spec guidance:** "Test specifically on ChromeOS — file download behaviour differs from desktop Chrome. The `download` attribute triggers save-to-Downloads on ChromeOS without additional prompts."

**Gaps:**
- No automated test plan for ChromeOS
- No error handling or fallback if download fails
- No user-facing feedback (toast/modal) if download completes or fails
- Browser compatibility matrix not defined

**Fix approach:**
1. Set up ChromeOS device testing as P0 before launch
2. Add error handling to download function with user feedback
3. Implement fallback: if download fails, offer "copy to clipboard" or "email me the file" options
4. Track download success/failure in analytics (separate events)
5. Add unit/integration test for download mechanism

**Priority:** HIGH — core deliverable for students

---

### SVG Map Interactivity & Scaling
**Issue:** "Illustrative, not geographic" SVG map for employer pins may have touch target and responsiveness issues across screen sizes.

**Files:**
- `components/EmployerCard.tsx` (to be created)
- `public/map/` (SVG asset location)

**Impact:**
- Pins may be too small to tap on mobile (< 44×44px)
- Map may not scale cleanly across 5 breakpoints (360px to 1920px+)
- Accessibility of overlapping pins undefined
- SVG rendering performance on older Chromebooks unknown

**Current spec gaps:**
- No SVG asset provided (blocking implementation)
- Pin hit detection not described (click region size)
- Overlap strategy for pins not defined
- Map coordinate system (percentage-based per spec) may not scale cleanly to all viewport sizes

**Fix approach:**
1. Create SVG map as separate blocking task with accessibility review
2. Implement pin hit regions as min 44×44px hitboxes, not just SVG circle radius
3. Define overlap behavior: if 2+ pins overlap, show "multiple employers here" indicator with expandable list
4. Test SVG rendering performance on Chromebook (may need raster cache if too many elements)
5. Validate pin tap targets and map responsiveness on all breakpoints during QA

**Priority:** HIGH — Screen 3 core interaction

---

### Tile Selection State Persistence Across Navigations
**Issue:** Spec requires tile selections (Screen 2) to persist through backward/forward navigation and appear in Card Builder (Screen 5), but state management strategy not documented in tech spec.

**Files:**
- `app/pre-vr/page.tsx` (main flow container, to be created)
- `app/pre-vr/components/ScreenTwo.tsx` (to be created)
- `app/pre-vr/components/ScreenFive.tsx` (to be created)

**Impact:**
- If state is lost, students must re-select tiles after navigating back
- Card may be generated with wrong or missing tile labels
- No clear guidance on state reset triggers (page refresh, tab close, timeout)
- Session state structure not formally defined in code

**Current spec approach:**
- React Context + useState
- No persistence to localStorage, sessionStorage, or cookies
- State resets on page refresh

**Gaps:**
- No formal session state TypeScript interface defined
- No state initialization or validation logic documented
- No timeout strategy (state expires after 30min of inactivity? or not at all?)
- Card generation depends on tile state but may be async — no race condition handling documented

**Fix approach:**
1. Define formal `SessionState` TypeScript interface with all required fields and validation
2. Implement SessionContext with state initialization and reset logic
3. Add state validation before card generation (ensure tiles are selected, name is non-empty, etc.)
4. Decide on state expiry: keep in-memory only, or add timeout?
5. Test state persistence across all navigation patterns (back button, direct screen jump, refresh)

**Priority:** MEDIUM — non-trivial state management

---

### Analytics Privacy & Compliance
**Issue:** GA4 integration assumes NEXT_PUBLIC_GA_MEASUREMENT_ID is available, but privacy concerns around student data collection not fully documented.

**Files:**
- `app/layout.tsx` (GA4 script injection, to be created)
- `lib/analytics.ts` (analytics wrapper, to be created)

**Impact:**
- Missing `firstName` in analytics is intentional, but other implicit data (device, location, browser) will be collected
- No opt-out mechanism for students/educators
- Compliance with school privacy policies (PIPEDA, COPPA, FERPA) not validated
- GA4 cookie consent not addressed

**Current spec guidance:**
- `firstName` is never transmitted or logged
- Only anonymous interaction events collected
- No user IDs or cookies beyond GA defaults

**Gaps:**
- No cookie banner or consent mechanism described
- No privacy policy or terms drafted
- Scope of GA4 implicit data collection not acknowledged
- No erasure/data deletion mechanism if needed
- School IT may block GA4 domain (common in school networks)

**Fix approach:**
1. Before launch, validate with school/board privacy officer that GA4 collection is acceptable
2. Confirm GA4 domain is not blocked by school network (test on actual Chromebook)
3. If GA4 blocked, implement fallback analytics or event logging to custom endpoint
4. Add privacy policy section explaining what data is collected and why
5. Document that `firstName` is NOT transmitted (key privacy guarantee for students)
6. Consider adding CMS/admin interface to enable/disable analytics per deployment

**Priority:** MEDIUM — legal/compliance risk

---

## Fragile Areas & Scaling Limits

### Canvas API Image Generation Performance
**Issue:** Canvas compositing of background image + overlays (name text, icon SVG, tile labels, stats) untested; may be slow on older Chromebooks or with large images.

**Files:**
- `lib/card-generator.ts` (to be created)
- `components/CardPreview.tsx` (to be created)

**Why fragile:**
- Canvas performance varies by device GPU capability
- Large pre-generated backgrounds (up to 200 KB per spec) may cause memory pressure
- Real-time preview during Screen 5 input could cause jank if re-rendering on every keystroke

**Current spec targets:**
- Card generation (API): < 5s total
- Card generation (fallback): < 1s
- Total JS bundle: < 150 KB gzipped

**Gaps:**
- No performance profiling baseline
- No canvas optimization strategies (texture atlas, offscreen rendering) documented
- Real-time preview behavior during typing not defined (debounce? throttle? full re-render each keystroke?)
- Memory footprint of canvas + background image on older devices unknown

**Fix approach:**
1. Implement card generation as worker or off-main-thread to avoid UI jank
2. Debounce preview updates during text input (update every 500ms, not every keystroke)
3. Profile canvas rendering on actual Chromebook; target < 500ms for complete card compositing
4. Implement lazy loading of background images to prevent memory overflow
5. Add performance marks (paint, compositing time) to analytics for monitoring

**Priority:** MEDIUM — affects user experience

---

### Content Templatization Seam
**Issue:** Content schema defined in `content/types.ts` but no validation, no CMS, no tooling to add new occupations.

**Files:**
- `content/types.ts` (schema definition)
- `content/carpentry.json` (sample data)

**Why fragile:**
- Content sourcing incomplete (blocking items noted in PRD Open Questions)
- Future occupation additions require code review/deployment
- No validation that new occupation JSON matches schema
- No content staging/preview environment
- Content changes require developer involvement

**Current spec approach:**
- Hardcoded JSON per occupation
- Same schema for all occupations (templatized)
- No CMS for MVP

**Gaps:**
- Content sourcing status for carpentry is unknown (salary data, employer data, pathway info, etc.)
- No way to validate content before deployment
- No staging/preview URL for stakeholder approval
- Future occupations require full development cycle (schema extension, new JSON, testing)

**Fix approach:**
1. Immediately confirm all content sourcing status for carpentry (what's ready, what's pending, what's blocked)
2. Set up simple JSON schema validation (using Zod or similar) to catch structure errors at build time
3. Create staging/preview route (`/preview?occupation=welding`) for content stakeholders to review before production deployment
4. Document content contribution workflow for future occupations
5. Plan post-MVP CMS if > 5 occupations planned

**Priority:** MEDIUM — unblocks future expansion

---

### Accessibility Testing Gaps
**Issue:** Spec requires WCAG AA compliance but testing plan is largely manual; no automated CI/CD checks.

**Files:**
- All components (untested)

**Why fragile:**
- Manual testing (ChromeVox, VoiceOver, keyboard navigation) is not scalable and can be inconsistent
- Automated axe-core checks will catch obvious violations but miss semantic issues
- 200% zoom test on Chromebook may reveal overflow/layout issues that aren't caught otherwise
- Focus order and tab navigation may be incorrect even if elements are individually accessible

**Spec testing plan:**
1. Automated axe-core via browser extension
2. Screen reader (ChromeVox primary, VoiceOver secondary)
3. Keyboard navigation (full Pre-VR flow)
4. Zoom at 200% on Chromebook

**Gaps:**
- No CI/CD integration for automated accessibility checks
- No documented acceptance criteria for axe-core audit (0 violations? exceptions allowed?)
- No timeline for accessibility testing (when in dev cycle?)
- No backup plan if accessibility issues discovered late in development

**Fix approach:**
1. Add `@axe-core/react` to automated tests in CI/CD pipeline
2. Configure axe with project-specific rules (known exemptions, custom checks)
3. Set WCAG AA as minimum requirement; AAA for large text
4. Schedule accessibility testing early (during component development, not at end)
5. Assign accessibility champion to own testing and auditing

**Priority:** MEDIUM — legal/compliance, impacts students with disabilities

---

### Mobile Touch Target Consistency
**Issue:** Spec requires 44×44px minimum touch targets, but inconsistent implementation may result in targets too small on some screens.

**Files:**
- All interactive components (buttons, tiles, pins, accordion items, inputs)

**Why fragile:**
- Responsive design with 5+ breakpoints creates many edge cases
- Tiles on mobile (< 640px) must be stacked 1-wide but may be < 44px wide
- Employer pins on map may scale incorrectly
- Zoom/scale CSS transforms may affect actual touch target size

**Current spec guidance:**
- < 640px: single column; tiles stack 1-wide
- 640px–1023px: two-column tile grid
- ≥ 1024px: full 2×3 grid

**Gaps:**
- No guidance on tile dimensions at each breakpoint
- No testing plan for actual touch target sizes
- No fallback if 44×44px minimum cannot be met at all breakpoints
- SVG interactive elements (map pins) may not have proper hit regions

**Fix approach:**
1. Define exact tile dimensions at each breakpoint; ensure min 44×44px
2. For map pins, implement invisible 44×44px hitbox over each pin (SVG `<circle>` with pointer-events)
3. Test with Chrome DevTools device emulation and actual Chromebook
4. Add visual debug mode to show touch target boundaries during development
5. Include touch target verification in QA checklist

**Priority:** MEDIUM — affects usability on mobile/tablet

---

## Missing Critical Features / Incomplete Specs

### User Feedback on Card Generation Status
**Issue:** While card is being generated (via API or fallback), no loading state or user feedback mechanism is defined.

**Files:**
- `components/CardPreview.tsx` (to be created)
- `app/api/generate-card/route.ts` (to be created)

**Problem:**
- User sees blank preview until generation completes (may feel frozen)
- API timeout (8s) may be too long for user patience
- No distinction between "generating", "failed", or "success" states
- UX is silent/ambiguous

**Gaps:**
- No loading skeleton or progress indicator
- No error state UI (if generation fails)
- No retry mechanism
- Unclear if preview can be edited while generation in progress

**Fix approach:**
1. Implement loading state with spinner/skeleton during generation (show "Creating your card...")
2. Add timeout indicator if generation takes > 3s ("Almost ready...")
3. Show error state with retry button if generation fails
4. Disable form inputs during generation to prevent conflicting state
5. Update preview incrementally if possible (show background first, then overlays)

**Priority:** MEDIUM — improves perceived performance

---

### QR Code URL Deep Linking & Browser History
**Issue:** Post-VR QR code links directly to `/post-vr`, but if student navigates backward in browser history from `/post-vr`, they may see broken state or invalid transitions.

**Files:**
- `app/post-vr/page.tsx` (to be created)

**Problem:**
- `/post-vr` page should render independently without prior session state, but spec doesn't clarify what happens if accessed directly
- Student may arrive at bridge page without prior VR experience (wrong path)
- Browser back button from `/post-vr` → `/` landing page, which is correct, but middle path unclear

**Gaps:**
- No browser history management strategy documented
- No distinction between "direct access to `/post-vr`" (normal) vs. "back button from `/pre-vr`" (unusual)
- Bridge page checklist may reference tile selections that don't exist if accessed directly

**Fix approach:**
1. Ensure `/post-vr` is fully standalone (no assumptions about prior session state)
2. Clarify that bridge page checklist is generic, not personalized with tile selections
3. Test browser back/forward navigation across all routes
4. Consider replacing browser back button with explicit "Back" button if needed
5. Use `window.history` carefully to avoid trapping users

**Priority:** LOW — edge case but good to handle

---

### Content Schema Blocking Items
**Issue:** PRD notes "blocking content items" (items 1–3 in Open Questions) that must be resolved before implementation.

**Files:**
- `content/carpentry.json` (blocked)

**Impact:**
- Cannot validate content structure without real data
- Cannot build preview/test without real salary, employer, pathway, and stats data
- Design review and QA cannot proceed
- Launch timeline at risk if content sourcing delayed

**Blocking items (from TECH_SPECS.md section 3.2):**
> "The `content/carpentry.json` file will be populated once content sourcing is complete. The blocking content items are documented in the PRD Open Questions (items 1–3)."

**Current status:** Unknown (not detailed in provided specs)

**Fix approach:**
1. Immediately audit PRD for explicit blocking items 1–3
2. Assign owner to each blocked item with clear deadline
3. Weekly sync on content sourcing progress
4. Create mock/placeholder content structure now so development can proceed; replace with real data later
5. Set hard cutoff: if content not sourced by [DATE], proceed with placeholder content and publish with "This data is from [SOURCE], last updated [DATE]" disclaimer

**Priority:** CRITICAL — unblocks all implementation

---

### Rate Limiting / API Abuse Prevention
**Issue:** `/api/generate-card` endpoint has no rate limiting; potential for abuse if URL is discovered or shared.

**Files:**
- `app/api/generate-card/route.ts` (to be created)

**Impact:**
- Malicious users or bots could spam API calls, incurring NanoBanana charges
- No quota per student/IP
- No authentication or request signing

**Current spec guidance:**
> "Consider rate limiting the API route (Vercel edge middleware or simple in-memory counter) to prevent abuse — low priority for pilot but good hygiene"

**Gaps:**
- No concrete rate limiting strategy
- No way to identify legitimate requests from abuse
- No monitoring/alerting for abuse attempts

**Fix approach:**
1. Implement simple IP-based rate limiting: max 10 requests per IP per hour
2. Or implement time-window rate limiting: 1 request per 30 seconds per session
3. Log rate limit rejections and monitor for patterns
4. Consider adding a simple token/code embedded in the form to validate requests (not foolproof but raises the bar)
5. Plan to increase limits if legitimate use is throttled

**Priority:** LOW — good to have, not P0

---

## Test Coverage Gaps

### Unit Test Gaps for Card Generator
**What's not tested:** Canvas API compositing, image blending, text rendering, icon overlay logic.

**Files:**
- `lib/card-generator.ts` (to be created)

**Risk:**
- Text may overlap images or bleed off canvas
- Icon SVG may not render (404, invalid format)
- Color/contrast issues not caught until visual QA
- Fallback variant deterministic hash logic may have collisions

**Fix approach:**
1. Unit tests for card generator function: verify output dimensions, expected data URL format
2. Visual regression tests: snapshot canvases with known input, compare pixel output
3. SVG icon loading tests: mock SVG assets and verify they load/render
4. Deterministic hash function tests: verify same inputs always produce same fallback variant

**Priority:** MEDIUM — core feature

---

### Integration Test Gaps for Full Pre-VR Flow
**What's not tested:** Complete end-to-end flow from landing → Screen 1 → ... → Screen 6 → Card Download.

**Files:**
- All Pre-VR components and routes

**Risk:**
- State loss during navigation
- Card generation fails silently
- Analytics events don't fire
- Mobile layout breaks

**Spec testing plan (from TECH_SPECS.md 12.2):**
1. Complete Pre-VR flow on Chromebook at 1366×768
2. Complete Pre-VR flow on mobile (375px wide)
3. Card generation fails (API timeout) → fallback triggers
4. Backward navigation → tile selections preserved
5. Bridge page from direct URL → renders without prior state
6. All analytics events fire

**Gaps:**
- Playwright tests not yet written
- Device testing is manual only (no CI/CD coverage)
- No performance profiling

**Fix approach:**
1. Write Playwright tests for critical test cases (above 6 scenarios)
2. Run Playwright in CI/CD on every PR
3. Add performance profiling: measure LCP, Screen-to-screen time, card gen time
4. Set performance budgets in CI (fail if LCP > 3s, bundle > 150KB gzipped)
5. Schedule manual device testing on actual Chromebook bi-weekly

**Priority:** HIGH — prevents regressions

---

## Dependencies at Risk

### NanoBanana Pro 2 API Documentation & Maintenance
**Risk:** Third-party API not referenced in spec; no SLA, no documentation, no known support channel.

**Impact:**
- If API shuts down or changes, card generation breaks entirely
- No visibility into API maintenance windows
- No communication channel for issues

**Fix approach:**
1. Before implementation, review NanoBanana Pro 2 API documentation
2. Confirm pricing, SLA, rate limits, and support channels
3. Evaluate alternative image generation services (Replicate, Hugging Face, etc.) as fallback
4. Plan for API deprecation: if NanoBanana dies, can we switch to another service without code changes?

**Priority:** MEDIUM — mitigates vendor lock-in

---

### Google Fonts & Open Sans Availability
**Risk:** Open Sans (fallback) loaded from Google Fonts; if Google Fonts blocked by school network, text has no font stack fallback.

**Files:**
- `app/layout.tsx` (font loading, to be created)

**Impact:**
- Text may fall back to system sans-serif (poor brand consistency)
- Text loading may be slow on poor networks
- Font swap vs. block decision not documented

**Current spec guidance:**
> "Load Open Sans via Google Fonts with `display=swap` to avoid invisible text. Museo Sans loaded via `@font-face` if self-hosted; if unavailable, Open Sans is the fallback and is visually acceptable."

**Gaps:**
- Museo Sans font files not confirmed as available
- No plan for Google Fonts being blocked by school network
- No fallback if Google Fonts CDN is down

**Fix approach:**
1. Before implementation, confirm Museo Sans font files with brand team
2. Self-host fonts (WOFF2) instead of relying on Google Fonts
3. Use `font-display: swap` for faster font loading and better perceived performance
4. Test on actual school Chromebook to confirm fonts load

**Priority:** LOW — affects brand appearance but not functionality

---

## Environmental / Deployment Concerns

### Domain Decision Timing
**Issue:** (Already covered in Critical Blockers section)

### Missing Base URL / Deployment Configuration
**Files:** `next.config.ts` (to be created)

**Risk:**
- API routes require `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NANOBANANA_API_KEY` environment variables
- If these are not set, card generation silently fails
- No .env.example or validation of required vars at startup

**Fix approach:**
1. Add `startupValidation` check in `next.config.ts` or `app/layout.tsx` to verify required env vars exist
2. Create `.env.example` documenting all required vars and their format
3. Log clear error message at startup if vars are missing

**Priority:** LOW — standard practice

---

## Performance & Scale Concerns

### Bundle Size Risk
**Spec target:** < 150 KB gzipped

**Files:** All (TBD)

**Risk:**
- Next.js + React + Tailwind + shadcn-ui base components may already consume significant bundle
- Canvas API card generation may require additional libraries
- SVG map may embed large illustrations
- No tree-shaking or code-splitting plan documented

**Current spec guidance:**
> "Minimize dependencies. Code Splitting: The Pre-VR flow and Post-VR bridge are separate routes and will be code-split automatically by Next.js."

**Fix approach:**
1. Run `npm bundle-analyzer` early and often to track bundle size
2. Set hard limit in CI/CD: fail builds if gzipped bundle > 150 KB
3. Avoid animation libraries; use CSS `@keyframes` only
4. Lazy-load SVG map on Screen 3
5. Monitor actual bundle size as development progresses; may need to revise target

**Priority:** MEDIUM — affects initial load on slow networks

---

## Summary of Open Decisions

| # | Decision | Status | Deadline | Owner |
|---|----------|--------|----------|-------|
| 1 | Domain (subdomain vs. standalone) | OPEN | Before QR codes printed | TBD |
| 2 | Museo Sans availability (self-host vs. Open Sans only) | OPEN | Before design handoff | Brand team |
| 3 | Card output dimensions (1200×675 vs. portrait vs. square) | OPEN | Before Screen 5 implementation | Design team |
| 4 | Content sourcing for carpentry (salary, employers, pathways, stats) | OPEN | Before content.json created | Content owner |

---

*Concerns audit: 2026-03-19*
