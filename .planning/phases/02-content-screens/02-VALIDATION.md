---
phase: 2
slug: content-screens
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | HOOK-01 | unit | `npx vitest run tests/screen-one.test.tsx -t "salary"` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | HOOK-02 | unit | `npx vitest run tests/screen-one.test.tsx -t "stat-cards"` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | HOOK-04 | unit | `npx vitest run tests/screen-one.test.tsx -t "reduced-motion"` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | TILE-01 | unit | `npx vitest run tests/screen-two.test.tsx -t "tiles"` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | TILE-02 | unit | `npx vitest run tests/screen-two.test.tsx -t "select"` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 1 | TILE-03 | unit | `npx vitest run tests/screen-two.test.tsx -t "max"` | ❌ W0 | ⬜ pending |
| 02-02-04 | 02 | 1 | TILE-04 | unit | `npx vitest run tests/screen-two.test.tsx -t "continue"` | ❌ W0 | ⬜ pending |
| 02-02-05 | 02 | 1 | TILE-05 | unit | `npx vitest run tests/screen-two.test.tsx -t "session"` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | MAP-01 | manual | Visual: map renders with Regina centered | N/A | ⬜ pending |
| 02-03-02 | 03 | 2 | MAP-02 | unit | `npx vitest run tests/screen-three.test.tsx -t "pin"` | ❌ W0 | ⬜ pending |
| 02-03-03 | 03 | 2 | MAP-03 | unit | `npx vitest run tests/screen-three.test.tsx -t "close"` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 1 | PATH-01 | unit | `npx vitest run tests/screen-four.test.tsx -t "timeline"` | ❌ W0 | ⬜ pending |
| 02-04-02 | 04 | 1 | PATH-02 | unit | `npx vitest run tests/screen-four.test.tsx -t "expand"` | ❌ W0 | ⬜ pending |
| 02-04-03 | 04 | 1 | PATH-03 | unit | `npx vitest run tests/screen-four.test.tsx -t "accordion"` | ❌ W0 | ⬜ pending |
| 02-05-01 | 05 | 1 | PREP-01 | unit | `npx vitest run tests/screen-six.test.tsx -t "prompts"` | ❌ W0 | ⬜ pending |
| 02-06-01 | 06 | 1 | BRDG-01 | unit | `npx vitest run tests/post-vr.test.tsx -t "checklist"` | ❌ W0 | ⬜ pending |
| 02-06-02 | 06 | 1 | BRDG-02 | unit | `npx vitest run tests/post-vr.test.tsx -t "toggle"` | ❌ W0 | ⬜ pending |
| 02-06-03 | 06 | 1 | BRDG-04 | unit | `npx vitest run tests/post-vr.test.tsx -t "progress"` | ❌ W0 | ⬜ pending |
| 02-06-04 | 06 | 1 | BRDG-05 | unit | `npx vitest run tests/post-vr.test.tsx -t "myblueprint"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/screen-one.test.tsx` — stubs for HOOK-01, HOOK-02, HOOK-04
- [ ] `tests/screen-two.test.tsx` — stubs for TILE-01 through TILE-05
- [ ] `tests/screen-three.test.tsx` — stubs for MAP-02, MAP-03 (mock maplibre-gl)
- [ ] `tests/screen-four.test.tsx` — stubs for PATH-01, PATH-02, PATH-03
- [ ] `tests/screen-six.test.tsx` — stubs for PREP-01, PREP-02
- [ ] `tests/post-vr.test.tsx` — stubs for BRDG-01 through BRDG-05
- [ ] maplibre-gl mock setup for jsdom environment

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Map renders with Regina centered at correct zoom | MAP-01 | MapLibre requires WebGL context not available in jsdom | Open Screen 3 in browser, verify map shows Regina SK area at zoom level ~11 |
| Map pins are non-draggable, map is non-pannable | MAP-04 | Requires real MapLibre rendering | Try to drag/pinch/scroll on map — nothing should happen except pin clicks |
| Odometer animation smooth at 2s duration | HOOK-03 | CSS animation timing is visual | Watch salary counter animate up, verify smooth ~2s roll |
| Stat cards stagger in after counter | HOOK-02 | CSS transition stagger is visual | Watch stat cards fade in sequentially after counter completes |
| Bottom sheet slides up smoothly | MAP-05 | CSS animation is visual | Tap an employer pin, verify card slides up from bottom |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

---

*Phase: 02-content-screens*
*Validation strategy created: 2026-03-19*
