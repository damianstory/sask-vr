import { sendGAEvent } from '@next/third-parties/google'

const IS_DEV = process.env.NODE_ENV === 'development'

function track(eventName: string, params?: Record<string, string>) {
  if (IS_DEV) {
    console.log('[Analytics]', eventName, params)
    return
  }
  sendGAEvent('event', eventName, params as Record<string, string>)
}

export function trackScreenView(screenName: string) {
  track('screen_view', { screen_name: screenName })
}

export function trackPathSelect(path: 'pre_vr' | 'post_vr') {
  track('path_select', { path })
}

export function trackEmployerTap(employerId: string, employerName: string) {
  track('employer_tap', { employer_id: employerId, employer_name: employerName })
}

export function trackPathwayExpand(stepId: string, stepLabel: string) {
  track('pathway_expand', { step_id: stepId, step_label: stepLabel })
}

export function trackVideoNavigate(videoId: string, direction: 'next' | 'prev') {
  track('video_navigate', { video_id: videoId, direction })
}

export function trackRankingSubmit(rankedOrder: string[]) {
  track('ranking_submit', { ranked_order: rankedOrder.join(',') })
}

export function trackRankingScore(correctCount: number) {
  track('ranking_score', { correct_count: String(correctCount) })
}

export function trackAISortAttempt(taskId: string, chosen: 'ai' | 'human', correct: boolean) {
  track('ai_sort_attempt', { task_id: taskId, chosen, correct: String(correct) })
}

export function trackAISortComplete(score: number) {
  track('ai_sort_complete', { score: String(score) })
}

export function trackStudentNameEntered() {
  track('student_name_entered')
}

export function trackChecklistCheck(itemId: string, itemLabel: string) {
  track('checklist_check', { item_id: itemId, item_label: itemLabel })
}
