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
    expect(content.videoSnippets).toBeDefined()
    expect(content.speedRun).toBeDefined()
    expect(content.aiSorting).toBeDefined()
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

  it('salaryHook has numeric hourly and annual ranges', () => {
    const { hourlyRange, annualRange } = content.salaryHook
    for (const tier of ['entry', 'median', 'senior'] as const) {
      expect(typeof hourlyRange[tier]).toBe('number')
      expect(typeof annualRange[tier]).toBe('number')
    }
  })

  it('salaryHook has selfEmployment with percentage and potentialEarnings', () => {
    const { selfEmployment } = content.salaryHook
    expect(typeof selfEmployment.percentage).toBe('number')
    expect(selfEmployment.potentialEarnings).toBeTruthy()
  })

  it('careerPathway has exactly 5 steps', () => {
    expect(content.careerPathway.steps).toHaveLength(5)
  })

  it('taskRanking has reveal with heading and subtext', () => {
    expect(content.taskRanking.reveal).toBeDefined()
    expect(content.taskRanking.reveal.heading).toBeTruthy()
    expect(content.taskRanking.reveal.subtext).toBeTruthy()
  })

  it('taskRanking has exactly 6 tiles with weights [10,14,14,14,16,20]', () => {
    const { tiles } = content.taskRanking
    expect(tiles).toHaveLength(6)
    const weights = tiles.map((t) => t.weight).sort((a, b) => (a ?? 0) - (b ?? 0))
    expect(weights).toEqual([10, 14, 14, 14, 16, 20])
  })

  it('videoSnippets has exactly 6 videos with required fields', () => {
    const { videos } = content.videoSnippets
    expect(videos).toHaveLength(6)
    for (const video of videos) {
      expect(video.id).toBeTruthy()
      expect(video.title).toBeTruthy()
      expect(video.youtubeId).toBeTruthy()
    }
  })

  it('speedRun has milestones for both tracks and a disclaimer', () => {
    expect(content.speedRun.disclaimer).toBeTruthy()
    expect(content.speedRun.carpenter.milestones.length).toBeGreaterThan(0)
    expect(content.speedRun.university.milestones.length).toBeGreaterThan(0)
    for (const m of [...content.speedRun.carpenter.milestones, ...content.speedRun.university.milestones]) {
      expect(typeof m.year).toBe('number')
      expect(m.label).toBeTruthy()
      expect(m.value).toBeTruthy()
    }
  })

  it('aiSorting has exactly 6 tasks with a mix of ai and human answers', () => {
    const { tasks } = content.aiSorting
    expect(tasks).toHaveLength(6)
    const answers = new Set<string>()
    for (const task of tasks) {
      expect(task.id).toBeTruthy()
      expect(task.description).toBeTruthy()
      expect(['ai', 'human']).toContain(task.correctAnswer)
      expect(task.explanation).toBeTruthy()
      answers.add(task.correctAnswer)
    }
    expect(answers.has('ai')).toBe(true)
    expect(answers.has('human')).toBe(true)
  })

  it('aiSorting has a punchline', () => {
    expect(content.aiSorting.punchline).toBeTruthy()
  })
})
