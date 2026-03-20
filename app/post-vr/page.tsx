'use client'

import { useState } from 'react'
import { content } from '@/content/config'
import { cn } from '@/lib/utils'
import { trackChecklistCheck } from '@/lib/analytics'

const data = content.postVr

export default function PostVRPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    const isChecking = !checkedItems.includes(id)
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
    if (isChecking) {
      const item = data.checklist.find((c) => c.id === id)
      if (item) trackChecklistCheck(item.id, item.label)
    }
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-[640px]">
        <h1 className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
          {data.congratsHeading}
        </h1>
        <p className="mt-4 text-center text-[20px] font-[300] leading-[1.3] text-[var(--myb-neutral-5)] md:text-[24px]">
          {data.congratsSubtext}
        </p>

        <h2 className="mt-8 text-[20px] font-[800] text-[var(--myb-navy)] md:text-[24px]">
          {data.checklistHeading}
        </h2>

        <p className="mt-2 text-[16px] font-[300] text-[var(--myb-neutral-4)]">
          <span
            className={
              checkedItems.length > 0
                ? 'font-[800] text-[var(--myb-primary-blue)]'
                : ''
            }
          >
            {checkedItems.length}
          </span>{' '}
          of {data.checklist.length} complete
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {data.checklist.map((item) => {
            const isChecked = checkedItems.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                role="checkbox"
                aria-checked={isChecked}
                className="flex w-full items-center gap-3 border-b border-[var(--myb-neutral-1)] pb-3 text-left focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] rounded"
              >
                <div
                  className={cn(
                    'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded',
                    isChecked
                      ? 'bg-[var(--myb-primary-blue)] animate-check-bounce'
                      : 'border-2 border-[var(--myb-neutral-2)] bg-white'
                  )}
                >
                  {isChecked && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 7L5.5 10.5L12 3.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <span
                  className={cn(
                    'text-[20px] font-[300] md:text-[24px]',
                    isChecked
                      ? 'text-[var(--myb-neutral-3)] line-through'
                      : 'text-[var(--myb-navy)]'
                  )}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        <a
          href={data.myblueprintLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--myb-primary-blue)] px-6 py-3 text-[16px] font-[800] text-white hover:bg-[var(--myb-blue-dark)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[3px] md:mx-auto md:max-w-[280px]"
        >
          {data.myblueprintLink.label}
        </a>
      </div>
    </main>
  )
}
