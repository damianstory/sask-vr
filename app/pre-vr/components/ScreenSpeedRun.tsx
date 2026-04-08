'use client'

import { useState, useCallback } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.speedRun
const maxVisible = data.carpenter.milestones.length

function milestoneAt<T>(items: T[], index: number): T {
  return items[Math.min(index, items.length - 1)]
}

export default function ScreenSpeedRun({ onComplete }: { onComplete?: () => void }) {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0)
  const [completedInSession, setCompletedInSession] = useState(false)

  const carpenterMilestone = milestoneAt(data.carpenter.milestones, activeMilestoneIndex)
  const isFirst = activeMilestoneIndex === 0
  const isLast = activeMilestoneIndex === maxVisible - 1

  const setMilestoneIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= maxVisible) return

      if (nextIndex === maxVisible - 1 && !completedInSession) {
        onComplete?.()
        setCompletedInSession(true)
      }

      setActiveMilestoneIndex(nextIndex)
    },
    [completedInSession, onComplete],
  )

  return (
    <PreVRScreenShell
      eyebrow="Carpenter Path"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      <div className="flex h-full min-h-0 flex-col justify-center">
        <div className="grid gap-4">
          <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-7">
            <p className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]">
              Carpenter
            </p>
            <div className="mt-5">
              <span className="text-[44px] font-[800] leading-none text-[var(--myb-navy)] md:text-[56px]">
                Year {carpenterMilestone.year}
              </span>
            </div>
            <p className="mt-6 max-w-3xl text-[22px] font-[800] leading-[1.35] text-[var(--myb-navy)] md:text-[28px]">
              {carpenterMilestone.label}
            </p>
            <p className="mt-4 text-[36px] font-[800] leading-none text-[var(--myb-primary-blue)] md:text-[48px]">
              {carpenterMilestone.value}
            </p>
          </section>
        </div>

        <div className="mt-5 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMilestoneIndex(Math.max(activeMilestoneIndex - 1, 0))}
              disabled={isFirst}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show previous comparison year"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex gap-2" aria-label="Comparison milestones">
              {Array.from({ length: maxVisible }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMilestoneIndex(index)}
                  aria-label={`Show comparison year ${index + 1}`}
                  aria-pressed={activeMilestoneIndex === index}
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition-colors',
                    activeMilestoneIndex === index
                      ? 'bg-[var(--myb-primary-blue)]'
                      : 'bg-[var(--myb-neutral-3)]'
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMilestoneIndex(Math.min(activeMilestoneIndex + 1, maxVisible - 1))}
              disabled={isLast}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show next comparison year"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-4 text-center text-[12px] font-[300] text-[var(--myb-neutral-3)]">
            {data.disclaimer}
          </p>
        </div>
      </div>
    </PreVRScreenShell>
  )
}
