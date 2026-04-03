# External Integrations

**Analysis Date:** 2026-04-03

## APIs & External Services

**Mapping:**
- CARTO Basemaps CDN - Provides map tile styles for the employer map on Screen 3
  - SDK/Client: `maplibre-gl` 5.20.2 (`app/pre-vr/components/ScreenThree.tsx`)
  - Auth: None required; CARTO public basemap endpoint
  - Tile style URL: `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json` (hardcoded constant in `ScreenThree.tsx`)

**Analytics:**
- Google Analytics 4 (GA4) - Event tracking for the full student journey funnel
  - SDK/Client: `@next/third-parties/google` — `GoogleAnalytics` component injected in `app/layout.tsx`; wrapper functions in `lib/analytics.ts`
  - Auth: `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable
  - Events tracked: `screen_view`, `path_select`, `tile_select`, `employer_tap`, `pathway_expand`, `icon_select`, `name_entered`, `card_download`, `checklist_check`
  - Dev behavior: GA calls are suppressed in `NODE_ENV=development`; events are console-logged instead (`lib/analytics.ts`)

**Font Loading:**
- Google Fonts - Loads Open Sans (weights 300, 800)
  - SDK/Client: `next/font/google` (`app/layout.tsx`)
  - No auth required; served via Next.js font optimization pipeline
  - CSS variable: `--font-open-sans`

## Data Storage

**Databases:**
- None - The application is fully stateless. No database is used.

**File Storage:**
- Local filesystem only - Static assets (logos, public files) served from `public/` via Next.js static file serving

**Caching:**
- None - No explicit caching layer. Browser and CDN caching only.

## Authentication & Identity

**Auth Provider:**
- None - The application requires no authentication. It is a public micro-site with no user accounts.

## State Management

**Session State:**
- In-memory React Context only (`context/SessionContext.tsx`)
- State held: `selectedTiles`, `firstName`, `selectedIcon`, `generatedCardUrl`
- Lifetime: browser session; cleared on page reload
- No localStorage, sessionStorage, or cookies used

## Image / Card Generation

**Canvas API (Client-Side):**
- All card PNG generation runs entirely in-browser using the HTML Canvas API
- Implementation: `lib/generate-card.ts` — composites a 1200×675 PNG with gradients, emoji, name, and task chips
- No external image generation API is currently integrated (TECH_SPECS.md references "NanoBanana Pro 2" but this is not present in the codebase)
- Output: PNG Blob downloaded directly to the user's device via an anchor tag

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service (Sentry, Rollbar, etc.) is integrated.

**Logs:**
- Console logging only; analytics events are console-logged in development mode (`lib/analytics.ts`)

## CI/CD & Deployment

**Hosting:**
- Vercel (per `TECH_SPECS.md` and `.vercel` in `.gitignore`)
- Static/SSG output; no server-side rendering required

**CI Pipeline:**
- None detected - No CI configuration files (`.github/workflows/`, `vercel.json` CI config, etc.) found in the repository.

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - GA4 measurement ID (e.g., `G-XXXXXXXXXX`); GA is silently disabled if absent

**Optional env vars:**
- `ANALYZE=true` - Enables `@next/bundle-analyzer` on `npm run build`
- `NODE_ENV` - Set automatically by Next.js; controls dev vs. production analytics behavior

**Secrets location:**
- `.env*.local` files (gitignored per `.gitignore`); no `.env` files detected in the repository at analysis time

---

*Integration audit: 2026-04-03*
