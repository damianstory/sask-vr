import { content } from '@/content/config'

const data = content.vrPrep

const promptIcons = ['\uD83D\uDD0D', '\uD83D\uDC40', '\uD83D\uDCA1']

export default function ScreenSix() {
  return (
    <section className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-col px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
          VR Prep
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

      <div className="mt-8 flex flex-col gap-4">
        {data.prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-5 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)]"
          >
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--myb-light-blue-soft)] text-[20px]"
              aria-hidden="true"
            >
              {promptIcons[index]}
            </span>
            <div>
              <p className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[var(--myb-primary-blue)]">
                Notice
              </p>
              <p className="mt-2 text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
                {prompt.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
