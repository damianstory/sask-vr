'use client'

import { useRouter } from 'next/navigation'
import { content } from '@/content/config'
import { trackPathSelect } from '@/lib/analytics'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo placeholder */}
      <img
        src="/logos/myblueprint-logo.svg"
        alt="myBlueprint logo"
        className="mb-6 h-10"
      />

      <h1 className="text-center text-[28px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[40px]">
        {content.meta.occupationTitle}
      </h1>

      <div className="mt-8 flex w-full max-w-[824px] flex-col gap-4 md:flex-row md:gap-6">
        {/* Pre-VR Card */}
        <button
          onClick={() => { trackPathSelect('pre_vr'); router.push('/pre-vr') }}
          className="flex min-h-[180px] flex-1 flex-col items-start rounded-xl border-2 border-transparent bg-[var(--myb-light-blue)] p-6 text-left transition-all hover:border-[var(--myb-primary-blue)] hover:shadow-[0_8px_24px_rgba(34,34,76,0.1)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[3px] md:min-h-[280px]"
          aria-label={`Start Pre-VR experience: ${content.meta.landingDescription}`}
        >
          <span className="text-[20px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[24px]">
            I&apos;m about to do VR
          </span>
          <p className="mt-2 text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
            {content.meta.landingDescription}
          </p>
        </button>

        {/* Post-VR Card */}
        <button
          onClick={() => { trackPathSelect('post_vr'); router.push('/post-vr') }}
          className="flex min-h-[180px] flex-1 flex-col items-start rounded-xl border-2 border-transparent bg-[var(--myb-light-blue)] p-6 text-left transition-all hover:border-[var(--myb-primary-blue)] hover:shadow-[0_8px_24px_rgba(34,34,76,0.1)] focus:outline-none focus:ring-[3px] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[3px] md:min-h-[280px]"
          aria-label={`Go to Post-VR reflection: Reflect on your VR ${content.meta.displayName.toLowerCase()} experience`}
        >
          <span className="text-[20px] font-[800] leading-[1.2] text-[var(--myb-navy)] md:text-[24px]">
            I just finished VR
          </span>
          <p className="mt-2 text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
            Reflect on what you just experienced.
          </p>
        </button>
      </div>
    </main>
  )
}
