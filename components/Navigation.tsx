'use client'

interface NavigationProps {
  currentScreen: number
  totalScreens: number
  onNext: () => void
  onPrev: () => void
  terminalAction?: {
    label: string
    ariaLabel: string
    onClick: () => void
  }
  hideNext?: boolean
  disableNext?: boolean
  compact?: boolean
}

export default function Navigation({
  currentScreen,
  totalScreens,
  onNext,
  onPrev,
  terminalAction,
  hideNext,
  disableNext,
  compact = false,
}: NavigationProps) {
  const isFinalScreen = currentScreen === totalScreens
  const actionButtonClassName = `flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-input)] text-[15px] font-[800] uppercase tracking-[0.14em] transition-all duration-[var(--motion-medium)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)] ${
    compact ? 'px-4 py-2.5 md:px-5 md:py-2.5' : 'px-5 py-3'
  } ${
    disableNext
      ? 'cursor-not-allowed bg-[var(--myb-neutral-2)] text-[var(--myb-neutral-4)] shadow-none'
      : 'text-white shadow-[var(--shadow-float)] hover:-translate-y-0.5'
  }`

  return (
    <div
      className={`sticky bottom-0 z-30 mt-auto px-4 ${
        compact
          ? 'pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 md:pt-3'
          : 'pb-[max(env(safe-area-inset-bottom),1rem)] pt-4'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[var(--max-content-width)] items-center justify-between rounded-[var(--radius-sheet)] border border-[color:rgba(217,223,234,0.8)] bg-white/85 shadow-[var(--shadow-nav)] backdrop-blur-[var(--glass-blur)] ${
          compact ? 'px-4 py-3 md:px-5 md:py-3' : 'px-4 py-4 md:px-6'
        }`}
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={currentScreen === 1}
          className={`flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-input)] text-[15px] font-[800] uppercase tracking-[0.14em] transition-all duration-[var(--motion-medium)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)] ${
            compact ? 'px-3 py-2.5 md:px-4 md:py-2.5' : 'px-4 py-3'
          } ${
            currentScreen === 1
              ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
              : 'text-[var(--myb-navy)] hover:-translate-y-0.5'
          }`}
          aria-label="Go to previous screen"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 18L5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back</span>
        </button>

        {!isFinalScreen && !hideNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={disableNext}
            className={actionButtonClassName}
            style={
              disableNext
                ? undefined
                : {
                    backgroundImage:
                      'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
                  }
            }
            aria-label="Go to next screen"
          >
            <span>Next</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {isFinalScreen && terminalAction && (
          <button
            type="button"
            onClick={terminalAction.onClick}
            className={actionButtonClassName}
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
            }}
            aria-label={terminalAction.ariaLabel}
          >
            <span>{terminalAction.label}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 6L18 12L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
