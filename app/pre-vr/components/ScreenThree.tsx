'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import FocusTrap from 'focus-trap-react'
import { content } from '@/content/config'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { trackEmployerTap } from '@/lib/analytics'

const REGINA_CENTER: [number, number] = [-104.6189, 50.4452]
const ZOOM_LEVEL = 11
const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const data = content.screenThree

export default function ScreenThree() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const pinRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)

  const closeCard = useCallback(() => setSelectedEmployer(null), [])

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_STYLE,
      center: REGINA_CENTER,
      zoom: ZOOM_LEVEL,
      interactive: false,
      attributionControl: false,
    })

    // Disable all interactions explicitly as well
    map.scrollZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.touchZoomRotate.disable()
    map.keyboard.disable()

    // Add employer pin markers
    data.employers.forEach((employer) => {
      const el = document.createElement('button')
      el.className =
        'flex h-10 w-10 items-center justify-center rounded-full bg-[var(--myb-primary-blue)] text-white shadow-md transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]'
      el.style.border = 'none'
      el.style.cursor = 'pointer'
      el.style.padding = '0'
      el.style.minWidth = '44px'
      el.style.minHeight = '44px'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.setAttribute('aria-label', `View ${employer.name}`)

      // Pin icon SVG
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

      pinRefs.current.set(employer.id, el)

      el.addEventListener('click', () => {
        trackEmployerTap(employer.id, employer.name)
        setSelectedEmployer(employer.id)
      })

      new maplibregl.Marker({ element: el })
        .setLngLat([employer.pinPosition.lng, employer.pinPosition.lat])
        .addTo(map)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])


  const employer = selectedEmployer
    ? data.employers.find((e) => e.id === selectedEmployer)
    : null

  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 data-screen-heading className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      {/* Map container */}
      <div className="relative mt-6 w-full max-w-lg">
        <div
          ref={mapContainerRef}
          className="h-[280px] w-full overflow-hidden rounded-xl md:h-[400px] lg:h-[500px]"
        />

        {/* Employer card */}
        {employer && (
          <FocusTrap
            active={true}
            focusTrapOptions={{
              onDeactivate: closeCard,
              escapeDeactivates: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: true,
              setReturnFocus: () => pinRefs.current.get(selectedEmployer!) || document.body,
            }}
          >
            <div>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-40 bg-black/20"
                onClick={closeCard}
                aria-hidden="true"
              />

              {/* Card */}
              <div
                role="dialog"
                aria-labelledby="employer-card-name"
                aria-modal="true"
                className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[320px] rounded-t-xl bg-white p-4 shadow-[0_8px_24px_rgba(34,34,76,0.12)] animate-[scale-fade-in_250ms_ease-out_both] md:absolute md:bottom-4 md:left-4 md:right-auto md:rounded-xl"
              >
                {/* Close button */}
                <button
                  onClick={closeCard}
                  aria-label="Close employer card"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--myb-neutral-1)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>

                {/* Logo placeholder */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--myb-light-blue)] text-[20px] font-[800] text-[var(--myb-navy)]">
                  {employer.name.charAt(0)}
                </div>

                {/* Company name */}
                <h3
                  id="employer-card-name"
                  className="mt-3 text-[20px] font-[800] text-[var(--myb-navy)] md:text-[24px]"
                >
                  {employer.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-[14px] font-[300] text-[var(--myb-neutral-5)]">
                  {employer.description}
                </p>

                {/* Employee count */}
                <p className="mt-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                  {employer.employeeCount} employees
                </p>

                {/* Optional quote */}
                {employer.quote && (
                  <p className="mt-2 text-[14px] font-[300] italic text-[var(--myb-neutral-4)]">
                    &ldquo;{employer.quote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </FocusTrap>
        )}
      </div>
    </section>
  )
}
