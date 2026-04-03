# Coding Conventions

**Analysis Date:** 2026-04-03

## Naming Patterns

**Files:**
- Page entry points use lowercase `page.tsx` (Next.js App Router convention)
- Screen components use PascalCase: `ScreenOne.tsx`, `ScreenTwo.tsx`, `ScreenFive.tsx`
- Shared components use PascalCase: `Navigation.tsx`, `ProgressBar.tsx`, `CardPreview.tsx`
- Library modules use kebab-case: `generate-card.ts`, `card-gradients.ts`, `analytics.ts`
- Context files use PascalCase with `Context` suffix: `SessionContext.tsx`
- Config/content files use kebab-case: `content/config.ts`

**Functions:**
- Exported functions use camelCase: `generateCardPng`, `getGradientVariant`, `trackScreenView`
- Event handlers use `handle` prefix: `handleTileToggle`, `handleDownload`
- Navigation callbacks use `go` prefix: `goNext`, `goPrev`
- Custom hooks use `use` prefix: `useSession`, `useReducedMotion`
- Boolean state variables use descriptive names: `isDownloading`, `isDownloaded`, `canDownload`

**Variables:**
- Boolean state variables use `is` or `can` prefix: `isVisible`, `isDisabled`, `canDownload`
- Content data is destructured into a module-level `const data = content.screenX` constant per screen component
- Type aliases use PascalCase: `ScreenNumber`, `CardParams`, `SessionState`
- CSS custom properties referenced inline as `var(--myb-*)` strings

**Types/Interfaces:**
- Props interfaces are named with `Props` suffix: `NavigationProps`, `ScreenFiveProps`
- Session shape split into `SessionState` (data) and `SessionContextValue` (data + setters)
- Union types use inline literals: `type ScreenNumber = 1 | 2 | 3 | 4 | 5 | 6`
- Prop types for simple components are inlined: `{ onNext?: () => void }`

## Code Style

**Formatting:**
- Prettier is configured (`prettier` in devDependencies, `eslint-config-prettier` for conflict resolution)
- No `.prettierrc` file found — defaults apply (likely single quotes, trailing commas, 2-space indent)
- Tailwind classes use inline template literals with `cn()` for conditional merging

**Linting:**
- ESLint 9 flat config at `eslint.config.mjs`
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- TypeScript strict mode enabled in `tsconfig.json`

## Import Organization

**Order (observed pattern):**
1. React and Next.js core imports (`'use client'` directive at top, then `react`, `next/*`)
2. Context and shared providers (`@/context/SessionContext`)
3. Local component imports (`@/components/*`, `./components/ScreenX`)
4. Library/util imports (`@/lib/generate-card`, `@/lib/analytics`, `@/lib/utils`)
5. Content/config imports (`@/content/config`)

**Path Aliases:**
- `@/` maps to the project root (`./*` in `tsconfig.json`)
- Always use `@/` for cross-directory imports; use relative paths (`./components/ScreenX`) for sibling files within the same route segment

**Directive Placement:**
- `'use client'` is placed as the very first line in all interactive components
- Server components (e.g., `app/layout.tsx`) omit the directive entirely

## Error Handling

**Patterns:**
- Async operations (Canvas PNG generation) are wrapped in `try/finally` blocks — `setIsDownloading` is always reset in `finally`
- Context consumers throw a descriptive error if used outside the provider: `throw new Error('useSession must be used within a SessionProvider')`
- Validation errors (name input) are surfaced via co-located `useState` boolean flags (`nameError`) and inline error `<p>` elements
- No global error boundary is implemented; Next.js default error handling applies

**Example:**
```typescript
// lib/generate-card.ts
async function handleDownload() {
  if (!canDownload || !selectedIconData) return
  setIsDownloading(true)
  try {
    const blob = await generateCardPng({ ... })
    // ... success path
  } finally {
    setIsDownloading(false)
  }
}
```

## Logging

**Framework:** None (no logging library)

**Patterns:**
- All production analytics go through named functions in `lib/analytics.ts`
- Development mode gates GA calls: `if (IS_DEV) { console.log('[Analytics]', ...) }`
- The `[Analytics]` prefix is used consistently for dev log identification
- No `console.error` or `console.warn` calls observed in source

## Comments

**When to Comment:**
- JSDoc-style block comments on exported functions and hooks with non-obvious behavior
- Inline comments explain non-obvious implementation decisions (e.g., `requestAnimationFrame` retry logic, odometer stagger delays)
- Numbered step comments used in procedural Canvas drawing code (`// 1. Draw gradient`, `// 2. Draw title`)

**Example:**
```typescript
/**
 * Composites a 1200x675 carpenter card PNG entirely client-side using Canvas API.
 * Returns a Blob of the resulting PNG image.
 */
export async function generateCardPng(params: CardParams): Promise<Blob> {
```

## Function Design

**Size:** Screen components are moderately long (100–220 lines) as they contain both logic and JSX. Helper functions are extracted when reusable (e.g., `drawTagChips` in `generate-card.ts`, `OdometerDigit` sub-component in `ScreenOne.tsx`).

**Parameters:** Props passed as named destructured parameters. Simple components inline the type; complex components use a named `Props` interface.

**Return Values:** Functions return early on guard conditions (`if (!canDownload || !selectedIconData) return`). Async functions return typed Promises (`Promise<Blob>`).

## Module Design

**Exports:**
- Page and screen components use `export default`
- Library functions use named exports: `export function trackScreenView(...)`
- Context exports: provider as named export (`SessionProvider`), hook as named export (`useSession`)
- Interfaces/types exported only when consumed externally (e.g., `export interface CardParams`)

**Barrel Files:** Not used. Each module is imported directly by path.

**Content Separation:**
- All user-visible copy and structured data lives in `content/config.ts` (single source of truth)
- Components import `content` and extract their slice at module scope: `const data = content.screenTwo`

## Accessibility Conventions

- All interactive buttons set `type="button"` explicitly to prevent form submission side-effects
- Decorative SVG icons carry `aria-hidden="true"`
- Touch targets are enforced at `min-h-[44px] min-w-[44px]` (Apple HIG minimum)
- Focus management uses `data-screen-heading` attribute as a stable selector for programmatic focus after screen transitions
- Skip link is present in `app/layout.tsx` targeting `#main-content`
- Reduced-motion is respected via a `useReducedMotion` hook that reads `window.matchMedia('(prefers-reduced-motion: reduce)')`
- CSS animations are globally disabled under `@media (prefers-reduced-motion: reduce)` in `styles/globals.css`

## CSS / Tailwind Conventions

- Design tokens are defined as CSS custom properties in `styles/globals.css` and referenced inline via `var(--myb-*)` in className strings
- Tailwind v4 `@theme inline` block maps CSS variables to Tailwind color tokens
- Conditional class composition always uses the `cn()` helper from `lib/utils.ts` (clsx + tailwind-merge)
- Animation utility classes are defined manually in `styles/globals.css` (e.g., `animate-slide-left`, `animate-shake`, `animate-pulse-dot`)
- Responsive breakpoints use Tailwind prefixes: `md:` for tablet (768px), `lg:` for desktop

---

*Convention analysis: 2026-04-03*
