'use client'

import { CARD_GRADIENTS } from '@/lib/card-gradients'

interface CardPreviewProps {
  name: string
  iconEmoji: string | null
  taskLabels: string[]
  gradientVariant: number
}

export default function CardPreview({
  name,
  iconEmoji,
  taskLabels,
  gradientVariant,
}: CardPreviewProps) {
  const gradient = CARD_GRADIENTS[gradientVariant]

  return (
    <div
      className="aspect-[1200/675] w-full max-w-lg rounded-xl border border-[var(--myb-neutral-2)] overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
        {/* Title */}
        <p className="text-white text-[14px] md:text-[16px] font-[800] tracking-wider">
          CARPENTER CARD
        </p>

        {/* Icon area */}
        {iconEmoji ? (
          <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white">
            <span className="text-[32px] md:text-[40px]">{iconEmoji}</span>
          </span>
        ) : (
          <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-white" />
        )}

        {/* Name */}
        {name.trim() ? (
          <p className="text-white text-[24px] md:text-[28px] font-[800]">
            {name}
          </p>
        ) : (
          <p className="text-white/50 text-[24px] md:text-[28px] font-[800]">
            Your Name
          </p>
        )}

        {/* Task tags */}
        {taskLabels.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {taskLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-white/20 px-3 py-1 text-[12px] md:text-[14px] font-[300] text-white"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
