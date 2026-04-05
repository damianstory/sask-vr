import { describe, it, expect } from 'vitest'
import { computeRankingScore, shuffleArray } from '@/lib/scoring'

const tiles = [
  { id: 'task-framing', weight: 20 },
  { id: 'task-measuring', weight: 14 },
  { id: 'task-finishing', weight: 14 },
  { id: 'task-concrete', weight: 16 },
  { id: 'task-roofing', weight: 14 },
  { id: 'task-renovation', weight: 10 },
]

// Correct order by weight: framing(20), concrete(16), {measuring,finishing,roofing}(14), renovation(10)
const perfectOrder = [
  'task-framing',
  'task-concrete',
  'task-measuring',
  'task-finishing',
  'task-roofing',
  'task-renovation',
]

describe('computeRankingScore', () => {
  it('scores 6/6 for perfect order', () => {
    const result = computeRankingScore(perfectOrder, tiles)
    expect(result.score).toBe(6)
    expect(result.matchedPositions).toEqual([true, true, true, true, true, true])
  })

  it('gives full credit for any arrangement of 14% tiles in positions 3-5', () => {
    const order = [
      'task-framing',
      'task-concrete',
      'task-roofing',     // swapped with measuring
      'task-finishing',
      'task-measuring',   // swapped with roofing
      'task-renovation',
    ]
    const result = computeRankingScore(order, tiles)
    expect(result.score).toBe(6)
    expect(result.matchedPositions).toEqual([true, true, true, true, true, true])
  })

  it('gives full credit for another 14% permutation', () => {
    const order = [
      'task-framing',
      'task-concrete',
      'task-finishing',
      'task-roofing',
      'task-measuring',
      'task-renovation',
    ]
    const result = computeRankingScore(order, tiles)
    expect(result.score).toBe(6)
  })

  it('scores partial correctness', () => {
    const order = [
      'task-framing',      // correct (pos 0)
      'task-renovation',   // wrong (should be concrete)
      'task-measuring',    // wrong (pos 2 needs a 14% tile, but concrete should be at 1)
      'task-finishing',    // correct (14% group, pos 3)
      'task-roofing',     // correct (14% group, pos 4)
      'task-concrete',     // wrong (should be renovation)
    ]
    const result = computeRankingScore(order, tiles)
    // pos 0: framing → correct
    // pos 1: renovation → wrong (should be concrete)
    // pos 2: measuring → correct (14% tile in 14% group range 2-4)
    // pos 3: finishing → correct (14% tile in 14% group range 2-4)
    // pos 4: roofing → correct (14% tile in 14% group range 2-4)
    // pos 5: concrete → wrong (should be renovation)
    expect(result.matchedPositions).toEqual([true, false, true, true, true, false])
    expect(result.score).toBe(4)
  })

  it('scores reversed order', () => {
    const reversed = [...perfectOrder].reverse()
    const result = computeRankingScore(reversed, tiles)
    // renovation(pos0→wrong), roofing(pos1→wrong), finishing(pos2→14%group→correct),
    // measuring(pos3→14%group→correct), concrete(pos4→wrong), framing(pos5→wrong)
    expect(result.score).toBe(2)
  })

  it('produces 4 tie groups with correct structure', () => {
    const result = computeRankingScore(perfectOrder, tiles)
    expect(result.tieGroups).toHaveLength(4)

    expect(result.tieGroups[0]).toEqual({ ids: ['task-framing'], weight: 20, positions: [0] })
    expect(result.tieGroups[1]).toEqual({ ids: ['task-concrete'], weight: 16, positions: [1] })
    expect(result.tieGroups[2]).toEqual({
      ids: ['task-measuring', 'task-finishing', 'task-roofing'],
      weight: 14,
      positions: [2, 3, 4],
    })
    expect(result.tieGroups[3]).toEqual({ ids: ['task-renovation'], weight: 10, positions: [5] })
  })

  it('throws if rankedOrder length does not match tiles length', () => {
    expect(() => computeRankingScore(['task-framing'], tiles)).toThrow(
      'rankedOrder length (1) must equal tiles length (6)'
    )
  })
})

describe('shuffleArray', () => {
  it('returns a new array with all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result).not.toBe(input) // new array
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('does not mutate the input', () => {
    const input = ['a', 'b', 'c']
    const copy = [...input]
    shuffleArray(input)
    expect(input).toEqual(copy)
  })

  it('produces deterministic output with controlled random', () => {
    let callIndex = 0
    // Predefined random values that produce a known shuffle
    const values = [0.1, 0.3, 0.5, 0.7, 0.9]
    const random = () => values[callIndex++ % values.length]

    const input = ['a', 'b', 'c', 'd', 'e', 'f']
    const result1 = shuffleArray(input, random)
    callIndex = 0
    const result2 = shuffleArray(input, random)

    expect(result1).toEqual(result2)
  })
})
