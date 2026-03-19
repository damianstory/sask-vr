import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

const data = (content as OccupationContent).screenFive

export default function ScreenFive() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 w-full max-w-sm rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] p-4">
        <span className="text-sm font-[300] text-[var(--myb-neutral-4)]">
          {data.nameInputLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {data.icons.map((icon) => (
          <div
            key={icon.id}
            className="flex h-16 w-16 items-center justify-center rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)]"
          >
            <span className="text-xs font-[300] text-[var(--myb-neutral-4)]">
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 aspect-[1200/675] w-full max-w-lg rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)]" />
    </section>
  )
}
