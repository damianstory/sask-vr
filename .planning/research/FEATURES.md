# Feature Research

**Domain:** Interactive educational career exploration micro-site (Grade 7/8, Saskatchewan)
**Researched:** 2026-03-19
**Confidence:** MEDIUM-HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

For this context, "users" means three groups: the students (12-14), the educators facilitating the stations, and the stakeholders (VR Hub, myBlueprint). Missing any of these means the pilot fails or gets poor feedback.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hook screen with animated salary/stats counter | Students need immediate engagement in first 5 seconds. Animated counters create a "wow" moment and establish that trades careers are financially viable. Research confirms animated data is more engaging and memorable than static numbers. | LOW | Use CSS counter animation or lightweight JS (no heavy charting library needed). Scroll-triggered or on-mount. Saskatchewan-specific data is critical for local relevance. |
| Task selection mechanic (pick 2-3 from 6) | Active choice is the core engagement pattern for this age group. Research shows students this age respond strongly to agency and self-directed exploration. This also drives personalization of the Carpenter Card. | LOW | Simple toggle state on illustrated tiles. Persist selections in React context for downstream card generation. Visual feedback on selection (border glow, checkmark) is essential. |
| Interactive SVG map with tappable employer pins | Students need to see that these careers exist locally, not abstractly. Tappable pins with company cards make it concrete. Static SVG (not Google Maps) is the right call for school Chromebooks. | MEDIUM | Inline SVG with ARIA roles, keyboard-navigable pins (tabindex, Enter/Space activation). Each pin opens a card overlay. Must work with touch and mouse. Keep to 4-6 pins to avoid clutter on small screens. |
| Career pathway timeline | Students need to see the path from "now" to "career" is achievable and concrete. Accordion-style expandable steps are a proven pattern for progressive disclosure with this age group. | LOW-MEDIUM | Vertical timeline with expandable accordion sections. Each step shows timeframe, description, and Saskatchewan-specific details (institutions, programs). |
| Personalized Carpenter Card (name + selections + download) | The takeaway artifact is the core value proposition of the entire micro-site. Without it, students leave with nothing tangible. Card generators with download/share are standard in youth engagement tools. | MEDIUM | Canvas API compositing name + icon selections onto pre-generated backgrounds. PNG download. Name never leaves browser. Must generate in <1s on Chromebook. |
| Post-VR reflection checklist | Structured reflection is a well-established educational best practice. The checklist bridges VR excitement into actionable next steps in myBlueprint. Without it, the VR experience is a dead end. | LOW | Simple checkable list (6 items). No persistence needed beyond session. Clear CTA linking to myBlueprint at the end. |
| Mobile-first responsive design (Chromebook primary) | School Chromebooks at 1366x768 are the primary device. If it breaks on these, the pilot fails. Must also handle tablets used in some classrooms. | MEDIUM | Design for 1366x768 first, then scale down to 320px minimum. Test touch targets (44px minimum per WCAG). Avoid hover-dependent interactions. |
| WCAG AA accessibility | Non-negotiable for a school-deployed tool. Screen reader support, keyboard navigation, sufficient contrast, and proper touch targets. Saskatchewan schools have inclusive classrooms. | MEDIUM | Baked into every component from the start. Inline SVG with ARIA labels, semantic HTML, focus management between screens, contrast ratios on the myBlueprint palette (navy/blue on light backgrounds needs checking). |
| Fast load time (<3s on school network) | School WiFi is unreliable and slow. If the site doesn't load fast, the teacher loses the class. SSG via Next.js + Vercel edge CDN addresses this. | LOW | Static generation means most content is pre-rendered HTML. Optimize images (pre-generated card backgrounds should be compressed PNGs or WebP with fallback). Lazy load below-fold content. |
| Session state preservation across screens | Students navigate forward and backward through 6 screens. Losing selections when going back is a dealbreaker for engagement and feels broken. | LOW | React context holds all state. Single-route architecture (no page reloads) means state persists naturally. State is intentionally lost on browser refresh (acceptable for single-session use). |

### Differentiators (Competitive Advantage)

These set the micro-site apart from typical career exploration worksheets and even platforms like Kuder Galaxy or Claim Your Future.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Deterministic card personalization from task selections | The card background is not random -- it reflects the student's choices. This creates a sense of ownership ("my card is unique because of what I picked"). Most card generators use templates; this one maps selections to visual outcomes via deterministic hash. | LOW | 6-12 pre-generated background variants. Hash student selections to consistently map to a background. Student sees cause-and-effect between choices and artifact. |
| Occupation-agnostic JSON content architecture | While pilot is carpentry-only, the JSON structure means adding "Electrician" or "Plumber" requires zero code changes. This is the scalability story for stakeholders and future school deployments. | LOW | Design the content schema once, load dynamically. All screen content (stats, tasks, employers, pathway steps, card assets) comes from a single JSON file per occupation. |
| VR-bookend flow design (Pre/Post as distinct journeys) | No competitor in this space connects a web experience to VR to portfolio work in a structured flow. The three-station model is novel. The micro-site is purpose-built to amplify VR, not replace it. | LOW | Landing page with two clear paths. Pre-VR builds anticipation and context. Post-VR captures momentum. The micro-site's value is in its position in the flow, not just its content. |
| Observation prompts before VR | Giving students specific things to look for during VR turns passive watching into active observation. This is a well-researched educational technique (advance organizers). Most VR deployments just say "put on the headset." | LOW | Screen 6 content: 3-4 specific prompts like "Notice how the carpenter measures before cutting" or "Watch for safety equipment being used." Simple text, high educational impact. |
| GA4 event tracking for stakeholder insights | Schools and VR Hub get data on engagement patterns without collecting PII. Which tasks do students pick most? How long on each screen? Do they download the card? This data informs future deployments. | LOW-MEDIUM | GA4 events on: screen transitions, task selections, map pin taps, accordion expansions, card downloads, checklist completions, myBlueprint link clicks. Custom dimensions for occupation type (future-proofing). |
| Icon picker for card personalization | Beyond name input, letting students choose an icon/avatar for their card adds another layer of ownership. Small interaction, big emotional payoff for this age group. | LOW | Grid of 8-12 icons (tools, hard hat, safety glasses, etc.). Selected icon composited onto card via Canvas API alongside name and background. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Student login/accounts | "Track student progress across sessions" | Adds massive complexity (auth, data storage, privacy compliance). Single-session pilot doesn't need it. PII concerns with minors. FOIP/PIPEDA implications in Saskatchewan schools. | Stateless single-session design. Card download is the takeaway. myBlueprint handles the persistent portfolio. |
| Leaderboard/competitive gamification | "Kids love competition, it'll boost engagement" | Research shows competitive gamification alienates lower-performing students and creates anxiety. Inclusive design means everyone benefits at their own pace. Points/rankings are antithetical to exploration. | Personal artifact (Carpenter Card) provides achievement without comparison. Task selection provides agency without ranking. |
| Real-time multiplayer/social features | "Students could share cards with each other on the site" | Way too complex for a pilot micro-site. Network dependency on school WiFi. Moderation concerns with minors. | Students can show each other their downloaded cards in person. The physical/social moment is more valuable than a digital feed. |
| Comprehensive career assessment quiz | "Like a full personality test to match careers" | myBlueprint already does this with validated "Who Am I" assessments. Duplicating it is wasted effort and potentially less rigorous. The micro-site's job is to spark interest, not assess fit. | Task selection mechanic serves as a lightweight interest signal. Post-VR checklist directs students to myBlueprint for deeper assessment. |
| Video content / embedded media | "Add videos of real carpenters" | Destroys load time on school Chromebooks. Bandwidth-heavy. Autoplay is an accessibility issue. Buffering kills engagement for impatient 12-year-olds. | Illustrated tiles, animated counters, and the VR simulation itself provide the rich media. The micro-site uses lightweight, instant-loading visuals. |
| Complex animations / parallax scrolling | "Make it feel like a game" | Performance nightmare on school Chromebooks. Accessibility issues with motion sensitivity. Development time vs. educational value is poor. | Subtle CSS transitions (fade, slide) on screen changes. Animated counter on Screen 1. The "game feel" comes from interaction patterns (choosing, tapping, building), not visual effects. |
| Multi-language support | "Saskatchewan has French immersion and diverse communities" | Scope explosion for a pilot. Content is already placeholder. Translation adds another content pipeline. | English-only for pilot. JSON content architecture means translation is straightforward to add later if validated. |
| Persistent data / analytics dashboard for educators | "Teachers want to see what students picked" | Requires backend, database, auth for educators. PII concerns if linking choices to students. Way beyond pilot scope. | GA4 provides aggregate analytics. Educators observe students in person during the station rotation. Share aggregate GA4 insights post-pilot. |
| Google Maps integration for employer locations | "Real maps are more engaging" | API key costs, loading overhead on school WiFi, accessibility challenges with embedded Maps, no offline capability. Chromebook performance concern. | Static SVG map of Regina area. Stylized, fast-loading, fully accessible, works offline once loaded. Looks more "designed" and less "utility." |

## Feature Dependencies

```
[Landing Page (path selection)]
    └──gates──> [Pre-VR Flow (Screens 1-6)]
                    ├── [Screen 1: Animated Stats Hook]
                    ├── [Screen 2: Task Selection] ──persists──> [Screen 5: Card Builder]
                    ├── [Screen 3: SVG Map + Employer Cards]
                    ├── [Screen 4: Career Pathway Timeline]
                    ├── [Screen 5: Carpenter Card Builder]
                    │       └──requires──> [Canvas API Card Generation]
                    │       └──requires──> [Pre-generated Background Assets]
                    │       └──requires──> [Task Selection State] (from Screen 2)
                    └── [Screen 6: VR Prep + Observation Prompts]

    └──gates──> [Post-VR Flow]
                    ├── [Reflection Checklist]
                    └── [myBlueprint CTA Link]

[Session State Management] ──enables──> [Backward Navigation]
[Session State Management] ──enables──> [Task Selection Persistence]
[Session State Management] ──enables──> [Card Personalization from Selections]

[JSON Content Schema] ──enables──> [All Screen Content]
[JSON Content Schema] ──enables──> [Future Occupation Swaps]

[GA4 Integration] ──independent──> (can be added to any screen without affecting functionality)
```

### Dependency Notes

- **Card Builder requires Task Selection:** The deterministic background hash needs task selections as input. Screen 5 cannot generate a meaningful card without Screen 2 being completed.
- **Backward Navigation requires Session State:** The single-route architecture with React context makes this natural, but it must be designed from the start, not bolted on.
- **All Screens require JSON Content Schema:** Defining the content shape first unblocks all screen development in parallel.
- **GA4 is independent:** Can be layered on after core screens work. Don't let analytics block feature development.
- **Pre-VR and Post-VR are independent paths:** They can be built and tested independently. The landing page just routes between them.

## MVP Definition

### Launch With (Pilot Week - April 6, 2026)

Everything below is required for a successful pilot. This IS the product.

- [x] Landing page with two distinct paths (Pre-VR / Post-VR)
- [x] Screen 1: Animated salary counter with Saskatchewan carpentry stats
- [x] Screen 2: Six illustrated task tiles with pick-2-3 mechanic
- [x] Screen 3: SVG map of Regina with 4-6 tappable employer pins
- [x] Screen 4: Career pathway timeline with expandable accordion steps
- [x] Screen 5: Carpenter Card builder (name, icon picker, live preview, PNG download)
- [x] Screen 6: VR prep screen with observation prompts
- [x] Post-VR reflection checklist (6 items) with myBlueprint link
- [x] Session state preservation with backward navigation
- [x] Responsive design (Chromebook 1366x768 primary, down to 320px)
- [x] WCAG AA accessibility
- [x] GA4 event tracking on all key interactions
- [x] JSON-structured content for future occupation swaps

### Add After Pilot Validation (v1.x)

Features to add once pilot feedback is collected and more schools are onboarded.

- [ ] Additional occupation content files (Electrician, Plumber, Welder) -- triggered by VR Hub adding new simulations
- [ ] NanoBanana Pro 2 API integration for dynamic card backgrounds -- triggered by API stability confirmation and if pre-generated backgrounds feel limiting
- [ ] Real employer data and verified salary figures -- triggered by partnership agreements with Saskatchewan employers
- [ ] Card sharing via generated URL or QR code (no backend needed, encode in URL params) -- triggered by educator request for students to share beyond download
- [ ] Museo Sans font integration -- triggered by brand team providing web font files

### Future Consideration (v2+)

- [ ] French language support -- triggered by French immersion school adoption
- [ ] Educator analytics dashboard (aggregate, no PII) -- triggered by multi-school deployment where in-person observation isn't feasible
- [ ] Student portfolio integration (deeper myBlueprint API connection) -- triggered by myBlueprint partnership expansion
- [ ] Multiple card types per occupation (apprentice card, journeyman card) -- triggered by curriculum alignment requests

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Landing page (path selection) | HIGH | LOW | P1 |
| Screen 1: Animated stats hook | HIGH | LOW | P1 |
| Screen 2: Task selection tiles | HIGH | LOW | P1 |
| Screen 3: SVG map + employer cards | HIGH | MEDIUM | P1 |
| Screen 4: Career pathway timeline | MEDIUM | LOW-MEDIUM | P1 |
| Screen 5: Carpenter Card builder | HIGH | MEDIUM | P1 |
| Screen 6: VR prep + observation prompts | MEDIUM | LOW | P1 |
| Post-VR reflection checklist | MEDIUM | LOW | P1 |
| Session state + backward navigation | HIGH | LOW | P1 |
| Responsive design (Chromebook-first) | HIGH | MEDIUM | P1 |
| WCAG AA accessibility | HIGH | MEDIUM | P1 |
| GA4 event tracking | MEDIUM | LOW-MEDIUM | P1 |
| JSON content architecture | MEDIUM | LOW | P1 |
| Deterministic card background hash | MEDIUM | LOW | P1 |
| Icon picker for card | MEDIUM | LOW | P1 |
| Additional occupation JSON files | HIGH (future) | LOW | P2 |
| NanoBanana API card backgrounds | LOW | MEDIUM | P3 |
| Card sharing via URL/QR | LOW | LOW-MEDIUM | P3 |

**Priority key:**
- P1: Must have for pilot launch (April 6, 2026)
- P2: Should have, add when additional occupations are ready
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Claim Your Future | Kuder Galaxy | Careers Craft (Minecraft) | myBlueprint | Our Approach |
|---------|-------------------|--------------|---------------------------|-------------|--------------|
| Career discovery | Financial decision game | Virtual environment exploration | Minecraft world challenges | Who Am I assessments + occupation matching | Focused single-occupation deep dive with local context |
| Personalization | Budget/lifestyle choices | Avatar in virtual world | Minecraft character | Portfolio + resume builder | Carpenter Card artifact tied to task selections |
| Local relevance | Generic US data | Generic | Welsh landmarks | Province-specific course planning | Saskatchewan-specific salary data, Regina employers, local pathway details |
| Engagement mechanic | Game simulation | Explore virtual spaces | Minecraft gameplay | Assessment quizzes + course planning | Animated data, interactive map, card building, VR bookending |
| Takeaway artifact | Budget plan printout | Assessment results | None (in-game progress) | Digital portfolio | Downloadable personalized Carpenter Card (PNG) |
| VR integration | None | None | None | None | Purpose-built as VR bookend (unique differentiator) |
| Target age | Middle/high school | Elementary | 8-14 | Grade 7-12 | Grade 7-8 (focused) |
| Depth vs. breadth | Broad (many careers via budget) | Broad (many careers via exploration) | Broad (multiple career roles) | Broad (full career planning platform) | Deep (one occupation, rich context) |

**Key insight:** Every competitor goes broad (many careers, surface-level). This micro-site goes deep (one career, rich local context, tangible artifact, VR amplification). That depth-over-breadth approach is the core differentiator.

## Sources

- [ASCA: Engaging Middle School Career Development](https://www.schoolcounselor.org/Newsletters/January-2024/Engaging-Middle-School-Career-Development?st=IL)
- [AMLE: Career Exploration and Awareness in the Middle Grades](https://www.amle.org/career-exploration-and-awareness-in-the-middle-grades-research-summary/)
- [ACTE: Career Exploration in Middle School](https://www.acteonline.org/wp-content/uploads/2018/02/ACTE_CC_Paper_FINAL.pdf)
- [Claim Your Future](https://www.claimyourfuture.org/about-the-game/)
- [Kuder Galaxy](https://www.kuder.com/education-solutions/galaxy/)
- [Everfi Endeavor STEM Career Activities](https://everfi.com/courses/k-12/endeavor-stem-career-activities-middle-school/)
- [myBlueprint Education Planner](https://myblueprint.ca/products/educationplanner)
- [OECD: myBlueprint Education Planner Review](https://www.oecd.org/en/publications/observatory-on-digital-technologies-in-career-guidance-for-youth-odicy_e098122e-en/myblueprint-education-planner_b6314480-en.html)
- [Edutopia: Using Gamification to Ignite Student Learning](https://www.edutopia.org/article/using-gamification-ignite-student-learning/)
- [SVG Accessibility - FLOE Project](https://handbook.floeproject.org/approaches/svg-and-accessibility/)
- [A11Y Collective: Implementing Accessible SVG Elements](https://www.a11y-collective.com/blog/svg-accessibility/)
- [MN.gov: Accessibility Guide for Interactive Web Maps (Oct 2024)](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf)
- [Edutopia: The Art of Reflection (Digital Portfolios)](https://www.edutopia.org/blog/digital-portfolios-art-of-reflection-beth-holland)
- [CareerWise: 8 Interactive Activities for Career Learning](https://careerwise.ceric.ca/2025/08/21/8-interactive-activities-for-career-learning-with-kids-and-youth/)

---
*Feature research for: Interactive educational career exploration micro-site (Grade 7/8, Saskatchewan)*
*Researched: 2026-03-19*
