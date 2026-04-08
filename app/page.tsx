'use client'

import { useRouter } from 'next/navigation'
import { content } from '@/content/config'
import { trackPathSelect } from '@/lib/analytics'

export default function LandingPage() {
  const router = useRouter()

  return (
    <main
      id="main-content"
      className="relative isolate flex min-h-screen flex-col overflow-hidden px-4 py-10 md:px-6 md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-[color:rgba(0,146,255,0.12)] blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-[color:rgba(198,231,255,0.8)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-[var(--max-content-width)] flex-1 flex-col items-center justify-center">
        <div className="mb-10">
          <img
            src="/logos/myblueprint-logo.png"
            alt="myBlueprint logo"
            className="h-8 w-auto md:h-10"
          />
        </div>

        <div className="max-w-3xl text-center">
          <h1 className="text-center text-[28px] font-[800] leading-[1.1] text-[var(--myb-navy)] md:text-[40px]">
            {content.meta.occupationTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)] md:text-[20px] md:leading-[1.6]">
            Choose the stage that matches where you are right now, then step into a focused experience built around your VR journey.
          </p>
        </div>

        <div className="mt-10 grid w-full max-w-[824px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <button
            onClick={() => {
              trackPathSelect('pre_vr')
              router.push('/pre-vr')
            }}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[var(--radius-card)] border-2 border-transparent bg-[var(--myb-light-blue)] p-6 text-left transition-all duration-[var(--motion-medium)] hover:-translate-y-1 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus:border-[var(--myb-primary-blue)] focus:ring-4 focus:ring-[var(--myb-primary-blue)] focus:ring-offset-4 focus:ring-offset-[var(--myb-off-white)] focus-visible:border-[var(--myb-primary-blue)] focus-visible:ring-4 focus-visible:ring-[var(--myb-primary-blue)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--myb-off-white)] md:min-h-[300px] md:p-8"
            aria-label={`Start Pre-VR experience: ${content.meta.landingDescription}`}
          >
            <div className="absolute -left-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[var(--myb-off-white)] bg-white shadow-[var(--shadow-float)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[var(--myb-primary-blue)]"
                aria-hidden="true"
              >
                <path d="M5 19L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 5H19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-10 translate-y-10 rounded-full bg-[color:rgba(255,255,255,0.35)]" />
            <div className="relative z-10 flex h-full flex-col">
              <span className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-navy-light)]">
                Start Your Journey
              </span>
              <span className="mt-5 text-[28px] font-[800] leading-[1.05] text-[var(--myb-navy)] md:text-[32px]">
                I&apos;m about to do VR
              </span>
              <p className="mt-4 max-w-[20rem] text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
                {content.meta.landingDescription}
              </p>
              <div className="mt-auto flex items-center gap-3 text-[15px] font-[800] text-[var(--myb-primary-blue)] transition-all duration-[var(--motion-medium)] group-hover:gap-4">
                <span>Begin mission</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              trackPathSelect('post_vr')
              router.push('/post-vr')
            }}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[var(--radius-card)] border-2 border-transparent bg-[var(--myb-light-blue-soft)] p-6 text-left transition-all duration-[var(--motion-medium)] hover:-translate-y-1 hover:border-[var(--myb-primary-blue)] hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus:border-[var(--myb-primary-blue)] focus:ring-4 focus:ring-[var(--myb-primary-blue)] focus:ring-offset-4 focus:ring-offset-[var(--myb-off-white)] focus-visible:border-[var(--myb-primary-blue)] focus-visible:ring-4 focus-visible:ring-[var(--myb-primary-blue)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--myb-off-white)] md:min-h-[300px] md:p-8"
            aria-label={`Go to Post-VR reflection: Reflect on your VR ${content.meta.displayName.toLowerCase()} experience`}
          >
            <div className="absolute -left-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[var(--myb-off-white)] bg-white shadow-[var(--shadow-float)]">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[var(--myb-primary-blue)]"
                aria-hidden="true"
              >
                <path d="M12 3L14.6 8.27L20.42 9.12L16.21 13.22L17.2 19L12 16.27L6.8 19L7.79 13.22L3.58 9.12L9.4 8.27L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-10 translate-y-10 rounded-full bg-[color:rgba(34,34,76,0.06)]" />
            <div className="relative z-10 flex h-full flex-col">
              <span className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-navy-light)]">
                Level Completed
              </span>
              <span className="mt-5 text-[28px] font-[800] leading-[1.05] text-[var(--myb-navy)] md:text-[32px]">
                I just finished VR
              </span>
              <p className="mt-4 max-w-[20rem] text-[16px] font-[300] leading-[1.75] text-[var(--myb-neutral-5)]">
                Reflect on what you just experienced and turn it into a clear next step.
              </p>
              <div className="mt-auto flex items-center gap-3 text-[15px] font-[800] text-[var(--myb-primary-blue)] transition-all duration-[var(--motion-medium)] group-hover:gap-4">
                <span>Review mastery</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  )
}
