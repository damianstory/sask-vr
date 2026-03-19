import { content } from '@/content/config'

const data = content.screenThree

export default function ScreenThree() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 flex w-full max-w-lg items-center justify-center rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] aspect-[16/9]">
        <span className="text-[16px] font-[300] text-[var(--myb-neutral-4)]">
          Map placeholder
        </span>
      </div>

      <div className="mt-4 flex w-full max-w-lg flex-wrap gap-2">
        {data.employers.map((employer) => (
          <div
            key={employer.id}
            className="rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] px-3 py-2"
          >
            <span className="text-sm font-[300] text-[var(--myb-neutral-5)]">
              {employer.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
