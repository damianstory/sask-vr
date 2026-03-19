import { content } from '@/content/config'

const data = content.screenFour

export default function ScreenFour() {
  return (
    <section className="flex flex-col items-center px-4 py-8">
      <h2 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {data.heading}
      </h2>
      <p className="mt-2 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
        {data.subtext}
      </p>

      <div className="mt-6 w-full max-w-lg">
        {data.steps.map((step) => (
          <div
            key={step.id}
            className="mb-3 rounded-xl border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)] p-4"
          >
            <div className="text-[16px] font-[900] text-[var(--myb-navy)]">
              {step.title}
            </div>
            <div className="text-sm font-[300] text-[var(--myb-neutral-4)]">
              {step.subtitle}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
