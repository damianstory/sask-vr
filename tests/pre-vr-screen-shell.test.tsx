import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import PreVRScreenShell from '@/app/pre-vr/components/PreVRScreenShell'

describe('PreVRScreenShell', () => {
  it('renders the shared heading and subtext content', () => {
    render(
      <PreVRScreenShell eyebrow="Video Snippets" heading="See it in action" subtext="Quick clips.">
        <div>Body content</div>
      </PreVRScreenShell>
    )

    expect(screen.getByText('Video Snippets')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'See it in action' })).toBeInTheDocument()
    expect(screen.getByText('Quick clips.')).toBeInTheDocument()
  })

  it('marks the heading for transition focus management', () => {
    render(
      <PreVRScreenShell eyebrow="Video Snippets" heading="See it in action">
        <div>Body content</div>
      </PreVRScreenShell>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('data-screen-heading')
  })

  it('uses fit mode to constrain the shell to the available viewport row', () => {
    render(
      <PreVRScreenShell eyebrow="Video Snippets" heading="See it in action" mode="fit">
        <div>Body content</div>
      </PreVRScreenShell>
    )

    expect(screen.getByText('Body content').closest('[data-prevr-shell="fit"]')).toHaveClass('h-full', 'min-h-0', 'flex-1')
  })

  it('supports internal scrolling when requested', () => {
    render(
      <PreVRScreenShell eyebrow="Video Snippets" heading="See it in action" mode="fit" bodyScroll="auto">
        <div>Body content</div>
      </PreVRScreenShell>
    )

    expect(screen.getByText('Body content').parentElement).toHaveClass('overflow-y-auto', 'overscroll-contain')
  })

  it('supports a split desktop layout', () => {
    render(
      <PreVRScreenShell eyebrow="Video Snippets" heading="See it in action" mode="fit" desktopLayout="split">
        <div>Body content</div>
      </PreVRScreenShell>
    )

    expect(screen.getByText('Body content').closest('.md\\:grid')).toBeInTheDocument()
  })
})
