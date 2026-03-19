import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Import after mocks are set up
import Page from '@/app/page'

describe('Landing Page', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders two path selection buttons', () => {
    render(<Page />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('displays Pre-VR and Post-VR card text', () => {
    render(<Page />)
    expect(screen.getByText(/about to do VR/i)).toBeInTheDocument()
    expect(screen.getByText(/just finished VR/i)).toBeInTheDocument()
  })

  it('navigates to /pre-vr when Pre-VR card is clicked (LAND-01)', () => {
    render(<Page />)
    const preVrButton = screen.getByLabelText(/pre-vr/i)
    fireEvent.click(preVrButton)
    expect(mockPush).toHaveBeenCalledWith('/pre-vr')
  })

  it('navigates to /post-vr when Post-VR card is clicked (LAND-01)', () => {
    render(<Page />)
    const postVrButton = screen.getByLabelText(/post-vr/i)
    fireEvent.click(postVrButton)
    expect(mockPush).toHaveBeenCalledWith('/post-vr')
  })

  it('has aria-labels on both cards', () => {
    render(<Page />)
    expect(screen.getByLabelText(/pre-vr/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/post-vr/i)).toBeInTheDocument()
  })
})
