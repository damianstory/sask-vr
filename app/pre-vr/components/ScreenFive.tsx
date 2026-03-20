'use client'

import { useState, useRef } from 'react'
import { content } from '@/content/config'
import { useSession } from '@/context/SessionContext'
import { generateCardPng } from '@/lib/generate-card'
import { getGradientVariant } from '@/lib/card-gradients'
import { cn } from '@/lib/utils'
import { trackIconSelect, trackNameEntered, trackCardDownload } from '@/lib/analytics'
import IconPicker from './IconPicker'
import TaskTagChips from './TaskTagChips'
import CardPreview from './CardPreview'

interface ScreenFiveProps {
  onNext?: () => void
}

export default function ScreenFive({ onNext }: ScreenFiveProps) {
  const {
    firstName,
    selectedIcon,
    selectedTiles,
    setFirstName,
    setSelectedIcon,
    setGeneratedCardUrl,
  } = useSession()

  const [nameError, setNameError] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const nameEnteredRef = useRef(false)

  const data = content.screenFive
  const trimmedName = firstName.trim()
  const canDownload = trimmedName.length > 0 && selectedIcon !== null
  const gradientVariant = getGradientVariant(selectedTiles)
  const selectedIconData = data.icons.find((i) => i.id === selectedIcon)
  const taskLabels = selectedTiles
    .map((id) => content.screenTwo.tiles.find((t) => t.id === id)?.title)
    .filter(Boolean) as string[]

  async function handleDownload() {
    if (!canDownload || !selectedIconData) return
    setIsDownloading(true)
    try {
      const blob = await generateCardPng({
        name: trimmedName,
        iconEmoji: selectedIconData.emoji,
        taskLabels,
        gradientVariant,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'carpenter-card.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setGeneratedCardUrl(url)
      setIsDownloaded(true)
      trackCardDownload()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="flex flex-col items-center px-4 py-8">
      {/* Heading */}
      <h2 className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      {/* Side-by-side layout on md+, stacked on mobile */}
      <div className="mt-6 flex w-full max-w-4xl flex-col gap-8 md:flex-row">
        {/* Left panel: Controls */}
        <div className="flex flex-col gap-6 md:w-1/2">
          {/* Name input section */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="card-name"
              className="text-[14px] font-[300] text-[var(--myb-neutral-4)]"
            >
              {data.nameInputLabel}
            </label>
            <input
              id="card-name"
              type="text"
              maxLength={30}
              value={firstName}
              placeholder={data.nameInputPlaceholder}
              onChange={(e) => {
                const val = e.target.value
                setFirstName(val)
                setNameError(false)
                if (val.trim().length > 0 && !nameEnteredRef.current) {
                  nameEnteredRef.current = true
                  trackNameEntered()
                }
              }}
              onBlur={() => {
                if (firstName.trim().length === 0 && firstName.length > 0)
                  setNameError(true)
              }}
              className="w-full rounded-xl border border-[var(--myb-neutral-2)] bg-white px-4 py-3 text-[16px] font-[300] text-[var(--myb-navy)] placeholder:text-[var(--myb-neutral-4)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)]"
            />
            {nameError && (
              <p className="mt-1 text-[14px] font-[300] text-red-500">
                Please enter your first name
              </p>
            )}
          </div>

          {/* Icon picker section */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              {data.iconSelectionLabel}
            </p>
            <IconPicker
              icons={data.icons}
              selectedIcon={selectedIcon}
              onSelect={(iconId) => { trackIconSelect(iconId); setSelectedIcon(iconId) }}
            />
          </div>

          {/* Task tag chips section */}
          <TaskTagChips tileIds={selectedTiles} />
        </div>

        {/* Right panel: Preview + Download */}
        <div className="flex flex-col items-center gap-4 md:w-1/2">
          {/* Card preview */}
          <CardPreview
            name={trimmedName}
            iconEmoji={selectedIconData?.emoji ?? null}
            taskLabels={taskLabels}
            gradientVariant={gradientVariant}
          />

          {/* Download button or celebration */}
          {!isDownloaded ? (
            <button
              disabled={!canDownload || isDownloading}
              onClick={handleDownload}
              className={cn(
                'w-full max-w-lg min-h-[44px] rounded-lg text-[16px] font-[800]',
                canDownload && !isDownloading
                  ? 'bg-[var(--myb-primary-blue)] text-white hover:bg-[var(--myb-blue-dark)]'
                  : 'bg-[var(--myb-neutral-3)] text-white cursor-not-allowed'
              )}
            >
              {isDownloading ? 'Saving...' : data.downloadButtonLabel}
            </button>
          ) : (
            <div className="flex w-full max-w-lg flex-col items-center gap-4 animate-[scale-fade-in_300ms_ease-out]">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  <svg
                    width="16"
                    height="16"
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
                <p className="text-[16px] font-[800] text-[var(--myb-navy)]">
                  Your card is saved!
                </p>
              </div>
              <button
                onClick={onNext}
                className="w-full min-h-[44px] rounded-lg bg-[var(--myb-primary-blue)] text-[16px] font-[800] text-white hover:bg-[var(--myb-blue-dark)]"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
