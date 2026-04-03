# Design Token & Motion Contract

This defines the exact design system every screen must follow. All colors, spacing, typography, shadows, radii, and motion rules are specified here. Use these values — do not invent one-off alternatives.

## Color Palette

| Token Name | Hex | Usage |
|------------|-----|-------|
| Primary Blue | #0092FF | CTAs, continue buttons, selected states, progress indicators |
| Navy | #22224C | Headings, primary text, navigation elements |
| Light Blue | #C6E7FF | Card backgrounds, tile highlights, hover tints |
| Off-White | #F6F6FF | Page backgrounds, content areas |
| Neutral-1 | #E5E9F1 | Borders, dividers |
| Neutral-2 | #D9DFEA | Card borders, subtle separators |
| Neutral-3 | #AAB7CB | Disabled states, placeholder text |
| Neutral-4 | #65738B | Secondary text, captions |
| Neutral-5 | #485163 | Body text |
| Neutral-6 | #252A33 | High-emphasis body text |
| Blue Dark | #0070CC | Hover states on Primary Blue elements |
| Blue Vivid | #3DA8FF | Salary counter highlight, stat callouts |
| Navy Light | #3A3A6B | Secondary emphasis, pathway progress nodes |
| Light Blue Soft | #E0F0FF | Subtle background tints, observation prompt cards |

## Typography

- **Font:** Open Sans only (weights: 300 light, 800 bold)
- **Headings:** 40px desktop / 28px mobile, weight 800, line-height 1.2, Navy
- **Subheadings:** 22px desktop / 18px mobile, weight 300, line-height 1.4, Neutral-5
- **Body:** 16px, weight 300, line-height 1.75, Neutral-5
- **Stat numbers:** 64px desktop / 48px mobile, weight 800, line-height 1.0
- **Stat labels:** 16px, weight 300, Neutral-4
- **Tile labels:** 20px desktop / 16px mobile, weight 800, line-height 1.3, Navy
- **Tile descriptions:** 14px, weight 300, Neutral-4
- **Button labels:** 16px, weight 800, white on blue
- **Minimum font size:** 14px everywhere

## Spacing (8px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight internal padding |
| space-2 | 8px | Element padding, compact margins |
| space-3 | 16px | Standard card/tile padding |
| space-4 | 24px | Section padding |
| space-5 | 32px | Between sections |
| space-6 | 48px | Major section gaps, screen top/bottom |
| space-7 | 64px | Page-level vertical rhythm (desktop) |

## Border Radius

| Element | Radius |
|---------|--------|
| Cards, tiles | 12px |
| Inputs | 8px |
| Buttons (standard) | 8px |
| Pills, chips, badges | 20px |
| Circles (avatars, nodes) | 9999px |

## Shadows

| Level | Value | Usage |
|-------|-------|-------|
| Card default | none | Most cards at rest |
| Card hover | 0 8px 24px rgba(34,34,76,0.1) | Hovered cards, lifted states |
| Card dialog | 0 8px 24px rgba(34,34,76,0.12) | Popup cards, employer info |

## Focus States

- **Standard:** 3px solid Primary Blue (#0092FF), 3px offset
- **All interactive elements must show visible focus on keyboard navigation**

## Motion Rules

- **Durations:** 150–300ms for micro-interactions, 400ms for screen transitions
- **Easing:** ease-out for entrances, ease-in for exits, ease-in-out for state changes
- **Reduced motion:** When `prefers-reduced-motion: reduce` is active, replace all animations with instant state changes. Keep opacity transitions. Keep spinners.
- **GPU only:** Only animate `transform` and `opacity` properties
- **No bounce, no elastic, no overshoot** — motion should feel like settling into place

## Responsive Breakpoints

| Breakpoint | Target |
|-----------|--------|
| < 640px | Mobile (primary test: 375px) |
| 640–1023px | Tablet |
| >= 1024px | Chromebook/Desktop (primary test: 1366x768) |

Maximum content width: 1120px, centered on larger screens.
