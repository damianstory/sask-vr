import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenFour from '@/app/pre-vr/components/ScreenFour'

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    careerPathway: {
      heading: 'Your career pathway',
      subtext: 'From school to skilled trades.',
      steps: [
        { id: 'step-1', title: 'You are here - Grade 7/8', subtitle: 'Middle School', details: { description: 'Start exploring trades and hands-on projects in your current classes.', courses: ['Industrial Arts', 'Math', 'Science'] } },
        { id: 'step-2', title: 'High School', subtitle: 'Grades 9-12', details: { description: 'Take shop and PAA classes to build skills.', courses: ['Construction 10/20/30', 'Practical & Applied Arts (PAA)', 'Grade 10 Math', 'Grade 10 Science'], duration: '4 years', programs: ['Saskatchewan Youth Apprenticeship (SYA)', 'TASCAP / HCAP construction programs'], headStart: [{ program: 'SYA Program', hours: 300 }, { program: 'HCAP Program', hours: 640 }] } },
        { id: 'step-3', title: 'Post-Secondary', subtitle: 'Technical Training', details: { description: 'A hands-on program covering blueprints, concrete, framing, finishing, and trade math.', duration: '32-week certificate', programs: ['Saskatchewan Polytechnic (Moose Jaw, Prince Albert, Saskatoon)'] } },
        { id: 'step-4', title: 'Apprenticeship', subtitle: 'Earn While You Learn', details: { description: 'Work full-time alongside a certified carpenter and get paid while learning.', duration: '4 years ��� 7,200 hours on the job', earnings: 'Starts at 60% of journeyperson pay, rises to 90%' } },
        { id: 'step-5', title: 'Red Seal Journeyperson', subtitle: 'Certified Carpenter', details: { description: 'Pass the Red Seal exam — the gold standard in Canadian trades.', earnings: '$28-45+/hour' } },
        { id: 'step-6', title: "Bachelor's Degree", subtitle: 'Optional — Management Pathway', details: { description: 'Your Red Seal counts as 2 years of university credit.', duration: '2 additional years', earnings: 'Management and supervisory roles', programs: ['Saskatchewan Polytechnic'] } },
      ],
    },
  },
}))

describe('ScreenFour', () => {
  describe('timeline', () => {
    it.todo('renders all six timeline steps') // PATH-01
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
