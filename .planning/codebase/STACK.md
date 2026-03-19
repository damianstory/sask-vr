# Technology Stack

**Analysis Date:** 2026-03-19

## Languages

**Primary:**
- TypeScript — Application logic and React components
- JavaScript — Runtime scripting

**Secondary:**
- CSS — Styling (via Tailwind CSS with custom properties for brand tokens)
- HTML — Semantic markup (via React/Next.js)

## Runtime

**Environment:**
- Node.js (latest LTS version recommended for development)

**Package Manager:**
- npm (or yarn/pnpm as preferred by team)

## Frameworks

**Core:**
- Next.js (App Router) — Server-side rendering, static site generation, API routes, edge deployment
- React 18 — UI component library and state management

**Styling:**
- Tailwind CSS — Utility-first CSS framework with custom configuration for brand tokens
- CSS custom properties — Brand token management (colors, typography scale, spacing)

**Image Generation:**
- NanoBanana Pro 2 (external API) — Client-side image background generation for Carpenter Card

**Canvas Rendering:**
- HTML Canvas API (native browser) — Client-side image compositing for card assembly and download

**Analytics:**
- Google Analytics 4 (gtag.js) — Event tracking for funnel analysis and user interaction patterns

**Fonts:**
- Google Fonts (Open Sans) — Primary body/UI font via `@font-face` with `display=swap`
- Museo Sans (self-hosted, if available) — Brand-preferred font; falls back to Open Sans

## Key Dependencies

**Critical:**
- next — Next.js framework for routing, SSG, and API routes
- react — React 18 for component-based UI
- react-dom — DOM rendering for React
- typescript — Type safety and development experience

**UI & Styling:**
- tailwindcss — Utility-first CSS framework
- autoprefixer — CSS vendor prefixing for cross-browser support
- class-variance-authority (CVA) — Type-safe component variant patterns (if used for complex components)

**Forms & Validation:**
- react-hook-form — Lightweight form state and validation (optional, for name input on Screen 5)
- zod — Runtime schema validation for form inputs (optional, pairs with react-hook-form)

**Analytics:**
- gtag.js — Google Analytics 4 client library (loaded via `<Script>` in root layout)

**Development:**
- eslint — Linting for code quality
- prettier — Code formatting
- @types/react — React TypeScript definitions
- @types/node — Node.js TypeScript definitions
- @types/react-dom — React DOM TypeScript definitions

## Configuration

**Environment:**
- Development: `npm run dev` starts Vite dev server with hot reload
- Production: `npm run build` generates optimized static exports via `next build`
- Deployment: Vercel (zero-config deployment from Git repository)

**Environment Variables:**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID  # Google Analytics 4 measurement ID (public, safe for client-side)
NANOBANANA_API_KEY            # Image generation API key (server-side only, via .env.local)
NANOBANANA_ENDPOINT           # Image generation API endpoint URL (server-side only)
```

**Build Configuration:**
- `next.config.ts` — Next.js build and runtime settings
- `tsconfig.json` — TypeScript compilation options
- `tailwind.config.ts` — Tailwind CSS theme and custom tokens
- `tailwind.config.ts` — Postprocessor (autoprefixer) configuration
- `components.json` — (If using shadcn-ui or component library registry)

**ESLint & Prettier:**
- `.eslintrc.json` or `eslint.config.js` — Linting rules
- `.prettierrc.json` — Code formatting rules (recommended: `{ "singleQuote": true, "trailingComma": "es5" }`)

## Platform Requirements

**Development:**
- Node.js LTS (18.x or newer)
- npm 8+ or yarn 3+ or pnpm 7+
- Git for version control
- Optional: Docker for consistent development environment

**Production:**
- Vercel hosting (serverless functions for `/api/generate-card` route)
- Edge CDN for static asset distribution
- No database required (stateless, session-only state in browser)
- No external server infrastructure required

**Browser Support:**
- Chrome (latest 2 versions) — Primary target for school Chromebooks
- Safari (latest 2 versions) — Secondary, for iOS devices
- Edge (latest version) — Supported as Chromium-based alternative
- Firefox (latest version) — Supported
- Minimum: ES2020 JavaScript support (no IE11 support)

## Key Performance & Optimization Targets

**Build Size:**
- Total JS bundle: < 150 KB gzipped
- Code splitting: Pre-VR and Post-VR flows split automatically by Next.js route-based code splitting

**Runtime Performance:**
- Landing page LCP (Largest Contentful Paint): < 3 seconds on Chromebook at 25 Mbps
- Screen-to-screen transitions: < 500 ms (client-side state change)
- Card generation (API path): < 5 seconds (NanoBanana API call + Canvas compositing)
- Card generation (fallback): < 1 second (local assets + Canvas compositing)

**Asset Optimization:**
- Images: All illustrations and icons are SVG (resolution-independent, < 50 KB each)
- Icons: Carpenter card icon set stored as SVG in `public/icons/`
- Illustrations: Task tile illustrations in `public/illustrations/`
- Maps: Screen 3 employer map is SVG in `public/map/`
- Pre-generated card backgrounds: Optimized PNG format, max 200 KB each, stored in `public/card-backgrounds/`
- Fonts: Open Sans loaded with `display=swap` to prevent invisible text flash

---

*Stack analysis: 2026-03-19*
