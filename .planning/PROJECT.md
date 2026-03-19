# Career Explorer Micro-Site

## What This Is

A standalone, no-login, interactive micro-site that bookends VR career simulations for Grade 7/8 students in Saskatchewan. From a single landing page, students choose Pre-VR (a six-screen guided experience about carpentry that builds context and produces a personalized Carpenter Card) or Post-VR (a bridge page with a structured checklist that guides reflection and portfolio work in myBlueprint). Built for the Saint Luke School pilot in Regina, launching the week of April 6, 2026.

## Core Value

Students arrive at VR with real-world context and leave with a tangible, personal artifact — the Carpenter Card — and a clear path to turn excitement into meaningful career exploration in myBlueprint.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page with two bold, visually distinct paths: Pre-VR and Post-VR
- [ ] Screen 1: Hook with animated salary counter and Saskatchewan-specific career stats
- [ ] Screen 2: Six illustrated task tiles with 2–3 selection mechanic, persisted in session
- [ ] Screen 3: Stylized SVG map of Regina area with 4–6 tappable employer pins and company cards
- [ ] Screen 4: Interactive career pathway timeline with expandable accordion steps (Saskatchewan-specific)
- [ ] Screen 5: Carpenter Card builder — name input, icon picker, live preview, image download
- [ ] Screen 6: VR prep with observation prompts and backward navigation preserving state
- [ ] Post-VR bridge page with checkable 6-item checklist and myBlueprint link
- [ ] Google Analytics 4 event tracking across all meaningful interactions (no PII)
- [ ] Fully responsive design: Chromebook (1366×768 primary), tablet, mobile (320px minimum)
- [ ] WCAG AA accessibility compliance (contrast, keyboard nav, screen readers, touch targets)
- [ ] Card generation via pre-generated fallback backgrounds composited with Canvas API
- [ ] Content structured as JSON for future occupation swaps without code changes
- [ ] Deployed on Vercel with < 3s landing page load on school Chromebook

### Out of Scope

- Student authentication or login — fully anonymous, stateless
- Changes to the myBlueprint platform — students use existing functionality
- VR simulation or headset-side experience — owned by Melcher/VR Hub
- Content for occupations other than carpentry — future consideration
- Persistent data storage or user accounts — single session only
- CMS or admin interface — content is hardcoded for pilot
- NanoBanana Pro 2 API integration for card backgrounds — starting with fallback approach
- Real employer data — using realistic placeholders for pilot
- Museo Sans font — using Open Sans for pilot
- Multi-language support
- Educator-facing analytics dashboard

## Context

- **Collaboration:** VR Hub × myBlueprint Saskatchewan pilot at Saint Luke School in Regina
- **Target users:** Grade 7/8 students (ages 12–14), digitally fluent, short attention spans for schoolwork, using school Chromebooks
- **Three-station model:** Station 1 (Pre-VR micro-site) → Station 2 (VR simulation, owned by Melcher) → Station 3 (Post-VR micro-site + myBlueprint)
- **Content status:** Using realistic placeholder data for salary figures, employer profiles, and pathway details — to be replaced with sourced content before pilot
- **Card generation:** Starting with pre-generated background variants (6–12 PNGs) mapped to student selections via deterministic hash, composited client-side via Canvas API. NanoBanana API integration deferred.
- **Design direction:** Bold, gamified, personal — closer to a game than a worksheet. myBlueprint brand palette (navy, primary blue, light blue) applied for younger audience. Open Sans typography.
- **Key stakeholders:** Damian (build), Dwayne Melcher (VR Hub), Kelly Ireland (educator contact), Jacques (pathway content)

## Constraints

- **Timeline**: Hard deadline — deployed and tested by April 6, 2026 (pilot week)
- **Devices**: Must work on school-issued Chromebooks (1366×768) as primary target
- **Performance**: < 3s initial load, < 500ms screen transitions, < 1s card generation (fallback path)
- **Privacy**: Zero PII collection — student name never leaves the browser
- **No backend**: Stateless — all state in React context, lost on refresh
- **Analytics**: GA4 only, no additional vendors
- **Hosting**: Vercel (zero-config deploy from Git)
- **Accessibility**: WCAG AA — shapes design decisions from the start, not bolted on

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router + Vercel | Team default; SSG for static content; edge CDN for school networks | — Pending |
| Pre-generated card backgrounds (fallback-first) | Avoids API latency risk on school Chromebooks; NanoBanana can be added later | — Pending |
| Single route for Pre-VR flow (internal screen state) | Avoids page loads on slow school WiFi; preserves session state without URL manipulation | — Pending |
| Open Sans for pilot | Museo Sans unavailable from brand team; Open Sans is visually close and loads reliably | — Pending |
| Static SVG map (not Google Maps) | No API costs, no loading overhead, better accessibility on older devices | — Pending |
| Placeholder content for pilot build | Real data sourcing in parallel; JSON structure supports drop-in replacement | — Pending |
| All content in single JSON per occupation | Templatization seam — adding new occupations requires only a content file, no code changes | — Pending |

---
*Last updated: 2026-03-19 after initialization*
