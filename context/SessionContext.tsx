'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface SessionState {
  selectedTiles: string[]
  firstName: string
  selectedIcon: string | null
  generatedCardUrl: string | null
}

interface SessionContextValue extends SessionState {
  setSelectedTiles: (tiles: string[]) => void
  setFirstName: (name: string) => void
  setSelectedIcon: (iconId: string | null) => void
  setGeneratedCardUrl: (url: string | null) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [selectedTiles, setSelectedTiles] = useState<string[]>([])
  const [firstName, setFirstName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null)

  return (
    <SessionContext.Provider
      value={{
        selectedTiles,
        firstName,
        selectedIcon,
        generatedCardUrl,
        setSelectedTiles,
        setFirstName,
        setSelectedIcon,
        setGeneratedCardUrl,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
