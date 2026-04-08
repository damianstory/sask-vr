'use client'

import { useCallback, useEffect, useState } from 'react'
import { content } from '@/content/config'
import Navigation from '@/components/Navigation'
import ProgressBar from '@/components/ProgressBar'
import { cn } from '@/lib/utils'
import { trackChecklistCheck } from '@/lib/analytics'

const data = content.postVr

function CheckboxIcon({ checked, size }: { checked: boolean; size: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full',
        size === 'md' ? 'h-8 w-8' : 'h-7 w-7',
        checked
          ? 'bg-[var(--myb-primary-blue)] animate-check-bounce'
          : 'border-2 border-[var(--myb-neutral-2)] bg-white'
      )}
    >
      {checked && (
        <svg
          width={size === 'md' ? '16' : '14'}
          height={size === 'md' ? '16' : '14'}
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
  )
}

export default function PostVRPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isInitialMount, setIsInitialMount] = useState(true)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [checkedReflections, setCheckedReflections] = useState<string[]>([])
  const isChecklistStep = currentStep === 0
  const canAdvance = checkedItems.length >= 1

  const toggleChecklistItem = (id: string) => {
    const isChecking = !checkedItems.includes(id)
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )

    if (isChecking) {
      const item = data.checklist.find((checklistItem) => checklistItem.id === id)
      if (item) trackChecklistCheck(item.id, item.label)
    }
  }

  const toggleReflection = (id: string) => {
    setCheckedReflections((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const focusHeading = useCallback(() => {
    let frameId: number | null = null

    frameId = requestAnimationFrame(() => {
      const heading = document.querySelector('[data-screen-heading]')
      if (heading instanceof HTMLElement) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: false })
      }
    })

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    return focusHeading()
  }, [currentStep, focusHeading])

  const goNext = () => {
    if (currentStep === 0 && canAdvance) {
      setDirection('forward')
      setCurrentStep(1)
      setIsInitialMount(false)
    }
  }

  const goPrev = () => {
    if (currentStep === 1) {
      setDirection('backward')
      setCurrentStep(0)
      setIsInitialMount(false)
    }
  }

  return (
    <div
      id="main-content"
      className="grid min-h-[100dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden md:h-[100dvh] md:min-h-0"
    >
      <ProgressBar current={currentStep + 1} total={2} compact />
      <div className="relative min-h-0 overflow-hidden">
        <main
          key={currentStep}
          className={cn(
            'relative isolate h-full min-h-0 overflow-hidden px-4 py-8 md:grid md:grid-rows-[1fr] md:px-6 md:py-6',
            !isInitialMount &&
              (direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right')
          )}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-80px] top-[-60px] h-64 w-64 rounded-full bg-[color:rgba(198,231,255,0.85)] blur-3xl" />
            <div className="absolute bottom-[-80px] right-[-120px] h-72 w-72 rounded-full bg-[color:rgba(0,146,255,0.12)] blur-3xl" />
          </div>

          <div className="relative mx-auto flex w-full max-w-[720px] flex-col gap-8 md:min-h-0 md:max-w-[var(--max-content-width)] md:grid md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-8">
            <div className="flex flex-col gap-3 md:self-start">
              {isChecklistStep ? (
                <>
                  <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6">
                    <h1
                      data-screen-heading
                      className="text-center text-[28px] font-[800] leading-[1.1] text-[var(--myb-navy)] md:text-left md:text-[40px]"
                    >
                      {data.congratsHeading}
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-[18px] font-[300] leading-[1.55] text-[var(--myb-neutral-5)] md:mx-0 md:text-left md:text-[18px]">
                      {data.congratsSubtext}
                    </p>
                  </section>

                  <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2">
                        <h2
                          id="post-vr-checklist-heading"
                          className="text-[20px] font-[800] text-[var(--myb-navy)] md:text-[22px]"
                        >
                          {data.checklistHeading}
                        </h2>
                        <div className="w-fit rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-4 py-1.5 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
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
                      <p className="max-w-xl text-[15px] font-[300] leading-[1.6] text-[var(--myb-neutral-5)]">
                        Open myBlueprint in a new tab and complete these one by one.
                      </p>
                      <a
                        href={data.myblueprintLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] w-full items-center justify-center rounded-[var(--radius-input)] px-6 py-2.5 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5 focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
                        }}
                      >
                        {data.myblueprintLink.label}
                      </a>
                    </div>
                  </section>
                </>
              ) : (
                <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6">
                  <h1
                    data-screen-heading
                    className="text-center text-[28px] font-[800] leading-[1.1] text-[var(--myb-navy)] md:text-left md:text-[40px]"
                  >
                    {data.reflectionHeading}
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-center text-[18px] font-[300] leading-[1.55] text-[var(--myb-neutral-5)] md:mx-0 md:text-left md:text-[18px]">
                    {data.reflectionSubtext}
                  </p>
                </section>
              )}
            </div>

            <div className="flex flex-col gap-4 md:min-h-0 md:overflow-y-auto md:overscroll-contain">
              {isChecklistStep ? (
                <section
                  aria-labelledby="post-vr-checklist-heading"
                  className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-4 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-3"
                >
                  <div className="flex flex-col gap-1.5">
                    {data.checklist.map((item) => {
                      const isChecked = checkedItems.includes(item.id)

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklistItem(item.id)}
                          role="checkbox"
                          aria-checked={isChecked}
                          className="min-h-[44px] w-full rounded-[var(--radius-card)] text-left focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
                        >
                          <span
                            className={cn(
                              'flex w-full items-center gap-4 rounded-[var(--radius-card)] border px-4 py-2.5 transition-all duration-[var(--motion-medium)] md:px-4',
                              isChecked
                                ? 'border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)]'
                                : 'border-[var(--myb-neutral-2)] bg-white hover:-translate-y-0.5 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)]'
                            )}
                          >
                            <CheckboxIcon checked={isChecked} size="md" />
                            <span
                              className={cn(
                                'flex-1 text-[18px] font-[300] leading-[1.45] md:text-[18px]',
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
              ) : (
                <section className="rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-4 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-3">
                  <div className="mt-0 flex flex-col gap-1.5">
                    {data.reflections.map((reflection) => {
                      const isChecked = checkedReflections.includes(reflection.id)

                      return (
                        <button
                          key={reflection.id}
                          type="button"
                          onClick={() => toggleReflection(reflection.id)}
                          role="checkbox"
                          aria-checked={isChecked}
                          className="min-h-[44px] w-full rounded-[var(--radius-card)] text-left focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
                        >
                          <span
                            className={cn(
                              'flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] px-4 py-2 transition-colors duration-[var(--motion-medium)]',
                              isChecked
                                ? 'bg-[color:rgba(246,250,255,0.95)]'
                                : 'bg-white hover:border-[var(--myb-primary-blue)]'
                            )}
                          >
                            <CheckboxIcon checked={isChecked} size="sm" />
                            <span
                              className={cn(
                                'flex-1 text-[17px] font-[300] leading-[1.45] md:text-[17px]',
                                isChecked
                                  ? 'text-[var(--myb-neutral-3)] line-through'
                                  : 'text-[var(--myb-navy)]'
                              )}
                            >
                              {reflection.statement}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
      <Navigation
        currentScreen={currentStep + 1}
        totalScreens={2}
        onNext={goNext}
        onPrev={goPrev}
        disableNext={isChecklistStep ? !canAdvance : false}
        hideNext={!isChecklistStep}
        compact
      />
    </div>
  )
}
