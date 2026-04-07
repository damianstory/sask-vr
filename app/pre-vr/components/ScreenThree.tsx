'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { trackEmployerTap } from '@/lib/analytics'
import PreVRScreenShell from './PreVRScreenShell'

const REGINA_CENTER: [number, number] = [-104.6189, 50.4452]
const ZOOM_LEVEL = 11
const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const data = content.employerMap

export default function ScreenThree() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const pinRefs = useRef<Map<string, HTMLElement>>(new Map())
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastPinRef = useRef<string | null>(null)
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)

  const closeCard = useCallback(() => setSelectedEmployer(null), [])

  useEffect(() => {
    if (selectedEmployer && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [selectedEmployer])

  useEffect(() => {
    if (!selectedEmployer) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCard()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [selectedEmployer, closeCard])

  useEffect(() => {
    if (!selectedEmployer) return
    let listening = false
    const rafId = requestAnimationFrame(() => {
      listening = true
    })
    const handler = (e: MouseEvent) => {
      if (!listening) return
      const card = document.getElementById('employer-card')
      if (card && !card.contains(e.target as Node)) {
        closeCard()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousedown', handler)
    }
  }, [selectedEmployer, closeCard])

  useEffect(() => {
    if (!selectedEmployer && lastPinRef.current) {
      const pin = pinRefs.current.get(lastPinRef.current)
      if (pin) pin.focus()
      lastPinRef.current = null
    }
  }, [selectedEmployer])

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

    map.scrollZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.touchZoomRotate.disable()
    map.keyboard.disable()

    data.employers.forEach((employer) => {
      const el = document.createElement('button')
      el.className =
        'flex h-10 w-10 items-center justify-center rounded-full bg-[var(--myb-primary-blue)] text-white shadow-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]'
      el.style.border = 'none'
      el.style.cursor = 'pointer'
      el.style.padding = '0'
      el.style.minWidth = '44px'
      el.style.minHeight = '44px'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.setAttribute('aria-label', `View ${employer.name}`)

      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

      pinRefs.current.set(employer.id, el)

      el.addEventListener('click', () => {
        trackEmployerTap(employer.id, employer.name)
        lastPinRef.current = employer.id
        setSelectedEmployer(employer.id)
      })

      new maplibregl.Marker({ element: el })
        .setLngLat([employer.pinPosition.lng, employer.pinPosition.lat])
        .addTo(map)
    })

    if (data.employers.length >= 2) {
      const bounds = new maplibregl.LngLatBounds()
      data.employers.forEach((emp) => {
        bounds.extend([emp.pinPosition.lng, emp.pinPosition.lat])
      })
      map.fitBounds(bounds, { padding: 60, maxZoom: 12 })
    }

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
    <PreVRScreenShell
      eyebrow="Local Employers"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="min-h-0"
    >
      <div className="relative h-full min-h-[420px] overflow-hidden rounded-[32px] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-3 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:min-h-0 md:flex-1 md:p-4">
        <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-[var(--radius-pill)] bg-white/92 px-4 py-2 shadow-[var(--shadow-float)]">
          <span className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
            Regina Employers
          </span>
        </div>
        <div
          ref={mapContainerRef}
          className="h-full w-full overflow-hidden rounded-[28px] bg-[var(--myb-light-blue-soft)]"
        />

        {employer && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[color:rgba(33,47,68,0.45)] backdrop-blur-[2px] md:absolute"
              aria-hidden="true"
            />

            <div
              id="employer-card"
              role="dialog"
              aria-labelledby="employer-card-name"
              aria-modal="true"
              className="fixed bottom-4 left-4 right-4 z-50 rounded-[28px] border border-white/20 bg-white/96 p-5 shadow-[var(--shadow-card-dialog)] animate-[scale-fade-in_250ms_ease-out_both] md:absolute md:bottom-5 md:left-auto md:right-5 md:top-5 md:w-[min(340px,calc(100%-2.5rem))]"
            >
              <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-[var(--myb-neutral-1)] md:hidden" />
              <button
                ref={closeButtonRef}
                onClick={closeCard}
                aria-label="Close employer card"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--myb-neutral-4)] transition-colors hover:bg-[var(--myb-neutral-1)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <div className="mt-3 flex items-start gap-4 md:mt-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[var(--myb-light-blue-soft)] text-[22px] font-[800] text-[var(--myb-primary-blue)] shadow-[var(--shadow-float)]">
                  {employer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.22em] text-[var(--myb-primary-blue)]">
                    Featured Employer
                  </p>
                  {employer.specialty && (
                    <span className="mt-1 inline-flex rounded-[var(--radius-pill)] bg-[var(--myb-primary-blue)]/10 px-3 py-1 text-[11px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
                      {employer.specialty}
                    </span>
                  )}
                  <h3 id="employer-card-name" className="mt-2 text-[22px] font-[800] leading-[1.1] text-[var(--myb-navy)]">
                    {employer.name}
                  </h3>
                  <p className="mt-3 text-[14px] font-[300] leading-[1.65] text-[var(--myb-neutral-5)]">
                    {employer.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-4 py-3">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-primary-blue)]">
                    Team Size
                  </p>
                  <p className="mt-1 text-[18px] font-[800] text-[var(--myb-navy)]">
                    {employer.employeeCount} employees
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-4 py-3">
                  <p className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-primary-blue)]">
                    Region
                  </p>
                  <p className="mt-1 text-[18px] font-[800] text-[var(--myb-navy)]">
                    Regina Area
                  </p>
                </div>
              </div>

              {employer.quote && (
                <div className="mt-5 rounded-[var(--radius-card)] border-l-4 border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)] px-4 py-3">
                  <p className="text-[13px] font-[300] italic leading-[1.65] text-[var(--myb-neutral-4)]">
                    &ldquo;{employer.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PreVRScreenShell>
  )
}
