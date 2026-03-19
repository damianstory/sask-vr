import { CARD_GRADIENTS } from '@/lib/card-gradients'

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
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('CARPENTER CARD', 600, 60)

  // 3. Draw emoji icon on white circle
  ctx.beginPath()
  ctx.arc(600, 250, 60, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  ctx.font = '80px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(params.iconEmoji, 600, 250)

  // 4. Draw student name
  ctx.font = '800 48px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(params.name, 600, 400)

  // 5. Draw task tag chips
  drawTagChips(ctx, params.taskLabels, 600, 500)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

function drawTagChips(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  centerX: number,
  y: number
) {
  ctx.font = '300 18px "Open Sans", sans-serif'
  const paddingX = 16
  const paddingY = 8
  const chipGap = 12
  const chipHeight = 18 + paddingY * 2

  // Measure total width to center the row
  const chipWidths = labels.map((l) => ctx.measureText(l).width + paddingX * 2)
  const totalWidth =
    chipWidths.reduce((a, b) => a + b, 0) + chipGap * (labels.length - 1)
  let x = centerX - totalWidth / 2

  for (let i = 0; i < labels.length; i++) {
    const w = chipWidths[i]
    const r = chipHeight / 2

    // Semi-transparent white pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.beginPath()
    ctx.roundRect(x, y - chipHeight / 2, w, chipHeight, r)
    ctx.fill()

    // White text
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(labels[i], x + w / 2, y)

    x += w + chipGap
  }
}
