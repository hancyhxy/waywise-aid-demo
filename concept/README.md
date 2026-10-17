# Waywise — Interactive Concept Demo (archived)

> Archived on 17 Oct 2026. This Sep 2026 concept used to be served at the site root; it now lives at https://hancyhxy.github.io/waywise-aid-demo/concept/. The root now serves the course v3 high-fidelity prototype.

A mobile-first web prototype for the **Personalised Low-Crowding Route Recommendation** project.

## Concept

Waywise helps commuters compare three actions when crowding or disruption changes a routine journey:

- **Take** the next service
- **Wait** for a potentially more comfortable service
- **Switch** to an alternative route

Recommendations expose travel time, seat or boarding likelihood, walking, transfers, reliability and confidence instead of hiding the trade-off behind a single route result.

## Demo flows

1. Switch between **Disruption**, **Normal day**, and **Full bus** scenarios.
2. Toggle journey context such as **In a hurry** or **Need a seat** and observe the recommendation change.
3. Choose an option or open its recommendation explanation.
4. Open **My commutes** to switch across a seven-day routine: office, university, remote and personal days, with separate outbound and return journeys.
5. Adjust default priorities using the bottom navigation.

## Run locally

```bash
python3 -m http.server 4317 --directory .
```

No build step, package installation, external font, analytics or live transport API is required. All displayed transport data is fictional and used only to demonstrate interaction design.
