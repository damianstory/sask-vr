import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock ScreenThree (lazy-loaded employer map) — the real component uses
// maplibre-gl which can't render in jsdom. Auto-fires onComplete so the
// gated screen 5 can be navigated through in flow tests.
vi.mock('@/app/pre-vr/components/ScreenThree', () => {
  const React = require('react')
  return {
    default: function MockScreenThree({ onComplete }: { onComplete?: () => void }) {
      React.useLayoutEffect(() => { onComplete?.() }, [onComplete])
      return React.createElement('section', null,
        React.createElement('h2', { 'data-screen-heading': '' }, 'Who hires carpenters near you?')
      )
    },
  }
})


import PreVrPage from '@/app/pre-vr/page'

beforeEach(() => {
  mockPush.mockClear()
  vi.useRealTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

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

function clickUntilDisabled(label: string) {
  const button = screen.getByLabelText(label)
  while (!button.hasAttribute('disabled')) {
    fireEvent.click(button)
  }
}

/** Navigate through the page-1 video carousel until the flow unlocks */
function unlockScreenOne() {
  clickUntilDisabled('Show next video')
}

/** Navigate through the page-2 salary detail carousel until the flow unlocks */
function unlockScreenTwo() {
  clickUntilDisabled('Show next salary detail')
}

/** Navigate through the page-3 milestone carousel until the flow unlocks */
function unlockScreenThree() {
  clickUntilDisabled('Show next comparison year')
}


/** Complete all 6 AI sort tasks by clicking the correct button and advancing timers */
function completeAiSort() {
  for (let i = 0; i < AI_SORT_ANSWERS.length; i++) {
    fireEvent.click(screen.getByRole('button', { name: AI_SORT_ANSWERS[i] }))
    act(() => { vi.advanceTimersByTime(4500) })
  }
}

/** Click the last career pathway step to unlock screen 6 gate */
function unlockScreenSix() {
  const pathwayButtons = document.querySelectorAll<HTMLButtonElement>(
    'button[aria-controls^="pathway-step-panel-"]'
  )
  pathwayButtons.forEach((button) => {
    fireEvent.click(button)
  })
}

/** Navigate from screen 1 to screen 7 (aiSorting).
 *  Async because the lazy-loaded employer map (screen 5) resolves through
 *  a Suspense boundary that requires an async act() tick. */
async function navigateToAiSorting() {
  unlockScreenOne()
  clickNext(1)       // reach screen 2 (salary)
  unlockScreenTwo()
  clickNext(1)       // reach screen 3 (speedRun)
  unlockScreenThree()
  clickNext(1)       // screen 3→4 (infographic, ungated)
  // Navigate to screen 5 and wait for the lazy Suspense boundary to resolve
  await act(async () => { clickNext(1) })
  clickNext(1)       // screen 5→6 (career pathway, gated disabled)
  unlockScreenSix()  // click last step to unlock gate
  clickNext(1)       // screen 6→7 (aiSorting)
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
  it('renders Home instead of Next on the last screen', async () => {
    vi.useFakeTimers()
    render(<PreVrPage />)

    await navigateToAiSorting()
    completeAiSort()

    clickNext(1)
    expect(screen.getByRole('progressbar', { name: 'Progress: 8 of 8' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /return to home page/i })).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('disables Back button on screen 1', () => {
    render(<PreVrPage />)
    const backButton = screen.getByLabelText('Go to previous screen')
    expect(backButton).toBeDisabled()
  })

  it('routes to the landing page when Home is clicked on the last screen', async () => {
    vi.useFakeTimers()
    mockPush.mockClear()
    render(<PreVrPage />)

    await navigateToAiSorting()
    completeAiSort()

    clickNext(1)
    fireEvent.click(screen.getByRole('button', { name: /return to home page/i }))

    expect(mockPush).toHaveBeenCalledWith('/')

    vi.useRealTimers()
  })
})

describe('Pre-VR Flow - Gating (FLOW-03)', () => {
  it('shows Next disabled on screen 1 until the student reaches video 6 of 6', () => {
    render(<PreVrPage />)

    const flowNext = screen.getByLabelText('Go to next screen')
    expect(flowNext).toBeDisabled()

    unlockScreenOne()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('keeps screen 1 unlocked after reaching video 6 of 6 once', () => {
    render(<PreVrPage />)

    unlockScreenOne()
    fireEvent.click(screen.getByLabelText('Show previous video'))

    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('hides Next on AI sorting screen until complete', async () => {
    vi.useFakeTimers()
    render(<PreVrPage />)
    await navigateToAiSorting()
    expect(screen.getByRole('progressbar', { name: 'Progress: 7 of 8' })).toBeInTheDocument()
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
    clickNext(1)
    unlockScreenTwo()
    clickNext(1)

    expect(screen.getByText('3 of 8')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeDisabled()

    unlockScreenThree()

    expect(screen.getByText('Year 10')).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next screen')).toBeEnabled()
  })

  it('keeps screen 3 unlocked after the last carpenter milestone has been reached once', () => {
    render(<PreVrPage />)

    unlockScreenOne()
    clickNext(1)
    unlockScreenTwo()
    clickNext(1)
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

  it('focuses the employer map heading after transition', async () => {
    render(<PreVrPage />)
    // Navigate to screen 5 (employer map) — screen 4 is ungated
    unlockScreenOne()
    clickNext(1)    // screen 1→2
    unlockScreenTwo()
    clickNext(1)    // screen 2→3
    unlockScreenThree()
    clickNext(1)    // screen 3→4
    await act(async () => { clickNext(1) }) // screen 4→5 (lazy)

    const screenFiveHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Who hires carpenters near you/i,
    })

    await waitFor(() => {
      expect(screenFiveHeading).toHaveFocus()
    })
  })
})
