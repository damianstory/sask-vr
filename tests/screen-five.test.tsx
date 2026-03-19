import { describe, it, vi } from 'vitest'

// Mock SessionContext
const mockSetFirstName = vi.fn()
const mockSetSelectedIcon = vi.fn()
const mockSetGeneratedCardUrl = vi.fn()
vi.mock('@/context/SessionContext', () => ({
  useSession: () => ({
    selectedTiles: ['task-framing', 'task-roofing'],
    firstName: '',
    selectedIcon: null,
    setFirstName: mockSetFirstName,
    setSelectedIcon: mockSetSelectedIcon,
    setGeneratedCardUrl: mockSetGeneratedCardUrl,
  }),
}))

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    screenFive: {
      heading: 'Make it yours',
      subtext: 'Create your personal carpenter card to take with you.',
      nameInputLabel: 'Your first name',
      nameInputPlaceholder: 'Enter your first name',
      iconSelectionLabel: 'Pick your favourite tool',
      icons: [
        { id: 'icon-hammer', label: 'Hammer', svgPath: '/icons/hammer.svg', emoji: '🔨' },
        { id: 'icon-saw', label: 'Saw', svgPath: '/icons/saw.svg', emoji: '🪚' },
        { id: 'icon-hardhat', label: 'Hard Hat', svgPath: '/icons/hardhat.svg', emoji: '⛑️' },
        { id: 'icon-tape', label: 'Tape Measure', svgPath: '/icons/tape.svg', emoji: '📏' },
        { id: 'icon-goggles', label: 'Goggles', svgPath: '/icons/goggles.svg', emoji: '🥽' },
        { id: 'icon-level', label: 'Level', svgPath: '/icons/level.svg', emoji: '📐' },
      ],
      downloadButtonLabel: 'Download Your Card',
    },
  },
}))

describe('ScreenFive', () => {
  describe('name input', () => {
    it.todo('renders name input with label and placeholder') // CARD-01
    it.todo('limits input to 30 characters') // CARD-01
    it.todo('calls setFirstName on keystroke') // CARD-01
    it.todo('shows validation error on blur when empty') // CARD-01
  })

  describe('icon picker', () => {
    it.todo('renders 6 icon buttons from content data') // CARD-02
    it.todo('marks selected icon with aria-pressed=true') // CARD-02
    it.todo('calls setSelectedIcon on click') // CARD-02
    it.todo('only one icon can be selected at a time') // CARD-02
  })

  describe('task tags', () => {
    it.todo('displays selected tile titles as read-only chips') // CARD-03
    it.todo('shows fallback text when no tiles selected') // CARD-03
  })

  describe('preview', () => {
    it.todo('renders live card preview container') // CARD-04
    it.todo('shows placeholder text when name is empty') // CARD-04
  })

  describe('download', () => {
    it.todo('download button is disabled when name is empty') // CARD-08
    it.todo('download button is disabled when no icon selected') // CARD-08
    it.todo('download button is enabled when both name and icon set') // CARD-08
  })
})
