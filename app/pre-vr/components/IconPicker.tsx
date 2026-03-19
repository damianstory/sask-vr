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
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
      {icons.map((icon) => {
        const isSelected = selectedIcon === icon.id

        return (
          <button
            key={icon.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(icon.id)}
            className={cn(
              'relative flex flex-col items-center rounded-xl p-3 min-h-[80px] min-w-[44px] gap-1',
              'transition-colors duration-200 ease-in-out',
              'focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]',
              'active:scale-[0.98]',
              isSelected
                ? 'bg-[var(--myb-light-blue)] border-2 border-[var(--myb-primary-blue)]'
                : 'bg-white border border-[var(--myb-neutral-2)] hover:shadow-md hover:border-[var(--myb-neutral-3)]'
            )}
          >
            {/* Checkmark badge */}
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

            {/* Emoji circle */}
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                isSelected ? 'bg-white' : 'bg-[var(--myb-light-blue)]'
              )}
            >
              <span className="text-[24px]">{icon.emoji}</span>
            </span>

            {/* Label */}
            <span className="text-[12px] font-[300] text-[var(--myb-neutral-4)]">
              {icon.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
