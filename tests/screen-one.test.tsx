import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ScreenSalary from '@/app/pre-vr/components/ScreenSalary'

// Mock content module
vi.mock('@/content/config', () => ({
  content: {
    salaryHook: {
      hookQuestion: 'How much does a carpenter in Saskatchewan actually make?',
      salary: {
        amount: 67000,
        label: 'Median Annual Salary',
        source: 'Government of Canada Job Bank, NOC 72310 — Regina Region',
        seasonalityNote: '53% work year-round  ·  Average 41 weeks/year even for seasonal workers',
      },
      hourlyRange: { entry: 19, median: 32, senior: 45 },
      annualRange: { entry: 39000, median: 67000, senior: 94000 },
      selfEmployment: { percentage: 37, potentialEarnings: '$80K+' },
      stats: [
        { value: '1,590', label: 'Job Openings by 2029', eyebrow: 'Opportunity' },
        { value: '23%', label: 'Retiring by 2034', eyebrow: 'Demand' },
        { value: '12.4%', label: 'Indigenous Workers in SK Construction', eyebrow: 'Representation' },
      ],
    },
  },
}))

describe('ScreenSalary', () => {
  describe('salary counter', () => {
    it('renders the hero salary with an accessible label', () => {
      render(<ScreenSalary />)
      const salaryEl = screen.getByRole('text')
      expect(salaryEl).toHaveAttribute('aria-label', '$67,000')
    })

    it('renders the source attribution', () => {
      render(<ScreenSalary />)
      expect(screen.getByText(/Government of Canada Job Bank/)).toBeInTheDocument()
    })

    it('renders the seasonality note', () => {
      render(<ScreenSalary />)
      expect(screen.getByText(/53% work year-round/)).toBeInTheDocument()
    })
  })

  describe('range bar', () => {
    it('renders hourly range markers for entry, median, and senior', () => {
      render(<ScreenSalary />)
      expect(screen.getByText('$19/hr')).toBeInTheDocument()
      expect(screen.getByText('$32/hr')).toBeInTheDocument()
      expect(screen.getByText('$45/hr')).toBeInTheDocument()
    })

    it('renders annual range values', () => {
      render(<ScreenSalary />)
      expect(screen.getByText('$39K/yr')).toBeInTheDocument()
      expect(screen.getByText('$67K/yr')).toBeInTheDocument()
      expect(screen.getByText('$94K/yr')).toBeInTheDocument()
    })

    it('renders tier labels', () => {
      render(<ScreenSalary />)
      expect(screen.getByText('Entry')).toBeInTheDocument()
      expect(screen.getByText('Median')).toBeInTheDocument()
      expect(screen.getByText('Senior')).toBeInTheDocument()
    })
  })

  describe('self-employment callout', () => {
    it('renders the percentage and description', () => {
      render(<ScreenSalary />)
      fireEvent.click(screen.getByRole('button', { name: 'Own Business' }))
      expect(screen.getByText('37%')).toBeInTheDocument()
      expect(screen.getByText(/run their own business/)).toBeInTheDocument()
    })

    it('renders the potential earnings', () => {
      render(<ScreenSalary />)
      fireEvent.click(screen.getByRole('button', { name: 'Own Business' }))
      expect(screen.getByText('$80K+')).toBeInTheDocument()
    })

    it('renders the entrepreneurship eyebrow', () => {
      render(<ScreenSalary />)
      fireEvent.click(screen.getByRole('button', { name: 'Own Business' }))
      expect(screen.getByText('Entrepreneurship')).toBeInTheDocument()
    })
  })

  describe('stat cards', () => {
    it('renders exactly 3 stat cards', () => {
      render(<ScreenSalary />)
      fireEvent.click(screen.getByRole('button', { name: 'Market' }))
      expect(screen.getByText('1,590')).toBeInTheDocument()
      expect(screen.getByText('23%')).toBeInTheDocument()
      expect(screen.getByText('12.4%')).toBeInTheDocument()
    })
  })

  describe('reduced-motion', () => {
    it.todo('shows final salary immediately when prefers-reduced-motion is set')
    it.todo('stat cards have no animation class when reduced motion is active')
  })
})
