# Phase 3: Card Builder - Research

**Researched:** 2026-03-19
**Domain:** Canvas API PNG generation, form controls, client-side image compositing
**Confidence:** HIGH

## Summary

Phase 3 replaces the existing ScreenFive.tsx placeholder with a fully interactive card builder. The core technical challenge is compositing a 1200x675px PNG entirely client-side using the Canvas API. The good news: all session state hooks (`firstName`, `selectedIcon`, `selectedTiles`, `generatedCardUrl`) are already wired in SessionContext.tsx, the content schema and JSON data are populated, and the placeholder shell already imports from the correct content path.

The Canvas API approach is well-supported on Chrome/Chromebook (the primary target). Emoji rendering via `fillText` works natively with color emoji on Chrome. The `toBlob()` method is the recommended approach for PNG download (better memory efficiency than `toDataURL()` for 1200x675 images). No external dependencies are needed -- the browser's built-in Canvas API handles everything.

The builder UI follows established patterns from Screen 2: emoji-on-colored-circle for icons, Primary Blue border glow for selection state, checkmark badge for selected items. The main new pattern is the side-by-side responsive layout (controls left, preview right on desktop) and the Canvas compositing logic.

**Primary recommendation:** Build the Canvas rendering as an isolated utility function that accepts typed parameters (name, icon emoji, tile labels, gradient variant index) and returns a Promise<Blob>. Keep it separate from React components for testability and reuse.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Trading card style layout: "CARPENTER CARD" title, hero-sized emoji icon on colored circle, student name centered, task tag chips below
- Emoji icons (no SVG assets): Hammer, Saw, Hard Hat, Tape Measure, Goggles, Level
- CSS/Canvas programmatic gradients (no pre-generated PNG backgrounds)
- Deterministic hash of selected task tile IDs determines background gradient variant
- 6-8 gradient combos from brand color palette
- Side-by-side layout on desktop/Chromebook, stacked on mobile
- Task selections from Screen 2 shown as read-only tag chips labeled "Your skills"
- Download button disabled until both name and icon provided
- Post-download: "Your card is saved!" celebration moment, then Continue button to Screen 6

### Claude's Discretion
- Exact gradient color combos and hash function implementation
- Card typography sizing and spacing
- Celebratory animation/feedback style after download
- Icon picker hover/focus states
- Mobile breakpoint stacking behavior
- Canvas rendering implementation details
- Name input validation UX (inline error messaging style)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CARD-01 | First-name text input (1-30 chars, no empty/whitespace-only) | Standard controlled input with maxLength + trim validation; pattern established in project |
| CARD-02 | Six icon options in grid, student selects exactly one | Radio-behavior icon picker; reuse Screen 2 tile selection visual pattern (emoji circle + border glow + checkmark) |
| CARD-03 | Task selections from Screen 2 as non-editable tag chips | Read `selectedTiles` from SessionContext, map to tile titles from content JSON |
| CARD-04 | Live card preview updates in real time | DOM-based preview component (not Canvas) for instant reactivity; Canvas only for final export |
| CARD-05 | Pre-generated background variant mapped via deterministic hash | Programmatic gradient (not pre-generated PNGs); simple hash of sorted tile IDs modulo variant count |
| CARD-06 | Card renders at 1200x675px with name, icon, task labels | Canvas API compositing; emoji via fillText, text via fillText with Open Sans, gradient via createLinearGradient |
| CARD-07 | Download saves PNG (filename: carpenter-card.png) | canvas.toBlob() + programmatic anchor click with download attribute |
| CARD-08 | Download disabled until name + icon provided | Derived boolean from SessionContext state (trimmed name non-empty AND selectedIcon non-null) |
| CARD-09 | Student name never transmitted to server | Canvas API is purely client-side; no fetch/XHR calls in this phase |
| PERF-03 | Card generation under 1 second | Canvas compositing with gradient + text is sub-100ms on Chromebook; toBlob adds ~200-400ms. Well under 1s. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Canvas API (browser built-in) | N/A | PNG compositing at 1200x675 | Zero dependencies, native Chrome support, handles emoji + text + gradients |
| React 19 (existing) | 19.2.4 | Component UI, controlled inputs, real-time preview | Already in project |
| SessionContext (existing) | N/A | State for firstName, selectedIcon, selectedTiles, generatedCardUrl | Already wired with all needed fields |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS v4 (existing) | 4.x | Styling, responsive layout, utility classes | All component styling |
| content/config (existing) | N/A | Screen content (heading, labels, icon definitions) | Content-driven rendering |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Canvas API | html2canvas | Extra 40KB dependency, slower, unnecessary -- Canvas API is simpler for this use case |
| Canvas API | dom-to-image | Same tradeoff as html2canvas; adds complexity for no benefit |
| Emoji on Canvas | Twemoji SVG sprites | Consistent cross-platform emoji, but adds asset dependency; Chrome renders emoji natively on Canvas |

**Installation:**
```bash
# No new dependencies needed -- all built-in or already installed
```

## Architecture Patterns

### Recommended Project Structure
```
app/pre-vr/components/
  ScreenFive.tsx          # Main builder component (replaces placeholder)
  CardPreview.tsx         # Live DOM-based card preview (real-time updates)
  IconPicker.tsx          # 3x2 icon selection grid
  TaskTagChips.tsx        # Read-only tag chips from selectedTiles

lib/
  generate-card.ts        # Canvas compositing utility (pure function, no React)
  card-gradients.ts       # Gradient variant definitions + hash function
```

### Pattern 1: Canvas Compositing as Pure Utility
**What:** Isolate the Canvas rendering logic into a standalone async function that takes typed inputs and returns a `Blob`.
**When to use:** Whenever generating the downloadable PNG.
**Example:**
```typescript
// lib/generate-card.ts
interface CardParams {
  name: string
  iconEmoji: string
  taskLabels: string[]
  gradientVariant: number
}

export async function generateCardPng(params: CardParams): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 675
  const ctx = canvas.getContext('2d')!

  // 1. Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 675) // 135deg diagonal
  gradient.addColorStop(0, GRADIENTS[params.gradientVariant].from)
  gradient.addColorStop(1, GRADIENTS[params.gradientVariant].to)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 675)

  // 2. Draw title text
  ctx.font = '800 32px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.fillText('CARPENTER CARD', 600, 60)

  // 3. Draw emoji icon on white circle
  ctx.beginPath()
  ctx.arc(600, 250, 60, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  ctx.font = '80px sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(params.iconEmoji, 600, 250)

  // 4. Draw student name
  ctx.font = '800 48px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(params.name, 600, 400)

  // 5. Draw task tag chips
  // ... render semi-transparent pills with text

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}
```

### Pattern 2: DOM Preview vs Canvas Export (Dual Rendering)
**What:** Use a styled DOM component for the live preview (instant React reactivity) and Canvas only for the final PNG export.
**When to use:** This is the standard pattern. Rendering Canvas on every keystroke would be wasteful and laggy.
**Why:** DOM preview updates instantly with React state. Canvas is only invoked once on download click.

### Pattern 3: Deterministic Gradient Hash
**What:** Hash the sorted tile ID array to select a gradient variant index.
**When to use:** When determining which background gradient to show.
**Example:**
```typescript
// lib/card-gradients.ts
export const CARD_GRADIENTS = [
  { from: '#22224C', to: '#0092FF' },   // navy -> primary-blue
  { from: '#0092FF', to: '#C6E7FF' },   // primary-blue -> light-blue
  { from: '#22224C', to: '#3A3A6B' },   // navy -> navy-light
  { from: '#0070CC', to: '#C6E7FF' },   // blue-dark -> light-blue
  { from: '#3A3A6B', to: '#0092FF' },   // navy-light -> primary-blue
  { from: '#22224C', to: '#3DA8FF' },   // navy -> blue-vivid
  { from: '#0070CC', to: '#3DA8FF' },   // blue-dark -> blue-vivid
  { from: '#3DA8FF', to: '#E0F0FF' },   // blue-vivid -> light-blue-soft
]

export function getGradientVariant(tileIds: string[]): number {
  const key = [...tileIds].sort().join('|')
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % CARD_GRADIENTS.length
}
```

### Pattern 4: Download via Programmatic Anchor
**What:** Create a temporary `<a>` element with `download` attribute, set its `href` to a Blob URL, click it, then clean up.
**When to use:** For the PNG download trigger.
**Example:**
```typescript
// Source: MDN HTMLCanvasElement.toBlob() documentation
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Anti-Patterns to Avoid
- **Rendering Canvas on every keystroke:** Use DOM for live preview, Canvas only on download. Canvas re-render on each keystroke wastes CPU and creates visible flicker.
- **Using toDataURL for download:** Encodes entire image as base64 string in memory. Use `toBlob()` instead -- binary, more memory efficient, no URL length limits.
- **Storing the full PNG blob in SessionContext:** Only store the blob URL (`generatedCardUrl`) if needed for later display. Don't persist the blob itself in React state.
- **Hard-coding emoji in Canvas font spec:** Use a generic `sans-serif` font family for emoji fillText -- Chrome's font fallback handles color emoji automatically. Specifying a specific font for emoji can break rendering.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PNG generation | Custom pixel manipulation | Canvas API `toBlob()` | Handles PNG encoding, compression, color space automatically |
| Gradient rendering | Pixel-by-pixel gradient fill | `ctx.createLinearGradient()` | Hardware-accelerated, anti-aliased, handles diagonal angles |
| File download | Server-side download endpoint | Programmatic anchor + Blob URL | Fully client-side, no server roundtrip, respects CARD-09 privacy requirement |
| Text measurement for tag chip layout | Manual character counting | `ctx.measureText()` | Accounts for font metrics, kerning, variable-width characters |

**Key insight:** The Canvas API provides all the primitives needed for this card -- gradients, text, circles, PNG export. No external library adds value here.

## Common Pitfalls

### Pitfall 1: Font Not Loaded When Canvas Renders
**What goes wrong:** `ctx.fillText()` uses a fallback font because Open Sans hasn't loaded yet when the Canvas draws.
**Why it happens:** Canvas captures font state at render time. If the web font isn't loaded, it falls back to system sans-serif.
**How to avoid:** Use `document.fonts.ready` promise before rendering to Canvas. Wait for the font to be available.
**Warning signs:** Text on downloaded card looks different from the DOM preview.
```typescript
await document.fonts.ready // Ensure Open Sans is loaded
// Then proceed with Canvas rendering
```

### Pitfall 2: Emoji Vertical Alignment on Canvas
**What goes wrong:** Emoji rendered via `fillText` appears offset vertically compared to regular text.
**Why it happens:** Emoji glyphs have different baseline metrics than Latin text. `textBaseline` settings affect them differently.
**How to avoid:** Set `ctx.textBaseline = 'middle'` when rendering emoji, and use the center Y coordinate of the target area. Test on Chrome specifically (Chromebook target).
**Warning signs:** Emoji appears above or below the white circle center on the downloaded card.

### Pitfall 3: Blob URL Memory Leak
**What goes wrong:** Blob URLs created via `URL.createObjectURL()` are never revoked, consuming memory.
**Why it happens:** Developer forgets to call `URL.revokeObjectURL()` after the download completes.
**How to avoid:** Revoke immediately after the programmatic anchor click triggers the download.
**Warning signs:** Memory usage grows with each download (visible in Chrome DevTools Memory tab).

### Pitfall 4: Canvas DPI Scaling
**What goes wrong:** Card appears blurry on high-DPI screens or too small on some devices.
**Why it happens:** Canvas has a fixed pixel dimension (1200x675) but CSS may scale it differently.
**How to avoid:** The card is exported at exactly 1200x675 regardless of display DPI -- this is the desired behavior for the downloadable artifact. The DOM preview handles display scaling via CSS `aspect-ratio` and `max-width`.
**Warning signs:** Not an issue for this use case. The Canvas is offscreen (created programmatically), not displayed.

### Pitfall 5: Task Tag Chip Layout Overflow
**What goes wrong:** 3 long task labels overflow the card width at 1200px.
**Why it happens:** Fixed card width with variable-length task titles.
**How to avoid:** Use `ctx.measureText()` to calculate total chip width. Dynamically adjust font size or spacing if chips would exceed ~900px (leaving ~150px margin on each side). The current task titles are short (max ~20 chars) so this is unlikely but worth defending against.
**Warning signs:** Tag text clipped on right edge of downloaded card.

### Pitfall 6: Content Schema Field Name Mismatch
**What goes wrong:** Content JSON has `svgPath` for icons, but CONTEXT.md decided on emoji -- not SVGs.
**Why it happens:** The content type was defined before the emoji decision.
**How to avoid:** The icon `id` is sufficient for mapping to emoji characters. Either: (a) add an `emoji` field to the screenFive icon objects in carpentry.json, or (b) create a mapping from icon ID to emoji character in the component/utility. Option (a) is cleaner and follows the content-driven pattern.
**Warning signs:** Trying to load SVG files that don't exist at the `svgPath` paths.

## Code Examples

### Canvas Gradient (135-degree diagonal)
```typescript
// 135-degree diagonal: top-left to bottom-right
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
gradient.addColorStop(0, fromColor)
gradient.addColorStop(1, toColor)
ctx.fillStyle = gradient
ctx.fillRect(0, 0, canvas.width, canvas.height)
```

### Emoji on White Circle (Canvas)
```typescript
// White circle background
ctx.beginPath()
ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
ctx.fillStyle = '#FFFFFF'
ctx.fill()

// Emoji centered on circle
ctx.font = '80px sans-serif' // Use sans-serif for emoji fallback
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillText(emojiChar, centerX, centerY)
```

### Download Trigger
```typescript
// Source: MDN HTMLCanvasElement.toBlob()
async function handleDownload() {
  await document.fonts.ready
  const blob = await generateCardPng({
    name: firstName.trim(),
    iconEmoji: getEmojiForIcon(selectedIcon),
    taskLabels: getTaskLabelsFromIds(selectedTiles),
    gradientVariant: getGradientVariant(selectedTiles),
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'carpenter-card.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Semi-Transparent Tag Chip Pills (Canvas)
```typescript
function drawTagChips(ctx: CanvasRenderingContext2D, labels: string[], centerX: number, y: number) {
  ctx.font = '300 18px "Open Sans", sans-serif'
  const paddingX = 16
  const paddingY = 8
  const chipGap = 12
  const chipHeight = 18 + paddingY * 2

  // Measure total width to center the row
  const chipWidths = labels.map((l) => ctx.measureText(l).width + paddingX * 2)
  const totalWidth = chipWidths.reduce((a, b) => a + b, 0) + chipGap * (labels.length - 1)
  let x = centerX - totalWidth / 2

  for (let i = 0; i < labels.length; i++) {
    const w = chipWidths[i]
    const r = chipHeight / 2

    // Semi-transparent white pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.beginPath()
    ctx.roundRect(x, y - chipHeight / 2, w, chipHeight, r)
    ctx.fill()

    // White text
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(labels[i], x + w / 2, y)

    x += w + chipGap
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `toDataURL()` for download | `toBlob()` + Blob URL | Supported in all modern browsers | Better memory efficiency, no base64 encoding overhead |
| html2canvas for screenshots | Native Canvas API for compositing | Always true for custom layouts | Zero dependency, faster, full control over rendering |
| Pre-generated PNG backgrounds | Canvas `createLinearGradient()` | Decision in CONTEXT.md | Eliminates blocker from STATE.md ("Card background PNGs needed") |

**Deprecated/outdated:**
- `svgPath` field in screenFive icons: Content schema references SVG paths but emoji decision means these are unused. Need to add emoji field or maintain ID-to-emoji mapping.

## Open Questions

1. **Emoji field in content JSON**
   - What we know: The `screenFive.icons` array has `svgPath` field, but the locked decision uses emoji icons
   - What's unclear: Whether to add an `emoji` field to each icon in carpentry.json or maintain a separate mapping
   - Recommendation: Add `emoji` field to each icon in carpentry.json (e.g., `"emoji": "hammer-emoji"`) to keep the content-driven pattern. The `svgPath` field can remain for future use. Alternatively, since Screen 2 tiles already have emoji, a simple ID-to-emoji lookup works too.

2. **Open Sans on Canvas for Chromebook**
   - What we know: Open Sans is loaded via Next.js `next/font`. Canvas respects loaded web fonts.
   - What's unclear: Exact timing of font availability on slow Chromebook connections
   - Recommendation: `document.fonts.ready` promise handles this. LOW risk.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/screen-five.test.tsx` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CARD-01 | Name input 1-30 chars, no whitespace-only | unit | `npx vitest run tests/screen-five.test.tsx -t "name input"` | No -- Wave 0 |
| CARD-02 | Six icons, select exactly one | unit | `npx vitest run tests/screen-five.test.tsx -t "icon picker"` | No -- Wave 0 |
| CARD-03 | Task tags from session displayed read-only | unit | `npx vitest run tests/screen-five.test.tsx -t "task tags"` | No -- Wave 0 |
| CARD-04 | Live preview updates on name/icon change | unit | `npx vitest run tests/screen-five.test.tsx -t "preview"` | No -- Wave 0 |
| CARD-05 | Background variant from deterministic hash | unit | `npx vitest run tests/card-gradients.test.ts` | No -- Wave 0 |
| CARD-06 | Card renders at 1200x675 with all elements | unit | `npx vitest run tests/generate-card.test.ts` | No -- Wave 0 |
| CARD-07 | Download saves PNG as carpenter-card.png | unit | `npx vitest run tests/screen-five.test.tsx -t "download"` | No -- Wave 0 |
| CARD-08 | Download disabled until name + icon | unit | `npx vitest run tests/screen-five.test.tsx -t "download disabled"` | No -- Wave 0 |
| CARD-09 | Name never transmitted to server | manual-only | Code review -- verify no fetch/XHR with name payload | N/A |
| PERF-03 | Card generation under 1 second | manual-only | Chromebook performance test | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/screen-five.test.tsx`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/screen-five.test.tsx` -- covers CARD-01 through CARD-04, CARD-07, CARD-08
- [ ] `tests/card-gradients.test.ts` -- covers CARD-05 (deterministic hash produces consistent output)
- [ ] `tests/generate-card.test.ts` -- covers CARD-06 (Canvas API mock verifying correct draw calls)

Note: Canvas API is not available in jsdom. Tests for `generate-card.ts` will need to mock `document.createElement('canvas')` and verify the correct sequence of Canvas method calls (createLinearGradient, fillText, arc, toBlob). Alternatively, test the pure logic (gradient selection, parameter assembly) and treat Canvas rendering as an integration concern.

## Sources

### Primary (HIGH confidence)
- [MDN HTMLCanvasElement.toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) -- recommended download method
- [MDN HTMLCanvasElement.toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) -- alternative method (toBlob preferred)
- Existing codebase: `context/SessionContext.tsx`, `app/pre-vr/components/ScreenFive.tsx`, `content/carpentry.json`, `content/types.ts`
- [DigitalOcean Canvas toBlob Guide](https://www.digitalocean.com/community/tutorials/js-canvas-toblob) -- download pattern

### Secondary (MEDIUM confidence)
- [xjavascript.com toBlob large canvas guide](https://www.xjavascript.com/blog/downloading-canvas-image-using-toblob/) -- toBlob vs toDataURL comparison
- [Ben Nadel Canvas text alignment](https://www.bennadel.com/blog/4320-rendering-text-to-canvas-with-adjusted-x-y-offsets-for-better-cross-browser-consistency.htm) -- cross-browser text rendering offsets

### Tertiary (LOW confidence)
- Emoji rendering on Chrome Canvas: Based on general knowledge that Chrome renders color emoji via fillText. Not verified against Chrome 2025/2026 release notes specifically, but no known regressions.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Canvas API is a well-established browser built-in, all dependencies already in project
- Architecture: HIGH -- DOM preview + Canvas export is the standard dual-render pattern; component structure follows existing project conventions
- Pitfalls: HIGH -- Font loading, emoji alignment, and Blob cleanup are well-documented Canvas concerns
- Canvas emoji on Chromebook: MEDIUM -- Chrome renders color emoji on Canvas reliably, but not verified on exact Chrome OS version shipping on managed Chromebooks

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable domain, no fast-moving dependencies)
