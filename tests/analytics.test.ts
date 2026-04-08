import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @next/third-parties/google before imports
const mockSendGAEvent = vi.fn()
vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: mockSendGAEvent,
}))

// Use dynamic import so mock is in place
let analytics: typeof import('@/lib/analytics')

describe('analytics module', () => {
  beforeEach(async () => {
    vi.resetModules()
    mockSendGAEvent.mockClear()

    // Re-mock after resetModules
    vi.doMock('@next/third-parties/google', () => ({
      sendGAEvent: mockSendGAEvent,
    }))
  })

  describe('production mode', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'production')
      analytics = await import('@/lib/analytics')
    })

    it('trackScreenView sends screen_view event with screen_name', () => {
      analytics.trackScreenView('salary_hook')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'screen_view', {
        screen_name: 'salary_hook',
      })
    })

    it('trackPathSelect sends path_select event with path', () => {
      analytics.trackPathSelect('pre_vr')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'path_select', {
        path: 'pre_vr',
      })
    })

    it('trackEmployerTap sends employer_tap event with employer_id and employer_name', () => {
      analytics.trackEmployerTap('pcl', 'PCL Construction')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'employer_tap', {
        employer_id: 'pcl',
        employer_name: 'PCL Construction',
      })
    })

    it('trackPathwayExpand sends pathway_expand event with step_id and step_label', () => {
      analytics.trackPathwayExpand('step-1', 'High School')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'pathway_expand', {
        step_id: 'step-1',
        step_label: 'High School',
      })
    })

    it('trackVideoNavigate sends video_navigate event', () => {
      analytics.trackVideoNavigate('abc123', 'next')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'video_navigate', {
        video_id: 'abc123',
        direction: 'next',
      })
    })

    it('trackRankingSubmit serializes array to comma-joined string', () => {
      analytics.trackRankingSubmit(['task-framing', 'task-concrete', 'task-roofing'])
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'ranking_submit', {
        ranked_order: 'task-framing,task-concrete,task-roofing',
      })
    })

    it('trackRankingScore sends ranking_score with correct_count', () => {
      analytics.trackRankingScore(4)
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'ranking_score', {
        correct_count: '4',
      })
    })

    it('trackAISortAttempt sends ai_sort_attempt with serialized boolean', () => {
      analytics.trackAISortAttempt('ai-essay', 'ai', true)
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'ai_sort_attempt', {
        task_id: 'ai-essay',
        chosen: 'ai',
        correct: 'true',
      })
    })

    it('trackAISortComplete sends ai_sort_complete with score', () => {
      analytics.trackAISortComplete(5)
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'ai_sort_complete', {
        score: '5',
      })
    })

    it('trackStudentNameEntered sends student_name_entered with NO parameters (zero PII)', () => {
      analytics.trackStudentNameEntered()
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'student_name_entered', undefined)
    })

    it('trackChecklistCheck sends checklist_check event with item_id and item_label', () => {
      analytics.trackChecklistCheck('item-1', 'Update myBlueprint')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'checklist_check', {
        item_id: 'item-1',
        item_label: 'Update myBlueprint',
      })
    })
  })

  describe('development mode', () => {
    beforeEach(async () => {
      vi.stubEnv('NODE_ENV', 'development')
      analytics = await import('@/lib/analytics')
    })

    it('logs to console instead of calling sendGAEvent', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      analytics.trackScreenView('salary_hook')
      expect(consoleSpy).toHaveBeenCalledWith('[Analytics]', 'screen_view', {
        screen_name: 'salary_hook',
      })
      expect(mockSendGAEvent).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('logs events with no params in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      analytics.trackStudentNameEntered()
      expect(consoleSpy).toHaveBeenCalledWith('[Analytics]', 'student_name_entered', undefined)
      expect(mockSendGAEvent).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
