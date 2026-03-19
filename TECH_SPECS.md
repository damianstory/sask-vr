# Career Explorer Micro-Site — Technical Specification

**Version:** 1.0
**Date:** March 19, 2026
**Status:** Ready for Engineering
**PRD Reference:** PRD_Career_Explorer_Microsite.md

---

## 1. Architecture Overview

### 1.1 System Summary

The Career Explorer micro-site is a stateless, single-page application that guides students through an interactive career exploration experience. It has no authentication, no persistent storage, and no server-side data processing. All content is hardcoded for the pilot; all user state lives in the browser session.

### 1.2 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js (App Router) | Team default; SSG support for static content; Vercel-native |
| Hosting | Vercel | Zero-config deployment from Git; edge CDN for fast loads on school networks |
| Styling | Tailwind CSS + CSS custom properties | Utility-first for rapid development; CSS variables for brand token management |
| Analytics | Google Analytics 4 (gtag.js) | Lightweight; funnel tracking built-in; no additional vendor needed |
| Image Generation | NanoBanana Pro 2 (API) | Card background/visual variation; called client-side on Screen 5 |
| Card Rendering | HTML Canvas API | Client-side image compositing for card download; fallback if image gen fails |
| Font Loading | Google Fonts (Open Sans) + self-hosted Museo Sans if available | Brand compliance; Open Sans as reliable fallback for school devices |

### 1.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                     │
│                                                          │
│  ┌──────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │  Landing  │──▶│  Pre-VR Flow │──▶│  Card Builder   │  │
│  │  Page     │   │  (Screens    │   │  (Screen 5)     │  │
│  │          │   │   1-4, 6)    │   │                 │  │
│  │          │   └──────────────┘   │  ┌───────────┐  │  │
│  │          │                      │  │ Canvas API│  │  │
│  │          │──▶┌──────────────┐   │  └─────┬─────┘  │  │
│  │          │   │  Post-VR     │   │        │        │  │
│  └──────────┘   │  Bridge Page │   │  ┌─────▼─────┐  │  │
│                  └──────────────┘   │  │ .png/.jpg │  │  │
│                                     │  │ Download  │  │  │
│  ┌────────────────────────────┐     │  └───────────┘  │  │
│  │   Session State (React)    │     └─────────────────┘  │
│  │   - tile selections        │                          │
│  │   - icon selection          │                          │
│  │   - name input              │                          │
│  │   - checklist state         │                          │
│  └────────────────────────────┘                          │
│                                                          │
│  ┌────────────────────────────┐                          │
│  │   Analytics Layer (gtag)   │──────▶ Google Analytics  │
│  └────────────────────────────┘           (GA4)          │
│                                                          │
│  ┌────────────────────────────┐                          │
│  │   Image Gen API Call       │──────▶ NanoBanana Pro 2  │
│  └────────────────────────────┘                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     VERCEL (Host)                         │
│                                                          │
│  Static site served via edge CDN                         │
│  No server-side rendering required for MVP               │
│  No database, no API routes (except image gen proxy      │
│  if API key must be kept server-side)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Project Structure

```
career-explorer/
├── app/
│   ├── layout.tsx                  # Root layout, font loading, GA script
│   ├── page.tsx                    # Landing page (path selection)
│   ├── pre-vr/
│   │   ├── page.tsx                # Pre-VR experience wrapper
│   │   └── components/
│   │       ├── ScreenOne.tsx       # Hook — salary counter, stats
│   │       ├── ScreenTwo.tsx       # Task tiles — selection grid
│   │       ├── ScreenThree.tsx     # Employer map — pins + cards
│   │       ├── ScreenFour.tsx      # Pathway timeline — accordion
│   │       ├── ScreenFive.tsx      # Card builder — inputs + preview
│   │       └── ScreenSix.tsx       # VR prep — prompts + holding
│   ├── post-vr/
│   │   └── page.tsx                # Bridge page with checklist
│   └── api/
│       └── generate-card/
│           └── route.ts            # Serverless function proxying image gen API
├── components/
│   ├── Navigation.tsx              # Screen-to-screen nav (forward/back)
│   ├── ProgressBar.tsx             # Visual progress through Pre-VR flow
│   ├── TileGrid.tsx                # Reusable selectable tile component
│   ├── EmployerCard.tsx            # Popup card for employer pins
│   ├── PathwayStep.tsx             # Expandable accordion step
│   ├── CardPreview.tsx             # Real-time card preview renderer
│   ├── ChecklistItem.tsx           # Checkable list item for bridge page
│   └── DownloadButton.tsx          # Card download handler
├── content/
│   ├── carpentry.json              # All content for carpentry occupation
│   └── types.ts                    # TypeScript interfaces for content schema
├── lib/
│   ├── analytics.ts                # GA4 event wrapper with taxonomy
│   ├── card-generator.ts           # Canvas API card rendering logic
│   └── image-gen.ts                # NanoBanana API client
├── public/
│   ├── icons/                      # Carpenter card icon set (SVGs)
│   ├── illustrations/              # Task tile illustrations (SVGs)
│   └── map/                        # Regina area illustrated map (SVG)
├── styles/
│   └── globals.css                 # Brand tokens, Tailwind config overrides
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 3. Content Data Model

All content for the pilot is stored in a single JSON file per occupation. This is the templatization seam — adding a new occupation means adding a new JSON file with the same schema.

### 3.1 Content Schema

```typescript
// content/types.ts

interface OccupationContent {
  meta: {
    occupationId: string;           // "carpentry"
    occupationLabel: string;        // "Carpenter"
    region: string;                 // "Saskatchewan"
    lastUpdated: string;            // ISO date
  };

  screenOne: {
    hookQuestion: string;           // "What does a carpenter in Saskatchewan actually earn?"
    salary: {
      amount: number;               // 72000
      label: string;                // "average annual salary"
      animateFrom: number;          // 0
    };
    stats: Array<{
      value: string;                // "2,400+"
      label: string;                // "carpentry jobs available in SK"
      icon?: string;                // optional icon reference
    }>;                             // 2-3 items
  };

  screenTwo: {
    heading: string;
    subheading: string;
    tiles: Array<{
      id: string;                   // "framing"
      label: string;                // "Framing a House"
      description: string;          // "Build the skeleton of a home..." (max 100 chars)
      illustrationAsset: string;    // path to SVG illustration
    }>;                             // exactly 6 items
    selectionMin: number;           // 2
    selectionMax: number;           // 3
  };

  screenThree: {
    heading: string;
    subheading: string;
    mapAsset: string;               // path to SVG map
    employers: Array<{
      id: string;
      name: string;                 // "PCL Construction"
      description: string;          // max 120 chars
      employeeCount: string;        // "500+ employees"
      logoUrl?: string;             // optional — null uses placeholder
      quote?: {                     // optional
        text: string;
        attribution: string;
      };
      pinPosition: {
        x: number;                  // percentage position on map SVG (0-100)
        y: number;
      };
    }>;                             // 4-6 items
  };

  screenFour: {
    heading: string;
    startLabel: string;             // "You are here — Grade 7/8"
    steps: Array<{
      id: string;
      label: string;                // "High School"
      expanded: {
        courseName: string;
        duration: string;
        earnings?: string;
        programs: string[];         // ["Miller Collegiate Carpentry 10/20/30"]
        description: string;
      };
    }>;                             // exactly 5 items
  };

  screenFive: {
    heading: string;
    icons: Array<{
      id: string;                   // "hammer"
      label: string;                // "Hammer"
      asset: string;                // path to SVG
    }>;                             // exactly 6 items
    cardStats: Array<{
      label: string;                // "Salary Range"
      value: string;                // "$55K – $90K"
    }>;
    nameInputPlaceholder: string;   // "Your first name"
  };

  screenSix: {
    heading: string;
    description: string;
    controllerTips: string[];
    observationPrompts: string[];   // 2-3 items
  };

  bridgePage: {
    congratsHeading: string;
    congratsSubheading: string;
    checklist: Array<{
      id: string;
      label: string;
      description?: string;
    }>;                             // exactly 6 items
    myblueprintUrl: string;
  };
}
```

### 3.2 Sample Content File Reference

The `content/carpentry.json` file will be populated once content sourcing is complete. The blocking content items are documented in the PRD Open Questions (items 1–3).

---

## 4. Routing & Navigation

### 4.1 Route Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Landing page — Pre-VR / Post-VR path selection |
| `/pre-vr` | `app/pre-vr/page.tsx` | Pre-VR experience — manages screen state internally |
| `/post-vr` | `app/post-vr/page.tsx` | Bridge page with checklist |

### 4.2 Pre-VR Screen Navigation

The Pre-VR experience is a single route (`/pre-vr`) that manages six screens internally via React state. This avoids unnecessary page loads on slow school networks and preserves session state (tile selections, name, icon) without URL manipulation.

```typescript
// Pre-VR screen flow managed by state
const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

// Navigation rules:
// - Forward: always allowed (Screen 2 requires min 2 tile selections to proceed)
// - Backward: always allowed; state is preserved
// - Direct screen jump: not supported — linear flow only
```

### 4.3 QR Code URL Convention

Two QR codes will be used in the pilot:

| QR Code Location | Target URL | Behaviour |
|-----------------|-----------|-----------|
| Posted at Pre-VR station | `https://[domain]/` | Opens landing page; student selects Pre-VR |
| Displayed at end of VR simulation | `https://[domain]/post-vr` | Opens bridge page directly, bypassing landing page |

The Post-VR QR code links directly to `/post-vr` to eliminate one tap for students coming out of VR.

---

## 5. State Management

### 5.1 Approach

All state is held in React component state (via `useState` / `useContext`). Nothing is persisted to `localStorage`, `sessionStorage`, cookies, or any server. If the browser tab is closed or refreshed, all state resets.

### 5.2 State Shape

```typescript
interface SessionState {
  // Screen 2 selections
  selectedTiles: string[];          // array of tile IDs, length 2-3

  // Screen 5 inputs
  firstName: string;                // 1-30 chars, never transmitted
  selectedIcon: string | null;      // icon ID

  // Screen 5 output
  generatedCardUrl: string | null;  // data URL or blob URL of rendered card

  // Bridge page
  checkedItems: string[];           // array of checklist item IDs
}
```

### 5.3 State Provider

Use a React Context provider wrapping the Pre-VR flow so all screens share state without prop drilling.

```typescript
// Wrap in app/pre-vr/page.tsx
<SessionProvider>
  <PreVRFlow />
</SessionProvider>
```

The bridge page has its own isolated state (checklist toggles only).

---

## 6. Analytics Implementation

### 6.1 GA4 Setup

Load the GA4 script in the root layout. Use the gtag.js approach (no Google Tag Manager needed for this scope).

```typescript
// app/layout.tsx — load GA4 script
// Measurement ID to be provided before deployment
```

### 6.2 Event Taxonomy

All events use a consistent naming scheme: `snake_case`, prefixed by context.

| Event Name | Trigger | Parameters |
|-----------|---------|------------|
| `path_select` | Student taps Pre-VR or Post-VR | `{ path: "pre_vr" \| "post_vr" }` |
| `screen_view` | Student navigates to a new screen | `{ screen: "screen_1" ... "screen_6" \| "bridge" }` |
| `tile_select` | Student taps a task tile on Screen 2 | `{ tile_id: string, action: "select" \| "deselect" }` |
| `employer_tap` | Student taps an employer pin on Screen 3 | `{ employer_id: string, employer_name: string }` |
| `pathway_expand` | Student expands a pathway step on Screen 4 | `{ step_id: string, step_label: string }` |
| `icon_select` | Student selects an icon on Screen 5 | `{ icon_id: string }` |
| `name_entered` | Student completes name input (on blur, non-empty) | `{}` (no PII — event only signals completion) |
| `card_generated` | Card image finishes rendering | `{ generation_method: "api" \| "fallback" }` |
| `card_download` | Student taps download button | `{}` |
| `checklist_check` | Student checks a bridge page item | `{ item_id: string, item_label: string }` |
| `myblueprint_link` | Student taps the myBlueprint link on bridge page | `{}` |

### 6.3 Analytics Utility

```typescript
// lib/analytics.ts

export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

// Usage:
trackEvent("tile_select", { tile_id: "framing", action: "select" });
```

**Privacy rule:** The `firstName` value from Screen 5 is never included in any analytics event. The `name_entered` event fires only to signal that a name was provided, with no content.

---

## 7. Carpenter Card Generation

### 7.1 Generation Flow

```
Student completes inputs (name + icon + tiles from Screen 2)
    │
    ▼
Construct image generation prompt
(incorporate icon choice, tile selections as style/theme parameters)
    │
    ▼
Call NanoBanana Pro 2 API via server-side proxy (/api/generate-card)
    │
    ├── Success ──▶ Receive background image
    │                    │
    │                    ▼
    │              Composite card via Canvas API:
    │              - Generated background image
    │              - Student first name (text overlay)
    │              - Selected icon (SVG overlay)
    │              - Task labels from tile selections
    │              - Career stats (salary, demand, training)
    │                    │
    │                    ▼
    │              Render to data URL → show preview
    │
    └── Failure ──▶ Fallback: select pre-generated background
                    variant based on selection hash
                         │
                         ▼
                    Composite via Canvas API (same as above)
                         │
                         ▼
                    Render to data URL → show preview
```

### 7.2 API Proxy Route

The image generation API key must not be exposed client-side. Use a Next.js API route as a thin proxy.

```typescript
// app/api/generate-card/route.ts

export async function POST(request: Request) {
  const { prompt, parameters } = await request.json();

  // Call NanoBanana Pro 2 with server-side API key
  const response = await fetch(NANOBANANA_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NANOBANANA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt, ...parameters })
  });

  // Return image data to client
  const imageData = await response.arrayBuffer();
  return new Response(imageData, {
    headers: { "Content-Type": "image/png" }
  });
}
```

### 7.3 Canvas Compositing

```typescript
// lib/card-generator.ts

interface CardInputs {
  backgroundImage: HTMLImageElement;  // from API or fallback
  firstName: string;
  iconAsset: string;                  // SVG path
  tileLabels: string[];               // 2-3 task labels
  stats: Array<{ label: string; value: string }>;
}

// Output: data URL (image/png) at fixed card dimensions
// Target dimensions: 1200 x 675 px (social-card friendly aspect ratio)
// Rendered to <canvas>, exported via canvas.toDataURL("image/png")
```

### 7.4 Card Download

```typescript
// components/DownloadButton.tsx

function downloadCard(dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "carpenter-card.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  trackEvent("card_download");
}
```

Test specifically on ChromeOS — file download behaviour differs from desktop Chrome. The `download` attribute triggers save-to-Downloads on ChromeOS without additional prompts.

### 7.5 Fallback Strategy

If the NanoBanana API call fails or takes longer than 8 seconds:

1. Abort the API request
2. Select a pre-generated background from a set of 6–12 static variants
3. Map the selection to the student's icon + tile combination using a deterministic hash so the same inputs always produce the same fallback
4. Composite via Canvas API as normal
5. Log `card_generated` event with `generation_method: "fallback"`

Pre-generated backgrounds should be stored in `/public/card-backgrounds/` as optimized PNGs.

---

## 8. Performance Targets & Optimization

### 8.1 Performance Budget

| Metric | Target | Context |
|--------|--------|---------|
| Landing page load (LCP) | < 3s | School Chromebook on standard WiFi (~25 Mbps) |
| Screen-to-screen transition | < 500ms perceived | Client-side state change, no network required |
| Card generation (API path) | < 5s total | API call + canvas compositing |
| Card generation (fallback) | < 1s | Local assets + canvas compositing |
| Total JS bundle | < 150 KB gzipped | Minimize dependencies |

### 8.2 Optimization Strategy

**Static Generation:** Use Next.js Static Site Generation (SSG) for all pages. Content is hardcoded JSON — no dynamic data fetching at page load.

**Image Optimization:** All illustrations and icons are SVG (resolution-independent, small file size). The illustrated map on Screen 3 is SVG. Pre-generated card backgrounds are optimized PNGs (compressed, max 200 KB each).

**Font Loading:** Load Open Sans via Google Fonts with `display=swap` to avoid invisible text. Museo Sans loaded via `@font-face` if self-hosted; if unavailable, Open Sans is the fallback and is visually acceptable.

**Animation Performance:** The salary counter on Screen 1 uses CSS `@keyframes` or `requestAnimationFrame` — no animation libraries. All transitions use CSS `transition` properties. Avoid JavaScript-driven layout recalculations.

**Code Splitting:** The Pre-VR flow and Post-VR bridge are separate routes and will be code-split automatically by Next.js. Screen components within Pre-VR can be dynamically imported if bundle size becomes an issue, but this is unlikely given the simplicity of each screen.

---

## 9. Accessibility Implementation

### 9.1 WCAG AA Requirements

| Requirement | Implementation |
|-------------|---------------|
| Colour contrast | All text meets 4.5:1 ratio against background; UI elements meet 3:1. Verify with brand colours — Navy (#22224C) on white exceeds 4.5:1; Primary Blue (#0092FF) on white is 3.1:1 and should only be used for large text or interactive elements, not small body text |
| Keyboard navigation | All interactive elements (tiles, pins, pathway steps, buttons, inputs) are focusable and operable via keyboard. Tab order follows visual flow |
| Screen readers | All images have descriptive `alt` text. Tile selections announced via `aria-pressed`. Employer card popups use `role="dialog"` with `aria-labelledby`. Pathway accordion uses `aria-expanded` |
| Touch targets | All tappable elements are minimum 44×44px with adequate spacing |
| Focus indicators | Visible focus ring on all interactive elements (use Primary Blue outline) |
| Reduced motion | Respect `prefers-reduced-motion` media query — disable salary counter animation and screen transitions for users who request it |
| Semantic HTML | Use `<main>`, `<nav>`, `<section>`, `<h1>`–`<h4>`, `<button>`, `<ul>`/`<li>` appropriately. No `<div>` soup |

### 9.2 Testing Plan

1. **Automated:** Run `axe-core` via browser extension on every screen during development
2. **Screen reader:** Test full Pre-VR flow with ChromeVox (primary — matches Chromebook target) and VoiceOver (mobile)
3. **Keyboard:** Complete full Pre-VR flow and bridge page using keyboard only
4. **Zoom:** Test at 200% zoom on Chromebook — no content overflow or broken layouts

---

## 10. Browser & Device Targets

### 10.1 Primary Targets

| Device | Browser | Resolution | Priority |
|--------|---------|-----------|----------|
| School Chromebook | Chrome (latest 2 versions) | 1366×768 | Primary — test everything here first |
| Shared laptop | Chrome | 1920×1080 | Secondary |
| Mobile phone (iOS) | Safari (latest 2 versions) | 375×667+ | Secondary |
| Mobile phone (Android) | Chrome | 360×640+ | Secondary |

### 10.2 Responsive Breakpoints

| Breakpoint | Target | Layout Notes |
|-----------|--------|-------------|
| < 640px | Mobile | Single column; tiles stack 1-wide; map pins scaled; card preview below inputs |
| 640px – 1023px | Tablet | Two-column tile grid; pathway fits in view; card preview beside inputs |
| ≥ 1024px | Chromebook / Laptop | Full layout; 2×3 tile grid; map at full width; card preview beside builder |

---

## 11. Environment & Deployment

### 11.1 Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID | Yes |
| `NANOBANANA_API_KEY` | Image generation API key (server-side only) | Yes |
| `NANOBANANA_ENDPOINT` | Image generation API endpoint URL | Yes |

### 11.2 Deployment Pipeline

```
Developer pushes to main branch
    │
    ▼
Vercel auto-deploys (preview on PR, production on merge to main)
    │
    ▼
Static site built and deployed to edge CDN
    │
    ▼
API route (/api/generate-card) deployed as serverless function
```

No staging environment is required for the pilot. Use Vercel preview deployments for QA before merging to production.

### 11.3 Domain

Domain TBD. Options:
- Subdomain of myBlueprint (e.g., `explore.myblueprint.ca`)
- Standalone domain

Decision needed before QR codes are printed or configured in the VR simulation.

---

## 12. Testing Strategy

### 12.1 Test Levels

| Level | Scope | Approach |
|-------|-------|----------|
| Unit | Content schema validation, analytics utility, card generator function | Jest — verify inputs produce expected outputs |
| Component | Tile selection logic, accordion expand/collapse, checklist toggle, download trigger | React Testing Library — verify interactions and state |
| Integration | Full Pre-VR flow end-to-end, card generation pipeline, analytics event firing | Playwright — automated browser tests on Chrome |
| Device | Chromebook rendering, mobile layout, download behaviour | Manual — real device testing at target resolutions |
| Accessibility | WCAG AA compliance across all screens | axe-core (automated) + ChromeVox/VoiceOver (manual) |

### 12.2 Critical Test Cases

1. Complete Pre-VR flow on Chromebook at 1366×768 — all screens render, tile selections persist, card generates and downloads
2. Complete Pre-VR flow on mobile (375px wide) — layout adapts, touch targets adequate, card downloads
3. Card generation fails (API timeout) — fallback triggers, card still generates and downloads
4. Student navigates backward through all screens — tile selections preserved, card (if generated) preserved
5. Bridge page loads from direct URL (`/post-vr`) — renders correctly without prior session state
6. All analytics events fire correctly — verify in GA4 debug mode

---

## 13. Security & Privacy

### 13.1 Privacy Constraints

- The site collects no personally identifiable information
- The `firstName` input on Screen 5 is never transmitted to any server or analytics service
- The `firstName` is used only for client-side canvas rendering and is discarded when the session ends
- Google Analytics collects only anonymous interaction events — no user IDs, no cookies beyond GA defaults
- The generated card image is created and stored only in the browser; it is never uploaded to any server

### 13.2 API Security

- The NanoBanana API key is stored as a server-side environment variable and never exposed to the client
- The `/api/generate-card` route should validate input parameters and reject malformed requests
- Consider rate limiting the API route (Vercel edge middleware or simple in-memory counter) to prevent abuse — low priority for pilot but good hygiene

---

## 14. Open Technical Decisions

| # | Decision | Options | Recommendation | Status |
|---|----------|---------|---------------|--------|
| 1 | Domain / URL | Subdomain vs. standalone | Subdomain of myBlueprint preferred for brand trust | Awaiting decision |
| 2 | Museo Sans availability | Self-host vs. Open Sans only | Use Open Sans for pilot; upgrade to Museo Sans if font files are available from brand team | Open |
| 3 | NanoBanana Pro 2 API latency on school networks | Accept latency vs. pre-generate all backgrounds | Build both paths; API primary, fallback pre-generated | Decided — dual approach |
| 4 | Card output dimensions | Social-card ratio (1200×675) vs. portrait (675×1050) vs. square | 1200×675 recommended — displays well on screen and in portfolio | Awaiting design input |
