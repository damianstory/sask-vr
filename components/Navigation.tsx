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
    <div className="flex items-center justify-between px-4 py-4">
      <button
        onClick={onPrev}
        disabled={currentScreen === 1}
        className={`min-h-[44px] min-w-[44px] rounded-lg px-6 py-3 text-[16px] font-[300] ${
          currentScreen === 1
            ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
            : 'text-[var(--myb-neutral-5)]'
        }`}
        aria-label="Go to previous screen"
      >
        Back
      </button>

      {currentScreen !== totalScreens && (
        <button
          onClick={onNext}
          className="min-h-[44px] min-w-[44px] rounded-lg bg-[var(--myb-primary-blue)] px-6 py-3 text-[16px] font-[900] text-white hover:bg-[var(--myb-blue-dark)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[3px]"
          aria-label="Go to next screen"
        >
          Next
        </button>
      )}
    </div>
  )
}
