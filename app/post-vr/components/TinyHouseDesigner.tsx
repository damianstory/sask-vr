'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { useSession } from '@/context/SessionContext'
import { trackTinyHouseDownload } from '@/lib/analytics'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Data: Skills
// ---------------------------------------------------------------------------

interface CarpentrySkill {
  id: string
  label: string
  emoji: string
}

const SKILLS: CarpentrySkill[] = [
  { id: 'framing', label: 'Framing', emoji: '\u{1F3D7}\uFE0F' },
  { id: 'finishing', label: 'Finishing & Trim', emoji: '\u2728' },
  { id: 'cabinetry', label: 'Cabinetry', emoji: '\u{1F5C4}\uFE0F' },
  { id: 'plumbing', label: 'Plumbing Rough-in', emoji: '\u{1F527}' },
  { id: 'concrete', label: 'Concrete & Foundation', emoji: '\u{1F9F1}' },
  { id: 'roofing', label: 'Roofing', emoji: '\u{1F3E0}' },
  { id: 'insulation', label: 'Insulation', emoji: '\u{1F9E4}' },
  { id: 'electrical', label: 'Electrical Rough-in', emoji: '\u26A1' },
  { id: 'tiling', label: 'Tiling', emoji: '\u{1F532}' },
  { id: 'drywall', label: 'Drywall', emoji: '\u{1FAB5}' },
]

// ---------------------------------------------------------------------------
// Data: Room Options & Slots
// ---------------------------------------------------------------------------

interface RoomOption {
  id: string
  label: string
  description: string
  skills: string[]
  color: string
}

interface RoomSlot {
  id: string
  label: string
  emoji: string
  gridArea: string
  options: RoomOption[]
}

const SLOTS: RoomSlot[] = [
  {
    id: 'kitchen',
    label: 'Kitchen',
    emoji: '\u{1F373}',
    gridArea: '1 / 1 / 3 / 3',
    options: [
      {
        id: 'galley',
        label: 'Galley Kitchen',
        description: 'Narrow parallel counters, efficient workflow',
        skills: ['cabinetry', 'finishing'],
        color: '#E8D5B7',
      },
      {
        id: 'l-shaped',
        label: 'L-Shaped Kitchen',
        description: 'Corner layout with tiled backsplash',
        skills: ['cabinetry', 'framing', 'tiling'],
        color: '#D4B896',
      },
      {
        id: 'kitchenette',
        label: 'Kitchenette',
        description: 'Compact single-wall with built-in appliances',
        skills: ['cabinetry', 'electrical'],
        color: '#F0E4D0',
      },
    ],
  },
  {
    id: 'workshop',
    label: 'Workshop/Storage',
    emoji: '\u{1F528}',
    gridArea: '1 / 3 / 2 / 6',
    options: [
      {
        id: 'tool-workshop',
        label: 'Tool Workshop',
        description: 'Workbench with power outlets and pegboard',
        skills: ['framing', 'electrical', 'concrete'],
        color: '#B8C5B2',
      },
      {
        id: 'built-in-storage',
        label: 'Built-in Storage',
        description: 'Floor-to-ceiling shelving system',
        skills: ['cabinetry', 'framing'],
        color: '#C2CDB8',
      },
      {
        id: 'mudroom',
        label: 'Mudroom Entry',
        description: 'Tiled entry with coat hooks and boot bench',
        skills: ['tiling', 'finishing', 'framing'],
        color: '#A8B89E',
      },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    emoji: '\u{1F6BF}',
    gridArea: '1 / 6 / 3 / 7',
    options: [
      {
        id: 'full-bath',
        label: 'Full Bath',
        description: 'Tub, vanity, and toilet \u2014 full comfort',
        skills: ['plumbing', 'tiling', 'framing'],
        color: '#B8D4E8',
      },
      {
        id: 'wet-bath',
        label: 'Wet Bath',
        description: 'Open shower combo, space-efficient',
        skills: ['plumbing', 'insulation'],
        color: '#A3C4D9',
      },
      {
        id: 'three-quarter',
        label: 'Three-Quarter Bath',
        description: 'Shower stall with vanity, no tub',
        skills: ['plumbing', 'tiling'],
        color: '#C5DDE8',
      },
    ],
  },
  {
    id: 'living',
    label: 'Living Area',
    emoji: '\u{1F6CB}\uFE0F',
    gridArea: '2 / 1 / 4 / 3',
    options: [
      {
        id: 'open-living',
        label: 'Open Living',
        description: 'Drywall feature wall, maximized space',
        skills: ['drywall', 'finishing', 'insulation'],
        color: '#E0D4C8',
      },
      {
        id: 'flex-workspace',
        label: 'Flex Workspace',
        description: 'Built-in desk with power and shelving',
        skills: ['framing', 'electrical', 'cabinetry'],
        color: '#D5C9BD',
      },
      {
        id: 'cozy-nook',
        label: 'Cozy Nook',
        description: 'Window bench with decorative trim',
        skills: ['finishing', 'insulation', 'drywall'],
        color: '#EAE0D4',
      },
    ],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    emoji: '\u{1F6CF}\uFE0F',
    gridArea: '2 / 4 / 4 / 6',
    options: [
      {
        id: 'loft',
        label: 'Loft Bedroom',
        description: 'Raised platform with ladder access',
        skills: ['framing', 'roofing', 'insulation'],
        color: '#C8B8D4',
      },
      {
        id: 'murphy',
        label: 'Murphy Bed Studio',
        description: 'Fold-down cabinet bed, dual-use room',
        skills: ['cabinetry', 'finishing'],
        color: '#D4C8E0',
      },
      {
        id: 'platform',
        label: 'Platform Bedroom',
        description: 'Raised floor with built-in storage drawers',
        skills: ['framing', 'finishing', 'insulation'],
        color: '#BAAECE',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeName(name: string): string {
  return (
    name
      .slice(0, 20)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'student'
  )
}

async function generateTinyHousePng(
  selectedOptionsBySlot: Record<string, RoomOption>,
  activeSkillLabels: string[],
  name: string
): Promise<Blob> {
  await document.fonts.ready

  const W = 1200
  const H = 675
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background gradient (navy → blue)
  const gradient = ctx.createLinearGradient(0, 0, W, H)
  gradient.addColorStop(0, '#22224C')
  gradient.addColorStop(1, '#0092FF')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, W, H)

  // Title
  ctx.font = '800 28px "Open Sans", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('MY TINY HOUSE DESIGN', 60, 56)

  // Name pill
  const pillText = name.slice(0, 20) || 'Student'
  ctx.font = '800 14px "Open Sans", sans-serif'
  const pillW = ctx.measureText(pillText.toUpperCase()).width + 40
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.beginPath()
  ctx.roundRect(W - 60 - pillW, 32, pillW, 36, 18)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(pillText.toUpperCase(), W - 60 - pillW / 2, 50)

  // Floor plan area
  const planX = 60
  const planY = 90
  const planW = W - 120
  const planH = 380
  const cols = 6
  const rows = 3
  const cellW = planW / cols
  const cellH = planH / rows

  // House outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 3
  ctx.strokeRect(planX, planY, planW, planH)

  // Dimension labels
  ctx.font = '300 14px "Open Sans", sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('24 ft', planX + planW / 2, planY + planH + 8)
  ctx.save()
  ctx.translate(planX - 12, planY + planH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('12 ft', 0, 0)
  ctx.restore()

  // Draw rooms
  for (const slot of SLOTS) {
    const option = selectedOptionsBySlot[slot.id]
    if (!option) continue

    // Parse gridArea "rowStart / colStart / rowEnd / colEnd"
    const [rs, cs, re, ce] = slot.gridArea.split('/').map((s) => parseInt(s.trim()))
    const rx = planX + (cs - 1) * cellW
    const ry = planY + (rs - 1) * cellH
    const rw = (ce - cs) * cellW
    const rh = (re - rs) * cellH

    ctx.fillStyle = option.color
    ctx.fillRect(rx + 2, ry + 2, rw - 4, rh - 4)

    // Room label
    ctx.fillStyle = '#22224C'
    ctx.font = '800 15px "Open Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(option.label, rx + rw / 2, ry + rh / 2 - 10)

    // Slot label
    ctx.font = '300 12px "Open Sans", sans-serif'
    ctx.fillStyle = 'rgba(34, 34, 76, 0.6)'
    ctx.fillText(slot.label, rx + rw / 2, ry + rh / 2 + 10)
  }

  // Skill chips at bottom
  ctx.font = '800 13px "Open Sans", sans-serif'
  const chipY = H - 50
  const chipPadX = 16
  const chipPadY = 8
  const chipH = 13 + chipPadY * 2
  const chipGap = 8
  let chipX = 60

  for (const label of activeSkillLabels) {
    const text = label.toUpperCase()
    const tw = ctx.measureText(text).width + chipPadX * 2
    if (chipX + tw > W - 60) break

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.beginPath()
    ctx.roundRect(chipX, chipY - chipH / 2, tw, chipH, chipH / 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, chipX + tw / 2, chipY)

    chipX += tw + chipGap
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png')
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TinyHouseDesigner() {
  const { firstName } = useSession()

  const [selections, setSelections] = useState<Record<string, string | null>>(
    () => Object.fromEntries(SLOTS.map((s) => [s.id, null]))
  )
  const [activeSlot, setActiveSlot] = useState<string | null>(null)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)

  // -- Derived data (computed, never stored) --

  const selectedOptionsBySlot = useMemo(() => {
    const result: Record<string, RoomOption> = {}
    for (const slot of SLOTS) {
      const optionId = selections[slot.id]
      if (optionId) {
        const option = slot.options.find((o) => o.id === optionId)
        if (option) result[slot.id] = option
      }
    }
    return result
  }, [selections])

  const { selectedSkills, skillSources } = useMemo(() => {
    const sources: Record<string, string[]> = {}
    for (const slot of SLOTS) {
      const option = selectedOptionsBySlot[slot.id]
      if (!option) continue
      for (const skillId of option.skills) {
        if (!sources[skillId]) sources[skillId] = []
        sources[skillId].push(slot.label)
      }
    }
    return {
      selectedSkills: new Set(Object.keys(sources)),
      skillSources: sources,
    }
  }, [selectedOptionsBySlot])

  const filledCount = Object.values(selections).filter(Boolean).length
  const allFilled = filledCount === SLOTS.length

  // -- Focus management --

  useEffect(() => {
    if (activeSlot && firstOptionRef.current) {
      firstOptionRef.current.focus()
    }
  }, [activeSlot])

  const closePicker = useCallback(() => {
    setActiveSlot(null)
    // Return focus to triggering slot button
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  const handlePickerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closePicker()
      }
      // Tab trap: cycle within picker
      if (e.key === 'Tab' && pickerRef.current) {
        const focusable = pickerRef.current.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [closePicker]
  )

  const openPicker = useCallback(
    (slotId: string, buttonEl: HTMLButtonElement) => {
      triggerRef.current = buttonEl
      setActiveSlot(slotId)
    },
    []
  )

  const selectOption = useCallback(
    (slotId: string, optionId: string) => {
      setSelections((prev) => ({ ...prev, [slotId]: optionId }))
      closePicker()
    },
    [closePicker]
  )

  // -- Export --

  const handleDownload = useCallback(async () => {
    if (!allFilled) return
    try {
      const activeLabels = SKILLS.filter((s) => selectedSkills.has(s.id)).map(
        (s) => s.label
      )
      const blob = await generateTinyHousePng(
        selectedOptionsBySlot,
        activeLabels,
        firstName
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tiny-house-${sanitizeName(firstName)}.png`
      a.click()
      URL.revokeObjectURL(url)
      trackTinyHouseDownload()
    } catch (err) {
      console.error('Tiny house export failed:', err)
    }
  }, [allFilled, selectedOptionsBySlot, selectedSkills, firstName])

  // -- Active slot data --

  const activeSlotData = activeSlot
    ? SLOTS.find((s) => s.id === activeSlot)
    : null

  return (
    <section className="rounded-[var(--radius-panel)] border border-[color:rgba(217,223,234,0.8)] bg-white/90 p-6 shadow-[var(--shadow-float)] backdrop-blur-[var(--glass-blur)] md:p-8">
      {/* Header */}
      <div className="inline-flex rounded-[var(--radius-pill)] bg-[var(--myb-light-blue)] px-4 py-2 text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
        Bonus Activity
      </div>
      <h2 className="mt-5 text-[28px] font-[800] leading-[1.1] text-[var(--myb-navy)] md:text-[40px]">
        Design Your Tiny House
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-[18px] font-[300] leading-[1.55] text-[var(--myb-neutral-5)] md:text-[22px]">
        Pick a layout for each room and discover which carpentry skills
        you&apos;d use to build it.
      </p>

      {/* Grid + Sidebar */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        {/* Floor plan grid */}
        <div className="relative md:w-3/5">
          <div
            className="grid border-[3px] border-[var(--myb-navy)] rounded-[var(--radius-card)]"
            style={{
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              aspectRatio: '2 / 1',
              gap: '2px',
            }}
          >
            {SLOTS.map((slot) => {
              const selected = selections[slot.id]
              const option = selectedOptionsBySlot[slot.id]
              return (
                <button
                  key={slot.id}
                  type="button"
                  style={{
                    gridArea: slot.gridArea,
                    backgroundColor: option ? option.color : undefined,
                  }}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 rounded-[4px] p-1 text-center transition-colors duration-[var(--motion-medium)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
                    selected
                      ? 'border border-[var(--myb-navy)]/20'
                      : 'border-2 border-dashed border-[var(--myb-neutral-2)] bg-[var(--myb-off-white)] hover:border-[var(--myb-primary-blue)] hover:bg-[var(--myb-light-blue-soft)]'
                  )}
                  onClick={(e) => openPicker(slot.id, e.currentTarget)}
                >
                  <span className="text-base md:text-xl" aria-hidden="true">
                    {slot.emoji}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] leading-tight md:text-[12px]',
                      selected
                        ? 'font-[800] text-[var(--myb-navy)]'
                        : 'font-[300] text-[var(--myb-neutral-4)]'
                    )}
                  >
                    {option
                      ? `Selected: ${option.label}`
                      : `Choose ${slot.label}`}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Picker overlay */}
          {activeSlot && activeSlotData && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-card)] bg-black/20"
              onClick={closePicker}
              role="presentation"
            >
              <div
                ref={pickerRef}
                className="w-full max-w-[280px] rounded-[var(--radius-card)] bg-white p-4 shadow-[var(--shadow-card-dialog)]"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handlePickerKeyDown}
              >
                <p className="mb-3 text-[14px] font-[800] text-[var(--myb-navy)]">
                  Choose a layout for {activeSlotData.label}
                </p>
                <div className="flex flex-col gap-2">
                  {activeSlotData.options.map((option, i) => (
                    <button
                      key={option.id}
                      ref={i === 0 ? firstOptionRef : undefined}
                      type="button"
                      onClick={() => selectOption(activeSlot, option.id)}
                      className="w-full rounded-[var(--radius-input)] border border-[var(--myb-neutral-2)] px-3 py-3 text-left transition-all duration-[var(--motion-fast)] hover:border-[var(--myb-primary-blue)] hover:bg-[var(--myb-light-blue-soft)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]"
                    >
                      <span className="block text-[14px] font-[800] text-[var(--myb-navy)]">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-[300] text-[var(--myb-neutral-4)]">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {!allFilled && (
            <p className="mt-3 text-center text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              Tap each room to choose a layout{' '}
              <span className="font-[800] text-[var(--myb-primary-blue)]">
                &middot; {filledCount} of 5 rooms chosen
              </span>
            </p>
          )}
        </div>

        {/* Skills sidebar */}
        <div className="md:w-2/5">
          <div className="rounded-[var(--radius-card)] border border-[var(--myb-neutral-2)] bg-[var(--myb-off-white)] p-4">
            <p className="text-[12px] font-[800] uppercase tracking-[0.24em] text-[var(--myb-primary-blue)]">
              Carpentry Skills
            </p>
            <p className="mt-1 text-[14px] font-[300] text-[var(--myb-neutral-4)]">
              <span className="font-[800] text-[var(--myb-navy)]">
                {selectedSkills.size}
              </span>{' '}
              of 10 carpentry skills covered
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {SKILLS.map((skill) => {
                const isActive = selectedSkills.has(skill.id)
                const sources = skillSources[skill.id]
                return (
                  <div
                    key={skill.id}
                    className={cn(
                      'flex items-start gap-2 rounded-[8px] px-3 py-2 transition-all duration-[var(--motion-medium)]',
                      isActive
                        ? 'bg-white shadow-sm'
                        : 'opacity-40'
                    )}
                  >
                    <span
                      className="mt-0.5 text-[16px]"
                      aria-hidden="true"
                    >
                      {skill.emoji}
                    </span>
                    <div className="min-w-0">
                      <span
                        className={cn(
                          'block text-[14px]',
                          isActive
                            ? 'font-[800] text-[var(--myb-navy)]'
                            : 'font-[300] text-[var(--myb-neutral-4)]'
                        )}
                      >
                        {skill.label}
                      </span>
                      {isActive && sources && (
                        <span className="block text-[11px] font-[300] text-[var(--myb-neutral-4)]">
                          {sources.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Download CTA */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled={!allFilled}
          onClick={handleDownload}
          className={cn(
            'flex min-h-[44px] items-center justify-center rounded-[var(--radius-input)] px-8 py-3 text-[16px] font-[800] text-white shadow-[var(--shadow-float)] transition-all duration-[var(--motion-medium)] focus:outline-none focus:ring-[var(--focus-ring-width)] focus:ring-[var(--myb-primary-blue)] focus:ring-offset-[var(--focus-ring-offset)]',
            allFilled
              ? 'hover:-translate-y-0.5 cursor-pointer'
              : 'cursor-not-allowed opacity-50'
          )}
          style={{
            backgroundImage: allFilled
              ? 'linear-gradient(135deg, var(--myb-navy) 0%, var(--myb-blue-vivid) 100%)'
              : 'linear-gradient(135deg, var(--myb-neutral-3) 0%, var(--myb-neutral-4) 100%)',
          }}
        >
          Download My Tiny House
        </button>
      </div>
    </section>
  )
}
