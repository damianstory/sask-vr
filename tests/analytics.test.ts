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
      analytics.trackScreenView('screen_1')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'screen_view', {
        screen_name: 'screen_1',
      })
    })

    it('trackPathSelect sends path_select event with path', () => {
      analytics.trackPathSelect('pre_vr')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'path_select', {
        path: 'pre_vr',
      })
    })

    it('trackTileSelect sends tile_select event with tile_id and action', () => {
      analytics.trackTileSelect('framing', 'select')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'tile_select', {
        tile_id: 'framing',
        action: 'select',
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

    it('trackIconSelect sends icon_select event with icon_id', () => {
      analytics.trackIconSelect('hammer')
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'icon_select', {
        icon_id: 'hammer',
      })
    })

    it('trackNameEntered sends name_entered with NO parameters (zero PII)', () => {
      analytics.trackNameEntered()
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'name_entered', undefined)
    })

    it('trackCardDownload sends card_download with NO parameters', () => {
      analytics.trackCardDownload()
      expect(mockSendGAEvent).toHaveBeenCalledWith('event', 'card_download', undefined)
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
      analytics.trackScreenView('screen_1')
      expect(consoleSpy).toHaveBeenCalledWith('[Analytics]', 'screen_view', {
        screen_name: 'screen_1',
      })
      expect(mockSendGAEvent).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('logs events with no params in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      analytics.trackNameEntered()
      expect(consoleSpy).toHaveBeenCalledWith('[Analytics]', 'name_entered', undefined)
      expect(mockSendGAEvent).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
