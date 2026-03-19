'use client'

import { useState } from 'react'
import { SessionProvider } from '@/context/SessionContext'
import ProgressBar from '@/components/ProgressBar'
import Navigation from '@/components/Navigation'
import ScreenOne from './components/ScreenOne'
import ScreenTwo from './components/ScreenTwo'
import ScreenThree from './components/ScreenThree'
import ScreenFour from './components/ScreenFour'
import ScreenFive from './components/ScreenFive'
import ScreenSix from './components/ScreenSix'

type ScreenNumber = 1 | 2 | 3 | 4 | 5 | 6

const screens: Record<ScreenNumber, React.ReactNode> = {
  1: <ScreenOne />,
  2: <ScreenTwo />,
  3: <ScreenThree />,
  4: <ScreenFour />,
  5: <ScreenFive />,
  6: <ScreenSix />,
}

export default function PreVRPage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenNumber>(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isInitialMount, setIsInitialMount] = useState(true)

  const goNext = () => {
    if (currentScreen < 6) {
      setDirection('forward')
      setCurrentScreen((prev) => (prev + 1) as ScreenNumber)
      setIsInitialMount(false)
    }
  }

  const goPrev = () => {
    if (currentScreen > 1) {
      setDirection('backward')
      setCurrentScreen((prev) => (prev - 1) as ScreenNumber)
      setIsInitialMount(false)
    }
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <ProgressBar current={currentScreen} total={6} />
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
            {screens[currentScreen]}
          </div>
        </div>
        <Navigation
          currentScreen={currentScreen}
          totalScreens={6}
          onNext={goNext}
          onPrev={goPrev}
        />
      </div>
    </SessionProvider>
  )
}
