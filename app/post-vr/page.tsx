import { content } from '@/content/config'

const data = content.postVr

export default function PostVRPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-[640px]">
        <h1 className="text-center text-[28px] font-[900] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
          {data.congratsHeading}
        </h1>
        <p className="mt-4 text-center text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
          {data.congratsSubtext}
        </p>

        <h2 className="mt-8 text-[22px] font-[900] text-[var(--myb-navy)] md:text-[28px]">
          {data.checklistHeading}
        </h2>

        <ul className="mt-4 space-y-3">
          {data.checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="h-6 w-6 flex-shrink-0 rounded border border-[var(--myb-neutral-2)] bg-[var(--myb-neutral-1)]" />
              <span className="text-[16px] font-[300] text-[var(--myb-neutral-5)]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm font-[300] text-[var(--myb-neutral-4)]">
          0 of {data.checklist.length} complete
        </p>

        <a
          href={data.myblueprintLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--myb-primary-blue)] px-6 py-3 text-[16px] font-[900] text-white hover:bg-[var(--myb-blue-dark)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[3px]"
        >
          {data.myblueprintLink.label}
        </a>
      </div>
    </main>
  )
}
