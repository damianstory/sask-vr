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

function getLabelTransform(position: number): string {
  if (position <= 15) return 'translateX(0)'
  if (position >= 85) return 'translateX(-100%)'
  return 'translateX(-50%)'
}

type DetailPanel = 'pay' | 'market' | 'business'

export default function ScreenSalary({ onComplete }: { onComplete?: () => void }) {
  const reduced = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const [detailPanel, setDetailPanel] = useState<DetailPanel>('pay')
  const activePanelIndex = DETAIL_PANELS.findIndex((panel) => panel.id === detailPanel)
  const isFirstPanel = activePanelIndex === 0
  const isLastPanel = activePanelIndex === DETAIL_PANELS.length - 1

  useEffect(() => {
    if (detailPanel === 'business') onComplete?.()
  }, [detailPanel, onComplete])

  useEffect(() => {
    if (reduced) {
      setIsVisible(true)
      return
    }
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const hr = data.hourlyRange
  const ar = data.annualRange
  const se = data.selfEmployment

  const toPosition = (value: number) => ((value - ar.entry) / (ar.senior - ar.entry)) * 100
  const tiers = [
    { label: 'Entry', value: ar.entry, position: toPosition(ar.entry), emphasis: false },
    { label: 'Median', value: ar.median, position: toPosition(ar.median), emphasis: true },
    { label: 'Senior', value: ar.senior, position: toPosition(ar.senior), emphasis: false },
  ]

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

            <p className="relative z-10 text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-neutral-4)]">
              Annual Salary Range
            </p>

            <div
              role="img"
              aria-label={`Salary range: ${formatMoney(ar.entry, 'annual')} entry, ${formatMoney(ar.median, 'annual')} median, ${formatMoney(ar.senior, 'annual')} senior`}
              className="relative z-10 mx-2 mt-6 md:mx-6"
            >
              <div aria-hidden="true">
                {/* ROW 1: value labels */}
                <div className="relative h-[28px] md:h-[36px]">
                  {tiers.map((tier, i) => (
                    <div
                      key={tier.label}
                      className="absolute bottom-0"
                      style={{
                        left: `${tier.position}%`,
                        transform: getLabelTransform(tier.position),
                      }}
                    >
                      <span
                        className={cn(
                          'block whitespace-nowrap font-[800] text-[var(--myb-navy)] transition-all duration-500 ease-out',
                          tier.emphasis
                            ? 'text-[22px] md:text-[28px]'
                            : 'text-[14px] md:text-[18px] text-[var(--myb-neutral-4)]',
                          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                        )}
                        style={{
                          transitionDelay: reduced ? '0ms' : `${520 + i * 120}ms`,
                        }}
                      >
                        {formatMoney(tier.value, 'annual')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ROW 2: rail + marker dots */}
                <div className="relative h-[18px] flex items-center">
                  <div
                    className={cn(
                      'h-1 w-full origin-center rounded-full bg-gradient-to-r from-[var(--myb-light-blue)] via-[var(--myb-primary-blue)] to-[var(--myb-navy)] transition-all duration-[800ms] ease-out',
                      isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    )}
                  />
                  {tiers.map((tier, i) => (
                    <div
                      key={tier.label}
                      className="absolute top-1/2"
                      style={{
                        left: `${tier.position}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className={cn(
                          'rounded-full border-2 border-white shadow-sm transition-all duration-500 ease-out',
                          tier.emphasis
                            ? 'h-[18px] w-[18px] bg-[var(--myb-primary-blue)] shadow-md'
                            : 'h-[12px] w-[12px]',
                          tier.position === 0 && 'bg-[var(--myb-light-blue)]',
                          tier.position === 100 && 'bg-[var(--myb-navy)]',
                          isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        )}
                        style={{
                          transitionDelay: reduced ? '0ms' : `${400 + i * 120}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* ROW 3: tier labels */}
                <div className="relative h-[20px]">
                  {tiers.map((tier, i) => (
                    <div
                      key={tier.label}
                      className="absolute top-0"
                      style={{
                        left: `${tier.position}%`,
                        transform: getLabelTransform(tier.position),
                      }}
                    >
                      <span
                        className={cn(
                          'block whitespace-nowrap uppercase tracking-[0.16em] transition-all duration-500 ease-out',
                          tier.emphasis
                            ? 'text-[10px] font-[800] text-[var(--myb-navy)]'
                            : 'text-[9px] font-[400] text-[var(--myb-neutral-4)]',
                          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-4px] opacity-0'
                        )}
                        style={{
                          transitionDelay: reduced ? '0ms' : `${520 + i * 120}ms`,
                        }}
                      >
                        {tier.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="relative z-10 mt-6 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
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
