---
phase: 1
slug: foundation-shell
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-19
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react |
| **Config file** | vitest.config.ts (created by Plan 01, Task 0) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run && npm run build && npm run type-check` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npm run build && npm run type-check`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-00 | 01 | 0 | (infra) | setup | `npx vitest --version` | vitest.config.ts | ⬜ pending |
| 01-01-01 | 01 | 1 | CONT-01, CONT-02, CONT-04 | unit | `npx vitest run tests/content-schema.test.ts` | tests/content-schema.test.ts | ⬜ pending |
| 01-01-02 | 01 | 1 | LAND-01, LAND-02 | integration | `npx vitest run tests/landing.test.tsx` | tests/landing.test.tsx | ⬜ pending |
| 01-02-01 | 02 | 2 | FLOW-01, FLOW-02, FLOW-04 | unit | `npx vitest run tests/pre-vr-flow.test.tsx` | tests/pre-vr-flow.test.tsx | ⬜ pending |
| 01-02-02 | 02 | 2 | FLOW-03 | unit | `npx vitest run tests/progress-bar.test.tsx` | tests/progress-bar.test.tsx | ⬜ pending |
| 01-02-03 | 02 | 2 | LAND-03 | smoke | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/post-vr` | N/A | ⬜ pending |
| 01-02-04 | 02 | 2 | PERF-05 | smoke | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom` — install dev dependencies (Plan 01, Task 0)
- [x] `vitest.config.ts` — React plugin + jsdom environment (Plan 01, Task 0)
- [x] `tests/content-schema.test.ts` — validates carpentry.json against OccupationContent (Plan 01, Task 0)
- [x] `tests/progress-bar.test.tsx` — covers FLOW-03 (Plan 02, Task 1)
- [x] `tests/pre-vr-flow.test.tsx` — covers FLOW-01, FLOW-02, FLOW-04 (Plan 02, Task 1)
- [x] `tests/landing.test.tsx` — covers LAND-01, LAND-02 (Plan 01, Task 0)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cards stack vertically on mobile, 44px min touch targets | LAND-04 | Layout/touch-target sizing requires visual inspection | Open at 375px viewport, verify cards stack and measure touch targets >=44px |
| /post-vr accessible via direct URL (QR code scenario) | LAND-03 | Requires running dev server and hitting URL | Navigate directly to `http://localhost:3000/post-vr`, verify page renders |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved (Wave 0 task added to Plan 01, test files created in Plans 01 and 02)
