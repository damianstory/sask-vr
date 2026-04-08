'use client'

interface ProgressBarProps {
  current: number
  total: number
  compact?: boolean
}

export default function ProgressBar({ current, total, compact = false }: ProgressBarProps) {
  return (
    <div className={`sticky top-0 z-30 px-4 ${compact ? 'pt-2 md:pt-3' : 'pt-4'}`}>
      <div
        className={`mx-auto flex w-full max-w-[var(--max-content-width)] flex-col rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/80 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:flex-row md:items-center md:justify-between ${
          compact ? 'gap-2 px-4 py-3 md:px-5 md:py-3' : 'gap-3 px-4 py-4 md:px-6'
        }`}
      >
        <div className={`flex flex-col ${compact ? 'gap-0.5' : 'gap-1'}`}>
          <span className="text-[11px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            Progress
          </span>
          <span className="text-sm font-[300] text-[var(--myb-neutral-4)]">
            {current} of {total}
          </span>
        </div>
        <div
          className="flex gap-2"
          role="progressbar"
          aria-label={`Progress: ${current} of ${total}`}
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
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  isCompleted || isCurrent
                    ? 'bg-[var(--myb-primary-blue)]'
                    : 'bg-[var(--myb-neutral-3)]'
                } ${isCurrent ? 'animate-pulse-dot' : ''}`}
                aria-hidden="true"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
