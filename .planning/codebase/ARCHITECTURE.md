# Architecture

**Analysis Date:** 2026-04-03

## Pattern Overview

**Overall:** Linear Multi-Screen Single-Page Application with Content-Driven Architecture

**Key Characteristics:**
- Two independent user flows (Pre-VR and Post-VR) branching from a landing page
- Pre-VR flow is a 6-screen wizard with shared session state managed via React Context
- All content is data-driven from a single JSON file, typed via `OccupationContent`, swappable by changing one constant in `content/config.ts`
- No backend, no API routes — fully client-rendered with external analytics only
- Accessibility-first: skip link in root layout, `data-screen-heading` focus management on every screen transition, `prefers-reduced-motion` respected throughout

## Layers

**Routing (Next.js App Router):**
- Purpose: URL-based entry to each flow
- Location: `app/`
- Contains: `layout.tsx` (root), `page.tsx` (landing), `pre-vr/page.tsx`, `post-vr/page.tsx`
- Depends on: content layer, analytics lib
- Used by: browser navigation

**Flow Orchestration (Pre-VR Page):**
- Purpose: Owns screen state, navigation direction, and focus management for the 6-screen wizard
- Location: `app/pre-vr/page.tsx`
- Contains: `currentScreen` state, `goNext`/`goPrev` handlers, `SessionProvider` wrapper, slide animation logic
- Depends on: screen components, shared components, SessionContext, analytics
- Used by: Next.js App Router

**Screen Components:**
- Purpose: Individual content screens rendered inside the Pre-VR flow; each is self-contained
- Location: `app/pre-vr/components/`
- Contains: `ScreenOne` through `ScreenSix`, plus sub-components `CardPreview`, `IconPicker`, `TaskTagChips`
- Depends on: `content/config`, `context/SessionContext`, `lib/` utilities
- Used by: `app/pre-vr/page.tsx`

**Shared UI Components:**
- Purpose: Reusable layout chrome shared across the Pre-VR flow
- Location: `components/`
- Contains: `Navigation.tsx` (sticky bottom prev/next bar), `ProgressBar.tsx` (sticky top dot indicators)
- Depends on: nothing (receive all data via props)
- Used by: `app/pre-vr/page.tsx`

**Content Layer:**
- Purpose: Single source of truth for all copy and structured data for each occupation
- Location: `content/`
- Contains: `carpentry.json` (occupation data), `config.ts` (active occupation selector), `types.ts` (TypeScript interface `OccupationContent`)
- Depends on: nothing
- Used by: every screen component and both flow pages

**State Layer:**
- Purpose: Cross-screen ephemeral session data persisted only for the duration of the Pre-VR flow
- Location: `context/SessionContext.tsx`
- Contains: `selectedTiles`, `firstName`, `selectedIcon`, `generatedCardUrl`; exposed via `useSession()` hook
- Depends on: React Context API only
- Used by: ScreenTwo (tile selection), ScreenFive (card builder)

**Utilities (lib/):**
- Purpose: Pure functions and side-effect utilities shared across the app
- Location: `lib/`
- Contains:
  - `analytics.ts` — typed GA4 event wrappers using `@next/third-parties/google`
  - `generate-card.ts` — Canvas API card compositor producing a 1200×675 PNG `Blob`
  - `card-gradients.ts` — gradient palette and deterministic hash-based picker
  - `utils.ts` — `cn()` classname merger (clsx + tailwind-merge)
- Depends on: browser APIs (`document.createElement`, `canvas`), Google Analytics SDK
- Used by: screen components and pages

**Styles:**
- Purpose: Global CSS variables (design tokens), Tailwind v4 theme registration, and custom animation keyframes
- Location: `styles/globals.css`
- Depends on: nothing
- Used by: `app/layout.tsx`

## Data Flow

**Pre-VR Wizard Flow:**

1. User lands on `app/page.tsx`, clicks "I'm about to do VR"
2. `trackPathSelect('pre_vr')` fires, router pushes to `/pre-vr`
3. `app/pre-vr/page.tsx` initialises `currentScreen = 1`, wraps tree in `<SessionProvider>`
4. `ProgressBar` and `Navigation` receive screen state as props; screen component is keyed by `currentScreen` for slide animation
5. ScreenTwo: user toggles tiles → `setSelectedTiles` updates `SessionContext`
6. ScreenFive: reads `selectedTiles` + user's `firstName` + `selectedIcon` from context → calls `generateCardPng()` → triggers browser download
7. `trackScreenView` fires on every `currentScreen` change via `useEffect`

**Post-VR Flow:**

1. User clicks "I just finished VR" on landing page → `/post-vr`
2. `app/post-vr/page.tsx` renders checklist from `content.postVr`
3. Local `checkedItems` state tracks completion; `trackChecklistCheck` fires per item toggle
4. CTA link navigates externally to myBlueprint

**State Management:**
- Pre-VR flow: `SessionContext` holds cross-screen state for the duration of the wizard session (not persisted to storage)
- Post-VR flow: local `useState` only — no shared state needed
- No global state library; no localStorage/sessionStorage

## Key Abstractions

**OccupationContent Interface:**
- Purpose: Strongly-typed contract for all occupation JSON data; enables multi-occupation swapping
- Location: `content/types.ts`
- Pattern: Import `content` from `content/config.ts` only — never import JSON files directly in screen components

**SessionContext / useSession:**
- Purpose: Shares user selections (tiles, name, icon) across the Pre-VR screen sequence without prop drilling
- Location: `context/SessionContext.tsx`
- Pattern: Wrap the Pre-VR page tree in `<SessionProvider>`, consume via `useSession()` hook; throws if used outside provider

**generateCardPng:**
- Purpose: Client-side Canvas compositor; no server required for card generation
- Location: `lib/generate-card.ts`
- Pattern: Receives `CardParams`, awaits `document.fonts.ready`, returns a `Promise<Blob>` for browser download

**Analytics Wrappers:**
- Purpose: Typed, named event functions that no-op in development and call `sendGAEvent` in production
- Location: `lib/analytics.ts`
- Pattern: Import named functions (`trackScreenView`, `trackTileSelect`, etc.); never call `sendGAEvent` directly

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: All page loads
- Responsibilities: Font loading (Open Sans via `next/font`), skip-to-content link, Google Analytics script injection, global CSS import

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: `/` route
- Responsibilities: Path selection UI, fires `trackPathSelect`, routes to `/pre-vr` or `/post-vr`

**Pre-VR Page:**
- Location: `app/pre-vr/page.tsx`
- Triggers: `/pre-vr` route
- Responsibilities: Wizard state machine (6 screens), `SessionProvider` scope, focus management on screen transitions, slide animation direction tracking

**Post-VR Page:**
- Location: `app/post-vr/page.tsx`
- Triggers: `/post-vr` route
- Responsibilities: Reflection checklist UI, CTA to myBlueprint, checklist analytics

## Error Handling

**Strategy:** Minimal — no error boundaries defined. Screen components handle their own input validation inline (e.g., `nameError` state in ScreenFive). `useSession()` throws a descriptive error if called outside `SessionProvider`.

**Patterns:**
- Canvas card generation errors are swallowed by `try/finally` in ScreenFive's `handleDownload` — `isDownloading` resets but no user-visible error is shown
- No global error page (`error.tsx`) or not-found page (`not-found.tsx`) defined

## Cross-Cutting Concerns

**Logging:** `console.log('[Analytics]', ...)` in development only; no logging library

**Validation:** Inline — ScreenFive validates name trimmed length > 0 on blur; ScreenTwo enforces min/max tile counts with shake animation feedback

**Authentication:** None — fully public micro-site

**Accessibility:** Skip link in root layout; `data-screen-heading` attribute used by Pre-VR page to auto-focus headings on screen change; `aria-label`, `role`, `aria-checked`, `aria-hidden` used throughout screen components; `prefers-reduced-motion` respected in ScreenOne and via CSS `@media` block in `globals.css`

---

*Architecture analysis: 2026-04-03*
