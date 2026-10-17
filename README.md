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
| R2 | Trips → **Saved journeys** with Use / Edit / Add journey actions | Saved journeys tab |
| R3 | Weekday scheduling is optional; skip or change one date without editing the schedule | Schedule view, Add journey |
| R4 | Route-based names ("UTS (Central) → Chatswood"); custom names optional; no day templates | Saved journeys, forms |
| R5 | **Profile** from the AL avatar: account sync status and default preferences | Profile tab |
| R6 | Today opens on the journey from that day's schedule, labelled "Based on your Wednesday schedule, we recommend". No schedule for the day (or "No commute" / skipped) → empty From/To card. From/To card with swap button and Leave / Arrive by; tapping From/To opens a full-height **Change journey** layer (type a route, or tap today's or other saved journeys) without reloading Today | Today |
| R7 | Separate scopes: Edit today's journey / Edit saved journey / Edit this occurrence / Edit recurring schedule, with matching titles and Save labels | Sheets |
| R8 | Route cards: tap the card or **View details** → Route details → **Start journey**; or **Start** directly on the card. "Journey started" confirmation, then the active journey. No separate "selected" state or Undo: viewing details commits nothing, and after starting, Switch / Compare alternatives / End journey give control back | Today, Route details, active |
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

## Demo data

Three saved journeys with returns form the weekly template: University (Wollstonecraft ⇄ UTS, Mon–Thu 9:05 / 17:30; Wednesday return skipped for work), Wednesday shift (UTS → Chatswood 17:45, home 21:30), Friday shift (Wollstonecraft → Chatswood 12:30, home 19:20). Scenario 1 = Tuesday 17:30 return from uni, 2 = Wednesday 17:45 to work, 3 = Friday 19:20 home. Each scenario shows one line of mood copy under the greeting (decorative only).

## Demo controls

Desktop: scenario buttons on the left. Phone: Profile → Switch demo scenario.

Screenshot URLs: `?scenario=0|1|2|3`, `&prefs=sooner,seat,walk,transfer,reliable,wait`, `&select=take|wait|switch` (route shown in Route details), `&screen=today|journeys|schedule|profile|details|active`, `&sheet=why|compare|report|share|add|edit-today`, `&export=1` (phone only).

## Run locally

```bash
python3 -m http.server 4317 --directory .
```

No build step, dependencies or live transport API. All transport data is fictional.
