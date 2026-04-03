'use client'

import { content } from '@/content/config'

interface TaskTagChipsProps {
  tileIds: string[]
}

export default function TaskTagChips({ tileIds }: TaskTagChipsProps) {
  if (tileIds.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--myb-neutral-2)] bg-[var(--myb-light-blue-soft)] p-4">
        <p className="mb-2 text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]">
          Your skills
        </p>
        <p className="text-[14px] font-[300] leading-[1.7] text-[var(--myb-neutral-4)]">
          Go back to pick your tasks
        </p>
      </div>
    )
  }

  const titles = tileIds
    .map((id) => content.screenTwo.tiles.find((t) => t.id === id)?.title)
    .filter(Boolean) as string[]

  return (
    <div className="rounded-[var(--radius-card)] border border-[color:rgba(217,223,234,0.8)] bg-[var(--myb-light-blue-soft)] p-4">
      <p className="mb-3 text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]">
        Your skills
      </p>
      <div className="flex flex-wrap gap-2">
        {titles.map((title) => (
          <span
            key={title}
            className="rounded-[var(--radius-pill)] bg-white px-3 py-1.5 text-[14px] font-[800] text-[var(--myb-navy)] shadow-[var(--shadow-float)]"
          >
            {title}
          </span>
        ))}
      </div>
    </div>
  )
}
