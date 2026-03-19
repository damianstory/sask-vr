# Testing Patterns

**Analysis Date:** 2026-03-19

## Project Status

This is a **pre-implementation specification**. No test framework has been configured yet. The testing strategy is prescribed by `TECH_SPECS.md` section 12 and should guide test setup and execution.

## Test Framework Setup

**Runner:** Jest (recommended in TECH_SPECS section 12.1)

**Assertion Library:** Expect (Jest built-in)

**React Testing:** React Testing Library (RTL)

**End-to-End Testing:** Playwright (for browser automation)

**Accessibility Testing:** axe-core (automated) + manual ChromeVox/VoiceOver

**Configuration Files (to be created):**
- `jest.config.js` — Unit/component test runner configuration
- `playwright.config.ts` — E2E test configuration
- `.eslintrc.json` — Already mentioned in TECH_SPECS as implemented

**Run Commands (planned):**
```bash
npm run test              # Run Jest unit and component tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Playwright E2E tests
npm run test:a11y        # Run accessibility tests (axe-core)
```

## Test File Organization

**Location:** Co-located with source

**Naming Convention:**
- Unit/component tests: `[ComponentName].test.tsx` or `[utility].test.ts`
- E2E tests: `e2e/[feature].spec.ts` in a top-level `e2e/` directory
- Example structure:
  ```
  app/pre-vr/components/
  ├── ScreenOne.tsx
  ├── ScreenOne.test.tsx
  ├── Navigation.tsx
  └── Navigation.test.tsx

  lib/
  ├── analytics.ts
  ├── analytics.test.ts
  ├── card-generator.ts
  └── card-generator.test.ts

  e2e/
  ├── pre-vr-flow.spec.ts
  ├── card-generation.spec.ts
  └── accessibility.spec.ts
  ```

## Test Structure

**Suite Organization (Jest + RTL Pattern):**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenTwo from '@/app/pre-vr/components/ScreenTwo'

describe('ScreenTwo - Task Tile Selection', () => {
  it('renders all 6 tiles with correct labels', () => {
    render(<ScreenTwo content={mockContent.screenTwo} />)

    const tiles = screen.getAllByRole('button', { name: /framing|roofing|electrical|plumbing|interior|exterior/ })
    expect(tiles).toHaveLength(6)
  })

  it('allows selecting 2-3 tiles and disables if max reached', async () => {
    const user = userEvent.setup()
    const onSelectionChange = jest.fn()

    render(
      <ScreenTwo
        content={mockContent.screenTwo}
        onSelectionChange={onSelectionChange}
      />
    )

    const tiles = screen.getAllByRole('button')

    // Select 2 tiles
    await user.click(tiles[0])
    await user.click(tiles[1])
    expect(onSelectionChange).toHaveBeenCalledWith(['framing', 'roofing'])

    // Attempt to select 4th tile — should be prevented
    await user.click(tiles[3])
    expect(onSelectionChange).toHaveBeenCalledTimes(2) // Only 2 selections
  })

  it('deselects a tile when clicked again', async () => {
    const user = userEvent.setup()
    const onSelectionChange = jest.fn()

    render(
      <ScreenTwo
        content={mockContent.screenTwo}
        onSelectionChange={onSelectionChange}
      />
    )

    const firstTile = screen.getByRole('button', { name: /framing/ })
    await user.click(firstTile)
    await user.click(firstTile)

    expect(onSelectionChange).toHaveBeenLastCalledWith([])
  })
})
```

**Test Patterns:**
- Use `describe()` blocks to organize tests by component/feature
- Each `it()` test focuses on one behavior
- Use `userEvent.setup()` for realistic user interactions
- Use `waitFor()` for async state updates
- Cleanup is automatic with RTL

**Setup/Teardown:**
- RTL automatically cleans up between tests
- Use `beforeEach()` to initialize mock data or reset state
- Example:
  ```typescript
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.gtag mock
    delete (window as any).gtag
  })
  ```

## Mocking

**Framework:** Jest's built-in `jest.fn()` and `jest.mock()`

**Patterns:**

**1. Mock Analytics (global gtag):**
```typescript
beforeEach(() => {
  ;(window as any).gtag = jest.fn()
})

// Test that events fire
it('fires analytics event on tile selection', async () => {
  const user = userEvent.setup()
  render(<ScreenTwo content={mockContent.screenTwo} />)

  const firstTile = screen.getByRole('button', { name: /framing/ })
  await user.click(firstTile)

  expect(window.gtag).toHaveBeenCalledWith(
    'event',
    'tile_select',
    { tile_id: 'framing', action: 'select' }
  )
})
```

**2. Mock Image Generation API:**
```typescript
jest.mock('@/lib/image-gen', () => ({
  generateCardImage: jest.fn(() =>
    Promise.resolve('data:image/png;base64,...')
  )
}))

// Override in specific test:
import { generateCardImage } from '@/lib/image-gen'
;(generateCardImage as jest.Mock).mockRejectedValueOnce(
  new Error('API timeout')
)
```

**3. Mock Next.js Router:**
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    pathname: '/pre-vr'
  })
}))
```

**4. Mock Next.js Image Component:**
```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...props} />
  )
}))
```

**What to Mock:**
- External APIs (NanoBanana, Google Analytics)
- Next.js router and navigation
- Global gtag object
- Image fetches that require network
- Large data files (load only what's needed)

**What NOT to Mock:**
- User interactions (use userEvent instead)
- DOM rendering (render the component)
- React component internals (test behavior, not implementation)
- Content JSON validation (test against real schema)

## Fixtures and Factories

**Test Data Pattern:**

```typescript
// lib/test-fixtures.ts — Centralized mock data

export const mockContent = {
  screenTwo: {
    heading: 'What tasks interest you?',
    subheading: 'Select 2-3 tasks',
    tiles: [
      {
        id: 'framing',
        label: 'Framing a House',
        description: 'Build the skeleton of a home...',
        illustrationAsset: '/illustrations/framing.svg'
      },
      {
        id: 'roofing',
        label: 'Installing Roofing',
        description: 'Weatherproof a structure...',
        illustrationAsset: '/illustrations/roofing.svg'
      }
      // ... 4 more tiles
    ],
    selectionMin: 2,
    selectionMax: 3
  }
}

export const mockSessionState = {
  selectedTiles: ['framing', 'roofing'],
  firstName: 'Alex',
  selectedIcon: 'hammer',
  generatedCardUrl: 'data:image/png;base64,...',
  checkedItems: []
}

// Factory function for creating session state with overrides
export function createSessionState(overrides?: Partial<SessionState>): SessionState {
  return { ...mockSessionState, ...overrides }
}
```

**Location:** `lib/test-fixtures.ts` — import in any test file

**Usage:**
```typescript
import { mockContent, createSessionState } from '@/lib/test-fixtures'

it('renders with correct content', () => {
  render(<ScreenTwo content={mockContent.screenTwo} />)
  // ...
})

it('preserves state across screen navigation', () => {
  const initialState = createSessionState({ selectedTiles: ['framing'] })
  // ...
})
```

## Coverage

**Requirements:** None enforced for MVP (section 12 does not specify coverage target)

**View Coverage:**
```bash
npm run test:coverage
# Generates coverage/ directory with HTML report
# Open coverage/lcov-report/index.html in browser
```

**Post-MVP:** Consider enforcing 70%+ coverage on critical paths:
- Card generation pipeline
- State management
- Analytics event firing

## Test Types

### Unit Tests

**Scope:** Individual functions and utilities

**Examples (from TECH_SPECS section 12.1):**
- Content schema validation: Verify that loading `carpentry.json` parses without error
- Analytics utility: `trackEvent('tile_select', {})` correctly calls `window.gtag`
- Card generator function: `generateCardImage(inputs)` returns data URL and handles API failure

**Approach (Jest):**
```typescript
// lib/analytics.test.ts
import { trackEvent } from '@/lib/analytics'

describe('trackEvent', () => {
  beforeEach(() => {
    ;(window as any).gtag = jest.fn()
  })

  it('calls window.gtag with event name and params', () => {
    trackEvent('tile_select', { tile_id: 'framing', action: 'select' })

    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'tile_select',
      { tile_id: 'framing', action: 'select' }
    )
  })

  it('handles missing gtag gracefully', () => {
    delete (window as any).gtag

    expect(() => trackEvent('tile_select', {})).not.toThrow()
  })
})
```

### Component Tests

**Scope:** React components in isolation (RTL)

**Examples (from TECH_SPECS section 12.1):**
- Tile selection logic: Selecting/deselecting tiles, enforcing min/max
- Accordion expand/collapse: Pathway steps
- Checklist toggle: Bridge page checkbox interactions
- Download trigger: Card download button

**Approach (React Testing Library):**
```typescript
// app/pre-vr/components/ScreenFour.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenFour from '@/app/pre-vr/components/ScreenFour'
import { mockContent } from '@/lib/test-fixtures'

describe('ScreenFour - Pathway Timeline', () => {
  it('renders all pathway steps collapsed by default', () => {
    render(<ScreenFour content={mockContent.screenFour} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('expands step when clicked', async () => {
    const user = userEvent.setup()
    render(<ScreenFour content={mockContent.screenFour} />)

    const highSchoolStep = screen.getByRole('button', { name: /high school/ })
    await user.click(highSchoolStep)

    expect(highSchoolStep).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Miller Collegiate Carpentry 10/20/30')).toBeVisible()
  })

  it('fires analytics event on expand', async () => {
    const user = userEvent.setup()
    ;(window as any).gtag = jest.fn()

    render(<ScreenFour content={mockContent.screenFour} />)

    const step = screen.getByRole('button', { name: /high school/ })
    await user.click(step)

    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'pathway_expand',
      expect.objectContaining({ step_id: 'high_school' })
    )
  })
})
```

### Integration Tests

**Scope:** Multiple components or layers working together (RTL + context/state)

**Examples (from TECH_SPECS section 12.1):**
- Full Pre-VR flow end-to-end: All 6 screens, tile selections persist, card generates and downloads
- Card generation pipeline: User input → API call → Canvas rendering → download
- Analytics event firing: Verify events fire at correct moments throughout flow

**Approach (RTL with provider setup):**
```typescript
// e2e/pre-vr-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionProvider } from '@/components/SessionProvider'
import PreVRFlow from '@/app/pre-vr/page'
import { mockContent } from '@/lib/test-fixtures'

describe('Pre-VR Flow Integration', () => {
  it('persists tile selections through all screens', async () => {
    const user = userEvent.setup()
    render(
      <SessionProvider initialContent={mockContent}>
        <PreVRFlow />
      </SessionProvider>
    )

    // Start on Screen 2, select tiles
    const tileButtons = screen.getAllByRole('button', { name: /framing|roofing|electrical|plumbing|interior|exterior/ })
    await user.click(tileButtons[0])
    await user.click(tileButtons[1])

    // Click Next to go to Screen 3
    await user.click(screen.getByRole('button', { name: /next/i }))

    // Navigate forward through Screens 3-5
    // Then return to verify selections are still there
    await user.click(screen.getByRole('button', { name: /back/i }))

    const selectedTiles = screen.getAllByRole('button', { pressed: true })
    expect(selectedTiles).toHaveLength(2)
  })
})
```

### E2E Tests (Browser Automation)

**Scope:** Full user journeys in a real browser (Playwright)

**Examples (from TECH_SPECS section 12.1):**
- Complete Pre-VR flow on Chromebook at 1366×768 — all screens render, tile selections persist, card generates and downloads
- Complete Pre-VR flow on mobile (375px wide) — layout adapts, touch targets adequate, card downloads
- Card generation fails (API timeout) — fallback triggers, card still generates and downloads

**Approach (Playwright):**
```typescript
// e2e/pre-vr-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Pre-VR Flow - Chromebook (1366x768)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('http://localhost:3000/pre-vr')
  })

  test('complete flow: select tiles → enter name → generate card → download', async ({ page }) => {
    // Screen 1: Hook screen with salary
    await expect(page.locator('h1')).toContainText('What does a carpenter in Saskatchewan actually earn?')

    // Navigate to Screen 2: Tile selection
    await page.click('button:has-text("Next")')

    // Select 2 tiles
    const tiles = page.locator('button[role="checkbox"]')
    await tiles.nth(0).click()
    await tiles.nth(1).click()

    // Navigate to Screen 5: Card builder
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')
    await page.click('button:has-text("Next")')

    // Enter name
    await page.fill('input[placeholder="Your first name"]', 'Alex')

    // Select icon
    await page.click('button[aria-label="Hammer icon"]')

    // Wait for card preview to generate
    await page.waitForSelector('canvas', { timeout: 5000 })

    // Click download
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Download")')

    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('carpenter-card.png')
  })

  test('card generation fails and triggers fallback', async ({ page }) => {
    // Mock API to return 503
    await page.route('**/api/generate-card', (route) => {
      route.abort('failed')
    })

    // Go to Screen 5
    await page.click('button:has-text("Next")') // S2
    await page.click('button:has-text("Next")') // S3
    await page.click('button:has-text("Next")') // S4
    await page.click('button:has-text("Next")') // S5

    // Enter inputs
    await page.fill('input[placeholder="Your first name"]', 'Alex')
    await page.click('button[aria-label="Hammer icon"]')

    // Should still render a card (fallback)
    await waitFor(async () => {
      const canvas = page.locator('canvas')
      expect(await canvas.isVisible()).toBe(true)
    }, { timeout: 10000 })

    // Download should still work
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Download")')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('carpenter-card.png')
  })
})

test.describe('Pre-VR Flow - Mobile (375x667)', () => {
  test('layout adapts: tiles stack 1-wide, card preview below inputs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000/pre-vr')

    // Navigate to Screen 2
    await page.click('button:has-text("Next")')

    // Verify tile grid is 1 column
    const gridClasses = await page.locator('[role="grid"]').getAttribute('class')
    expect(gridClasses).toContain('grid-cols-1')
    expect(gridClasses).not.toContain('sm:grid-cols-2') // Should use 1-col on mobile

    // All tiles should be tappable (44px minimum)
    const tiles = page.locator('button').filter({ has: page.locator('img') })
    const boundingBox = await tiles.first().boundingBox()
    expect(boundingBox?.width).toBeGreaterThanOrEqual(44)
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })
})
```

### Accessibility Tests

**Framework:** axe-core (automated) + manual (ChromeVox, VoiceOver)

**Approach (Playwright with axe):**
```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, getViolations } from 'axe-playwright'

test.describe('Accessibility - WCAG AA Compliance', () => {
  test('ScreenOne has no axe violations', async ({ page }) => {
    await page.goto('http://localhost:3000/pre-vr')
    await injectAxe(page)

    const violations = await getViolations(page)
    expect(violations).toEqual([])
  })

  test('all interactive elements are keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:3000/pre-vr')

    // Tab through 10 elements — verify focus ring visible
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement)
    }
  })

  test('respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('http://localhost:3000/pre-vr')

    // Salary counter should not animate
    const counterElement = page.locator('[data-test="salary-counter"]')
    const animation = await counterElement.evaluate((el) =>
      window.getComputedStyle(el).animationDuration
    )
    expect(animation).toBe('0s')
  })
})
```

**Manual Testing (not automated):**
- ChromeVox (primary for Chromebook target): Test all 6 screens + bridge page, verify heading hierarchy, form labels, button purposes
- VoiceOver (mobile): Test on iPad/iPhone, verify interactions work via VoiceOver rotor

## Critical Test Cases (from TECH_SPECS section 12.2)

**These must have test coverage:**

1. **Complete Pre-VR flow on Chromebook (1366×768)** — all screens render, tile selections persist, card generates and downloads
   - Test: `e2e/pre-vr-flow.spec.ts` with viewport 1366×768
   - Verifies: rendering, state persistence, card generation, download

2. **Complete Pre-VR flow on mobile (375px wide)** — layout adapts, touch targets adequate, card downloads
   - Test: `e2e/pre-vr-flow.spec.ts` with viewport 375×667
   - Verifies: responsive layout, touch target sizes, download

3. **Card generation fails (API timeout)** — fallback triggers, card still generates and downloads
   - Test: `e2e/pre-vr-flow.spec.ts` with mocked 503 API
   - Verifies: error handling, fallback rendering, recovery

4. **Navigate backward through all screens** — tile selections preserved, card (if generated) preserved
   - Test: Component integration test in `ScreenTwo.test.tsx` + `SessionProvider.test.tsx`
   - Verifies: state persistence on back navigation

5. **Bridge page loads from direct URL** (`/post-vr`) — renders correctly without prior session state
   - Test: `e2e/post-vr-bridge.spec.ts`
   - Verifies: route isolation, independent state, checklist functionality

6. **All analytics events fire correctly** — verify in GA4 debug mode
   - Test: Multiple tests with mocked gtag, plus manual GA4 debug mode verification
   - Verifies: event names, parameters, no PII leakage

## Test Data and Mocking Strategy

**Content JSON Validation:**
```typescript
// lib/content.test.ts
import { validateOccupationContent } from '@/lib/content'
import carpentryContent from '@/content/carpentry.json'

it('parses carpentry.json successfully', () => {
  expect(() => validateOccupationContent(carpentryContent)).not.toThrow()
})

it('rejects invalid content schema', () => {
  const invalid = { meta: { occupationId: 'test' } } // Missing required fields
  expect(() => validateOccupationContent(invalid)).toThrow()
})
```

**Environment Variables for Testing:**
- `NANOBANANA_API_KEY`: Set to a dummy value in test environment
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Set to a test ID (or mock gtag globally)
- Use `.env.test` for test-specific overrides

**API Mocking Strategy:**
```typescript
// jest.setup.ts
beforeEach(() => {
  // Mock fetch globally
  global.fetch = jest.fn((url: string) => {
    if (url.includes('/api/generate-card')) {
      return Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(/* mock image data */)
      })
    }
    return Promise.reject(new Error(`Unmocked fetch: ${url}`))
  })
})
```

---

*Testing specification: based on TECH_SPECS.md section 12, ready for implementation*
