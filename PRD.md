# Career Explorer Micro-Site — Product Definition Document

**Generated:** March 13, 2026
**Status:** Ready for Design & Engineering
**Context:** VR Hub × myBlueprint Saskatchewan Pilot Collaboration

---

## Executive Summary

### Product Vision
Every student who steps into a VR career simulation arrives with real-world context and leaves with a clear, personal connection to what they just experienced — and a record of it in their portfolio.

### Problem Statement
Students currently enter VR career simulations cold. They have no framing for what the occupation involves, what it pays, who's hiring locally, or how to get there from where they are right now. This reduces the impact of the VR experience and creates a gap between momentary excitement and meaningful career exploration. On the other end, after the VR experience, students need a structured bridge back into myBlueprint to turn that excitement into research, reflection, and portfolio artifacts — but without guidance, the momentum drops.

### Target User
**Primary Persona:** Grade 7/8 student (ages 12–14) at Saint Luke School in Regina, Saskatchewan. They have limited or no prior exposure to skilled trades as a career path. They're digitally fluent but have short attention spans for anything that feels like schoolwork. They access technology primarily through school-issued Chromebooks or shared devices.

### Proposed Solution
A standalone, no-login, interactive micro-site that serves as the bookend to the VR Hub experience. From a single landing page, students select one of two paths: **Pre-VR** takes them through a six-screen guided experience that builds context and excitement about carpentry as a local, in-demand career and produces a personalized downloadable Carpenter Card; **Post-VR** takes them to a bridge page with a structured checklist that guides their next steps in myBlueprint.

### Unique Value Proposition
This isn't a static information page. It's a gamified, visually bold, zero-friction experience that makes career data feel personal and produces a tangible artifact — the Carpenter Card — that students take into their portfolio. The architecture is templatized so the same structure can be adapted to any occupation with a content swap.

### Scope Boundaries

| Category | Items |
|----------|-------|
| **IN SCOPE (MVP)** | • Landing page with Pre-VR / Post-VR path selection<br>• Six-screen Pre-VR interactive experience (carpentry only)<br>• Personalized Carpenter Card generation and download<br>• Post-VR bridge page with myBlueprint checklist<br>• Google Analytics event tracking for all meaningful interactions<br>• Fully responsive design (Chromebook, laptop, mobile)<br>• WCAG AA accessibility compliance<br>• Seed employer data (to be replaced with sourced content later) |
| **OUT OF SCOPE** | • Student authentication or login — *fully anonymous*<br>• Any changes to the myBlueprint platform itself — *students use existing functionality*<br>• VR simulation or headset-side experience — *owned by Melcher/VR Hub*<br>• Content for occupations other than carpentry — *future consideration*<br>• Persistent data storage or user accounts — *single session, stateless*<br>• CMS or admin interface for content management — *content is hardcoded for pilot* |
| **FUTURE CONSIDERATION** | • Templatized content swap system for additional occupations (welding, medical lab tech, HVAC, etc.)<br>• CMS for non-technical content updates<br>• Integration with myBlueprint API for direct portfolio actions<br>• Multi-language support<br>• Educator-facing dashboard for aggregate analytics |

---

## Success Framework

### Success Metrics

| Metric | Type | Baseline | Target | How to Measure |
|--------|------|----------|--------|----------------|
| Pre-VR completion rate (Screen 1 → Screen 6) | Primary / Lagging | None | ≥ 80% of students who start reach Screen 6 | GA funnel events per screen |
| Carpenter Card downloads | Primary / Lagging | None | ≥ 70% of students who reach Screen 5 download a card | GA event on download action |
| Post-VR bridge page visits | Secondary / Lagging | None | ≥ 90% of students who complete VR scan the QR code | GA pageview on bridge route |
| Screen 2 tile selections | Leading | None | Track distribution across all six tiles | GA event per tile tap |
| Screen 3 employer card taps | Leading | None | Track total taps and per-employer breakdown | GA event per pin tap |
| Screen 4 pathway step expansions | Leading | None | Track which steps students explore | GA event per step tap |
| Average time per screen | Leading | None | Establish baseline during pilot | GA timing events |

### Definition of Done (MVP)
- [ ] All P0 stories shipped and verified on Vercel production deployment
- [ ] All analytics events firing and visible in Google Analytics
- [ ] Full six-screen Pre-VR flow completable end-to-end on Chromebook, laptop, and mobile
- [ ] Post-VR bridge page accessible and rendering correctly
- [ ] Carpenter Card generation and image download working across all target devices
- [ ] WCAG AA audit passed (automated + manual screen reader test)
- [ ] Seed employer data in place for Screen 3
- [ ] QR code URLs confirmed and tested with Melcher/VR Hub team
- [ ] Tested with a small group of students or proxies before pilot launch

### Kill Criteria
- The champion educator at Saint Luke cannot confirm participation before the April launch window
- Melcher/VR Hub cannot support the QR code handoff from the simulation
- Fewer than 10 students are available for the pilot cohort

---

## Epic & Story Structure

### Epic Overview

| Epic | Description | User Value | Priority |
|------|-------------|------------|----------|
| E1: Landing & Routing | Single entry point with path selection | Students get to the right experience with one tap | P0 |
| E2: Pre-VR Experience | Six-screen guided flow building career context | Students arrive at VR with real-world framing and excitement | P0 |
| E3: Carpenter Card | Personalized, downloadable card as a tangible takeaway | Students get a unique artifact tied to their selections | P0 |
| E4: Post-VR Bridge | Bridge page with structured myBlueprint checklist | Students transition from VR excitement into meaningful portfolio work | P0 |
| E5: Analytics & Tracking | Event tracking across all meaningful interactions | Team can report on engagement and optimize | P0 |

### Story Map

```
[Landing Page]          [Pre-VR Experience]                [Carpenter Card]        [Post-VR Bridge]       [Analytics]
      │                        │                                │                       │                    │
  S1.1 Route            S2.1 Hook (Screen 1)             S3.1 Card Builder       S4.1 Bridge Page      S5.1 Event Setup
  Selection             S2.2 Tasks (Screen 2)            S3.2 Card Download      S4.2 Checklist        S5.2 Funnel Tracking
                        S2.3 Employers (Screen 3)                                                       
                        S2.4 Pathway (Screen 4)                                                         
                        S2.5 VR Prep (Screen 6)                                                        
                                                                                                        
═══════════════════════════════════ MVP LINE ═══════════════════════════════════════════════════════════════
                                                                                                        
                        S2.6 Alternate occupation         S3.3 AI-varied          S4.3 Deep-link        S5.3 Educator
                        content (welding, etc.)           card backgrounds        to myBlueprint         Dashboard
```

### Release Plan

| Phase | Stories | Goal | Success Signal |
|-------|---------|------|----------------|
| MVP (Pilot) | All P0 stories | Prove the three-station model works at Saint Luke with carpentry | ≥ 80% completion rate, ≥ 70% card downloads, positive qualitative feedback from educator and students |
| v1.1 | Templatized content, additional occupations, sourced employer data | Expand to additional simulations and schools | Replication with < 1 week content turnaround per occupation |

---

## User Stories

### Epic 1: Landing & Routing

#### Story S1.1 — Path Selection

**User Story:**
> As a student arriving at the micro-site, I want to quickly choose whether I'm about to do the VR experience or have just finished it, so that I get to the right content immediately.

**Priority:** P0
**Estimate:** S

**Acceptance Criteria:**

```gherkin
Scenario: Student selects Pre-VR path
  Given the student has navigated to the micro-site landing page
  When they tap "Pre-VR" (or equivalent label)
  Then they are taken to Screen 1 of the Pre-VR experience

Scenario: Student selects Post-VR path
  Given the student has navigated to the micro-site landing page
  When they tap "Post-VR" (or equivalent label)
  Then they are taken to the Post-VR bridge page

Scenario: Landing page loads on Chromebook
  Given the student is using a school-issued Chromebook
  When the page loads
  Then both path options are visible without scrolling
  And the page is fully interactive within 3 seconds

Scenario: Landing page loads on mobile
  Given the student is using a mobile phone
  When the page loads
  Then the layout adapts to a single-column view
  And both options are tappable with appropriate touch targets (minimum 44x44px)
```

**Business Rules:**
- BR-1: No authentication or identification required at any point
- BR-2: Path selection does not persist — refreshing the page returns to the landing screen

**Dependencies:**
- Enables: All other stories (this is the entry point)

**UX Notes:**
- Design should be bold, age-appropriate for 12–14-year-olds, and immediately clear
- Avoid anything that looks like a login screen or form
- Two large, visually distinct tap targets — not a dropdown or text links

---

### Epic 2: Pre-VR Experience

#### Story S2.1 — The Hook (Screen 1)

**User Story:**
> As a student starting the Pre-VR experience, I want to see an attention-grabbing fact about what carpenters earn and how in-demand the career is, so that I'm immediately curious and engaged.

**Priority:** P0
**Estimate:** M

**Acceptance Criteria:**

```gherkin
Scenario: Screen 1 loads with animated salary counter
  Given the student has selected the Pre-VR path
  When Screen 1 loads
  Then a bold question or statement about carpenter earnings is displayed
  And an animated counter ticks up to the average Saskatchewan carpenter salary
  And two to three additional headline stats are displayed as large visual data points

Scenario: Stats displayed are Saskatchewan-specific
  Given Screen 1 is loaded
  Then the salary figure reflects Saskatchewan averages
  And the job availability number reflects Saskatchewan data
  And the demand projection reflects Saskatchewan or national projections

Scenario: Student progresses to Screen 2
  Given the student is viewing Screen 1
  When they scroll down or tap the continue/next prompt
  Then they are taken to Screen 2
```

**Business Rules:**
- BR-3: All career data displayed is hardcoded for the pilot (not pulled from a live API)
- BR-4: Data points must include: average salary, number of jobs currently available, and at least one stat about demand growth or workforce age

**Technical Notes:**
- Animated counter should be performant on older Chromebooks — use CSS animations or lightweight JS, avoid heavy animation libraries
- Stats are static content for MVP; templatization means these values swap per occupation in future versions

**UX Notes:**
- No interaction required on this screen — it's the attention grab
- Typography should be large and impactful; avoid dense paragraphs
- Counter animation should feel satisfying, not sluggish

---

#### Story S2.2 — What Do Carpenters Actually Do? (Screen 2)

**User Story:**
> As a student, I want to see the different types of tasks carpenters do so that I can understand the range of the career and pick the ones that sound most interesting to me.

**Priority:** P0
**Estimate:** M

**Acceptance Criteria:**

```gherkin
Scenario: Six task tiles are displayed
  Given the student has arrived at Screen 2
  Then six illustrated tiles are displayed, each representing a different aspect of carpentry
  And each tile has a short one-sentence description
  And the visual style uses clean illustrations or icons (not stock photography)

Scenario: Student selects tiles
  Given six tiles are displayed
  When the student taps a tile
  Then the tile shows a visible selected state (highlight or checkmark)
  And the student can select between two and three tiles

Scenario: Selection limit enforced
  Given the student has already selected three tiles
  When they tap a fourth tile
  Then one of the previously selected tiles must be deselected first
  Or the interaction prevents a fourth selection with clear feedback

Scenario: Selections stored in session
  Given the student has selected tiles
  When they progress to Screen 5 (Card Builder)
  Then their tile selections are available for card personalization

Scenario: Student progresses without selecting
  Given the student has not selected any tiles
  When they attempt to continue to Screen 3
  Then they are prompted to select at least two tiles before continuing
```

**Business Rules:**
- BR-5: Minimum two, maximum three tile selections required
- BR-6: The six task categories for carpentry are: framing a house, reading blueprints, finishing interior woodwork, operating power tools, working on commercial job sites, managing a construction project
- BR-7: Tile selections are held in local state for the duration of the session only; no server-side persistence

**Dependencies:**
- Enables: S3.1 (Card Builder uses tile selections)

**UX Notes:**
- Tiles should be tappable with generous touch targets
- Selected state must be visually obvious (not subtle)
- Layout should work as 2×3 grid on desktop/tablet and stacked or 2-column on mobile

---

#### Story S2.3 — Who's Hiring Near You? (Screen 3)

**User Story:**
> As a student, I want to see real companies in my area that employ carpenters so that the career feels local and tangible, not abstract.

**Priority:** P0
**Estimate:** L

**Acceptance Criteria:**

```gherkin
Scenario: Map with employer pins is displayed
  Given the student has arrived at Screen 3
  Then a stylized map of the Regina area is displayed
  And four to six pins are placed on the map representing real employers

Scenario: Student taps an employer pin
  Given pins are visible on the map
  When the student taps a pin
  Then a company card appears with: company name, logo (or placeholder), one-sentence description, approximate employee count, and (where available) a short quote from an employee

Scenario: Student closes a company card
  Given a company card is displayed
  When the student taps outside the card or taps a close button
  Then the card closes and the map is fully visible again

Scenario: Map is not interactive beyond pins
  Given the map is displayed
  Then the map does not support zoom, pan, or any navigation beyond tapping pins
  And the map is a static or stylized illustration, not an embedded Google Map

Scenario: Seed data is used for MVP
  Given this is the pilot version
  Then employer data is hardcoded seed content
  And the content structure supports future replacement with sourced data without code changes
```

**Business Rules:**
- BR-8: Four to six employers displayed for MVP, using seed data
- BR-9: Employer cards must include at minimum: name, one-sentence description, and approximate size. Logo and employee quote are optional for seed data.
- BR-10: The map is illustrative, not geographic — it communicates "local" without requiring mapping APIs

**Technical Notes:**
- Do not use Google Maps, Mapbox, or any third-party mapping SDK — use a static SVG or illustrated map to avoid API costs, loading overhead, and accessibility issues on older devices
- Employer data should be structured as a JSON content file for easy future replacement

**UX Notes:**
- Company cards should feel like real profiles, not database records
- If logos are unavailable for seed data, use a clean placeholder treatment
- The map should feel approachable and local, not clinical

---

#### Story S2.4 — How Do You Get There? (Screen 4)

**User Story:**
> As a student, I want to see the step-by-step pathway from where I am now to a career in carpentry so that it feels achievable and concrete, not overwhelming.

**Priority:** P0
**Estimate:** M

**Acceptance Criteria:**

```gherkin
Scenario: Pathway timeline is displayed
  Given the student has arrived at Screen 4
  Then a visual timeline or stepping-stone graphic is displayed
  And it starts at "You are here — Grade 7/8"
  And it includes at minimum five stages: high school courses, hands-on programming (RDIC), post-secondary training, apprenticeship, and employment/certification

Scenario: Student taps a pathway step
  Given the timeline is displayed
  When the student taps a step
  Then it expands with additional detail: specific course or program names, duration, estimated earnings at that stage, and relevant programs (e.g., Saskatchewan Youth Internship Program)

Scenario: Only one step expanded at a time
  Given a step is already expanded
  When the student taps a different step
  Then the previously expanded step collapses
  And the newly tapped step expands

Scenario: Pathway reflects Saskatchewan-specific content
  Given the pathway is displayed
  Then it references Miller Collegiate's carpentry stream (launching September 2026)
  And it references SaskPolytech for post-secondary
  And it references the Saskatchewan Youth Internship Program for apprenticeship credits
```

**Business Rules:**
- BR-11: Pathway stages for carpentry MVP are: (1) High school — Miller Collegiate Carpentry 10/20/30, (2) RDIC programs — Think Construction, skills training camps, (3) Post-secondary — SaskPolytech or equivalent, (4) Apprenticeship — Saskatchewan Youth Internship Program and Red Seal journey, (5) Employment — journeyperson certification and career
- BR-12: Content is hardcoded for the pilot; the data structure should support content swaps for other occupations

**UX Notes:**
- The timeline should feel like a journey, not a spreadsheet
- Each stage should feel achievable — emphasize "this is only X years away" or "you could start earning here"
- Accordion-style expansion works well for progressive disclosure on smaller screens

---

#### Story S2.5 — Get Ready for VR (Screen 6)

**User Story:**
> As a student who has completed the micro-site, I want to know what to expect in the VR simulation and what to pay attention to, so that I go in prepared and get more out of the experience.

**Priority:** P0
**Estimate:** S

**Acceptance Criteria:**

```gherkin
Scenario: VR preparation content is displayed
  Given the student has arrived at Screen 6
  Then the screen displays: a brief description of the carpentry simulation, basic orientation on headset and controllers, and two to three observation prompts

Scenario: Observation prompts connect to Station 3
  Given observation prompts are displayed
  Then they reference things students should notice during VR that will be relevant to the post-VR reflection (e.g., "Pay attention to the different tools you use," "Notice how many steps go into framing a wall," "Think about whether this felt like something you'd enjoy doing every day")

Scenario: Screen serves as a holding area
  Given the student has finished the Pre-VR experience
  When the VR station is not yet available
  Then the student can remain on this screen or revisit previous screens without losing state

Scenario: Navigation back to earlier screens
  Given the student is on Screen 6
  When they navigate back to any previous screen
  Then their tile selections from Screen 2 are still intact
```

**Business Rules:**
- BR-13: This screen has no required interactions — it is read-and-absorb content
- BR-14: Students must be able to navigate backward through all screens without losing session state

**Technical Notes:**
- Backward navigation must preserve local state (tile selections, card if already generated)

**UX Notes:**
- This is a cooldown screen — the tone shifts slightly from excitement to preparation
- Keep it short; students will be eager to get into VR
- Observation prompts should be scannable, not buried in paragraphs

---

### Epic 3: Carpenter Card

#### Story S3.1 — Card Builder (Screen 5)

**User Story:**
> As a student, I want to build a personalized Carpenter Card using my name, a chosen icon, and the tasks I selected earlier, so that I have a unique, tangible artifact from this experience.

**Priority:** P0
**Estimate:** L

**Acceptance Criteria:**

```gherkin
Scenario: Card builder screen loads with selections pre-populated
  Given the student has arrived at Screen 5
  Then their tile selections from Screen 2 are displayed on or referenced in the card
  And a first-name text input field is presented
  And a set of pre-designed icon options is presented (minimum six: hammer, saw, hard hat, tape measure, safety goggles, level)

Scenario: Student enters their name
  Given the first-name input is displayed
  When the student types their name
  Then the card preview updates in real time to show their name

Scenario: Student selects an icon
  Given the icon options are displayed
  When the student taps an icon
  Then the card preview updates to show the selected icon
  And only one icon can be selected at a time

Scenario: Card includes key career stats
  Given the card preview is rendering
  Then it displays: the student's first name, their chosen icon, the task labels from their Screen 2 selections, and key stats (salary range, demand level, years of training)

Scenario: Card visual has variety
  Given a card is generated
  Then the card uses a template layout with visual variation (colour shifts, background treatments, or pattern changes) based on the student's selections
  And no two plausible selection combinations produce identical-looking cards

Scenario: Name input validation
  Given the student is entering their name
  When they attempt to proceed without entering a name
  Then they are prompted to enter at least a first name
  And the input accepts 1–30 characters
  And the input does not accept empty or whitespace-only values
```

**Business Rules:**
- BR-15: First name is the only text input in the entire micro-site
- BR-16: First name is not stored or transmitted to any server — used only for client-side card rendering
- BR-17: Icon set for carpentry MVP: hammer, saw, hard hat, tape measure, safety goggles, level (six options)
- BR-18: Card visual variation is driven by a combination of icon selection and tile selections — the generation approach should produce visually distinct results using an image generation model, with the output being a styled card image
- BR-19: The card must render as a downloadable image (PNG or JPEG)

**Dependencies:**
- Depends on: S2.2 (tile selections from Screen 2)
- Enables: S3.2 (card download)

**Technical Notes:**
- The card is generated client-side as an image. The visual variation and background treatment should be produced via an image generation model (current best option: NanoBanana Pro 2). The prompt to the model should incorporate the student's selections to produce variety. Output is a raster image rendered into a card template.
- Alternative approach if image generation latency is unacceptable: use a set of pre-generated background variants mapped to selection combinations, with name and icon composited client-side via Canvas API
- The card template layout (name placement, icon position, stat placement, task labels) is fixed; the background/colour treatment varies

**UX Notes:**
- The card should feel like something worth keeping — not a certificate, more like a collectible or badge
- Real-time preview as students make selections builds anticipation
- Keep the name input prominent but low-friction — a single field, no labels beyond placeholder text

---

#### Story S3.2 — Card Download

**User Story:**
> As a student, I want to download my Carpenter Card as an image so that I can save it and upload it to my myBlueprint portfolio later.

**Priority:** P0
**Estimate:** S

**Acceptance Criteria:**

```gherkin
Scenario: Student downloads their card
  Given the student has completed their card (name entered, icon selected)
  When they tap the download button
  Then the card image is saved to their device as a PNG or JPEG file
  And the filename includes a recognizable identifier (e.g., "carpenter-card.png")

Scenario: Download works on Chromebook
  Given the student is using a Chromebook
  When they tap download
  Then the file downloads to the default Downloads folder
  And no additional permissions or popups are required beyond the browser default

Scenario: Download works on mobile
  Given the student is using a mobile phone
  When they tap download
  Then the image is either saved to photos/files or the share sheet is triggered (platform-dependent)

Scenario: Card is not downloadable until complete
  Given the student has not entered a name or selected an icon
  Then the download button is disabled or hidden
  And a prompt indicates what's still needed
```

**Business Rules:**
- BR-20: Download is the final action on this screen before progressing to Screen 6
- BR-21: No server-side storage of the generated card image

**Dependencies:**
- Depends on: S3.1 (card must be generated before download)

**Technical Notes:**
- Use Canvas API or similar client-side approach to render the final card image for download
- Test download behavior specifically on ChromeOS, as file handling differs from desktop browsers

---

### Epic 4: Post-VR Bridge

#### Story S4.1 — Bridge Landing Page

**User Story:**
> As a student who just finished the VR simulation, I want to land on a page that acknowledges what I just did and tells me exactly what to do next, so that I don't lose momentum between the exciting VR experience and the research/reflection work.

**Priority:** P0
**Estimate:** S

**Acceptance Criteria:**

```gherkin
Scenario: Bridge page loads from Post-VR path
  Given the student selected "Post-VR" on the landing page (or scanned the QR code that routes there)
  When the bridge page loads
  Then a congratulatory message is displayed acknowledging completion of the VR simulation
  And a numbered checklist of next steps is displayed

Scenario: Checklist items are displayed
  Given the bridge page is loaded
  Then the checklist includes the following items in order:
    1. Search for "Carpenter" in myBlueprint and favourite it
    2. Complete the Compatibility Survey for Carpenter
    3. Search for a local carpentry program (with specific suggestions like SaskPolytech) and favourite it
    4. Add artifacts to your portfolio (favourited career, program, survey results, Carpenter Card image)
    5. Set a goal related to what you learned today
    6. Complete the "I can" reflection statements

Scenario: Checklist items are checkable
  Given the checklist is displayed
  When the student taps a checklist item
  Then it toggles to a checked/completed visual state
  And the checked state is local only (no persistence beyond the session)

Scenario: Bridge page provides myBlueprint access
  Given the checklist references myBlueprint activities
  Then a prominent link or button to open myBlueprint is displayed
  And the link opens in a new tab
```

**Business Rules:**
- BR-22: Checklist state is local and session-only — not synced with myBlueprint
- BR-23: The checklist is instructional, not enforced — students can proceed through myBlueprint at their own pace
- BR-24: "I can" reflection statements referenced in the checklist are completed within myBlueprint, not on the bridge page itself

**UX Notes:**
- The congratulatory message should match the energy of the experience — not corporate, not underwhelming
- The checklist should feel like a clear mission list, not a worksheet
- Consider a visual progress indicator (e.g., "6 steps to complete your exploration") to maintain the gamified tone

---

### Epic 5: Analytics & Tracking

#### Story S5.1 — Event Tracking Setup

**User Story:**
> As the project team, we want to track all meaningful student interactions so that we can report on engagement and demonstrate pilot results to stakeholders.

**Priority:** P0
**Estimate:** M

**Acceptance Criteria:**

```gherkin
Scenario: Page view events fire for each screen
  Given the student navigates to any screen
  Then a page view event is sent to Google Analytics with the screen identifier

Scenario: Path selection is tracked
  Given the student is on the landing page
  When they select Pre-VR or Post-VR
  Then a custom event is sent with the selected path

Scenario: Tile selections are tracked (Screen 2)
  Given the student is on Screen 2
  When they select or deselect a tile
  Then an event is sent with the tile label and selection/deselection action

Scenario: Employer pin taps are tracked (Screen 3)
  Given the student is on Screen 3
  When they tap an employer pin
  Then an event is sent with the employer name

Scenario: Pathway step expansions are tracked (Screen 4)
  Given the student is on Screen 4
  When they tap a pathway step to expand it
  Then an event is sent with the step label

Scenario: Card interactions are tracked (Screen 5)
  Given the student is on Screen 5
  Then events are sent for: icon selection (with icon label), name entry completion, and card download

Scenario: Bridge page checklist interactions are tracked
  Given the student is on the bridge page
  When they check a checklist item
  Then an event is sent with the item label

Scenario: Funnel completion is trackable
  Given all screen-level events are firing
  Then a funnel can be configured in Google Analytics from Screen 1 through Screen 6
  And drop-off points between screens are identifiable
```

**Business Rules:**
- BR-25: No personally identifiable information is sent to Google Analytics — the student's name input is never included in any event
- BR-26: All events must use a consistent naming convention for easy reporting

**Technical Notes:**
- Use Google Analytics 4 (GA4) with the gtag.js library
- Define a clear event taxonomy before implementation (e.g., `screen_view`, `tile_select`, `card_download`, `employer_tap`, `pathway_expand`, `checklist_check`, `path_select`)
- Consider a lightweight analytics utility/wrapper to enforce consistent event naming

---

## Requirements Specification

### Functional Requirements

| ID | Requirement | Stories | Validation |
|----|-------------|---------|------------|
| FR-001 | System shall display a landing page with two selectable paths: Pre-VR and Post-VR | S1.1 | Both paths navigate to correct destinations |
| FR-002 | System shall present a six-screen linear Pre-VR experience with forward and backward navigation | S2.1–S2.5, S3.1–S3.2 | User can navigate all screens in sequence and return to previous screens |
| FR-003 | System shall display Saskatchewan-specific career data for carpentry on Screen 1 | S2.1 | Salary, job count, and demand stats are present and accurate |
| FR-004 | System shall allow students to select 2–3 task tiles on Screen 2 and persist selections in session | S2.2 | Selections visible on Screen 5; persist through backward navigation |
| FR-005 | System shall display an illustrated map with 4–6 tappable employer pins on Screen 3 | S2.3 | Pins are tappable; cards display correct employer content |
| FR-006 | System shall display an interactive career pathway with expandable steps on Screen 4 | S2.4 | All steps expand/collapse; content is Saskatchewan-specific |
| FR-007 | System shall generate a personalized Carpenter Card from student inputs (name, icon, tile selections) | S3.1 | Card renders with all inputs; visual variation is present |
| FR-008 | System shall allow download of the Carpenter Card as a PNG or JPEG image | S3.2 | File downloads on Chromebook, laptop, and mobile |
| FR-009 | System shall display a Post-VR bridge page with a checkable numbered checklist | S4.1 | All six checklist items present; items toggle checked state |
| FR-010 | System shall track all meaningful interactions via Google Analytics events | S5.1 | Events visible in GA4 dashboard; funnel configurable |

### Core User Flows

**Flow 1: Pre-VR Experience**
```
[Landing Page]
    │
    ▼
[Select "Pre-VR"]
    │
    ▼
[Screen 1: Hook — view salary and demand stats]
    │
    ▼
[Screen 2: Tasks — select 2–3 tiles]
    │
    ▼
[Screen 3: Employers — tap pins, view company cards]
    │
    ▼
[Screen 4: Pathway — tap steps to explore]
    │
    ▼
[Screen 5: Card Builder — enter name, pick icon, preview card, download]
    │
    ▼
[Screen 6: VR Prep — read prompts, wait for VR station]
```

**Flow 2: Post-VR Bridge**
```
[Landing Page or QR Code Scan]
    │
    ▼
[Select "Post-VR"]
    │
    ▼
[Bridge Page — view congratulations, work through checklist]
    │
    ▼
[Open myBlueprint in new tab — complete activities in existing platform]
```

### Data Requirements

| Entity | Key Fields | Validation Rules |
|--------|------------|------------------|
| Career Stats (Screen 1) | averageSalary, jobCount, demandGrowth, workforceAge | All fields required; numeric; Saskatchewan-specific |
| Task Tiles (Screen 2) | id, label, description, illustrationAsset | Six tiles required; label max 40 chars; description max 100 chars |
| Employers (Screen 3) | id, name, description, employeeCount, logoUrl (optional), quote (optional), pinPosition | 4–6 employers required; description max 120 chars |
| Pathway Steps (Screen 4) | id, label, expandedContent (courseName, duration, earnings, programs) | 5 steps required; expandedContent fields all required |
| Icon Options (Screen 5) | id, label, iconAsset | 6 icons required |
| Checklist Items (Bridge) | id, label, order | 6 items required; order is fixed |

### Integration Points

| System | Direction | Data | Trigger | Required for MVP? |
|--------|-----------|------|---------|-------------------|
| Google Analytics (GA4) | Out | Event data (screen views, interactions) | User actions | Yes |
| Image generation model | Out (API call) | Card parameters (selections, icon, colour seed) | Card generation on Screen 5 | Yes |
| myBlueprint | Link only | URL to myBlueprint platform | Student taps link on bridge page | Yes (link, not integration) |
| VR Hub QR code | Inbound | URL to landing page or Post-VR route | Student scans QR after VR sim | Yes (URL agreement, not technical integration) |

### Non-Functional Requirements

| Category | Requirement | Target | Measurement |
|----------|-------------|--------|-------------|
| Performance | Initial page load (landing) | < 3s on school Chromebook over standard school WiFi | Lighthouse + real-device test |
| Performance | Screen-to-screen navigation | < 500ms perceived transition | Manual test on target devices |
| Performance | Card generation (Screen 5) | < 5s from tap to preview render | Stopwatch test on Chromebook |
| Accessibility | WCAG compliance | Level AA | axe-core automated scan + manual screen reader test (VoiceOver, ChromeVox) |
| Accessibility | Touch targets | Minimum 44×44px | Manual measurement |
| Accessibility | Colour contrast | Minimum 4.5:1 for text, 3:1 for UI elements | Automated contrast checker |
| Responsiveness | Breakpoints | Fully functional at 320px (mobile), 768px (tablet), 1024px+ (Chromebook/laptop) | Manual test at each breakpoint |
| Browser Support | Chrome/ChromeOS | Latest two major versions | Manual test |
| Browser Support | Safari Mobile | Latest two major versions | Manual test |
| Hosting | Deployment | Vercel | Deployment pipeline verified |
| Privacy | Data collection | No PII sent to analytics; student name never leaves client | Code review + GA4 audit |

### UX Requirements

| Aspect | Requirement |
|--------|-------------|
| Empty States | Screen 3 employer cards: if logo unavailable, show clean placeholder. Screen 5: card preview shows template with placeholder text until name/icon entered |
| Loading States | Card generation (Screen 5): show a brief loading animation while the card image is being generated. All other screens: content is static/pre-loaded, no loading states needed |
| Error States | Card generation failure: display fallback message with option to retry. Network failure: since site is mostly static, most screens work offline after initial load. Analytics failure: silent — never block user interaction |
| Feedback | Tile selection: immediate visual state change (highlight/checkmark). Icon selection: immediate preview update. Card download: confirmation feedback (e.g., brief "Saved!" indicator). Checklist: toggle animation on check |
| Offline Behavior | Not required for MVP — school WiFi assumed. However, since content is static, the site should be resilient to intermittent connectivity after initial load |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
| Card generation latency is too high on school Chromebooks | Medium | High | Define fallback approach: pre-generated background variants mapped to selection combinations, composited client-side via Canvas API | Open |
| Employer seed data feels obviously fake to students | Low | Medium | Use real company names with generalized descriptions; another team will source real content before or shortly after pilot | Open |
| Students skip Pre-VR screens to get to VR faster | Medium | Medium | Design for short, punchy screens (10–20 min total); make each screen visually rewarding; don't gate progress with heavy interactions | Open |
| QR code handoff from VR sim doesn't work reliably | Low | High | Confirm with Melcher that QR can display at end of sim; have the educator provide the URL verbally or on a printed card as backup | Open |
| Chromebook screen resolution makes map or card look poor | Medium | Medium | Use SVG for map and scalable assets throughout; test card output at common Chromebook resolutions (1366×768) | Open |
| Champion educator at Saint Luke cannot participate | Low | High | Kelly Ireland has backup candidates identified; this is a kill criterion if unresolvable | Open |

---

## Assumptions Log

| ID | Assumption | Impact if Wrong | Validation Plan |
|----|------------|-----------------|-----------------|
| A-1 | Students will have access to a Chromebook, shared laptop, or mobile phone at the Pre-VR station | No way to access the micro-site; station breaks down | Confirm device availability with champion educator before pilot |
| A-2 | School WiFi is reliable enough for initial page load and card generation API call | Site won't load or card won't generate | Test on-site before pilot day; have offline fallback for card if needed |
| A-3 | 10–20 minutes is sufficient time for students to complete all six Pre-VR screens | Students won't finish, or screens feel rushed | Time the experience with a test group; adjust content density if needed |
| A-4 | Students will download their Carpenter Card and be able to find the file later for portfolio upload | Card artifact is lost; Station 3 portfolio step is incomplete | Provide clear download instructions; consider email-to-self option in future version |
| A-5 | The QR code displayed at the end of the VR simulation can link to our micro-site URL | Post-VR bridge page is unreachable from VR flow | Confirm with Melcher/VR Hub team; agree on URL before build |
| A-6 | Seed employer data is acceptable for the pilot | Screen 3 feels inauthentic | Frame as "local employers" not "these exact companies"; swap in real data ASAP |
| A-7 | A single shared URL for both paths (Pre-VR and Post-VR) will not cause confusion | Students accidentally go to the wrong path | Make path selection visually unambiguous; the educator can also direct verbally |

---

## Open Questions

| # | Question | Blocking? | Owner | Due |
|---|----------|-----------|-------|-----|
| 1 | What are the exact salary, job count, and demand figures to use for Screen 1? | Yes — needed for content | Damian / content team | Before build |
| 2 | What are the 4–6 seed employer names and descriptions for Screen 3? | Yes — needed for content | Content sourcing team | Before build |
| 3 | What are the specific expanded details for each pathway step on Screen 4 (course names, durations, earnings)? | Yes — needed for content | Damian / Jacques | Before build |
| 4 | Confirm with Melcher that a QR code can be displayed at the end of the VR carpentry simulation linking to our URL | Yes — needed for Post-VR flow | Dwayne Melcher | Before build |
| 5 | How many headsets will be at the station, and how many students per rotation? | No — but affects timing guidance | Kelly Ireland / educator | Before pilot |
| 6 | Confirm pilot start date (target: week of April 6) with champion educator | No — but affects delivery deadline | Dwayne / Kelly | Before build |
| 7 | Will a Miller High School PAA teacher attend on a designated day? | No — enhancement to pilot | Dwayne / Jacques | Before pilot |

---

## Appendix: Traceability Matrix

| User Need | Epic | Stories | Success Metric |
|-----------|------|---------|----------------|
| Students need real-world context before VR so the experience has more impact | E2 | S2.1, S2.2, S2.3, S2.4, S2.5 | Pre-VR completion rate ≥ 80% |
| Students want a tangible, personal takeaway from the experience | E3 | S3.1, S3.2 | Card download rate ≥ 70% |
| Students need a structured bridge from VR excitement to meaningful reflection | E4 | S4.1 | Bridge page visit rate ≥ 90% |
| The project team needs data to demonstrate pilot results | E5 | S5.1 | All events firing in GA4; funnel reportable |
| The site must be accessible to all students regardless of device or ability | All | All | WCAG AA compliance; functional on Chromebook, laptop, mobile |
| The architecture must support future occupation swaps without rebuilds | All | All (architecture decisions) | Content is separated from layout; adding a new occupation requires only content JSON changes |

---

## Sign-Off Checklist

Before proceeding to Design phase, confirm:

- [ ] Every story traces to a validated user need from the pilot collaboration
- [ ] Scope boundaries are explicit (IN/OUT/LATER)
- [ ] MVP line is clearly defined — only carpentry, only Saint Luke, only pilot
- [ ] Acceptance criteria are unambiguous (two people would agree on pass/fail)
- [ ] Business rules captured (not just UI behaviors)
- [ ] Success metrics have targets and instrumentation plan
- [ ] Dependencies mapped (Melcher QR code, seed data, educator confirmation)
- [ ] Top risks have mitigations identified
- [ ] No blocking open questions remain unassigned
- [ ] Content requirements are itemized so content sourcing can happen in parallel with build
