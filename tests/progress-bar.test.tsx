import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProgressBar from '@/components/ProgressBar'

describe('ProgressBar (FLOW-03)', () => {
  it('renders correct number of dots', () => {
    const { container } = render(<ProgressBar current={1} total={6} />)
    const dots = container.querySelectorAll('.rounded-full')
    expect(dots.length).toBe(6)
  })

  it('displays current of total text', () => {
    render(<ProgressBar current={3} total={6} />)
    expect(screen.getByText('3 of 6')).toBeInTheDocument()
  })

  it('has progressbar role with aria attributes', () => {
    render(<ProgressBar current={2} total={6} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '2')
    expect(progressbar).toHaveAttribute('aria-valuemax', '6')
  })

  it('applies pulse animation class to current dot only', () => {
    const { container } = render(<ProgressBar current={3} total={6} />)
    const dots = container.querySelectorAll('.rounded-full')
    // Current dot (index 2) should have pulse class
    expect(dots[2].className).toContain('animate-pulse-dot')
    // Other dots should not
    expect(dots[0].className).not.toContain('animate-pulse-dot')
    expect(dots[4].className).not.toContain('animate-pulse-dot')
  })

  it('fills completed and current dots with primary blue', () => {
    const { container } = render(<ProgressBar current={3} total={6} />)
    const dots = container.querySelectorAll('.rounded-full')
    // Dots 1-3 (indices 0-2) should be primary blue
    for (let i = 0; i < 3; i++) {
      expect(dots[i].className).toContain('myb-primary-blue')
    }
    // Dots 4-6 (indices 3-5) should be neutral
    for (let i = 3; i < 6; i++) {
      expect(dots[i].className).toContain('myb-neutral-3')
    }
  })
})
