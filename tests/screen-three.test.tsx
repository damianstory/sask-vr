import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScreenThree from '@/app/pre-vr/components/ScreenThree'

// Mock maplibre-gl for jsdom (no WebGL)
vi.mock('maplibre-gl', () => {
  const Map = vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    remove: vi.fn(),
    addControl: vi.fn(),
    fitBounds: vi.fn(),
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
  const LngLatBounds = vi.fn().mockImplementation(() => ({
    extend: vi.fn().mockReturnThis(),
  }))
  return { default: { Map, Marker, LngLatBounds }, Map, Marker, LngLatBounds }
})

// Mock content
vi.mock('@/content/config', () => ({
  content: {
    employerMap: {
      heading: 'Who hires carpenters near you?',
      subtext: 'Tap a pin to learn about real employers.',
      employers: [
        { id: 'employer-pcl', name: 'PCL Construction', description: 'One of the largest construction companies in North America.', employeeCount: 4500, specialty: 'Commercial & Institutional', pinPosition: { lng: -104.6025, lat: 50.4671 } },
        { id: 'employer-graham', name: 'Graham Construction', description: 'An employee-owned company specializing in industrial projects.', employeeCount: 2200, specialty: 'Industrial', pinPosition: { lng: -104.5546, lat: 50.4773 } },
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
