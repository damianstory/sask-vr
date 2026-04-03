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
  const displayName = name.trim() || 'Your Name'

  return (
    <div
      className="relative aspect-[1200/675] w-full max-w-[var(--max-card-preview-width)] overflow-hidden rounded-[32px] border border-[var(--myb-neutral-2)] shadow-[var(--shadow-float)]"
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_38%)]" />
      <div className="relative flex h-full w-full flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[14px] font-[800] tracking-[0.2em] text-white/92 md:text-[16px]">
            CARPENTER CARD
          </p>
          <span className="rounded-[var(--radius-pill)] border border-white/20 bg-[color:rgba(255,255,255,0.14)] px-3 py-1 text-[10px] font-[800] uppercase tracking-[0.2em] text-white">
            Builder
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white shadow-[var(--shadow-float)] md:h-24 md:w-24">
            <span className="text-[36px] md:text-[48px]">{iconEmoji ?? ' '}</span>
          </span>
          <div className="min-w-0">
            <p
              className={`text-[30px] font-[800] leading-[1.02] tracking-tight md:text-[46px] ${
                name.trim() ? 'text-white' : 'text-white/55'
              }`}
            >
              {displayName}
            </p>
            <p className="mt-2 text-[14px] font-[300] tracking-[0.08em] text-white/78 md:text-[18px]">
              Career Explorer
            </p>
          </div>
        </div>

        {taskLabels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {taskLabels.map((label) => (
              <span
                key={label}
                className="rounded-[var(--radius-pill)] border border-white/12 bg-[color:rgba(255,255,255,0.18)] px-3 py-1.5 text-[11px] font-[800] uppercase tracking-[0.12em] text-white md:text-[12px]"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[11px] font-[800] uppercase tracking-[0.12em] text-white/58">
            Choose 2-3 tasks to personalize your card
          </div>
        )}
      </div>
    </div>
  )
}
