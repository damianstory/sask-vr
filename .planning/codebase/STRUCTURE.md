# Codebase Structure

**Analysis Date:** 2026-04-03

## Directory Layout

```
project-root/
├── app/                        # Next.js App Router pages and layouts
│   ├── layout.tsx              # Root layout: fonts, skip link, GA script
│   ├── page.tsx                # Landing page (path selector)
│   ├── favicon.ico
│   ├── pre-vr/
│   │   ├── page.tsx            # Pre-VR wizard orchestrator (6 screens)
│   │   └── components/         # Screen components scoped to pre-vr route
│   │       ├── ScreenOne.tsx   # Salary reveal with odometer animation
│   │       ├── ScreenTwo.tsx   # Task tile picker (multi-select)
│   │       ├── ScreenThree.tsx # Employer map (lazy-loaded)
│   │       ├── ScreenFour.tsx  # Career pathway steps
│   │       ├── ScreenFive.tsx  # Card builder (name + icon + download)
│   │       ├── ScreenSix.tsx   # Discussion prompts
│   │       ├── CardPreview.tsx # Live CSS card preview
│   │       ├── IconPicker.tsx  # Icon selection grid
│   │       └── TaskTagChips.tsx# Selected tile chip display
│   └── post-vr/
│       └── page.tsx            # Post-VR reflection checklist
├── components/                 # Shared UI components (used across routes)
│   ├── Navigation.tsx          # Sticky bottom prev/next bar
│   └── ProgressBar.tsx         # Sticky top dot progress indicator
├── content/                    # Occupation content — data layer
│   ├── config.ts               # Active occupation selector (change here to swap)
│   ├── types.ts                # OccupationContent TypeScript interface
│   └── carpentry.json          # Carpentry occupation data (copy + structured data)
├── context/                    # React Context providers
│   └── SessionContext.tsx      # Pre-VR session state (tiles, name, icon, cardUrl)
├── lib/                        # Pure utilities and side-effect helpers
│   ├── analytics.ts            # Typed GA4 event wrappers
│   ├── generate-card.ts        # Canvas API PNG compositor
│   ├── card-gradients.ts       # Gradient palette + hash picker
│   └── utils.ts                # cn() classname merger
├── styles/
│   └── globals.css             # Tailwind v4 import, CSS variables (design tokens), keyframes
├── tests/                      # All test files (flat, not co-located)
│   ├── a11y/                   # Accessibility-specific test files
│   ├── landing.test.tsx
│   ├── pre-vr-flow.test.tsx
│   ├── screen-one.test.tsx … screen-six.test.tsx
│   ├── generate-card.test.ts
│   ├── analytics.test.ts
│   ├── content-schema.test.ts
│   ├── card-gradients.test.ts
│   ├── progress-bar.test.tsx
│   ├── post-vr.test.tsx
│   ├── vitest.setup.ts
│   └── vitest-axe.d.ts
├── public/
│   └── logos/                  # Static brand assets (myBlueprint logo etc.)
├── .planning/                  # GSD planning artefacts (not shipped)
│   ├── codebase/               # This directory — codebase analysis docs
│   ├── phases/                 # Phase implementation plans
│   └── research/               # Background research notes
├── next.config.ts              # Next.js config (bundle analyzer enabled via ANALYZE=true)
├── vitest.config.ts            # Vitest config
├── tsconfig.json               # TypeScript config (path alias @/ → ./src is NOT used — alias is @/ → root)
├── postcss.config.mjs          # PostCSS config for Tailwind
├── eslint.config.mjs           # ESLint flat config
├── .prettierrc.json            # Prettier config
├── PRD.md                      # Product requirements document
├── TECH_SPECS.md               # Technical specifications
└── DESIGN_SPECS.md             # Design specifications
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router route segments; each subdirectory is a URL route
- Contains: Page components, root layout, favicon
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/pre-vr/page.tsx`, `app/post-vr/page.tsx`

**`app/pre-vr/components/`:**
- Purpose: Screen-scoped components used only within the Pre-VR wizard; not shared elsewhere
- Contains: One file per screen (ScreenOne–ScreenSix) plus sub-components for ScreenFive (CardPreview, IconPicker, TaskTagChips)
- Key files: `ScreenFive.tsx` (most complex — card builder with Canvas download), `ScreenThree.tsx` (lazy-loaded employer map)

**`components/`:**
- Purpose: Route-agnostic shared UI components
- Contains: `Navigation.tsx`, `ProgressBar.tsx`
- Note: Only used in Pre-VR flow currently but intentionally placed here for reuse

**`content/`:**
- Purpose: Occupation content data layer; all user-visible copy lives here
- Key files: `config.ts` is the single import point — all screens import `content` from here, never from JSON directly; `types.ts` defines `OccupationContent` interface

**`context/`:**
- Purpose: React Context providers for cross-component state
- Contains: `SessionContext.tsx` — only context in the app; scoped to Pre-VR flow

**`lib/`:**
- Purpose: Framework-agnostic utility functions and thin integration wrappers
- Note: `generate-card.ts` uses browser APIs (Canvas, `document`) — cannot run server-side

**`styles/`:**
- Purpose: Global styles only; Tailwind utility classes go inline in components
- Key file: `globals.css` — defines all CSS custom property design tokens (`--myb-*`, `--radius-*`, `--shadow-*`, `--motion-*`) and custom animation classes

**`tests/`:**
- Purpose: All test files in a flat directory; not co-located with source
- Contains: Unit tests for lib functions, component integration tests, a11y tests
- Key files: `pre-vr-flow.test.tsx` (end-to-end wizard flow), `screen-five.test.tsx` (most complex test)

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, fonts, GA, skip link
- `app/page.tsx`: Landing page — first thing the user sees
- `app/pre-vr/page.tsx`: Pre-VR wizard orchestrator
- `app/post-vr/page.tsx`: Post-VR reflection page

**Configuration:**
- `content/config.ts`: Occupation switcher — change `OCCUPATION` and import here to add a new career
- `content/types.ts`: Add fields here when extending occupation data schema
- `styles/globals.css`: All design tokens defined as CSS custom properties
- `next.config.ts`: Next.js and bundle analyzer configuration
- `vitest.config.ts`: Test runner configuration

**Core Logic:**
- `context/SessionContext.tsx`: Pre-VR session state shape and provider
- `lib/generate-card.ts`: Canvas card generation — the most complex utility
- `lib/analytics.ts`: All analytics event functions

**Testing:**
- `tests/vitest.setup.ts`: Global test setup
- `tests/a11y/`: Accessibility-specific tests

## Naming Conventions

**Files:**
- React components: PascalCase matching the default export — `ScreenOne.tsx`, `Navigation.tsx`, `CardPreview.tsx`
- Utilities/libs: kebab-case — `generate-card.ts`, `card-gradients.ts`
- Tests: kebab-case mirroring source — `screen-one.test.tsx`, `generate-card.test.ts`
- Content data: kebab-case — `carpentry.json`
- Context files: PascalCase with suffix — `SessionContext.tsx`

**Directories:**
- Route segments: kebab-case matching URL — `pre-vr/`, `post-vr/`
- Semantic groupings: lowercase — `components/`, `context/`, `lib/`, `content/`, `styles/`, `tests/`

**CSS Custom Properties:**
- Brand tokens: `--myb-*` prefix — `--myb-primary-blue`, `--myb-navy`
- Layout tokens: descriptive — `--radius-card`, `--shadow-float`, `--motion-medium`
- Animation classes: `animate-` prefix — `animate-slide-left`, `animate-check-bounce`

## Where to Add New Code

**New Occupation (e.g., welding):**
- Add JSON data file: `content/welding.json` (must satisfy `OccupationContent` interface in `content/types.ts`)
- Update active occupation: `content/config.ts` — change import and `OCCUPATION` constant

**New Pre-VR Screen:**
- Implement screen: `app/pre-vr/components/ScreenSeven.tsx`
- Register in screens map: `app/pre-vr/page.tsx` — add to `screens` Record and update `ScreenNumber` type and `total` count
- Add test: `tests/screen-seven.test.tsx`

**New Shared UI Component:**
- Implementation: `components/ComponentName.tsx`

**New Screen-Scoped Sub-Component (only used within Pre-VR):**
- Implementation: `app/pre-vr/components/SubComponentName.tsx`

**New Utility Function:**
- Shared helpers: `lib/` — add to existing file if closely related, or create new kebab-case file

**New Analytics Event:**
- Add typed function to `lib/analytics.ts`; call `track()` internally

**New CSS Design Token:**
- Add to `:root` block in `styles/globals.css`; if it should be available as a Tailwind color, also register in `@theme inline`

**New Test:**
- Unit test for a lib function: `tests/[lib-name].test.ts`
- Component/integration test: `tests/[component-name].test.tsx`
- Accessibility test: `tests/a11y/[component-name].a11y.test.tsx`

## Special Directories

**`.planning/`:**
- Purpose: GSD workflow artefacts — phase plans, codebase analysis, research
- Generated: No
- Committed: Yes (planning documents are source-controlled)

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No (in .gitignore)

**`public/logos/`:**
- Purpose: Static brand assets served at `/logos/*`
- Generated: No
- Committed: Yes

**`tests/a11y/`:**
- Purpose: Accessibility tests using vitest-axe
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-03*
