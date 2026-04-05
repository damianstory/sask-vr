'use client'

import { useState, useRef, useCallback } from 'react'
import { content } from '@/content/config'
import { trackVideoNavigate } from '@/lib/analytics'

const data = content.videoSnippets

export default function ScreenVideo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const regionRef = useRef<HTMLDivElement>(null)

  const currentVideo = data.videos[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === data.videos.length - 1

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= data.videos.length) return

      setCurrentIndex(nextIndex)
      trackVideoNavigate(data.videos[nextIndex].id, direction)
      regionRef.current?.focus()
    },
    [currentIndex],
  )

  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          Video Snippets
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

      <div
        ref={regionRef}
        role="region"
        aria-label="Video carousel"
        tabIndex={-1}
        className="mx-auto mt-8 flex w-full max-w-[420px] flex-col items-center outline-none"
      >
        <div className="flex w-full items-center gap-3">
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

          <div className="flex-1">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--myb-neutral-1)]">
              <iframe
                key={currentVideo.youtubeId + currentVideo.id}
                src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0`}
                title={currentVideo.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
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

        <p className="mt-4 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
          {currentVideo.title}
        </p>
        <p className="mt-1 text-[13px] font-[300] text-[var(--myb-neutral-3)]">
          {currentIndex + 1} of {data.videos.length}
        </p>
      </div>
    </section>
  )
}
