import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('maplibre-gl', () => {
  const Map = vi.fn(function MockMap() {
    return {
      on: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      fitBounds: vi.fn(),
      scrollZoom: { disable: vi.fn() },
      dragPan: { disable: vi.fn() },
      doubleClickZoom: { disable: vi.fn() },
      touchZoomRotate: { disable: vi.fn() },
      keyboard: { disable: vi.fn() },
    }
  })
  const Marker = vi.fn(function MockMarker() {
    return {
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      setDOMContent: vi.fn().mockReturnThis(),
      getElement: vi.fn(() => document.createElement('div')),
    }
  })
  const LngLatBounds = vi.fn(function MockLngLatBounds() {
    return { extend: vi.fn().mockReturnThis() }
  })
  return { default: { Map, Marker, LngLatBounds }, Map, Marker, LngLatBounds }
})

import PreVrPage from '@/app/pre-vr/page'

describe('Pre-VR Flow - Screen Navigation (FLOW-01)', () => {
  it('renders screen 1 on initial load', () => {
    render(<PreVrPage />)
    expect(screen.getByText('1 of 6')).toBeInTheDocument()
  })

  it('navigates forward when Next is clicked', () => {
    render(<PreVrPage />)
    const nextButton = screen.getByLabelText('Go to next screen')
    fireEvent.click(nextButton)
    expect(screen.getByText('2 of 6')).toBeInTheDocument()
  })

  it('navigates backward when Back is clicked', () => {
    render(<PreVrPage />)
    const nextButton = screen.getByLabelText('Go to next screen')
    fireEvent.click(nextButton) // go to screen 2
    const backButton = screen.getByLabelText('Go to previous screen')
    fireEvent.click(backButton)
    expect(screen.getByText('1 of 6')).toBeInTheDocument()
  })
})

describe('Pre-VR Flow - Navigation Bounds (FLOW-02)', () => {
  it('disables Back button on screen 1', () => {
    render(<PreVrPage />)
    const backButton = screen.getByLabelText('Go to previous screen')
    expect(backButton).toBeDisabled()
  })

  it('hides Next button on screen 6', () => {
    render(<PreVrPage />)
    // Click Next 5 times to reach screen 6
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByLabelText('Go to next screen'))
    }
    expect(screen.queryByLabelText('Go to next screen')).not.toBeInTheDocument()
  })

  it('allows shared Next navigation to reach Screen 5 with zero selected tiles and shows the fallback', async () => {
    render(<PreVrPage />)

    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByLabelText('Go to next screen'))
    }

    const screenFiveHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Make it yours/i,
    })

    expect(screenFiveHeading).toBeInTheDocument()
    expect(screen.getByText('5 of 6')).toBeInTheDocument()
    expect(screen.getByText('Go back to pick your tasks')).toBeInTheDocument()
  })

  it('preserves the seeded Screen 2 task selections when the flow reaches Screen 5', async () => {
    render(<PreVrPage />)

    fireEvent.click(screen.getByLabelText('Go to next screen'))
    expect(screen.getByText('2 of 6')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Framing/i }))
    fireEvent.click(screen.getByRole('button', { name: /Measuring & Layout/i }))
    fireEvent.click(screen.getByRole('button', { name: /Finishing Work/i }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    await waitFor(() => {
      expect(screen.getByText('3 of 6')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Go to next screen'))
    fireEvent.click(screen.getByLabelText('Go to next screen'))

    const screenFiveHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Make it yours/i,
    })

    expect(screenFiveHeading).toBeInTheDocument()
    expect(screen.getAllByText('Framing').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Measuring & Layout').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Finishing Work').length).toBeGreaterThan(0)
    expect(screen.queryByText('Go back to pick your tasks')).not.toBeInTheDocument()
  })

  it('keeps the Screen 2 local CTA disabled below the minimum selection count and advances once two tasks are chosen', async () => {
    render(<PreVrPage />)

    fireEvent.click(screen.getByLabelText('Go to next screen'))
    expect(screen.getByText('2 of 6')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Framing/i }))

    const oneMoreButton = screen.getByRole('button', { name: /Pick 1 more/i })
    expect(oneMoreButton).toBeDisabled()
    fireEvent.click(oneMoreButton)
    expect(screen.getByText('2 of 6')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Measuring & Layout/i }))

    const continueButton = screen.getByRole('button', { name: /Continue/i })
    expect(continueButton).toBeEnabled()
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText('3 of 6')).toBeInTheDocument()
    })
  })
})

describe('Pre-VR Flow - Transitions (FLOW-04)', () => {
  it('does not apply animation class on initial mount', () => {
    const { container } = render(<PreVrPage />)
    const animationWrapper = container.querySelector(
      '.animate-slide-left, .animate-slide-right'
    )
    expect(animationWrapper).toBeNull()
  })

  it('applies slide-left animation on forward navigation', () => {
    const { container } = render(<PreVrPage />)
    fireEvent.click(screen.getByLabelText('Go to next screen'))
    const slideLeft = container.querySelector('.animate-slide-left')
    expect(slideLeft).not.toBeNull()
  })

  it('applies slide-right animation on backward navigation', () => {
    const { container } = render(<PreVrPage />)
    fireEvent.click(screen.getByLabelText('Go to next screen')) // forward to 2
    fireEvent.click(screen.getByLabelText('Go to previous screen')) // back to 1
    const slideRight = container.querySelector('.animate-slide-right')
    expect(slideRight).not.toBeNull()
  })

  it('focuses the Screen 3 heading after the lazy-loaded transition resolves', async () => {
    render(<PreVrPage />)

    fireEvent.click(screen.getByLabelText('Go to next screen'))
    expect(screen.getByText('2 of 6')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Framing/i }))
    fireEvent.click(screen.getByRole('button', { name: /Measuring & Layout/i }))
    fireEvent.click(screen.getByRole('button', { name: /Finishing Work/i }))

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    const screenThreeHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Who hires carpenters near you/i,
    })

    await waitFor(() => {
      expect(screenThreeHeading).toHaveFocus()
    })
  })
})
