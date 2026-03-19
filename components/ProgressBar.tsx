'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {Array.from({ length: total }, (_, i) => {
          const screenNum = i + 1
          const isCurrent = screenNum === current
          const isCompleted = screenNum < current

          return (
            <div
              key={screenNum}
              className={`h-3 w-3 rounded-full transition-colors ${
                isCompleted || isCurrent
                  ? 'bg-[var(--myb-primary-blue)]'
                  : 'bg-[var(--myb-neutral-3)]'
              } ${isCurrent ? 'animate-pulse-dot' : ''}`}
              aria-hidden="true"
            />
          )
        })}
      </div>
      <span className="text-sm font-light text-[var(--myb-neutral-4)]">
        {current} of {total}
      </span>
    </div>
  )
}
