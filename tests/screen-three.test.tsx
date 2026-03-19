import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScreenThree from '@/app/pre-vr/components/ScreenThree'

// Mock maplibre-gl for jsdom (no WebGL)
vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    remove: vi.fn(),
    addControl: vi.fn(),
    scrollZoom: { disable: vi.fn() },
    dragPan: { disable: vi.fn() },
    doubleClickZoom: { disable: vi.fn() },
    touchZoomRotate: { disable: vi.fn() },
    keyboard: { disable: vi.fn() },
  }))
  const Marker = vi.fn().mockImplementation(() => ({
    setLngLat: vi.fn().mockReturnThis(),
    addTo: vi.fn().mockReturnThis(),
    setDOMContent: vi.fn().mockReturnThis(),
    getElement: vi.fn(() => document.createElement('div')),
  }))
  return { default: { Map, Marker }, Map, Marker }
})

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    screenThree: {
      heading: 'Who hires carpenters near you?',
      subtext: 'Tap a pin to learn about real employers.',
      employers: [
        { id: 'employer-a', name: 'Company A', description: 'A construction company', employeeCount: 50, pinPosition: { lng: -104.5917, lat: 50.4509 } },
        { id: 'employer-b', name: 'Company B', description: 'A renovation firm', employeeCount: 30, pinPosition: { lng: -104.6167, lat: 50.4452 } },
      ],
    },
  },
}))

describe('ScreenThree', () => {
  describe('pin', () => {
    it.todo('renders employer pin buttons with aria-labels') // MAP-02
    it.todo('opens employer card when pin is clicked') // MAP-02
  })

  describe('close', () => {
    it.todo('closes employer card when X button is clicked') // MAP-03
    it.todo('closes employer card on Escape key') // MAP-03
    it.todo('closes employer card on backdrop click') // MAP-03
  })
})
