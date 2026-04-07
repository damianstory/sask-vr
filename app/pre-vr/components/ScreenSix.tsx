import { content } from '@/content/config'
import PreVRScreenShell from './PreVRScreenShell'

const data = content.vrPrep

const promptIcons = [
  (
    <svg key="search" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14Z" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="eye" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6s10 6 10 6s-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  (
    <svg key="idea" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 13a4 4 0 1 1 8 0c0 1.6-.68 2.48-1.8 3.48c-.88.78-1.2 1.3-1.2 2.02h-2c0-.72-.32-1.24-1.2-2.02C8.68 15.48 8 14.6 8 13Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
]

export default function ScreenSix() {
  return (
    <PreVRScreenShell
      eyebrow="VR Prep"
      heading={data.heading}
      subtext={data.subtext}
      mode="fit"
      desktopLayout="split"
      bodyClassName="justify-center"
    >
      <div className="grid gap-4">
        {data.prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)]"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--myb-light-blue-soft)] text-[var(--myb-primary-blue)]"
              aria-hidden="true"
            >
              {promptIcons[index]}
            </span>
            <div>
              <p className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
                Notice
              </p>
              <p className="mt-2 text-[16px] font-[300] leading-[1.7] text-[var(--myb-neutral-5)]">
                {prompt.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PreVRScreenShell>
  )
}
