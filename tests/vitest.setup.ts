import 'vitest-axe/extend-expect'
import '@testing-library/jest-dom/vitest'
import * as matchers from 'vitest-axe/matchers'

expect.extend(matchers)

// Mock window.matchMedia for jsdom environment
// Required because ScreenOne.tsx useReducedMotion hook calls window.matchMedia
// which is not implemented in jsdom.
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
