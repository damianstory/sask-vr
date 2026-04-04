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

  it('has all content sections with semantic keys', () => {
    expect(content.salaryHook).toBeDefined()
    expect(content.taskRanking).toBeDefined()
    expect(content.employerMap).toBeDefined()
    expect(content.careerPathway).toBeDefined()
    expect(content.vrPrep).toBeDefined()
    expect(content.postVr).toBeDefined()
  })

  it('has no empty string values in meta', () => {
    expect(content.meta.occupationId).not.toBe('')
    expect(content.meta.occupationTitle).not.toBe('')
    expect(content.meta.displayName).not.toBe('')
    expect(content.meta.landingDescription).not.toBe('')
  })

  it('has populated arrays in each content section', () => {
    expect(content.salaryHook.stats.length).toBeGreaterThan(0)
    expect(content.taskRanking.tiles.length).toBeGreaterThan(0)
    expect(content.employerMap.employers.length).toBeGreaterThan(0)
    expect(content.careerPathway.steps.length).toBeGreaterThan(0)
    expect(content.vrPrep.prompts.length).toBeGreaterThan(0)
    expect(content.postVr.checklist.length).toBeGreaterThan(0)
  })
})
