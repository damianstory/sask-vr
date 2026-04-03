'use client'

interface NavigationProps {
  currentScreen: number
  totalScreens: number
  onNext: () => void
  onPrev: () => void
}

export default function Navigation({
  currentScreen,
  totalScreens,
  onNext,
  onPrev,
}: NavigationProps) {
  return (
    <div className="sticky bottom-0 z-30 mt-auto px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
      <div className="mx-auto flex w-full max-w-[var(--max-content-width)] items-center justify-between rounded-[var(--radius-sheet)] border border-[color:rgba(217,223,234,0.8)] bg-white/85 px-4 py-4 shadow-[var(--shadow-nav)] backdrop-blur-[var(--glass-blur)] md:px-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentScreen === 1}
          className={`flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-input)] px-4 py-3 text-[15px] font-[800] uppercase tracking-[0.14em] transition-all duration-[var(--motion-medium)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)] ${
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

        {currentScreen !== totalScreens && (
          <button
            type="button"
            onClick={onNext}
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-[var(--radius-input)] px-5 py-3 text-[15px] font-[800] uppercase tracking-[0.14em] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5 focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
            }}
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
      </div>
    </div>
  )
}
