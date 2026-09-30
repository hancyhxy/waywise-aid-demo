# Waywise — Low-fidelity wireframes

- Live wireframe: https://hancyhxy.github.io/waywise-aid-demo/low-fi/
- Original mid-fidelity demo (unchanged): https://hancyhxy.github.io/waywise-aid-demo/
- Slides: [Waywise-Low-Fidelity-16x9.pptx](Waywise-Low-Fidelity-16x9.pptx)

Created 2026-09-30 as a wireframe translation of the existing mid-fidelity prototype, not evidence of a historical earlier iteration or new user testing.

## Presentation

17 landscape 16:9 slides. Each contains one portrait 390 × 844 phone viewport, scaled proportionally, with purpose, elements, interaction and scope notes. The Today page has overview and scrolled comparison views; remaining slides cover scenario changes, explanation sheets, feedback, weekly routine states and priorities. White canvas, neutral strokes and text; no decorative colour, gradients, shadows or filled UI cards.

## Scope preserved

- Working demo interactions: navigation, scenario controls, journey chips and recommendation ranking, explanation overlays, decision feedback, seven-day routines, visible slider/toggle updates.
- Simulated only: live transport, confidence, persistent saving, monitoring, learning, alerts.
- Source limitations retained: priorities sliders do not affect ranking; Change journey opens Trips rather than applying a route; + and Edit week show a placeholder, not a complete editor.
- Small low-fi-only repair: reopening the general explanation resets stale route-specific text. Escape closes explanation overlays.

## Rebuild

Static website; no build or dependencies to browse. For the slide exporter only, install `python-pptx`, `playwright`, `Pillow` in a virtual environment and run `python3 -m playwright install chromium`, then `python3 build_deck.py`.

Screenshots are captured from this actual wireframe UI. Slide text remains editable; phone views are images. Automated checks validate 390:844 screenshots, neutral-colour pixels, navigation, chips, day selection, sliders, toggles and no JavaScript errors.
