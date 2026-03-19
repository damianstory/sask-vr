import { describe, it, expect } from 'vitest'
import { content, OCCUPATION } from '@/content/config'

describe('Content Schema', () => {

  it('exports OCCUPATION constant', () => {
    expect(typeof OCCUPATION).toBe('string')
    expect(OCCUPATION.length).toBeGreaterThan(0)
  })

  it('content.meta.occupationId matches OCCUPATION constant', () => {
    expect(content.meta.occupationId).toBe(OCCUPATION)
  })

  it('has meta section with occupationId', () => {
    expect(content.meta).toBeDefined()
    expect(content.meta.occupationId).toBe('carpentry')
    expect(content.meta.occupationTitle).toBeTruthy()
  })

  it('has all seven screen sections', () => {
    expect(content.screenOne).toBeDefined()
    expect(content.screenTwo).toBeDefined()
    expect(content.screenThree).toBeDefined()
    expect(content.screenFour).toBeDefined()
    expect(content.screenFive).toBeDefined()
    expect(content.screenSix).toBeDefined()
    expect(content.postVr).toBeDefined()
  })

  it('has no empty string values in meta', () => {
    expect(content.meta.occupationId).not.toBe('')
    expect(content.meta.occupationTitle).not.toBe('')
    expect(content.meta.displayName).not.toBe('')
    expect(content.meta.landingDescription).not.toBe('')
  })

  it('has populated arrays in each screen section', () => {
    expect(content.screenOne.stats.length).toBeGreaterThan(0)
    expect(content.screenTwo.tiles.length).toBeGreaterThan(0)
    expect(content.screenThree.employers.length).toBeGreaterThan(0)
    expect(content.screenFour.steps.length).toBeGreaterThan(0)
    expect(content.screenFive.icons.length).toBeGreaterThan(0)
    expect(content.screenSix.prompts.length).toBeGreaterThan(0)
    expect(content.postVr.checklist.length).toBeGreaterThan(0)
  })
})
