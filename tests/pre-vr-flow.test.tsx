import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('maplibre-gl', () => {
  const Map = vi.fn(function MockMap() {
    return {
      on: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      fitBounds: vi.fn(),
      scrollZoom: { disable: vi.fn() },
      dragPan: { disable: vi.fn() },
      doubleClickZoom: { disable: vi.fn() },
      touchZoomRotate: { disable: vi.fn() },
      keyboard: { disable: vi.fn() },
    }
  })
  const Marker = vi.fn(function MockMarker() {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      setDOMContent: vi.fn().mockReturnThis(),
      getElement: vi.fn(() => document.createElement('div')),
    }
  })
  const LngLatBounds = vi.fn(function MockLngLatBounds() {
    return { extend: vi.fn().mockReturnThis() }
  })
  return { default: { Map, Marker, LngLatBounds }, Map, Marker, LngLatBounds }
})

// Mock @dnd-kit for flow tests
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

import PreVrPage from '@/app/pre-vr/page'

// Correct answers for the 6 AI sorting tasks in carpentry.json order
const AI_SORT_ANSWERS: Array<'AI' | 'Human'> = [
  'AI',     // ai-task-1: Calculate lumber
  'Human',  // ai-task-2: Frame a wall
  'AI',     // ai-task-3: Generate 3D model
  'Human',  // ai-task-4: Scribe and fit trim
  'AI',     // ai-task-5: Schedule subcontractors
  'Human',  // ai-task-6: Safely demolish
]

/** Click Next `n` times */
function clickNext(n: number) {
  for (let i = 0; i < n; i++) {
    fireEvent.click(screen.getByLabelText('Go to next screen'))
  }
}

/** Navigate through the page-1 video carousel until the flow unlocks */
function unlockScreenOne() {
  const videoNext = screen.getByLabelText('Show next video')
  for (let i = 0; i < 5; i++) {
    fireEvent.click(videoNext)
  }
}

/** Navigate through the page-3 milestone carousel until the flow unlocks */
function unlockScreenThree() {
  const speedRunNext = screen.getByLabelText('Show next comparison year')
  for (let i = 0; i < 5; i++) {
    fireEvent.click(speedRunNext)
  }
}

/** Submit the task ranking (click "Lock in my ranking") */
function submitRanking() {
  fireEvent.click(screen.getByRole('button', { name: /Lock in my ranking/i }))
}

/** Complete all 6 AI sort tasks by clicking the correct button and advancing timers */
function completeAiSort() {
  for (let i = 0; i < AI_SORT_ANSWERS.length; i++) {
    fireEvent.click(screen.getByRole('button', { name: AI_SORT_ANSWERS[i] }))
    act(() => { vi.advanceTimersByTime(1200) })
  }
}

/** Navigate from screen 1 to the taskRanking gate (screen 4) */
function navigateToTaskRanking() {
  unlockScreenOne()
  clickNext(2) // screens 1→2→3
  unlockScreenThree()
  clickNext(1) // screen 3→4
}

/** Navigate from screen 1 to screen 7 (aiSorting), unlocking taskRanking gate along the way */
function navigateToAiSorting() {
  unlockScreenOne()
  clickNext(2)    // reach screen 3 (speedRun)
  unlockScreenThree()
  clickNext(1)    // reach screen 4 (taskRanking)
  submitRanking() // unlock gate
  clickNext(3)    // screens 4→5→6→7
}

describe('Pre-VR Flow - Screen Navigation (FLOW-01)', () => {
  it('renders screen 1 on initial load', () => {
    render(<PreVrPage />)
    expect(screen.getByText('1 of 8')).toBeInTheDocument()
  })

  it('navigates forward when Next is clicked', () => {
    render(<PreVrPage />)
    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Go to next screen'))
    expect(screen.getByText('2 of 8')).toBeInTheDocument()
  })

  it('navigates backward when Back is clicked', () => {
    render(<PreVrPage />)
    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Go to next screen')) // go to screen 2
    fireEvent.click(screen.getByLabelText('Go to previous screen'))
    expect(screen.getByText('1 of 8')).toBeInTheDocument()
  })
})

describe('Pre-VR Flow - Navigation Bounds (FLOW-02)', () => {
  it('disables Back button on screen 1', () => {
    render(<PreVrPage />)
    const backButton = screen.getByLabelText('Go to previous screen')
    expect(backButton).toBeDisabled()
  })

  it('does not render Next button on last screen', () => {
    vi.useFakeTimers()
    render(<PreVrPage />)

    // Navigate to screen 4 (taskRanking), submit to unlock
    navigateToTaskRanking()
    submitRanking()

    // Navigate to screen 7 (aiSorting), complete to unlock
    clickNext(3)
    completeAiSort()

    // Navigate to screen 8 (last)
    clickNext(1)
    expect(screen.getByText('8 of 8')).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()

    vi.useRealTimers()
  })
})

describe('Pre-VR Flow - Gating (FLOW-03)', () => {
  it('shows Next disabled on screen 1 until the student reaches video 6 of 6', () => {
    render(<PreVrPage />)

    const flowNext = screen.getByLabelText('Go to next screen')
    expect(flowNext).toBeDisabled()

    unlockScreenOne()
    expect(screen.getByText('6 of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('keeps screen 1 unlocked after reaching video 6 of 6 once', () => {
    render(<PreVrPage />)

    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Show previous video'))

    expect(screen.getByText('5 of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('hides Next on ranking screen until submit', () => {
    render(<PreVrPage />)
    navigateToTaskRanking()
    expect(screen.getByText('4 of 8')).toBeInTheDocument()
    // Next button should not be rendered (gated)
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()
    // Submit ranking
    submitRanking()
    // Now Next should appear
    expect(screen.getByLabelText('Go to next screen')).toBeInTheDocument()
  })

  it('shows reveal on revisit after ranking submit', () => {
    render(<PreVrPage />)
    navigateToTaskRanking()
    submitRanking()
    // Navigate forward then back
    clickNext(1)
    expect(screen.getByText('5 of 8')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Go to previous screen'))
    expect(screen.getByText('4 of 8')).toBeInTheDocument()
    // Should show reveal, not ranking UI
    expect(screen.getByText("Here's how your ranking compares")).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Lock in my ranking/i })).not.toBeInTheDocument()
    // Next button should still be available
    expect(screen.getByLabelText('Go to next screen')).toBeInTheDocument()
  })

  it('hides Next on AI sorting screen until complete', () => {
    vi.useFakeTimers()
    render(<PreVrPage />)
    navigateToAiSorting()
    expect(screen.getByText('7 of 8')).toBeInTheDocument()
    // Next button should not be rendered (gated)
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()
    // Complete all 6 AI sort tasks
    completeAiSort()
    // Now Next should appear
    expect(screen.getByLabelText('Go to next screen')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows Next disabled on screen 3 until the student reaches the last carpenter milestone', () => {
    render(<PreVrPage />)

    unlockScreenOne()
    clickNext(2)

    expect(screen.getByText('3 of 8')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeDisabled()

    unlockScreenThree()

    expect(screen.getByText('Year 10')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('keeps screen 3 unlocked after the last carpenter milestone has been reached once', () => {
    render(<PreVrPage />)

    unlockScreenOne()
    clickNext(2)
    unlockScreenThree()
    fireEvent.click(screen.getByLabelText('Show previous comparison year'))

    expect(screen.getByText('Year 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })
})

describe('Pre-VR Flow - Transitions (FLOW-04)', () => {
  it('does not apply animation class on initial mount', () => {
    const { container } = render(<PreVrPage />)
    const animationWrapper = container.querySelector(
      '.animate-slide-left, .animate-slide-right'
    )
    expect(animationWrapper).toBeNull()
  })

  it('applies slide-left animation on forward navigation', () => {
    const { container } = render(<PreVrPage />)
    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Go to next screen'))
    const slideLeft = container.querySelector('.animate-slide-left')
    expect(slideLeft).not.toBeNull()
  })

  it('applies slide-right animation on backward navigation', () => {
    const { container } = render(<PreVrPage />)
    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Go to next screen')) // forward to 2
    fireEvent.click(screen.getByLabelText('Go to previous screen')) // back to 1
    const slideRight = container.querySelector('.animate-slide-right')
    expect(slideRight).not.toBeNull()
  })

  it('focuses the employer map heading after lazy-loaded transition', async () => {
    render(<PreVrPage />)
    // Navigate to screen 4, submit ranking to unlock
    navigateToTaskRanking()
    submitRanking()
    // Navigate to screen 5 (employer map)
    clickNext(1)

    const screenFiveHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Who hires carpenters near you/i,
    })

    await waitFor(() => {
      expect(screenFiveHeading).toHaveFocus()
    })
  })
})
