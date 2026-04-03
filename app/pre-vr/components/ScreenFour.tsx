'use client'

import { useState, useEffect } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'
import { trackPathwayExpand } from '@/lib/analytics'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

const data = content.screenFour

export default function ScreenFour() {
  const reduced = useReducedMotion()
  const [expandedStepId, setExpandedStepId] = useState<string | null>(
    data.steps[0]?.id ?? null
  )
  const [animateBars, setAnimateBars] = useState(false)

  const toggleStep = (stepId: string) => {
    const isExpanding = expandedStepId !== stepId
    setExpandedStepId((prev) => (prev === stepId ? null : stepId))
    if (isExpanding) {
      const step = data.steps.find((s) => s.id === stepId)
      if (step) trackPathwayExpand(step.id, step.title)
    }
  }

  // Trigger head start bar animation when step-2 expands
  const headStartStepId = data.steps.find((s) => s.details.headStart)?.id
  useEffect(() => {
    if (expandedStepId !== headStartStepId) {
      setAnimateBars(false)
      return
    }
    if (reduced) {
      setAnimateBars(true)
      return
    }
    const raf = requestAnimationFrame(() => {
      setTimeout(() => setAnimateBars(true), 150)
    })
    return () => cancelAnimationFrame(raf)
  }, [expandedStepId, headStartStepId, reduced])

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Your Pathway
        </p>
        <h2
          data-screen-heading
          className="mt-4 text-center text-[28px] font-[800] leading-[1.15] text-[var(--myb-navy)] md:text-[40px]"
        >
          {data.heading}
        </h2>
        <p className="mt-3 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
          {data.subtext}
        </p>
      </div>

      <div className="mt-8 w-full">
        {data.steps.map((step, index) => {
          const isExpanded = expandedStepId === step.id
          const isFirst = index === 0
          const isLast = index === data.steps.length - 1

          return (
            <div key={step.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  aria-expanded={isExpanded}
                  className={cn(
                    'relative z-10 flex items-center justify-center rounded-full',
                    'focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
                    isFirst
                      ? 'h-12 w-12 bg-[var(--myb-primary-blue)] text-white animate-pulse-dot'
                      : isExpanded
                        ? 'h-11 w-11 bg-[var(--myb-navy-light)] text-white'
                        : 'h-11 w-11 border-2 border-[var(--myb-neutral-3)] bg-white text-[var(--myb-navy)]'
                  )}
                >
                  <span className="text-[14px] font-[800]">{index + 1}</span>
                </button>

                {!isLast && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[32px]',
                      index < 1
                        ? 'bg-[var(--myb-primary-blue)]'
                        : 'border-l-2 border-dashed border-[var(--myb-neutral-3)]'
                    )}
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  aria-expanded={isExpanded}
                  className={cn(
                    'w-full rounded-[var(--radius-card)] border p-5 text-left transition-all duration-[var(--motion-medium)]',
                    isExpanded
                      ? 'border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)] shadow-[var(--shadow-card-hover)]'
                      : 'border-[var(--myb-neutral-2)] bg-white hover:-translate-y-0.5 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[20px] font-[800] leading-[1.3] text-[var(--myb-navy)] md:text-[24px]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                        {step.subtitle}
                      </p>
                    </div>
                    <span className="rounded-[var(--radius-pill)] bg-white px-3 py-1 text-[12px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-primary-blue)]">
                      {isExpanded ? 'Open' : 'View'}
                    </span>
                  </div>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-b-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-5 pb-5 pt-4">
                      <p className="text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
                        {step.details.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {step.details.duration && (
                          <span className="rounded-[var(--radius-pill)] bg-white px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                            {step.details.duration}
                          </span>
                        )}
                        {step.details.earnings && (
                          <span className="rounded-[var(--radius-pill)] bg-white px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                            {step.details.earnings}
                          </span>
                        )}
                        {step.details.programs?.map((prog) => (
                          <span
                            key={prog}
                            className="rounded-[var(--radius-pill)] bg-white px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>

                      {step.details.courses &&
                        step.details.courses.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                              Courses: {step.details.courses.join(', ')}
                            </p>
                          </div>
                        )}

                      {step.details.headStart && step.details.headStart.length > 0 && (() => {
                        const totalHours = step.details.headStart!.reduce((sum, p) => sum + p.hours, 0)
                        return (
                          <div
                            className="mt-4 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-white px-4 py-4"
                            aria-label={`Head start hours: ${totalHours} total`}
                          >
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                              {step.details.headStart!.map((p) => (
                                <div key={p.program} className="flex items-center gap-2">
                                  <span
                                    className={cn(
                                      'inline-block h-2.5 w-2.5 rounded-full',
                                      step.details.headStart!.indexOf(p) === 0
                                        ? 'bg-[var(--myb-primary-blue)]'
                                        : 'bg-[var(--myb-navy-light)]'
                                    )}
                                  />
                                  <span className="text-[13px] font-[800] text-[var(--myb-navy)]">
                                    {p.program}
                                  </span>
                                  <span className="text-[13px] font-[800] text-[var(--myb-primary-blue)]">
                                    {p.hours} hrs
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="h-[6px] w-full overflow-hidden rounded-full bg-[var(--myb-neutral-1)]">
                              <div className="flex h-full">
                                {step.details.headStart!.map((p, idx) => (
                                  <div
                                    key={p.program}
                                    className={cn(
                                      'h-full',
                                      idx === 0
                                        ? 'bg-[var(--myb-primary-blue)]'
                                        : 'bg-[var(--myb-navy-light)]',
                                      !reduced && 'transition-[width] duration-[600ms] ease-out'
                                    )}
                                    style={{
                                      width: animateBars
                                        ? `${(p.hours / totalHours) * 100}%`
                                        : reduced
                                          ? `${(p.hours / totalHours) * 100}%`
                                          : '0%',
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="mt-3 border-t border-[var(--myb-neutral-2)] pt-3">
                              <span className="text-[18px] font-[800] text-[var(--myb-navy)]">
                                ~{totalHours} hours
                              </span>
                              <span className="ml-2 text-[12px] font-[300] text-[var(--myb-neutral-4)]">
                                before your first official day of work
                              </span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
