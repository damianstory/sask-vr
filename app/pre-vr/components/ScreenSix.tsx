import { content } from '@/content/config'

const data = content.screenSix

const promptIcons = ['\uD83D\uDD0D', '\uD83D\uDC40', '\uD83D\uDCA1']

export default function ScreenSix() {
  return (
    <section className="mx-auto max-w-[640px] px-4 py-8">
      <h2 className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {data.prompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className="flex items-start gap-3 rounded-xl bg-[var(--myb-light-blue-soft)] p-4"
          >
            <span
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-[20px]"
              aria-hidden="true"
            >
              {promptIcons[index]}
            </span>
            <p className="text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
              {prompt.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
