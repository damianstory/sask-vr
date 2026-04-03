import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

const { mockSetSelectedTiles, mockTrackTileSelect, screenTwoTiles } = vi.hoisted(() => ({
  mockSetSelectedTiles: vi.fn(),
  mockTrackTileSelect: vi.fn(),
  screenTwoTiles: [
    {
      id: 'task-framing',
      title: 'Framing',
      description: 'Build the skeleton',
      emoji: '\u{1F528}',
      illustrationPath: '',
      weight: 20,
    },
    {
      id: 'task-measuring',
      title: 'Measuring',
      description: 'Measure twice',
      emoji: '\u{1F4CF}',
      illustrationPath: '',
      weight: 14,
    },
    {
      id: 'task-finishing',
      title: 'Finishing',
      description: 'Install trim',
      emoji: '\u{1FA9A}',
      illustrationPath: '',
      weight: 14,
    },
    {
      id: 'task-concrete',
      title: 'Concrete',
      description: 'Pour foundations',
      emoji: '\u{1F9F1}',
      illustrationPath: '',
      weight: 16,
    },
    {
      id: 'task-roofing',
      title: 'Roofing',
      description: 'Keep buildings protected',
      emoji: '\u{1F3E0}',
      illustrationPath: '',
      weight: 14,
    },
    {
      id: 'task-renovation',
      title: 'Renovation',
      description: 'Transform spaces',
      emoji: '\u{1F527}',
      illustrationPath: '',
      weight: 10,
    },
  ],
}))

interface MockSessionState {
  selectedTiles: string[]
  setSelectedTiles: typeof mockSetSelectedTiles
}

let mockSessionState: MockSessionState

function buildSessionState(
  overrides: Partial<Pick<MockSessionState, 'selectedTiles'>> = {}
): MockSessionState {
  return {
    selectedTiles: [],
    setSelectedTiles: mockSetSelectedTiles,
    ...overrides,
  }
}

vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))

vi.mock('@/content/config', () => ({
  content: {
    screenTwo: {
      heading: 'What sounds fun?',
      subtext: 'Pick the tasks that interest you most.',
      instruction: 'Choose 2-3 tasks',
      minSelections: 2,
      maxSelections: 3,
      tiles: screenTwoTiles,
    },
  },
}))

vi.mock('@/lib/analytics', () => ({
  trackTileSelect: mockTrackTileSelect,
}))

import ScreenTwo from '@/app/pre-vr/components/ScreenTwo'

function renderScreenTwo(
  sessionOverrides: Partial<Pick<MockSessionState, 'selectedTiles'>> = {},
  props: ComponentProps<typeof ScreenTwo> = {}
) {
  mockSessionState = buildSessionState(sessionOverrides)
  return render(<ScreenTwo {...props} />)
}

describe('ScreenTwo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    mockSessionState = buildSessionState()
  })

  describe('tiles', () => {
    it('renders the heading, instruction copy, and all six task tiles from content', () => {
      renderScreenTwo()

      const heading = screen.getByRole('heading', { level: 2, name: 'What sounds fun?' })
      expect(heading).toHaveAttribute('data-screen-heading')
      expect(screen.getByText('Pick the tasks that interest you most.')).toBeInTheDocument()
      expect(screen.getByText('Choose 2-3 tasks')).toBeInTheDocument()

      for (const tile of screenTwoTiles) {
        expect(screen.getByRole('button', { name: new RegExp(tile.title, 'i') })).toBeInTheDocument()
        expect(screen.getByText(tile.description)).toBeInTheDocument()
        expect(screen.getByText(tile.emoji)).toBeInTheDocument()
      }
    })
  })

  describe('select', () => {
    it('appends a tile selection and tracks the select action', () => {
      renderScreenTwo()

      fireEvent.click(screen.getByRole('button', { name: /Framing/i }))

      expect(mockSetSelectedTiles).toHaveBeenCalledWith(['task-framing'])
      expect(mockTrackTileSelect).toHaveBeenCalledWith('task-framing', 'select')
    })

    it('removes a seeded tile selection and tracks the deselect action', () => {
      renderScreenTwo({ selectedTiles: ['task-framing', 'task-roofing'] })

      fireEvent.click(screen.getByRole('button', { name: /Framing/i }))

      expect(mockSetSelectedTiles).toHaveBeenCalledWith(['task-roofing'])
      expect(mockTrackTileSelect).toHaveBeenCalledWith('task-framing', 'deselect')
    })

    it('renders aria-pressed state from seeded session selections', () => {
      renderScreenTwo({
        selectedTiles: ['task-framing', 'task-measuring', 'task-finishing'],
      })

      const tileButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')
      )

      expect(tileButtons).toHaveLength(6)
      expect(screen.getByRole('button', { name: /Framing/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: /Measuring/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: /Finishing/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: /Concrete/i })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
      expect(
        tileButtons.filter((button) => button.getAttribute('aria-pressed') === 'true')
      ).toHaveLength(3)
    })
  })

  describe('max', () => {
    it('rejects a fourth tile, shows overflow feedback, and clears the timer-driven UI', () => {
      vi.useFakeTimers()
      renderScreenTwo({
        selectedTiles: ['task-framing', 'task-measuring', 'task-finishing'],
      })

      const rejectedTile = screen.getByRole('button', { name: /Concrete/i })
      fireEvent.click(rejectedTile)

      expect(mockSetSelectedTiles).not.toHaveBeenCalled()
      expect(mockTrackTileSelect).not.toHaveBeenCalled()
      expect(rejectedTile.className).toContain('animate-shake')
      expect(screen.getByText('You can pick up to 3!')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(300)
      })

      expect(rejectedTile.className).not.toContain('animate-shake')
      expect(screen.getByText('You can pick up to 3!')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(2700)
      })

      expect(screen.queryByText('You can pick up to 3!')).not.toBeInTheDocument()
    })
  })

  describe('continue', () => {
    it('shows "Pick at least 2" and stays disabled when no tiles are selected', () => {
      renderScreenTwo()

      expect(screen.getByRole('button', { name: /Pick at least 2/i })).toBeDisabled()
    })

    it('shows "Pick 1 more" and stays disabled when one tile is selected', () => {
      renderScreenTwo({ selectedTiles: ['task-framing'] })

      expect(screen.getByRole('button', { name: /Pick 1 more/i })).toBeDisabled()
    })

    it('shows "Continue" and enables the local CTA once two tiles are selected', () => {
      const onNext = vi.fn()
      renderScreenTwo(
        { selectedTiles: ['task-framing', 'task-measuring'] },
        { onNext }
      )

      const continueButton = screen.getByRole('button', { name: /Continue/i })
      expect(continueButton).toBeEnabled()

      fireEvent.click(continueButton)
      expect(onNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('session', () => {
    it('reads selectedTiles from session on mount and reflects the seeded CTA state', () => {
      renderScreenTwo({ selectedTiles: ['task-framing'] })

      expect(screen.getByRole('button', { name: /Framing/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: /Pick 1 more/i })).toBeDisabled()
    })
  })
})
