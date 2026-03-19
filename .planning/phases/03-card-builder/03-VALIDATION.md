---
phase: 3
slug: card-builder
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run tests/screen-five.test.tsx` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run tests/screen-five.test.tsx`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 0 | CARD-01..08 | unit | `npx vitest run tests/screen-five.test.tsx` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 0 | CARD-05 | unit | `npx vitest run tests/card-gradients.test.ts` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 0 | CARD-06 | unit | `npx vitest run tests/generate-card.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | CARD-01 | unit | `npx vitest run tests/screen-five.test.tsx -t "name input"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | CARD-02 | unit | `npx vitest run tests/screen-five.test.tsx -t "icon picker"` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 1 | CARD-03 | unit | `npx vitest run tests/screen-five.test.tsx -t "task tags"` | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 1 | CARD-04 | unit | `npx vitest run tests/screen-five.test.tsx -t "preview"` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | CARD-06, CARD-07 | unit | `npx vitest run tests/generate-card.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 2 | CARD-08 | unit | `npx vitest run tests/screen-five.test.tsx -t "download disabled"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/screen-five.test.tsx` — stubs for CARD-01 through CARD-04, CARD-07, CARD-08
- [ ] `tests/card-gradients.test.ts` — covers CARD-05 (deterministic hash produces consistent output)
- [ ] `tests/generate-card.test.ts` — covers CARD-06 (Canvas API mock verifying correct draw calls)

*Note: Canvas API is not available in jsdom. Tests for generate-card.ts will mock document.createElement('canvas') and verify correct sequence of Canvas method calls.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Student name never transmitted to server | CARD-09 | Requires code audit, not unit test | Review all fetch/XHR calls in card builder components; verify no network requests contain student name |
| Card generation under 1 second | PERF-03 | Hardware-dependent timing on Chromebook | Open card builder on target Chromebook, fill name + icon, click download, measure time to save dialog |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
