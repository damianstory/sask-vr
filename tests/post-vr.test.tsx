import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostVRPage from '@/app/post-vr/page'

// Mock content
vi.mock('@/content/config', () => ({
  content: {
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

describe('PostVRPage', () => {
  describe('checklist', () => {
    it.todo('renders all 6 checklist items') // BRDG-01
    it.todo('each item has role="checkbox"') // BRDG-01
  })

  describe('toggle', () => {
    it.todo('clicking an item toggles its checked state') // BRDG-02
    it.todo('checked items show line-through styling') // BRDG-02
    it.todo('unchecking a checked item removes line-through') // BRDG-02
  })

  describe('progress', () => {
    it.todo('shows "0 of 6 complete" initially') // BRDG-04
    it.todo('updates count when items are checked') // BRDG-04
  })

  describe('myblueprint', () => {
    it.todo('renders myBlueprint link with correct URL') // BRDG-05
    it.todo('link opens in new tab (target="_blank")') // BRDG-05
  })
})
