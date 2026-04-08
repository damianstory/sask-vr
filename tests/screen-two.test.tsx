import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/context/SessionContext', () => ({
  useSession: () => ({}),
}))

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}))

import ScreenTaskRanking from '@/app/pre-vr/components/ScreenTaskRanking'

describe('ScreenTaskRanking (job infographic)', () => {
  it('renders heading', () => {
    render(<ScreenTaskRanking />)
    expect(
      screen.getByRole('heading', { name: /what do carpenters do on the job/i })
    ).toBeInTheDocument()
  })

  it('renders infographic image with alt text', () => {
    render(<ScreenTaskRanking />)
    expect(
      screen.getByRole('img', { name: /infographic showing carpenter job duties/i })
    ).toBeInTheDocument()
  })

  it('accepts onComplete prop without error', () => {
    const onComplete = vi.fn()
    expect(() => render(<ScreenTaskRanking onComplete={onComplete} />)).not.toThrow()
  })
})
