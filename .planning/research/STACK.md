# Technology Stack

**Project:** Career Explorer Micro-Site (Sask-VR)
**Researched:** 2026-03-19

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 16.2 | App framework, SSG, routing | Latest stable (released 2026-03-18). Turbopack default = faster builds. App Router is mature. SSG via `output: 'export'` gives pure static HTML on Vercel CDN. React 19.2 included. No migration burden since greenfield. | HIGH |
| React | 19.2 | UI rendering | Ships with Next.js 16.2. Server Components for static screens, Client Components only where interactivity needed (card builder, task picker). | HIGH |
| TypeScript | 5.x | Type safety | Next.js 16 ships with TS config out of the box. Non-negotiable for a deadline project -- catches bugs at compile time. | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.1 | Utility-first CSS | CSS-first config (no tailwind.config.js). 5x faster builds via Oxide engine. shadcn/ui requires it. Well-supported in Next.js 16. | HIGH |
| shadcn/ui | latest CLI | Accessible base components | Built on Radix UI primitives = WCAG AA keyboard/ARIA out of the box. Copy-paste model means zero runtime dependency. Tailwind v4 compatible. Use for: accordion (pathway timeline), dialog, tooltip, checkbox (post-VR checklist). | HIGH |

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Motion (formerly Framer Motion) | 12.x | Page transitions, micro-interactions | Renamed from Framer Motion in Nov 2024. Import from `motion/react`. ~32KB gzipped but can tree-shake to ~5KB for basic use. Provides: `AnimatePresence` for screen transitions, `motion.div` for entrance animations, spring physics for the salary counter. Well-tested on low-powered devices via WAAPI fallback. | HIGH |
| CSS animations (native) | N/A | Simple transitions, hover states | Use CSS `transition` and `@keyframes` for anything that doesn't need orchestration. Zero JS cost. Chromebooks handle CSS animations on compositor thread. Prefer this over Motion for simple fade/slide. | HIGH |

**Do NOT use:**
- **GSAP** -- Overkill for this project's animation needs. Licensing complexity (commercial use restrictions). Larger bundle.
- **react-spring** -- Less active maintenance. Motion covers the same use cases with better DX.
- **Lottie/lottie-react** -- Heavy runtime for what we need. SVG illustrations are simpler and more performant.

### Card Generation (Canvas API)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Native Canvas API | Browser built-in | Carpenter Card compositing | No library needed. `drawImage()` for background PNG + `fillText()` for student name + icon overlay. Works on all Chromebooks. Keep it native to avoid bundle bloat for a single feature. | HIGH |
| Native `toBlob()` / `toDataURL()` | Browser built-in | Card image download | `canvas.toBlob()` -> `URL.createObjectURL()` -> trigger download via anchor click. No library needed. | HIGH |

**Do NOT use:**
- **html2canvas** -- Buggy with modern CSS, 40KB+ bundle, slow on Chromebooks. We're compositing a simple card, not screenshotting DOM.
- **html-to-image** -- Same concern. We don't need DOM-to-image; we control the exact canvas drawing.
- **Fabric.js / Konva** -- Canvas abstraction libraries are overkill. We have one compositing operation.

### Analytics

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @next/third-parties | 16.x | GA4 script loading | Official Next.js package. `GoogleAnalytics` component in root layout. Handles script optimization, lazy loading. Auto-tracks route changes in App Router. | HIGH |
| gtag.js (via window.gtag) | GA4 | Custom event tracking | Thin wrapper around `window.gtag('event', ...)`. No npm package needed beyond @next/third-parties. Track: task selections, employer pin taps, card downloads, checklist completions. | HIGH |

**Do NOT use:**
- **react-ga4** -- Unnecessary abstraction. @next/third-parties already loads gtag. Just call `window.gtag()` directly with a typed helper function.
- **Google Tag Manager** -- Adds complexity for no benefit. We have one analytics vendor and control the codebase directly.
- **Segment / Mixpanel** -- Out of scope. GA4 is the stated requirement.

### SVG & Illustrations

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Inline SVG (React components) | N/A | Map, task tiles, icons | Import SVGs as React components via Next.js built-in support. Allows: dynamic fills (selection state), ARIA labels for accessibility, animation via Motion or CSS. Better than `<img>` for interactive SVGs. | HIGH |
| Lucide React | latest | UI icons | Tree-shakeable icon set. Used by shadcn/ui. Consistent stroke-based icons. Only imports what you use. | MEDIUM |

**Do NOT use:**
- **react-simple-maps** -- We need a stylized illustration of Regina, not a geographic data map. Static SVG is simpler and faster.
- **SVG sprite sheets** -- Unnecessary complexity for <20 icons. Tree-shaken imports are simpler.

### Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| next/font/google | Built into Next.js | Open Sans loading | Automatic font optimization, self-hosted from Vercel CDN. Zero layout shift. Subset to latin. | HIGH |

### State Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React Context + useState | Built into React | Session state (selections, name, screen) | Project explicitly requires stateless (lost on refresh). Single page flow with ~6 screens. Context at the Pre-VR flow root holds: selected tasks, current screen index, student name, selected icon. No global state library needed. | HIGH |

**Do NOT use:**
- **Zustand / Jotai / Redux** -- Massive overkill. We have one context with ~5 state values for a single user flow. Adding a state library is over-engineering.
- **URL state (search params)** -- Project decision is to avoid URL manipulation. Internal state only.

### Accessibility

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Radix UI Primitives (via shadcn/ui) | latest | Keyboard nav, ARIA, focus management | shadcn/ui components inherit Radix's WAI-ARIA patterns. Accordion, checkbox, dialog all handle focus trapping, arrow key navigation, screen reader announcements. | HIGH |
| @axe-core/react (dev only) | latest | Accessibility auditing in dev | Catches WCAG violations during development. Console warnings for missing labels, contrast issues, etc. Dev-only -- zero production cost. | MEDIUM |

### Development & Build

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Turbopack | Built into Next.js 16 | Dev server & builds | Default in Next.js 16.2. ~400% faster dev startup. No configuration needed. | HIGH |
| ESLint | 9.x | Code quality | Next.js 16 ships with flat config ESLint. Catches bugs and enforces consistency. | HIGH |
| Prettier | 3.x | Code formatting | Consistent formatting. Run on save. | HIGH |

### Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | N/A | Hosting & CDN | Zero-config deploy from Git. Static export served from edge CDN globally. Preview deploys for every PR. Free tier covers this project. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 16.2 | Astro | Astro is excellent for static sites, but team uses Next.js as default. No benefit to switching for a single-page flow app. |
| Framework | Next.js 16.2 | Next.js 15.5 | 15.5 is stable but 16.2 is also stable and greenfield means no migration risk. Turbopack as default and React 19.2 are meaningful wins. |
| Animation | Motion 12.x | CSS-only | CSS handles simple transitions, but orchestrated enter/exit animations (screen transitions with AnimatePresence) need Motion. Use both: CSS for simple, Motion for orchestrated. |
| Animation | Motion 12.x | Motion One (vanilla) | Motion One is lighter but lacks React-specific features like AnimatePresence and layout animations that we need for screen transitions. |
| Components | shadcn/ui | Headless UI | Less component variety. shadcn/ui gives us styled starting points we can customize, saving time on a deadline project. |
| Components | shadcn/ui | Radix directly | Same primitives but we'd style everything from scratch. shadcn/ui saves significant time. |
| Card generation | Native Canvas API | Server-side (Sharp/Satori) | Adds backend complexity. Client-side Canvas is simpler, keeps PII (student name) in browser, and meets the <1s generation target on Chromebook. |
| Counter animation | Motion AnimateNumber or countUp.js | react-countup | react-countup wraps countUp.js and works fine, but if using Motion already, its AnimateNumber is more consistent. However, AnimateNumber requires Motion+ membership. Use countUp.js (2.8KB, dependency-free) for the salary counter. |

## Installation

```bash
# Create project
npx create-next-app@latest sask-vr --typescript --tailwind --app --turbopack

# Initialize shadcn/ui (Tailwind v4 compatible)
npx shadcn@latest init

# Add specific shadcn components as needed
npx shadcn@latest add accordion checkbox dialog tooltip progress

# Core dependencies
npm install motion countup.js lucide-react

# Analytics (ships with Next.js but explicit install)
npm install @next/third-parties

# Dev dependencies
npm install -D @axe-core/react prettier eslint-config-prettier
```

## Project Configuration Notes

### next.config.ts
```typescript
const nextConfig = {
  output: 'export',  // Static HTML export for Vercel CDN
  images: {
    unoptimized: true,  // Required for static export
  },
};
```

**Important:** With `output: 'export'`, all pages are statically generated at build time. No server-side features (API routes, server actions, ISR). This is exactly what we want -- pure static site, maximum CDN performance.

### Font Loading
```typescript
// app/layout.tsx
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});
```

### GA4 Integration
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  );
}
```

```typescript
// lib/analytics.ts -- typed event helper
type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export function trackEvent({ action, category, label, value }: GAEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}
```

## Performance Budget

Given the Chromebook constraint (1366x768, often limited RAM):

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial JS bundle | < 100KB gzipped | SSG + tree shaking. Motion tree-shakes to ~5KB for basic use. |
| First Contentful Paint | < 1.5s | Static HTML from CDN. Fonts preloaded. |
| Total page weight | < 500KB | Optimize card background PNGs. Inline critical SVGs. |
| Screen transition | < 300ms | Motion's WAAPI-backed animations run on compositor thread. |
| Card generation | < 1s | Canvas API is synchronous. Background PNG pre-cached. |

## Sources

- [Next.js 16.2 Release Blog](https://nextjs.org/blog/next-16-2) -- Version, features, React 19.2 confirmation
- [Next.js Static Exports Guide](https://nextjs.org/docs/pages/guides/static-exports) -- output: 'export' configuration
- [Next.js Third Party Libraries Guide](https://nextjs.org/docs/app/guides/third-party-libraries) -- @next/third-parties GA4 integration
- [Motion.dev Documentation](https://motion.dev/docs/react) -- Motion (formerly Framer Motion) React API
- [Motion Blog: Framer Motion is now Motion](https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion) -- Rebrand details
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, Oxide engine
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) -- CLI setup steps
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) -- Tailwind v4 compatibility
- [CountUp.js](https://inorganik.github.io/countUp.js/) -- Lightweight animated counter
- [MDN Canvas API: Using Images](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images) -- Canvas compositing reference
