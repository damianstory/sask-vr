import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, cleanup } from '@testing-library/react'

vi.mock('@/content/config', () => ({
  content: {
    speedRun: {
      heading: 'The no-debt speed run',
      subtext: 'Two paths after high school.',
      disclaimer: 'Values are illustrative estimates.',
      carpenter: {
        milestones: [
          { year: 0, label: 'Starts apprenticeship', value: '$0 debt' },
          { year: 1, label: 'Earning 60%', value: '$38K/yr' },
          { year: 4, label: 'Red Seal certified', value: '$67K/yr' },
        ],
      },
      university: {
        milestones: [
          { year: 0, label: 'Starts degree', value: '-$10K debt' },
          { year: 4, label: 'Graduates', value: '-$45K debt' },
          { year: 5, label: 'Entry-level job', value: '$42K/yr' },
        ],
      },
    },
  },
}))

import ScreenSpeedRun from '@/app/pre-vr/components/ScreenSpeedRun'

describe('ScreenSpeedRun', () => {
  it('renders without crashing', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders heading, subtext, and disclaimer', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('The no-debt speed run')).toBeInTheDocument()
    expect(screen.getByText('Two paths after high school.')).toBeInTheDocument()
    expect(screen.getByText('Values are illustrative estimates.')).toBeInTheDocument()
  })

  it('renders both track labels', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Carpenter')).toBeInTheDocument()
    expect(screen.getByText('University Grad')).toBeInTheDocument()
  })

  it('renders all milestone labels and values', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Starts apprenticeship')).toBeInTheDocument()
    expect(screen.getByText('$0 debt')).toBeInTheDocument()
    expect(screen.getByText('Starts degree')).toBeInTheDocument()
    expect(screen.getByText('-$45K debt')).toBeInTheDocument()
  })

  describe('with reduced motion', () => {
    beforeEach(() => {
      // Mock matchMedia to report reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })
    })

    afterEach(() => {
      // Restore default matchMedia
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
      cleanup()
    })

    it('all milestones are visible immediately (no opacity-0 class)', () => {
      const { container } = render(<ScreenSpeedRun />)
      const milestones = container.querySelectorAll('[class*="translate-y"]')
      for (const m of milestones) {
        expect(m.className).not.toContain('opacity-0')
      }
    })
  })

  describe('with fake timers (no reduced motion)', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
      cleanup()
    })

    it('milestones start hidden and reveal progressively', () => {
      const { container } = render(<ScreenSpeedRun />)

      // Initially all milestones should have opacity-0 (visibleCount = 0)
      const getMilestoneClasses = () =>
        Array.from(container.querySelectorAll('[class*="pb-6"]')).map((el) => el.className)

      const initialClasses = getMilestoneClasses()
      for (const cls of initialClasses) {
        expect(cls).toContain('opacity-0')
      }

      // After one tick, first row should be visible
      act(() => { vi.advanceTimersByTime(400) })
      const afterOneTick = getMilestoneClasses()
      // First milestone of each column (index 0) should now be visible
      expect(afterOneTick[0]).toContain('opacity-100')
      expect(afterOneTick[3]).toContain('opacity-100')
      // Second milestone should still be hidden
      expect(afterOneTick[1]).toContain('opacity-0')
    })

    it('cleans up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
      const { unmount } = render(<ScreenSpeedRun />)

      // Advance partially — not all milestones revealed yet
      vi.advanceTimersByTime(400)
      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })
})
