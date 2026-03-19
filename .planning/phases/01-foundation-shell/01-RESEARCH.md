# Phase 1: Foundation + Shell - Research

**Researched:** 2026-03-19
**Domain:** Next.js App Router project scaffold, React Context state management, content-driven architecture, CSS design tokens
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield Next.js App Router project that creates the complete scaffold for a career explorer micro-site. The core deliverables are: project initialization with Tailwind CSS and TypeScript, three routes (landing `/`, pre-vr `/pre-vr`, post-vr `/post-vr`), a typed content schema (`carpentry.json` + `OccupationContent` interface), React Context for session state, a segmented progress indicator, screen-to-screen slide transitions, and placeholder layout shells for all six Pre-VR screens plus the Post-VR page. All screen content is data-driven from JSON from day one.

The stack is fully prescribed by TECH_SPECS and STACK.md: Next.js App Router, React 18, Tailwind CSS, TypeScript strict mode, deployed to Vercel with static generation (SSG). No decisions need to be made about technology choices -- the specs are explicit. The research focus is on correct Next.js App Router patterns for this single-route-with-internal-screens architecture, proper React Context setup for the session state provider, Tailwind CSS custom property integration for the brand token system, and screen transition animation patterns that respect `prefers-reduced-motion`.

**Primary recommendation:** Scaffold with `create-next-app` using App Router + Tailwind + TypeScript, then build the content layer (types + JSON) first so all components consume data from day one. Keep the Pre-VR page as a single client component that manages screen state via `useState` and wraps children in a `SessionProvider`.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Progress indicator: segmented dots style -- six dots in a row, filled for completed/current, hollow for upcoming. Primary Blue filled, Neutral-3 hollow. Current dot has subtle pulse animation (scale 1.0-1.2, 2s loop), respecting prefers-reduced-motion. Text label below: "3 of 6" format. Positioned top center.
- Landing page copy: first-person casual tone ("I'm about to do VR" / "I just finished VR"). myBlueprint logo at top + occupation title heading. Subtext hardcoded (not from JSON). Pre-VR subtext: "Learn what carpentry in Saskatchewan is really like." Post-VR subtext: Claude's discretion matching same tone.
- Placeholder screen depth: layout shells with real structure -- correct layout grids, section containers, placeholder shapes matching DESIGN_SPECS. Data-driven from carpentry.json. Static gray boxes (Neutral-1 bg, Neutral-2 borders), not shimmer/skeleton. Back/Next navigation fully functional with slide transitions, disabled states, progress dot updates.
- Content schema: carpentry.json organized by screen (screen1-screen6, postVr). All copy in JSON. Top-level "meta" or "landing" section. Obvious dummy data (Task 1, Company A, salary = 99999). TypeScript interface (OccupationContent) enforces schema.

### Claude's Discretion
- Post-VR card subtext wording (matching casual tone)
- Exact slide transition easing and duration (DESIGN_SPECS says 400ms ease-out)
- Session state shape and React Context structure
- TypeScript interface field naming conventions
- ESLint/Prettier configuration details
- Tailwind config token setup
- File/folder naming within the prescribed structure

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAND-01 | Student can select Pre-VR or Post-VR path from two large, visually distinct tap targets on the landing page | Landing page component with two `<button>` cards using Next.js `useRouter().push()` for navigation. DESIGN_SPECS 3.1 specifies card dimensions (400x280 desktop, full-width 180px mobile), hover states, and accessibility requirements. |
| LAND-02 | Landing page loads and is fully interactive within 3 seconds on a school Chromebook | Next.js SSG via `output: 'export'` or default static generation. Open Sans loaded via `next/font/google` with `display: swap`. Minimal JS on landing page. |
| LAND-03 | Post-VR bridge page is directly accessible via URL (/post-vr) for QR code entry | Standard App Router route at `app/post-vr/page.tsx`. No auth gate, no redirect. Independent of session state. |
| LAND-04 | Landing page adapts to single-column layout on mobile with minimum 44x44px touch targets | Mobile-first Tailwind: cards stacked at base, `sm:flex-row` or `md:grid-cols-2` for side-by-side. Min touch target enforced via `min-h-[44px] min-w-[44px]`. |
| FLOW-01 | Pre-VR experience is a single route (/pre-vr) with six screens managed by internal React state | Single `app/pre-vr/page.tsx` with `'use client'` directive, `useState<1\|2\|3\|4\|5\|6>` for screen routing, conditional rendering of ScreenOne through ScreenSix components. |
| FLOW-02 | Student can navigate forward and backward through all six screens without losing session state | React Context (SessionProvider) wraps the Pre-VR flow. State persists across screen changes because it lives in the parent component/context, not in individual screens. |
| FLOW-03 | Visual progress bar shows current position in the six-screen flow | ProgressBar component with six dot segments. Current screen determines filled/hollow state. Text label "X of 6". |
| FLOW-04 | Screen transitions use smooth slide animations (respecting prefers-reduced-motion) | CSS transitions or `framer-motion` (lightweight). Slide-left for forward, slide-right for backward. 400ms ease-out per DESIGN_SPECS 4.2. `prefers-reduced-motion` media query disables animation. |
| CONT-01 | All screen content stored in a single JSON file per occupation (carpentry.json) | `content/carpentry.json` with top-level keys per screen. Imported directly in components. |
| CONT-02 | TypeScript interfaces define the content schema | `content/types.ts` with `OccupationContent` interface matching TECH_SPECS 3.1 schema definition. |
| CONT-03 | Adding a new occupation requires only a new JSON file -- no code changes | Generic screen components that accept content props typed as sections of `OccupationContent`. No hardcoded carpentry-specific logic in components. |
| CONT-04 | Placeholder content populated for all screens (salary, tasks, employers, pathway, checklist) | carpentry.json populated with obvious dummy data (Task 1, Company A, 99999) for every screen section. |
| PERF-05 | Deployed on Vercel with static generation (SSG) | Next.js default behavior with App Router. No dynamic server routes needed in Phase 1. Vercel deployment via Git push. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.0 | App Router framework, SSG, routing | Prescribed by TECH_SPECS; team default |
| react | 19.2.4 | UI components, state management | Latest stable; pairs with Next.js 16 |
| react-dom | 19.2.4 | DOM rendering | Required by React |
| typescript | 5.9.3 | Type safety, strict mode | Prescribed by TECH_SPECS |
| tailwindcss | 4.2.2 | Utility-first CSS | Prescribed by TECH_SPECS |

**Note on React version:** Next.js 16 ships with React 19. The TECH_SPECS reference "React 18" but `create-next-app` will install React 19 by default. React 19 is fully backward-compatible for this use case (useState, useContext, client components). No API differences affect Phase 1 patterns.

**Note on Tailwind version:** Tailwind CSS v4 is the current major version. It uses a CSS-first configuration approach (no `tailwind.config.ts` by default -- configuration happens in CSS via `@theme`). This differs from the v3-style `tailwind.config.ts` referenced in TECH_SPECS. The planner should account for v4 patterns.

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| autoprefixer | 10.4.27 | CSS vendor prefixing | Always -- included in Tailwind setup |
| postcss | 8.5.8 | CSS processing pipeline | Always -- required by Tailwind |
| class-variance-authority | 0.7.1 | Component variant patterns | If creating variant-heavy components |
| eslint | 10.0.3 | Code linting | Development tooling |
| prettier | 3.8.1 | Code formatting | Development tooling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transitions for screen slides | framer-motion | Adds ~15KB gzipped; CSS is sufficient for slide-left/right. Use CSS for Phase 1, upgrade only if animation needs grow. |
| React Context for state | zustand | Overkill for 4 state fields. Context is prescribed by TECH_SPECS and appropriate for this scope. |
| next/font/google | Manual @font-face | next/font handles self-hosting, preloading, and display:swap automatically. Always prefer it. |

**Installation (via create-next-app):**
```bash
npx create-next-app@latest career-explorer --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

Then add Prettier:
```bash
npm install --save-dev prettier eslint-config-prettier
```

## Architecture Patterns

### Recommended Project Structure
```
career-explorer/
├── app/
│   ├── layout.tsx              # Root layout: fonts, global styles, metadata
│   ├── page.tsx                # Landing page: path selection
│   ├── pre-vr/
│   │   ├── page.tsx            # 'use client' -- screen state, SessionProvider, transitions
│   │   └── components/
│   │       ├── ScreenOne.tsx   # Placeholder shell -- hook/salary
│   │       ├── ScreenTwo.tsx   # Placeholder shell -- task tiles
│   │       ├── ScreenThree.tsx # Placeholder shell -- employer map
│   │       ├── ScreenFour.tsx  # Placeholder shell -- career pathway
│   │       ├── ScreenFive.tsx  # Placeholder shell -- card builder
│   │       └── ScreenSix.tsx   # Placeholder shell -- VR prep
│   └── post-vr/
│       └── page.tsx            # Bridge page placeholder
├── components/
│   ├── Navigation.tsx          # Back/Next buttons for Pre-VR flow
│   └── ProgressBar.tsx         # Segmented dots progress indicator
├── context/
│   └── SessionContext.tsx      # React Context + Provider + useSession hook
├── content/
│   ├── carpentry.json          # All placeholder content
│   └── types.ts                # OccupationContent interface
├── lib/
│   └── utils.ts                # cn() utility (className merger)
├── styles/
│   └── globals.css             # Tailwind directives + brand CSS tokens
├── public/
│   └── logos/                  # myBlueprint logo (placeholder for Phase 1)
├── tailwind.config.ts          # Brand tokens, custom breakpoints (if using Tailwind v3 config style)
├── next.config.ts
├── tsconfig.json
├── .prettierrc.json
└── package.json
```

### Pattern 1: Single Route with Internal Screen State
**What:** The Pre-VR experience lives at one route (`/pre-vr`) and manages six screens via React `useState`. No URL changes between screens.
**When to use:** When screens share state and URL-based navigation would add complexity without benefit.
**Example:**
```typescript
// app/pre-vr/page.tsx
'use client'

import { useState } from 'react'
import { SessionProvider } from '@/context/SessionContext'
import ScreenOne from './components/ScreenOne'
import ScreenTwo from './components/ScreenTwo'
// ... other screens

type ScreenNumber = 1 | 2 | 3 | 4 | 5 | 6

export default function PreVRPage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenNumber>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const goNext = () => {
    if (currentScreen < 6) {
      setDirection('forward')
      setCurrentScreen((prev) => (prev + 1) as ScreenNumber)
    }
  }

  const goPrev = () => {
    if (currentScreen > 1) {
      setDirection('backward')
      setCurrentScreen((prev) => (prev - 1) as ScreenNumber)
    }
  }

  const screens: Record<ScreenNumber, React.ReactNode> = {
    1: <ScreenOne />,
    2: <ScreenTwo />,
    3: <ScreenThree />,
    4: <ScreenFour />,
    5: <ScreenFive />,
    6: <ScreenSix />,
  }

  return (
    <SessionProvider>
      <ProgressBar current={currentScreen} total={6} />
      <div className="relative overflow-hidden">
        <div
          key={currentScreen}
          className={`animate-${direction === 'forward' ? 'slide-left' : 'slide-right'}`}
        >
          {screens[currentScreen]}
        </div>
      </div>
      <Navigation
        currentScreen={currentScreen}
        onNext={goNext}
        onPrev={goPrev}
      />
    </SessionProvider>
  )
}
```

### Pattern 2: React Context for Session State
**What:** A context provider wraps the Pre-VR flow to share state (tile selections, name, icon) across screens without prop drilling.
**When to use:** When multiple sibling components need shared mutable state.
**Example:**
```typescript
// context/SessionContext.tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface SessionState {
  selectedTiles: string[]
  firstName: string
  selectedIcon: string | null
  generatedCardUrl: string | null
}

interface SessionContextValue extends SessionState {
  setSelectedTiles: (tiles: string[]) => void
  setFirstName: (name: string) => void
  setSelectedIcon: (iconId: string | null) => void
  setGeneratedCardUrl: (url: string | null) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([])
  const [firstName, setFirstName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null)

  return (
    <SessionContext.Provider
      value={{
        selectedTiles,
        firstName,
        selectedIcon,
        generatedCardUrl,
        setSelectedTiles,
        setFirstName,
        setSelectedIcon,
        setGeneratedCardUrl,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
```

### Pattern 3: CSS-Only Screen Transitions
**What:** Slide transitions using CSS `@keyframes` and Tailwind utility classes, with `prefers-reduced-motion` override.
**When to use:** When animations are simple (slide left/right) and adding a library is unnecessary.
**Example:**
```css
/* styles/globals.css */
@keyframes slide-left-enter {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-right-enter {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-left {
  animation: slide-left-enter 400ms ease-out;
}

.animate-slide-right {
  animation: slide-right-enter 400ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-left,
  .animate-slide-right {
    animation: none;
  }
}
```

### Pattern 4: Brand Tokens as CSS Custom Properties
**What:** Define all brand colors, spacing, and typography as CSS custom properties in globals.css, then reference them in Tailwind config.
**When to use:** Always -- this is the prescribed single source of truth for design tokens.
**Example:**
```css
/* styles/globals.css */
@layer base {
  :root {
    --myb-primary-blue: #0092FF;
    --myb-navy: #22224C;
    --myb-light-blue: #C6E7FF;
    --myb-off-white: #F6F6FF;
    --myb-neutral-1: #E5E9F1;
    --myb-neutral-2: #D9DFEA;
    --myb-neutral-3: #AAB7CB;
    --myb-neutral-4: #65738B;
    --myb-neutral-5: #485163;
    --myb-neutral-6: #252A33;
    --myb-blue-dark: #0070CC;
    --myb-blue-vivid: #3DA8FF;
    --myb-navy-light: #3A3A6B;
    --myb-light-blue-soft: #E0F0FF;

    --space-1: 4px;
    --space-2: 8px;
    --space-3: 16px;
    --space-4: 24px;
    --space-5: 32px;
    --space-6: 48px;
    --space-7: 64px;
  }
}
```

### Anti-Patterns to Avoid
- **Using `<Link>` for screen navigation within Pre-VR:** Screens are not routes. Using Next.js `<Link>` would cause full page navigation and lose state. Use `useState` and conditional rendering instead.
- **Hardcoding content strings in components:** All text must come from `carpentry.json` (except landing page subtext which is hardcoded per decision). This ensures CONT-03 (new occupation = new JSON file only).
- **Putting SessionProvider in root layout:** Session state is only needed for Pre-VR. Placing it in root layout would waste resources and create confusion about scope. Wrap only the Pre-VR page.
- **Using `'use client'` on every component:** Only the Pre-VR page wrapper and components that use hooks need the client directive. Screen components that just render content from props can remain server-compatible (though in practice they will be rendered inside a client boundary).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading & optimization | Manual @font-face with preload links | `next/font/google` for Open Sans | Handles self-hosting, preloading, `font-display: swap`, and CLS prevention automatically |
| CSS class merging | String concatenation for conditional classes | `clsx` or `cn()` utility (Tailwind merge pattern) | Handles conditional classes, deduplication, and Tailwind conflict resolution |
| Path aliases | Relative import paths (`../../lib/`) | `@/*` alias in tsconfig.json | Prescribed by conventions; `create-next-app` sets this up with `--import-alias` flag |
| Static generation config | Manual export configuration | Next.js default App Router SSG behavior | Pages without dynamic data are automatically static in App Router |

**Key insight:** Next.js App Router handles most infrastructure concerns (routing, SSG, font loading, code splitting) out of the box. Phase 1 should leverage defaults heavily and avoid custom configuration unless the specs demand it.

## Common Pitfalls

### Pitfall 1: Tailwind CSS v4 Configuration Differences
**What goes wrong:** TECH_SPECS references `tailwind.config.ts` (v3 pattern), but `create-next-app` with latest Tailwind installs v4 which uses CSS-first configuration via `@theme` in the CSS file.
**Why it happens:** The specs were written assuming Tailwind v3. Current npm installs v4.
**How to avoid:** Either: (a) use Tailwind v4 CSS-first config and define custom tokens in `globals.css` using `@theme`, or (b) explicitly install Tailwind v3 for spec alignment. Recommendation: use v4 since CSS custom properties for brand tokens already live in globals.css per the design. The `@theme` directive in v4 maps directly to this pattern.
**Warning signs:** If `tailwind.config.ts` has no effect on styles, you are on v4 and need to use CSS config instead.

### Pitfall 2: Missing 'use client' Directive
**What goes wrong:** Components using `useState`, `useContext`, or event handlers fail to render with cryptic errors about hooks being called outside a component.
**Why it happens:** Next.js App Router defaults to Server Components. Any component using React hooks must be explicitly marked as a Client Component.
**How to avoid:** Add `'use client'` at the top of: `app/pre-vr/page.tsx`, `context/SessionContext.tsx`, `components/ProgressBar.tsx` (if it uses the pulse animation state), and `components/Navigation.tsx`.
**Warning signs:** Error messages mentioning "useState is not a function" or "hooks can only be called inside a function component."

### Pitfall 3: Screen Transition Animation Flash on Mount
**What goes wrong:** The first screen animates in on page load (slides in from right) when it should just appear.
**Why it happens:** The animation class is applied unconditionally on first render.
**How to avoid:** Track whether this is the initial mount. Skip animation for the first screen render. Only apply slide animation when `currentScreen` changes.
**Warning signs:** Visual flash or slide-in animation when first navigating to `/pre-vr`.

### Pitfall 4: JSON Import Typing
**What goes wrong:** Importing `carpentry.json` gives it a generic type instead of `OccupationContent`, allowing type mismatches to go undetected.
**Why it happens:** TypeScript infers JSON import types from the file content, not from your interface.
**How to avoid:** Either: (a) import and assert type: `import data from './carpentry.json'; const content = data as OccupationContent`, or (b) use a loader function that validates against the interface. Option (a) is simpler for Phase 1.
**Warning signs:** No type errors when JSON structure deviates from the interface.

### Pitfall 5: Landing Page Cards as Non-Interactive Elements
**What goes wrong:** Cards are built with `<div onClick>` instead of `<button>`, breaking keyboard navigation and screen reader accessibility.
**Why it happens:** Visual cards "look" like divs, not buttons.
**How to avoid:** DESIGN_SPECS 3.1 explicitly states: "Cards are `<button>` elements (not `<a>` tags or `<div>` with `onClick`)." Use semantic `<button>` elements with proper `aria-label`.
**Warning signs:** Tab key skips the cards; no focus ring visible.

## Code Examples

### Next.js Font Loading with next/font
```typescript
// app/layout.tsx
import { Open_Sans } from 'next/font/google'
import '@/styles/globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const metadata = {
  title: 'Carpentry Career Explorer',
  description: 'Explore what carpentry in Saskatchewan is really like',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="bg-myb-off-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Landing Page Card Component
```typescript
// app/page.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo + heading */}
      <h1 className="text-2xl font-black text-myb-navy md:text-4xl">
        Carpentry Career Explorer
      </h1>

      <div className="mt-8 flex w-full max-w-[824px] flex-col gap-4 md:flex-row md:gap-6">
        <button
          onClick={() => router.push('/pre-vr')}
          className="flex-1 rounded-xl bg-myb-light-blue p-6 text-left
                     transition-shadow hover:shadow-lg
                     focus:outline-none focus:ring-3 focus:ring-myb-primary-blue focus:ring-offset-3
                     min-h-[180px] md:min-h-[280px]"
          aria-label="Start Pre-VR experience: Learn what carpentry in Saskatchewan is really like"
        >
          <span className="text-xl font-black text-myb-navy md:text-2xl">
            I&apos;m about to do VR
          </span>
          <p className="mt-2 text-base font-light text-myb-neutral-5">
            Learn what carpentry in Saskatchewan is really like.
          </p>
        </button>

        <button
          onClick={() => router.push('/post-vr')}
          className="flex-1 rounded-xl bg-myb-light-blue p-6 text-left
                     transition-shadow hover:shadow-lg
                     focus:outline-none focus:ring-3 focus:ring-myb-primary-blue focus:ring-offset-3
                     min-h-[180px] md:min-h-[280px]"
          aria-label="Go to Post-VR reflection: Reflect on your VR carpentry experience"
        >
          <span className="text-xl font-black text-myb-navy md:text-2xl">
            I just finished VR
          </span>
          <p className="mt-2 text-base font-light text-myb-neutral-5">
            Reflect on what you just experienced.
          </p>
        </button>
      </div>
    </main>
  )
}
```

### Progress Bar with Pulse Animation
```typescript
// components/ProgressBar.tsx
'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex gap-2" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }, (_, i) => {
          const screenNum = i + 1
          const isCurrent = screenNum === current
          const isCompleted = screenNum < current

          return (
            <div
              key={screenNum}
              className={`h-3 w-3 rounded-full transition-colors
                ${isCompleted || isCurrent
                  ? 'bg-myb-primary-blue'
                  : 'bg-myb-neutral-3'
                }
                ${isCurrent ? 'animate-pulse-dot' : ''}
              `}
              aria-hidden="true"
            />
          )
        })}
      </div>
      <span className="text-sm font-medium text-myb-neutral-4">
        {current} of {total}
      </span>
    </div>
  )
}
```

### Placeholder Screen Shell Pattern
```typescript
// app/pre-vr/components/ScreenOne.tsx
import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

const data = (content as OccupationContent).screenOne

export default function ScreenOne() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      {/* Heading placeholder */}
      <h2 className="text-center text-2xl font-black text-myb-navy md:text-4xl">
        {data.hookQuestion}
      </h2>

      {/* Salary counter placeholder -- static gray box for Phase 1 */}
      <div className="mt-8 flex h-24 w-64 items-center justify-center rounded-lg border border-myb-neutral-2 bg-myb-neutral-1">
        <span className="text-3xl font-black text-myb-navy md:text-5xl">
          ${data.salary.amount.toLocaleString()}
        </span>
      </div>

      {/* Stats cards placeholder */}
      <div className="mt-6 grid w-full max-w-lg gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-lg border border-myb-neutral-2 bg-myb-neutral-1 p-4"
          >
            <div className="text-2xl font-black text-myb-navy">{stat.value}</div>
            <div className="text-sm font-medium text-myb-neutral-4">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 JS config (`tailwind.config.ts`) | Tailwind v4 CSS-first config (`@theme` in CSS) | Jan 2025 | Config tokens defined in CSS, not JS. Simpler for projects already using CSS custom properties. |
| `next/font` as separate package | Built into `next/font/google` | Next.js 13.2+ (stable) | No extra install needed. Part of core Next.js. |
| Pages Router (`pages/`) | App Router (`app/`) | Next.js 13.4+ (stable) | Server Components by default, layouts, nested routing. All new Next.js projects should use App Router. |
| React 18 `createRoot` | React 19 (ships with Next.js 15+) | Dec 2024 | Automatic batching improvements, `use()` hook, but no breaking changes for useState/useContext patterns. |

**Deprecated/outdated:**
- `@next/font` package: Merged into `next/font` -- do not install separately
- `getStaticProps` / `getServerSideProps`: App Router uses different data fetching patterns (async Server Components). Not relevant for Phase 1 since all content is static JSON imports.
- Tailwind v3 `tailwind.config.js`/`.ts`: Still works if explicitly installed, but v4 is current default

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No test framework configured yet (greenfield project) |
| Config file | None -- Wave 0 gap |
| Quick run command | `npx vitest run --reporter=verbose` (after setup) |
| Full suite command | `npx vitest run` (after setup) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAND-01 | Two path cards render and navigate to correct routes | integration | `npx vitest run tests/landing.test.tsx -t "path cards"` | No -- Wave 0 |
| LAND-03 | /post-vr route renders independently | smoke | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/post-vr` | N/A (manual) |
| LAND-04 | Cards stack on mobile, 44px min touch targets | manual-only | Visual inspection at 375px viewport | N/A |
| FLOW-01 | Pre-VR renders 6 screens via state | unit | `npx vitest run tests/pre-vr-flow.test.tsx -t "screen navigation"` | No -- Wave 0 |
| FLOW-02 | State preserved across back/forward navigation | unit | `npx vitest run tests/pre-vr-flow.test.tsx -t "state preservation"` | No -- Wave 0 |
| FLOW-03 | Progress bar reflects current screen | unit | `npx vitest run tests/progress-bar.test.tsx` | No -- Wave 0 |
| FLOW-04 | Slide animation applies, reduced-motion respected | unit | `npx vitest run tests/pre-vr-flow.test.tsx -t "transitions"` | No -- Wave 0 |
| CONT-01 | carpentry.json importable and structured correctly | unit | `npx vitest run tests/content-schema.test.ts` | No -- Wave 0 |
| CONT-02 | OccupationContent interface validates JSON | unit | `npx vitest run tests/content-schema.test.ts -t "type validation"` | No -- Wave 0 |
| CONT-04 | All screen sections populated with placeholder data | unit | `npx vitest run tests/content-schema.test.ts -t "all sections populated"` | No -- Wave 0 |
| PERF-05 | Builds successfully for static deployment | smoke | `npm run build` | N/A (build command) |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npm run build && npm run type-check`
- **Phase gate:** Full suite green + successful `npm run build` before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install vitest + @testing-library/react: `npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Create `vitest.config.ts` with React plugin and jsdom environment
- [ ] `tests/content-schema.test.ts` -- validates carpentry.json against OccupationContent
- [ ] `tests/progress-bar.test.tsx` -- covers FLOW-03
- [ ] `tests/pre-vr-flow.test.tsx` -- covers FLOW-01, FLOW-02, FLOW-04

## Open Questions

1. **Tailwind v3 vs v4**
   - What we know: Current npm default is v4 (CSS-first config). TECH_SPECS assumes v3 (JS config).
   - What's unclear: Whether the team has a preference. Both work fine.
   - Recommendation: Use v4 since CSS custom properties are already the planned token strategy. The `@theme` directive maps naturally to the brand token pattern.

2. **Next.js 16 + React 19 vs TECH_SPECS "React 18"**
   - What we know: `create-next-app` installs Next.js 16 with React 19. TECH_SPECS says React 18.
   - What's unclear: Whether the spec intended to lock React 18 or just named the latest at time of writing.
   - Recommendation: Use what ships with Next.js 16 (React 19). All Phase 1 patterns (useState, useContext) are identical between React 18 and 19. No migration risk.

3. **Vercel deployment configuration**
   - What we know: PERF-05 requires Vercel deployment with SSG.
   - What's unclear: Whether a Vercel project is already set up, what the domain will be.
   - Recommendation: This is a Phase 1 deliverable but can be deferred to the end of the phase. A simple `vercel` CLI deploy or Git push to Vercel will work.

## Sources

### Primary (HIGH confidence)
- TECH_SPECS.md -- Architecture, routing, state management, content schema (project-local document)
- DESIGN_SPECS.md -- Component specs, color system, typography, animation inventory (project-local document)
- STACK.md -- Technology stack and dependencies (project-local document)
- STRUCTURE.md -- Directory layout and naming conventions (project-local document)
- CONVENTIONS.md -- Coding conventions, import organization, error handling (project-local document)
- npm registry -- Verified current versions of all packages (2026-03-19)

### Secondary (MEDIUM confidence)
- Next.js App Router patterns -- based on official documentation patterns (verified against training data + npm version check)
- Tailwind CSS v4 migration -- CSS-first configuration is the current default (verified via `npm view tailwindcss version` returning 4.2.2)

### Tertiary (LOW confidence)
- None -- all findings verified against project specs or npm registry

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages prescribed by TECH_SPECS, versions verified on npm
- Architecture: HIGH -- patterns prescribed by TECH_SPECS and STRUCTURE.md, standard Next.js App Router usage
- Pitfalls: HIGH -- common Next.js App Router and Tailwind issues well-documented in training data
- Content schema: HIGH -- exact TypeScript interface provided in TECH_SPECS 3.1

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable stack, no fast-moving dependencies)
