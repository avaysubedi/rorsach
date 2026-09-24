# Status

Last updated: 2026-09-24  
Version: `0.1.0`  
Scope: local prototype and public GitHub Pages build. Not a production clinical system.

Root files `DEVELOPMENT_STATUS.md`, `KNOWN_ISSUES.md`, and `ARCHITECTURE.md` are older than the tree. This file is the status snapshot for agents. Where they conflict, this file and the source win.

Corrections against those older notes:

- Starter spatial maps exist for cards **I–X**, all marked `spatialStatus: "starter"`.
- Blot PNGs `card-i.png` … `card-x.png` are in `src/assets/cards/` and are tracked by git.
- A root `.gitignore` exists (`node_modules/`, `dist/`, `.angular/`, `exports/`, appendix images, PDFs).
- GitHub Actions deploys the `pages` build to GitHub Pages.

## Completed features

- Angular 19 standalone bootstrap, Material azure-blue UI, single workstation screen.
- Protocol metadata form.
- Response and coding form with catalogs from `coding-options.json`.
- Required card, response number, verbatim response, and location.
- FQ Explanation required for `FQ-`. Missing Information required when Confidence is `Low`.
- Inquiry empty-state hint (warning, not a block).
- Add, update, and delete responses with snackbar feedback.
- Structural Summary Preview as counts only.
- localStorage save, explicit load, and silent restore on startup.
- JSON export and import. CSV export of the response table.
- Location map: SVG polygons, hover and select, whole blot, clear, optional labels, code palette from catalog merged with polygons.
- Location auto-fill for unambiguous `W` / `D` / `Dd` / `DdS` / `S` selections, with a mixed-type warning.
- Missing-image fallback that keeps the SVG overlay when polygons exist.
- Pages deploy workflow on push to `main`.
- Coding assistance shell: in-browser search, accept-before-apply Form Quality and Popular suggestions, location hints, and a fullscreen map with zoom and pan. The official appendix is not in the repo. A gitignored `reference-pack.json` supplies local rows. `reference-pack.sample.json` is a non-clinical sample.

## In progress features

- **Map verification.** All ten cards are starter geometry. Sources say to verify against appendix figures before clinical use. Catalog region counts are higher than polygon counts on every card, so some codes are palette-only.
- **Card I geometry.** The spatial map has five `D` regions. The catalog lists seven (`D1`–`D4`, `D7`, plus `D5` and `D6`). `D5` / `D6` are selectable without polygons.
- **Reference-status flags.** `reference-status.json` loads into `referenceStatus` and is never rendered. The banner is hardcoded.
- **Click-to-mark.** `LocationMark` / `imageLocations` and `addImageLocation`, `removeImageLocation`, `clearImageLocations` remain. The image-click viewer is gone from the template.
- **Product boundary.** Still a worksheet. Scoring and reference lookup are intentionally unfinished.

## Missing features

- True CS structural summary (EB, Lambda, EA, es, D, AdjD, ZSum, Afr, IsolIndex, constellations, PTI, DEPI, CDI, HVI, OBS, and similar).
- Licensed lookup for location charts, form quality, and populars.
- Location codes `WS`, `DS`, `DdS` (region type `DdS` exists; the Location dropdown does not).
- Fuller determinant set (active/passive movement, shading blends such as FY/YF, FV/VF, FT/TF, Cn).
- Z / organizational activity field.
- Multi-protocol storage, named drafts, or examiner accounts.
- New-protocol action wired to `LocalStorageService.clear()`.
- Metadata auto-save.
- Delete confirmation.
- Tests, lint, and CI beyond the Pages deploy.
- Router or a second screen.
- Schema version on `SavedProtocol`.

## Known issues

| ID | Issue |
| --- | --- |
| B1 | Starter polygons are unverified and approximate. Overlapping shapes use SVG paint order for hits, not “most specific region”. |
| B2 | Catalog lists codes the spatial map does not draw (Card I `D5`/`D6` and similar gaps on other cards). Palette still offers them. |
| B3 | Click-to-mark API is orphaned. `AppComponent.imageMissing` is unused. |
| B4 | Metadata is not auto-saved. Refresh before Save, add, update, delete, or import can drop header edits. |
| B5 | `needsReferenceLookup` treats empty special scores as lookup required. |
| B6 | Mixed-type snackbar can fire on every mixed selection. |
| B7 | Map selection overwrites Location Number, including manual edits, whenever codes emit. |
| B8 | Import checks only `metadata` and `responses` array. Missing ids and wrong types are kept. |
| B9 | CSV omits inquiry extras, explanations, regions, confidence details, and metadata. CSV cannot be imported. |
| B10 | Delete has no confirmation. |
| B11 | `referenceStatus` is unused in the template. |
| B12 | `LocalStorageService.clear()` has no UI. |
| B13 | Changing card clears map fields only. Other in-progress coding fields stay. |
| B14 | Card image paths exist on `CardOption.image` and on each map. The viewer uses the map path. |
| B15 | Google Fonts are required at runtime for Inter and Material Icons. |
| B16 | Blot PNGs are in the git history. Redistribution needs rights. See `src/assets/cards/README.md`. |

## Technical debt

- **God component.** `AppComponent` owns forms, summary math, persistence, import, and map orchestration (~510 lines of TypeScript, ~460 lines of template).
- **Untyped forms.** `UntypedFormBuilder` and `as RorschachResponse`.
- **Subscriptions** on `valueChanges` are never unsubscribed.
- **Duplicate actions** on the toolbar and the actions band.
- **Dead SCSS** for the removed card-click viewer.
- **Duplicate map JSON** in `books/` versus `src/assets/data/`.
- **Unused dependency** `@angular/router`.
- **Summary counts** live as private methods on the component.
- **No tests** around auto-fill, JSON parse, or CSV escaping.
- **Special-score catalog** includes derived codes (GHR/PHR) and `MAP`.
- **No `.nojekyll` in source**; the Pages workflow adds it during the build.

## Suggested next work

See `docs/ROADMAP.md`. Hygiene and safety, then verify maps, then split the workstation, then catalog gaps, and only then scoring if licensed data and an owner decision exist.

Do not auto-code Location Number (except the current `W` behavior), Form Quality, Populars, GHR/PHR, or interpretation without that decision.
