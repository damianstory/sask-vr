'use client'

import { useState, useCallback, useRef } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'
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
import PreVRScreenShell from './PreVRScreenShell'

const data = content.taskRanking
const tileMap = new Map(data.tiles.map((t) => [t.id, t]))

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
        'flex items-center gap-3 rounded-[var(--radius-card)] border bg-white px-4 py-2.5 transition-shadow',
        isDragging
          ? 'border-[var(--myb-primary-blue)] shadow-[var(--shadow-card-hover)] opacity-90'
          : 'border-[var(--myb-neutral-2)]'
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--myb-navy)] text-[13px] font-[800] text-white">
        {rank}
      </span>

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

      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-[18px]">{tile.emoji}</span>
        <span className="truncate text-[15px] font-[800] text-[var(--myb-navy)]">
          {tile.title}
        </span>
      </span>

      <div className="flex shrink-0 gap-1">
        <button
          ref={upRef}
          type="button"
          disabled={isFirst}
          onClick={onMoveUp}
          aria-label={`Move ${tile.title} up`}
          className={cn(
            'flex h-[40px] w-[40px] items-center justify-center rounded-[var(--radius-input)] transition-colors focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
            isFirst
              ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
              : 'text-[var(--myb-navy)] hover:bg-[var(--myb-light-blue-soft)]'
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          ref={downRef}
          type="button"
          disabled={isLast}
          onClick={onMoveDown}
          aria-label={`Move ${tile.title} down`}
          className={cn(
            'flex h-[40px] w-[40px] items-center justify-center rounded-[var(--radius-input)] transition-colors focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
            isLast
              ? 'cursor-not-allowed text-[var(--myb-neutral-3)]'
              : 'text-[var(--myb-navy)] hover:bg-[var(--myb-light-blue-soft)]'
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  )
}

function Reveal({
  result,
  items,
  revealTab,
  setRevealTab,
}: {
  result: RankingResult
  items: string[]
  revealTab: 'ranking' | 'weight'
  setRevealTab: (tab: 'ranking' | 'weight') => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-5 shadow-[var(--shadow-float)]">
        <h3 className="text-[26px] font-[800] text-[var(--myb-navy)]">
          You matched {result.score} out of {items.length}!
        </h3>
        <p className="mt-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          {data.reveal.subtext}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRevealTab('ranking')}
          aria-pressed={revealTab === 'ranking'}
          className={cn(
            'rounded-[var(--radius-pill)] px-4 py-2 text-[13px] font-[800] uppercase tracking-[0.14em] transition-colors',
            revealTab === 'ranking'
              ? 'bg-[var(--myb-primary-blue)] text-white'
              : 'bg-[var(--myb-light-blue-soft)] text-[var(--myb-primary-blue)]'
          )}
        >
          Your Ranking
        </button>
        <button
          type="button"
          onClick={() => setRevealTab('weight')}
          aria-pressed={revealTab === 'weight'}
          className={cn(
            'rounded-[var(--radius-pill)] px-4 py-2 text-[13px] font-[800] uppercase tracking-[0.14em] transition-colors',
            revealTab === 'weight'
              ? 'bg-[var(--myb-primary-blue)] text-white'
              : 'bg-[var(--myb-light-blue-soft)] text-[var(--myb-primary-blue)]'
          )}
        >
          Actual Job Weight
        </button>
      </div>

      <div className="rounded-[var(--radius-panel)] border border-[var(--myb-neutral-2)] bg-white/90 p-5 shadow-[var(--shadow-float)]">
        {revealTab === 'ranking' ? (
          <ul className="flex flex-col gap-2">
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
                        <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-current" />
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2">
            {result.tieGroups.map((group) => {
              const isTied = group.ids.length > 1
              const posLabel =
                group.positions.length === 1
                  ? `${group.positions[0] + 1}`
                  : `${group.positions[0] + 1}-${group.positions[group.positions.length - 1] + 1}`

              return (
                <li key={group.weight} className="flex flex-col gap-2">
                  {isTied ? (
                    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--myb-neutral-3)] bg-[var(--myb-light-blue-soft)] px-3 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-[800] uppercase tracking-[0.16em] text-[var(--myb-neutral-4)]">
                          Tied - Positions {posLabel}
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
                          <span className="text-[13px] font-[800] text-[var(--myb-primary-blue)]">
                            {group.weight}%
                          </span>
                        </div>
                      )
                    })
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

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

  const initialItems =
    rankingSubmitted && rankedTiles.length > 0
      ? rankedTiles
      : shuffledTileOrder.length > 0
        ? shuffledTileOrder
        : shuffleArray(data.tiles.map((t) => t.id))

  const initialResult =
    rankingSubmitted && rankedTiles.length > 0
      ? computeRankingScore(rankedTiles, data.tiles)
      : null

  const [items, setItems] = useState<string[]>(initialItems)
  const [showReveal, setShowReveal] = useState(Boolean(initialResult))
  const [result, setResult] = useState<RankingResult | null>(initialResult)
  const [revealTab, setRevealTab] = useState<'ranking' | 'weight'>('ranking')

  const upRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const downRefs = useRef<Record<string, HTMLButtonElement | null>>({})

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
    if (shuffledTileOrder.length === 0) {
      setShuffledTileOrder(items)
    }
    trackRankingSubmit(items)
    trackRankingScore(res.score)
    onComplete?.()
    setResult(res)
    setShowReveal(true)
    setRevealTab('ranking')
  }

  if (items.length === 0) return null

  return (
    <PreVRScreenShell
      eyebrow="Discovery Phase"
      heading={showReveal ? data.reveal.heading : data.heading}
      subtext={showReveal ? undefined : data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      {showReveal && result ? (
        <Reveal result={result} items={items} revealTab={revealTab} setRevealTab={setRevealTab} />
      ) : (
        <div className="flex h-full min-h-0 flex-col gap-4">
          <p className="inline-flex self-start rounded-[var(--radius-pill)] bg-[var(--myb-light-blue-soft)] px-4 py-2 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
            {data.instruction}
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <ul className="flex flex-col gap-2">
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
            className="mt-auto flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-input)] px-5 py-4 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
            }}
          >
            Lock in my ranking
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </PreVRScreenShell>
  )
}
