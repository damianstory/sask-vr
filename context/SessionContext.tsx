'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AiSortResult {
  taskId: string
  chosen: 'ai' | 'human'
  correct: boolean
}

interface SessionState {
  firstName: string
  shuffledTileOrder: string[]
  rankedTiles: string[]
  rankingSubmitted: boolean
  rankingScore: number | null
  aiSortResults: AiSortResult[] | null
  aiSortComplete: boolean
}

interface SessionContextValue extends SessionState {
  setFirstName: (name: string) => void
  setShuffledTileOrder: (order: string[]) => void
  setRankedTiles: (tiles: string[]) => void
  setRankingSubmitted: (submitted: boolean) => void
  setRankingScore: (score: number | null) => void
  setAiSortResults: (results: AiSortResult[] | null) => void
  setAiSortComplete: (complete: boolean) => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [firstName, setFirstName] = useState('')
  const [shuffledTileOrder, setShuffledTileOrder] = useState<string[]>([])
  const [rankedTiles, setRankedTiles] = useState<string[]>([])
  const [rankingSubmitted, setRankingSubmitted] = useState(false)
  const [rankingScore, setRankingScore] = useState<number | null>(null)
  const [aiSortResults, setAiSortResults] = useState<AiSortResult[] | null>(null)
  const [aiSortComplete, setAiSortComplete] = useState(false)

  return (
    <SessionContext.Provider
      value={{
        firstName,
        shuffledTileOrder,
        rankedTiles,
        rankingSubmitted,
        rankingScore,
        aiSortResults,
        aiSortComplete,
        setFirstName,
        setShuffledTileOrder,
        setRankedTiles,
        setRankingSubmitted,
        setRankingScore,
        setAiSortResults,
        setAiSortComplete,
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
