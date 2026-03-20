'use client'

import { useState } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'
import { trackTileSelect } from '@/lib/analytics'

const data = content.screenTwo

export default function ScreenTwo() {
  const { selectedTiles, setSelectedTiles } = useSession()
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [overflowMessage, setOverflowMessage] = useState(false)

  const handleTileToggle = (tileId: string) => {
    if (selectedTiles.includes(tileId)) {
      setSelectedTiles(selectedTiles.filter((id) => id !== tileId))
      trackTileSelect(tileId, 'deselect')
    } else if (selectedTiles.length >= data.maxSelections) {
      setShakeId(tileId)
      setOverflowMessage(true)
      setTimeout(() => setShakeId(null), 300)
      setTimeout(() => setOverflowMessage(false), 3000)
    } else {
      setSelectedTiles([...selectedTiles, tileId])
      trackTileSelect(tileId, 'select')
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
    <section className="flex flex-col items-center px-4 py-8">
      <h2 data-screen-heading className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>
      <p className="mt-1 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
        {data.instruction}
      </p>

      <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-4 md:grid-cols-3">
        {data.tiles.map((tile) => {
          const isSelected = selectedTiles.includes(tile.id)

          return (
            <button
              key={tile.id}
              onClick={() => handleTileToggle(tile.id)}
              aria-pressed={isSelected}
              className={cn(
                'relative flex flex-col items-center rounded-xl p-4 min-h-[140px] min-w-[44px]',
                'transition-colors duration-200 ease-in-out',
                'focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]',
                'active:scale-[0.98]',
                isSelected
                  ? 'bg-[var(--myb-light-blue)] border-2 border-[var(--myb-primary-blue)]'
                  : 'bg-white border border-[var(--myb-neutral-2)] hover:shadow-md hover:border-[var(--myb-neutral-3)]',
                shakeId === tile.id && 'animate-shake'
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
                  isSelected
                    ? 'bg-white'
                    : 'bg-[var(--myb-light-blue)]'
                )}
              >
                <span className="text-[24px]">{tile.emoji}</span>
              </span>

              {/* Tile text */}
              <span className="mt-2 text-center text-[20px] font-[800] leading-[1.3] text-[var(--myb-navy)] md:text-[24px]">
                {tile.title}
              </span>
              <span className="mt-1 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
                {tile.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* Overflow message */}
      {overflowMessage && (
        <p className="mt-3 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          You can pick up to 3!
        </p>
      )}

      {/* Status button */}
      <button
        disabled={isDisabled}
        className={cn(
          'mt-6 w-full max-w-lg min-h-[44px] rounded-lg text-[16px] font-[800]',
          isDisabled
            ? 'bg-[var(--myb-neutral-3)] text-white cursor-not-allowed'
            : 'bg-[var(--myb-primary-blue)] text-white hover:bg-[var(--myb-blue-dark)]'
        )}
      >
        {buttonLabel}
      </button>
    </section>
  )
}
