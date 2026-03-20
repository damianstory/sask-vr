'use client'

import { useState, useEffect } from 'react'
import { content } from '@/content/config'

const data = content.screenOne

/**
 * Hook to detect prefers-reduced-motion media query.
 */
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

/**
 * Single odometer digit column. Renders 0-9 stacked vertically and scrolls
 * via CSS translateY to the target digit.
 */
function OdometerDigit({
  digit,
  delay,
  animate,
}: {
  digit: number
  delay: number
  animate: boolean
}) {
  return (
    <div className="h-[1em] overflow-hidden">
      <div
        className={animate ? 'transition-transform duration-[2000ms] ease-out' : ''}
        style={{
          transform: `translateY(-${digit * 10}%)`,
          ...(animate ? { transitionDelay: `${delay}ms` } : {}),
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[1em] leading-[1em]">
            {n}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScreenOne() {
  const reduced = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (reduced) {
      setIsVisible(true)
      return
    }
    // Trigger animation after mount
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  // Format salary as string with commas (e.g. "72,000")
  const formattedSalary = data.salary.amount.toLocaleString('en-US')
  const chars = formattedSalary.split('')

  // Track digit index for stagger delay (skip commas)
  let digitIndex = 0

  return (
    <section className="flex flex-col items-center px-4 py-8">
      {/* Hook question heading */}
      <h2 data-screen-heading className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.hookQuestion}
      </h2>

      {/* Odometer salary counter */}
      <div
        className="mt-8 flex items-baseline text-[48px] font-[800] leading-[1] text-[var(--myb-navy)] md:text-[56px] lg:text-[64px]"
        aria-label={`$${formattedSalary}`}
        role="text"
      >
        <span>$</span>
        {chars.map((char, i) => {
          if (char === ',') {
            return (
              <span key={i} className="h-[1em] leading-[1em]">
                ,
              </span>
            )
          }
          const d = parseInt(char, 10)
          const idx = digitIndex++
          return (
            <OdometerDigit
              key={i}
              digit={isVisible ? d : 0}
              delay={idx * 50}
              animate={!reduced}
            />
          )
        })}
      </div>

      {/* Source attribution */}
      <p className="mt-3 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
        {data.salary.source}
      </p>

      {/* Stat badge cards */}
      <div className="mt-8 flex w-full max-w-lg flex-col gap-3 md:flex-row md:gap-4">
        {data.stats.map((stat, i) => {
          const delay = reduced ? 0 : 2300 + i * 200

          return (
            <div
              key={i}
              className={`flex-1 rounded-xl bg-[var(--myb-navy)] p-4 text-white ${
                reduced ? '' : 'animate-stat-fade-in opacity-0'
              }`}
              style={reduced ? undefined : { animationDelay: `${delay}ms` }}
            >
              <div className="text-[20px] font-[800] md:text-[24px]">
                {stat.value}
              </div>
              <div className="text-[14px] font-[300]">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
