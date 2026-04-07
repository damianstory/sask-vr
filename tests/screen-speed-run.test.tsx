import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('@/content/config', () => ({
  content: {
    speedRun: {
      heading: 'The carpenter fast track',
      subtext: 'See how the carpenter path builds from first paycheck to running your own crew.',
      disclaimer: 'Values are illustrative estimates.',
      carpenter: {
        milestones: [
          { year: 0, label: 'Starts apprenticeship', value: '$0 debt' },
          { year: 1, label: 'Earning 60%', value: '$38K/yr' },
          { year: 4, label: 'Red Seal certified', value: '$67K/yr' },
        ],
      },
      university: { milestones: [] },
    },
  },
}))

import ScreenSpeedRun from '@/app/pre-vr/components/ScreenSpeedRun'

describe('ScreenSpeedRun', () => {
  it('renders without crashing', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders heading, subtext, and disclaimer', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('The carpenter fast track')).toBeInTheDocument()
    expect(screen.getByText('See how the carpenter path builds from first paycheck to running your own crew.')).toBeInTheDocument()
    expect(screen.getByText('Values are illustrative estimates.')).toBeInTheDocument()
  })

  it('renders only the carpenter track', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Carpenter')).toBeInTheDocument()
    expect(screen.queryByText('University Grad')).not.toBeInTheDocument()
  })

  it('renders the active carpenter milestone label and value', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Starts apprenticeship')).toBeInTheDocument()
    expect(screen.getByText('$0 debt')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(screen.getByText('$38K/yr')).toBeInTheDocument()
  })

  it('advances through milestones with the next control', () => {
    render(<ScreenSpeedRun />)
    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(screen.getByText('Earning 60%')).toBeInTheDocument()
  })

  it('allows direct milestone selection through step dots', () => {
    render(<ScreenSpeedRun />)
    fireEvent.click(screen.getByRole('button', { name: 'Show comparison year 3' }))
    expect(screen.getByText('Red Seal certified')).toBeInTheDocument()
    expect(screen.getByText('$67K/yr')).toBeInTheDocument()
  })

  it('does not call onComplete on mount', () => {
    const onComplete = vi.fn()

    render(<ScreenSpeedRun onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('calls onComplete the first time the last milestone is reached', () => {
    const onComplete = vi.fn()

    render(<ScreenSpeedRun onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not call onComplete repeatedly after the last milestone has been reached', () => {
    const onComplete = vi.fn()

    render(<ScreenSpeedRun onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: 'Show comparison year 3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show previous comparison year' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show comparison year 3' }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
