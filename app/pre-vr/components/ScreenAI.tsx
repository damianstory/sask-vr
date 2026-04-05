'use client'

import { useState, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { useReducedMotion } from '@/lib/hooks'
import { trackAISortAttempt, trackAISortComplete } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const data = content.aiSorting

export default function ScreenAI({ onComplete }: { onComplete?: () => void }) {
  const reduced = useReducedMotion()
  const {
    aiSortResults,
    aiSortComplete,
    setAiSortResults,
    setAiSortComplete,
  } = useSession()

  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null)
  const [completedInSession, setCompletedInSession] = useState(false)
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show results if already complete (revisit) or just completed in this session
  const showResults = aiSortComplete || completedInSession

  // Derive current task from answered IDs
  const answeredIds = new Set(aiSortResults?.map((r) => r.taskId) ?? [])
  const remainingTasks = data.tasks.filter((t) => !answeredIds.has(t.id))
  const currentTask = remainingTasks[0]

  const handleAnswer = useCallback(
    (chosen: 'ai' | 'human') => {
      if (!currentTask || buttonsDisabled) return

      const correct = chosen === currentTask.correctAnswer
      const nextResults = [
        ...(aiSortResults ?? []),
        { taskId: currentTask.id, chosen, correct },
      ]

      // Disable buttons to prevent double-submit
      setButtonsDisabled(true)
      setFeedback({ correct })
      trackAISortAttempt(currentTask.id, chosen, correct)
      setAiSortResults(nextResults)

      timerRef.current = setTimeout(() => {
        timerRef.current = null
        setFeedback(null)

        // Check completion against local nextResults, not stale session state
        const nextAnsweredIds = new Set(nextResults.map((r) => r.taskId))
        const stillRemaining = data.tasks.filter(
          (t) => !nextAnsweredIds.has(t.id),
        )

        if (stillRemaining.length === 0) {
          const score = nextResults.filter((r) => r.correct).length
          setAiSortComplete(true)
          trackAISortComplete(score)
          onComplete?.()
          setCompletedInSession(true)
        } else {
          // Re-enable buttons for the next task
          setButtonsDisabled(false)
        }
      }, 1200)
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

  // Results view — render from canonical data.tasks order
  if (showResults) {
    const resultsByTaskId = new Map(
      (aiSortResults ?? []).map((r) => [r.taskId, r]),
    )
    const score = (aiSortResults ?? []).filter((r) => r.correct).length

    return (
      <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            Results
          </p>
          <h2
            data-screen-heading
            className="mt-4 text-center text-[28px] font-[800] leading-[1.15] text-[var(--myb-navy)] md:text-[40px]"
          >
            {score} of {data.tasks.length}
          </h2>
          <p className="mt-3 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
            {data.punchline}
          </p>
        </div>

        <ul className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-4">
          {data.tasks.map((task) => {
            const result = resultsByTaskId.get(task.id)
            const isCorrect = result?.correct ?? false

            return (
              <li
                key={task.id}
                className="rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 shrink-0 text-[14px] font-[800]',
                      isCorrect
                        ? 'text-green-600'
                        : 'text-red-500',
                    )}
                    aria-hidden="true"
                  >
                    {isCorrect ? '\u2713' : '\u2717'}
                  </span>
                  <div>
                    <p className="text-[14px] font-[300] text-[var(--myb-neutral-5)]">
                      {task.description}
                    </p>
                    <p className="mt-1 text-[13px] font-[800] uppercase tracking-[0.12em] text-[var(--myb-primary-blue)]">
                      Answer: {task.correctAnswer === 'ai' ? 'AI' : 'Human'}
                    </p>
                    <p className="mt-1 text-[13px] font-[300] text-[var(--myb-neutral-4)]">
                      {task.explanation}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  // Sorting view
  const progress = data.tasks.length - remainingTasks.length

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          AI Challenge
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

      <div className="mx-auto mt-2 text-[13px] font-[300] text-[var(--myb-neutral-3)]">
        {progress + 1} of {data.tasks.length}
      </div>

      {currentTask && (
        <div
          className={cn(
            'mx-auto mt-6 w-full max-w-md rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] p-6 text-center',
            feedback !== null && !reduced && 'transition-colors duration-300',
            feedback?.correct === true && 'border-green-400 bg-green-50',
            feedback?.correct === false && 'border-red-400 bg-red-50',
          )}
        >
          <p className="text-[16px] font-[300] leading-[1.75] text-[var(--myb-navy)]">
            {currentTask.description}
          </p>

          {feedback !== null && (
            <p
              className={cn(
                'mt-3 text-[14px] font-[800]',
                feedback.correct ? 'text-green-600' : 'text-red-500',
              )}
            >
              {feedback.correct ? 'Correct!' : 'Not quite'}
            </p>
          )}

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
        </div>
      )}
    </section>
  )
}
