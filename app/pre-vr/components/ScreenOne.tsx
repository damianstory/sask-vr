import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

const data = (content as OccupationContent).screenOne

export default function ScreenOne() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.hookQuestion}
      </h2>

      <div className="mt-8 flex h-24 w-64 items-center justify-center rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)]">
        <span className="text-3xl font-[900] text-[var(--myb-navy)] md:text-5xl">
          ${data.salary.amount.toLocaleString()}
        </span>
      </div>

      <div className="mt-6 grid w-full max-w-lg gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] p-4"
          >
            <div className="text-2xl font-[900] text-[var(--myb-navy)]">
              {stat.value}
            </div>
            <div className="text-sm font-[300] text-[var(--myb-neutral-4)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
