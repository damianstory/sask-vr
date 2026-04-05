'use client'

import { useState, useEffect, useCallback, lazy, Suspense, type ComponentType } from 'react'
import { SessionProvider, useSession } from '@/context/SessionContext'
import ProgressBar from '@/components/ProgressBar'
import Navigation from '@/components/Navigation'
import ScreenVideo from './components/ScreenVideo'
import ScreenSalary from './components/ScreenSalary'
import ScreenSpeedRun from './components/ScreenSpeedRun'
import ScreenTaskRanking from './components/ScreenTaskRanking'
const ScreenThree = lazy(() => import('./components/ScreenThree'))
import ScreenFour from './components/ScreenFour'
import ScreenAI from './components/ScreenAI'
import ScreenSix from './components/ScreenSix'
import { trackScreenView } from '@/lib/analytics'

// ---------------------------------------------------------------------------
// Screen config
// ---------------------------------------------------------------------------

type ScreenComponent = ComponentType<{ onComplete?: () => void }>

interface ScreenConfig {
  key: string
  Component: ScreenComponent
  gated?: boolean
}

/** Suspense wrapper for the lazy-loaded employer map — local to this file. */
function ScreenThreeWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <p className="text-[14px] font-[300] text-[var(--myb-neutral-4)]">
            Loading map...
          </p>
        </div>
      }
    >
      <ScreenThree />
    </Suspense>
  )
}

const SCREENS: ScreenConfig[] = [
  { key: 'videoSnippets', Component: ScreenVideo },
  { key: 'salaryHook', Component: ScreenSalary },
  { key: 'speedRun', Component: ScreenSpeedRun },
  { key: 'taskRanking', Component: ScreenTaskRanking as ScreenComponent, gated: true },
  { key: 'employerMap', Component: ScreenThreeWrapper },
  { key: 'careerPathway', Component: ScreenFour },
  { key: 'aiSorting', Component: ScreenAI, gated: true },
  { key: 'vrPrep', Component: ScreenSix },
]

const TOTAL_SCREENS = SCREENS.length

// Screen key → snake_case analytics name
const analyticsName = (key: string) => key.replace(/([A-Z])/g, '_$1').toLowerCase()

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function PreVRFlow() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isInitialMount, setIsInitialMount] = useState(true)
  const [completedScreens, setCompletedScreens] = useState<Record<string, boolean>>({})

  const session = useSession()
  const config = SCREENS[currentScreen]

  // Derive completion for gated screens from session state on transition
  useEffect(() => {
    if (!config.gated) return

    let isComplete = false
    if (config.key === 'taskRanking') {
      isComplete = session.rankingSubmitted ?? false
    }
    if (config.key === 'aiSorting') {
      isComplete = session.aiSortComplete ?? false
    }

    if (isComplete && !completedScreens[config.key]) {
      setCompletedScreens((prev) => ({ ...prev, [config.key]: true }))
    }
  }, [currentScreen, config.key, config.gated, session.rankingSubmitted, session.aiSortComplete, completedScreens])

  const isScreenComplete = !config.gated || !!completedScreens[config.key]

  const handleComplete = useCallback(() => {
    setCompletedScreens((prev) => ({ ...prev, [config.key]: true }))
  }, [config.key])

  // Focus heading after each transition
  const focusHeading = useCallback((retryUntilFound: boolean) => {
    let frameId: number | null = null
    let cancelled = false

    const tryFocus = () => {
      if (cancelled) return
      const heading = document.querySelector('[data-screen-heading]')
      if (heading instanceof HTMLElement) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: false })
        return
      }
      if (retryUntilFound) {
        frameId = requestAnimationFrame(tryFocus)
      }
    }

    frameId = requestAnimationFrame(tryFocus)
    return () => {
      cancelled = true
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    trackScreenView(analyticsName(config.key))
  }, [currentScreen, config.key])

  useEffect(() => {
    // Employer map lazy-loads — retry focus until heading exists
    const isEmployerMap = config.key === 'employerMap'
    return focusHeading(isEmployerMap)
  }, [currentScreen, config.key, focusHeading])

  const goNext = () => {
    if (currentScreen < TOTAL_SCREENS - 1) {
      setDirection('forward')
      setCurrentScreen((prev) => prev + 1)
      setIsInitialMount(false)
    }
  }

  const goPrev = () => {
    if (currentScreen > 0) {
      setDirection('backward')
      setCurrentScreen((prev) => prev - 1)
      setIsInitialMount(false)
    }
  }

  const ScreenComponent = config.Component

  return (
    <div id="main-content" className="flex min-h-screen flex-col">
      <ProgressBar current={currentScreen + 1} total={TOTAL_SCREENS} />
      <div className="relative flex-1 overflow-hidden">
        <div
          key={currentScreen}
          className={
            isInitialMount
              ? ''
              : direction === 'forward'
                ? 'animate-slide-left'
                : 'animate-slide-right'
          }
        >
          <ScreenComponent
            onComplete={config.gated ? handleComplete : undefined}
          />
        </div>
      </div>
      <Navigation
        currentScreen={currentScreen + 1}
        totalScreens={TOTAL_SCREENS}
        onNext={goNext}
        onPrev={goPrev}
        hideNext={!isScreenComplete}
      />
    </div>
  )
}

export default function PreVRPage() {
  return (
    <SessionProvider>
      <PreVRFlow />
    </SessionProvider>
  )
}
