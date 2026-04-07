'use client'

import { useState, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import { trackVideoNavigate } from '@/lib/analytics'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.videoSnippets

export default function ScreenVideo({ onComplete }: { onComplete?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedInSession, setCompletedInSession] = useState(false)
  const regionRef = useRef<HTMLDivElement>(null)

  const currentVideo = data.videos[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === data.videos.length - 1

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= data.videos.length) return

      if (nextIndex === data.videos.length - 1 && !completedInSession) {
        onComplete?.()
        setCompletedInSession(true)
      }

      setCurrentIndex(nextIndex)
      trackVideoNavigate(data.videos[nextIndex].id, direction)
      regionRef.current?.focus()
    },
    [completedInSession, currentIndex, onComplete],
  )

  return (
    <PreVRScreenShell
      eyebrow="Video Snippets"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="min-h-0"
    >
      <div
        ref={regionRef}
        role="region"
        aria-label="Video carousel"
        tabIndex={-1}
        className="mx-auto flex h-full min-h-0 w-full max-w-[460px] flex-col items-center outline-none md:max-w-none"
      >
        <div className="grid min-h-0 w-full flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 md:gap-4">
          <button
            type="button"
            aria-label="Show previous video"
            disabled={isFirst}
            onClick={() => navigate('prev')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex min-h-0 items-center justify-center">
            <div className="relative w-full max-w-[320px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--myb-neutral-1)] md:max-w-[360px]">
              <div
                className="relative mx-auto aspect-[9/16] w-full max-h-[52svh] md:max-h-[56svh]"
                style={{ minHeight: '320px' }}
              >
              <iframe
                key={currentVideo.youtubeId + currentVideo.id}
                src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0`}
                title={currentVideo.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Show next video"
            disabled={isLast}
            onClick={() => navigate('next')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--myb-neutral-2)] text-[var(--myb-navy)] transition-colors hover:bg-[var(--myb-light-blue-soft)] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="mt-4 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          {currentVideo.title}
        </p>
        <p className="mt-1 text-center text-[13px] font-[300] text-[var(--myb-neutral-3)]">
          {currentIndex + 1} of {data.videos.length}
        </p>
      </div>
    </PreVRScreenShell>
  )
}
