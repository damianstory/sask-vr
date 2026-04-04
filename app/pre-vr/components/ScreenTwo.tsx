'use client'

import { useState } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'
const data = content.taskRanking

// Temporary bridge: uses rankedTiles as selectedTiles until Phase 1B rework
export default function ScreenTwo({ onNext, onComplete }: { onNext?: () => void; onComplete?: () => void }) {
  const { rankedTiles: selectedTiles, setRankedTiles: setSelectedTiles } = useSession()
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [overflowMessage, setOverflowMessage] = useState(false)

  const handleTileToggle = (tileId: string) => {
    if (selectedTiles.includes(tileId)) {
      setSelectedTiles(selectedTiles.filter((id) => id !== tileId))
      // TODO: Phase 1B will replace with trackRankingSubmit
    } else if (selectedTiles.length >= data.maxSelections) {
      setShakeId(tileId)
      setOverflowMessage(true)
      setTimeout(() => setShakeId(null), 300)
      setTimeout(() => setOverflowMessage(false), 3000)
    } else {
      setSelectedTiles([...selectedTiles, tileId])
      // TODO: Phase 1B will replace with trackRankingSubmit
    }
  }

  const buttonLabel =
    selectedTiles.length === 0
      ? 'Pick at least 2'
      : selectedTiles.length === 1
        ? 'Pick 1 more'
        : 'Continue \u2192'

  const isDisabled = selectedTiles.length < data.minSelections

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Discovery Phase
        </p>
        <h2
          data-screen-heading
          className="mt-4 text-center text-[28px] font-[800] leading-[1.15] text-[var(--myb-navy)] md:text-[40px]"
        >
          {data.heading}
        </h2>
        <p className="mt-3 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
          {data.subtext}
        </p>
        <p className="mt-4 inline-flex rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-4 py-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          {data.instruction}
        </p>
      </div>

      <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.tiles.map((tile) => {
          const isSelected = selectedTiles.includes(tile.id)

          return (
            <button
              type="button"
              key={tile.id}
              onClick={() => handleTileToggle(tile.id)}
              aria-pressed={isSelected}
              className={cn(
                'relative flex min-h-[164px] min-w-[44px] flex-col rounded-[var(--radius-card)] p-5 text-left',
                'transition-all duration-[var(--motion-medium)] ease-in-out',
                'focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
                'active:scale-[0.98]',
                isSelected
                  ? 'border-2 border-[var(--myb-primary-blue)] bg-[var(--myb-light-blue-soft)] shadow-[var(--shadow-card-hover)]'
                  : 'border border-[var(--myb-neutral-2)] bg-white hover:-translate-y-0.5 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)]',
                shakeId === tile.id && 'animate-shake'
              )}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--myb-primary-blue)]">
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
                  isSelected
                    ? 'bg-white'
                    : 'bg-[var(--myb-light-blue)]'
                )}
              >
                <span className="text-[24px]">{tile.emoji}</span>
              </span>

              <span className="mt-4 text-[20px] font-[800] leading-[1.2] text-[var(--myb-navy)]">
                {tile.title}
              </span>
              <span
                className={cn(
                  'mt-2 text-[14px] font-[300] leading-[1.6]',
                  isSelected
                    ? 'text-[var(--myb-neutral-5)]'
                    : 'text-[var(--myb-neutral-4)]'
                )}
              >
                {tile.description}
              </span>

              {tile.weight != null && (
                <div className="mt-auto pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        'text-[11px] font-[800] text-[var(--myb-primary-blue)] transition-opacity duration-200',
                        isSelected ? 'opacity-100' : 'opacity-50'
                      )}
                    >
                      {tile.weight}% of the job
                    </span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-[var(--myb-neutral-1)]">
                    <div
                      className={cn(
                        'h-[3px] rounded-full bg-[var(--myb-primary-blue)] transition-opacity duration-200',
                        isSelected ? 'opacity-100' : 'opacity-50'
                      )}
                      style={{ width: `${tile.weight}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {overflowMessage && (
        <p className="mt-4 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          You can pick up to 3!
        </p>
      )}

      <button
        type="button"
        disabled={isDisabled}
        onClick={isDisabled ? undefined : () => { onComplete?.(); onNext?.() }}
        className={cn(
          'mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-input)] px-5 py-4 text-[16px] font-[800] shadow-[var(--shadow-float)]',
          isDisabled
            ? 'cursor-not-allowed bg-[var(--myb-neutral-3)] text-white'
            : 'text-white transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5'
        )}
        style={
          isDisabled
            ? undefined
            : {
                backgroundImage:
                  'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
              }
        }
      >
        {buttonLabel}
        {!isDisabled && (
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
        )}
      </button>
    </section>
  )
}
