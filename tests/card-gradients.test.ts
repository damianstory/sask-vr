import { describe, it, expect } from 'vitest'
import { CARD_GRADIENTS, getGradientVariant } from '@/lib/card-gradients'

describe('CARD_GRADIENTS', () => {
  it('contains exactly 8 gradient definitions', () => {
    expect(CARD_GRADIENTS).toHaveLength(8)
  })

  it('each gradient has from and to hex color strings', () => {
    for (const g of CARD_GRADIENTS) {
      expect(g.from).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(g.to).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('getGradientVariant', () => {
  it('returns a number between 0 and 7', () => {
    const result = getGradientVariant(['task-framing', 'task-roofing'])
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThan(8)
  })

  it('returns same result for same inputs regardless of order', () => {
    const a = getGradientVariant(['task-framing', 'task-roofing'])
    const b = getGradientVariant(['task-roofing', 'task-framing'])
    expect(a).toBe(b)
  })

  it('returns same result on repeated calls (deterministic)', () => {
    const ids = ['task-concrete', 'task-measuring', 'task-finishing']
    const first = getGradientVariant(ids)
    const second = getGradientVariant(ids)
    expect(first).toBe(second)
  })

  it('can produce different results for different inputs', () => {
    const results = new Set<number>()
    const combos = [
      ['task-framing', 'task-roofing'],
      ['task-measuring', 'task-concrete'],
      ['task-finishing', 'task-renovation'],
      ['task-framing', 'task-measuring', 'task-concrete'],
    ]
    for (const combo of combos) {
      results.add(getGradientVariant(combo))
    }
    expect(results.size).toBeGreaterThan(1)
  })
})
