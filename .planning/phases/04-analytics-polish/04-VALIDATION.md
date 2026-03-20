---
phase: 4
slug: analytics-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 + @testing-library/react 16.3.2 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green + Lighthouse audit + manual walkthrough
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | ANLY-01 | unit | `npx vitest run tests/analytics.test.ts -t "screen_view" -x` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | ANLY-02 | unit | `npx vitest run tests/analytics.test.ts -t "path_select" -x` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | ANLY-03 | unit | `npx vitest run tests/analytics.test.ts -t "tile_select" -x` | ❌ W0 | ⬜ pending |
| 04-01-04 | 01 | 1 | ANLY-04 | unit | `npx vitest run tests/analytics.test.ts -t "employer_tap" -x` | ❌ W0 | ⬜ pending |
| 04-01-05 | 01 | 1 | ANLY-05 | unit | `npx vitest run tests/analytics.test.ts -t "pathway_expand" -x` | ❌ W0 | ⬜ pending |
| 04-01-06 | 01 | 1 | ANLY-06 | unit | `npx vitest run tests/analytics.test.ts -t "card" -x` | ❌ W0 | ⬜ pending |
| 04-01-07 | 01 | 1 | ANLY-07 | unit | `npx vitest run tests/analytics.test.ts -t "checklist_check" -x` | ❌ W0 | ⬜ pending |
| 04-01-08 | 01 | 1 | ANLY-08 | unit | `npx vitest run tests/analytics.test.ts -t "no PII" -x` | ❌ W0 | ⬜ pending |
| 04-01-09 | 01 | 1 | ANLY-09 | manual-only | Manual: verify in GA4 Explorations | N/A | ⬜ pending |
| 04-02-01 | 02 | 2 | A11Y-01 | a11y | `npx vitest run tests/a11y/ -x` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | A11Y-02 | manual-only | Lighthouse a11y audit | N/A | ⬜ pending |
| 04-02-03 | 02 | 2 | A11Y-03 | manual-only | Visual inspection at breakpoints | N/A | ⬜ pending |
| 04-02-04 | 02 | 2 | A11Y-04 | a11y | `npx vitest run tests/a11y/ -t "aria" -x` | ❌ W0 | ⬜ pending |
| 04-02-05 | 02 | 2 | A11Y-05 | unit | `npx vitest run tests/screen-one.test.tsx -t "reduced-motion" -x` | ✅ | ⬜ pending |
| 04-03-01 | 03 | 2 | PERF-01 | manual-only | Lighthouse with 4x CPU throttle | N/A | ⬜ pending |
| 04-03-02 | 03 | 2 | PERF-02 | manual-only | Manual timing verification | N/A | ⬜ pending |
| 04-03-03 | 03 | 2 | PERF-04 | smoke | `ANALYZE=true npm run build` | N/A | ⬜ pending |
| 04-03-04 | 03 | 2 | PERF-06 | manual-only | Visual verification at 3 breakpoints | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/analytics.test.ts` — unit tests for lib/analytics.ts module (all ANLY requirements)
- [ ] `tests/a11y/` directory — accessibility tests using vitest-axe for each screen component
- [ ] `vitest-axe` package installation and setup in `tests/vitest.setup.ts`
- [ ] `focus-trap-react` package installation

*Existing infrastructure (vitest + jsdom + @testing-library/react) covers base test framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GA4 funnel configurable | ANLY-09 | Requires GA4 dashboard access | Verify funnels can be built from tracked events in GA4 Explorations |
| WCAG AA contrast ratios | A11Y-02 | Requires visual/computed style check | Run Lighthouse a11y audit on each screen, verify 4.5:1 text, 3:1 UI |
| Touch targets 44x44px | A11Y-03 | Requires layout measurement | Inspect all interactive elements at 320px viewport, verify minimum 44x44px |
| LCP under 3s | PERF-01 | Requires Lighthouse with throttling | Run Lighthouse with 4x CPU slowdown, verify LCP < 3s |
| Transitions under 500ms | PERF-02 | Requires runtime timing | Navigate all screen transitions, verify each completes under 500ms |
| Responsive 320px-1366px | PERF-06 | Requires visual verification | Check layout at 320px, 768px, 1366x768 viewports |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
