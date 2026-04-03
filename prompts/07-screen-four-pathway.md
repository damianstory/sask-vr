# Screen 4 — Career Pathway Timeline

## Context

Screen 4 of the pre-VR flow. Students explore a vertical timeline showing the career pathway from where they are now (Grade 7/8) through to full employment as a carpenter. Each step on the timeline can be expanded to reveal details about programs, duration, and earnings. This should feel like a game progression path — "here's where you are, here's where you could go."

The student is 12–14 years old. The timeline should feel achievable, not overwhelming — each step is a clear, digestible milestone.

## Design Tokens (Inline)

- Font: Open Sans, weights 300 + 800
- Navy: #22224C (headings, step titles)
- Primary Blue: #0092FF (first step node, connecting line, focus ring)
- Navy Light: #3A3A6B (final step node)
- Light Blue: #C6E7FF (badge backgrounds)
- Off-White: #F6F6FF (page background)
- Neutral-3: #AAB7CB (unfilled nodes border, dashed connecting lines)
- Neutral-4: #65738B (subtitles, courses text)
- Neutral-5: #485163 (expanded description text)
- Focus ring: 3px solid #0092FF
- Card radius: 12px
- Badge radius: 20px (pill)

## Requirements

### Heading + Subtext
- Heading: "How do you become a carpenter?" — 40px desktop / 28px mobile, weight 800, Navy, centered
- Subtext: descriptive sentence — 16px, weight 300, Neutral-5
- Must have `data-screen-heading` attribute on heading

### Timeline Structure
- Vertical timeline, max-width 640px, centered
- Each step: left column (node + connecting line) + right column (title + expandable content)
- Gap between columns: 16px

### Step Nodes (Left Column)
- **First step:** 48x48px circle, Primary Blue fill, white number inside, pulse animation (scale 1→1.2→1, 2s loop infinite)
- **Middle steps:** 40x40px circle, white fill, 2px Neutral-3 border, dark number inside
- **Final step:** 40x40px circle, Navy Light (#3A3A6B) fill, white number inside
- Number text: 14px, weight 800
- Each node is a `<button>` with `aria-expanded`

### Connecting Lines (Between Nodes)
- Between first and second node: solid 2px line, Primary Blue
- Between all other nodes: dashed 2px line, Neutral-3
- Min height: 32px, stretches to fill remaining space

### Step Content (Right Column)
- **Title:** 20px desktop / 24px mobile, weight 800, Navy — also a `<button>` that toggles expand
- **Subtitle:** 14px, weight 300, Neutral-4
- **Expanded content** (visible when step is expanded):
  - Description: 16px, weight 300, line-height 1.75, Neutral-5
  - Badges row: pills with Light Blue bg, Navy text, 14px weight 800, rounded-full (20px). Show duration, earnings, programs.
  - Courses list (optional): 14px, weight 300, Neutral-4, comma-separated
- **Expand/collapse animation:** `grid-template-rows` transition from 0fr to 1fr, 300ms ease-out
- Bottom padding per step: 32px

### Default State
- **First step is expanded by default.** This affects initial layout and the perceived entry point.
- Only one step expanded at a time — expanding one collapses the other

## States

### Step Nodes
- Default: styled per position (first/middle/last as described)
- Focus: 3px Primary Blue ring

### Expanded Content
- Expanded: full height, visible
- Collapsed: 0 height, overflow hidden

## Interactions

- Tap node or title to toggle expand/collapse
- Only one step expanded at a time (accordion behavior)
- Keyboard: Tab through step buttons, Enter/Space to toggle
- Each step button has `aria-expanded="true/false"`

## Non-Negotiable Behavior to Preserve

- `data-screen-heading` on heading
- First step expanded by default (`expandedStepId` initialized to first step's ID)
- Accordion behavior: only one step open at a time
- `grid-template-rows` transition for expand/collapse (CSS-only height animation)
- `trackPathwayExpand(step.id, step.title)` analytics call when expanding
- `aria-expanded` on each step button
- Content from `content.screenFour.*` — steps array with variable-length badges, courses, descriptions

## Safe Replacement Boundary

- **REPLACE:** Timeline visual design (node styling, connecting line appearance, expanded content card layout, badge pill styling, overall spacing/typography)
- **PRESERVE:** `expandedStepId` state + `toggleStep` logic, `trackPathwayExpand` calls, `grid-template-rows` transition technique, `aria-expanded` attributes, content bindings, first-step-expanded default

## Constraints

- Steps array length varies by occupation (3–6 steps typical) — timeline must scale
- Badge count per step varies (0–4) — badges row must wrap
- Courses list is optional and variable length
- Use carpentry pathway examples but keep structure generic
- Prefer semantic wrappers that slot into the existing component
- Production-ready React/Tailwind with semantic HTML
