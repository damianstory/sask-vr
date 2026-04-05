'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks'
import { computeRankingScore, shuffleArray, type RankingResult } from '@/lib/scoring'
import { trackRankingSubmit, trackRankingScore } from '@/lib/analytics'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const data = content.taskRanking
const tileMap = new Map(data.tiles.map((t) => [t.id, t]))

// ---------------------------------------------------------------------------
// SortableItem
// ---------------------------------------------------------------------------

function SortableItem({
  id,
  rank,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  upRef,
  downRef,
}: {
  id: string
  rank: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  upRef: (el: HTMLButtonElement | null) => void
  downRef: (el: HTMLButtonElement | null) => void
}) {
  const tile = tileMap.get(id)!
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      data-tile-id={id}
      className={cn(
        'flex items-center gap-3 rounded-[var(--radius-card)] border bg-white px-4 py-3 transition-shadow',
        isDragging
          ? 'border-[var(--myb-primary-blue)] shadow-[var(--shadow-card-hover)] opacity-90'
          : 'border-[var(--myb-neutral-2)]'
      )}
    >
      {/* Rank number */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--myb-navy)] text-[13px] font-[800] text-white">
        {rank}
      </span>

      {/* Drag handle */}
      <button
        type="button"
        className="flex shrink-0 cursor-grab touch-none items-center text-[var(--myb-neutral-3)] active:cursor-grabbing"
        aria-label={`Drag to reorder ${tile.title}`}
        {...attributes}
        {...listeners}
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="4" r="1.5" />
          <circle cx="11" cy="4" r="1.5" />
          <circle cx="5" cy="10" r="1.5" />
          <circle cx="11" cy="10" r="1.5" />
          <circle cx="5" cy="16" r="1.5" />
          <circle cx="11" cy="16" r="1.5" />
        </svg>
      </button>

      {/* Tile info */}
      <span className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[20px]">{tile.emoji}</span>
        <span className="text-[16px] font-[800] text-[var(--myb-navy)] truncate">
          {tile.title}
        </span>
      </span>

      {/* Up/down buttons */}
      <div className="flex shrink-0 flex-col gap-0.5">
        <button
          ref={upRef}
          type="button"
          disabled={isFirst}
          onClick={onMoveUp}
          aria-label={`Move ${tile.title} up`}
          className={cn(
            'flex h-[44px] w-[44px] items-center justify-center rounded-[var(--radius-input)]',
            'transition-colors focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
            isFirst
              ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
              : 'text-[var(--myb-navy)] hover:bg-[var(--myb-light-blue-soft)]'
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M5 12L12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          ref={downRef}
          type="button"
          disabled={isLast}
          onClick={onMoveDown}
          aria-label={`Move ${tile.title} down`}
          className={cn(
            'flex h-[44px] w-[44px] items-center justify-center rounded-[var(--radius-input)]',
            'transition-colors focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
            isLast
              ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
              : 'text-[var(--myb-navy)] hover:bg-[var(--myb-light-blue-soft)]'
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M19 12L12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------

function Reveal({ result, items }: { result: RankingResult; items: string[] }) {
  const reduced = useReducedMotion()

  return (
    <div className="mt-8 w-full">
      <div className="mx-auto max-w-3xl text-center">
        <h3
          className={`text-[28px] font-[800] text-[var(--myb-navy)] ${
            reduced ? '' : 'animate-stat-fade-in opacity-0'
          }`}
          style={reduced ? undefined : { animationDelay: '200ms' }}
        >
          You matched {result.score} out of {items.length}!
        </h3>
        <p
          className={`mt-2 text-[14px] font-[300] text-[var(--myb-neutral-4)] ${
            reduced ? '' : 'animate-stat-fade-in opacity-0'
          }`}
          style={reduced ? undefined : { animationDelay: '400ms' }}
        >
          {data.reveal.subtext}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Left: Your Ranking */}
        <div
          className={`rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white p-5 ${
            reduced ? '' : 'animate-stat-fade-in opacity-0'
          }`}
          style={reduced ? undefined : { animationDelay: '600ms' }}
        >
          <h4 className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            Your Ranking
          </h4>
          <ul className="mt-4 flex flex-col gap-2">
            {items.map((id, i) => {
              const tile = tileMap.get(id)!
              const matched = result.matchedPositions[i]
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-[var(--myb-light-blue-soft)] px-3 py-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--myb-navy)] text-[11px] font-[800] text-white">
                    {i + 1}
                  </span>
                  <span className="text-[16px]">{tile.emoji}</span>
                  <span className="flex-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                    {tile.title}
                  </span>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      matched ? 'bg-green-100 text-green-600' : 'bg-amber-50 text-amber-400'
                    )}
                    aria-label={matched ? 'Correct position' : 'Different position'}
                  >
                    {matched ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M3 7l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-current" />
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right: Actual Job Weight */}
        <div
          className={`rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white p-5 ${
            reduced ? '' : 'animate-stat-fade-in opacity-0'
          }`}
          style={reduced ? undefined : { animationDelay: '800ms' }}
        >
          <h4 className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
            Actual Job Weight
          </h4>
          <ul className="mt-4 flex flex-col gap-2">
            {result.tieGroups.map((group) => {
              const isTied = group.ids.length > 1
              const posLabel =
                group.positions.length === 1
                  ? `${group.positions[0] + 1}`
                  : `${group.positions[0] + 1}–${group.positions[group.positions.length - 1] + 1}`

              return (
                <li key={group.weight} className="flex flex-col gap-1">
                  {isTied ? (
                    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--myb-neutral-3)] bg-[var(--myb-light-blue-soft)] px-3 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-neutral-4)]">
                          Tied — Positions {posLabel}
                        </span>
                        <span className="text-[13px] font-[800] text-[var(--myb-primary-blue)]">
                          {group.weight}% each
                        </span>
                      </div>
                      <div className="mt-2 flex flex-col gap-1">
                        {group.ids.map((id) => {
                          const tile = tileMap.get(id)!
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <span className="text-[16px]">{tile.emoji}</span>
                              <span className="text-[14px] font-[800] text-[var(--myb-navy)]">
                                {tile.title}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    group.ids.map((id) => {
                      const tile = tileMap.get(id)!
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-[var(--myb-light-blue-soft)] px-3 py-2"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--myb-navy)] text-[11px] font-[800] text-white">
                            {posLabel}
                          </span>
                          <span className="text-[16px]">{tile.emoji}</span>
                          <span className="flex-1 text-[14px] font-[800] text-[var(--myb-navy)]">
                            {tile.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-[4px] w-16 rounded-full bg-[var(--myb-neutral-1)]">
                              <div
                                className="h-[4px] rounded-full bg-[var(--myb-primary-blue)]"
                                style={{ width: `${group.weight}%` }}
                              />
                            </div>
                            <span className="text-[13px] font-[800] text-[var(--myb-primary-blue)]">
                              {group.weight}%
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ScreenTaskRanking
// ---------------------------------------------------------------------------

export default function ScreenTaskRanking({ onComplete }: { onComplete?: () => void }) {
  const {
    shuffledTileOrder,
    setShuffledTileOrder,
    rankedTiles,
    setRankedTiles,
    rankingSubmitted,
    setRankingSubmitted,
    setRankingScore,
  } = useSession()

  const [items, setItems] = useState<string[]>([])
  const [showReveal, setShowReveal] = useState(false)
  const [result, setResult] = useState<RankingResult | null>(null)

  // Refs keyed by tile ID for focus management after up/down moves
  const upRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const downRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Initialize on mount
  useEffect(() => {
    if (rankingSubmitted && rankedTiles.length > 0) {
      setItems(rankedTiles)
      setResult(computeRankingScore(rankedTiles, data.tiles))
      setShowReveal(true)
      return
    }

    if (shuffledTileOrder.length > 0) {
      setItems(shuffledTileOrder)
    } else {
      const tileIds = data.tiles.map((t) => t.id)
      const shuffled = shuffleArray(tileIds)
      setShuffledTileOrder(shuffled)
      setItems(shuffled)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }, [])

  const moveItem = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= items.length) return
      const tileId = items[index]
      setItems((prev) => arrayMove(prev, index, newIndex))
      // Restore focus after React re-renders
      requestAnimationFrame(() => {
        const refMap = direction === 'up' ? upRefs : downRefs
        refMap.current[tileId]?.focus()
      })
    },
    [items]
  )

  const handleSubmit = () => {
    const res = computeRankingScore(items, data.tiles)
    setRankedTiles(items)
    setRankingScore(res.score)
    setRankingSubmitted(true)
    trackRankingSubmit(items)
    trackRankingScore(res.score)
    onComplete?.()
    setResult(res)
    setShowReveal(true)
  }

  if (items.length === 0) return null

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
          {showReveal ? data.reveal.heading : data.heading}
        </h2>
        {!showReveal && (
          <>
            <p className="mt-3 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
              {data.subtext}
            </p>
            <p className="mt-4 inline-flex rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-4 py-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              {data.instruction}
            </p>
          </>
        )}
      </div>

      {showReveal && result ? (
        <Reveal result={result} items={items} />
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="mt-8 flex w-full flex-col gap-3">
                {items.map((id, i) => (
                  <SortableItem
                    key={id}
                    id={id}
                    rank={i + 1}
                    isFirst={i === 0}
                    isLast={i === items.length - 1}
                    onMoveUp={() => moveItem(i, 'up')}
                    onMoveDown={() => moveItem(i, 'down')}
                    upRef={(el) => { upRefs.current[id] = el }}
                    downRef={(el) => { downRefs.current[id] = el }}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-input)] px-5 py-4 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
            }}
          >
            Lock in my ranking
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  )
}
