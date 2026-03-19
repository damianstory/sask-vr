import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenFour from '@/app/pre-vr/components/ScreenFour'

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    screenFour: {
      heading: 'Your career pathway',
      subtext: 'From school to skilled trades.',
      steps: [
        { id: 'step-1', title: 'Grade 7/8', subtitle: 'You are here', details: { description: 'Explore trades in school.' } },
        { id: 'step-2', title: 'High School', subtitle: 'Miller Collegiate', details: { description: 'Take shop classes.', courses: ['Woodworking 10'] } },
        { id: 'step-3', title: 'Post-Secondary', subtitle: 'SaskPolytech', details: { description: 'Apprenticeship program.', duration: '4 years' } },
        { id: 'step-4', title: 'Journeyperson', subtitle: 'Certified', details: { description: 'Fully certified carpenter.', earnings: '$28-42/hr' } },
        { id: 'step-5', title: 'Master Carpenter', subtitle: 'Expert', details: { description: 'Lead projects and mentor.' } },
      ],
    },
  },
}))

describe('ScreenFour', () => {
  describe('timeline', () => {
    it.todo('renders all five timeline steps') // PATH-01
    it.todo('first step has pulse animation class') // PATH-01
    it.todo('connecting lines are visible between steps') // PATH-01
  })

  describe('expand', () => {
    it.todo('first step is expanded by default') // PATH-02
    it.todo('clicking a collapsed step expands it') // PATH-02
    it.todo('expanded step shows description text') // PATH-02
  })

  describe('accordion', () => {
    it.todo('expanding one step collapses the previously expanded step') // PATH-03
    it.todo('each step button has aria-expanded attribute') // PATH-03
  })
})
