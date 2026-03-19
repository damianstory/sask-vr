import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

import PreVrPage from '@/app/pre-vr/page'

describe('Pre-VR Flow - Screen Navigation (FLOW-01)', () => {
  it('renders screen 1 on initial load', () => {
    render(<PreVrPage />)
    expect(screen.getByText('1 of 6')).toBeInTheDocument()
  })

  it('navigates forward when Next is clicked', () => {
    render(<PreVrPage />)
    const nextButton = screen.getByLabelText('Go to next screen')
    fireEvent.click(nextButton)
    expect(screen.getByText('2 of 6')).toBeInTheDocument()
  })

  it('navigates backward when Back is clicked', () => {
    render(<PreVrPage />)
    const nextButton = screen.getByLabelText('Go to next screen')
    fireEvent.click(nextButton) // go to screen 2
    const backButton = screen.getByLabelText('Go to previous screen')
    fireEvent.click(backButton)
    expect(screen.getByText('1 of 6')).toBeInTheDocument()
  })
})

describe('Pre-VR Flow - Navigation Bounds (FLOW-02)', () => {
  it('disables Back button on screen 1', () => {
    render(<PreVrPage />)
    const backButton = screen.getByLabelText('Go to previous screen')
    expect(backButton).toBeDisabled()
  })

  it('hides Next button on screen 6', () => {
    render(<PreVrPage />)
    // Click Next 5 times to reach screen 6
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText('Go to next screen'))
    }
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()
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
    fireEvent.click(screen.getByLabelText('Go to next screen'))
    const slideLeft = container.querySelector('.animate-slide-left')
    expect(slideLeft).not.toBeNull()
  })

  it('applies slide-right animation on backward navigation', () => {
    const { container } = render(<PreVrPage />)
    fireEvent.click(screen.getByLabelText('Go to next screen')) // forward to 2
    fireEvent.click(screen.getByLabelText('Go to previous screen')) // back to 1
    const slideRight = container.querySelector('.animate-slide-right')
    expect(slideRight).not.toBeNull()
  })
})
