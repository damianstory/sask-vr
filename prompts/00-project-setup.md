# Project Setup — Career Explorer Micro-Site

A bold, playful, gamified career exploration app for Grade 7–8 students (ages 12–14). This is a companion experience to a VR career simulation — students use this app before and after trying VR to build context and reflect on what they experienced.

The app has three sections:
1. **Landing page** — two large path-selection cards: "I'm about to do VR" and "I just finished VR"
2. **Pre-VR flow** — a 6-screen guided experience with progress dots and back/next navigation. Screens cover salary data, task selection, local employers, career pathway, a personalized card builder, and VR prep tips.
3. **Post-VR page** — a congratulations message, interactive checklist, and a call-to-action button linking to an external platform.

## Vibe

Bold, playful, gamified, encouraging, personal. This should feel closer to a game or social media experience than a worksheet or government website. Every screen has one clear focal point. The tone is exploratory, not evaluative — there are no wrong answers.

## Design Tokens

- **Font:** Open Sans, weights 300 (light/body) and 800 (bold/headings)
- **Primary Blue:** #0092FF — CTAs, selected states, progress indicators
- **Navy:** #22224C — headings, primary text
- **Light Blue:** #C6E7FF — card backgrounds, tile highlights, selected tile background
- **Off-White:** #F6F6FF — page background
- **Neutrals:** #E5E9F1 (borders), #D9DFEA (card borders), #AAB7CB (disabled), #65738B (secondary text), #485163 (body text), #252A33 (high-emphasis text)
- **Blue Dark:** #0070CC — hover states on blue elements
- **Blue Vivid:** #3DA8FF — stat emphasis, achievement highlights
- **Navy Light:** #3A3A6B — secondary emphasis, pathway nodes
- **Light Blue Soft:** #E0F0FF — subtle background tints, prompt cards

## Layout Rules

- Mobile-first responsive: 375px → 768px → 1366px (school Chromebook)
- Maximum content width: 1120px, centered
- All interactive elements: minimum 44x44px touch targets, 8px gap between targets
- Border radius: 12px for cards, 8px for inputs, 20px for pills/chips, full-round for circles
- Spacing: 8px grid (4, 8, 16, 24, 32, 48, 64px scale)

## Typography Rules

- Headings: 40px desktop / 28px mobile, weight 800, Navy
- Body: 16px, weight 300, Neutral-5 (#485163)
- Stat numbers: 64px desktop / 48px mobile, weight 800
- Button labels: 16px, weight 800, white on blue
- No font size below 14px anywhere
- Maximum two font weights per screen

## What NOT to generate

- No routing logic, no state management, no data fetching
- No external dependencies beyond Tailwind CSS
- No login/auth screens
- Keep component structure generic enough to swap career content later (carpentry is just the first occupation)
