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
| R6 | Today opens on the journey from that day's schedule, labelled "Based on your Wednesday schedule, we recommend". No schedule for the day (or "No commute" / skipped) → empty From/To card. From/To card with swap button and Leave / Arrive by; tapping From/To opens a full-height **Change journey** layer (type a route, or tap today's or other saved journeys) without reloading Today | Today |
| R7 | Separate scopes: today only (Today card) / saved journey = where ("Saved journey · Where") / weekly schedule = when ("Weekly schedule · When") / one date ("Only Wednesday 16 October"), with matching titles and Save labels ("Save for this date", "Save for every week") | Sheets |
| R8 | Route cards: tap the card or **View details** → Route details drawer → **Start journey** (or **Start** on the card). The same ≈88% drawer then shows **In progress**; × or swipe down only collapses it to a mini bar above the nav (visible on every tab), tap to reopen. "Journey started" toast with **Undo** for a mis-tap. **End journey** is available at any step and asks for confirmation (mentions alerts and live sharing that will stop). No separate "selected" state | Today, drawers |
| R9 | Quick preferences stay on Today ("Tune this journey"): "Arrive sooner", "Prioritise a seat", "Select all that apply · applies to this journey only", check marks, Reset; less-used options under "More preferences" | Today |
| R10 | Today's choices apply to this journey only; explicit "Save as default"; Reset | Today, Profile |
| R11 | More preferences: less waiting, predictable arrival, transport modes | Today, Profile |
| R12 | Wait / Departs / Arrives shown separately; "9 min later than the next train" | Route cards |
| R13 | Badges in a fixed order (crowding, seat, walk, transfers, on-time %); active priorities outlined | Route cards |
| R14 | "Why this route?" with reason, trade-off and preference conflicts; any route can be chosen | Cards, Why sheet |
| R15 | "Arrival estimate confidence" with explanation; operator updates vs Waywise predictions; update times | Today, sheets |
| R16 | Carriage crowding diagram with front/direction, labels, update time and an unavailable-data state | Details, active |
| R17 | Compare alternatives from details and active journey; "Too full to board, or delayed?" | Details, active |
| R18 | Report carriage conditions; shown as passenger reports, separate from operator data | Details, active |
| R19 | Share journey: arrival time once, or time-limited live arrival updates (progress by stop, not GPS location) | Details, active |

## Added beyond the evaluation list

- **Arrival reminder** (In progress, Board / On board steps): "remind me one stop before <destination>". Turning it on shows a simulated iOS location prompt (Allow While Using App / Allow Once / Don't Allow). Don't Allow falls back to a timetable-based reminder with "Use my location instead". Location is used on the device only; shared journeys still show progress by stop (R19).
- Start → **Undo** toast and **End journey** confirmation (interaction details supporting user control).

## Demo data

Three saved journeys with returns form the weekly template: University (Wollstonecraft ⇄ UTS, to uni Mon–Thu 9:05, return Mon, Tue, Thu 17:30 — on Wednesdays Alex goes straight to work), Wednesday shift (UTS → Chatswood 17:45, home 21:30), Friday shift (Wollstonecraft → Chatswood 12:30, home 19:20). Scenario 1 = Tuesday 17:30 return from uni, 2 = Wednesday 17:45 to work, 3 = Friday 19:20 home. Each scenario shows one line of mood copy under the greeting (decorative only).

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
- **Profile** is one page: account sync, travel preferences (+ "Learn from my choices", moved out of Alerts), alerts. The "Saved journeys" link was removed.
