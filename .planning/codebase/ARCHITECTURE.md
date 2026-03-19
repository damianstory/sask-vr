# Architecture

**Analysis Date:** 2026-03-19

## Pattern Overview

**Overall:** Multi-screen stateless single-page application (SPA) with server-side proxy for sensitive API calls.

**Key Characteristics:**
- Frontend-heavy: All UI logic, state, and content is browser-based
- Session-only state: No persistent storage; state resets on refresh
- Static content delivery: All career data is hardcoded JSON files per occupation
- Modular screen components: Six-screen linear flow within a single route (`/pre-vr`)
- Client-side image compositing: Canvas API renders final card artifacts
- Server proxy pattern: Sensitive image generation API key kept server-side via `/api/generate-card` route

## Layers

**Page Layer:**
- Purpose: Route entry points and high-level layout orchestration
- Location: `app/page.tsx` (landing), `app/pre-vr/page.tsx` (pre-VR flow wrapper), `app/post-vr/page.tsx` (bridge page)
- Contains: Route components that manage which screens/pages are visible
- Depends on: React Router (v6 via Next.js App Router), SessionProvider context
- Used by: Next.js routing system

**Screen Component Layer:**
- Purpose: Render individual educational screens (Screen 1–6 in the Pre-VR flow)
- Location: `app/pre-vr/components/` — ScreenOne.tsx, ScreenTwo.tsx, ScreenThree.tsx, ScreenFour.tsx, ScreenFive.tsx, ScreenSix.tsx
- Contains: Screen-specific content, interaction logic, state updates
- Depends on: SessionContext, component library, content data
- Used by: Pre-VR page wrapper to manage screen transitions

**Shared Component Layer:**
- Purpose: Reusable UI components and interactive elements
- Location: `components/` — Navigation.tsx, ProgressBar.tsx, TileGrid.tsx, EmployerCard.tsx, PathwayStep.tsx, CardPreview.tsx, ChecklistItem.tsx, DownloadButton.tsx
- Contains: Stateless presentational components, form controls, interactive patterns
- Depends on: Design tokens (colors, spacing, typography), shadcn-ui (if applicable)
- Used by: Screen components and other shared components

**State Management Layer:**
- Purpose: Manage session-wide state (tile selections, name, icon, card)
- Location: React Context provider (defined in `app/pre-vr/page.tsx` or dedicated context file like `app/context/SessionContext.tsx`)
- Contains: State shape, setState functions, context provider
- Depends on: React's useState, useContext
- Used by: All screen components via useContext hook

**Content Data Layer:**
- Purpose: Hold all occupation-specific hardcoded content
- Location: `content/carpentry.json`, `content/types.ts`
- Contains: Career stats, task tiles, employer details, pathway steps, icon options, checklist items
- Depends on: TypeScript interface definitions
- Used by: All screen components that display content

**API/Integration Layer:**
- Purpose: Image generation API client and analytics event tracking
- Location: `lib/image-gen.ts` (NanoBanana client), `lib/analytics.ts` (GA4 event wrapper), `app/api/generate-card/route.ts` (server-side proxy)
- Contains: API client functions, event taxonomy, server request handler
- Depends on: Next.js API routes, fetch API, window.gtag
- Used by: Screen components (especially ScreenFive for card generation), analytics tracking throughout

**Utility Layer:**
- Purpose: Shared helper functions
- Location: `lib/card-generator.ts` (Canvas compositing logic), `lib/utils.ts` (general utilities)
- Contains: Canvas rendering logic, className merging, formatting functions
- Depends on: Canvas API, DOM utilities
- Used by: Screen components for card rendering and styling

## Data Flow

**Pre-VR Experience Flow:**

1. Student lands on `/` (landing page)
2. Selects Pre-VR path → navigates to `/pre-vr`
3. Page mounts SessionProvider (initializes empty state: no tiles selected, no name, no card)
4. Screen 1 loads: fetches career stats from `content/carpentry.json`, renders salary counter animation
5. Student taps Next → currentScreen state updates to 2
6. Screen 2 loads: displays 6 task tiles from content, student selects 2–3 tiles
7. Tile selections stored in SessionContext.selectedTiles (array of tile IDs)
8. Student navigates through Screens 3, 4, 6 — tile selections remain preserved
9. Screen 5 loads: displays selected tiles, icon picker, name input, live card preview
10. Student enters name → SessionContext.firstName updated → CardPreview re-renders
11. Student selects icon → SessionContext.selectedIcon updated → CardPreview re-renders
12. CardPreview calls `lib/card-generator.ts` to render canvas with all inputs
13. Background image obtained from either:
    - NanoBanana API via `/api/generate-card` proxy (primary path, 8s timeout)
    - Fallback: pre-generated PNG variant from `/public/card-backgrounds/`
14. Student taps Download → Canvas exported to PNG via `DownloadButton.tsx`
15. File saves to device
16. Student taps Next → proceeds to Screen 6
17. Screen 6 is cooldown screen; student waits for or enters VR

**State Management Pattern:**

```
SessionContext {
  selectedTiles: string[]        // tile IDs from Screen 2
  firstName: string              // from name input on Screen 5
  selectedIcon: string | null    // from icon picker on Screen 5
  generatedCardUrl: string | null // data URL of rendered card
  checkedItems: string[]          // bridge page checklist (separate from Pre-VR)
}
```

State flows top-down via props or context consumption. Any screen can update state via dispatch actions. Backward navigation preserves all state.

**Post-VR Bridge Flow:**

1. Student scans QR code → navigates to `/post-vr`
2. Bridge page loads independently (no prior session state required)
3. Displays congratulations message and 6-item checklist from `content/carpentry.json`
4. Student taps items to toggle checked state
5. Checked items tracked in isolated local state
6. Student taps myBlueprint link → opens external platform in new tab

**Analytics Event Flow:**

All screens and interactions trigger events via `lib/analytics.ts` utility:
```typescript
trackEvent("screen_view", { screen: "screen_1" });
trackEvent("tile_select", { tile_id: "framing", action: "select" });
trackEvent("card_download", {});
```

Events are batched and sent to Google Analytics (GA4) asynchronously. No page reloads required; gtag.js manages delivery.

## Key Abstractions

**Screen Component Pattern:**
- Purpose: Encapsulate one educational step in the flow
- Examples: `app/pre-vr/components/ScreenOne.tsx`, `ScreenTwo.tsx`
- Pattern: Functional React component that consumes SessionContext, renders content from `content/carpentry.json`, handles local state (e.g., which pathway step is expanded), calls analytics.trackEvent()
- Usage: Each screen is mounted conditionally based on `currentScreen` state managed by Pre-VR page wrapper

**Tile Grid Component:**
- Purpose: Reusable grid of selectable tiles with max/min constraints
- Examples: `components/TileGrid.tsx` used on Screen 2 for task selection
- Pattern: Presentational component accepting tiles, selectedIds, onSelect callback, and constraints (minSelect, maxSelect). Enforces rules via callback validation in parent.
- Usage: Screen 2 uses this for task selection; could be reused for other occupation's task tiles in future

**Card Builder Composition:**
- Purpose: Assemble name input, icon picker, and live preview into one cohesive builder interface
- Examples: `components/CardPreview.tsx`, `DownloadButton.tsx` composed within Screen 5
- Pattern: Screen 5 manages state (firstName, selectedIcon), passes to CardPreview for real-time rendering and to DownloadButton for download action. Preview subscribes to SessionContext changes and re-renders canvas.
- Usage: All three components co-located in one screen; together they form the S3.1 story

**Content Schema:**
- Purpose: Define shape of career data for any occupation
- Examples: `content/types.ts` — OccupationContent interface
- Pattern: TypeScript interface that every occupation JSON file must match. Allows screens to consume content via one consistent shape.
- Usage: When adding carpentry, welding, HVAC, etc., each occupation file (`content/carpentry.json`, `content/welding.json`) must conform to OccupationContent shape. Screens import and access via typed keys.

## Entry Points

**Landing Page:**
- Location: `app/page.tsx`
- Triggers: Initial visit to `/`
- Responsibilities: Display path selection UI (two large cards), render myBlueprint logo, track path selection event, navigate to `/pre-vr` or `/post-vr` on tap

**Pre-VR Flow:**
- Location: `app/pre-vr/page.tsx`
- Triggers: Navigation from landing page on Pre-VR selection
- Responsibilities: Initialize SessionProvider and SessionContext with empty state, manage currentScreen state (1–6), render ScreenOne–ScreenSix based on currentScreen, manage forward/backward navigation, preserve state across screen changes

**Post-VR Bridge:**
- Location: `app/post-vr/page.tsx`
- Triggers: Navigation from landing page on Post-VR selection, or direct QR code link to `/post-vr`
- Responsibilities: Render congratulations message, display checklist from content, manage local checkbox state, provide myBlueprint link

**API Proxy:**
- Location: `app/api/generate-card/route.ts`
- Triggers: HTTP POST request from Screen 5 CardBuilder when generating card background
- Responsibilities: Receive card parameters (prompt, selection data), call NanoBanana Pro 2 API with server-side API key, return image data or error response

## Error Handling

**Strategy:** Graceful degradation with fallbacks; never block user progress.

**Patterns:**

- **Card Generation Failure:** If NanoBanana API times out (> 8s) or returns error, `lib/card-generator.ts` selects a pre-generated background variant from `/public/card-backgrounds/` deterministically based on selection hash. Canvas compositing proceeds with fallback. Event fired: `trackEvent("card_generated", { generation_method: "fallback" })`.

- **Missing Content:** If `content/carpentry.json` fails to load (rare in static hosting), application will throw error during build or require env var override. Not handled at runtime — this is a build-time issue.

- **Network Errors:** Since content is static and pre-bundled, most screens work offline after initial page load. Card generation API failure has fallback (see above). Analytics event failures are silent — never shown to user.

- **Invalid User Input:** Name input accepts 1–30 characters; input validation is enforced by HTML5 `maxlength` attribute and form-level check before download button is enabled. Icon selection is single-choice; tile selection enforces min/max via callback validation.

## Cross-Cutting Concerns

**Logging:** No structured logging framework. Analytics events via `lib/analytics.ts` serve as primary observability. Can add `console.warn()` for dev-time debugging if needed.

**Validation:**
- Content schema validation: TypeScript interfaces ensure content files match expected shape at compile time
- User input validation: Name length (1–30 chars), icon required, tiles required (2–3), all enforced at component level before state update or action submission
- API validation: `/api/generate-card` validates incoming payload shape (prompt, parameters) before forwarding to NanoBanana

**Authentication:** Not applicable. No auth. Site is fully anonymous and stateless (session-only memory).

**Responsive Design:** Built-in via Tailwind CSS responsive utilities and component-level breakpoint logic (e.g., Screen 2 tile grid switches from 2-wide to 3-wide at 1024px). Testing required on Chromebook (1366×768), laptop, and mobile (375px).

---

*Architecture analysis: 2026-03-19*
