# Current Context

Last updated: 2026-09-24

Session brief for the next change. Re-verify against the source if this date is old. Root markdown (`ARCHITECTURE.md`, `DEVELOPMENT_STATUS.md`, `KNOWN_ISSUES.md`, `PROJECT_OVERVIEW.md`, `NEXT_STEPS.md`) is a handover from before several features landed. Prefer this file, `docs/STATUS.md`, and the code.

## Product right now

Version **0.1.0**. One Angular 19 page. The examiner fills a protocol, codes responses, uses a location map, sees counts, and stores a single local draft.

Public URL: https://avaysubedi.github.io/rorsach/ (`baseHref` `/rorsach/`). Local: `npm start` → `http://localhost:4200/`.

## What the code actually contains

- Standalone `AppComponent` (~510 lines TS, ~460 lines HTML) plus `CardLocationMapComponent`.
- Forms: `UntypedFormBuilder`. Required: card, response number, verbatim, location. `FQ-` requires an explanation. Confidence `Low` requires missing information.
- Storage key: `rorschach-cs-protocol-draft`. Silent restore on startup. `clear()` has no button.
- Maps: cards I–X in `src/assets/data/card-location-maps.json`, every card `spatialStatus: "starter"`, viewBox `0 0 1000 1000`.
- Palette: `card-location-catalog.json` merged with polygons by code. Catalog counts are higher than polygon counts, so some codes have no hit target. Card I spatial map has five `D` regions; the catalog also has `D5` and `D6`.
- Images: `src/assets/cards/card-i.png` … `card-x.png` are tracked. The map shows a placeholder if an image fails and still draws polygons.
- `reference-status.json` is loaded into `referenceStatus` and not shown. The banner text is hardcoded.
- `imageLocations` and the click-to-mark methods remain. The click viewer is gone from the template. Dead SCSS for that viewer remains on `AppComponent`.
- Deploy: `.github/workflows/deploy-pages.yml` on push to `main`.

## Active focus

Verify starter polygons in the app (Show Labels on) before treating any card as clinical geometry. Do not start a scoring engine. Do not add a router, backend, or second storage key unless the owner approves an ADR.

## Safe edits

- Copy, validation, and layout inside the existing screen
- Catalog JSON that still matches `rorschach.models.ts`
- Polygon coordinates in `card-location-maps.json`, with the catalog kept in sync
- Wiring `LocalStorageService.clear()` to a confirmed “new protocol” action
- Splitting `AppComponent` along metadata, response form, summary, and table without changing behavior

## Proposed and not approved

`docs/CODING_ASSISTANCE_ENGINE.md` is implemented as suggest-only assistance (ADR-012). Official appendix rows are not in git. Copy `src/assets/data/reference-pack.sample.json` to `src/assets/data/reference-pack.json` for local suggestions. That runtime file is gitignored.

## Do not do on a normal task

- Auto-code Form Quality, Populars, GHR/PHR, interpretation, or Location Number beyond the current `W` rule
- Add Exner tables or extra blot plates without documented rights
- Upload protocol JSON anywhere
- Invent controllers, SQL, or auth. Those layers are not in the repo
- Trust root `KNOWN_ISSUES.md` item B1 (“maps only for I and IV”) or B2 (“no PNGs”). Both are outdated

## Owner rules already in force

`.cursor/rules/rorschach-lead-engineer.mdc` and `docs/AGENTS.md`: read docs, analyze, reuse seams, keep the disclaimer, update `docs/STATUS.md` after behavior changes, add an ADR for architecture changes, wait for approval before coding.
