# Phase 4: Analytics + Polish - Research

**Researched:** 2026-03-19
**Domain:** GA4 Analytics, WCAG AA Accessibility, Performance Optimization, Vercel Deployment
**Confidence:** HIGH

## Summary

Phase 4 is an instrumentation, verification, and polish pass over the complete micro-site built in Phases 1-3. It covers three distinct domains: (1) GA4 analytics integration using `@next/third-parties/google` with a centralized typed analytics module, (2) WCAG AA accessibility remediation including focus management, focus trapping, contrast verification, and screen reader semantics, and (3) performance validation against budgets (150KB JS gzipped, 3s LCP, 500ms transitions) with bundle analysis.

The existing codebase is a Next.js 16.2.0 app with React 19, Tailwind CSS v4, and vitest for testing. All 6 Pre-VR screens and the Post-VR bridge are complete. The app uses `key={currentScreen}` remounting for screen transitions, `SessionContext` for state, and `React.lazy` for code-splitting Screen 3's maplibre-gl dependency. The root layout (`app/layout.tsx`) is the GA4 injection point. Vitest with jsdom and @testing-library/react is already configured.

**Primary recommendation:** Use `@next/third-parties/google` GoogleAnalytics component (official Next.js package) for GA4, `vitest-axe` for automated accessibility testing, `focus-trap-react` for the employer card dialog, and `@next/bundle-analyzer` for bundle verification. All are mature, well-maintained packages that match the existing stack.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Load GA4 via next/script in root layout immediately -- no consent banner needed (managed school Chromebooks, educational tool, no PII)
- Centralized analytics module: `lib/analytics.ts` with typed helper functions (`trackScreenView`, `trackTileSelect`, `trackEmployerTap`, etc.) -- components call helpers, not `window.gtag()` directly
- Development debug mode: console.log all analytics events in dev instead of sending to GA4
- GA4 measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var -- gracefully no-op if missing
- Event names follow snake_case convention: `path_select`, `screen_view`, `tile_select`, `employer_tap`, `pathway_expand`, `icon_select`, `name_entered`, `card_download`, `checklist_check`
- Zero PII: `name_entered` event signals completion only, never includes the name value
- Focus management: on each Pre-VR screen transition, move focus to the screen's heading
- Skip-to-content link: hidden until focused, standard WCAG pattern
- Employer card popup (Screen 3): full focus trap when open
- Audit method: automated (axe-core) + manual checklist
- `prefers-reduced-motion` already respected -- verify it works correctly
- Add `@next/bundle-analyzer` for visual bundle treemap
- LCP measurement via Lighthouse with 4x CPU throttling to simulate Chromebook
- Vercel project created and connected to Git repo
- Use default `.vercel.app` domain for pilot
- Pre-launch testing: run vitest suite + Lighthouse audit + manual walkthrough
- Responsive verification at three breakpoints: 320px, 768px, 1366x768
- Environment variables to configure in Vercel: `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### Claude's Discretion
- Exact axe-core integration approach (vitest plugin vs standalone script)
- Focus trap implementation details (custom hook vs library)
- Bundle optimization strategies if budget is exceeded
- Lighthouse CI configuration details
- Vercel build settings and static export configuration

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANLY-01 | GA4 page view events fire for each screen transition | `@next/third-parties/google` auto-tracks route changes; custom `trackScreenView` for internal screen state transitions |
| ANLY-02 | Path selection tracked (pre_vr / post_vr) | `sendGAEvent` call in landing page click handlers via `trackPathSelect` helper |
| ANLY-03 | Tile selections tracked (tile_id, select/deselect) | `trackTileSelect` helper called from ScreenTwo toggle handler |
| ANLY-04 | Employer pin taps tracked (employer_id, employer_name) | `trackEmployerTap` helper called from ScreenThree pin click handler |
| ANLY-05 | Pathway step expansions tracked (step_id, step_label) | `trackPathwayExpand` helper called from ScreenFour accordion handler |
| ANLY-06 | Card interactions tracked (icon_select, name_entered, card_download) | Three separate helpers called from ScreenFive handlers |
| ANLY-07 | Checklist item checks tracked (item_id, item_label) | `trackChecklistCheck` helper called from PostVR toggle handler |
| ANLY-08 | No PII sent to analytics | Analytics module design ensures no name value in any event; enforced by typed API |
| ANLY-09 | Screen-to-screen funnel configurable in GA4 | Standard GA4 Explorations funnel using `screen_view` events with `screen_name` parameter |
| A11Y-01 | All interactive elements keyboard-focusable and operable | Manual audit + vitest-axe automated checks on each screen component |
| A11Y-02 | WCAG AA contrast ratios (4.5:1 text, 3:1 UI) | Lighthouse accessibility audit + manual contrast check on design tokens |
| A11Y-03 | All touch targets minimum 44x44px | Visual audit at each breakpoint; existing pins already 44px |
| A11Y-04 | Screen reader support (aria-pressed, aria-expanded, role="dialog") | Verify existing aria attributes; add focus-trap-react for dialog; add aria-live for screen transitions |
| A11Y-05 | prefers-reduced-motion respected | Verify existing implementation; vitest-axe checks |
| PERF-01 | Landing page LCP under 3s on school Chromebook | Lighthouse with 4x CPU throttle; bundle analysis to verify JS size |
| PERF-02 | Screen transitions under 500ms | Client-side state change -- already fast; verify no blocking re-renders |
| PERF-04 | Total JS bundle under 150KB gzipped | @next/bundle-analyzer treemap; verify maplibre-gl stays code-split |
| PERF-06 | Responsive at 320px, 768px, 1024px+ | Manual verification at three breakpoints; fix any overflow/layout issues |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @next/third-parties | 16.2.0 | GA4 integration via GoogleAnalytics component | Official Next.js package; optimized loading after hydration; auto pageview tracking |
| vitest-axe | 0.1.0 | Automated accessibility testing in vitest | Vitest-native axe-core wrapper; `toHaveNoViolations` matcher; works with jsdom |
| focus-trap-react | 12.0.0 | Focus trap for employer card dialog (Screen 3) | Battle-tested; handles Tab cycling, Escape close, focus return; 3KB gzipped |
| @next/bundle-analyzer | 16.2.0 | Bundle size visualization and verification | Official Next.js package; generates treemap for client/server bundles |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| axe-core | (peer dep of vitest-axe) | Underlying accessibility engine | Automatically included by vitest-axe |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @next/third-parties | Raw gtag.js via next/script | More manual setup; @next/third-parties handles script optimization and provides sendGAEvent helper |
| focus-trap-react | Custom useFocusTrap hook | Custom hook is lighter but misses edge cases (shadow DOM, iframe, dynamic content); library handles all cases |
| vitest-axe | Lighthouse CI only | Lighthouse gives scores but not per-component granularity; vitest-axe catches regressions in CI |

**Installation:**
```bash
npm install @next/third-parties@latest
npm install --save-dev vitest-axe focus-trap-react @next/bundle-analyzer
```

**Note:** `focus-trap-react` is a runtime dependency (used in the employer card component), not just dev.

## Architecture Patterns

### Recommended Project Structure
```
lib/
  analytics.ts        # Centralized GA4 event helpers (new)
  utils.ts            # Existing utilities
app/
  layout.tsx          # Add GoogleAnalytics component here
  pre-vr/
    page.tsx          # Add focus management on screen transitions
    components/
      ScreenThree.tsx # Add focus-trap-react to employer card
tests/
  a11y/               # New directory for accessibility tests (optional, or co-locate)
next.config.ts        # Add @next/bundle-analyzer wrapper
```

### Pattern 1: Centralized Analytics Module
**What:** A single `lib/analytics.ts` file exports typed helper functions. Components import and call these helpers -- never `window.gtag` or `sendGAEvent` directly.
**When to use:** Every analytics call goes through this module.
**Example:**
```typescript
// Source: CONTEXT.md decision + @next/third-parties docs
import { sendGAEvent } from '@next/third-parties/google'

const IS_DEV = process.env.NODE_ENV === 'development'

function track(eventName: string, params?: Record<string, string>) {
  if (IS_DEV) {
    console.log('[Analytics]', eventName, params)
    return
  }
  sendGAEvent('event', eventName, params)
}

export function trackScreenView(screenName: string) {
  track('screen_view', { screen_name: screenName })
}

export function trackTileSelect(tileId: string, action: 'select' | 'deselect') {
  track('tile_select', { tile_id: tileId, action })
}

export function trackEmployerTap(employerId: string, employerName: string) {
  track('employer_tap', { employer_id: employerId, employer_name: employerName })
}

export function trackPathwayExpand(stepId: string, stepLabel: string) {
  track('pathway_expand', { step_id: stepId, step_label: stepLabel })
}

export function trackIconSelect(iconId: string) {
  track('icon_select', { icon_id: iconId })
}

export function trackNameEntered() {
  track('name_entered') // No PII -- signals completion only
}

export function trackCardDownload() {
  track('card_download')
}

export function trackChecklistCheck(itemId: string, itemLabel: string) {
  track('checklist_check', { item_id: itemId, item_label: itemLabel })
}

export function trackPathSelect(path: 'pre_vr' | 'post_vr') {
  track('path_select', { path })
}
```

### Pattern 2: Focus Management on Screen Transitions
**What:** When `currentScreen` changes in the Pre-VR flow, focus moves to the new screen's heading element. Uses a ref or `document.querySelector` after the remount completes.
**When to use:** Every screen transition in Pre-VR flow.
**Example:**
```typescript
// In app/pre-vr/page.tsx, add useEffect that runs when currentScreen changes
useEffect(() => {
  // Wait for remount to complete (key={currentScreen} causes remount)
  requestAnimationFrame(() => {
    const heading = document.querySelector('h1, h2, [role="heading"]')
    if (heading instanceof HTMLElement) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: false })
    }
  })
}, [currentScreen])
```

### Pattern 3: Focus Trap for Dialog
**What:** Wrap the employer card popup in `<FocusTrap>` from `focus-trap-react`. When a pin is tapped and the card opens, focus is trapped within the card. Escape closes the card and returns focus to the triggering pin.
**When to use:** Screen 3 employer card popup.
**Example:**
```typescript
// Source: focus-trap-react docs
import FocusTrap from 'focus-trap-react'

// Inside ScreenThree component, around the employer card:
{selectedEmployer && (
  <FocusTrap
    active={!!selectedEmployer}
    focusTrapOptions={{
      onDeactivate: closeCard,
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
    }}
  >
    <div role="dialog" aria-labelledby="employer-card-title" aria-modal="true">
      {/* Card content */}
      <button onClick={closeCard} aria-label="Close">X</button>
      <h3 id="employer-card-title">{employer.name}</h3>
      {/* ... */}
    </div>
  </FocusTrap>
)}
```

### Pattern 4: Skip-to-Content Link
**What:** A visually hidden link at the top of the page that becomes visible on focus. Allows keyboard users to skip navigation/progress bar.
**When to use:** Root layout or Pre-VR page wrapper.
**Example:**
```typescript
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--myb-navy)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--myb-primary-blue)]"
>
  Skip to content
</a>
{/* ... */}
<main id="main-content">
  {/* Screen content */}
</main>
```

### Anti-Patterns to Avoid
- **Calling `window.gtag()` directly from components:** Use the centralized analytics module. Direct calls bypass dev-mode logging and type safety.
- **Sending PII in analytics events:** The `name_entered` event must NEVER include the student's name. The typed API enforces this by design (no `value` parameter on `trackNameEntered`).
- **Focus trap without escape hatch:** Always configure `escapeDeactivates: true` and `clickOutsideDeactivates: true` on dialogs. A trapped user with no escape is worse than no trap.
- **Setting `tabindex="0"` on headings permanently:** Use `tabindex="-1"` for programmatic focus targets so they are focusable via JS but not in the natural tab order.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GA4 script loading | Manual `<script>` tags in `<head>` | `@next/third-parties/google` GoogleAnalytics component | Handles deferred loading, hydration timing, script optimization |
| GA4 event sending | `window.gtag('event', ...)` calls | `sendGAEvent` from `@next/third-parties/google` (wrapped in analytics module) | Handles dataLayer push, type safety, SSR compatibility |
| Focus trapping | Custom Tab key interceptor | `focus-trap-react` | Edge cases: dynamic content, screen reader virtual cursor, nested traps, shadow DOM |
| Accessibility testing | Manual-only a11y checks | `vitest-axe` automated tests | Catches ARIA errors, missing alt text, contrast issues programmatically; prevents regressions |
| Bundle analysis | Manual size checking with `ls -la` | `@next/bundle-analyzer` | Visual treemap shows exactly what's in each chunk; identifies optimization targets |

**Key insight:** The analytics and accessibility domains are full of subtle correctness requirements (event timing, ARIA state machines, focus order). Using battle-tested libraries prevents the kind of bugs that only surface during real screen reader testing or GA4 dashboard review.

## Common Pitfalls

### Pitfall 1: GA4 Auto-Pageview Double-Counting
**What goes wrong:** GA4's "Enhanced Measurement" auto-tracks `page_view` on history changes. If you also manually send `page_view` events, you get duplicates.
**Why it happens:** The Pre-VR flow uses internal state (not URL changes) for screen transitions, so GA4 auto-pageview won't fire for screens 1-6. But route navigations (landing -> /pre-vr, landing -> /post-vr) WILL auto-fire.
**How to avoid:** Use `screen_view` (custom event) for internal screen transitions, not `page_view`. Let GA4 Enhanced Measurement handle route-level page views automatically. Do not disable Enhanced Measurement.
**Warning signs:** Seeing double counts in GA4 Realtime report for route navigations.

### Pitfall 2: sendGAEvent Requires GoogleAnalytics Component
**What goes wrong:** `sendGAEvent` silently fails if the `<GoogleAnalytics>` component is not mounted in a parent layout/page.
**Why it happens:** `sendGAEvent` pushes to the `dataLayer` object which is initialized by the component.
**How to avoid:** Always place `<GoogleAnalytics gaId={...} />` in `app/layout.tsx` (root layout) so it's available on every page.
**Warning signs:** Events appear in dev console log but never show up in GA4 Realtime.

### Pitfall 3: Focus Trap on Dynamically Created DOM (MapLibre Markers)
**What goes wrong:** Screen 3 creates employer pins as DOM elements via `document.createElement('button')`. These are outside React's tree. Focus-trap-react needs a React-rendered container.
**Why it happens:** MapLibre markers are imperative DOM, not React components.
**How to avoid:** The employer card popup (not the pins) is what gets focus-trapped. The card IS a React component rendered conditionally. Store a ref to the triggering pin button so focus can return to it on close. The pin buttons themselves just need to be keyboard-focusable (they already are -- they're `<button>` elements).
**Warning signs:** Focus "escapes" the card and lands on a map pin behind the overlay.

### Pitfall 4: vitest-axe Happy DOM Incompatibility
**What goes wrong:** vitest-axe crashes or gives false results with Happy DOM.
**Why it happens:** Happy DOM has a broken `Node.prototype.isConnected` implementation that axe-core depends on.
**How to avoid:** The project already uses jsdom (confirmed in vitest.config.ts: `environment: 'jsdom'`). No action needed, but do NOT switch to happy-dom.
**Warning signs:** `TypeError` or unexpected axe results in test output.

### Pitfall 5: Bundle Size Blown by maplibre-gl
**What goes wrong:** maplibre-gl is ~200KB and could easily push the total bundle over 150KB gzipped if not properly code-split.
**Why it happens:** If the lazy import is accidentally changed to a static import, or if a shared module pulls maplibre-gl into the main chunk.
**How to avoid:** Verify with `@next/bundle-analyzer` that maplibre-gl is in its own chunk, loaded only when Screen 3 renders. The existing `React.lazy(() => import('./components/ScreenThree'))` pattern handles this.
**Warning signs:** Bundle analyzer treemap shows maplibre-gl in the main chunk.

### Pitfall 6: focus-trap-react with SSR
**What goes wrong:** `focus-trap-react` accesses `document` on import, which can cause SSR errors.
**Why it happens:** Next.js server-renders pages before hydration.
**How to avoid:** Screen 3 is already loaded via `React.lazy` (client-only). The employer card within it only renders when `selectedEmployer` is set (always client-side). No SSR risk in this case. But if focus-trap-react is ever used in a server-rendered component, wrap with dynamic import or `'use client'` directive.
**Warning signs:** `ReferenceError: document is not defined` during build.

## Code Examples

### GA4 Setup in Root Layout
```typescript
// Source: https://nextjs.org/docs/app/guides/third-party-libraries
// app/layout.tsx
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import '@/styles/globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '800'],
})

export const metadata: Metadata = {
  title: 'Carpentry Career Explorer',
  description: 'Explore what carpentry in Saskatchewan is really like',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
```

### vitest-axe Setup
```typescript
// tests/vitest.setup.ts (add to existing setup)
import 'vitest-axe/extend-expect'
```

### Accessibility Test Example
```typescript
// tests/a11y/screen-one.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import ScreenOne from '@/app/pre-vr/components/ScreenOne'

// Mock content as done in existing tests
vi.mock('@/content/config', () => ({
  content: { screenOne: { /* mock data */ } },
}))

describe('ScreenOne accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ScreenOne />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Bundle Analyzer Setup
```typescript
// next.config.ts
import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  /* config options here */
}

export default withBundleAnalyzer(nextConfig)
```

Run with: `ANALYZE=true npm run build`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual gtag.js `<script>` tags | `@next/third-parties/google` GoogleAnalytics component | Next.js 14+ (2024) | Optimized loading, auto pageview tracking, `sendGAEvent` helper |
| jest-axe for accessibility testing | vitest-axe (vitest-native fork) | 2023 | Native vitest matchers, no jest compatibility layer needed |
| Custom focus trap hooks | focus-trap-react v12 (tabbable v7) | 2025 | Handles edge cases: inert, Shadow DOM, dynamic content |
| Manual bundle size checking | @next/bundle-analyzer with Turbopack support | Next.js 16.1 (2026) | Works with new Turbopack bundler; writes to .next/diagnostics/analyze |

**Deprecated/outdated:**
- `react-ga` / `react-ga4`: Community wrappers replaced by official `@next/third-parties` for Next.js projects
- `jest-axe` in vitest projects: Use `vitest-axe` instead -- `jest-axe` requires jest compatibility shims

## Open Questions

1. **GA4 Measurement ID availability**
   - What we know: STATE.md lists "GA4 property ID needed before Phase 4 analytics integration" as a blocker
   - What's unclear: Whether the GA4 property has been created yet
   - Recommendation: The analytics module gracefully no-ops when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is missing (per CONTEXT.md decision). Build and test with dev-mode console logging. Add the real ID to Vercel env vars when available.

2. **Chromebook test device access**
   - What we know: STATE.md lists "Managed Chromebook test device access needed for Phase 3/4 validation"
   - What's unclear: Whether a physical device is available
   - Recommendation: Use Lighthouse with 4x CPU throttling as primary validation (per CONTEXT.md decision). This simulates Chromebook-class performance. Physical device testing is a nice-to-have before pilot.

3. **@next/bundle-analyzer ESM import compatibility**
   - What we know: The project uses `next.config.ts` (TypeScript config with ESM import syntax)
   - What's unclear: Whether `@next/bundle-analyzer` v16.2.0 supports ESM `import` syntax or requires CommonJS `require`
   - Recommendation: Try ESM import first; fall back to dynamic import or `require` wrapper if needed. The Next.js 16.1 release notes suggest modern bundler support.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANLY-01 | Screen view events fire on transitions | unit | `npx vitest run tests/analytics.test.ts -t "screen_view" -x` | Wave 0 |
| ANLY-02 | Path selection tracked | unit | `npx vitest run tests/analytics.test.ts -t "path_select" -x` | Wave 0 |
| ANLY-03 | Tile selections tracked | unit | `npx vitest run tests/analytics.test.ts -t "tile_select" -x` | Wave 0 |
| ANLY-04 | Employer pin taps tracked | unit | `npx vitest run tests/analytics.test.ts -t "employer_tap" -x` | Wave 0 |
| ANLY-05 | Pathway expansions tracked | unit | `npx vitest run tests/analytics.test.ts -t "pathway_expand" -x` | Wave 0 |
| ANLY-06 | Card interactions tracked | unit | `npx vitest run tests/analytics.test.ts -t "card" -x` | Wave 0 |
| ANLY-07 | Checklist checks tracked | unit | `npx vitest run tests/analytics.test.ts -t "checklist_check" -x` | Wave 0 |
| ANLY-08 | No PII in analytics | unit | `npx vitest run tests/analytics.test.ts -t "no PII" -x` | Wave 0 |
| ANLY-09 | Funnel configurable in GA4 | manual-only | Manual: verify in GA4 Explorations | N/A |
| A11Y-01 | All elements keyboard-focusable | smoke + a11y | `npx vitest run tests/a11y/ -x` | Wave 0 |
| A11Y-02 | WCAG AA contrast ratios | manual-only | Lighthouse a11y audit (manual run) | N/A |
| A11Y-03 | Touch targets 44x44px minimum | manual-only | Visual inspection at breakpoints | N/A |
| A11Y-04 | Screen reader ARIA attributes | a11y | `npx vitest run tests/a11y/ -t "aria" -x` | Wave 0 |
| A11Y-05 | prefers-reduced-motion respected | unit | `npx vitest run tests/screen-one.test.tsx -t "reduced-motion" -x` | Exists (verify) |
| PERF-01 | LCP under 3s | manual-only | Lighthouse with 4x CPU throttle | N/A |
| PERF-02 | Transitions under 500ms | manual-only | Manual timing verification | N/A |
| PERF-04 | JS bundle under 150KB gzipped | smoke | `ANALYZE=true npm run build` | N/A |
| PERF-06 | Responsive 320px-1366px | manual-only | Visual verification at 3 breakpoints | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npm run build`
- **Phase gate:** Full vitest suite green + Lighthouse audit green + manual walkthrough before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/analytics.test.ts` -- unit tests for lib/analytics.ts module (all ANLY requirements)
- [ ] `tests/a11y/` directory -- accessibility tests using vitest-axe for each screen component
- [ ] `vitest-axe` package installation and setup in `tests/vitest.setup.ts`
- [ ] `focus-trap-react` package installation

## Sources

### Primary (HIGH confidence)
- [Next.js Third Party Libraries docs](https://nextjs.org/docs/app/guides/third-party-libraries) - GoogleAnalytics component API, sendGAEvent usage, auto pageview tracking behavior (v16.2.0)
- [vitest-axe GitHub README](https://github.com/chaance/vitest-axe) - Setup methods, TypeScript config, jsdom requirement, toHaveNoViolations matcher
- [focus-trap-react npm](https://www.npmjs.com/package/focus-trap-react) - v12.0.0 API, FocusTrap component props, focusTrapOptions
- [@next/bundle-analyzer npm](https://www.npmjs.com/package/@next/bundle-analyzer) - v16.2.0 setup, ANALYZE env var, Turbopack support

### Secondary (MEDIUM confidence)
- [Next.js 16.1 blog post](https://nextjs.org/blog/next-16-1) - Experimental bundle analyzer with Turbopack support, .next/diagnostics/analyze output
- [GA4 Implementation Guide for Next.js 16 (Medium)](https://medium.com/@aashari/google-analytics-ga4-implementation-guide-for-next-js-16-a7bbf267dbaa) - Verified patterns match official docs

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages verified against npm registry; official Next.js packages match project's Next.js 16.2.0 version
- Architecture: HIGH - Patterns derived from official docs and CONTEXT.md locked decisions; verified against existing codebase structure
- Pitfalls: HIGH - Based on documented library limitations (vitest-axe/happy-dom incompatibility) and known GA4 behaviors (auto-pageview tracking)

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable packages, no breaking changes expected before pilot)
