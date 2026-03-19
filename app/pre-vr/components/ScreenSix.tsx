import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

const data = (content as OccupationContent).screenSix

export default function ScreenSix() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 w-full max-w-lg">
        {data.prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="mb-3 rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] p-4"
          >
            <span className="text-[16px] font-[300] text-[var(--myb-neutral-5)]">
              {prompt.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
