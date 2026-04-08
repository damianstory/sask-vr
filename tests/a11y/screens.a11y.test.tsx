import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock analytics (added by Plan 01)
vi.mock('@/lib/analytics', () => ({
  trackScreenView: vi.fn(),
  trackPathSelect: vi.fn(),
  trackEmployerTap: vi.fn(),
  trackPathwayExpand: vi.fn(),
  trackStudentNameEntered: vi.fn(),
  trackChecklistCheck: vi.fn(),
  trackVideoNavigate: vi.fn(),
  trackRankingSubmit: vi.fn(),
  trackRankingScore: vi.fn(),
  trackAISortAttempt: vi.fn(),
  trackAISortComplete: vi.fn(),
}))

// Mock content/config with minimal data for each screen
vi.mock('@/content/config', () => ({
  content: {
    salaryHook: {
      hookQuestion: 'How much does a carpenter in Saskatchewan actually make?',
      salary: { amount: 67000, label: 'Median Annual Salary', source: 'Government of Canada Job Bank, NOC 72310 — Regina Region' },
      hourlyRange: { entry: 19, median: 32, senior: 45 },
      annualRange: { entry: 39000, median: 67000, senior: 94000 },
      selfEmployment: { percentage: 37, potentialEarnings: '$80K+' },
      stats: [
        { value: '1,590', label: 'Job Openings by 2029', eyebrow: 'Opportunity' },
        { value: '23%', label: 'Retiring by 2034', eyebrow: 'Demand' },
        { value: '12.4%', label: 'Indigenous Workers in SK Construction', eyebrow: 'Representation' },
      ],
    },
    careerPathway: {
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
    vrPrep: {
      heading: 'Get ready for VR',
      subtext: 'Keep these in mind during the simulation.',
      prompts: [
        { id: 'prompt-1', text: 'What tools do you notice being used?' },
        { id: 'prompt-2', text: 'What safety equipment do workers wear?' },
        { id: 'prompt-3', text: 'What part of the job looks most interesting?' },
      ],
    },
    postVr: {
      congratsHeading: 'Nice work!',
      congratsSubtext: 'You explored a day in the life of a carpenter.',
      checklistHeading: 'Your myBlueprint tasks',
      checklist: [
        { id: 'check-1', label: 'Talk to your teacher about trades' },
        { id: 'check-2', label: 'Visit the SaskPolytech website' },
        { id: 'check-3', label: 'Ask a family member about their job' },
        { id: 'check-4', label: 'Try building something at home' },
        { id: 'check-5', label: 'Research carpenter salaries' },
        { id: 'check-6', label: 'Review the I can statements' },
      ],
      reflectionHeading: 'I Can Statements',
      reflectionSubtext: 'Check off what feels true.',
      reflections: [
        { id: 'reflect-1', statement: 'I can describe a carpenter workday.' },
        { id: 'reflect-2', statement: 'I can name two carpentry tasks.' },
        { id: 'reflect-3', statement: 'I can identify a local employer.' },
        { id: 'reflect-4', statement: 'I can explain the pathway.' },
        { id: 'reflect-5', statement: 'I can name a relevant course.' },
        { id: 'reflect-6', statement: 'I can describe a surprise from VR.' },
        { id: 'reflect-7', statement: 'I can explain current demand.' },
        { id: 'reflect-8', statement: 'I can name a related strength.' },
      ],
      myblueprintLink: {
        url: 'https://www.myblueprint.ca',
        label: 'Open myBlueprint',
      },
    },
  },
}))

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))

vi.mock('@/context/SessionContext', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({}),
}))


// ── Imports (after mocks) ──────────────────────────────────────────────────

import ScreenOne from '@/app/pre-vr/components/ScreenSalary'
import ScreenJobInfographic from '@/app/pre-vr/components/ScreenTaskRanking'
import ScreenFour from '@/app/pre-vr/components/ScreenFour'
import ScreenSix from '@/app/pre-vr/components/ScreenSix'
import PostVRPage from '@/app/post-vr/page'

// ── axe accessibility tests ────────────────────────────────────────────────

describe('Accessibility (axe-core)', () => {
  it('ScreenOne has no WCAG violations', async () => {
    const { container } = render(<ScreenOne />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Job infographic screen has no WCAG violations', async () => {
    const { container } = render(<ScreenJobInfographic />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('ScreenFour has no WCAG violations', async () => {
    const { container } = render(<ScreenFour />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('ScreenSix has no WCAG violations', async () => {
    const { container } = render(<ScreenSix />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('PostVR page has no WCAG violations', async () => {
    const { container } = render(<PostVRPage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('PostVR reflection step has no WCAG violations', async () => {
    const user = userEvent.setup()
    const { container } = render(<PostVRPage />)

    await user.click(screen.getByRole('checkbox', { name: /talk to your teacher about trades/i }))
    await user.click(screen.getByRole('button', { name: /go to next screen/i }))

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

// ── ARIA attribute verification ────────────────────────────────────────────

describe('ARIA attributes', () => {
  it('Job infographic image has descriptive alt text', () => {
    render(<ScreenJobInfographic />)
    const img = screen.getByRole('img', { name: /infographic showing carpenter job duties/i })
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('alt')).not.toBe('')
  })

  it('ScreenFour step buttons have aria-expanded attribute', () => {
    render(<ScreenFour />)
    // First step expanded, rest collapsed -- check both states exist
    const expandedButtons = screen.getAllByRole('button', { expanded: true })
    const collapsedButtons = screen.getAllByRole('button', { expanded: false })
    expect(expandedButtons.length).toBeGreaterThanOrEqual(1)
    expect(collapsedButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('PostVR checklist items on step 1 have role="checkbox" with aria-checked', () => {
    render(<PostVRPage />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(6)
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('aria-checked', 'false')
    })
  })

  it('PostVR reflection items on step 2 have role="checkbox" with aria-checked', async () => {
    const user = userEvent.setup()
    render(<PostVRPage />)

    await user.click(screen.getByRole('checkbox', { name: /talk to your teacher about trades/i }))
    await user.click(screen.getByRole('button', { name: /go to next screen/i }))

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(8)
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('aria-checked', 'false')
    })
  })
})
