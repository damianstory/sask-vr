import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('@/content/config', () => ({
  content: {
    speedRun: {
      heading: 'The no-debt speed run',
      subtext: 'Two paths after high school.',
      disclaimer: 'Values are illustrative estimates.',
      carpenter: {
        milestones: [
          { year: 0, label: 'Starts apprenticeship', value: '$0 debt' },
          { year: 1, label: 'Earning 60%', value: '$38K/yr' },
          { year: 4, label: 'Red Seal certified', value: '$67K/yr' },
        ],
      },
      university: {
        milestones: [
          { year: 0, label: 'Starts degree', value: '-$10K debt' },
          { year: 4, label: 'Graduates', value: '-$45K debt' },
          { year: 5, label: 'Entry-level job', value: '$42K/yr' },
        ],
      },
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
    expect(screen.getByText('The no-debt speed run')).toBeInTheDocument()
    expect(screen.getByText('Two paths after high school.')).toBeInTheDocument()
    expect(screen.getByText('Values are illustrative estimates.')).toBeInTheDocument()
  })

  it('renders both track labels', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Carpenter')).toBeInTheDocument()
    expect(screen.getByText('University Grad')).toBeInTheDocument()
  })

  it('renders all milestone labels and values', () => {
    render(<ScreenSpeedRun />)
    expect(screen.getByText('Starts apprenticeship')).toBeInTheDocument()
    expect(screen.getByText('$0 debt')).toBeInTheDocument()
    expect(screen.getByText('Starts degree')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(screen.getByText('-$45K debt')).toBeInTheDocument()
  })

  it('advances through milestones with the next control', () => {
    render(<ScreenSpeedRun />)
    fireEvent.click(screen.getByRole('button', { name: 'Show next comparison year' }))
    expect(screen.getByText('Earning 60%')).toBeInTheDocument()
    expect(screen.getByText('Graduates')).toBeInTheDocument()
  })

  it('allows direct milestone selection through step dots', () => {
    render(<ScreenSpeedRun />)
    fireEvent.click(screen.getByRole('button', { name: 'Show comparison year 3' }))
    expect(screen.getByText('Red Seal certified')).toBeInTheDocument()
    expect(screen.getByText('Entry-level job')).toBeInTheDocument()
  })
})
