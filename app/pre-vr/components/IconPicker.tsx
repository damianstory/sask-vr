'use client'

import { cn } from '@/lib/utils'

interface IconPickerProps {
  icons: Array<{ id: string; label: string; emoji: string }>
  selectedIcon: string | null
  onSelect: (iconId: string) => void
}

export default function IconPicker({
  icons,
  selectedIcon,
  onSelect,
}: IconPickerProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      {icons.map((icon) => {
        const isSelected = selectedIcon === icon.id

        return (
          <button
            key={icon.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(icon.id)}
            className={cn(
              'relative flex min-h-[92px] min-w-[44px] flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border-2 px-3 py-4',
              'transition-all duration-[var(--motion-medium)] ease-in-out',
              'focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
              'active:scale-[0.98]',
              isSelected
                ? 'border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)] shadow-[var(--shadow-card-hover)]'
                : 'border-transparent bg-white hover:-translate-y-0.5 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)]'
            )}
          >
            {isSelected && (
              <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--myb-primary-blue)]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7l3 3 5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}

            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full shadow-[var(--shadow-float)]',
                isSelected ? 'bg-white' : 'bg-[var(--myb-light-blue-soft)]'
              )}
            >
              <span className="text-[24px]">{icon.emoji}</span>
            </span>

            <span className="text-center text-[12px] font-[800] uppercase tracking-[0.12em] text-[var(--myb-neutral-4)]">
              {icon.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
