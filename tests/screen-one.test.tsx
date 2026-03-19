import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenOne from '@/app/pre-vr/components/ScreenOne'

// Mock content module
vi.mock('@/content/config', () => ({
  content: {
    screenOne: {
      hookQuestion: 'Ever wonder what a carpenter earns?',
      salary: { amount: 72000, label: 'Average Annual Salary', source: 'Saskatchewan Labour Market Information, 2025' },
      stats: [
        { value: '4,200+', label: 'Jobs in Saskatchewan' },
        { value: '12%', label: 'Demand Growth' },
        { value: '350+', label: 'Employers Hiring' },
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
