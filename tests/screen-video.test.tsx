import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const { mockTrackVideoNavigate } = vi.hoisted(() => ({
  mockTrackVideoNavigate: vi.fn(),
}))

vi.mock('@/content/config', () => ({
  content: {
    videoSnippets: {
      heading: 'See it in action',
      subtext: 'Quick clips of carpentry.',
      videos: [
        { id: 'vid-1', title: 'Framing a wall', youtubeId: 'abc123' },
        { id: 'vid-2', title: 'Pouring concrete', youtubeId: 'def456' },
        { id: 'vid-3', title: 'Finishing trim', youtubeId: 'ghi789' },
      ],
    },
  },
}))

vi.mock('@/lib/analytics', () => ({
  trackVideoNavigate: mockTrackVideoNavigate,
}))

import ScreenVideo from '@/app/pre-vr/components/ScreenVideo'

describe('ScreenVideo', () => {
  it('renders without crashing', () => {
    render(<ScreenVideo />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders heading and subtext', () => {
    render(<ScreenVideo />)
    expect(screen.getByText('See it in action')).toBeInTheDocument()
    expect(screen.getByText('Quick clips of carpentry.')).toBeInTheDocument()
  })

  it('renders inside the fit shell layout', () => {
    render(<ScreenVideo />)

    const shell = screen
      .getByRole('heading', { level: 2, name: 'See it in action' })
      .closest('[data-prevr-shell="fit"]')

    expect(shell).toBeInTheDocument()
    expect(shell).toHaveClass('h-full', 'min-h-0', 'flex-1')
  })

  it('renders iframe with correct youtube-nocookie src', () => {
    render(<ScreenVideo />)
    const iframe = document.querySelector('iframe')!
    expect(iframe.src).toContain('youtube-nocookie.com/embed/abc123')
    expect(iframe.src).toContain('rel=0')
  })

  it('iframe has loading="lazy" and title attribute', () => {
    render(<ScreenVideo />)
    const iframe = document.querySelector('iframe')!
    expect(iframe.getAttribute('loading')).toBe('lazy')
    expect(iframe.title).toBe('Framing a wall')
  })

  it('iframe src never contains autoplay=1', () => {
    render(<ScreenVideo />)
    const iframe = document.querySelector('iframe')!
    expect(iframe.src).not.toContain('autoplay=1')
  })

  it('left arrow is disabled on first video', () => {
    render(<ScreenVideo />)
    const prevBtn = screen.getByLabelText('Show previous video')
    expect(prevBtn).toBeDisabled()
  })

  it('right arrow is disabled on last video', () => {
    render(<ScreenVideo />)
    const nextBtn = screen.getByLabelText('Show next video')
    // Navigate to last video
    fireEvent.click(nextBtn)
    fireEvent.click(nextBtn)
    expect(nextBtn).toBeDisabled()
  })

  it('clicking next updates iframe src to destination video', () => {
    render(<ScreenVideo />)
    const nextBtn = screen.getByLabelText('Show next video')
    fireEvent.click(nextBtn)

    const iframe = document.querySelector('iframe')!
    expect(iframe.src).toContain('youtube-nocookie.com/embed/def456')
  })

  it('trackVideoNavigate is called with destination video id and direction', () => {
    render(<ScreenVideo />)
    const nextBtn = screen.getByLabelText('Show next video')
    fireEvent.click(nextBtn)

    expect(mockTrackVideoNavigate).toHaveBeenCalledWith('vid-2', 'next')

    const prevBtn = screen.getByLabelText('Show previous video')
    fireEvent.click(prevBtn)

    expect(mockTrackVideoNavigate).toHaveBeenCalledWith('vid-1', 'prev')
  })

  it('focus returns to carousel region after successful navigation', () => {
    render(<ScreenVideo />)
    const region = screen.getByRole('region', { name: 'Video carousel' })
    const nextBtn = screen.getByLabelText('Show next video')

    fireEvent.click(nextBtn)

    expect(document.activeElement).toBe(region)
  })

  it('shows counter text', () => {
    render(<ScreenVideo />)
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('does not call onComplete on mount', () => {
    const onComplete = vi.fn()

    render(<ScreenVideo onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('calls onComplete the first time the last video is reached', () => {
    const onComplete = vi.fn()

    render(<ScreenVideo onComplete={onComplete} />)

    const nextBtn = screen.getByLabelText('Show next video')
    fireEvent.click(nextBtn)
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(nextBtn)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not call onComplete repeatedly after the last video has already been reached', () => {
    const onComplete = vi.fn()

    render(<ScreenVideo onComplete={onComplete} />)

    const nextBtn = screen.getByLabelText('Show next video')
    fireEvent.click(nextBtn)
    fireEvent.click(nextBtn)

    const prevBtn = screen.getByLabelText('Show previous video')
    fireEvent.click(prevBtn)
    fireEvent.click(nextBtn)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
