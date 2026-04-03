import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ComponentProps } from 'react'

const {
  mockSetFirstName,
  mockSetSelectedIcon,
  mockSetGeneratedCardUrl,
  mockGenerateCardPng,
  mockTrackIconSelect,
  mockTrackNameEntered,
  mockTrackCardDownload,
  mockCreateObjectURL,
  mockRevokeObjectURL,
} = vi.hoisted(() => ({
  mockSetFirstName: vi.fn(),
  mockSetSelectedIcon: vi.fn(),
  mockSetGeneratedCardUrl: vi.fn(),
  mockGenerateCardPng: vi.fn(),
  mockTrackIconSelect: vi.fn(),
  mockTrackNameEntered: vi.fn(),
  mockTrackCardDownload: vi.fn(),
  mockCreateObjectURL: vi.fn(),
  mockRevokeObjectURL: vi.fn(),
}))

interface MockSessionState {
  selectedTiles: string[]
  firstName: string
  selectedIcon: string | null
  setFirstName: typeof mockSetFirstName
  setSelectedIcon: typeof mockSetSelectedIcon
  setGeneratedCardUrl: typeof mockSetGeneratedCardUrl
}

let mockSessionState: MockSessionState

function buildSessionState(
  overrides: Partial<Pick<MockSessionState, 'selectedTiles' | 'firstName' | 'selectedIcon'>> = {}
): MockSessionState {
  return {
    selectedTiles: ['task-framing', 'task-roofing'],
    firstName: '',
    selectedIcon: null,
    setFirstName: mockSetFirstName,
    setSelectedIcon: mockSetSelectedIcon,
    setGeneratedCardUrl: mockSetGeneratedCardUrl,
    ...overrides,
  }
}

vi.mock('@/context/SessionContext', () => ({
  useSession: () => mockSessionState,
}))

vi.mock('@/content/config', () => ({
  content: {
    screenTwo: {
      tiles: [
        { id: 'task-framing', title: 'Framing' },
        { id: 'task-measuring', title: 'Measuring & Layout' },
        { id: 'task-finishing', title: 'Finishing Work' },
        { id: 'task-roofing', title: 'Roofing' },
      ],
    },
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

vi.mock('@/lib/generate-card', () => ({
  generateCardPng: mockGenerateCardPng,
}))

vi.mock('@/lib/analytics', () => ({
  trackIconSelect: mockTrackIconSelect,
  trackNameEntered: mockTrackNameEntered,
  trackCardDownload: mockTrackCardDownload,
}))

import ScreenFive from '@/app/pre-vr/components/ScreenFive'
import { getGradientVariant } from '@/lib/card-gradients'

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL,
})

function renderScreenFive(
  sessionOverrides: Partial<Pick<MockSessionState, 'selectedTiles' | 'firstName' | 'selectedIcon'>> = {},
  props: ComponentProps<typeof ScreenFive> = {}
) {
  mockSessionState = buildSessionState(sessionOverrides)
  return render(<ScreenFive {...props} />)
}

describe('ScreenFive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionState = buildSessionState()
    mockCreateObjectURL.mockReturnValue('blob:mock-card')
    mockGenerateCardPng.mockResolvedValue(new Blob(['png'], { type: 'image/png' }))
  })

  describe('name input', () => {
    it('renders name input with label, placeholder, and 30-character max length', () => {
      renderScreenFive()

      const input = screen.getByLabelText('Your first name')
      expect(input).toHaveAttribute('placeholder', 'Enter your first name')
      expect(input).toHaveAttribute('maxlength', '30')
    })

    it('calls setFirstName on change and tracks the first non-empty name entry once', () => {
      renderScreenFive()

      const input = screen.getByLabelText('Your first name')
      fireEvent.change(input, { target: { value: 'A' } })
      fireEvent.change(input, { target: { value: 'Ava' } })

      expect(mockSetFirstName).toHaveBeenNthCalledWith(1, 'A')
      expect(mockSetFirstName).toHaveBeenNthCalledWith(2, 'Ava')
      expect(mockTrackNameEntered).toHaveBeenCalledTimes(1)
    })

    it('shows the validation error on blur when the current name is whitespace only', () => {
      renderScreenFive({ firstName: '   ' })

      fireEvent.blur(screen.getByLabelText('Your first name'))

      expect(screen.getByText('Please enter your first name')).toBeInTheDocument()
    })
  })

  describe('icon picker', () => {
    it('renders all six icon buttons and marks only the selected icon as pressed', () => {
      renderScreenFive({ selectedIcon: 'icon-saw' })

      const iconButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')
      )

      expect(iconButtons).toHaveLength(6)
      expect(screen.getByRole('button', { name: /saw/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(iconButtons.filter((button) => button.getAttribute('aria-pressed') === 'true'))
        .toHaveLength(1)
    })

    it('calls setSelectedIcon and trackIconSelect when an icon is clicked', () => {
      renderScreenFive()

      fireEvent.click(screen.getByRole('button', { name: /hammer/i }))

      expect(mockSetSelectedIcon).toHaveBeenCalledWith('icon-hammer')
      expect(mockTrackIconSelect).toHaveBeenCalledWith('icon-hammer')
    })
  })

  describe('task tags', () => {
    it('displays selected tile titles as read-only chips', () => {
      renderScreenFive()

      expect(screen.getByText('Your skills')).toBeInTheDocument()
      expect(screen.getAllByText('Framing').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Roofing').length).toBeGreaterThan(0)
      expect(screen.queryByText('Go back to pick your tasks')).not.toBeInTheDocument()
    })

    it('shows the fallback text when no tiles are selected', () => {
      renderScreenFive({ selectedTiles: [] })

      expect(screen.getByText('Your skills')).toBeInTheDocument()
      expect(screen.getByText('Go back to pick your tasks')).toBeInTheDocument()
    })
  })

  describe('preview', () => {
    it('renders the live preview with placeholder name copy when the name is empty', () => {
      renderScreenFive()

      expect(screen.getByText('Live Preview')).toBeInTheDocument()
      expect(screen.getByText('Your Name')).toBeInTheDocument()
      expect(screen.getByText('Career Explorer')).toBeInTheDocument()
    })
  })

  describe('download', () => {
    it('keeps the download button disabled when the name is empty', () => {
      renderScreenFive({ firstName: '', selectedIcon: 'icon-hammer' })

      expect(screen.getByRole('button', { name: /download your card/i })).toBeDisabled()
    })

    it('keeps the download button disabled when no icon is selected', () => {
      renderScreenFive({ firstName: 'Ava', selectedIcon: null })

      expect(screen.getByRole('button', { name: /download your card/i })).toBeDisabled()
    })

    it('enables the download button when both the name and icon are present', () => {
      renderScreenFive({ firstName: 'Ava', selectedIcon: 'icon-hammer' })

      expect(screen.getByRole('button', { name: /download your card/i })).toBeEnabled()
    })

    it('generates the PNG, triggers the download anchor flow, and swaps into the saved state', async () => {
      const onNext = vi.fn()
      const appendSpy = vi.spyOn(document.body, 'appendChild')
      const removeSpy = vi.spyOn(document.body, 'removeChild')
      const anchorClickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => {})

      renderScreenFive(
        {
          firstName: ' Ava ',
          selectedIcon: 'icon-hammer',
          selectedTiles: ['task-framing', 'task-roofing'],
        },
        { onNext }
      )

      fireEvent.click(screen.getByRole('button', { name: /download your card/i }))

      await waitFor(() => {
        expect(mockGenerateCardPng).toHaveBeenCalledWith({
          name: 'Ava',
          iconEmoji: '🔨',
          taskLabels: ['Framing', 'Roofing'],
          gradientVariant: getGradientVariant(['task-framing', 'task-roofing']),
        })
      })

      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1)
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-card')
      expect(mockSetGeneratedCardUrl).toHaveBeenCalledWith('blob:mock-card')
      expect(mockTrackCardDownload).toHaveBeenCalledTimes(1)
      expect(anchorClickSpy).toHaveBeenCalledTimes(1)

      const appendedAnchor = appendSpy.mock.calls
        .map(([node]) => node)
        .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
      expect(appendedAnchor).toBeDefined()
      if (!appendedAnchor) {
        throw new Error('Expected the download flow to append an anchor element')
      }
      expect(appendedAnchor.tagName).toBe('A')
      expect(appendedAnchor.href).toBe('blob:mock-card')
      expect(appendedAnchor.download).toBe('carpenter-card.png')
      expect(removeSpy).toHaveBeenCalledWith(appendedAnchor)

      await waitFor(() => {
        expect(screen.getByText('Your card is saved!')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      expect(onNext).toHaveBeenCalledTimes(1)
      expect(screen.queryByRole('button', { name: /download your card/i })).not.toBeInTheDocument()
    })
  })
})
