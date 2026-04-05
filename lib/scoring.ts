export interface TieGroup {
  ids: string[]
  weight: number
  positions: number[] // 0-indexed
}

export interface RankingResult {
  score: number
  matchedPositions: boolean[]
  tieGroups: TieGroup[]
}

/**
 * Compute how well a user's ranking matches the actual weight-based order.
 * Tiles with equal weights form tie groups — any arrangement within a group
 * is considered correct.
 *
 * Invariant: rankedOrder.length must equal tiles.length.
 */
export function computeRankingScore(
  rankedOrder: string[],
  tiles: Array<{ id: string; weight?: number }>
): RankingResult {
  if (rankedOrder.length !== tiles.length) {
    throw new Error(
      `rankedOrder length (${rankedOrder.length}) must equal tiles length (${tiles.length})`
    )
  }

  // Sort tiles by weight descending (stable by original index for ties)
  const sorted = [...tiles].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))

  // Build tie groups
  const tieGroups: TieGroup[] = []
  let pos = 0
  while (pos < sorted.length) {
    const weight = sorted[pos].weight ?? 0
    const ids: string[] = []
    const positions: number[] = []
    while (pos < sorted.length && (sorted[pos].weight ?? 0) === weight) {
      ids.push(sorted[pos].id)
      positions.push(pos)
      pos++
    }
    tieGroups.push({ ids, weight, positions })
  }

  // Build a lookup: tileId → set of valid positions
  const validPositions = new Map<string, Set<number>>()
  for (const group of tieGroups) {
    const posSet = new Set(group.positions)
    for (const id of group.ids) {
      validPositions.set(id, posSet)
    }
  }

  // Score each position
  const matchedPositions = rankedOrder.map((id, i) => {
    const valid = validPositions.get(id)
    return valid ? valid.has(i) : false
  })

  return {
    score: matchedPositions.filter(Boolean).length,
    matchedPositions,
    tieGroups,
  }
}

/**
 * Fisher-Yates shuffle. Returns a new array (does not mutate input).
 * Accepts injectable random function for deterministic testing.
 */
export function shuffleArray<T>(arr: T[], random: () => number = Math.random): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
