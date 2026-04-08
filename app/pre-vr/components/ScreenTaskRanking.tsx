import PreVRScreenShell from './PreVRScreenShell'

export default function ScreenTaskRanking({ onComplete }: { onComplete?: () => void }) {
  return (
    <PreVRScreenShell
      eyebrow="Discovery Phase"
      heading="What do carpenters do on the job?"
      mode="fit"
      desktopLayout="split"
      bodyClassName="flex items-center justify-center"
    >
      <img
        src="/pre-vr/carpenter-job-infographic.png"
        alt="Infographic showing carpenter job duties including reading blueprints, preparing layouts, measuring and cutting materials, building foundations, and maintaining structures — Saskatchewan Apprenticeship and Trade Certification Commission"
        className="max-h-[70vh] w-auto max-w-full object-contain"
      />
    </PreVRScreenShell>
  )
}
