# Coding Conventions

**Analysis Date:** 2026-03-19

## Project Status

This is a **pre-implementation specification**. The codebase does not yet exist. These conventions are prescribed by `TECH_SPECS.md` and should guide the engineering team during implementation.

## Naming Patterns

**Files:**
- Use PascalCase for React component files matching the default export (e.g., `ScreenOne.tsx`, `Navigation.tsx`, `CardPreview.tsx`)
- Use kebab-case for utility/library files (e.g., `card-generator.ts`, `image-gen.ts`, `analytics.ts`)
- JSON data files use kebab-case (e.g., `carpentry.json`)
- Type definition files are `types.ts` or `[feature].types.ts`

**Functions:**
- Use camelCase for all functions: `trackEvent()`, `generateCard()`, `downloadCard()`
- Event handler functions follow the pattern `handle[Action]` (e.g., `handleTileSelect()`, `handleNameEnter()`)
- Analytics functions prefixed with `track` (e.g., `trackEvent()`, `trackPathwayExpand()`)

**Variables & Constants:**
- Use camelCase for variables: `currentScreen`, `selectedTiles`, `firstName`
- Use UPPER_SNAKE_CASE for constants: `NANOBANANA_ENDPOINT`, `CARD_WIDTH`, `CARD_HEIGHT`
- React state variables use `[state, setState]` pattern via `useState`

**Types & Interfaces:**
- Use PascalCase for type names: `OccupationContent`, `SessionState`, `CardInputs`
- Prefix interfaces with `I` only if necessary for disambiguation; otherwise use simple PascalCase
- Use `type` for unions and simple aliases; use `interface` for object contracts
- Type files live in `lib/types.ts` or co-located as `[feature].types.ts` in feature directories

## Code Style

**Formatting:**
- Prettier configured to format TS, TSX, JS, JSX, JSON, CSS, MD
- Line length: 80 characters (not enforced, but preferred for readability)
- Indentation: 2 spaces
- No semicolons required (Prettier removes them)
- Use single quotes for strings (Prettier enforces)

**Linting:**
- ESLint with Next.js recommended config
- No custom override rules yet; follow defaults
- Fix all lint warnings before committing

**TypeScript:**
- Strict mode enabled (`strict: true` in tsconfig.json)
- Always type function parameters and return values
- Avoid `any` — use `unknown` if needed and narrow with type guards

## Import Organization

**Order (enforce via ESLint):**
1. External dependencies (React, Next.js, third-party packages)
2. Internal lib utilities (`@/lib/...`)
3. Components (`@/components/...`)
4. Relative imports (last resort)

**Example:**
```typescript
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'
import { Navigation } from '@/components/Navigation'
import { ScreenOne } from './ScreenOne'
```

**Path Aliases:**
- Always use `@/` alias mapping to `./src/` — never use relative paths like `../../lib/`
- This applies to all imports except parent directory relative imports within feature trees

## Error Handling

**Patterns:**
- Use try/catch for async operations; always handle Promise rejections
- For API failures (e.g., NanoBanana timeout): catch, log to console, trigger graceful fallback
- Example from card generation (TECH_SPECS section 7.5):
  ```typescript
  try {
    const response = await fetch('/api/generate-card', {
      method: 'POST',
      body: JSON.stringify({ prompt, parameters })
    })
    const imageData = await response.arrayBuffer()
    return imageData
  } catch (error) {
    console.error('Card generation failed, falling back to static background', error)
    return selectFallbackBackground(selectionHash)
  }
  ```
- Do not expose internal error details to users; show user-friendly fallback UI
- Always log failures to console for debugging on school Chromebooks

**Validation:**
- Use Zod for runtime validation of form inputs and content JSON schema
- Validate `OccupationContent` JSON on load to catch data errors early
- Handle validation errors gracefully (show toast notification, disable action)

## Logging

**Framework:** `console` (no external logging library for MVP)

**Patterns:**
- Use `console.error()` for failures: API timeouts, validation errors, generation failures
- Use `console.warn()` for non-critical issues: missing optional fields in content JSON
- Use `console.log()` only for development; remove before production deployment
- Never log sensitive data: `firstName`, user selections should not be logged
- Always include context: `console.error('Card generation failed after 8s timeout', { prompt, error })`

**Example:**
```typescript
catch (error) {
  console.error('NanoBanana API timeout after 8000ms', {
    occupationId: 'carpentry',
    promptLength: prompt.length
  })
}
```

## Comments

**When to Comment:**
- Document non-obvious algorithmic decisions (e.g., why selection hash uses specific algorithm)
- Explain browser-specific quirks (e.g., "ChromeOS download behavior differs from Chrome desktop")
- Document test-specific details and assertions
- Do not comment obvious code: `const name = 'John' // Set name to John` is redundant

**JSDoc/TSDoc:**
- Use JSDoc comments on all exported functions and React components
- Include `@param`, `@returns`, and `@throws` tags
- Optional: `@example` for complex utilities

**Example:**
```typescript
/**
 * Composites a carpenter card using Canvas API
 * @param inputs - Card inputs including background, name, icon, stats
 * @returns Data URL (image/png) at 1200×675 px
 * @throws Error if canvas context unavailable
 * @example
 * const dataUrl = await generateCardImage({
 *   backgroundImage: img,
 *   firstName: 'Alex',
 *   iconAsset: '/icons/hammer.svg'
 * })
 */
export function generateCardImage(inputs: CardInputs): Promise<string>
```

## Function Design

**Size:** Keep functions under 50 lines. If a function exceeds this, break it into smaller utilities.

**Parameters:**
- Prefer objects over multiple parameters for 3+ arguments
- Example: `generateCard({ name, icon, tiles, stats })` not `generateCard(name, icon, tiles, stats)`
- Use destructuring in function signatures

**Return Values:**
- Always explicitly type return values
- Return `null` only for optional fields; use `undefined` for missing values in most cases
- Async functions return `Promise<T>`, never raw promises
- For operations that may fail, return union types: `string | null`, never throw unexpectedly in normal cases

**Naming:**
- Function names should reflect what they return: `getSelectedTiles()`, `isValidCard()`, `generateCard()`
- Functions that return booleans start with `is` or `should`: `isValidInput()`, `shouldShowFallback()`

## Module Design

**Exports:**
- Each component file exports a single default export (the React component)
- Utility modules export named functions and types
- Example structure:
  ```typescript
  // components/Navigation.tsx (default export)
  export default function Navigation({ onNext, onPrev }: NavigationProps) { ... }

  // lib/analytics.ts (named exports)
  export function trackEvent(name: string, params?: Record<string, string>) { ... }
  export function trackScreenView(screenId: string) { ... }
  ```

**Barrel Files (index.ts):**
- Do not use barrel files (`index.ts` exports) in `components/` — import directly from component file
- Do use barrel files in `lib/` for grouping related utilities
- Example: `lib/card/index.ts` exports `{ generateImage, composite, download }`

**File Organization:**
- All content lives under `app/` (Next.js App Router convention)
- Pre-VR flow components in `app/pre-vr/components/`
- Shared components in `components/`
- Utilities in `lib/`
- Content JSON in `content/`
- Public assets in `public/` (SVGs, backgrounds, icons)

## Props & Component Interfaces

**Props Definition:**
- Define props interface directly above the component
- Use JSDoc on the interface
- Example:
  ```typescript
  /**
   * Navigation between pre-VR screens
   */
  interface NavigationProps {
    /** Current screen number (1-6) */
    currentScreen: number
    /** Callback when user clicks next */
    onNext: () => void
    /** Callback when user clicks previous; disabled on screen 1 */
    onPrev?: () => void
  }

  export default function Navigation(props: NavigationProps) { ... }
  ```

## Responsive Design

**Mobile-first approach:**
- Always start CSS with base (mobile) styles
- Use Tailwind's `md:` breakpoint (768px) for tablet/desktop overrides
- Breakpoints from TECH_SPECS:
  - `< 640px` — Mobile
  - `640px–1023px` — Tablet
  - `≥ 1024px` — Chromebook/Laptop

**Example:**
```tsx
export default function TileGrid({ tiles }: TileGridProps) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {/* Tiles stack 1-wide on mobile, 2-wide on tablet, 3-wide on desktop */}
    </div>
  )
}
```

## Analytics Naming Convention

**Event Names:** Use snake_case, prefixed by context. Examples from TECH_SPECS section 6.2:
- `path_select`, `screen_view`, `tile_select`, `employer_tap`, `pathway_expand`, `icon_select`, `name_entered`, `card_generated`, `card_download`, `checklist_check`, `myblueprint_link`

**Event Parameters:** Use snake_case for parameter names.

**Privacy Rule:** Never include `firstName` or other PII in any event payload. The `name_entered` event signals completion only, with no content.

## Accessibility

**Semantic HTML:**
- Use `<main>`, `<nav>`, `<section>`, `<h1>`–`<h4>`, `<button>`, `<ul>`/`<li>` appropriately
- Avoid `<div>` for interactive content — use `<button>` for tappable elements
- Use `aria-pressed` for tile selections
- Use `role='dialog'` and `aria-labelledby` for employer card popups
- Use `aria-expanded` for accordion steps

**Alt Text:**
- All images have descriptive `alt` text
- SVG illustrations use `<title>` elements or `aria-label`

**Focus & Keyboard Navigation:**
- All interactive elements are tappable via `Tab` key
- Focus indicators visible (use Primary Blue outline, `outline-2 outline-offset-2 outline-blue-500` in Tailwind)
- Tab order follows visual flow left-to-right, top-to-bottom

**Touch Targets:**
- All tappable elements minimum 44×44px with adequate spacing (per WCAG AA)

**Motion:**
- Respect `prefers-reduced-motion` media query
- Disable salary counter animation and screen transitions for users who request it

---

*Convention specification: based on TECH_SPECS.md, ready for implementation*
