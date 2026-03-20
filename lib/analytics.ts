import { sendGAEvent } from '@next/third-parties/google'

const IS_DEV = process.env.NODE_ENV === 'development'

function track(eventName: string, params?: Record<string, string>) {
  if (IS_DEV) {
    console.log('[Analytics]', eventName, params)
    return
  }
  sendGAEvent('event', eventName, params)
}

export function trackScreenView(screenName: string) {
  track('screen_view', { screen_name: screenName })
}

export function trackPathSelect(path: 'pre_vr' | 'post_vr') {
  track('path_select', { path })
}

export function trackTileSelect(tileId: string, action: 'select' | 'deselect') {
  track('tile_select', { tile_id: tileId, action })
}

export function trackEmployerTap(employerId: string, employerName: string) {
  track('employer_tap', { employer_id: employerId, employer_name: employerName })
}

export function trackPathwayExpand(stepId: string, stepLabel: string) {
  track('pathway_expand', { step_id: stepId, step_label: stepLabel })
}

export function trackIconSelect(iconId: string) {
  track('icon_select', { icon_id: iconId })
}

export function trackNameEntered() {
  track('name_entered')
}

export function trackCardDownload() {
  track('card_download')
}

export function trackChecklistCheck(itemId: string, itemLabel: string) {
  track('checklist_check', { item_id: itemId, item_label: itemLabel })
}
