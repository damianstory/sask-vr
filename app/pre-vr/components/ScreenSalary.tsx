'use client'

import { useState, useEffect } from 'react'
import { content } from '@/content/config'
import { useReducedMotion } from '@/lib/hooks'

const data = content.salaryHook

/** Format money for display. Hourly: "$32/hr". Annual: "$67K" or "$900". */
function formatMoney(n: number, style: 'hourly' | 'annual'): string {
  if (style === 'hourly') return `$${n}/hr`
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`
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

export default function ScreenSalary() {
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

  // Format salary as string with commas (e.g. "67,000")
  const formattedSalary = data.salary.amount.toLocaleString('en-US')
  const chars = formattedSalary.split('')

  // Track digit index for stagger delay (skip commas)
  let digitIndex = 0

  const hr = data.hourlyRange
  const ar = data.annualRange
  const se = data.selfEmployment

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Projected Market Value
        </p>
        <h2
          data-screen-heading
          className="mt-4 text-center text-[28px] font-[800] leading-[1.15] text-[var(--myb-navy)] md:text-[40px]"
        >
          {data.hookQuestion}
        </h2>
      </div>

      {/* Hero odometer card */}
      <div className="mt-8 rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-8">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-6 py-10 text-center md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,146,255,0.18),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[color:rgba(255,255,255,0.55)] blur-2xl" />

          <div
            className="relative z-10 flex items-baseline justify-center text-[48px] font-[800] leading-[1] text-[var(--myb-navy)] md:text-[56px] lg:text-[64px]"
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

          <p className="relative z-10 mt-4 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
            {data.salary.source}
          </p>

          {data.salary.seasonalityNote && (
            <div
              className={`relative z-10 border-t border-[color:rgba(0,146,255,0.2)] mt-4 pt-4 ${
                reduced ? '' : 'animate-stat-fade-in opacity-0'
              }`}
              style={reduced ? undefined : { animationDelay: '2800ms' }}
            >
              <p className="text-[13px] font-[300] text-[var(--myb-neutral-4)]">
                {data.salary.seasonalityNote}
              </p>
            </div>
          )}
        </div>

        {/* Range bar */}
        <div
          className={`mt-6 ${reduced ? '' : 'animate-stat-fade-in opacity-0'}`}
          style={reduced ? undefined : { animationDelay: '3200ms' }}
        >
          <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-[var(--myb-light-blue)] via-[var(--myb-primary-blue)] to-[var(--myb-navy)]" />
          <div className="mt-3 flex justify-between">
            {[
              { hourly: hr.entry, annual: ar.entry, label: 'Entry' },
              { hourly: hr.median, annual: ar.median, label: 'Median' },
              { hourly: hr.senior, annual: ar.senior, label: 'Senior' },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`flex flex-col items-center ${
                  tier.label === 'Median' ? 'font-[800]' : 'font-[300]'
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--myb-neutral-4)]">
                  {tier.label}
                </span>
                <span className="text-[16px] font-[800] text-[var(--myb-navy)]">
                  {formatMoney(tier.hourly, 'hourly')}
                </span>
                <span className="text-[13px] font-[300] text-[var(--myb-neutral-4)]">
                  {formatMoney(tier.annual, 'annual')}/yr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Self-employment callout */}
      <div
        className={`mt-6 flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--myb-navy)] p-5 text-white shadow-[var(--shadow-float)] sm:flex-row sm:items-center sm:justify-between md:p-6 ${
          reduced ? '' : 'animate-stat-fade-in opacity-0'
        }`}
        style={reduced ? undefined : { animationDelay: '3600ms' }}
      >
        <div>
          <div className="text-[12px] font-[800] uppercase tracking-[0.2em] text-white/65">
            Entrepreneurship
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[36px] font-[800] leading-[1]">{se.percentage}%</span>
            <span className="text-[14px] font-[300] leading-[1.5] text-white/78">
              of carpenters run their own business
            </span>
          </div>
        </div>
        <div className="rounded-[var(--radius-pill)] bg-white/15 px-4 py-2 text-center">
          <span className="text-[18px] font-[800]">{se.potentialEarnings}</span>
          <span className="ml-1 text-[13px] font-[300] text-white/78">potential</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {data.stats.map((stat, i) => {
          const delay = reduced ? 0 : 4000 + i * 200

          return (
            <div
              key={i}
              className={`rounded-[var(--radius-card)] bg-[var(--myb-navy)] p-5 text-white shadow-[var(--shadow-float)] ${
                reduced ? '' : 'animate-stat-fade-in opacity-0'
              }`}
              style={reduced ? undefined : { animationDelay: `${delay}ms` }}
            >
              <div className="text-[12px] font-[800] uppercase tracking-[0.2em] text-white/65">
                {stat.eyebrow || `Insight ${i + 1}`}
              </div>
              <div className="mt-4 text-[22px] font-[800] leading-[1.1] md:text-[28px]">
                {stat.value}
              </div>
              <div className="mt-2 text-[14px] font-[300] leading-[1.7] text-white/78">
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
