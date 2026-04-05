import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'

const {
  mockSetShuffledTileOrder,
  mockSetRankedTiles,
  mockSetRankingSubmitted,
  mockSetRankingScore,
  mockTrackRankingSubmit,
  mockTrackRankingScore,
  taskRankingTiles,
} = vi.hoisted(() => ({
  mockSetShuffledTileOrder: vi.fn(),
  mockSetRankedTiles: vi.fn(),
  mockSetRankingSubmitted: vi.fn(),
  mockSetRankingScore: vi.fn(),
  mockTrackRankingSubmit: vi.fn(),
  mockTrackRankingScore: vi.fn(),
  taskRankingTiles: [
    { id: 'task-framing', title: 'Framing', description: 'Build the skeleton', emoji: '\u{1F528}', illustrationPath: '', weight: 20 },
    { id: 'task-measuring', title: 'Measuring', description: 'Measure twice', emoji: '\u{1F4CF}', illustrationPath: '', weight: 14 },
    { id: 'task-finishing', title: 'Finishing', description: 'Install trim', emoji: '\u{1FA9A}', illustrationPath: '', weight: 14 },
    { id: 'task-concrete', title: 'Concrete', description: 'Pour foundations', emoji: '\u{1F9F1}', illustrationPath: '', weight: 16 },
    { id: 'task-roofing', title: 'Roofing', description: 'Keep buildings protected', emoji: '\u{1F3E0}', illustrationPath: '', weight: 14 },
    { id: 'task-renovation', title: 'Renovation', description: 'Transform spaces', emoji: '\u{1F527}', illustrationPath: '', weight: 10 },
  ],
}))

// Seeded order for most tests — avoids mocking shuffle
const seededOrder = [
  'task-framing',
  'task-measuring',
  'task-finishing',
  'task-concrete',
  'task-roofing',
  'task-renovation',
]

interface MockSessionState {
  shuffledTileOrder: string[]
  setShuffledTileOrder: typeof mockSetShuffledTileOrder
  rankedTiles: string[]
  setRankedTiles: typeof mockSetRankedTiles
  rankingSubmitted: boolean
  setRankingSubmitted: typeof mockSetRankingSubmitted
  rankingScore: number | null
  setRankingScore: typeof mockSetRankingScore
}

let mockSessionState: MockSessionState

function buildSessionState(
  overrides: Partial<Pick<MockSessionState, 'shuffledTileOrder' | 'rankedTiles' | 'rankingSubmitted' | 'rankingScore'>> = {}
): MockSessionState {
  return {
    shuffledTileOrder: seededOrder,
    setShuffledTileOrder: mockSetShuffledTileOrder,
    rankedTiles: [],
    setRankedTiles: mockSetRankedTiles,
    rankingSubmitted: false,
    setRankingSubmitted: mockSetRankingSubmitted,
    rankingScore: null,
    setRankingScore: mockSetRankingScore,
    ...overrides,
  }
}

vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))

vi.mock('@/content/config', () => ({
  content: {
    taskRanking: {
      heading: 'What sounds fun?',
      subtext: 'Pick the tasks that interest you most.',
      instruction: 'Drag to rank from most to least interesting',
      reveal: {
        heading: "Here's how your ranking compares",
        subtext: 'See how your interests line up with actual job time.',
      },
      tiles: taskRankingTiles,
    },
  },
}))

vi.mock('@/lib/analytics', () => ({
  trackRankingSubmit: mockTrackRankingSubmit,
  trackRankingScore: mockTrackRankingScore,
}))

// Mock @dnd-kit — jsdom can't simulate drag events
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    setNodeRef: vi.fn(),
    attributes: {},
    listeners: {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const result = [...arr]
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  },
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}))

import ScreenTaskRanking from '@/app/pre-vr/components/ScreenTaskRanking'

function renderScreenTaskRanking(
  sessionOverrides: Partial<Pick<MockSessionState, 'shuffledTileOrder' | 'rankedTiles' | 'rankingSubmitted' | 'rankingScore'>> = {},
  props: { onComplete?: () => void } = {}
) {
  mockSessionState = buildSessionState(sessionOverrides)
  return render(<ScreenTaskRanking {...props} />)
}

describe('ScreenTaskRanking', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionState = buildSessionState()
  })

  describe('ranking phase', () => {
    it('renders all 6 tiles as sortable items', () => {
      renderScreenTaskRanking()
      for (const tile of taskRankingTiles) {
        expect(screen.getByText(tile.title)).toBeInTheDocument()
        expect(screen.getByText(tile.emoji)).toBeInTheDocument()
      }
    })

    it('renders heading and instruction', () => {
      renderScreenTaskRanking()
      expect(screen.getByRole('heading', { level: 2, name: 'What sounds fun?' })).toBeInTheDocument()
      expect(screen.getByText('Drag to rank from most to least interesting')).toBeInTheDocument()
    })

    it('shuffles tiles on first mount when session is empty', () => {
      renderScreenTaskRanking({ shuffledTileOrder: [] })
      expect(mockSetShuffledTileOrder).toHaveBeenCalledTimes(1)
      const call = mockSetShuffledTileOrder.mock.calls[0][0]
      expect(call).toHaveLength(6)
      // All original IDs present
      expect([...call].sort()).toEqual([...seededOrder].sort())
    })

    it('uses existing shuffledTileOrder from session if present', () => {
      renderScreenTaskRanking({ shuffledTileOrder: seededOrder })
      expect(mockSetShuffledTileOrder).not.toHaveBeenCalled()
    })

    it('disables up arrow on first item and down arrow on last item', () => {
      renderScreenTaskRanking()
      const firstTitle = taskRankingTiles.find((t) => t.id === seededOrder[0])!.title
      const lastTitle = taskRankingTiles.find((t) => t.id === seededOrder[5])!.title

      expect(screen.getByLabelText(`Move ${firstTitle} up`)).toBeDisabled()
      expect(screen.getByLabelText(`Move ${lastTitle} down`)).toBeDisabled()
    })

    it('moves a tile up when up arrow is clicked', () => {
      renderScreenTaskRanking()
      // Second item is task-measuring
      const upButton = screen.getByLabelText('Move Measuring up')
      fireEvent.click(upButton)
      // After move, items should have measuring first
      const listItems = screen.getAllByRole('listitem')
      expect(listItems[0]).toHaveTextContent('Measuring')
      expect(listItems[1]).toHaveTextContent('Framing')
    })

    it('moves a tile down when down arrow is clicked', () => {
      renderScreenTaskRanking()
      // First item is task-framing
      const downButton = screen.getByLabelText('Move Framing down')
      fireEvent.click(downButton)
      const listItems = screen.getAllByRole('listitem')
      expect(listItems[0]).toHaveTextContent('Measuring')
      expect(listItems[1]).toHaveTextContent('Framing')
    })

    it('submit button is always present and enabled', () => {
      renderScreenTaskRanking()
      const submitButton = screen.getByRole('button', { name: /Lock in my ranking/i })
      expect(submitButton).toBeEnabled()
    })
  })

  describe('submit', () => {
    it('stores ranking in session and calls analytics on submit', () => {
      renderScreenTaskRanking()
      fireEvent.click(screen.getByRole('button', { name: /Lock in my ranking/i }))

      expect(mockSetRankedTiles).toHaveBeenCalledWith(seededOrder)
      expect(mockSetRankingSubmitted).toHaveBeenCalledWith(true)
      expect(mockSetRankingScore).toHaveBeenCalledWith(expect.any(Number))
      expect(mockTrackRankingSubmit).toHaveBeenCalledWith(seededOrder)
      expect(mockTrackRankingScore).toHaveBeenCalledWith(expect.any(Number))
    })

    it('calls onComplete on submit', () => {
      const onComplete = vi.fn()
      renderScreenTaskRanking({}, { onComplete })
      fireEvent.click(screen.getByRole('button', { name: /Lock in my ranking/i }))
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('transitions to reveal phase after submit', () => {
      renderScreenTaskRanking()
      fireEvent.click(screen.getByRole('button', { name: /Lock in my ranking/i }))
      expect(screen.getByText("Here's how your ranking compares")).toBeInTheDocument()
      expect(screen.getByText(/You matched/)).toBeInTheDocument()
    })
  })

  describe('reveal', () => {
    it('shows reveal directly when rankingSubmitted is true', () => {
      renderScreenTaskRanking({
        rankingSubmitted: true,
        rankedTiles: seededOrder,
      })
      expect(screen.getByText("Here's how your ranking compares")).toBeInTheDocument()
      expect(screen.getByText(/You matched/)).toBeInTheDocument()
    })

    it('displays both Your Ranking and Actual Job Weight columns', () => {
      renderScreenTaskRanking({
        rankingSubmitted: true,
        rankedTiles: seededOrder,
      })
      expect(screen.getByText('Your Ranking')).toBeInTheDocument()
      expect(screen.getByText('Actual Job Weight')).toBeInTheDocument()
    })

    it('shows tie group bracket for 14% tiles', () => {
      renderScreenTaskRanking({
        rankingSubmitted: true,
        rankedTiles: seededOrder,
      })
      expect(screen.getByText(/Tied/)).toBeInTheDocument()
      expect(screen.getByText('14% each')).toBeInTheDocument()
    })
  })

  describe('revisit (locked session)', () => {
    it('shows reveal immediately and hides ranking controls', () => {
      renderScreenTaskRanking({
        rankingSubmitted: true,
        rankedTiles: seededOrder,
      })
      // Reveal is visible
      expect(screen.getByText("Here's how your ranking compares")).toBeInTheDocument()
      // Ranking controls are absent
      expect(screen.queryByRole('button', { name: /Lock in my ranking/i })).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Move .+ up/)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Move .+ down/)).not.toBeInTheDocument()
    })
  })
})
