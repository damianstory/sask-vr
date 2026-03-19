---
phase: 1
slug: foundation-shell
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react |
| **Config file** | none — Wave 0 installs |
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
| 01-01-01 | 01 | 0 | CONT-01, CONT-02 | unit | `npx vitest run tests/content-schema.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | LAND-01, LAND-02 | integration | `npx vitest run tests/landing.test.tsx -t "path cards"` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | FLOW-01, FLOW-02 | unit | `npx vitest run tests/pre-vr-flow.test.tsx -t "screen navigation"` | ❌ W0 | ⬜ pending |
| 01-01-04 | 01 | 1 | FLOW-03 | unit | `npx vitest run tests/progress-bar.test.tsx` | ❌ W0 | ⬜ pending |
| 01-01-05 | 01 | 1 | FLOW-04 | unit | `npx vitest run tests/pre-vr-flow.test.tsx -t "transitions"` | ❌ W0 | ⬜ pending |
| 01-01-06 | 01 | 2 | LAND-03 | smoke | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/post-vr` | N/A | ⬜ pending |
| 01-01-07 | 01 | 2 | CONT-04 | unit | `npx vitest run tests/content-schema.test.ts -t "all sections populated"` | ❌ W0 | ⬜ pending |
| 01-01-08 | 01 | 3 | PERF-05 | smoke | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom` — install dev dependencies
- [ ] `vitest.config.ts` — React plugin + jsdom environment
- [ ] `tests/content-schema.test.ts` — validates carpentry.json against OccupationContent
- [ ] `tests/progress-bar.test.tsx` — covers FLOW-03
- [ ] `tests/pre-vr-flow.test.tsx` — covers FLOW-01, FLOW-02, FLOW-04
- [ ] `tests/landing.test.tsx` — covers LAND-01, LAND-02

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cards stack vertically on mobile, 44px min touch targets | LAND-04 | Layout/touch-target sizing requires visual inspection | Open at 375px viewport, verify cards stack and measure touch targets ≥44px |
| /post-vr accessible via direct URL (QR code scenario) | LAND-03 | Requires running dev server and hitting URL | Navigate directly to `http://localhost:3000/post-vr`, verify page renders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
