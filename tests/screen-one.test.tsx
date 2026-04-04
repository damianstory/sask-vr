import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenOne from '@/app/pre-vr/components/ScreenOne'

// Mock content module
vi.mock('@/content/config', () => ({
  content: {
    salaryHook: {
      hookQuestion: 'How much does a carpenter in Saskatchewan actually make?',
      salary: { amount: 67000, label: 'Average Annual Salary', source: 'Government of Canada Job Bank, NOC 72310 — Regina Region', seasonalityNote: '53% work year-round  ·  Average 41 weeks/year even for seasonal workers' },
      stats: [
        { value: '1,590', label: 'Job Openings by 2029', eyebrow: 'Opportunity' },
        { value: '23%', label: 'Retiring by 2034', eyebrow: 'Demand' },
        { value: '37%', label: 'Run Their Own Business', eyebrow: 'Entrepreneurship' },
        { value: '12.4%', label: 'Indigenous Workers in SK Construction', eyebrow: 'Representation' },
      ],
    },
  },
}))

describe('ScreenOne', () => {
  describe('salary counter', () => {
    it.todo('renders salary amount from content data') // HOOK-01
    it.todo('displays dollar sign and comma formatting') // HOOK-01
    it.todo('contains odometer digit columns with translateY') // HOOK-01
  })

  describe('stat-cards', () => {
    it.todo('renders all stat cards from content data') // HOOK-02
    it.todo('stat cards have staggered animation delay') // HOOK-02
  })

  describe('reduced-motion', () => {
    it.todo('shows final salary immediately when prefers-reduced-motion is set') // HOOK-04
    it.todo('stat cards have no animation class when reduced motion is active') // HOOK-04
  })
})
