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

type Employer = (typeof data.employers)[number]

/* ── helpers ────────────────────────────────────────────────────── */

function updatePinAppearance(el: HTMLElement, isActive: boolean) {
  el.style.transform = isActive ? 'scale(1.15)' : ''
  el.style.boxShadow = isActive
    ? '0 0 0 4px rgba(0, 102, 255, 0.3)'
    : ''
  el.style.transition = 'transform 200ms ease, box-shadow 200ms ease'
}

/* ── shared inner content (no close button, no container) ─────── */

function EmployerCardContent({
  employer,
  nameId,
}: {
  employer: Employer
  nameId: string
}) {
  return (
    <>
      <div className="flex items-start gap-4">
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
          <h3
            id={nameId}
            className="mt-2 text-[22px] font-[800] leading-[1.1] text-[var(--myb-navy)]"
          >
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
    </>
  )
}

/* ── close button (shared markup, each wrapper renders its own) ── */

function CloseButton({
  ref,
  onClick,
}: {
  ref?: React.RefObject<HTMLButtonElement | null>
  onClick: () => void
}) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      aria-label="Close employer card"
      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--myb-neutral-4)] transition-colors hover:bg-[var(--myb-neutral-1)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
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
  )
}

/* ── main component ──────────────────────────────────────────────── */

export default function ScreenThree() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const pinRefs = useRef<Map<string, HTMLElement>>(new Map())
  const desktopCloseRef = useRef<HTMLButtonElement>(null)
  const mobileCloseRef = useRef<HTMLButtonElement>(null)
  const lastPinRef = useRef<string | null>(null)
  const prevSelectedRef = useRef<string | null>(null)
  const wasKeyboardRef = useRef(false)
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)

  const closeCard = useCallback(() => setSelectedEmployer(null), [])

  /* ── pin highlight effect ─────────────────────────────────────── */
  useEffect(() => {
    // deactivate previous pin
    if (prevSelectedRef.current) {
      const prevEl = pinRefs.current.get(prevSelectedRef.current)
      if (prevEl) updatePinAppearance(prevEl, false)
    }
    // activate new pin
    if (selectedEmployer) {
      const newEl = pinRefs.current.get(selectedEmployer)
      if (newEl) updatePinAppearance(newEl, true)
    }
    prevSelectedRef.current = selectedEmployer
  }, [selectedEmployer])

  /* ── focus management on open ─────────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer) return

    const isMobile = window.matchMedia('(max-width: 767.98px)').matches

    if (wasKeyboardRef.current || isMobile) {
      // keyboard open or mobile: focus close button
      const closeRef = isMobile ? mobileCloseRef : desktopCloseRef
      closeRef.current?.focus()
    }
    // mouse open on desktop: leave focus on pin (do nothing)
  }, [selectedEmployer])

  /* ── focus return on close ────────────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer && lastPinRef.current) {
      const pin = pinRefs.current.get(lastPinRef.current)
      if (pin) pin.focus()
      lastPinRef.current = null
    }
  }, [selectedEmployer])

  /* ── escape key ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCard()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [selectedEmployer, closeCard])

  /* ── click-outside (mobile only) ──────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer) return

    const isMobile = window.matchMedia('(max-width: 767.98px)').matches
    if (!isMobile) return // don't attach on desktop

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

  /* ── map setup ────────────────────────────────────────────────── */
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

      el.addEventListener('click', (e) => {
        trackEmployerTap(employer.id, employer.name)
        wasKeyboardRef.current = e.detail === 0
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

  /* ── desktop panel (rendered via headerSlot) ──────────────────── */
  const desktopPanel = employer ? (
    <aside
      aria-labelledby="employer-desktop-name"
      className="relative mt-6 hidden max-h-[calc(100dvh-280px)] overflow-y-auto rounded-[28px] border border-white/20 bg-white/96 p-5 shadow-[var(--shadow-card-dialog)] backdrop-blur-[var(--glass-blur)] animate-panel-fade-in md:block"
    >
      <CloseButton ref={desktopCloseRef} onClick={closeCard} />
      <div key={selectedEmployer} className="animate-content-fade-in">
        <EmployerCardContent
          employer={employer}
          nameId="employer-desktop-name"
        />
      </div>
      <hr className="my-4 border-[var(--myb-neutral-1)]" />
      <p className="text-center text-xs text-[var(--myb-neutral-3)]">
        Tap another pin to explore more employers
      </p>
    </aside>
  ) : null

  return (
    <PreVRScreenShell
      eyebrow="Local Employers"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="min-h-0"
      subtextClassName={
        selectedEmployer
          ? 'md:opacity-0 md:max-h-0 md:overflow-hidden md:transition-all md:duration-200 motion-reduce:md:transition-none'
          : 'md:opacity-100 md:max-h-24 md:transition-all md:duration-200 motion-reduce:md:transition-none'
      }
      headerSlot={desktopPanel}
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

        {/* mobile bottom sheet */}
        {employer && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[color:rgba(33,47,68,0.45)] backdrop-blur-[2px] md:hidden"
              aria-hidden="true"
            />

            <div
              id="employer-card"
              role="dialog"
              aria-labelledby="employer-mobile-name"
              aria-modal="true"
              className="fixed bottom-4 left-4 right-4 z-50 rounded-[28px] border border-white/20 bg-white/96 p-5 shadow-[var(--shadow-card-dialog)] animate-[scale-fade-in_250ms_ease-out_both] md:hidden"
            >
              <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-[var(--myb-neutral-1)]" />
              <CloseButton ref={mobileCloseRef} onClick={closeCard} />
              <div key={selectedEmployer} className="mt-3 animate-content-fade-in">
                <EmployerCardContent
                  employer={employer}
                  nameId="employer-mobile-name"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </PreVRScreenShell>
  )
}
