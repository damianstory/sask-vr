'use client'

import { useState, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'
import { trackPathwayExpand } from '@/lib/analytics'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.careerPathway
const lastStepId = data.steps[data.steps.length - 1]?.id

export default function ScreenFour({ onComplete }: { onComplete?: () => void }) {
  const [activeStepId, setActiveStepId] = useState<string>(data.steps[0]?.id ?? '')
  const completedRef = useRef(false)

  const activeStep = data.steps.find((step) => step.id === activeStepId) ?? data.steps[0]

  const selectStep = useCallback((stepId: string) => {
    if (stepId === activeStepId) return
    const step = data.steps.find((item) => item.id === stepId)
    if (!step) return
    setActiveStepId(stepId)
    trackPathwayExpand(step.id, step.title)

    if (stepId === lastStepId && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [activeStepId, onComplete])

  const activeIndex = data.steps.findIndex((step) => step.id === activeStep.id)
  const totalHours = activeStep.details.headStart?.reduce((sum, p) => sum + p.hours, 0) ?? 0

  return (
    <PreVRScreenShell
      eyebrow="Your Pathway"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      <div className="flex h-full min-h-0 flex-col justify-center gap-4">
        <div className="grid grid-cols-5 gap-2">
          {data.steps.map((step, index) => {
            const isActive = step.id === activeStep.id
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => selectStep(step.id)}
                aria-expanded={isActive}
                aria-controls={`pathway-step-panel-${step.id}`}
                className={cn(
                  'flex flex-col rounded-[var(--radius-card)] border px-3 py-3 text-left transition-all duration-[var(--motion-medium)]',
                  isActive
                    ? 'border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)] shadow-[var(--shadow-card-hover)]'
                    : 'border-[var(--myb-neutral-2)] bg-white hover:border-[var(--myb-primary-blue)]'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--myb-navy)] text-[12px] font-[800] text-white">
                  {index + 1}
                </div>
                <div className="mt-3 min-h-[36px] text-[12px] font-[800] leading-[1.35] text-[var(--myb-navy)]">
                  {step.title}
                </div>
                <div className="mt-1 h-[18px]">
                  {step.optional && (
                    <span className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--myb-neutral-4)]">
                      Optional
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div
          id={`pathway-step-panel-${activeStep.id}`}
          className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
                Step {activeIndex + 1}
                {activeStep.optional && (
                  <span className="ml-2 rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-2 py-0.5 text-[10px] font-[600] normal-case tracking-[0.08em] text-[var(--myb-neutral-4)]">
                    Optional
                  </span>
                )}
              </p>
              <h3 className="mt-3 text-[26px] font-[800] leading-[1.1] text-[var(--myb-navy)]">
                {activeStep.title}
              </h3>
              <p className="mt-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                {activeStep.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeStep.details.duration && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-3 py-1 text-[13px] font-[800] text-[var(--myb-navy)]">
                  {activeStep.details.duration}
                </span>
              )}
              {activeStep.details.earnings && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-3 py-1 text-[13px] font-[800] text-[var(--myb-navy)]">
                  {activeStep.details.earnings}
                </span>
              )}
            </div>
          </div>

          <p className="mt-5 text-[16px] font-[300] leading-[1.7] text-[var(--myb-neutral-5)]">
            {activeStep.details.description}
          </p>

          {activeStep.details.programs && activeStep.details.programs.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeStep.details.programs.map((program) => (
                <span
                  key={program}
                  className="rounded-[var(--radius-pill)] bg-white px-3 py-1 text-[13px] font-[800] text-[var(--myb-navy)] ring-1 ring-[var(--myb-neutral-2)]"
                >
                  {program}
                </span>
              ))}
            </div>
          )}

          {activeStep.details.courses && activeStep.details.courses.length > 0 && (
            <p className="mt-4 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              Courses: {activeStep.details.courses.join(', ')}
            </p>
          )}

          {activeStep.details.headStart && activeStep.details.headStart.length > 0 && (
            <div
              className="mt-5 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-[var(--myb-light-blue-soft)] p-4"
              aria-label={`Head start hours: ${totalHours} total`}
            >
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {activeStep.details.headStart.map((program, index) => (
                  <div key={program.program} className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-block h-2.5 w-2.5 rounded-full',
                        index === 0 ? 'bg-[var(--myb-primary-blue)]' : 'bg-[var(--myb-navy-light)]'
                      )}
                    />
                    <span className="text-[13px] font-[800] text-[var(--myb-navy)]">
                      {program.program}
                    </span>
                    <span className="text-[13px] font-[800] text-[var(--myb-primary-blue)]">
                      {program.hours} hrs
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-white">
                <div className="flex h-full">
                  {activeStep.details.headStart.map((program, index) => (
                    <div
                      key={program.program}
                      className={cn(
                        'h-full',
                        index === 0 ? 'bg-[var(--myb-primary-blue)]' : 'bg-[var(--myb-navy-light)]'
                      )}
                      style={{ width: `${(program.hours / totalHours) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                <span className="font-[800] text-[var(--myb-navy)]">~{totalHours} hours</span> before your first official day of work
              </p>
            </div>
          )}
        </div>
      </div>
    </PreVRScreenShell>
  )
}
