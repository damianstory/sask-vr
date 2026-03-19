import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

const data = (content as OccupationContent).screenTwo

export default function ScreenTwo() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 grid w-full max-w-lg grid-cols-2 gap-4 lg:grid-cols-3">
        {data.tiles.map((tile) => (
          <div
            key={tile.id}
            className="min-h-[120px] rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] p-4"
          >
            <div className="text-[16px] font-[900] text-[var(--myb-navy)]">
              {tile.title}
            </div>
            <div className="mt-1 text-sm font-[300] text-[var(--myb-neutral-4)]">
              {tile.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
