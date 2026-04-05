'use client'

import { useState } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'
import { trackChecklistCheck } from '@/lib/analytics'
import { SessionProvider } from '@/context/SessionContext'
import TinyHouseDesigner from './components/TinyHouseDesigner'

const data = content.postVr

export default function PostVRPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    const isChecking = !checkedItems.includes(id)
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
    if (isChecking) {
      const item = data.checklist.find((c) => c.id === id)
      if (item) trackChecklistCheck(item.id, item.label)
    }
  }

  return (
    <SessionProvider>
    <main
      id="main-content"
      className="relative isolate min-h-screen overflow-hidden px-4 py-8 md:px-6 md:py-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-80px] top-[-60px] h-64 w-64 rounded-full bg-[color:rgba(198,231,255,0.85)] blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-120px] h-72 w-72 rounded-full bg-[color:rgba(0,146,255,0.12)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col gap-8">
        <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-8">
          <div className="inline-flex rounded-[var(--radius-pill)] bg-[var(--myb-light-blue)] px-4 py-2 text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            Reflection Complete
          </div>
          <h1
            data-screen-heading
            className="mt-5 text-center text-[28px] font-[800] leading-[1.1] text-[var(--myb-navy)] md:text-[40px]"
          >
            {data.congratsHeading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[18px] font-[300] leading-[1.55] text-[var(--myb-neutral-5)] md:text-[22px]">
            {data.congratsSubtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] px-4 py-4 md:px-5">
            <div>
              <h2 className="text-[20px] font-[800] text-[var(--myb-navy)] md:text-[24px]">
                {data.checklistHeading}
              </h2>
              <p className="mt-1 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                Keep the momentum going with a few concrete next steps.
              </p>
            </div>
            <div className="rounded-[var(--radius-pill)] bg-white px-4 py-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              <span
                className={
                  checkedItems.length > 0
                    ? 'font-[800] text-[var(--myb-primary-blue)]'
                    : 'font-[800] text-[var(--myb-navy)]'
                }
              >
                {checkedItems.length}
              </span>{' '}
              of {data.checklist.length} complete
            </div>
          </div>
        </section>

        <TinyHouseDesigner />

        <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-4 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-5">
          <div className="flex flex-col gap-3">
            {data.checklist.map((item) => {
              const isChecked = checkedItems.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  role="checkbox"
                  aria-checked={isChecked}
                  className="w-full rounded-[var(--radius-card)] text-left focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
                >
                  <span
                    className={cn(
                      'flex w-full items-center gap-4 rounded-[var(--radius-card)] border px-4 py-4 transition-all duration-[var(--motion-medium)] md:px-5',
                      isChecked
                        ? 'border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)]'
                        : 'border-[var(--myb-neutral-2)] bg-white hover:-translate-y-0.5 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)]'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        isChecked
                          ? 'bg-[var(--myb-primary-blue)] animate-check-bounce'
                          : 'border-2 border-[var(--myb-neutral-2)] bg-white'
                      )}
                    >
                      {isChecked && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 7L5.5 10.5L12 3.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>

                    <span
                      className={cn(
                        'flex-1 text-[18px] font-[300] leading-[1.5] md:text-[22px]',
                        isChecked
                          ? 'text-[var(--myb-neutral-3)] line-through'
                          : 'text-[var(--myb-navy)]'
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
                Keep Exploring
              </p>
              <p className="mt-2 max-w-xl text-[15px] font-[300] leading-[1.7] text-[var(--myb-neutral-5)]">
                Open myBlueprint to capture what stood out, explore related pathways, and keep building from today&apos;s VR experience.
              </p>
            </div>
            <a
              href={data.myblueprintLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center justify-center rounded-[var(--radius-input)] px-6 py-3 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5 focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)] md:min-w-[250px]"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
              }}
            >
              {data.myblueprintLink.label}
            </a>
          </div>
        </section>
      </div>
    </main>
    </SessionProvider>
  )
}
