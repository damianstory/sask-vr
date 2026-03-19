import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenSix from '@/app/pre-vr/components/ScreenSix'

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    screenSix: {
      heading: 'Get ready for VR',
      subtext: 'Keep these in mind during the simulation.',
      prompts: [
        { id: 'prompt-1', text: 'What tools do you notice being used?' },
        { id: 'prompt-2', text: 'What safety equipment do workers wear?' },
        { id: 'prompt-3', text: 'What part of the job looks most interesting?' },
      ],
    },
  },
}))

describe('ScreenSix', () => {
  describe('prompts', () => {
    it.todo('renders all observation prompt cards') // PREP-01
    it.todo('prompt text is visible for each card') // PREP-01
    it.todo('no interactive elements exist (read-only)') // PREP-04
  })
})
