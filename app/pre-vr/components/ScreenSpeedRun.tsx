'use client'

import { useState, useEffect, useRef } from 'react'
import { content } from '@/content/config'
import { useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const data = content.speedRun

const maxVisible = Math.max(
  data.carpenter.milestones.length,
  data.university.milestones.length,
)

interface MilestoneProps {
  milestone: { year: number; label: string; value: string }
  visible: boolean
  reduced: boolean
  isLast: boolean
}

function Milestone({ milestone, visible, reduced, isLast }: MilestoneProps) {
  return (
    <div
      className={cn(
        'relative flex gap-3 pb-6',
        reduced
          ? ''
          : 'transition-all duration-[400ms]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 shrink-0 rounded-full bg-[var(--myb-primary-blue)]" />
        {!isLast && (
          <div className="w-px flex-1 bg-[var(--myb-neutral-2)]" />
        )}
      </div>

      {/* Content */}
      <div className="-mt-0.5">
        <p className="text-[12px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-primary-blue)]">
          Year {milestone.year}
        </p>
        <p className="mt-1 text-[14px] font-[300] leading-[1.5] text-[var(--myb-neutral-5)]">
          {milestone.label}
        </p>
        <p className="mt-0.5 text-[16px] font-[800] text-[var(--myb-navy)]">
          {milestone.value}
        </p>
      </div>
    </div>
  )
}

export default function ScreenSpeedRun() {
  const reduced = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(reduced ? maxVisible : 0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // When reduced motion is active, skip animation entirely.
    // The setInterval callback uses the functional updater which
    // clamps at maxVisible, so we just don't start it.
    if (reduced) return

    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1
        if (next >= maxVisible && intervalRef.current !== null) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return next
      })
    }, 400)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [reduced])

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Career Comparison
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

      <div className="mx-auto mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Carpenter column */}
        <div>
          <h3 className="mb-4 text-[16px] font-[800] text-[var(--myb-navy)]">
            Carpenter
          </h3>
          {data.carpenter.milestones.map((m, i) => (
            <Milestone
              key={m.year}
              milestone={m}
              visible={reduced || i < visibleCount}
              reduced={reduced}
              isLast={i === data.carpenter.milestones.length - 1}
            />
          ))}
        </div>

        {/* University column */}
        <div>
          <h3 className="mb-4 text-[16px] font-[800] text-[var(--myb-navy)]">
            University Grad
          </h3>
          {data.university.milestones.map((m, i) => (
            <Milestone
              key={m.year}
              milestone={m}
              visible={reduced || i < visibleCount}
              reduced={reduced}
              isLast={i === data.university.milestones.length - 1}
            />
          ))}
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] font-[300] text-[var(--myb-neutral-3)]">
        {data.disclaimer}
      </p>
    </section>
  )
}
