# Testing Patterns

**Analysis Date:** 2026-04-03

## Test Framework

**Runner:**
- Vitest 4.x
- Config: `vitest.config.ts`
- Environment: `jsdom` (browser DOM simulation)
- Globals enabled (`globals: true`) — `describe`, `it`, `expect`, `vi` available without imports, though files also import them explicitly

**Assertion Library:**
- `@testing-library/jest-dom` (via `@testing-library/jest-dom/vitest` import in setup)
- `vitest-axe` for WCAG accessibility assertions

**Run Commands:**
```bash
# No test script in package.json — run directly via npx:
npx vitest                  # Run all tests (watch mode)
npx vitest run              # Run all tests once (CI mode)
npx vitest run --coverage   # Coverage (no provider configured yet)
```

## Test File Organization

**Location:**
- All tests are co-located in a top-level `tests/` directory, separate from source
- Accessibility tests are in a subdirectory: `tests/a11y/screens.a11y.test.tsx`

**Naming:**
- Component tests: `<component-name>.test.tsx` — e.g., `screen-two.test.tsx`, `progress-bar.test.tsx`
- Module/utility tests: `<module-name>.test.ts` — e.g., `analytics.test.ts`, `generate-card.test.ts`
- Integration/flow tests: `<feature>-flow.test.tsx` — e.g., `pre-vr-flow.test.tsx`
- Accessibility tests: `screens.a11y.test.tsx`

**Include pattern** (from `vitest.config.ts`):
```
tests/**/*.test.{ts,tsx}
```

**Structure:**
```
tests/
├── a11y/
│   └── screens.a11y.test.tsx     # axe-core WCAG tests + ARIA attribute checks
├── analytics.test.ts              # lib/analytics unit tests (prod vs dev mode)
├── card-gradients.test.ts         # lib/card-gradients unit tests
├── content-schema.test.ts         # content/config schema validation
├── generate-card.test.ts          # Canvas API integration test
├── landing.test.tsx               # Landing page component tests
├── post-vr.test.tsx               # Post-VR page tests
├── pre-vr-flow.test.tsx           # Full flow integration: screen navigation
├── progress-bar.test.tsx          # ProgressBar component tests
├── screen-five.test.tsx           # ScreenFive unit tests (detailed)
├── screen-four.test.tsx           # ScreenFour unit tests
├── screen-one.test.tsx            # ScreenOne (mostly it.todo stubs)
├── screen-six.test.tsx            # ScreenSix unit tests
├── screen-three.test.tsx          # ScreenThree unit tests
├── screen-two.test.tsx            # ScreenTwo unit tests (detailed)
├── vitest-axe.d.ts                # Type augmentation for vitest-axe matchers
└── vitest.setup.ts                # Global setup: jest-dom, vitest-axe, matchMedia mock
```

## Test Structure

**Suite Organization:**
```typescript
// Nested describe groups reflect feature areas, not just component name
describe('ScreenTwo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionState = buildSessionState()
  })

  describe('tiles', () => {
    it('renders the heading, instruction copy, and all six task tiles from content', () => { ... })
  })

  describe('select', () => {
    it('appends a tile selection and tracks the select action', () => { ... })
    it('removes a seeded tile selection and tracks the deselect action', () => { ... })
  })

  describe('max', () => {
    it('rejects a fourth tile, shows overflow feedback, and clears the timer-driven UI', () => { ... })
  })

  describe('continue', () => {
    it('shows "Pick at least 2" and stays disabled when no tiles are selected', () => { ... })
  })
})
```

**Patterns:**
- Test IDs are embedded in test names as suffix codes: `(FLOW-01)`, `(LAND-01)`, `(FLOW-03)`
- `beforeEach` clears mocks with `vi.clearAllMocks()` and resets module-level mock state
- `vi.useRealTimers()` called in `beforeEach` to ensure clean timer state; fake timers are opted into per-test with `vi.useFakeTimers()`
- `act()` wraps timer advancement when testing React state updates triggered by timers

## Mocking

**Framework:** Vitest's built-in `vi` mock utilities

**Critical pattern — `vi.hoisted()` for mock factories:**
```typescript
// screen-two.test.tsx — mocks must be defined before module import
const { mockSetSelectedTiles, mockTrackTileSelect, screenTwoTiles } = vi.hoisted(() => ({
  mockSetSelectedTiles: vi.fn(),
  mockTrackTileSelect: vi.fn(),
  screenTwoTiles: [ ... ],
}))

vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))

vi.mock('@/lib/analytics', () => ({
  trackTileSelect: mockTrackTileSelect,
}))

// Import AFTER all vi.mock() calls
import ScreenTwo from '@/app/pre-vr/components/ScreenTwo'
```

**Standard mocks applied across test files:**

```typescript
// next/navigation — always mocked in component tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// next/font/google — mocked in layout tests
vi.mock('next/font/google', () => ({
  Open_Sans: () => ({ variable: 'font-mock' }),
}))

// @next/third-parties/google — mocked for analytics tests
vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: () => null,
  sendGAEvent: mockSendGAEvent,
}))

// maplibre-gl — mocked to prevent real map rendering in jsdom
vi.mock('maplibre-gl', () => {
  const Map = vi.fn(function MockMap() {
    return { on: vi.fn(), remove: vi.fn(), addControl: vi.fn(), ... }
  })
  const Marker = vi.fn(function MockMarker() {
    return { setLngLat: vi.fn().mockReturnThis(), addTo: vi.fn().mockReturnThis(), ... }
  })
  return { default: { Map, Marker }, Map, Marker }
})

// content/config — always mocked with minimal fixture data per test file
vi.mock('@/content/config', () => ({ content: { screenTwo: { ... } } }))

// SessionContext — mocked via module-level mutable state
vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))
```

**What to Mock:**
- All Next.js internals (`next/navigation`, `next/font/google`)
- All analytics calls (`@lib/analytics`, `@next/third-parties/google`)
- SessionContext — inject state via mutable `mockSessionState` variable
- Content config — inject minimal fixture data matching the tested screen's shape
- Browser APIs unavailable in jsdom: `window.matchMedia` (in `vitest.setup.ts`), `URL.createObjectURL`, `URL.revokeObjectURL`, `document.fonts`
- Third-party renderers: `maplibre-gl` Map/Marker constructors

**What NOT to Mock:**
- `@/lib/utils` (the `cn` function) — use real implementation; mock it only in accessibility tests where class strings interfere with axe
- `@/lib/card-gradients` — real implementation is tested directly in `card-gradients.test.ts`
- DOM APIs that jsdom supports natively

## Fixtures and Factories

**Test Data Pattern — `buildSessionState` factory:**
```typescript
// Defined per test file, above the describe block
function buildSessionState(
  overrides: Partial<Pick<MockSessionState, 'selectedTiles'>> = {}
): MockSessionState {
  return {
    selectedTiles: [],
    setSelectedTiles: mockSetSelectedTiles,
    ...overrides,
  }
}

// Usage: inject state by passing overrides to the render helper
function renderScreenTwo(
  sessionOverrides: Partial<Pick<MockSessionState, 'selectedTiles'>> = {},
  props: ComponentProps<typeof ScreenTwo> = {}
) {
  mockSessionState = buildSessionState(sessionOverrides)
  return render(<ScreenTwo {...props} />)
}
```

**Pattern:**
- Each test file that involves SessionContext defines a local `MockSessionState` interface
- Mock data for content (`screenTwoTiles`) is hoisted via `vi.hoisted()` so it can be shared between the `vi.mock` factory and test assertions
- No shared fixture files — all fixture data is defined inline per test file

**Location:**
- Fixtures are defined at the top of each test file using `vi.hoisted()` or inline objects within `vi.mock` factories

## Coverage

**Requirements:** Not enforced (no coverage thresholds configured, no `--coverage` script)

**View Coverage:**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Scope: Single component or single library module
- Files: `screen-two.test.tsx`, `screen-five.test.tsx`, `analytics.test.ts`, `card-gradients.test.ts`, `generate-card.test.ts`, `progress-bar.test.tsx`
- Approach: Render component with controlled mock state; assert DOM via Testing Library queries

**Integration Tests:**
- Scope: Full page flow across multiple screens with real component tree
- Files: `pre-vr-flow.test.tsx`, `landing.test.tsx`, `post-vr.test.tsx`
- Approach: Render full page component, drive through navigation via `fireEvent.click`, assert state changes across screen transitions

**Accessibility Tests:**
- Framework: `vitest-axe` (wraps axe-core)
- Files: `tests/a11y/screens.a11y.test.tsx`
- Approach: Render component, run `axe(container)`, assert `toHaveNoViolations()`; also verifies ARIA attribute presence (`aria-pressed`, `aria-expanded`, `aria-checked`)

**E2E Tests:** Not configured

## Common Patterns

**Async Testing — `waitFor` for state transitions:**
```typescript
// Pre-VR flow: waiting for lazy-loaded screen to appear
fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

const screenThreeHeading = await screen.findByRole('heading', {
  level: 2,
  name: /Who hires carpenters near you/i,
})

await waitFor(() => {
  expect(screenThreeHeading).toHaveFocus()
})
```

**Timer Testing — fake timers with `act`:**
```typescript
it('rejects a fourth tile, shows overflow feedback, and clears the timer-driven UI', () => {
  vi.useFakeTimers()
  renderScreenTwo({ selectedTiles: ['task-framing', 'task-measuring', 'task-finishing'] })

  fireEvent.click(screen.getByRole('button', { name: /Concrete/i }))

  expect(screen.getByText('You can pick up to 3!')).toBeInTheDocument()

  act(() => { vi.advanceTimersByTime(300) })
  // shake class removed but message still visible

  act(() => { vi.advanceTimersByTime(2700) })
  expect(screen.queryByText('You can pick up to 3!')).not.toBeInTheDocument()
})
```

**Dynamic Import Testing — `vi.resetModules()` for env-dependent modules:**
```typescript
// analytics.test.ts — re-imports module after stubbing NODE_ENV
describe('production mode', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'production')
    analytics = await import('@/lib/analytics')
  })

  it('trackScreenView sends screen_view event', () => {
    analytics.trackScreenView('screen_1')
    expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'screen_view', {
      screen_name: 'screen_1',
    })
  })
})
```

**Spy Usage — DOM method assertions:**
```typescript
// screen-five.test.tsx — download anchor flow
const appendSpy = vi.spyOn(document.body, 'appendChild')
const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

// After triggering download...
const appendedAnchor = appendSpy.mock.calls
  .map(([node]) => node)
  .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
expect(appendedAnchor?.href).toBe('blob:mock-card')
expect(appendedAnchor?.download).toBe('carpenter-card.png')
```

**Stubs for Unimplemented Tests:**
```typescript
// screen-one.test.tsx — placeholder tests not yet implemented
it.todo('renders salary amount from content data') // HOOK-01
it.todo('displays dollar sign and comma formatting') // HOOK-01
```

## Global Setup (`tests/vitest.setup.ts`)

```typescript
import 'vitest-axe/extend-expect'
import '@testing-library/jest-dom/vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

// jsdom does not implement window.matchMedia — required by useReducedMotion hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

---

*Testing analysis: 2026-04-03*
