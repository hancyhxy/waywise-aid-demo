# Waywise v2: state-aware, whole-journey prototype

v1 (`../index.html`) is unchanged. All transport data is fictional.

## What changed from v1, and the evidence behind it

| v2 change | Evidence |
| --- | --- |
| **Rushing / Normal / Tired** state replaces "In a hurry / Need a seat"; it really re-ranks options and explains why ("…because you're tired") | Interview synthesis insight 4 (situational preferences); Haruna's UX story (tired → comfort) |
| Priority sliders now affect ranking (fixes a known v1 limitation) | Low-fi README limitation |
| "+7 min buys a likely seat" trade-off line on each card | Insights 3 and 7 (journey value, comparison) |
| **4 stages**: Before → Platform → On board → Arrived | Synthesis "before / at stop / during"; Haruna story steps 1–6; P03 checks twice |
| Platform: live departures, carriage crowding bar, "Too full, I'll wait" switch, backup plan | Insights 2 and 5; P03 boarding denial; story step 3 "unclear" |
| On board: quiet ride, "No action needed" | P01 alert overload; design principle 7 |
| Arrived: "Was it worth it?" → suggested rule → user approves → visible/removable in Priorities | MVP "learning later"; user control principle |
| Story presets: Alex tired after uni / Alex late for work | Haruna + the counterpart story she proposed (Justin) |

## Demo
Open `index.html`, or run `python3 -m http.server 4317` in this folder.
Screenshot URLs: `?story=tired|rushing`, `&stage=plan|platform|board|arrive`, `&rate=1-3`, `?screen=prefs`.
Screenshots: `shots/`.

## Still simulated
Live data, confidence, learning (only approved rules with fixed weights), persistence (resets on reload), the routine editor.

## Suggested A2 tests
- A/B: v1 (or fastest + crowd icon) vs v2 on the same disruption task. Measure time to choose, confidence, trade-off understanding, trust and overrides.
- Story tasks: "You're exhausted after class" / "You're 10 min late". Does the recommendation feel right?
