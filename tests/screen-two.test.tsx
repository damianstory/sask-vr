import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenTwo from '@/app/pre-vr/components/ScreenTwo'

// Mock SessionContext
const mockSetSelectedTiles = vi.fn()
vi.mock('@/context/SessionContext', () => ({
  useSession: () => ({
    selectedTiles: [],
    setSelectedTiles: mockSetSelectedTiles,
  }),
}))

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    screenTwo: {
      heading: 'What sounds fun?',
      subtext: 'Pick the tasks that interest you most.',
      instruction: 'Choose 2-3 tasks',
      minSelections: 2,
      maxSelections: 3,
      tiles: [
        { id: 'task-framing', title: 'Framing', description: 'Build the skeleton', emoji: '\u{1F528}', illustrationPath: '' },
        { id: 'task-measuring', title: 'Measuring', description: 'Measure twice', emoji: '\u{1F4CF}', illustrationPath: '' },
        { id: 'task-finishing', title: 'Finishing', description: 'Install trim', emoji: '\u{1FA9A}', illustrationPath: '' },
        { id: 'task-concrete', title: 'Concrete', description: 'Pour foundations', emoji: '\u{1F9F1}', illustrationPath: '' },
        { id: 'task-roofing', title: 'Roofing', description: 'Keep buildings protected', emoji: '\u{1F3E0}', illustrationPath: '' },
        { id: 'task-renovation', title: 'Renovation', description: 'Transform spaces', emoji: '\u{1F527}', illustrationPath: '' },
      ],
    },
  },
}))

describe('ScreenTwo', () => {
  describe('tiles', () => {
    it.todo('renders six task tiles from content data') // TILE-01
    it.todo('each tile displays emoji and title') // TILE-01
  })

  describe('select', () => {
    it.todo('calls setSelectedTiles when a tile is clicked') // TILE-02
    it.todo('tiles have aria-pressed attribute') // TILE-02
  })

  describe('max', () => {
    it.todo('shows shake animation class on 4th selection attempt') // TILE-03
    it.todo('displays overflow message when max exceeded') // TILE-03
  })

  describe('continue', () => {
    it.todo('shows "Pick at least 2" when no tiles selected') // TILE-04
    it.todo('shows "Pick 1 more" when 1 tile selected') // TILE-04
    it.todo('shows "Continue" when 2+ tiles selected') // TILE-04
  })

  describe('session', () => {
    it.todo('reads selectedTiles from useSession on mount') // TILE-05
    it.todo('persists selections through setSelectedTiles') // TILE-05
  })
})
