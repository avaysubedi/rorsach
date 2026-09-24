# Product Requirements — Rorschach CS Coding Assistant

Last updated: 2026-09-24  
Package: `rorschach-coding-assistant` `0.1.0`  
Live site: https://avaysubedi.github.io/rorsach/

## What Rorschach is

Rorschach CS Coding Assistant is a browser-only Angular 19 workstation for trained examiners who record Comprehensive System (Exner) coding for a Rorschach protocol.

It is a coding worksheet. The examiner enters the protocol, codes each response, and may use a card location map to select regions. The app stores that coding, counts it, and can export it. It does not score the protocol, look up official Exner tables, or produce a clinical interpretation.

The on-screen disclaimer states this boundary: Location Number, Form Quality, Popular, GHR/PHR, special scores, and interpretation stay examiner judgment against official references. The only automatic location behavior is filling Location `W` and Location Number `W` when the whole blot is selected, plus filling Location `D`, `Dd`, or `S` when every selected region is the same type.

## Problem it solves

Coding a CS protocol is clerical as well as clinical. Examiners move between blot cards, inquiry notes, location charts, and a response table. This app puts that worksheet on one screen:

- Protocol header and response text stay with the coding fields.
- Card location regions can be clicked on an SVG overlay or chosen from a code palette.
- Unambiguous region selections fill the Location field.
- A single local draft survives a refresh.
- JSON can leave and re-enter the browser. CSV can leave it for a spreadsheet.

It does not replace licensed scoring software, published location charts, form-quality tables, or popular-response tables.

## Target users

| Audience | Use |
| --- | --- |
| Licensed psychologists and trained CS examiners | Primary. Enter and code a protocol. |
| Supervisors and students in CS training | Practice coding on the same worksheet. |
| Maintainers | Extend catalogs, maps, and the local draft. |

Examinees, untrained users, and automated clinical decision-making are outside the product.

## Current features

### Protocol metadata

Examinee code, age, gender, date, examiner, and notes. No field validation. Header edits persist only when the draft is saved (explicit save, or any add / update / delete / import).

### Response capture

Card (I–X), response number, verbatim response, and Location are required. Inquiry is optional; an empty inquiry after the field is touched shows a warning hint and does not block save. Extra inquiry fields: location pointed by the examinee, what made it look like that, examiner notes.

### Coding fields

Dropdowns and multi-selects come from `src/assets/data/coding-options.json`:

- Location: `W`, `D`, `Dd`, `S`
- Developmental quality: `DQ+`, `DQo`, `DQv/+`, `DQv`
- Determinants: `F`, `M`, `FM`, `m`, `FC`, `CF`, `C`, `C'`, `FC'`, `C'F`, `T`, `V`, `Y`, `FD`, `rF`, `Fr`, `Pair/2`
- Form quality: `FQ+`, `FQo`, `FQu`, `FQ-`
- Content codes: standard CS-leaning set (`H`, `(H)`, `A`, `An`, `Art`, and the rest in the catalog)
- Special scores: CS codes plus selectable `GHR`, `PHR`, and `MAP`
- Confidence: High, Medium (default), Low
- Popular: checkbox

Conditional rules:

- FQ Explanation is required when Form Quality is `FQ-`.
- Missing Information is required when Confidence is `Low`.
- A reference-lookup banner appears when Location Number is empty, Form Quality is empty, or Special Scores is empty. Empty special scores are often correct, so this banner is noisy.

### Card location map

For the selected card, `CardLocationMapComponent` loads `card-location-maps.json` and `card-location-catalog.json`.

- All ten cards have starter SVG polygons (`spatialStatus: "starter"`) on a `0 0 1000 1000` viewBox, drawn over `assets/cards/card-*.png`.
- A code palette merges catalog entries with map polygons. Codes that exist only in the catalog are selectable chips without a hit target on the blot.
- Whole Blot sets `W` and clears other codes. Selecting a detail clears `W`.
- Show Labels, hover, and selection styling are in the map component.
- Location auto-fill (`AppComponent.applyLocationAutoFill`):

| Selected region types | Location |
| --- | --- |
| Includes `W` | `W`, Location Number `W` |
| Only `D` | `D` |
| Only `Dd` and/or `DdS` | `Dd` |
| Only `S` | `S` |
| Mixed | Location cleared; examiner must confirm |

Polygons are approximate. Each card’s `source` / catalog `note` says to verify before clinical use.

### Structural Summary Preview

Browser-side counts only: total R, popular count, and breakdowns by card, location, DQ, determinants, content, special scores, and FQ. Ratios and indices (EB, Lambda, EA, es, D, AdjD, Z, Afr, constellations) are not computed. `reference-status.json` marks `structuralSummary` as `partial`. That file is loaded and not shown; the banner text is hardcoded.

### Persistence and exchange

| Action | Behavior |
| --- | --- |
| Save / silent restore | One draft in `localStorage` key `rorschach-cs-protocol-draft` |
| Load | Replaces in-memory metadata and responses |
| Export JSON | Downloads the full `SavedProtocol` as `rorschach-protocol.json` |
| Import JSON | Accepts any object with `metadata` and a `responses` array, then saves |
| Export CSV | Response table subset as `rorschach-responses.csv`. Not re-importable |

`LocalStorageService.clear()` exists and has no button.

### Delivery

`npm start` serves `http://localhost:4200/`. Push to `main` builds the `pages` configuration (`baseHref: /rorsach/`) and deploys GitHub Pages.

## User workflows

### Code a new response

1. Open the app. A previous draft restores with no message.
2. Fill protocol metadata.
3. Choose a card, response number, and verbatim text. Add inquiry notes.
4. Select regions on the map or palette, then confirm Location, Location Number, DQ, determinants, FQ, content, Popular, and special scores.
5. Add Response. The row appears in Coded Responses and the draft is written.

### Correct a response

1. Edit on the row. The form scrolls to the top and the button becomes Update Response.
2. Change fields. Map selection follows `selectedLocationCodes`.
3. Update Response, or Clear Form to abandon the edit.

### Move the protocol

1. Export JSON to keep the full document (regions, explanations, metadata).
2. On another browser, Import JSON. The draft is replaced and saved.
3. Export CSV when a spreadsheet of the main coding columns is enough.

### Review counts

After responses exist, Structural Summary Preview lists counts. The examiner still computes the CS structural summary from official references.

## Future vision

Priority order already recorded in `NEXT_STEPS.md`. The product stays a worksheet until an owner decision says otherwise.

1. **Safety and hygiene.** Clear-draft with confirmation, delete confirmation, metadata auto-save, PHI handling for shared machines, self-hosted fonts.
2. **Verify the workstation.** Check every starter polygon against Table A. Surface `reference-status.json` in the UI. Soften the empty-special-scores warning. Decide what to do with orphaned click-to-mark fields (`imageLocations`).
3. **Split the screen without changing behavior.** Metadata, response form, summary, and table can leave `AppComponent`. Keep `SavedProtocol`, `ExportService`, `LocalStorageService`, and `CardLocationMapComponent` as the seams. Add a router only when a second screen exists.
4. **Catalog completeness, still manual.** Location combinations `WS` / `DS` / `DdS`, missing determinants (active/passive, shading blends), and a decision on GHR/PHR versus derived codes and on R-PAS-like `MAP`.
5. **Scoring only with licensed data.** If ratios are ever added, isolate them behind pure functions and fixtures. Keep the disclaimer until they are validated. Do not put copyrighted Exner tables in the public repo.

## Business goals

- Cut clerical time for a trained examiner who already knows CS coding.
- Keep one protocol document local to the browser so the prototype can run without accounts or a server.
- Make location selection less error-prone when the map geometry is unambiguous, and force a manual Location choice when it is not.
- Stay honest about scope: counts and recording, not a clinical instrument and not a substitute for licensed references.
- Keep the public Pages build useful for the worksheet while treating downloaded JSON and `localStorage` as sensitive clinical data.

## Out of scope until an explicit decision

- Auto-coding Location Number beyond the current whole-blot `W` rule
- Auto-coding Form Quality, Populars, GHR/PHR, or interpretation
- Multi-protocol libraries, named drafts, examiner accounts
- Backend, encryption, audit log, or PHI-compliant hosting
- Committing additional copyrighted plates or Exner tables without documented rights
