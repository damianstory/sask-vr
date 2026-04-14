'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { trackEmployerTap } from '@/lib/analytics'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'
import PreVRScreenShell from './PreVRScreenShell'

const REGINA_CENTER: [number, number] = [-104.6189, 50.4452]
const ZOOM_LEVEL = 11
const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

const data = content.employerMap

type Employer = (typeof data.employers)[number]

/* ── marker ref type ───────────────────────────────────────────── */

type MarkerRef = { button: HTMLButtonElement; icon: HTMLSpanElement }

/* ── marker helpers ────────────────────────────────────────────── */

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`

function getMarkerIconSvg(isVisited: boolean): string {
  return isVisited ? CHECK_SVG : PIN_SVG
}

function getMarkerAriaLabel(name: string, isVisited: boolean): string {
  return isVisited ? `Viewed ${name}` : `View ${name}`
}

function applyMarkerVisualState(
  ref: MarkerRef,
  isVisited: boolean,
  isActive: boolean,
) {
  // icon span: SVG swap
  ref.icon.innerHTML = getMarkerIconSvg(isVisited)

  // icon span: active state (scale + ring)
  ref.icon.style.transform = isActive ? 'scale(1.1)' : ''
  ref.icon.style.boxShadow = isActive
    ? '0 0 0 4px rgba(0, 102, 255, 0.3)'
    : isVisited
      ? '0 0 0 2px rgba(0, 146, 255, 0.25)'
      : ''

  // button: aria-label
  const name = ref.button.dataset.employerName ?? ''
  ref.button.setAttribute('aria-label', getMarkerAriaLabel(name, isVisited))
}

/* ── select employer type ─────────────────────────────────────── */

type SelectEmployer = (
  employerId: string,
  employerName: string,
  triggerEl: HTMLElement | null,
  isKeyboard?: boolean,
) => void

/* ── bounds helper (pure — no refs) ──────────────────────────── */

function fitEmployerBoundsOnMap(map: maplibregl.Map, duration = 250) {
  if (data.employers.length < 2) return
  const bounds = new maplibregl.LngLatBounds()
  data.employers.forEach((emp) => {
    bounds.extend([emp.pinPosition.lng, emp.pinPosition.lat])
  })
  map.fitBounds(bounds, { padding: 60, maxZoom: 12, duration })
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

export default function ScreenThree({
  onComplete,
}: {
  onComplete?: () => void
}) {
  const session = useSession()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markerRefs = useRef<Map<string, MarkerRef>>(new Map())
  const desktopCloseRef = useRef<HTMLButtonElement>(null)
  const mobileCloseRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const wasKeyboardRef = useRef(false)
  const completeFiredRef = useRef(false)
  const selectEmployerRef = useRef<SelectEmployer | null>(null)

  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null)
  const [visitedEmployers, setVisitedEmployers] = useState<Set<string>>(
    () => new Set(session.visitedEmployers),
  )
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const closeCard = useCallback(() => setSelectedEmployer(null), [])

  const selectEmployer = useCallback<SelectEmployer>(
    (employerId, employerName, triggerEl, isKeyboard = false) => {
      trackEmployerTap(employerId, employerName)
      wasKeyboardRef.current = isKeyboard
      lastTriggerRef.current = triggerEl
      setSelectedEmployer(employerId)
      setVisitedEmployers((prev) => {
        if (prev.has(employerId)) return prev
        const next = new Set(prev)
        next.add(employerId)
        return next
      })
      session.markEmployerVisited(employerId)
    },
    [session],
  )

  useEffect(() => {
    selectEmployerRef.current = selectEmployer
  }, [selectEmployer])

  const handleResetMap = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    fitEmployerBoundsOnMap(map, 250)
  }, [])

  /* ── single reconciliation effect for all marker visuals ─────── */
  useEffect(() => {
    for (const [id, ref] of markerRefs.current) {
      applyMarkerVisualState(ref, visitedEmployers.has(id), id === selectedEmployer)
    }
  }, [visitedEmployers, selectedEmployer])

  /* ── disable map marker focus while list is active ───────────── */
  useEffect(() => {
    for (const [, ref] of markerRefs.current) {
      ref.button.tabIndex = viewMode === 'map' ? 0 : -1
    }
  }, [viewMode])

  /* ── onComplete guard ────────────────────────────────────────── */
  useEffect(() => {
    if (completeFiredRef.current) return
    if (visitedEmployers.size === data.employers.length) {
      completeFiredRef.current = true
      onComplete?.()
    }
  }, [visitedEmployers.size, onComplete])

  /* ── focus management on open ─────────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer) return

    const isMobile = window.matchMedia('(max-width: 767.98px)').matches

    if (wasKeyboardRef.current || isMobile) {
      const closeRef = isMobile ? mobileCloseRef : desktopCloseRef
      closeRef.current?.focus()
    }
  }, [selectedEmployer])

  /* ── focus return on close ────────────────────────────────────── */
  useEffect(() => {
    if (!selectedEmployer && lastTriggerRef.current) {
      if (lastTriggerRef.current.isConnected) {
        lastTriggerRef.current.focus()
      }
      lastTriggerRef.current = null
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
    if (!isMobile) return

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
      minZoom: 9,
      maxZoom: 15,
      interactive: false,
      attributionControl: false,
    })

    map.scrollZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.touchZoomRotate.disable()
    map.keyboard.disable()

    data.employers.forEach((employer) => {
      const isVisited = visitedEmployers.has(employer.id)

      // outer button — MapLibre marker root
      const el = document.createElement('button')
      el.type = 'button'
      el.style.border = 'none'
      el.style.cursor = 'pointer'
      el.style.padding = '0'
      el.style.minWidth = '44px'
      el.style.minHeight = '44px'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.borderRadius = '50%'
      el.style.background = 'var(--myb-primary-blue)'
      el.style.color = 'white'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      el.className = 'focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]'
      el.dataset.employerName = employer.name
      el.setAttribute('aria-label', getMarkerAriaLabel(employer.name, isVisited))

      // inner icon span — all visual state changes happen here
      const iconSpan = document.createElement('span')
      iconSpan.style.display = 'flex'
      iconSpan.style.alignItems = 'center'
      iconSpan.style.justifyContent = 'center'
      iconSpan.style.borderRadius = '50%'
      iconSpan.style.transition = 'transform 200ms ease, box-shadow 200ms ease'
      iconSpan.className = 'motion-reduce:!transition-none'
      iconSpan.innerHTML = getMarkerIconSvg(isVisited)

      if (isVisited) {
        iconSpan.style.boxShadow = '0 0 0 2px rgba(0, 146, 255, 0.25)'
      }

      el.appendChild(iconSpan)
      markerRefs.current.set(employer.id, { button: el, icon: iconSpan })

      el.addEventListener('click', (e) => {
        selectEmployerRef.current?.(employer.id, employer.name, el, e.detail === 0)
      })

      new maplibregl.Marker({ element: el })
        .setLngLat([employer.pinPosition.lng, employer.pinPosition.lat])
        .addTo(map)
    })

    mapRef.current = map
    fitEmployerBoundsOnMap(map, 0)

    /* Map stays in normal flow — viewMode toggles never change its
       dimensions. Only real container resizes (window resize, layout
       shift) need a resize() call. */
    const container = mapContainerRef.current!
    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      markerRefs.current.clear()
      lastTriggerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const employer = selectedEmployer
    ? data.employers.find((e) => e.id === selectedEmployer)
    : null

  const allVisited = visitedEmployers.size >= data.employers.length

  /* ── helper text for gating ──────────────────────────────────── */
  const headerMeta = !allVisited ? (
    <p className="mt-2 text-[13px] font-[300] leading-[1.75] text-[var(--myb-neutral-4)]">
      View all 10 employers to continue.
    </p>
  ) : null

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
        Tap another employer to learn more
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
      headerMetaSlot={headerMeta}
      headerSlot={desktopPanel}
    >
      <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[32px] border border-[color:rgba(217,223,234,0.8)] bg-white/90 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:min-h-0 md:flex-1">
        {/* ── toolbar: view toggle ───────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
            View as
          </span>
          <div className="flex gap-1 rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] p-1">
            <button
              type="button"
              aria-pressed={viewMode === 'map'}
              onClick={() => setViewMode('map')}
              className={cn(
                'min-h-[44px] rounded-[var(--radius-pill)] px-5 text-[13px] font-[700] uppercase tracking-[0.12em] transition-colors',
                viewMode === 'map'
                  ? 'bg-[var(--myb-primary-blue)] text-white shadow-sm'
                  : 'text-[var(--myb-primary-blue)] hover:bg-white/60',
              )}
            >
              Map
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              className={cn(
                'min-h-[44px] rounded-[var(--radius-pill)] px-5 text-[13px] font-[700] uppercase tracking-[0.12em] transition-colors',
                viewMode === 'list'
                  ? 'bg-[var(--myb-primary-blue)] text-white shadow-sm'
                  : 'text-[var(--myb-primary-blue)] hover:bg-white/60',
              )}
            >
              List
            </button>
          </div>
        </div>

        {/* ── content area: map + list layers ────────────────────── */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {/* map layer — always in normal flow so dimensions never change */}
          <div
            ref={mapContainerRef}
            aria-hidden={viewMode !== 'map'}
            className={cn(
              'h-full w-full overflow-hidden bg-[var(--myb-light-blue-soft)]',
              viewMode !== 'map' && 'pointer-events-none',
            )}
          />

          {/* zoom controls — map view only */}
          {viewMode === 'map' && (
            <div className="absolute bottom-3 right-3 z-10 flex gap-1 rounded-[var(--radius-pill)] bg-white/92 p-1 shadow-[var(--shadow-float)] md:bottom-4 md:right-4">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => mapRef.current?.zoomIn({ duration: 200 })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--myb-primary-blue)] transition-colors hover:bg-[var(--myb-light-blue-soft)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => mapRef.current?.zoomOut({ duration: 200 })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--myb-primary-blue)] transition-colors hover:bg-[var(--myb-light-blue-soft)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={handleResetMap}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--myb-primary-blue)] transition-colors hover:bg-[var(--myb-light-blue-soft)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
          )}

          {/* list view */}
          {viewMode === 'list' && (
            <div className="absolute inset-0 z-[5] flex flex-col gap-2 overflow-y-auto rounded-[28px] bg-[var(--myb-light-blue-soft)] p-4 pb-24">
              <p className="mb-1 text-[13px] font-[700] text-[var(--myb-neutral-4)]">
                {visitedEmployers.size} of {data.employers.length} viewed
              </p>
              {data.employers.map((emp) => {
                const isVisited = visitedEmployers.has(emp.id)
                const isActive = emp.id === selectedEmployer
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={(e) => selectEmployer(emp.id, emp.name, e.currentTarget)}
                    className={cn(
                      'flex items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3 text-left transition-colors',
                      isActive
                        ? 'border-[var(--myb-primary-blue)] bg-white shadow-[var(--shadow-float)]'
                        : 'border-transparent bg-white/60 hover:bg-white/80',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white',
                        isVisited
                          ? 'bg-[var(--myb-primary-blue)]'
                          : 'bg-[var(--myb-neutral-3)]',
                      )}
                    >
                      {isVisited ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                      ) : (
                        <span className="text-[14px] font-[800]">{emp.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-[700] text-[var(--myb-navy)]">
                        {emp.name}
                      </p>
                      {emp.specialty && (
                        <p className="text-[12px] font-[300] text-[var(--myb-neutral-4)]">
                          {emp.specialty}
                        </p>
                      )}
                    </div>
                    {isVisited && (
                      <span className="shrink-0 text-[11px] font-[700] text-[var(--myb-primary-blue)]">
                        Viewed
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

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
