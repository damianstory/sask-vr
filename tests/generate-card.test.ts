import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CardParams } from '@/lib/generate-card'

// Mock Canvas context
const mockCtx = {
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 50 })),
  roundRect: vi.fn(),
  set fillStyle(_v: string) {},
  set textAlign(_v: string) {},
  set textBaseline(_v: string) {},
  set font(_v: string) {},
}

// Mock canvas element
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockCtx),
  toBlob: vi.fn((cb: (blob: Blob) => void) => {
    cb(new Blob(['mock'], { type: 'image/png' }))
  }),
}

// Mock document.createElement to return mock canvas
const originalCreateElement = document.createElement.bind(document)
vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
  if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement
  return originalCreateElement(tag)
})

// Mock document.fonts
Object.defineProperty(document, 'fonts', {
  value: { ready: Promise.resolve() },
  writable: true,
})

const defaultParams: CardParams = {
  name: 'Alex',
  iconEmoji: '🔨',
  taskLabels: ['Framing', 'Roofing'],
  gradientVariant: 0,
}

describe('generateCardPng', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCanvas.width = 0
    mockCanvas.height = 0
  })

  it('creates a 1200x675 canvas', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(mockCanvas.width).toBe(1200)
    expect(mockCanvas.height).toBe(675)
  })

  it('draws gradient background first', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(mockCtx.createLinearGradient).toHaveBeenCalledWith(0, 0, 1200, 675)
  })

  it('draws CARPENTER CARD title text', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'CARPENTER CARD',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('draws emoji icon', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '🔨',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('draws student name', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      'Alex',
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('returns a PNG blob', async () => {
    const { generateCardPng } = await import('@/lib/generate-card')
    const blob = await generateCardPng(defaultParams)
    expect(blob).toBeInstanceOf(Blob)
  })

  it('awaits document.fonts.ready', async () => {
    const fontsSpy = vi.spyOn(document.fonts as FontFaceSet, 'ready', 'get')
      .mockReturnValue(Promise.resolve(document.fonts as FontFaceSet))
    const { generateCardPng } = await import('@/lib/generate-card')
    await generateCardPng(defaultParams)
    expect(fontsSpy).toHaveBeenCalled()
    fontsSpy.mockRestore()
  })
})
