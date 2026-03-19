# External Integrations

**Analysis Date:** 2026-03-19

## APIs & External Services

**Image Generation:**
- NanoBanana Pro 2 — Generates custom background images for Carpenter Card based on student selections
  - Endpoint: To be confirmed (in NANOBANANA_ENDPOINT env var)
  - Auth: Bearer token via `NANOBANANA_API_KEY` (server-side only)
  - Usage: Called from `/app/api/generate-card/route.ts` on Screen 5 when student initiates card generation
  - Timeout: 8 seconds; falls back to pre-generated backgrounds if exceeded
  - Integration: Thin proxy route in Next.js to hide API key from client

## Data Storage

**Databases:**
- None — This is a stateless single-page application
- All content is hardcoded in JSON files in `content/` directory
- No persistent storage or backend database

**File Storage:**
- Vercel static file serving for images, SVGs, and pre-generated card backgrounds in `public/` directory
- Client-side Canvas API generates card images; they are NOT uploaded to a server
- Card downloads: Created in browser memory and downloaded to local device only

**Caching:**
- HTTP browser caching via Vercel edge CDN for static assets
- Service Worker: Not required for MVP; could be added later for offline support
- Session state: In-memory React state only; no localStorage or sessionStorage persistence

## Authentication & Identity

**Auth Provider:**
- None — Application is fully anonymous, no login required
- Zero authentication layer

**Session Tracking:**
- Anonymous session state held in React component state within browser
- State is discarded when browser tab closes or page refreshes
- No user IDs, no cookies beyond Google Analytics defaults

## Monitoring & Observability

**Error Tracking:**
- None configured for MVP
- Client-side errors could be logged to Vercel analytics or a dedicated error tracking service (future consideration)

**Logs:**
- Development: Browser console logs (via `console.log`, `console.error`)
- Production: No centralized logging; errors visible in Vercel function logs for `/api/generate-card` route

**Analytics:**
- Google Analytics 4 (gtag.js) — Event tracking for all meaningful interactions
  - Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (public, safe for client)
  - Script loaded in `app/layout.tsx` via `<Script strategy="afterInteractive">`
  - Events tracked:
    - `path_select` — Student selects Pre-VR or Post-VR on landing page
    - `screen_view` — Student navigates to a new screen (Screen 1–6 or Bridge)
    - `tile_select` — Student selects/deselects a task tile on Screen 2
    - `employer_tap` — Student taps an employer pin on Screen 3
    - `pathway_expand` — Student expands a pathway step on Screen 4
    - `icon_select` — Student selects an icon on Screen 5
    - `name_entered` — Student completes name input (fires on blur if non-empty; no PII transmitted)
    - `card_generated` — Card finishes rendering (includes `generation_method: "api" | "fallback"`)
    - `card_download` — Student taps download button
    - `checklist_check` — Student checks an item on bridge page
    - `myblueprint_link` — Student taps myBlueprint link on bridge page
  - Privacy: No PII is transmitted; `firstName` is never sent to analytics
  - Implementation: `lib/analytics.ts` provides a `trackEvent(name, params)` wrapper function

## CI/CD & Deployment

**Hosting:**
- Vercel (primary host for Next.js applications)
- Static site generated via Next.js Static Site Generation (SSG)
- Edge CDN for fast global asset delivery
- Serverless functions for `/api/generate-card` route

**CI Pipeline:**
- Vercel automatic deploys on Git push
- Preview deployments on pull requests
- Production deployment on merge to main branch
- No separate staging environment for MVP

**Domain:**
- TBD (decision needed before launch)
- Options: Subdomain of myBlueprint (e.g., `explore.myblueprint.ca`) or standalone domain
- Domain selection impacts QR code generation and VR simulation integration

## Environment Configuration

**Required Environment Variables:**

| Variable | Purpose | Visibility | Source |
|----------|---------|------------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID | Public (safe) | To be provided by analytics team before deployment |
| `NANOBANANA_API_KEY` | Image generation API key (Bearer token) | Server-side only | Stored in Vercel `.env.local` or environment secrets |
| `NANOBANANA_ENDPOINT` | Image generation API endpoint URL | Server-side only | Stored in Vercel `.env.local` or environment secrets |

**Secrets Location:**
- Development: `.env.local` (Git-ignored, not committed)
- Production: Vercel Environment Secrets (via Vercel dashboard or CLI)

**No Other Integrations:**
- No email service (not sending emails)
- No SMS (not sending messages)
- No payment processing
- No authentication provider
- No CMS (content is hardcoded)
- No monitoring/APM tools (not in MVP scope)

## Webhooks & Callbacks

**Incoming:**
- None — This is a frontend-only application

**Outgoing:**
- None — Analytics events are sent via gtag.js to Google Analytics, but no custom webhooks

**myBlueprint Integration:**
- Post-VR bridge page includes a link to myBlueprint (`myBlueprint URL` from content/carpentry.json)
- Link is a simple `<a href>` that opens myBlueprint in a new tab
- No API integration; just a redirect
- Student must log into myBlueprint separately (existing user account)

## Content Sourcing

**Content Data:**
- Single JSON file per occupation: `content/carpentry.json`
- All career data (salary, employers, pathways, statistics) is hardcoded in JSON
- Schema defined in `content/types.ts` (TypeScript interface for validation)

**Required Content Sources:**
- Salary data for carpenter occupation in Saskatchewan
- List of hiring employers (4–6) with employee counts and optional quotes
- Pathway steps (high school → apprenticeship → journeyman → advanced roles)
- Task/skill tiles (6 exactly, e.g., "Framing a House", "Installing Fixtures")
- Illustration assets (SVGs for task tiles, employer logos, pathway icons)
- Saskatchewan region map with employer pin locations

**Asset Hosting:**
- All SVGs, PNGs, and icons stored in `public/` directory
- Served via Vercel static file serving and edge CDN
- No external CDN or asset management service required for MVP

---

*Integration audit: 2026-03-19*
