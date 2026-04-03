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
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Card Builder
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
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--max-card-preview-width))] lg:items-start">
        <div className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="card-name"
                className="block text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]"
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
                className="w-full rounded-[var(--radius-input)] border border-[var(--myb-neutral-2)] bg-[var(--myb-light-blue-soft)] px-4 py-3 text-[16px] font-[300] text-[var(--myb-navy)] placeholder:text-[var(--myb-neutral-4)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
              />
              {nameError && (
                <p className="text-[14px] font-[300] text-red-500">
                  Please enter your first name
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]">
                {data.iconSelectionLabel}
              </p>
              <IconPicker
                icons={data.icons}
                selectedIcon={selectedIcon}
                onSelect={(iconId) => {
                  trackIconSelect(iconId)
                  setSelectedIcon(iconId)
                }}
              />
            </div>

            <TaskTagChips tileIds={selectedTiles} />
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-6 lg:sticky lg:top-28">
          <p className="mb-4 text-center text-[12px] font-[800] uppercase tracking-[0.2em] text-[var(--myb-primary-blue)]">
            Live Preview
          </p>
          <CardPreview
            name={trimmedName}
            iconEmoji={selectedIconData?.emoji ?? null}
            taskLabels={taskLabels}
            gradientVariant={gradientVariant}
          />

          {!isDownloaded ? (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={!canDownload || isDownloading}
                onClick={handleDownload}
                className={cn(
                  'flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[var(--radius-input)] px-5 py-4 text-[16px] font-[800] shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)]',
                  canDownload && !isDownloading
                    ? 'text-white hover:-translate-y-0.5'
                    : 'cursor-not-allowed bg-[var(--myb-neutral-3)] text-white'
                )}
                style={
                  canDownload && !isDownloading
                    ? {
                        backgroundImage:
                          'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
                      }
                    : undefined
                }
              >
                <span>{isDownloading ? 'Saving...' : data.downloadButtonLabel}</span>
              </button>
              <p className="text-center text-[12px] font-[300] leading-[1.6] text-[var(--myb-neutral-4)]">
                Add your name and choose an icon to unlock the PNG export.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-[var(--myb-light-blue-soft)] p-5 animate-[scale-fade-in_300ms_ease-out]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500">
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
                <p className="text-[18px] font-[800] text-[var(--myb-navy)]">
                  Your card is saved!
                </p>
              </div>
              <button
                type="button"
                onClick={onNext}
                className="w-full rounded-[var(--radius-input)] px-5 py-4 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] hover:-translate-y-0.5"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)',
                }}
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
