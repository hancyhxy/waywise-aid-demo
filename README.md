# Waywise — AID prototypes

Live: https://hancyhxy.github.io/waywise-aid-demo/

| Path | Course version | Notes |
| --- | --- | --- |
| `/` (root) | **v3 high-fidelity** | Built from the latest mid-fi and revised after the usability evaluation. |
| `/mid-fi/` | v2 mid-fidelity | Revised after the lo-fi heuristic evaluation. |
| `/mid-fi-v1-tested/` | v2 as tested | Frozen build used in the 14 Oct usability sessions. Do not edit. |
| `/low-fi/` | v1 low-fidelity | Wireframes and 16:9 deck. |
| `/concept/` | Original concept demo | The Sep 2026 concept that used to live at the root. Archived. |
| `/v2/` | Exploration | State-aware Rushing/Normal/Tired variant (not the course "v2"). |

## High-fidelity (root): what changed after usability testing

Source: Evelyn's synthesis in `a2-deliverables/03-usability-evaluation/synthesis-evelyn/` (`Prototype_Recommendation_List.pdf` R1–R19, `Prototype_Annotated_Review.pdf` pages 01–08). Visual language stays the mid-fi palette: neutral greys, one blue accent, red/amber/green for status only and always paired with text.

| # | Change | Where |
| --- | --- | --- |
| R1 | "Add your first journey" empty state; only From and To are required | Scenario 0, Today |
| R2 | Trips → **Saved journeys**. Two layers, like adding a course before timetabling it: the saved journey is the route (*where*: From/To, optional return), the schedule is the optional *when*. Journey cards show each direction's schedule, with Routes / Edit journey / Add to schedule | Saved journeys tab |
| R3 | Scheduling is optional and comes after saving: Add journey asks only for the route, then offers "Add to schedule" or "Not now". Each direction has its own days and leave time ("Same days as going" by default). In Schedule, "Add to <day>" picks a saved journey (or a new one), and tapping a row opens Show routes now / Change time / Remove from schedule, each scoped to "Only this date" or "Every week" | Schedule view, sheets |
| R4 | Route-based names ("UTS (Central) → Chatswood"); custom names optional; no day templates | Saved journeys, forms |
| R5 | **Profile** from the AL avatar: one page with account sync status (saved journeys, schedule and preferences), default travel preferences and alerts. Saved journeys are reached from their own tab, not duplicated here | Profile tab |
| R6 | Today opens on the journey from that day's schedule, captioned "Suggested from your Wednesday schedule". No schedule for the day (or "No commute" / removed for the date) → empty From/To card. From/To card with a swap button (return-direction shortcut) and Leave / Arrive by; tapping From/To opens a full-height **Change journey** layer listing today's and other saved journeys, or type any route, without reloading Today | Today |
| R7 | Separate scopes: this journey only (Today: "Changed for this journey only", "Time for this journey") / saved journey = where ("Saved journey · Where") / weekly schedule = when ("Weekly schedule · When") / one date ("Only Wednesday 16 October"), with matching titles and Save labels ("Use for this journey", "Save journey", "Save schedule", "Save for this date", "Save for every week") | Sheets |
| R8 | One selection label on every card: tap the card or **Details ›** → Route details drawer → **Start journey** (fixed at the bottom), or **Start** on the card. The drawer then shows **In progress** with a step tracker; × or swipe down collapses it to a mini bar above the nav (every tab). "Journey started" confirms the start and says whether alerts are on. **End journey** is available at any step and asks for confirmation (mentions alerts and live sharing that will stop) | Today, drawers |
| R9 | Quick preferences stay on Today: one "Your preferences" control above the results opens "What matters to you?" with "Select all that apply · applies to this journey only", check marks, and less-used options under "More". Labels describe the routing effect ("Arrive sooner", "Prioritise a seat", "Predictable arrival") | Today |
| R10 | Two layers in plain words: **usual preferences** (Profile, "Saved" state) start every journey; changes on Today apply to this journey only and the control is tagged **This journey**. "Reset" goes back to the usual set; "Save for next time" is the explicit Save as default | Today, Profile |
| R11 | More preferences: less waiting, predictable arrival, transport modes | Today, Profile |
| R12 | Route cards show "Leave by 17:54 · Departs 18:01 · Wait 2 min" and the large Arrives time separately; a later service adds "Departs 9 min later than the next train" (plus the arrival difference when it differs). Route details repeat Leave by / Departs / Arrives and the platform wait | Route cards, details |
| R13 | Fixed order on every card: walking and line in the leg chain (walk › T1 › walk), then crowding, seat chance and on-time %; walking time and transfers are added as text when Less walking / Avoid transfers is on; preference conflicts are flagged in amber ("Seat unlikely, but you chose Prioritise a seat") | Route cards |
| R14 | Recommended card states the action and one short reason ("Recommended · take this train — on time for your shift"); "Why this route?" in Route details gives the reason, trade-off and preference conflicts; any route can be chosen. With a hard deadline (shift start) a late option is never recommended, and an amber trade-off note explains what was given up | Cards, details |
| R15 | "Arrival estimate confidence: Medium · updated 2 min ago" in Route details; tap it for "How reliable is this estimate?" (what may change, operator updates vs Waywise predictions, update times). The cryptic "Arrivals ±5 min" pill on Today was removed | Route details, sheets |
| R16 | Carriage crowding diagram with front/direction, labels, update time and an unavailable-data state | Details, active |
| R17 | Compare alternatives from details and active journey; "Too full to board, or delayed?" | Details, active |
| R18 | Report carriage conditions; shown as passenger reports, separate from operator data | Details, active |
| R19 | Share journey: arrival time once, or time-limited live arrival updates (progress by stop, not GPS location) | Details, active |

## Added beyond the evaluation list

- **Arrival reminder** (In progress, Board / On board steps): "remind me one stop before <destination>". Turning it on shows a simulated iOS location prompt (Allow While Using App / Allow Once / Don't Allow). Don't Allow falls back to a timetable-based reminder with "Use my location instead". Location is used on the device only; shared journeys still show progress by stop (R19).
- **End journey** confirmation at any step (user control); the Arrived step ends with a single End journey action.

## Deliberate differences from the evaluation documents

| Evaluation note | What we did | Why |
| --- | --- | --- |
| Review 04.1 "Keep the highlighted card and Undo" | No Undo toast after Start; Route details come before Start, and End journey (with confirmation) is available at every step | A mis-tap on Start is reversed by End journey, which also explains what stops (alerts, live sharing). A timed Undo toast covered the drawer and added a second way to do the same thing |
| Review 08.1 / 08.5 "Keep the existing sliders… visible 1–10 values" | Usual preferences are on/off choices, the same list as on Today, with a visible "Saved" state and Reset preferences | R9 found people read preference labels differently; one list of clear, checkable choices in both places avoids having to map a 1–10 weight to a quick toggle. Ranking still weights every chosen preference |
| R13 "consistent positions … walking" as a badge | Walking stays in the leg chain on every card (same position), not as a separate badge unless Less walking is on | Avoids repeating the same number twice on every card while keeping its position fixed |

## Demo data

Three saved journeys with returns form the weekly template: University (Wollstonecraft ⇄ UTS, to uni Mon–Thu 9:05, return Mon, Tue, Thu 17:30 — on Wednesdays Alex goes straight to work), Wednesday shift (UTS → Chatswood 17:45, home 21:30), Friday shift (Wollstonecraft → Chatswood 12:30, home 19:20). Scenario 1 = Tuesday 17:30 return from uni (no arrive-by time: comfort first), 2 = Wednesday 17:45 to work (shift starts 18:30, a hard deadline), 3 = Friday 19:20 home. Each scenario shows one line of mood copy under the greeting (decorative only).

## Demo controls

Desktop: scenario buttons on the left. Phone: Profile → Switch demo scenario.

Screenshot URLs: `?scenario=0|1|2|3`, `&prefs=sooner,seat,walk,transfer,reliable,wait`, `&select=take|wait|switch` (route shown in Route details), `&id=uni|work|fri` (for `sheet=sched|added`), `&screen=today|journeys|schedule|profile|details|active`, `&sheet=why|compare|report|share|add|sched|pick|added|occ|edit-today`, `&export=1` (phone only).

## Run locally

```bash
python3 -m http.server 4317 --directory .
```

No build step, dependencies or live transport API. All transport data is fictional.

## v3.1 visual refresh (post-review)

UI critique pass against Google Maps (route search) and Ctrip (flight search card) patterns:

- **Sydney mode language.** Route legs now use Transport for NSW roundels + line pills (train `#F6891F`, metro `#168388`, bus `#00B5EF`; per TfNSW open-data brand resources, prototype use only). Red/amber/green are reserved for status text; mode colours never carry status meaning.
- **Route cards rebuilt.** Leg chain (walk › T1 › walk) + one large Arrives time per card; Leave/Departs/Wait collapsed to one text line; crowding/seat/on-time as text-level status instead of colour-filled badges; "Recommended + why" merged into a single strip at the top of the card.
- **Today hierarchy.** Schedule suggestion is a caption inside the search card; preference tuning collapsed into a filter-chip row (full list in a sheet); alert moved into the results section; duplicate section headings removed.
- **Icon system.** Hand-drawn SVGs replaced with Lucide-style 2px-stroke icons; bottom nav uses house / route / person; sheet close actions say "Done" (no more "Back to routes").

## v4.8 (post-review)

- **Saved journeys = where + when.** Route first, schedule second (optional). Time lives only in the schedule, per direction, so "uni return not on Wednesdays" is just a day left out instead of a skipped date.
- **Schedule rows** open one scoped sheet instead of inline links: Show routes now · Change time · Remove from schedule (only this date / every week) · Edit saved journey (the route, every date). Saved journeys can be deleted from Edit saved journey.
- **Route details**: "Not started yet" removed; Start journey sits in a fixed footer at the bottom of the drawer. Bottom-sheet actions use the same fixed footer (the old `position:sticky` footer drifted up on iOS).
- **Confidence**: the "Arrivals ±5 min" pill on Today is gone; confidence is shown and explained in Route details.
- **Profile** is one page: account sync, travel preferences (+ "Learn from my choices", moved out of Alerts), alerts. The "Saved journeys" link was removed.

## v4.9 (evaluation follow-ups)

- R9 "Select all that apply · applies to this journey only"; preferences in plain words: **usual** (Profile, with a Saved state) vs **This journey** (Today). "Reset" / "Save for next time" replace "Back to default" / "Save as default".
- R12 on cards: Departs and Wait next to Leave by; later services say "Departs N min later than the next train".
- Scenario 2 never recommends a train that misses the shift; an amber trade-off note names the better-seat option it passed over. Scenario 1 has no arrive-by time.
- "Journey saved" offers Show routes now (review 06.5). One-off changes say "this journey only" everywhere.
- Single-choice chips (share, duration, report category) no longer show empty check boxes; trade-off notes are amber; Compare says "View" before a journey starts and is hidden after arrival; range arrivals say "10–30 min late".
