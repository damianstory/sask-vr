'use client'

import { useState, useEffect } from 'react'
import { content } from '@/content/config'
import { useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.salaryHook
const DETAIL_PANELS: Array<{ id: DetailPanel; label: string }> = [
  { id: 'pay', label: 'Pay' },
  { id: 'market', label: 'Market' },
  { id: 'business', label: 'Own Business' },
]

function formatMoney(n: number, style: 'hourly' | 'annual'): string {
  if (style === 'hourly') return `$${n}/hr`
  return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`
}

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

type DetailPanel = 'pay' | 'market' | 'business'

export default function ScreenSalary() {
  const reduced = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const [detailPanel, setDetailPanel] = useState<DetailPanel>('pay')
  const activePanelIndex = DETAIL_PANELS.findIndex((panel) => panel.id === detailPanel)
  const isFirstPanel = activePanelIndex === 0
  const isLastPanel = activePanelIndex === DETAIL_PANELS.length - 1

  useEffect(() => {
    if (reduced) {
      setIsVisible(true)
      return
    }
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const formattedSalary = data.salary.amount.toLocaleString('en-US')
  const chars = formattedSalary.split('')
  let digitIndex = 0

  const hr = data.hourlyRange
  const ar = data.annualRange
  const se = data.selfEmployment

  return (
    <PreVRScreenShell
      eyebrow="Projected Market Value"
      heading={data.hookQuestion}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      <div className="flex h-full min-h-0 flex-col justify-center gap-4">
        <div className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-4 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-6 py-8 text-center md:px-10 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,146,255,0.18),transparent_50%)]" />
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
              <p className="relative z-10 mt-4 border-t border-[color:rgba(0,146,255,0.2)] pt-4 text-[13px] font-[300] text-[var(--myb-neutral-4)]">
                {data.salary.seasonalityNote}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-4 shadow-[var(--shadow-float)]">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setDetailPanel(DETAIL_PANELS[Math.max(activePanelIndex - 1, 0)].id)}
              disabled={isFirstPanel}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show previous salary detail"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Salary detail panels">
            {DETAIL_PANELS.map((panel) => (
              <button
                key={panel.id}
                type="button"
                onClick={() => setDetailPanel(panel.id as DetailPanel)}
                aria-pressed={detailPanel === panel.id}
                className={cn(
                  'rounded-[var(--radius-pill)] px-4 py-2 text-[13px] font-[800] uppercase tracking-[0.14em] transition-colors',
                  detailPanel === panel.id
                    ? 'bg-[var(--myb-primary-blue)] text-white'
                    : 'bg-[var(--myb-light-blue-soft)] text-[var(--myb-primary-blue)]'
                )}
              >
                {panel.label}
              </button>
            ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setDetailPanel(DETAIL_PANELS[Math.min(activePanelIndex + 1, DETAIL_PANELS.length - 1)].id)
              }
              disabled={isLastPanel}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show next salary detail"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {detailPanel === 'pay' && (
            <div className="mt-4">
              <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-[var(--myb-light-blue)] via-[var(--myb-primary-blue)] to-[var(--myb-navy)]" />
              <div className="mt-4 grid gap-3 text-center sm:auto-rows-fr sm:grid-cols-3">
                {[
                  { hourly: hr.entry, annual: ar.entry, label: 'Entry' },
                  { hourly: hr.median, annual: ar.median, label: 'Median' },
                  { hourly: hr.senior, annual: ar.senior, label: 'Senior' },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className="flex h-full flex-col rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] p-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--myb-neutral-4)]">
                      {tier.label}
                    </div>
                    <div className="mt-2 text-[16px] font-[800] text-[var(--myb-navy)]">
                      {formatMoney(tier.hourly, 'hourly')}
                    </div>
                    <div className="mt-1 text-[13px] font-[300] text-[var(--myb-neutral-4)]">
                      {formatMoney(tier.annual, 'annual')}/yr
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailPanel === 'market' && (
            <div className="mt-4 grid gap-3 sm:auto-rows-fr sm:grid-cols-3">
              {data.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex h-full flex-col rounded-[var(--radius-card)] bg-[var(--myb-navy)] p-4 text-white"
                >
                  <div className="text-[11px] font-[800] uppercase tracking-[0.18em] text-white/65">
                    {stat.eyebrow || `Insight ${i + 1}`}
                  </div>
                  <div className="mt-3 text-[24px] font-[800] leading-none">{stat.value}</div>
                  <div className="mt-2 text-[13px] font-[300] leading-[1.6] text-white/78">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {detailPanel === 'business' && (
            <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--myb-navy)] p-5 text-white">
              <div className="text-[12px] font-[800] uppercase tracking-[0.18em] text-white/65">
                Entrepreneurship
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[40px] font-[800] leading-none">{se.percentage}%</div>
                  <div className="mt-2 text-[14px] font-[300] text-white/78">
                    of carpenters run their own business
                  </div>
                </div>
                <div className="rounded-[var(--radius-pill)] bg-white/15 px-4 py-2 text-center">
                  <span className="text-[18px] font-[800]">{se.potentialEarnings}</span>
                  <span className="ml-1 text-[13px] font-[300] text-white/78">potential</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PreVRScreenShell>
  )
}
