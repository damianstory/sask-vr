# Pitfalls Research

**Domain:** Interactive educational micro-site for school Chromebooks (career exploration, Canvas API card generation, gamified UI)
**Researched:** 2026-03-19
**Confidence:** HIGH (domain-specific, verified across multiple sources)

## Critical Pitfalls

### Pitfall 1: Canvas API Image Download Blocked on Managed Chromebooks

**What goes wrong:**
Students tap "Download Your Carpenter Card" and nothing happens. Managed Chromebooks enforce the `DownloadRestrictions` Chrome policy, which can block blob URL downloads initiated via JavaScript. The `<a download>` + `URL.createObjectURL(blob)` pattern -- the standard approach for client-side image generation -- silently fails when the admin has restricted download types or sources. Students see no error, no file, no feedback.

**Why it happens:**
School IT departments configure Chrome Enterprise policies to prevent students from downloading executables, unknown file types, or files from non-allowlisted origins. Blob URLs (`blob:https://...`) are treated differently from normal HTTPS downloads and can be caught by these filters. Developers test on personal machines where no enterprise policies exist.

**How to avoid:**
1. Build a fallback path: if the blob download fails (detect via `setTimeout` check -- if no download initiated within 1s), show the card as a full-screen image and prompt "Long-press or right-click to save image" or "Take a screenshot."
2. Use `canvas.toBlob()` (not `toDataURL()`) to avoid memory issues on 4GB RAM Chromebooks. `toDataURL()` creates a massive base64 string in memory that can crash low-RAM tabs.
3. Test on an actual managed Chromebook with school-equivalent policies before pilot day. Ask the school IT contact for a test device or policy export.
4. Consider offering a "share to Google Drive" option as an alternative save path, since Drive is always accessible on school Chromebooks.

**Warning signs:**
- Download works on your Mac/PC but you have never tested on a Chromebook
- No error handling around the download flow
- Using `toDataURL()` instead of `toBlob()`
- No fallback UX when download fails

**Phase to address:**
Card generation phase (Screen 5 build). Must be tested on real school hardware before deployment.

---

### Pitfall 2: Font Loading Fails on School Networks

**What goes wrong:**
Open Sans loads from Google Fonts CDN. The school network firewall or proxy strips CORS headers from `fonts.googleapis.com` responses, or blocks Google API subdomains entirely. The site renders in Times New Roman / system serif for 3+ seconds (or permanently), destroying the designed look. Worse: Firefox waits ~3 seconds before falling back, creating a blank-text flash (FOIT) that makes screens appear broken.

**Why it happens:**
School networks run aggressive content filters (GoGuardian, Securly, Lightspeed) that inspect and sometimes modify HTTPS traffic via MITM proxies. These proxies can strip CORS headers or block entire Google subdomains. Google Fonts specifically requires both `fonts.googleapis.com` (CSS) and `fonts.gstatic.com` (font files) to be accessible.

**How to avoid:**
1. Self-host Open Sans. Download the WOFF2 files and serve them from the same origin via Next.js `/public` directory. This eliminates all external font dependencies.
2. Use `font-display: swap` to prevent FOIT (invisible text while loading).
3. Subset the font to only the characters needed (Latin, numbers) to reduce file size.
4. Preload the font files with `<link rel="preload" as="font" type="font/woff2" crossorigin>` in the document head.
5. Define a proper fallback stack: `'Open Sans', -apple-system, 'Segoe UI', Roboto, sans-serif` with `size-adjust` to minimize layout shift.

**Warning signs:**
- Any `<link>` tag pointing to `fonts.googleapis.com` in production
- Font files served from a different origin than the app
- No `font-display` property set
- Testing only on home/office WiFi

**Phase to address:**
Phase 1 (foundation/setup). Self-hosting fonts is a day-one decision, not a late optimization.

---

### Pitfall 3: Animations Jank or Freeze on 4GB Chromebooks

**What goes wrong:**
The animated salary counter, screen transitions, map pin animations, and card preview effects run smoothly on a developer's MacBook but stutter badly on a school Chromebook with a Celeron/MediaTek processor and 4GB RAM. The salary counter animation causes visible frame drops. CSS transitions on multiple elements simultaneously cause the browser to miss the 16.7ms frame budget, resulting in janky movement that makes the app feel broken to students.

**Why it happens:**
School Chromebooks (2019-2022 models still in rotation) have significantly less CPU/GPU power than development machines. Animating properties that trigger layout recalculation (width, height, top, left, margin, padding) forces the browser to recalculate layout on every frame. Multiple simultaneous animations compound the problem. JavaScript-driven number counting animations (`setInterval` with DOM updates) are especially expensive.

**How to avoid:**
1. Only animate `transform` and `opacity` -- these are GPU-composited and skip layout/paint.
2. For the salary counter: animate using CSS `counter` or a single `requestAnimationFrame` loop that updates one DOM element, not `setInterval`. Better yet: use CSS `@property` with a registered custom property to animate the number via CSS transitions (GPU-accelerated).
3. Limit to one animation per screen transition. Never animate more than 2-3 elements simultaneously.
4. Use `will-change: transform` sparingly (only on elements about to animate, remove after).
5. Respect `prefers-reduced-motion`: skip all decorative animations entirely. Show final values immediately for the salary counter.
6. Test with Chrome DevTools Performance panel throttled to 4x CPU slowdown.
7. Set a performance budget: no animation should cause frames longer than 20ms on throttled CPU.

**Warning signs:**
- Animating `width`, `height`, `top`, `left`, or `margin`
- More than 2 simultaneous animations on screen
- `setInterval` or `setTimeout` driving visual updates
- No `prefers-reduced-motion` media query anywhere in the codebase
- Never tested with CPU throttling enabled

**Phase to address:**
Every phase that adds animation. Establish the animation pattern (transform/opacity only, reduced-motion support) in Phase 1 and enforce it throughout.

---

### Pitfall 4: CORS Tainting Kills Canvas Compositing

**What goes wrong:**
The Carpenter Card composites a pre-generated PNG background with student-selected icons and their name via Canvas API. If the background PNG is loaded from a different origin (e.g., a CDN subdomain, or even `localhost` vs `127.0.0.1` during dev), the canvas becomes "tainted." Once tainted, `toBlob()` and `toDataURL()` throw a `SecurityError` and the card cannot be exported. The card preview might look fine, but the download button produces nothing.

**Why it happens:**
Canvas security model: any cross-origin image drawn onto a canvas without proper CORS headers taints it permanently. Common triggers: images served from a CDN with different domain, missing `crossOrigin="anonymous"` attribute on `<img>` elements, server not returning `Access-Control-Allow-Origin` header. Even Vercel preview deployments can have different origins than production.

**How to avoid:**
1. Serve all card background PNGs from the same origin as the app (Next.js `/public` directory). No CDN, no external URLs.
2. Set `crossOrigin="anonymous"` on every `<img>` element used as a canvas source, even for same-origin images (defensive).
3. Load images via `new Image()` with `crossOrigin` set before assigning `src`.
4. In the canvas compositing function, wrap `toBlob()` in try/catch and show a meaningful error ("Card preview is ready but download is unavailable") rather than silent failure.
5. Test the full download flow on Vercel preview deployments, not just `localhost`.

**Warning signs:**
- Background images loaded from any URL that is not the same origin
- No `crossOrigin` attribute on image elements
- No try/catch around `toBlob()` or `toDataURL()`
- Canvas export works in dev but is never tested on deployed preview

**Phase to address:**
Card generation phase (Screen 5). This must be validated in the same phase, on a deployed preview URL.

---

### Pitfall 5: SVG Map Crashes or Renders Slowly on Low-End Devices

**What goes wrong:**
The Regina area SVG map (Screen 3) with tappable employer pins renders slowly or causes visible lag when the SVG contains too many path nodes, embedded raster images, complex gradients, filters (blur, drop-shadow), or unoptimized paths exported from Illustrator/Figma. On a 4GB Chromebook, a complex SVG can take 500ms+ to render and cause scroll jank.

**Why it happens:**
SVG rendering is CPU-bound -- the browser must parse and rasterize every path. Illustrator/Figma exports include unnecessary metadata, excessive precision on coordinates (8+ decimal places), invisible layers, and unmerged paths. SVG filters like `feGaussianBlur` are not consistently GPU-accelerated across Chrome versions on Chromebook hardware.

**How to avoid:**
1. Run all SVGs through SVGO before committing. Target: each SVG under 15KB.
2. Limit path precision to 1-2 decimal places (`--precision 2` in SVGO).
3. No SVG filters (`<filter>`) on the map. Use CSS `box-shadow` or `filter: drop-shadow()` on the container instead (GPU-composited).
4. Keep the map simple: solid fills, clean paths, no gradients if possible. Flat illustration style is both trendy and performant.
5. Make employer pins separate SVG elements or HTML elements positioned over the map (easier to animate and interact with than SVG-internal elements).
6. Lazy-render pin tooltips/cards -- don't include them in the initial SVG DOM.

**Warning signs:**
- SVG file larger than 30KB
- SVG contains `<filter>`, `<feGaussianBlur>`, or complex `<linearGradient>` elements
- Path `d` attributes contain coordinates with 6+ decimal places
- Map is a single monolithic SVG with pins baked in

**Phase to address:**
Screen 3 (map) build phase. SVG optimization should be a build-step (SVGO in the pipeline), not a manual afterthought.

---

### Pitfall 6: GA4 Fires Events with PII or Gets Blocked Entirely

**What goes wrong:**
Two failure modes. (A) The student's name from the card builder accidentally gets sent to GA4 as an event parameter, violating the project's zero-PII constraint and potentially COPPA. (B) School network content filters or browser policies block `www.google-analytics.com` and `www.googletagmanager.com`, so no analytics data is collected at all, and the team has no usage data from the pilot.

**Why it happens:**
(A) Developers wire up event tracking and include the full state object or form values without sanitizing. GA4's `gtag('event', ...)` happily sends whatever parameters you pass. (B) School content filters commonly block tracking domains. Some managed Chromebooks have extensions that block analytics scripts.

**How to avoid:**
1. Create a thin analytics wrapper function that allowlists specific event parameters. Never pass raw state/form data to GA4. Explicitly exclude any field that could contain student input (name, text fields).
2. Add a comment/lint rule: "NEVER send user-entered text to GA4."
3. For network blocking: implement GA4 with `transport_url` pointing to a first-party proxy if possible, or accept that some events will be lost and design around it. At minimum, use `send_to` with `transport_type: 'beacon'` to maximize delivery.
4. Add a local event log (console or in-memory array) as a development/debugging fallback so you can verify events are firing even if GA4 is blocked.
5. Use GA4 DebugView during development to verify exact parameters being sent.
6. Keep events minimal: `screen_viewed`, `task_selected`, `card_downloaded`, `checklist_completed`. Avoid over-tracking that creates noise.

**Warning signs:**
- No analytics wrapper -- direct `gtag()` calls scattered through components
- Event parameters include any string typed by the user
- No testing on school network
- No fallback plan for when GA4 is blocked

**Phase to address:**
Analytics should be added in a dedicated phase after core screens are built. Implement the wrapper early, add events as each screen is completed, verify with DebugView before deployment.

---

### Pitfall 7: Session State Lost on Accidental Navigation or Refresh

**What goes wrong:**
A student completes 4 of 6 screens, accidentally swipes back (Chromebook trackpad gesture), presses the browser back button, or refreshes the page. All selections and progress are gone. They have to start over. In a classroom setting with limited time, this means they might not finish before rotating to the VR station.

**Why it happens:**
The project spec says "all state in React context, lost on refresh." This is architecturally correct for a stateless app, but it ignores how students actually interact with web pages on Chromebooks. Trackpad gestures on ChromeOS are aggressive -- two-finger swipe triggers browser back navigation. Students will also reflexively close and reopen tabs.

**How to avoid:**
1. Use `sessionStorage` to persist screen progress and selections. It survives refresh but not tab close (acceptable tradeoff for privacy).
2. Implement `beforeunload` warning: `window.addEventListener('beforeunload', ...)` to warn before losing progress.
3. Handle browser back/forward: use `history.pushState` for each screen transition so back button moves to previous screen within the flow, not away from the site.
4. The single-route architecture (internal screen state) already helps, but you must push history entries to prevent back-navigation from leaving the app.

**Warning signs:**
- No `sessionStorage` usage anywhere
- No `popstate` or `beforeunload` event listeners
- Browser back button exits the app entirely
- No testing of trackpad swipe gestures on ChromeOS

**Phase to address:**
Phase 1 (navigation/state management setup). The history management pattern must be established before building individual screens.

---

### Pitfall 8: Accessibility Failures in Gamified Interactive Elements

**What goes wrong:**
The task tile selection (Screen 2), map pins (Screen 3), icon picker (Screen 5), and checklist (Post-VR) are built as clickable `<div>` elements with `onClick` handlers but no keyboard support, no ARIA roles, no focus management, and no screen reader announcements. A student using keyboard-only navigation (common when trackpads are broken on old Chromebooks) cannot select tasks or pick icons. The interactive elements fail WCAG 2.1 AA.

**Why it happens:**
Gamified UIs prioritize visual design. Developers build custom selection interfaces with `<div>` + `onClick` instead of using semantic HTML (`<button>`, `<input type="checkbox">`, `<fieldset>`). Custom components lack `role`, `aria-selected`, `aria-pressed`, `tabIndex`, and keyboard event handlers (`onKeyDown` for Enter/Space).

**How to avoid:**
1. Use semantic HTML as the foundation: task tiles = `<button>` or `<input type="checkbox">` with custom styling. Icon picker = radio group with `<fieldset>` + `<legend>`. Checklist = actual `<input type="checkbox">`.
2. Every interactive element must be focusable and operable via keyboard (Enter and Space).
3. Minimum touch target: 44x44px (WCAG) but aim for 48x48px for younger users.
4. Add `aria-live="polite"` region for dynamic updates (salary counter result, selection count "2 of 6 selected").
5. Test with keyboard-only navigation on every screen before considering it done.
6. Color contrast: 4.5:1 minimum for text, 3:1 for UI components. Verify against the myBlueprint navy/blue palette.

**Warning signs:**
- `<div onClick>` without corresponding `role`, `tabIndex`, and `onKeyDown`
- No visible focus indicator (`:focus-visible` styles)
- Interactive elements smaller than 44x44px
- No screen reader testing (even basic VoiceOver/ChromeVox check)
- Selection state communicated only through color

**Phase to address:**
Every phase. Accessibility is not a separate phase -- it must be built into each component from the start. But a dedicated accessibility audit should happen before deployment.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded content in components instead of JSON | Faster initial build | Must refactor for every new occupation | Never -- JSON structure is a core requirement and takes minimal extra time |
| Skip `sessionStorage` persistence | Simpler state management | Students lose progress on refresh | Never for pilot -- too high a risk in classroom setting |
| Use `toDataURL()` instead of `toBlob()` | Slightly simpler code | Memory crash on 4GB Chromebooks with large card images | Never -- `toBlob()` is the same API complexity with better performance |
| Inline styles instead of Tailwind for one-off animations | Quick visual tweaks | Inconsistent styling, hard to apply reduced-motion | Only for truly one-off prototyping, refactor before merge |
| Skip SVGO optimization | Faster asset pipeline | Slow rendering on low-end devices, larger bundle | Never -- add SVGO to build pipeline on day one |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GA4 (gtag.js) | Sending student name or free-text input as event parameters | Create allowlisted analytics wrapper; never pass raw user input |
| GA4 (gtag.js) | Not handling consent / COPPA for under-13 users | Since no PII is collected and no cookies are used for advertising, configure GA4 with `ads_data_redaction: true` and disable advertising features. Document this decision. |
| GA4 (gtag.js) | Duplicate events on re-renders (React strict mode fires effects twice) | Use a ref-based guard to prevent duplicate event firing; test in StrictMode |
| Vercel deployment | Preview URLs have different origins than production, breaking CORS for canvas | Use relative paths for all assets; test canvas export on preview URLs |
| myBlueprint link (Post-VR) | Linking to a generic myBlueprint page instead of a deep-link | Confirm the exact destination URL with stakeholders; ensure it works when students are already logged into myBlueprint on their Chromebook |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized card background PNGs (1MB+ each) | 3+ second card generation, memory pressure | Compress to WebP with PNG fallback, target < 200KB per background | Immediately on 4GB Chromebooks |
| Loading all 6-12 card backgrounds on page load | Slow initial load, wasted bandwidth | Lazy-load only the selected background variant when needed | With more than 3-4 background variants |
| CSS `backdrop-filter: blur()` on modals/overlays | Janky overlay transitions on Chromebooks | Use solid semi-transparent backgrounds instead | On any device without GPU-accelerated backdrop-filter |
| Large JS bundle (> 200KB gzipped) | Slow parse/execute on Celeron CPUs | Code-split by route; the post-VR page should be a separate chunk | When bundle exceeds ~150KB gzipped |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Sending student name to any external service (GA4, error tracking, etc.) | COPPA violation, school trust destroyed, pilot cancelled | Analytics wrapper with parameter allowlist; no error tracking that captures DOM state |
| Storing student name in `localStorage` (persists across sessions) | Next student on same Chromebook sees previous student's name | Use `sessionStorage` only (cleared on tab close); clear explicitly on "Start Over" |
| Not sanitizing name input before rendering on card | XSS if name contains HTML/script (unlikely from 12-year-olds, but possible) | Render name as text node only, never `dangerouslySetInnerHTML`; limit input to alphanumeric + spaces |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No progress indicator across 6 screens | Students don't know how far along they are, feel lost | Persistent step indicator (1/6, 2/6...) at top of screen |
| "Download" button with no feedback on success/failure | Students tap repeatedly, unsure if it worked | Show success toast with thumbnail, or error state with fallback instructions |
| Back navigation destroys selections | Students afraid to go back and explore, rush through | Preserve state when navigating backward; clearly indicate selections are saved |
| Auto-advancing screens after selection | Students feel rushed, miss content | Let students control pacing; use a "Next" button, never auto-advance |
| Tiny tap targets on employer map pins | Students miss pins, think map is broken | Minimum 48x48px tap targets; add visible pulsing indicator on pins |
| No empty/loading state for card preview | Students see a flash of broken layout before card renders | Show skeleton/placeholder while canvas composites |

## "Looks Done But Isn't" Checklist

- [ ] **Card download:** Works on a managed Chromebook, not just your dev machine -- verify with school IT or test device
- [ ] **Font rendering:** Works when Google Fonts CDN is blocked -- verify by disabling network access to `fonts.googleapis.com`
- [ ] **Keyboard navigation:** Every interactive element on every screen can be reached and operated via Tab + Enter/Space -- test without a mouse
- [ ] **Back button:** Pressing browser back on Screen 4 goes to Screen 3, not away from the app -- test the actual browser back button
- [ ] **Reduced motion:** All animations respect `prefers-reduced-motion: reduce` -- enable in OS settings and verify
- [ ] **Salary counter:** Shows final value (not zero or mid-animation) when `prefers-reduced-motion` is enabled
- [ ] **Screen reader:** ChromeVox (built into Chromebooks) can announce screen changes and selection states
- [ ] **4GB RAM:** App runs without tab crashes when card is generated -- test with Chrome Task Manager showing memory usage
- [ ] **Slow network:** Site loads and is interactive within 3 seconds on throttled connection (Chrome DevTools: Slow 3G) -- static generation helps but verify
- [ ] **GA4 events:** DebugView confirms events fire with correct (non-PII) parameters on deployed preview
- [ ] **Touch targets:** All interactive elements are at least 44x44px -- verify with DevTools element inspector
- [ ] **Canvas compositing:** Card download works on Vercel preview URL, not just localhost

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Canvas download blocked on school devices | MEDIUM | Add screenshot fallback UX, long-press save prompt, or Google Drive share button |
| Fonts blocked by firewall | LOW | Switch to self-hosted fonts (< 1 hour change if font files are already in repo) |
| Animation jank on Chromebooks | MEDIUM | Replace all non-transform/opacity animations; may require rethinking visual design |
| CORS tainted canvas | LOW | Move all assets to same origin `/public` directory; add `crossOrigin` attributes |
| GA4 blocked by network | LOW | Accept data loss for blocked environments; ensure local debug logging works |
| Session state lost on refresh | MEDIUM | Add `sessionStorage` persistence layer; requires touching state management across all screens |
| PII accidentally sent to GA4 | HIGH | Audit all GA4 calls, delete the GA4 property data if contaminated, rebuild analytics wrapper with strict allowlist |
| Accessibility failures discovered late | HIGH | Retrofitting semantic HTML and ARIA onto custom div-based components is expensive; much cheaper to build correctly from the start |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Font loading on school networks | Phase 1: Foundation/Setup | Fonts render with `fonts.googleapis.com` blocked in DevTools network panel |
| Animation jank on Chromebooks | Phase 1 + Every phase | Chrome DevTools Performance recording with 4x CPU throttle shows no frames > 20ms |
| Session state / back navigation | Phase 1: Navigation/State | Browser back button navigates between screens; refresh preserves progress |
| Accessibility (keyboard, ARIA) | Every phase (per-component) | Full keyboard walkthrough of each screen; ChromeVox announces all interactive elements |
| CORS tainted canvas | Card generation phase | `toBlob()` succeeds on Vercel preview URL |
| Canvas download on Chromebooks | Card generation phase | Download produces a file on managed Chromebook test device |
| SVG map performance | Map screen phase | Map renders in < 200ms on throttled CPU; no jank when tapping pins |
| GA4 PII leak | Analytics phase | DebugView shows zero user-entered strings in any event parameter |
| GA4 blocked by network | Analytics phase | Local event log captures events even when GA4 domain is blocked |
| `prefers-reduced-motion` | Every phase with animation | OS reduced-motion setting eliminates all decorative animation; counters show final values |

## Sources

- [MDN: HTMLCanvasElement.toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) -- Canvas export API docs and CORS restrictions
- [MDN: CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image) -- Tainted canvas prevention
- [Downloading Large Canvas Images with toBlob](https://www.xjavascript.com/blog/downloading-canvas-image-using-toblob/) -- toBlob vs toDataURL performance
- [Chrome Enterprise: Download Restrictions](https://support.google.com/chrome/a/answer/7579271?hl=en) -- Managed Chromebook download policies
- [Chromium Issue: Blob download blocked](https://groups.google.com/a/chromium.org/g/security-dev/c/0pd9a3gI5IA) -- Blob URL download restrictions
- [Inspiroz: Chromebook RAM Management](https://inspiroz.com/how-smart-chromebook-ram-management-supercharges-classroom-efficiency/) -- School Chromebook hardware constraints
- [Google Fonts Troubleshooting](https://developers.google.com/fonts/docs/troubleshooting) -- Font loading CORS and network issues
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) -- Reduced motion best practices
- [MDN: Animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) -- Frame rate and animation optimization
- [CodePen: Improving SVG Rendering Performance](https://codepen.io/tigt/post/improving-svg-rendering-performance) -- SVG optimization techniques
- [Merkle: GA4 Pitfalls](https://www.merkle.com/en/merkle-now/articles-blogs/2025/navigating-ga4-pitfalls-that-could-derail-your-analytics.html) -- GA4 implementation mistakes
- [Analytics Mania: GA4 Mistakes](https://www.analyticsmania.com/post/google-analytics-4-mistakes/) -- Common GA4 configuration errors
- [W3C: CSS prefers-reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) -- WCAG 2.2 motion technique
- [Google Cloud: COPPA Compliance](https://cloud.google.com/security/compliance/coppa) -- COPPA requirements for Google services

---
*Pitfalls research for: Career Explorer Micro-Site (Saskatchewan VR pilot)*
*Researched: 2026-03-19*
