import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, cleanup } from '@testing-library/react'

const {
  mockSetAiSortResults,
  mockSetAiSortComplete,
  mockTrackAISortAttempt,
  mockTrackAISortComplete,
  mockTasks,
} = vi.hoisted(() => ({
  mockSetAiSortResults: vi.fn(),
  mockSetAiSortComplete: vi.fn(),
  mockTrackAISortAttempt: vi.fn(),
  mockTrackAISortComplete: vi.fn(),
  mockTasks: [
    { id: 'task-1', description: 'Calculate lumber', correctAnswer: 'ai' as const, explanation: 'AI can compute this.' },
    { id: 'task-2', description: 'Frame a wall', correctAnswer: 'human' as const, explanation: 'Requires hands.' },
    { id: 'task-3', description: 'Schedule subs', correctAnswer: 'ai' as const, explanation: 'AI optimizes schedules.' },
  ],
}))

interface MockSessionState {
  aiSortResults: Array<{ taskId: string; chosen: 'ai' | 'human'; correct: boolean }> | null
  aiSortComplete: boolean
  setAiSortResults: typeof mockSetAiSortResults
  setAiSortComplete: typeof mockSetAiSortComplete
}

let mockSessionState: MockSessionState

function buildSessionState(
  overrides: Partial<Pick<MockSessionState, 'aiSortResults' | 'aiSortComplete'>> = {},
): MockSessionState {
  return {
    aiSortResults: null,
    setAiSortResults: mockSetAiSortResults,
    aiSortComplete: false,
    setAiSortComplete: mockSetAiSortComplete,
    ...overrides,
  }
}

vi.mock('@/content/config', () => ({
  content: {
    aiSorting: {
      heading: 'AI can\'t build this',
      subtext: 'Sort each task.',
      punchline: 'Carpenters are irreplaceable.',
      tasks: mockTasks,
    },
  },
}))

vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))

vi.mock('@/lib/analytics', () => ({
  trackAISortAttempt: mockTrackAISortAttempt,
  trackAISortComplete: mockTrackAISortComplete,
}))

vi.mock('@/lib/hooks', () => ({
  useReducedMotion: () => false,
}))

import ScreenAI from '@/app/pre-vr/components/ScreenAI'

describe('ScreenAI', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockSessionState = buildSessionState()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('renders without crashing', () => {
    render(<ScreenAI />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('shows first task description and AI/Human buttons', () => {
    render(<ScreenAI />)
    expect(screen.getByText('Calculate lumber')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AI' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Human' })).toBeInTheDocument()
  })

  it('shows "Correct!" feedback when correct answer chosen', () => {
    render(<ScreenAI />)
    // Task 1 correct answer is 'ai'
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })

  it('shows "Not quite" feedback when wrong answer chosen', () => {
    render(<ScreenAI />)
    // Task 1 correct answer is 'ai', so 'human' is wrong
    fireEvent.click(screen.getByRole('button', { name: 'Human' }))
    expect(screen.getByText('Not quite')).toBeInTheDocument()
  })

  it('disables both buttons during feedback window', () => {
    render(<ScreenAI />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))

    expect(screen.getByRole('button', { name: 'AI' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Human' })).toBeDisabled()
  })

  it('re-enables buttons after feedback delay when more tasks remain', () => {
    render(<ScreenAI />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))

    // Simulate session update for next render
    mockSessionState = buildSessionState({
      aiSortResults: [{ taskId: 'task-1', chosen: 'ai', correct: true }],
    })

    act(() => { vi.advanceTimersByTime(1200) })

    expect(screen.getByRole('button', { name: 'AI' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Human' })).not.toBeDisabled()
  })

  it('calls trackAISortAttempt on each choice', () => {
    render(<ScreenAI />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))

    expect(mockTrackAISortAttempt).toHaveBeenCalledWith('task-1', 'ai', true)
  })

  it('calls setAiSortResults with nextResults array', () => {
    render(<ScreenAI />)
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))

    expect(mockSetAiSortResults).toHaveBeenCalledWith([
      { taskId: 'task-1', chosen: 'ai', correct: true },
    ])
  })

  it('after all tasks: calls trackAISortComplete, setAiSortComplete, onComplete, shows results', () => {
    const onComplete = vi.fn()

    // Start with first 2 tasks already answered
    mockSessionState = buildSessionState({
      aiSortResults: [
        { taskId: 'task-1', chosen: 'ai', correct: true },
        { taskId: 'task-2', chosen: 'human', correct: true },
      ],
    })

    render(<ScreenAI onComplete={onComplete} />)

    // Should show task-3 (the last remaining)
    expect(screen.getByText('Schedule subs')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'AI' }))

    act(() => { vi.advanceTimersByTime(1200) })

    expect(mockTrackAISortComplete).toHaveBeenCalledWith(3) // all 3 correct
    expect(mockSetAiSortComplete).toHaveBeenCalledWith(true)
    expect(onComplete).toHaveBeenCalled()
    expect(screen.getByText('Carpenters are irreplaceable.')).toBeInTheDocument()
  })

  it('revisit (aiSortComplete=true): shows results directly, no analytics, no onComplete', () => {
    const onComplete = vi.fn()
    mockSessionState = buildSessionState({
      aiSortComplete: true,
      aiSortResults: [
        { taskId: 'task-1', chosen: 'ai', correct: true },
        { taskId: 'task-2', chosen: 'human', correct: true },
        { taskId: 'task-3', chosen: 'ai', correct: true },
      ],
    })

    render(<ScreenAI onComplete={onComplete} />)

    // Should show results immediately
    expect(screen.getByText('Carpenters are irreplaceable.')).toBeInTheDocument()
    expect(screen.getByText('3 of 3')).toBeInTheDocument()

    // Should NOT have fired analytics or onComplete
    expect(mockTrackAISortComplete).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('partial revisit: skips answered task IDs, shows first unanswered', () => {
    mockSessionState = buildSessionState({
      aiSortResults: [
        { taskId: 'task-1', chosen: 'ai', correct: true },
      ],
    })

    render(<ScreenAI />)

    // task-1 is answered, should show task-2
    expect(screen.queryByText('Calculate lumber')).not.toBeInTheDocument()
    expect(screen.getByText('Frame a wall')).toBeInTheDocument()
  })

  it('partial revisit does not call onComplete on mount', () => {
    const onComplete = vi.fn()
    mockSessionState = buildSessionState({
      aiSortResults: [
        { taskId: 'task-1', chosen: 'ai', correct: true },
      ],
    })

    render(<ScreenAI onComplete={onComplete} />)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('results view renders tasks in canonical data.tasks order', () => {
    mockSessionState = buildSessionState({
      aiSortComplete: true,
      aiSortResults: [
        { taskId: 'task-3', chosen: 'ai', correct: true },
        { taskId: 'task-1', chosen: 'ai', correct: true },
        { taskId: 'task-2', chosen: 'human', correct: true },
      ],
    })

    render(<ScreenAI />)

    expect(screen.getByText('Calculate lumber')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show next result' }))
    expect(screen.getByText('Frame a wall')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show next result' }))
    expect(screen.getByText('Schedule subs')).toBeInTheDocument()
  })
})
