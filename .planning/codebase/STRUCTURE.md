# Codebase Structure

**Analysis Date:** 2026-03-19

## Directory Layout

```
career-explorer/
├── app/
│   ├── layout.tsx                          # Root layout, GA4 script load, font loading
│   ├── page.tsx                            # Landing page — path selection
│   ├── pre-vr/
│   │   ├── page.tsx                        # Pre-VR flow wrapper — SessionProvider, screen routing
│   │   └── components/
│   │       ├── ScreenOne.tsx               # Hook — salary counter, stats
│   │       ├── ScreenTwo.tsx               # Task tiles — selection grid
│   │       ├── ScreenThree.tsx             # Employer map — pins + cards
│   │       ├── ScreenFour.tsx              # Pathway timeline — accordion
│   │       ├── ScreenFive.tsx              # Card builder — inputs + preview
│   │       └── ScreenSix.tsx               # VR prep — prompts + holding
│   ├── post-vr/
│   │   └── page.tsx                        # Bridge page with checklist
│   └── api/
│       └── generate-card/
│           └── route.ts                    # Serverless API proxy for image generation
├── components/
│   ├── Navigation.tsx                      # Screen-to-screen nav (back/next buttons)
│   ├── ProgressBar.tsx                     # Visual progress through Pre-VR
│   ├── TileGrid.tsx                        # Reusable selectable tile component
│   ├── EmployerCard.tsx                    # Popup card for employer details
│   ├── PathwayStep.tsx                     # Expandable accordion step
│   ├── CardPreview.tsx                     # Live card preview during builder
│   ├── ChecklistItem.tsx                   # Checkable list item for bridge
│   └── DownloadButton.tsx                  # Card download handler
├── context/
│   └── SessionContext.tsx                  # React Context for session state (tile selections, name, icon, card)
├── content/
│   ├── carpentry.json                      # All hardcoded content for carpentry occupation
│   └── types.ts                            # TypeScript interface for content schema (OccupationContent)
├── lib/
│   ├── analytics.ts                        # GA4 event tracking utility with event taxonomy
│   ├── card-generator.ts                   # Canvas API card rendering logic
│   ├── image-gen.ts                        # NanoBanana Pro 2 API client
│   └── utils.ts                            # General utilities (e.g., className merger)
├── public/
│   ├── icons/                              # Card builder icons (6 SVGs) — hammer, saw, hard hat, tape measure, goggles, level
│   ├── illustrations/                      # Task tile illustrations (6 SVGs) — one per task category
│   ├── map/                                # Regina area illustrated map (1 SVG)
│   ├── card-backgrounds/                   # Pre-generated fallback card backgrounds (6–12 PNGs)
│   └── logos/                              # myBlueprint logo variants (icon, full wordmark, white variants)
├── styles/
│   └── globals.css                         # Tailwind config overrides, brand tokens, custom animations
├── hooks/
│   └── useSession.ts                       # Optional: custom hook to consume SessionContext
├── tailwind.config.ts                      # Tailwind configuration
├── next.config.ts                          # Next.js configuration
├── package.json                            # Dependencies, scripts
├── tsconfig.json                           # TypeScript configuration
└── components.json                         # shadcn-ui configuration (style: New York, base color: Zinc)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router routes and page components
- Contains: Route segments (pre-vr, post-vr, api), page.tsx entry points, layout orchestration
- Key files: `app/page.tsx` (landing), `app/pre-vr/page.tsx` (Pre-VR wrapper), `app/post-vr/page.tsx` (bridge), `app/layout.tsx` (root)

**`app/pre-vr/`:**
- Purpose: Pre-VR experience routing and screen management
- Contains: Page wrapper component that manages screen state and SessionProvider, all six screen components
- Key files: `page.tsx` (renders currentScreen-based screen routing), `components/ScreenOne.tsx` through `ScreenSix.tsx`

**`app/pre-vr/components/`:**
- Purpose: Individual screen implementations for Pre-VR flow
- Contains: One component per screen (Screen 1–6), each responsible for its own content rendering and user interactions
- Key files: Each ScreenX.tsx file follows pattern: render content from context/content file, handle screen-specific state (e.g., which pathway step is expanded), call analytics events

**`app/post-vr/`:**
- Purpose: Post-VR bridge page routing
- Contains: Bridge page component that displays checklist and congratulations message
- Key files: `page.tsx` (entire bridge page)

**`app/api/`:**
- Purpose: Next.js serverless API routes
- Contains: Backend handlers for external API calls (e.g., image generation proxy)
- Key files: `generate-card/route.ts` (POST handler for card image generation)

**`components/`:**
- Purpose: Reusable shared UI components
- Contains: Stateless presentational components, form controls, interactive patterns used across multiple screens
- Key files: `TileGrid.tsx` (reusable selection grid), `EmployerCard.tsx` (popup), `CardPreview.tsx` (live preview), `DownloadButton.tsx` (file download), navigation and checklist components

**`context/`:**
- Purpose: React Context providers and state definitions
- Contains: Session state shape, context definition, provider component
- Key files: `SessionContext.tsx` (context, provider, useSession hook if included here)

**`content/`:**
- Purpose: Hardcoded occupation-specific content data
- Contains: JSON file per occupation, TypeScript interfaces defining content shape
- Key files: `carpentry.json` (pilot occupation data), `types.ts` (OccupationContent interface)

**`lib/`:**
- Purpose: Shared utility functions and client libraries
- Contains: API clients, helper functions, event tracking utility
- Key files: `analytics.ts` (GA4 event wrapper), `card-generator.ts` (Canvas compositing), `image-gen.ts` (NanoBanana client), `utils.ts` (general helpers)

**`public/`:**
- Purpose: Static assets served directly by Next.js
- Contains: SVG illustrations, PNG backgrounds, logo files
- Key files: `icons/` (6 card builder icons), `illustrations/` (6 task tile illustrations), `map/` (Regina map), `card-backgrounds/` (fallback card PNGs), `logos/` (myBlueprint)

**`styles/`:**
- Purpose: Global CSS and design tokens
- Contains: Tailwind configuration overrides, CSS custom properties for brand colors/spacing, global animations
- Key files: `globals.css`

**`hooks/`:**
- Purpose: Custom React hooks (optional)
- Contains: Reusable hook logic (e.g., useSession wrapper around SessionContext)
- Key files: `useSession.ts` (if included for ergonomics)

## Key File Locations

**Entry Points:**

- `app/layout.tsx`: Root layout; loads GA4 script, sets up fonts, applies global styles
- `app/page.tsx`: Landing page; displays path selection UI
- `app/pre-vr/page.tsx`: Pre-VR flow entry; wraps screens in SessionProvider, manages screen routing
- `app/post-vr/page.tsx`: Bridge page entry; independent of session state

**Configuration:**

- `tailwind.config.ts`: Tailwind customization — breakpoints, brand colors, spacing scale
- `next.config.ts`: Next.js settings — image optimization, environment variables, build config
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies, npm scripts (dev, build, preview, type-check, lint, format)
- `components.json`: shadcn-ui preset configuration

**Core Logic:**

- `content/carpentry.json`: All career data for carpentry occupation (stats, tasks, employers, pathway, icons, checklist)
- `content/types.ts`: TypeScript interface that defines the shape of any occupation's content file
- `lib/analytics.ts`: GA4 event tracking wrapper; all interactive events flow through here
- `lib/card-generator.ts`: Canvas API logic to composite card image from background, name, icon, stats
- `app/api/generate-card/route.ts`: Server-side proxy to NanoBanana API; keeps API key secure

**Testing:**

- No test files specified yet in TECH_SPECS. Once testing is configured, unit tests would likely live alongside source files as `*.test.ts` or `*.spec.ts`, integration tests in `tests/` or `__tests__/` directories.

## Naming Conventions

**Files:**

- **Page components:** PascalCase matching default export and URL segment (e.g., `page.tsx` in `app/post-vr/` is the Post-VR page)
- **Screen components:** `ScreenX.tsx` naming for the six Pre-VR screens; matches story/design numbering
- **Shared components:** PascalCase, descriptive (e.g., `EmployerCard.tsx`, `TileGrid.tsx`)
- **Utility/library files:** camelCase (e.g., `analytics.ts`, `card-generator.ts`)
- **Context files:** Describe the domain (e.g., `SessionContext.tsx` not `state.ts`)
- **Content files:** Occupation name in lowercase (e.g., `carpentry.json`, future `welding.json`)

**Directories:**

- **Route directories:** Lowercase, match URL segments (e.g., `pre-vr/`, `post-vr/`, `api/`)
- **Feature directories:** Descriptive plural when grouping multiple related files (e.g., `components/`, `icons/`, `illustrations/`)
- **Convention:** All directories lowercase except PascalCase reserved for component/type names in file names

## Where to Add New Code

**New Feature (e.g., additional Pre-VR screens in future):**
- Primary code: Add new `ScreenX.tsx` in `app/pre-vr/components/`
- Tests: Add `ScreenX.test.ts` co-located in same directory
- Content: Update `content/carpentry.json` with new screen data or add to `types.ts` interface
- Styling: Component-level styles via Tailwind classes; global tokens in `styles/globals.css`

**New Shared Component (e.g., modal, tooltip):**
- Implementation: Create new file in `components/` (e.g., `Modal.tsx`)
- Import in any screen or component that needs it
- Props interface defined above component with JSDoc comments
- No folder nesting unless component has many internal parts; keep flat for discoverability

**New Utility/Helper (e.g., date formatter, string utilities):**
- Shared helpers: Add to `lib/utils.ts` or create a new focused file (e.g., `lib/string-utils.ts`)
- API client code: Add to `lib/image-gen.ts` or create new client file (e.g., `lib/myblueprint-api.ts`)
- Each utility should be a pure function or class with clear imports/exports

**New Occupation Content (e.g., welding):**
- Create `content/welding.json` with same structure as `carpentry.json` (must conform to `types.ts` OccupationContent interface)
- Create new occupation-specific route (e.g., `app/pre-vr-welding/page.tsx`) or parameterize existing `/pre-vr` to accept occupation slug
- No new screen component code needed — screens are generic and parameterized by content

**New Analytics Event:**
- Define event name in `lib/analytics.ts` comments (list all events there)
- Call `trackEvent(eventName, params)` from any component
- Event names follow snake_case taxonomy defined in TECH_SPECS Section 6.2

**New API Endpoint (e.g., feedback submission):**
- Create route file: `app/api/submit-feedback/route.ts`
- Implement handler function (GET, POST, etc.)
- Keep API routes thin; move business logic to `lib/` if complex

## Special Directories

**`public/`:**
- Purpose: Static assets served directly by Next.js at root path
- Generated: No, manually maintained
- Committed: Yes, all SVGs and PNGs are committed

**`public/card-backgrounds/`:**
- Purpose: Pre-generated card background variants (6–12 optimized PNGs) for fallback when API generation fails
- Generated: No, these are designed assets created ahead of time
- Committed: Yes
- Usage: `lib/card-generator.ts` selects one deterministically based on selection hash if NanoBanana API fails

**`public/icons/`, `public/illustrations/`, `public/map/`:**
- Purpose: SVG assets for UI rendering (card icons, task tile illustrations, employer map)
- Generated: No, designed and optimized by design team
- Committed: Yes
- Usage: Imported or referenced in component `src` attributes

**`next/`** (auto-generated, git-ignored):
- Contains: Next.js build artifacts, `.next/cache/`, `.next/static/`
- Do NOT commit; included in `.gitignore`

**`node_modules/`** (git-ignored):
- Contains: Installed npm dependencies
- Do NOT commit; use `npm install` to recreate

**`dist/`, `build/`** (if applicable, git-ignored):
- Contains: Production build output from `npm run build`
- Do NOT commit; regenerated on each build

## File Structure Decisions

**Co-located Screen Components:**
Screen components live in `app/pre-vr/components/` alongside `page.tsx` to keep the Pre-VR feature self-contained. This makes it easy to understand the full Pre-VR architecture in one directory.

**Content as JSON + TypeScript Interface:**
Using JSON for content data (`content/carpentry.json`) with a TypeScript interface (`content/types.ts`) allows non-technical content managers to update occupation data without touching code, while TypeScript ensures type safety at compile time.

**API Proxy Pattern:**
Sensitive API keys (NanoBanana) are kept server-side in `app/api/generate-card/route.ts`. Client-side requests hit the proxy, which handles the actual external API call. This prevents key exposure and allows request validation.

**Flat Component Structure:**
`components/` remains flat (no nested subdirectories) to keep reusable components easily discoverable and avoid over-organization. Even large components like `CardPreview.tsx` don't nest child components in subdirectories.

**Centralized Tokens in globals.css:**
All brand colors, spacing, typography are defined as CSS custom properties in `styles/globals.css` and referenced via Tailwind config. This single source of truth makes design updates straightforward.

---

*Structure analysis: 2026-03-19*
