'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { trackAISortAttempt, trackAISortComplete } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.aiSorting
const FEEDBACK_DELAY_MS = 4400

export default function ScreenAI({ onComplete }: { onComplete?: () => void }) {
  const {
    aiSortResults,
    aiSortComplete,
    setAiSortResults,
    setAiSortComplete,
  } = useSession()

  const [feedback, setFeedback] = useState<{ correct: boolean; taskId: string } | null>(null)
  const [completedInSession, setCompletedInSession] = useState(false)
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const [activeResultIndex, setActiveResultIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const showResults = aiSortComplete || completedInSession

  const answeredIds = new Set(aiSortResults?.map((r) => r.taskId) ?? [])
  const remainingTasks = data.tasks.filter((t) => !answeredIds.has(t.id))
  const currentTask = remainingTasks[0]
  const lockedTask = feedback ? data.tasks.find((t) => t.id === feedback.taskId) : null
  const visibleTask = lockedTask ?? currentTask

  const handleAnswer = useCallback(
    (chosen: 'ai' | 'human') => {
      if (!currentTask || buttonsDisabled) return

      const correct = chosen === currentTask.correctAnswer
      const nextResults = [
        ...(aiSortResults ?? []),
        { taskId: currentTask.id, chosen, correct },
      ]

      setButtonsDisabled(true)
      setFeedback({ correct, taskId: currentTask.id })
      trackAISortAttempt(currentTask.id, chosen, correct)
      setAiSortResults(nextResults)

      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setFeedback(null)

        const nextAnsweredIds = new Set(nextResults.map((r) => r.taskId))
        const stillRemaining = data.tasks.filter((t) => !nextAnsweredIds.has(t.id))

        if (stillRemaining.length === 0) {
          const score = nextResults.filter((r) => r.correct).length
          setAiSortComplete(true)
          trackAISortComplete(score)
          onComplete?.()
          setCompletedInSession(true)
          setActiveResultIndex(0)
        } else {
          setButtonsDisabled(false)
        }
      }, FEEDBACK_DELAY_MS)
    },
    [
      currentTask,
      buttonsDisabled,
      aiSortResults,
      setAiSortResults,
      setAiSortComplete,
      onComplete,
    ],
  )

  if (showResults) {
    const orderedResults = data.tasks.map((task) => ({
      task,
      result: (aiSortResults ?? []).find((entry) => entry.taskId === task.id),
    }))
    const score = (aiSortResults ?? []).filter((r) => r.correct).length
    const activeResult = orderedResults[Math.min(activeResultIndex, orderedResults.length - 1)]
    const activeTask = activeResult.task
    const isCorrect = activeResult.result?.correct ?? false

    return (
      <PreVRScreenShell
        eyebrow="Results"
        heading={`${score} of ${data.tasks.length}`}
        subtext={data.punchline}
        mode="fit"
        desktopLayout="split"
        bodyClassName="justify-center"
      >
        <div className="flex h-full min-h-0 flex-col justify-center gap-4">
          <div className="rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-5 shadow-[var(--shadow-float)]">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-[800]',
                  isCorrect ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-500',
                )}
                aria-hidden="true"
              >
                {isCorrect ? '\u2713' : '!'}
              </span>
              <div>
                <p className="text-[12px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-primary-blue)]">
                  Task {activeResultIndex + 1} of {orderedResults.length}
                </p>
                <p className="mt-2 text-[18px] font-[800] leading-[1.4] text-[var(--myb-navy)]">
                  {activeTask.description}
                </p>
                <p className="mt-3 text-[13px] font-[800] uppercase tracking-[0.12em] text-[var(--myb-primary-blue)]">
                  Answer: {activeTask.correctAnswer === 'ai' ? 'AI' : 'Human'}
                </p>
                <p className="mt-2 text-[14px] font-[300] leading-[1.65] text-[var(--myb-neutral-4)]">
                  {activeTask.explanation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-white/80 p-3">
            <button
              type="button"
              onClick={() => setActiveResultIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeResultIndex === 0}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show previous result"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex gap-2">
              {orderedResults.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveResultIndex(index)}
                  aria-label={`Show result ${index + 1}`}
                  aria-pressed={activeResultIndex === index}
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition-colors',
                    activeResultIndex === index ? 'bg-[var(--myb-primary-blue)]' : 'bg-[var(--myb-neutral-3)]'
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveResultIndex((prev) => Math.min(prev + 1, orderedResults.length - 1))}
              disabled={activeResultIndex === orderedResults.length - 1}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Show next result"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </PreVRScreenShell>
    )
  }

  const progress = data.tasks.length - remainingTasks.length

  return (
    <PreVRScreenShell
      eyebrow="AI Challenge"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-6 text-center shadow-[var(--shadow-float)]">
        <p className="text-[13px] font-[300] text-[var(--myb-neutral-3)]">
          {progress + 1} of {data.tasks.length}
        </p>

        {visibleTask && (
          <>
            <p className="mt-5 text-[18px] font-[300] leading-[1.7] text-[var(--myb-navy)]">
              {visibleTask.description}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={buttonsDisabled}
                onClick={() => handleAnswer('ai')}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-[var(--radius-input)] border-2 border-[var(--myb-primary-blue)] px-4 py-3 text-[16px] font-[800] text-[var(--myb-primary-blue)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-50 disabled:hover:bg-transparent"
              >
                AI
              </button>
              <button
                type="button"
                disabled={buttonsDisabled}
                onClick={() => handleAnswer('human')}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-[var(--radius-input)] border-2 border-[var(--myb-navy)] px-4 py-3 text-[16px] font-[800] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Human
              </button>
            </div>
          </>
        )}

        {feedback !== null && lockedTask && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto rounded-[var(--radius-panel)] bg-gradient-to-t from-white via-white/[0.98] to-white/80 p-6 text-center"
          >
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-[20px] font-[800]',
                feedback.correct ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500',
              )}
              aria-hidden="true"
            >
              {feedback.correct ? '\u2713' : '\u2717'}
            </span>
            <p
              className={cn(
                'mt-2 text-[18px] font-[800]',
                feedback.correct ? 'text-green-600' : 'text-red-500',
              )}
            >
              {feedback.correct ? 'Correct!' : 'Not quite'}
            </p>
            <p className="mt-1 text-[13px] font-[800] uppercase tracking-[0.12em] text-[var(--myb-primary-blue)]">
              Answer: {lockedTask.correctAnswer === 'ai' ? 'AI' : 'Human'}
            </p>
            <p className="mt-3 text-[14px] font-[300] leading-[1.65] text-[var(--myb-neutral-4)]">
              {lockedTask.explanation}
            </p>
          </div>
        )}
      </div>
    </PreVRScreenShell>
  )
}
