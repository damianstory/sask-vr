'use client'

import { content } from '@/content/config'

interface TaskTagChipsProps {
  tileIds: string[]
}

export default function TaskTagChips({ tileIds }: TaskTagChipsProps) {
  if (tileIds.length === 0) {
    return (
      <div>
        <p className="mb-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          Your skills
        </p>
        <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          Go back to pick your tasks
        </p>
      </div>
    )
  }

  const titles = tileIds
    .map((id) => content.screenTwo.tiles.find((t) => t.id === id)?.title)
    .filter(Boolean) as string[]

  return (
    <div>
      <p className="mb-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
        Your skills
      </p>
      <div className="flex flex-wrap gap-2">
        {titles.map((title) => (
          <span
            key={title}
            className="rounded-full bg-[var(--myb-light-blue)] px-3 py-1 text-[14px] font-[300] text-[var(--myb-navy)]"
          >
            {title}
          </span>
        ))}
      </div>
    </div>
  )
}
