// Inline gradients (card-gradients.ts removed with card builder)
const CARD_GRADIENTS = [
  { from: '#22224C', to: '#0092FF' },
  { from: '#0092FF', to: '#C6E7FF' },
  { from: '#22224C', to: '#3A3A6B' },
  { from: '#0070CC', to: '#C6E7FF' },
  { from: '#3A3A6B', to: '#0092FF' },
  { from: '#22224C', to: '#4DA6FF' },
  { from: '#0070CC', to: '#4DA6FF' },
  { from: '#4DA6FF', to: '#E0F0FF' },
]

export interface CardParams {
  name: string
  iconEmoji: string
  taskLabels: string[]
  gradientVariant: number
}

/**
 * Composites a 1200x675 carpenter card PNG entirely client-side using Canvas API.
 * Returns a Blob of the resulting PNG image.
 */
export async function generateCardPng(params: CardParams): Promise<Blob> {
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 675
  const ctx = canvas.getContext('2d')!

  // 1. Draw gradient background (135-degree diagonal)
  const gradient = ctx.createLinearGradient(0, 0, 1200, 675)
  gradient.addColorStop(0, CARD_GRADIENTS[params.gradientVariant].from)
  gradient.addColorStop(1, CARD_GRADIENTS[params.gradientVariant].to)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 675)

  // 2. Draw "CARPENTER CARD" title
  ctx.font = '800 32px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('CARPENTER CARD', 72, 86)

  // 3. Draw pill badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.beginPath()
  ctx.roundRect(982, 52, 146, 40, 20)
  ctx.fill()
  ctx.font = '800 14px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BUILDER', 1055, 72)

  // 4. Draw emoji icon on white circle
  ctx.beginPath()
  ctx.arc(170, 350, 74, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  ctx.font = '80px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(params.iconEmoji, 170, 350)

  // 5. Draw student name and subtitle
  ctx.font = '800 72px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(params.name, 286, 344)
  ctx.font = '300 28px "Open Sans", sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
  ctx.fillText('Career Explorer', 286, 392)

  // 6. Draw task tag chips
  drawTagChips(ctx, params.taskLabels, 72, 560)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

function drawTagChips(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  startX: number,
  y: number
) {
  ctx.font = '800 16px "Open Sans", sans-serif'
  const paddingX = 22
  const paddingY = 10
  const chipGap = 12
  const chipHeight = 16 + paddingY * 2
  let x = startX

  for (let i = 0; i < labels.length; i++) {
    const text = labels[i].toUpperCase()
    const w = ctx.measureText(text).width + paddingX * 2
    const r = chipHeight / 2

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.beginPath()
    ctx.roundRect(x, y - chipHeight / 2, w, chipHeight, r)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x + w / 2, y)

    x += w + chipGap
  }
}
