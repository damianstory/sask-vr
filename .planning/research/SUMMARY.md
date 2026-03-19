# Project Research Summary

**Project:** Career Explorer Micro-Site (Sask-VR)
**Domain:** Interactive educational micro-site — Grade 7/8 career exploration, Saskatchewan VR pilot
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

The Sask-VR Career Explorer is a stateless, single-session educational micro-site designed to bookend a VR carpentry simulation for Grade 7/8 students. The recommended approach is Next.js 16.2 with static export (SSG), deployed to Vercel's edge CDN, with a single-route six-screen wizard pattern managed via React Context. All research converges on a few core constraints: Chromebook performance (4GB RAM, Celeron-class CPU), school network restrictions (firewall proxies, content filters), and zero-PII requirements for minors. These constraints drive every significant architectural decision — from self-hosted fonts to native Canvas API over any external card library.

The product's core differentiator is depth over breadth: one occupation, rich local Saskatchewan context, a tangible downloadable artifact (the Carpenter Card), and a purpose-built VR-bookend flow that no competitor in the space offers. The JSON content architecture ensures that adding a second occupation (Electrician, Plumber) requires zero code changes — only a new content file. This is the primary scalability story for stakeholders beyond the pilot.

The highest risks are: (1) Canvas card download silently failing on managed Chromebooks due to enterprise download restrictions, (2) student session state being lost when trackpad swipe gestures trigger browser back navigation, and (3) accessibility failures in gamified UI elements that look done but lack keyboard support. All three are preventable if addressed from Phase 1 — they become expensive to retrofit. The pilot target date is April 6, 2026, making scope discipline essential.

## Key Findings

### Recommended Stack

Next.js 16.2 with App Router is the clear choice: it ships React 19.2, Turbopack as default (faster builds), and SSG via standard Vercel deploy (no `output: 'export'` needed — Vercel handles SSG natively and keeps the door open for future API routes). Tailwind CSS v4 (CSS-first config, Oxide engine) pairs with shadcn/ui for accessible Radix-based components. Motion (formerly Framer Motion) v12 handles orchestrated screen transitions and AnimatePresence; simple hover/fade states use native CSS. The Canvas API (no library) handles card compositing — html2canvas and similar are ruled out for Chromebook performance reasons. State is React Context + useState only — Zustand and similar are overkill for 4 fields of ephemeral session state. See [STACK.md](.planning/research/STACK.md) for the full rationale.

**Core technologies:**
- **Next.js 16.2 + React 19.2**: App framework, SSG, routing — greenfield project, latest stable, Turbopack default
- **TypeScript 5.x**: Non-negotiable for a deadline project — catches bugs at compile time
- **Tailwind CSS 4.1 + shadcn/ui**: Utility-first styling with WCAG AA components via Radix primitives
- **Motion 12.x**: Orchestrated screen transitions and AnimatePresence (import from `motion/react`)
- **Native Canvas API**: Card compositing — no external library, keeps bundle small and PII in browser
- **React Context + useState**: Session state only — ephemeral by design, no persistence library
- **@next/third-parties + gtag.js**: GA4 analytics via typed wrapper
- **countup.js** (2.8KB): Salary counter animation — lightweight, no Motion+ membership required
- **next/font/google → self-hosted WOFF2**: Open Sans, must be self-hosted to survive school network firewalls

### Expected Features

The full feature list is 13 P1 items that constitute the complete pilot product — there is no "MVP subset." Missing any of the P1 features means the pilot fails or delivers no data. See [FEATURES.md](.planning/research/FEATURES.md) for the full dependency graph.

**Must have (table stakes) — all required for pilot launch:**
- Landing page with Pre-VR / Post-VR path selection
- Screen 1: Animated salary/stats hook with Saskatchewan-specific data
- Screen 2: Six illustrated task tiles with pick-2-3 selection mechanic
- Screen 3: SVG map of Regina with 4-6 tappable employer pins and overlay cards
- Screen 4: Career pathway timeline with expandable accordion steps
- Screen 5: Carpenter Card builder — name input, icon picker, live CSS preview, PNG download
- Screen 6: VR prep screen with structured observation prompts
- Post-VR reflection checklist (6 items) with myBlueprint CTA link
- Session state preservation with backward navigation (selections survive going back)
- Responsive design (Chromebook 1366x768 primary, 320px minimum)
- WCAG AA accessibility throughout
- GA4 event tracking on all key interactions
- JSON content architecture (occupation-agnostic schema)

**Should have (differentiators — also in pilot scope):**
- Deterministic card background hash from task selections (selections drive visual output)
- Icon picker for card personalization (8-12 tool/trade icons)
- VR-bookend flow design as distinct Pre/Post journeys (novel in the space)
- Structured observation prompts before VR (advance organizer educational technique)

**Defer (v1.x after pilot validation):**
- Additional occupation JSON files (Electrician, Plumber, Welder)
- Real employer data with verified salary figures (requires partnership agreements)
- Card sharing via URL/QR code (no backend needed)
- Museo Sans font integration (requires brand team delivery)

**Defer (v2+):**
- French language support
- Educator analytics dashboard
- Deeper myBlueprint API integration

### Architecture Approach

The architecture is a single-route multi-screen wizard: the Pre-VR flow renders six screens within one Next.js route (`/pre-vr`) using a `currentScreen` useState index. No URL changes between screens — this is deliberate to avoid WiFi-latency flickers on school networks. React Context (SessionProvider) holds all session state: selected tasks, student name, icon choice, and viewed employers. State is intentionally ephemeral (lost on tab close) with sessionStorage persistence for refresh survival. The Card Generator is a pure async function (no React dependencies) invoked only at download time; the live preview uses CSS rendering to avoid Canvas jank on Chromebooks. All content lives in a typed JSON file (`content/carpenter.json`) imported at build time — no runtime fetching. See [ARCHITECTURE.md](.planning/research/ARCHITECTURE.md) for the full build order and data flow diagrams.

**Major components:**
1. **App Shell** (Next.js App Router) — routing, fonts, GA4 script, brand tokens
2. **Landing Page** (Server Component) — static, two-path selection, no client JS
3. **Pre-VR Flow** (Client Component) — six-screen wizard, SessionProvider wrapper, screen switcher, progress bar
4. **Post-VR Page** (Client Component) — reflection checklist, myBlueprint link
5. **SessionContext** — ephemeral cross-screen state (tasks, name, icon, employer views)
6. **Content JSON + TypeScript types** — all occupation-specific copy, structured for future swaps
7. **Card Generator** (pure async function) — Canvas compositing pipeline, invoked at download only
8. **SVG Map** — inline SVG with ARIA-accessible tappable employer pins
9. **Analytics Service** — typed GA4 wrapper, zero PII, allowlisted event parameters

### Critical Pitfalls

See [PITFALLS.md](.planning/research/PITFALLS.md) for the full list with recovery strategies.

1. **Canvas download blocked on managed Chromebooks** — Enterprise `DownloadRestrictions` policy silently blocks blob URL downloads. Prevent by building a fallback path (long-press/screenshot prompt) and testing on an actual school-managed device before pilot day. Always use `toBlob()` not `toDataURL()` (memory safety on 4GB RAM).

2. **Font loading fails on school network firewalls** — School content filters (GoGuardian, Securly) block `fonts.googleapis.com`. Self-host Open Sans WOFF2 files from `public/` on day one. This is a foundation decision, not a late optimization.

3. **Session state lost on Chromebook back-navigation** — Trackpad swipe gestures trigger browser back, losing all student progress. Add `sessionStorage` persistence and `history.pushState` for each screen transition so the back button moves between screens within the app, not away from it.

4. **CORS-tainted canvas kills card export** — Any cross-origin image drawn on the canvas (CDN subdomain, wrong origin) permanently taints it — `toBlob()` throws SecurityError. Serve all card assets from `/public` (same origin), set `crossOrigin="anonymous"` defensively, and verify on Vercel preview URLs not just localhost.

5. **Accessibility failures in gamified UI** — Custom `<div onClick>` task tiles, map pins, and icon pickers without keyboard support fail WCAG AA. Build with semantic HTML from the start: task tiles = `<button>` or styled checkboxes, icon picker = radio group with fieldset. Retrofitting is expensive; building correctly is cheap.

6. **Animation jank on 4GB Chromebooks** — Only animate `transform` and `opacity` (GPU-composited). Never animate `width`, `height`, `top`, `left`. Respect `prefers-reduced-motion`. Test with 4x CPU throttle in Chrome DevTools.

## Implications for Roadmap

Based on the build order derived from architectural dependencies and pitfall prevention timing, 5 phases are suggested. Phases 3 screens can be built in parallel after the Phase 2 shell exists.

### Phase 1: Foundation + State Architecture
**Rationale:** Content schema, session state, font self-hosting, animation rules, and navigation history management are cross-cutting concerns. Changing them after screens are built forces changes everywhere. This is the most expensive phase to get wrong and the cheapest to get right up front.
**Delivers:** Project scaffold, content JSON schema + TypeScript types, SessionContext, self-hosted fonts, analytics typed wrapper, `sessionStorage` persistence layer, `history.pushState` screen navigation, animation token rules (transform/opacity only, reduced-motion support), SVGO in build pipeline.
**Addresses:** JSON content architecture, session state preservation, backward navigation features from FEATURES.md.
**Avoids:** Font loading failure (Pitfall 2), session state loss (Pitfall 7), animation jank (Pitfall 3) — all must be established before any screens exist.
**Research flag:** Standard patterns — skip phase research. Next.js + Tailwind + Context are well-documented.

### Phase 2: Shell + Navigation Flow
**Rationale:** The landing page and Pre-VR flow skeleton (screen switcher, progress bar, SessionProvider) must exist before any individual screen can be rendered. Post-VR is independent but simple enough to include here.
**Delivers:** Root layout (fonts, GA4 script), landing page (two-path split), Pre-VR flow page (`/pre-vr`) with screen index switcher and progress bar, Post-VR page skeleton with myBlueprint link, screen transition animations (Motion AnimatePresence).
**Addresses:** Landing page, session state wrapper, responsive design scaffolding.
**Avoids:** Accidental anti-pattern of URL-based screen state (enforce single-route architecture here).
**Research flag:** Standard patterns — skip phase research.

### Phase 3: Content Screens (Parallelizable)
**Rationale:** Screens 1, 2, 3, 4, and 6 are largely independent of each other once the Phase 2 shell exists. Screen 2 (task selection) is the most critical because it writes to SessionContext — the data that Screen 5 consumes. Screen 3 (map) is the most complex to build correctly.
**Delivers:** Screen 1 (animated salary counter with countup.js), Screen 2 (six task tiles with selection mechanic and context writes), Screen 3 (inline SVG map with SVGO-optimized file, accessible tappable employer pins, overlay cards), Screen 4 (career pathway accordion timeline), Screen 6 (VR prep + observation prompts), Post-VR reflection checklist.
**Uses:** countup.js for counter, shadcn/ui accordion, inline SVG + ARIA roles, Motion for pin entrance animations.
**Avoids:** SVG map complexity (Pitfall 5 — SVGO, no filters, separate pin elements), accessibility failures (Pitfall 8 — semantic HTML from the start).
**Research flag:** Screen 3 (SVG map accessibility) may benefit from a quick research pass — accessible interactive SVG is a niche area. Remaining screens follow standard patterns.

### Phase 4: Card Builder
**Rationale:** Screen 5 depends on Screen 2's SessionContext writes (selected tasks drive the background hash). It cannot be built meaningfully until task selection state is proven working. Canvas compositing is the highest-risk technical component and needs the most validation.
**Delivers:** Screen 5 (name input, icon picker grid, CSS live preview, deterministic background hash from task selections), CardGenerator pure function (Canvas compositing — background PNG + icon + name), download flow (`toBlob` + `URL.createObjectURL` + anchor click), fallback UX when download fails (screenshot prompt), pre-generated background PNG assets (compressed, same-origin in `/public`).
**Uses:** Native Canvas API, countup.js (not applicable here), same-origin asset serving.
**Avoids:** CORS-tainted canvas (Pitfall 4), managed Chromebook download block (Pitfall 1) — both must be tested on a real school device in this phase.
**Research flag:** Managed Chromebook download testing is the key unknown. No research substitute for testing on actual school hardware — flag this as a verification requirement, not a research need.

### Phase 5: Polish + Verification
**Rationale:** Animations, accessibility audit, performance testing, and GA4 event verification require the full flow to exist. These can't be done in isolation. This phase gates the deployment.
**Delivers:** Screen transition polish (Motion AnimatePresence timing, stagger), full keyboard navigation walkthrough on every screen, ChromeVox screen reader testing, contrast ratio audit against myBlueprint palette, Chrome DevTools 4x CPU throttle performance pass, GA4 DebugView event verification (zero PII in any parameter), Vercel preview URL end-to-end test (canvas export, fonts, analytics).
**Addresses:** WCAG AA accessibility requirement, GA4 tracking requirement, Chromebook performance requirement, fast load time requirement.
**Avoids:** PII leak to GA4 (Pitfall 6), late-discovered accessibility failures (Pitfall 8).
**Research flag:** Standard verification patterns — skip phase research.

### Phase Ordering Rationale

- **Content schema before everything** — every component consumes it. Changing the schema after Screen 3 is built forces changes to every screen and the card generator simultaneously.
- **Self-hosted fonts and sessionStorage in Phase 1** — both are infrastructure decisions that require touching multiple files if added later. They are 2-hour tasks in Phase 1 and 8-hour tasks in Phase 5.
- **Screens before Card Builder** — Screen 5 needs to consume real SessionContext state from Screen 2. Building it in isolation means building it twice.
- **Polish last, not sprinkled throughout** — animation polish and accessibility audits require the full flow. Doing them per-screen creates rework when screen transitions change.
- **Managed Chromebook testing in Phase 4** — not Phase 5. If the canvas download is fundamentally broken on school hardware, it needs to be discovered before the full polish phase, not after.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Screen 3 — SVG Map):** Accessible interactive SVG with keyboard-navigable pins and ARIA announcements is a niche topic. Worth a focused research pass before building. The MN.gov accessibility guide for interactive maps and the FLOE Project SVG accessibility handbook are the best sources.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Next.js project setup, Tailwind v4, React Context — all extensively documented.
- **Phase 2:** App Router layouts, Server vs Client Components, Motion AnimatePresence — standard patterns.
- **Phase 4:** Canvas API compositing is well-documented at MDN. The Vercel deployment CORS pattern is straightforward.
- **Phase 5:** Accessibility auditing and GA4 DebugView verification are standard processes.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All choices are latest-stable, official docs cited, no deprecated APIs. Next.js 16.2 just released (2026-03-18) — greenfield timing is ideal. |
| Features | MEDIUM-HIGH | Table stakes grounded in educational research. Competitor analysis is solid. The pilot feature set is well-scoped. One unknown: actual myBlueprint deep-link URL requires stakeholder confirmation. |
| Architecture | HIGH | Patterns are well-established (React Context wizard, Canvas compositing, SSG). Build order derived from true dependencies, not convention. Official sources throughout. |
| Pitfalls | HIGH | Domain-specific, verified across multiple sources. Managed Chromebook restrictions and school network behavior are well-documented real-world constraints, not theoretical risks. |

**Overall confidence:** HIGH

### Gaps to Address

- **myBlueprint deep-link URL:** The Post-VR checklist links to myBlueprint but the exact destination URL is unknown. Must be confirmed with stakeholders before Phase 2 build. It goes in `content/carpenter.json` — easy to update, but needs to be the right link.
- **Card background visual designs:** The deterministic hash maps task selections to 6-12 pre-generated background variants. These need to be designed and supplied as compressed PNGs (target < 200KB each). Design work must happen in parallel with or before Phase 4.
- **SVG map illustration:** The Regina-area map needs to be a custom illustration (not Google Maps). This is a design asset dependency for Phase 3. Must be SVGO-optimized before handoff.
- **Employer data:** 4-6 Regina-area carpentry employers with coordinates, descriptions, and project highlights. Placeholder data is acceptable for pilot but should be confirmed as accurate before launch.
- **Managed Chromebook test device:** No research substitute for testing on actual school hardware with enterprise policies. This needs to be arranged with the school IT contact before Phase 4 ends.
- **GA4 property ID:** Needed for Phase 2 (GA4 script in root layout). Get this from stakeholders before Phase 2 starts.

## Sources

### Primary (HIGH confidence)
- [Next.js 16.2 Release Blog](https://nextjs.org/blog/next-16-2) — version features, React 19.2, Turbopack default
- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports) — SSG configuration
- [Next.js @next/third-parties GA4](https://nextjs.org/docs/messages/next-script-for-ga) — GA4 integration
- [Vercel: React Context with Next.js App Router](https://vercel.com/kb/guide/react-context-state-management-nextjs) — SessionProvider pattern
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, Oxide engine
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) — v4 compatibility
- [Motion.dev Documentation](https://motion.dev/docs/react) — AnimatePresence, screen transitions
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images) — compositing, toBlob
- [MDN: CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image) — tainted canvas prevention
- [Chrome Enterprise: Download Restrictions](https://support.google.com/chrome/a/answer/7579271) — managed Chromebook policies
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) — animation accessibility

### Secondary (MEDIUM confidence)
- [ASCA / AMLE / ACTE research](https://www.amle.org/career-exploration-and-awareness-in-the-middle-grades-research-summary/) — middle school career engagement patterns
- [SVG Accessibility - FLOE Project](https://handbook.floeproject.org/approaches/svg-and-accessibility/) — interactive SVG ARIA patterns
- [MN.gov Accessibility Guide for Interactive Web Maps](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf) — map pin keyboard navigation
- [Mykola Aleksandrov: GA4 in React](https://www.mykolaaleksandrov.dev/posts/2025/11/react-google-analytics-implementation/) — analytics abstraction layer pattern
- [React State Management in 2025](https://www.developerway.com/posts/react-state-management-2025) — Context vs external libraries guidance

### Tertiary (LOW confidence)
- [NanoBanana Pro 2 API](https://nanabanana.com) — deferred feature (dynamic card backgrounds). API stability not confirmed; placeholder for v1.x.

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*
