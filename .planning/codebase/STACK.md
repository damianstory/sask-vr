# Technology Stack

**Analysis Date:** 2026-04-03

## Languages

**Primary:**
- TypeScript 5.x - All source files under `app/`, `components/`, `lib/`, `context/`, `tests/`

**Secondary:**
- CSS - Global styles in `styles/globals.css` (Tailwind v4 via PostCSS)
- JSON - Content data files under `content/`

## Runtime

**Environment:**
- Node.js 24.12.0 (detected from active runtime; no `.nvmrc` present)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.0 - App Router; SSG-oriented (no server-side data fetching); entry at `app/layout.tsx`
- React 19.2.4 - UI layer; client components predominate (`'use client'` directive on all screen components)
- React DOM 19.2.4 - Browser rendering

**Testing:**
- Vitest 4.1.0 - Test runner; config at `vitest.config.ts`; jsdom environment
- @testing-library/react 16.3.2 - Component rendering and interaction assertions
- @testing-library/user-event 14.6.1 - Simulated user events
- @testing-library/jest-dom 6.9.1 - DOM assertion matchers (vitest integration)
- vitest-axe 0.1.0 - Accessibility (axe-core) assertions within Vitest

**Build/Dev:**
- Turbopack - Bundler via `next dev` (Next.js 16 default)
- @next/bundle-analyzer 16.2.0 - Bundle analysis; enabled via `ANALYZE=true` env var; configured in `next.config.ts`
- @vitejs/plugin-react 6.0.1 - React plugin for Vitest (separate from Next.js build)

## Key Dependencies

**Critical:**
- `maplibre-gl` 5.20.2 - Interactive employer map on Screen 3 (`app/pre-vr/components/ScreenThree.tsx`); loads map tiles from CARTO CDN
- `focus-trap-react` 12.0.0 - Keyboard focus trapping for accessibility modals/cards
- `clsx` 2.1.1 - Conditional class merging utility (used in `lib/utils.ts`)
- `tailwind-merge` 3.5.0 - Tailwind class deduplication (used in `lib/utils.ts`)
- `@next/third-parties` 16.2.0 - Google Analytics 4 integration via `GoogleAnalytics` component (`app/layout.tsx`)

**Infrastructure:**
- `tailwindcss` 4.x - CSS utility framework; configured via `@tailwindcss/postcss` PostCSS plugin
- `@tailwindcss/postcss` 4.x - PostCSS integration for Tailwind v4; config at `postcss.config.mjs`
- `typescript` 5.x - Type checking; config at `tsconfig.json`; strict mode enabled

## Configuration

**Environment:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics measurement ID; if absent, GA script is not injected (graceful fallback in `app/layout.tsx`)
- `NODE_ENV` - Standard Next.js/Node env var; used in `lib/analytics.ts` to skip real GA calls in development
- `ANALYZE=true` - Enables bundle analyzer output on build

**Build:**
- `next.config.ts` - Next.js configuration; wraps build with bundle analyzer
- `tsconfig.json` - TypeScript; target ES2017; strict mode; path alias `@/` maps to project root
- `postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin
- `eslint.config.mjs` - ESLint flat config using `eslint-config-next` core-web-vitals + TypeScript rulesets
- `vitest.config.ts` - Vitest config; test files matched from `tests/**/*.test.{ts,tsx}`; `@/` alias resolves to project root

## Platform Requirements

**Development:**
- Node.js (v20+ recommended; v24.12.0 in use)
- npm

**Production:**
- Vercel (zero-config deployment; static/SSG output via edge CDN per `TECH_SPECS.md`)
- No server-side runtime required; application is stateless with no backend

---

*Stack analysis: 2026-04-03*
