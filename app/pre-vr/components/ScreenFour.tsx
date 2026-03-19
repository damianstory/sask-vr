'use client'

import { useState } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'

const data = content.screenFour

export default function ScreenFour() {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(
    data.steps[0]?.id ?? null
  )

  const toggleStep = (stepId: string) => {
    setExpandedStepId((prev) => (prev === stepId ? null : stepId))
  }

  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 w-full max-w-[640px]">
        {data.steps.map((step, index) => {
          const isExpanded = expandedStepId === step.id
          const isFirst = index === 0
          const isLast = index === data.steps.length - 1

          return (
            <div key={step.id} className="relative flex gap-4">
              {/* Left column: node + connecting line */}
              <div className="flex flex-col items-center">
                {/* Step node button */}
                <button
                  onClick={() => toggleStep(step.id)}
                  aria-expanded={isExpanded}
                  className={cn(
                    'relative z-10 flex items-center justify-center rounded-full',
                    'focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]',
                    isFirst
                      ? 'h-12 w-12 bg-[var(--myb-primary-blue)] text-white animate-pulse-dot'
                      : isLast
                        ? 'h-10 w-10 bg-[var(--myb-navy-light)] text-white'
                        : 'h-10 w-10 border-2 border-[var(--myb-neutral-3)] bg-white'
                  )}
                >
                  <span className="text-[14px] font-[800]">{index + 1}</span>
                </button>

                {/* Connecting line */}
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

              {/* Right column: title + expandable content */}
              <div className="flex-1 pb-8">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full text-left"
                >
                  <h3 className="text-[20px] font-[800] leading-[1.3] text-[var(--myb-navy)] md:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                    {step.subtitle}
                  </p>
                </button>

                {/* Expandable content with grid-template-rows transition */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pt-3">
                      {/* Description */}
                      <p className="text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
                        {step.details.description}
                      </p>

                      {/* Badges row */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {step.details.duration && (
                          <span className="rounded-full bg-[var(--myb-light-blue)] px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                            {step.details.duration}
                          </span>
                        )}
                        {step.details.earnings && (
                          <span className="rounded-full bg-[var(--myb-light-blue)] px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                            {step.details.earnings}
                          </span>
                        )}
                        {step.details.programs?.map((prog) => (
                          <span
                            key={prog}
                            className="rounded-full bg-[var(--myb-light-blue)] px-3 py-1 text-[14px] font-[800] text-[var(--myb-navy)]"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>

                      {/* Courses list */}
                      {step.details.courses &&
                        step.details.courses.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                              Courses: {step.details.courses.join(', ')}
                            </p>
                          </div>
                        )}
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
