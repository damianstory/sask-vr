# Codebase Concerns

**Analysis Date:** 2026-04-03

## Tech Debt

**Occupation switcher is a manual constant swap:**
- Issue: Switching from carpentry to any other occupation requires manually editing the `OCCUPATION` constant and ensuring a matching JSON file exists. The comment in `content/config.ts` says "no other code changes are needed," but hard-coded strings like `'CARPENTER CARD'`, `'Carpentry'`, and `'carpenter-card.png'` are scattered across `lib/generate-card.ts`, `app/pre-vr/components/CardPreview.tsx`, and `app/pre-vr/components/ScreenFive.tsx`. These will not update automatically.
- Files: `content/config.ts`, `lib/generate-card.ts` (line 34), `app/pre-vr/components/CardPreview.tsx` (line 33), `app/pre-vr/components/ScreenFive.tsx` (line 55)
- Impact: Any second occupation silently renders wrong card title and download filename.
- Fix approach: Add `cardTitle` and `downloadFileName` fields to `OccupationContent` type in `content/types.ts` and thread them through `generateCardPng` params and `CardPreview` props.

**Inconsistent lazy-loading — only ScreenThree is lazy:**
- Issue: `app/pre-vr/page.tsx` uses `React.lazy` and `Suspense` only for `ScreenThree`. All other screens (`ScreenFour`, `ScreenFive`, `ScreenSix`) are eagerly imported at the top of the page. ScreenFive bundles `maplibre-gl`-adjacent logic indirectly, and all screens are loaded into the initial JS bundle even though a user may never reach them.
- Files: `app/pre-vr/page.tsx` (lines 3-13)
- Impact: Larger initial JS bundle than necessary; inconsistent code-splitting story.
- Fix approach: Apply `lazy()` consistently to `ScreenFour`, `ScreenFive`, and `ScreenSix` with a shared `Suspense` fallback, or remove the ScreenThree lazy if the savings are not worth the complexity.

**`generatedCardUrl` stored in context but never read:**
- Issue: `setGeneratedCardUrl` is called in `ScreenFive.tsx` after a download, but nothing in the app reads `generatedCardUrl` from `SessionContext`. The URL is also immediately revoked (`URL.revokeObjectURL`) in the same function, making the stored value a dead object URL.
- Files: `context/SessionContext.tsx`, `app/pre-vr/components/ScreenFive.tsx` (lines 59-60)
- Impact: Dead state adds noise to the context shape and the revoked URL would error if anything ever tried to use it.
- Fix approach: Either remove `generatedCardUrl` from `SessionContext` entirely, or defer `revokeObjectURL` and store the URL for a share/re-download feature.

**Fragile `promptIcons` array indexed by position:**
- Issue: `ScreenSix.tsx` maps over `data.prompts` and accesses `promptIcons[index]` with a hard-coded 3-element array. If `carpentry.json` ever has more or fewer than 3 prompts, some icons will be `undefined` (silently rendered as nothing).
- Files: `app/pre-vr/components/ScreenSix.tsx` (lines 5, 43)
- Impact: Silent rendering failure if prompt count changes in content.
- Fix approach: Move the icon assignment into the JSON content, or use modulo access `promptIcons[index % promptIcons.length]` as a safe fallback.

**`ScreenFour` has two separate `button` elements with identical `aria-expanded` and `onClick` per step:**
- Issue: Each pathway step renders two `<button>` elements — one for the timeline dot and one for the card — both calling `toggleStep(step.id)` and both carrying `aria-expanded`. Screen reader users encounter two controls for the same action, and the timeline dot button has no visible label (only the step number).
- Files: `app/pre-vr/components/ScreenFour.tsx` (lines 51-65, 81-104)
- Impact: Redundant interactive elements; potentially confusing to assistive technology users; the dot button fails a minimum accessible name requirement.
- Fix approach: Convert the timeline dot to a non-interactive `div` with `aria-hidden="true"`, keeping one labeled `<button>` per step.

**`Navigation` "Next" button bypasses Screen 2's minimum selection gate:**
- Issue: The shared `Navigation` bar at the bottom of the pre-VR flow calls `onNext` unconditionally on screens 1, 3, 4, and 6, but also fires on screen 2. Screen 2 has its own local CTA with a selection guard, but the global "Next" button in `Navigation` has no knowledge of per-screen validation state. A user can skip tile selection entirely by pressing the nav "Next" button.
- Files: `components/Navigation.tsx`, `app/pre-vr/page.tsx` (lines 103-108), `app/pre-vr/components/ScreenTwo.tsx`
- Impact: Users can reach ScreenFive with zero tiles selected, producing a card with no task chips. The app handles this gracefully (shows a fallback), but it violates the intended flow gating.
- Fix approach: Pass a `canAdvance` flag or callback from each screen to `PreVRPage` and disable/hide the Navigation "Next" button when the current screen has unmet requirements.

**`img` tag used instead of `next/image` on the landing page:**
- Issue: The myBlueprint logo on `app/page.tsx` is rendered with a plain `<img>` tag rather than the Next.js `<Image>` component.
- Files: `app/page.tsx` (line 22)
- Impact: No automatic optimisation (WebP conversion, lazy loading, blur placeholder, intrinsic size enforcement). Missing `width`/`height` props causes Cumulative Layout Shift.
- Fix approach: Replace with `<Image>` from `next/image`, adding explicit `width` and `height` props.

## Known Bugs

**Revoked object URL stored to context:**
- Symptoms: `setGeneratedCardUrl('blob:...')` is called immediately after `URL.revokeObjectURL(url)` in the same function. The stored URL is already invalid by the time it lands in context.
- Files: `app/pre-vr/components/ScreenFive.tsx` (lines 57-61)
- Trigger: Every successful card download.
- Workaround: The stored URL is currently never read, so no visible failure occurs.

**`ScreenThree` map markers use raw DOM event listeners that are never cleaned up:**
- Symptoms: The `useEffect` that initialises the MapLibre map creates `button` elements and attaches `addEventListener('click', ...)` handlers imperatively. The cleanup function calls `map.remove()` and nulls `mapRef.current`, but the event listeners on the pin `el` elements are not explicitly removed.
- Files: `app/pre-vr/components/ScreenThree.tsx` (lines 71-127)
- Trigger: Component mount/unmount cycle (e.g. navigating away from Screen 3 and back).
- Workaround: MapLibre removes marker DOM nodes on `map.remove()`, so in practice the listeners are garbage-collected with the nodes; this is a risk rather than a confirmed leak under normal single-page navigation.

## Security Considerations

**Third-party map tile endpoint hardcoded with no CSP:**
- Risk: `ScreenThree.tsx` fetches map tiles from `https://basemaps.cartocdn.com/gl/positron-gl-style/style.json` at runtime. There is no Content Security Policy header configured in `next.config.ts` to restrict where network requests or `connect-src` fetches are allowed.
- Files: `app/pre-vr/components/ScreenThree.tsx` (line 11), `next.config.ts`
- Current mitigation: None.
- Recommendations: Add `headers()` configuration in `next.config.ts` with at minimum `connect-src` covering the Carto domain, and `img-src` for tile image requests.

**`NEXT_PUBLIC_GA_MEASUREMENT_ID` exposed in client bundle:**
- Risk: The GA measurement ID is a `NEXT_PUBLIC_` variable, meaning it is inlined into the client bundle and visible to anyone who inspects the page source. This is intentional for GA, but it means the ID cannot be rotated silently.
- Files: `app/layout.tsx` (line 34)
- Current mitigation: GA measurement IDs are low-sensitivity; Carto base map tiles are also public. No secret exposure.
- Recommendations: Document this as intentional; do not add any private API keys under `NEXT_PUBLIC_` prefix.

## Performance Bottlenecks

**Canvas card generation blocks on `document.fonts.ready` without a timeout:**
- Problem: `generateCardPng` awaits `document.fonts.ready` before drawing to canvas. If the Open Sans font fails to load (e.g. network error, ad blocker), this promise may never resolve, hanging the download indefinitely.
- Files: `lib/generate-card.ts` (line 15)
- Cause: No timeout or fallback.
- Improvement path: Wrap with `Promise.race([document.fonts.ready, timeoutPromise(3000)])` and fall back to a system sans-serif if fonts are not available.

**`maplibre-gl` (large dependency) loaded on Screen 3 with no preload hint:**
- Problem: MapLibre GL JS is a heavy dependency (~1.5 MB unminified). It is lazy-loaded via `React.lazy` for `ScreenThree`, but there is no `<link rel="modulepreload">` or equivalent hint to fetch it during idle time on Screens 1–2.
- Files: `app/pre-vr/page.tsx` (line 9), `app/pre-vr/components/ScreenThree.tsx` (line 5)
- Cause: No prefetch strategy.
- Improvement path: Use `import(/* webpackPrefetch: true */ './components/ScreenThree')` or an `onMouseEnter` preload trigger on the Screen 2 "Continue" button.

## Fragile Areas

**`SessionProvider` is only mounted in the pre-VR flow:**
- Files: `app/pre-vr/page.tsx` (line 86)
- Why fragile: `SessionContext` is instantiated inside the pre-VR page component, not at the root layout. Any component inside `app/pre-vr/` that calls `useSession()` outside this provider (e.g. if a screen is ever rendered standalone in a test without the wrapper) throws immediately with `"useSession must be used within a SessionProvider"`.
- Safe modification: Always wrap test renders of pre-VR screens with `<SessionProvider>`, or use the per-test mock pattern already established in `tests/screen-two.test.tsx`.
- Test coverage: Unit tests for ScreenTwo and ScreenFive correctly mock `useSession` directly, so this is not a gap in existing tests.

**`ScreenSix` has no test file:**
- Files: `app/pre-vr/components/ScreenSix.tsx`
- Why fragile: ScreenSix is the final screen users see before VR. The only coverage is the axe accessibility test in `tests/a11y/screens.a11y.test.tsx`. Prompt rendering, icon count assumptions, and content-driven behaviour have no unit tests.
- Test coverage: Accessibility only; zero behavioural coverage.
- Priority: Low (static display screen, no interactivity).

**`ScreenThree` has no unit test file:**
- Files: `app/pre-vr/components/ScreenThree.tsx`
- Why fragile: The employer map and card interaction logic (open, close via Escape, close via click-outside, focus return to pin) are entirely untested at the unit level. The integration test in `tests/pre-vr-flow.test.tsx` mocks MapLibre fully and only confirms the screen heading renders.
- Test coverage: Heading render only; all employer card interaction is uncovered.
- Priority: High — this screen has the most custom focus-management and event-listener logic of any screen.

**`ScreenOne` odometer animation depends on runtime digit-index mutation:**
- Files: `app/pre-vr/components/ScreenOne.tsx` (lines 74-76)
- Why fragile: `digitIndex` is a `let` variable mutated inside the JSX `.map()` return. This works because React renders the map synchronously, but it is an anti-pattern that breaks if the render is ever deferred (e.g. Concurrent Mode features, React 19 transitions).
- Safe modification: Replace with a `reduce` that builds the char array with explicit digit indices before rendering, rather than side-effecting during render.

## Test Coverage Gaps

**`ScreenThree` employer card interactions not tested:**
- What's not tested: Pin click → card open, Escape key close, click-outside close, focus return to pin on close, focus trap to close button on open.
- Files: `app/pre-vr/components/ScreenThree.tsx`
- Risk: Regressions in the focus management or close-card logic would go undetected.
- Priority: High

**`PostVR` `toggleItem` persistence not tested:**
- What's not tested: State of `checkedItems` is local to the component and resets on navigation. There is no persistence to `localStorage` or any backend. Tests verify the toggle interaction, but do not verify that state survives a page refresh (because it doesn't — this is a known missing feature, not a bug).
- Files: `app/post-vr/page.tsx`
- Risk: Low for current prototype scope; medium risk if teachers or students expect progress to persist.
- Priority: Low (prototype stage)

**Analytics integration not tested end-to-end:**
- What's not tested: The `lib/analytics.ts` module is mocked in every test. The actual `sendGAEvent` call path (when `NODE_ENV !== 'development'`) has no integration test or smoke test to confirm events fire in production builds.
- Files: `lib/analytics.ts`, `tests/analytics.test.ts`
- Risk: Silent analytics regression on any production deployment.
- Priority: Medium

**Card download filename is hardcoded and not content-driven:**
- What's not tested: The filename `'carpenter-card.png'` in `ScreenFive.tsx` is tested as a literal in `tests/screen-five.test.tsx` (line 271). If the occupation changes, tests pass but the filename remains wrong.
- Files: `app/pre-vr/components/ScreenFive.tsx` (line 55), `tests/screen-five.test.tsx` (line 271)
- Risk: Wrong download filename for non-carpentry occupations.
- Priority: Low (single-occupation prototype)

---

*Concerns audit: 2026-04-03*
