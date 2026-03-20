# Phase 4: Analytics + Polish - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Instrument the complete micro-site with GA4 analytics across all screen transitions and user interactions, verify WCAG AA accessibility compliance, validate performance budgets on school Chromebook conditions, and prepare for Vercel deployment. No new features or screen changes — this is a verification and instrumentation pass over the existing flow.

</domain>

<decisions>
## Implementation Decisions

### GA4 Event Tracking
- Load gtag.js via next/script in root layout immediately — no consent banner needed (managed school Chromebooks, educational tool, no PII)
- Centralized analytics module: `lib/analytics.ts` with typed helper functions (`trackScreenView`, `trackTileSelect`, `trackEmployerTap`, etc.) — components call helpers, not `window.gtag()` directly
- Development debug mode: console.log all analytics events in dev instead of sending to GA4, so events can be verified without polluting production data
- GA4 measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var — gracefully no-op if missing
- Event names follow existing snake_case convention from CONVENTIONS.md: `path_select`, `screen_view`, `tile_select`, `employer_tap`, `pathway_expand`, `icon_select`, `name_entered`, `card_download`, `checklist_check`
- Zero PII: `name_entered` event signals completion only, never includes the name value

### Accessibility Remediation
- Focus management: on each Pre-VR screen transition, move focus to the screen's heading so screen readers announce new content
- Skip-to-content link: hidden until focused, standard WCAG pattern — lets keyboard users skip progress bar and nav
- Employer card popup (Screen 3): full focus trap when open — Tab cycles within card (close button, content), Escape closes, focus returns to the pin that opened it
- Audit method: automated (axe-core or Lighthouse a11y audit) + manual checklist (keyboard navigation flow, screen reader announcements, contrast verification on each screen)
- Existing aria attributes to verify/augment: `aria-pressed` on tiles, `aria-expanded` on accordion, `role="dialog"` on employer cards
- `prefers-reduced-motion` already respected — verify it works correctly across all animations

### Performance Validation
- Add `@next/bundle-analyzer` for visual bundle treemap — run with `ANALYZE=true npm run build` as one-time check before deploy
- LCP measurement via Lighthouse with 4x CPU throttling to simulate Chromebook performance — no physical device access needed
- No specific performance concerns identified during development — verify budgets (<150KB JS gzipped, <3s LCP, <500ms transitions) and fix anything that fails
- maplibre-gl already code-split with React.lazy — verify this keeps it out of initial bundle

### Deployment & Testing
- Vercel project needs to be created and connected to Git repo
- Use Vercel default `.vercel.app` domain for pilot — custom domain can be added later
- Pre-launch testing: run vitest suite + Lighthouse audit + manual walkthrough of full Pre-VR to Post-VR flow
- Responsive verification at three breakpoints: 320px (mobile), 768px (tablet), 1366x768 (Chromebook)
- Environment variables to configure in Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Claude's Discretion
- Exact axe-core integration approach (vitest plugin vs standalone script)
- Focus trap implementation details (custom hook vs library)
- Bundle optimization strategies if budget is exceeded
- Lighthouse CI configuration details
- Vercel build settings and static export configuration

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Analytics
- `.planning/codebase/CONVENTIONS.md` — Analytics naming convention (snake_case events, privacy rules, event parameter patterns)
- `.planning/codebase/STACK.md` — GA4 integration approach (gtag.js, env vars, Script component)
- `.planning/REQUIREMENTS.md` — ANLY-01 through ANLY-09 define exact events to track

### Accessibility
- `.planning/REQUIREMENTS.md` — A11Y-01 through A11Y-05 define WCAG AA requirements
- `.planning/codebase/CONVENTIONS.md` — Accessibility section (semantic HTML, aria patterns, focus indicators, touch targets, motion)

### Performance
- `.planning/REQUIREMENTS.md` — PERF-01, PERF-02, PERF-04, PERF-06 define budgets
- `.planning/codebase/STACK.md` — Performance targets and asset optimization strategy

### Project context
- `.planning/PROJECT.md` — Constraints (timeline, devices, privacy, no backend)
- `.planning/STATE.md` — Current blockers (GA4 property ID needed, Chromebook test device access)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/layout.tsx`: Root layout where GA4 Script tag will be added — currently has Open Sans font config only
- `lib/utils.ts`: Utility module — `lib/analytics.ts` follows the same pattern
- `components/Navigation.tsx` and `components/ProgressBar.tsx`: Shared components that need keyboard/focus verification
- `app/pre-vr/components/Screen*.tsx`: Six screen components that need analytics calls and a11y verification

### Established Patterns
- Components use `useState`/`useCallback` for local state — analytics calls fit as side effects in existing handlers
- Screen transitions managed by `key={currentScreen}` remount pattern — focus management hooks into this
- Code splitting via `React.lazy` already used for Screen 3 (maplibre-gl) — pattern available for other heavy deps
- Vitest with component mocks already in place for all screens — analytics mock fits this pattern

### Integration Points
- `app/layout.tsx` — GA4 script injection point
- `app/pre-vr/page.tsx` — Screen transition handler where `trackScreenView` calls and focus management go
- `context/SessionContext` — Session state provider where analytics context (session-level data) could be derived
- Each Screen component's event handlers — where specific interaction tracking calls go

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for GA4 integration, WCAG auditing, and Lighthouse performance testing.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-analytics-polish*
*Context gathered: 2026-03-19*
