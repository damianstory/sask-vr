import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostVRPage from '@/app/post-vr/page'
import { trackChecklistCheck } from '@/lib/analytics'

vi.mock('@/lib/analytics', () => ({
  trackChecklistCheck: vi.fn(),
}))

vi.mock('@/content/config', () => ({
  content: {
    postVr: {
      congratsHeading: 'Nice work!',
      congratsSubtext: 'You explored a day in the life of a carpenter.',
      checklistHeading: 'Your myBlueprint tasks',
      checklist: [
        { id: 'check-1', label: 'Favourite the career' },
        { id: 'check-2', label: 'Complete the survey' },
        { id: 'check-3', label: 'Favourite a program' },
        { id: 'check-4', label: 'Add portfolio artifacts' },
        { id: 'check-5', label: 'Set a goal' },
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

function getChecklistSection() {
  return screen.getByRole('region', { name: 'Your myBlueprint tasks' })
}

function getProgressCounter(count: number) {
  return screen.getByText((_, element) => element?.textContent === `${count} of 6 complete`)
}

describe('PostVRPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checklist step content by default and hides reflections', () => {
    render(<PostVRPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Nice work!' })).toBeInTheDocument()
    expect(screen.getByText('You explored a day in the life of a carpenter.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open myBlueprint' })).toBeInTheDocument()
    expect(screen.getByText('1 of 2')).toBeInTheDocument()

    const checklistSection = getChecklistSection()
    expect(within(checklistSection).getAllByRole('checkbox')).toHaveLength(6)
    expect(screen.queryByText('I can describe a carpenter workday.')).not.toBeInTheDocument()
  })

  it('starts with checklist items unchecked and next disabled', () => {
    render(<PostVRPage />)

    screen.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('aria-checked', 'false')
    })

    expect(screen.getByRole('button', { name: /go to next screen/i })).toBeDisabled()
  })

  it('toggles checklist items, updates progress, and enables next after one selection', async () => {
    const user = userEvent.setup()
    render(<PostVRPage />)

    const checklistSection = getChecklistSection()
    const item = within(checklistSection).getByRole('checkbox', { name: /favourite the career/i })
    const nextButton = screen.getByRole('button', { name: /go to next screen/i })

    expect(getProgressCounter(0)).toBeInTheDocument()
    expect(nextButton).toBeDisabled()

    await user.click(item)
    expect(item).toHaveAttribute('aria-checked', 'true')
    expect(getProgressCounter(1)).toBeInTheDocument()
    expect(nextButton).toBeEnabled()

    await user.click(item)
    expect(item).toHaveAttribute('aria-checked', 'false')
    expect(getProgressCounter(0)).toBeInTheDocument()
    expect(nextButton).toBeDisabled()
  })

  it('moves to reflection step after a checklist selection and preserves checklist state when going back', async () => {
    const user = userEvent.setup()
    render(<PostVRPage />)

    const checklistItem = within(getChecklistSection()).getByRole('checkbox', {
      name: /favourite the career/i,
    })

    await user.click(checklistItem)
    await user.click(screen.getByRole('button', { name: /go to next screen/i }))

    expect(screen.getByRole('heading', { level: 1, name: 'I Can Statements' })).toBeInTheDocument()
    expect(screen.getByText('Check off what feels true.')).toBeInTheDocument()
    expect(screen.getByText('2 of 2')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /go to next screen/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(8)

    await user.click(screen.getByRole('button', { name: /go to previous screen/i }))

    const persistedChecklistItem = within(getChecklistSection()).getByRole('checkbox', {
      name: /favourite the career/i,
    })
    expect(persistedChecklistItem).toHaveAttribute('aria-checked', 'true')
    expect(getProgressCounter(1)).toBeInTheDocument()
  })

  it('toggles reflections independently on step 2 and does not affect checklist progress', async () => {
    const user = userEvent.setup()
    render(<PostVRPage />)

    await user.click(within(getChecklistSection()).getByRole('checkbox', { name: /favourite the career/i }))
    await user.click(screen.getByRole('button', { name: /go to next screen/i }))

    const reflection = screen.getByRole('checkbox', {
      name: /i can describe a carpenter workday/i,
    })

    await user.click(reflection)
    expect(reflection).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('button', { name: /go to previous screen/i }))
    expect(getProgressCounter(1)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /go to next screen/i }))
    expect(
      screen.getByRole('checkbox', { name: /i can describe a carpenter workday/i })
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('tracks analytics only when checklist items are checked', async () => {
    const user = userEvent.setup()
    render(<PostVRPage />)

    const checklistItem = within(getChecklistSection()).getByRole('checkbox', {
      name: /favourite the career/i,
    })

    await user.click(checklistItem)
    expect(trackChecklistCheck).toHaveBeenCalledTimes(1)
    expect(trackChecklistCheck).toHaveBeenCalledWith('check-1', 'Favourite the career')

    await user.click(checklistItem)
    expect(trackChecklistCheck).toHaveBeenCalledTimes(1)

    await user.click(checklistItem)
    await user.click(screen.getByRole('button', { name: /go to next screen/i }))
    await user.click(screen.getByRole('checkbox', { name: /i can describe a carpenter workday/i }))
    expect(trackChecklistCheck).toHaveBeenCalledTimes(2)
  })

  it('renders the CTA link before the checklist section on step 1', () => {
    render(<PostVRPage />)

    const cta = screen.getByRole('link', { name: 'Open myBlueprint' })
    const checklistSection = getChecklistSection()

    expect(cta).toHaveAttribute('href', 'https://www.myblueprint.ca')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(
      cta.compareDocumentPosition(checklistSection) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
