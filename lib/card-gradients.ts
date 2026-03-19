export const CARD_GRADIENTS = [
  { from: '#22224C', to: '#0092FF' }, // navy -> primary-blue
  { from: '#0092FF', to: '#C6E7FF' }, // primary-blue -> light-blue
  { from: '#22224C', to: '#3A3A6B' }, // navy -> navy-light
  { from: '#0070CC', to: '#C6E7FF' }, // blue-dark -> light-blue
  { from: '#3A3A6B', to: '#0092FF' }, // navy-light -> primary-blue
  { from: '#22224C', to: '#3DA8FF' }, // navy -> blue-vivid
  { from: '#0070CC', to: '#3DA8FF' }, // blue-dark -> blue-vivid
  { from: '#3DA8FF', to: '#E0F0FF' }, // blue-vivid -> light-blue-soft
]

export function getGradientVariant(tileIds: string[]): number {
  const key = [...tileIds].sort().join('|')
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % CARD_GRADIENTS.length
}
