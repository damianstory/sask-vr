# Architecture Research

**Domain:** Stateless interactive educational micro-site (SSG-first, Next.js App Router)
**Researched:** 2026-03-19
**Confidence:** HIGH

## System Overview

```
                         Vercel CDN (Static HTML/JS/CSS)
                                    |
                         +----------+----------+
                         |   Next.js App Shell  |
                         |  (App Router, SSG)   |
                         +----------+----------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
  +-------+-------+     +----------+----------+    +---------+---------+
  |  Landing Page  |     |   Pre-VR Flow       |    |  Post-VR Page     |
  |  (Server Comp) |     |   (Client Comp)     |    |  (Client Comp)    |
  +---------------+     +----------+----------+    +---------+---------+
                                    |                         |
                         +----------+----------+              |
                         | SessionProvider     |              |
                         | (React Context)     |              |
                         +----------+----------+              |
                                    |                         |
          +--------+--------+-------+--------+--------+       |
          |        |        |       |        |        |       |
        Scr 1   Scr 2   Scr 3   Scr 4   Scr 5   Scr 6      |
        Hook    Tasks    Map    Timeline  Card    Prep     Checklist
          |        |        |       |        |        |       |
          +--------+--------+-------+--------+--------+-------+
                                    |
                    +---------------+---------------+
                    |               |               |
             +------+------+ +-----+-----+ +-------+-------+
             | Analytics   | | Content   | | Card Generator |
             | Service     | | JSON      | | (Canvas API)   |
             | (GA4 gtag)  | | (Static)  | |                |
             +-------------+ +-----------+ +----------------+
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| App Shell | Static HTML generation, routing, layout, font loading | Next.js App Router with `output: 'export'` or standard Vercel deploy. Two routes: `/` (landing), `/pre-vr` (flow), `/post-vr` (bridge). |
| Landing Page | Entry point, two-path selection (Pre-VR / Post-VR) | Server Component -- fully static, no client JS needed. Bold visual split. |
| Pre-VR Flow | Six-screen wizard with internal step state | Single Client Component managing step index via useState. No URL changes between screens. |
| Post-VR Page | Reflection checklist with myBlueprint link | Client Component with local checkbox state. Simpler -- no multi-screen flow. |
| SessionProvider | Shared session state across Pre-VR screens | React Context wrapping the Pre-VR flow. Holds selections (tasks, employer views), student name, icon choice. |
| Content JSON | All occupation-specific copy, stats, employer data | Static JSON file imported at build time. One file per occupation. Typed with TypeScript interface. |
| Analytics Service | GA4 event tracking abstraction | Thin wrapper around `gtag()`. No PII. Tracks screen views, interactions, card generation, checklist completion. |
| Card Generator | Composites background + name + icon into downloadable image | Canvas API: drawImage (background PNG) + fillText (name) + drawImage (icon). toBlob() for download. |
| SVG Map | Interactive Regina-area map with employer pins | Inline SVG with `<circle>` or `<g>` elements as pins. Click/tap triggers card overlay. ARIA labels for accessibility. |

## Recommended Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fonts, metadata, GA4 script
│   ├── page.tsx                # Landing page (Server Component)
│   ├── pre-vr/
│   │   └── page.tsx            # Pre-VR flow wrapper (Client Component)
│   └── post-vr/
│       └── page.tsx            # Post-VR bridge page (Client Component)
├── components/
│   ├── pre-vr/                 # Pre-VR screen components
│   │   ├── Screen1Hook.tsx     # Salary counter, career stats
│   │   ├── Screen2Tasks.tsx    # Task tile grid with selection
│   │   ├── Screen3Map.tsx      # SVG map with employer pins
│   │   ├── Screen4Timeline.tsx # Career pathway accordion
│   │   ├── Screen5Card.tsx     # Card builder (name, icon, preview)
│   │   └── Screen6Prep.tsx     # VR prep prompts
│   ├── post-vr/
│   │   └── Checklist.tsx       # Reflection checklist
│   ├── card/
│   │   ├── CardPreview.tsx     # Live card preview (CSS-based)
│   │   ├── CardGenerator.ts    # Canvas compositing logic
│   │   └── IconPicker.tsx      # Icon selection grid
│   ├── map/
│   │   ├── ReginaMap.tsx       # SVG map component
│   │   └── EmployerCard.tsx    # Pin detail popover
│   └── ui/                     # Shared UI primitives
│       ├── Button.tsx
│       ├── ProgressBar.tsx
│       ├── AnimatedCounter.tsx
│       └── Accordion.tsx
├── context/
│   └── SessionContext.tsx       # React Context for Pre-VR session state
├── content/
│   ├── carpenter.json          # All carpenter occupation content
│   └── types.ts                # TypeScript interfaces for content schema
├── lib/
│   ├── analytics.ts            # GA4 abstraction layer
│   ├── card-backgrounds.ts     # Background selection hash logic
│   └── utils.ts                # cn() and shared utilities
├── assets/
│   ├── backgrounds/            # Pre-generated card background PNGs
│   ├── icons/                  # Card icon SVGs/PNGs
│   └── map/                    # Regina map SVG source
└── styles/
    └── globals.css             # Tailwind base, brand tokens, animations
```

### Structure Rationale

- **`components/pre-vr/`:** Each screen is its own component, but they share no routes -- the parent page manages which renders. Keeps screen logic isolated while the flow orchestration lives in the page.
- **`context/`:** Separate from components because the session state is a cross-cutting concern consumed by multiple screens. Single file -- this is not complex enough for a full state management library.
- **`content/`:** JSON lives alongside its TypeScript types. Adding a new occupation means adding a new JSON file conforming to the same interface. No code changes required.
- **`lib/`:** Pure functions with no React dependencies. Analytics, hashing, utilities. Testable in isolation.
- **`assets/`:** Static files that get bundled or served from `public/`. Background PNGs are the heaviest assets; they go in `public/` for CDN serving.

## Architectural Patterns

### Pattern 1: Single-Route Multi-Screen Wizard

**What:** The Pre-VR flow renders six screens within a single Next.js route (`/pre-vr`). Screen transitions are managed by a `currentScreen` state variable in the page component, not by URL changes.

**When to use:** When screen transitions must be instant (no network round-trip), state must persist across all screens without URL serialization, and the flow is linear with backward navigation.

**Trade-offs:**
- Pro: Zero latency transitions on slow school WiFi. Session state naturally preserved. Simple back/forward logic.
- Con: No deep-linking to individual screens. Browser back button does not navigate between screens (must be handled manually). Full flow JS loads upfront.

**Example:**
```typescript
// app/pre-vr/page.tsx
'use client';

import { useState } from 'react';
import { SessionProvider } from '@/context/SessionContext';
import Screen1Hook from '@/components/pre-vr/Screen1Hook';
import Screen2Tasks from '@/components/pre-vr/Screen2Tasks';
// ... other screens

const SCREENS = [Screen1Hook, Screen2Tasks, Screen3Map, Screen4Timeline, Screen5Card, Screen6Prep];

export default function PreVRFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const Screen = SCREENS[currentScreen];

  return (
    <SessionProvider>
      <ProgressBar current={currentScreen} total={SCREENS.length} />
      <Screen
        onNext={() => setCurrentScreen(s => Math.min(s + 1, SCREENS.length - 1))}
        onBack={() => setCurrentScreen(s => Math.max(s - 1, 0))}
      />
    </SessionProvider>
  );
}
```

### Pattern 2: React Context for Ephemeral Session State

**What:** A single React Context holds all student selections (chosen tasks, viewed employers, name, icon). State is intentionally lost on page refresh -- no persistence mechanism.

**When to use:** When state is session-scoped, shared across multiple sibling components, and explicitly ephemeral (privacy requirement: no PII persists).

**Trade-offs:**
- Pro: Zero storage footprint. Privacy by design. Simple to reason about.
- Con: Accidental refresh loses all progress. No recovery mechanism.

**Example:**
```typescript
// context/SessionContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SessionState {
  selectedTasks: string[];      // IDs of 2-3 chosen tasks
  viewedEmployers: string[];    // IDs of tapped employer pins
  studentName: string;          // For card generation only
  selectedIcon: string;         // Icon ID for card
}

interface SessionContextValue extends SessionState {
  setSelectedTasks: (tasks: string[]) => void;
  setStudentName: (name: string) => void;
  setSelectedIcon: (icon: string) => void;
  addViewedEmployer: (id: string) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    selectedTasks: [],
    viewedEmployers: [],
    studentName: '',
    selectedIcon: '',
  });

  const setSelectedTasks = useCallback((tasks: string[]) =>
    setState(s => ({ ...s, selectedTasks: tasks })), []);
  // ... other setters

  return (
    <SessionContext.Provider value={{ ...state, setSelectedTasks /* ... */ }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
```

### Pattern 3: Analytics Abstraction Layer

**What:** A thin service module wraps `gtag()` calls behind typed functions. Components call `analytics.trackTaskSelection(taskId)` rather than raw `gtag('event', ...)`. All event names and parameter shapes are defined in one place.

**When to use:** Always, for any GA4 integration. Prevents typos in event names, centralizes the event catalog, and makes it trivial to swap analytics providers later.

**Trade-offs:**
- Pro: Type-safe events. Single source of truth for event schema. Easy to test (mock the module).
- Con: Tiny overhead of an extra abstraction. Must be kept in sync with GA4 event definitions.

**Example:**
```typescript
// lib/analytics.ts
type GAEvent = {
  screen_view: { screen_name: string; screen_index: number };
  task_selected: { task_id: string; task_name: string };
  employer_viewed: { employer_id: string };
  card_generated: { background_variant: number; has_custom_name: boolean };
  card_downloaded: {};
  checklist_item_checked: { item_index: number; item_label: string };
  checklist_completed: {};
};

function trackEvent<K extends keyof GAEvent>(name: K, params: GAEvent[K]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

export const analytics = {
  screenView: (name: string, index: number) =>
    trackEvent('screen_view', { screen_name: name, screen_index: index }),
  taskSelected: (id: string, name: string) =>
    trackEvent('task_selected', { task_id: id, task_name: name }),
  employerViewed: (id: string) =>
    trackEvent('employer_viewed', { employer_id: id }),
  cardGenerated: (variant: number, hasName: boolean) =>
    trackEvent('card_generated', { background_variant: variant, has_custom_name: hasName }),
  cardDownloaded: () =>
    trackEvent('card_downloaded', {}),
  checklistItemChecked: (index: number, label: string) =>
    trackEvent('checklist_item_checked', { item_index: index, item_label: label }),
  checklistCompleted: () =>
    trackEvent('checklist_completed', {}),
};
```

### Pattern 4: Canvas API Card Compositing Pipeline

**What:** A pure function takes inputs (background image URL, student name, icon image) and returns a Blob via an offscreen canvas. The live preview uses CSS rendering (faster, no canvas overhead). Canvas is only invoked at download time.

**When to use:** When generating a downloadable image client-side from layered components. Separating preview from generation avoids re-rendering canvas on every keystroke.

**Trade-offs:**
- Pro: Preview is instant (CSS). Generation only runs once at download. toBlob() is more memory-efficient than toDataURL().
- Con: CSS preview and Canvas output may have minor rendering differences (fonts, spacing). Must preload images before drawing.

**Example:**
```typescript
// components/card/CardGenerator.ts
interface CardInput {
  backgroundUrl: string;
  studentName: string;
  iconUrl: string;
}

export async function generateCard(input: CardInput): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw background
  const bg = await loadImage(input.backgroundUrl);
  ctx.drawImage(bg, 0, 0, 600, 400);

  // 2. Draw icon
  const icon = await loadImage(input.iconUrl);
  ctx.drawImage(icon, 40, 260, 80, 80);

  // 3. Draw student name
  ctx.font = '600 28px "Open Sans", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(input.studentName, 140, 310);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```

### Pattern 5: Content JSON Schema for Templatization

**What:** All occupation-specific content lives in a single typed JSON file. The TypeScript interface defines the contract, and components consume content through this interface. Swapping occupations means adding a new JSON file -- no component changes.

**When to use:** When content will be templated for multiple variations (occupations) and non-developers may eventually author content.

**Trade-offs:**
- Pro: Clean separation of content from presentation. Type safety catches missing fields at build time. Easy to validate.
- Con: Deep nesting can get unwieldy. No runtime validation unless you add Zod/similar.

**Example:**
```typescript
// content/types.ts
export interface OccupationContent {
  meta: {
    id: string;              // "carpenter"
    title: string;           // "Carpenter"
    region: string;          // "Saskatchewan"
  };
  screen1: {
    salaryRange: { min: number; max: number };
    stats: Array<{ label: string; value: string; icon: string }>;
    hookText: string;
  };
  screen2: {
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      illustration: string;  // path to SVG/PNG
    }>;
    selectionRange: { min: number; max: number }; // e.g., { min: 2, max: 3 }
  };
  screen3: {
    mapSvgId: string;
    employers: Array<{
      id: string;
      name: string;
      type: string;
      location: { x: number; y: number }; // SVG coordinates
      description: string;
      projectHighlight: string;
    }>;
  };
  screen4: {
    pathwaySteps: Array<{
      title: string;
      duration: string;
      description: string;
      details: string[];
    }>;
  };
  screen5: {
    cardPrompt: string;
    icons: Array<{ id: string; label: string; src: string }>;
    backgroundCount: number;  // number of pre-generated variants
  };
  screen6: {
    observationPrompts: string[];
    vrPrepTips: string[];
  };
  postVr: {
    checklistItems: Array<{
      label: string;
      helpText: string;
      myBlueprintAction: string;
    }>;
    myBlueprintUrl: string;
  };
}
```

## Data Flow

### Pre-VR Flow Data Movement

```
Content JSON (static import at build)
    |
    v
Pre-VR Page Component
    |
    +---> SessionProvider (React Context)
    |         |
    |    [Screen 1] --- reads content.screen1 ---> renders salary counter
    |         |                                     fires analytics.screenView()
    |         v
    |    [Screen 2] --- reads content.screen2 ---> renders task tiles
    |         |         writes selectedTasks -----> SessionContext
    |         |                                     fires analytics.taskSelected()
    |         v
    |    [Screen 3] --- reads content.screen3 ---> renders SVG map + pins
    |         |         writes viewedEmployers ---> SessionContext
    |         |                                     fires analytics.employerViewed()
    |         v
    |    [Screen 4] --- reads content.screen4 ---> renders timeline
    |         |                                     fires analytics.screenView()
    |         v
    |    [Screen 5] --- reads content.screen5 ---> renders card builder
    |         |         reads selectedTasks ------> from SessionContext (determines background)
    |         |         writes studentName -------> SessionContext
    |         |         writes selectedIcon ------> SessionContext
    |         |         calls CardGenerator ------> Canvas API ---> Blob ---> download
    |         |                                     fires analytics.cardGenerated()
    |         v
    |    [Screen 6] --- reads content.screen6 ---> renders VR prep
    |                                               fires analytics.screenView()
    |
    v
Analytics Service ---> window.gtag() ---> GA4
```

### Card Generation Pipeline

```
User Input                    Static Assets              Canvas Compositing
+-----------+                +----------------+          +------------------+
| Name text | ---+           | 6-12 background|          |                  |
+-----------+   |           | PNGs (public/) | ---+     | 1. drawImage(bg) |
                |           +----------------+    |     | 2. drawImage(icon)|
+-----------+   |                                 +---> | 3. fillText(name)|
| Icon pick | --+---> deterministic hash              | 4. toBlob()      |
+-----------+   |     (selectedTasks => variant)      +--------+---------+
                |                                               |
+-----------+   |           +----------------+                  v
| Tasks     | --+           | Icon SVGs/PNGs | ---+     +------+------+
| (from ctx)|               +----------------+    |     | PNG Blob    |
+-----------+                                     +---> | ~200-400KB  |
                                                        +------+------+
                                                               |
                                                        URL.createObjectURL()
                                                               |
                                                        <a download> click
```

### State Management

```
SessionContext (React Context)
    |
    +--- selectedTasks: string[]      <-- Screen 2 writes, Screen 5 reads (background hash)
    +--- viewedEmployers: string[]    <-- Screen 3 writes (analytics only)
    +--- studentName: string          <-- Screen 5 writes, CardGenerator reads
    +--- selectedIcon: string         <-- Screen 5 writes, CardGenerator reads
    |
    Lifetime: created on /pre-vr mount, destroyed on navigation away or refresh
    Persistence: NONE (by design -- privacy requirement)
```

### Key Data Flows

1. **Content to Screen:** Static JSON imported at build time. Each screen component receives its content slice as props from the parent page. No runtime fetching.
2. **User selections to Card:** Task selections flow through Context to Screen 5, where a deterministic hash maps them to a background variant index. Combined with name and icon inputs, these feed the Canvas compositing pipeline.
3. **Interactions to Analytics:** Every meaningful interaction calls a typed analytics function that wraps `gtag()`. Events flow one-way from components to GA4. No PII is included (student name is never sent).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1 occupation (pilot) | Single JSON file, hardcoded import. Current architecture. |
| 5-10 occupations | Dynamic import based on route parameter (`/pre-vr/[occupation]`). Content JSON files follow same TypeScript interface. May need `generateStaticParams()` if using static export. |
| 20+ occupations | Consider a lightweight CMS (e.g., Contentlayer, MDX) or headless CMS for content authoring. Component architecture stays the same -- only the content pipeline changes. |
| Multiple schools/regions | Parameterize region data in JSON (employer locations, salary ranges). Add region selector or route parameter. |

### Scaling Priorities

1. **First bottleneck:** Content authoring. Non-developers will want to add occupations. Solution: JSON schema validation + documentation, then CMS if needed.
2. **Second bottleneck:** Background asset generation. 12 backgrounds per occupation times many occupations. Solution: NanoBanana API integration (currently deferred) for on-demand generation.

## Anti-Patterns

### Anti-Pattern 1: URL-Based Screen State for the Wizard

**What people do:** Use URL parameters (`?step=3`) or nested routes (`/pre-vr/step-3`) for each wizard screen.
**Why it's wrong:** On school Chromebooks with slow WiFi, URL changes trigger navigation events that can cause flickers, loading states, or full re-renders. URL state also requires serializing/deserializing session data to survive navigation.
**Do this instead:** Keep screen state as a single `useState(0)` in the parent component. Screens render/unmount based on index. Zero network cost.

### Anti-Pattern 2: Canvas for Live Preview

**What people do:** Re-render the Canvas on every keystroke or selection change for real-time preview.
**Why it's wrong:** Canvas rendering is synchronous and blocks the main thread. Image loading (drawImage) is async but the compositing is not. On Chromebooks, this causes visible jank during typing.
**Do this instead:** Use CSS/HTML for the live preview (fast, non-blocking). Only invoke Canvas at download time (one-shot operation).

### Anti-Pattern 3: Global State Library for Simple Session State

**What people do:** Reach for Zustand, Redux, or Jotai for wizard state.
**Why it's wrong:** Overkill for 4 fields of ephemeral state consumed by 6 components. Adds bundle size, boilerplate, and a dependency to maintain. React Context + useState handles this case perfectly.
**Do this instead:** React Context with a simple provider. If state logic gets complex (unlikely for this scope), upgrade to useReducer inside the same Context.

### Anti-Pattern 4: Persisting Student Name Anywhere

**What people do:** Store student name in localStorage, cookies, or URL params for "convenience."
**Why it's wrong:** Privacy violation. The requirement is zero PII persistence. Student name must exist only in React state (memory) and on the generated PNG (which the student controls).
**Do this instead:** Keep name in React Context only. Clear on unmount. Never send to analytics. The name exists in memory during the session and in the downloaded image file -- nowhere else.

### Anti-Pattern 5: Dynamic Imports per Screen

**What people do:** Lazy-load each screen component with `React.lazy()` and Suspense to reduce initial bundle.
**Why it's wrong:** Six screens of a wizard are small components (likely under 50KB total). Dynamic imports add waterfall loading when navigating forward, which is more noticeable on slow connections than the upfront cost. The school Chromebook has limited CPU for parsing multiple small chunks.
**Do this instead:** Bundle all six screens together. The total is small enough that one bundle loads faster than six waterfalled chunks.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| GA4 | `gtag.js` loaded via `<Script>` in root layout. Events fired through analytics abstraction. | Use `@next/third-parties/google` GoogleAnalytics component or manual Script tag. Disable automatic page views; fire manually on screen transitions. |
| Vercel | Standard Next.js deploy. Either `output: 'export'` (pure static) or default (allows future server features). | For this project, standard Vercel deploy is simpler -- no need for `output: 'export'` since Vercel handles SSG natively. Keeps the door open for future API routes. |
| myBlueprint | External link only (`<a href>` to myBlueprint URL). No API integration. | Open in new tab. URL comes from content JSON. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Page <-> Screen components | Props down (content, onNext, onBack). Context for shared state. | Screens are pure-ish: they receive content and callbacks, read/write context for selections. |
| Screen components <-> Analytics | Direct function calls to analytics module. | One-way. Screens fire events. No feedback from analytics to UI. |
| Screen 5 <-> CardGenerator | Function call with inputs, returns Promise<Blob>. | CardGenerator is a pure async function, not a component. It has no React dependencies. |
| Content JSON <-> Components | Static import, passed as typed props. | Content is resolved at build time. Components never fetch content at runtime. |
| SVG Map <-> EmployerCard | Map fires onPinClick with employer ID. EmployerCard receives employer data as props. | Map component manages which pin is active. Popover/card appears on click. |

## Build Order (Dependency Chain)

The following order reflects true dependencies -- what must exist before the next layer can be built.

```
Phase 1: Foundation
  ├── Content JSON schema + types (everything depends on content shape)
  ├── Project scaffold (Next.js, Tailwind, folder structure)
  └── Analytics service (needed by all screens)

Phase 2: Shell + Navigation
  ├── Root layout (fonts, GA4 script, brand tokens)
  ├── Landing page (entry point, no dependencies)
  └── Pre-VR flow skeleton (page + SessionContext + screen switcher + progress bar)

Phase 3: Individual Screens (parallelizable after Phase 2)
  ├── Screen 1: Hook (self-contained, reads content only)
  ├── Screen 2: Tasks (writes to context -- first context consumer)
  ├── Screen 3: Map (SVG + employer cards, writes to context)
  ├── Screen 4: Timeline (reads content only, accordion UI)
  ├── Screen 6: VR Prep (reads content only)
  └── Post-VR checklist (independent page, parallelizable)

Phase 4: Card Builder (depends on Phase 3 for context data)
  ├── Screen 5: Card preview (CSS-based live preview)
  ├── CardGenerator (Canvas compositing)
  ├── Background assets + hash logic
  └── Download flow (toBlob -> download trigger)

Phase 5: Polish
  ├── Animations + transitions between screens
  ├── Accessibility audit (ARIA, keyboard nav, contrast)
  ├── Performance testing on Chromebook-class device
  └── GA4 event verification
```

**Ordering rationale:**
- Content schema first because every component consumes it -- changing the schema later forces changes everywhere.
- Analytics service early because it is trivial to build and every screen calls it. Wiring it in from the start avoids a retrofit pass.
- Screens 1, 2, 3, 4, 6 and Post-VR are largely independent once the flow skeleton exists. They can be built in parallel.
- Screen 5 (Card Builder) depends on Screen 2's context writes (selected tasks determine background). Build it after context is proven working.
- Polish is last because animations and accessibility refinements require the full flow to exist.

## Sources

- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) -- official docs on `output: 'export'`, supported/unsupported features (HIGH confidence)
- [Vercel: React Context with Next.js App Router](https://vercel.com/kb/guide/react-context-state-management-nextjs) -- official Vercel guide on Context provider pattern (HIGH confidence)
- [Next.js @next/third-parties/google for GA4](https://nextjs.org/docs/messages/next-script-for-ga) -- official GA4 integration guidance (HIGH confidence)
- [MDN: Canvas API Using Images](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images) -- drawImage, compositing (HIGH confidence)
- [MDN: HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) -- blob generation for downloads (HIGH confidence)
- [DigitalOcean: Download Canvas-Generated Images Using toBlob](https://www.digitalocean.com/community/tutorials/js-canvas-toblob) -- practical toBlob download pattern (MEDIUM confidence)
- [Mykola Aleksandrov: GA4 in React - The Right Way](https://www.mykolaaleksandrov.dev/posts/2025/11/react-google-analytics-implementation/) -- analytics abstraction layer pattern (MEDIUM confidence)
- [react-svg-map](https://github.com/VictorCazanave/react-svg-map) -- accessible SVG map with WAI-ARIA keyboard nav (MEDIUM confidence)
- [freeCodeCamp: How to Make a Clickable SVG Map](https://www.freecodecamp.org/news/how-to-make-clickable-svg-map-html-css/) -- inline SVG interactive patterns (MEDIUM confidence)
- [React State Management in 2025](https://www.developerway.com/posts/react-state-management-2025) -- guidance on when Context suffices vs external libraries (MEDIUM confidence)

---
*Architecture research for: Career Explorer Micro-Site (Sask-VR)*
*Researched: 2026-03-19*
