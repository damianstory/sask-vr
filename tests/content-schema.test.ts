import { describe, it, expect } from 'vitest'
import content from '@/content/carpentry.json'
import type { OccupationContent } from '@/content/types'

describe('Content Schema', () => {
  const data = content as OccupationContent

  it('has meta section with occupationId', () => {
    expect(data.meta).toBeDefined()
    expect(data.meta.occupationId).toBe('carpentry')
    expect(data.meta.occupationTitle).toBeTruthy()
  })

  it('has all seven screen sections', () => {
    expect(data.screenOne).toBeDefined()
    expect(data.screenTwo).toBeDefined()
    expect(data.screenThree).toBeDefined()
    expect(data.screenFour).toBeDefined()
    expect(data.screenFive).toBeDefined()
    expect(data.screenSix).toBeDefined()
    expect(data.postVr).toBeDefined()
  })

  it('has no empty string values in meta', () => {
    expect(data.meta.occupationId).not.toBe('')
    expect(data.meta.occupationTitle).not.toBe('')
    expect(data.meta.displayName).not.toBe('')
    expect(data.meta.landingDescription).not.toBe('')
  })

  it('has populated arrays in each screen section', () => {
    expect(data.screenOne.stats.length).toBeGreaterThan(0)
    expect(data.screenTwo.tiles.length).toBeGreaterThan(0)
    expect(data.screenThree.employers.length).toBeGreaterThan(0)
    expect(data.screenFour.steps.length).toBeGreaterThan(0)
    expect(data.screenFive.icons.length).toBeGreaterThan(0)
    expect(data.screenSix.prompts.length).toBeGreaterThan(0)
    expect(data.postVr.checklist.length).toBeGreaterThan(0)
  })
})
