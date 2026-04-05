import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  trackTinyHouseDownload: vi.fn(),
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
    taskRanking: {
      heading: 'What sounds fun?',
      subtext: 'Pick the tasks that interest you most.',
      instruction: 'Drag to rank from most to least interesting',
      reveal: { heading: "Here's how your ranking compares", subtext: 'See how your interests line up with actual job time.' },
      tiles: [
        { id: 'task-framing', title: 'Framing', description: 'Build the skeleton', emoji: '\u{1F528}', illustrationPath: '', weight: 20 },
        { id: 'task-measuring', title: 'Measuring', description: 'Measure twice', emoji: '\u{1F4CF}', illustrationPath: '', weight: 14 },
        { id: 'task-finishing', title: 'Finishing', description: 'Install trim', emoji: '\u{1FA9A}', illustrationPath: '', weight: 14 },
        { id: 'task-concrete', title: 'Concrete', description: 'Pour foundations', emoji: '\u{1F9F1}', illustrationPath: '', weight: 16 },
        { id: 'task-roofing', title: 'Roofing', description: 'Keep buildings protected', emoji: '\u{1F3E0}', illustrationPath: '', weight: 14 },
        { id: 'task-renovation', title: 'Renovation', description: 'Transform spaces', emoji: '\u{1F527}', illustrationPath: '', weight: 10 },
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
      checklistHeading: 'What to do next',
      checklist: [
        { id: 'check-1', label: 'Talk to your teacher about trades' },
        { id: 'check-2', label: 'Visit the SaskPolytech website' },
        { id: 'check-3', label: 'Ask a family member about their job' },
        { id: 'check-4', label: 'Try building something at home' },
        { id: 'check-5', label: 'Research carpenter salaries' },
        { id: 'check-6', label: 'Open myBlueprint' },
      ],
      myblueprintLink: {
        url: 'https://www.myblueprint.ca',
        label: 'Open myBlueprint',
      },
    },
  },
}))

// Mock SessionContext for ScreenTwo
vi.mock('@/context/SessionContext', () => ({
  useSession: () => ({
    shuffledTileOrder: ['task-framing', 'task-measuring', 'task-finishing', 'task-concrete', 'task-roofing', 'task-renovation'],
    setShuffledTileOrder: vi.fn(),
    rankedTiles: [],
    setRankedTiles: vi.fn(),
    rankingSubmitted: false,
    setRankingSubmitted: vi.fn(),
    rankingScore: null,
    setRankingScore: vi.fn(),
  }),
}))

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))

// Mock @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: vi.fn(),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
}))

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    setNodeRef: vi.fn(),
    attributes: {},
    listeners: {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  arrayMove: (arr: unknown[], from: number, to: number) => {
    const result = [...arr]
    const [item] = result.splice(from, 1)
    result.splice(to, 0, item)
    return result
  },
}))

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}))

// ── Imports (after mocks) ──────────────────────────────────────────────────

import ScreenOne from '@/app/pre-vr/components/ScreenSalary'
import ScreenTwo from '@/app/pre-vr/components/ScreenTaskRanking'
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

  it('ScreenTwo has no WCAG violations', async () => {
    const { container } = render(<ScreenTwo />)
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
})

// ── ARIA attribute verification ────────────────────────────────────────────

describe('ARIA attributes', () => {
  it('ScreenTwo ranking items have accessible move buttons', () => {
    render(<ScreenTwo />)
    // Each sortable item should have up and down buttons with aria-labels
    const moveUpButtons = screen.getAllByLabelText(/Move .+ up/)
    const moveDownButtons = screen.getAllByLabelText(/Move .+ down/)
    expect(moveUpButtons).toHaveLength(6)
    expect(moveDownButtons).toHaveLength(6)
  })

  it('ScreenFour step buttons have aria-expanded attribute', () => {
    render(<ScreenFour />)
    // First step expanded, rest collapsed -- check both states exist
    const expandedButtons = screen.getAllByRole('button', { expanded: true })
    const collapsedButtons = screen.getAllByRole('button', { expanded: false })
    expect(expandedButtons.length).toBeGreaterThanOrEqual(1)
    expect(collapsedButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('PostVR checklist items have role="checkbox" with aria-checked', () => {
    render(<PostVRPage />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(6)
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('aria-checked', 'false')
    })
  })
})
