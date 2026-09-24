# Roadmap

Last updated: 2026-09-24

Order of work for the coding worksheet. This replaces the stale “maps for eight cards are missing” items in root `NEXT_STEPS.md`. Scoring stays last and stays blocked on an owner decision plus licensed reference data.

## Now

1. Open each card, turn on Show Labels, and correct starter polygons that do not match the intended chart. Leave `spatialStatus` as `starter` until a card is actually verified.
2. Close catalog-vs-polygon gaps (Card I `D5`/`D6` and the extra catalog codes on other cards) so a chip either has a polygon or is clearly catalog-only.
3. Confirm the product stays a worksheet. The disclaimer stays until that decision changes.

## P0 — Safety and hygiene

- “New protocol” action that calls `LocalStorageService.clear()` after confirmation.
- Confirm before deleting a coded response.
- Debounced auto-save of `metadataForm` so a refresh does not drop the header.
- Short shared-machine note: export JSON, then clear the draft.
- Self-host Inter and Material Icons, or document the Google Fonts dependency next to the disclaimer.
- Keep `exports/` gitignored. Do not commit trial protocols.

`.gitignore` and the Pages workflow already exist. They are not open P0 items.

## P1 — Finish the workstation as designed

- Rights check on `src/assets/cards/*.png` before wider redistribution. Images are already in the tree.
- Surface `reference-status.json` in the UI instead of a second hardcoded banner.
- Stop treating empty special scores as “lookup required.”
- Remove or restore click-to-mark (`imageLocations`) so the model matches the screen.
- Keep map `source` notes until verification is done.

## P2 — Structure the frontend without changing behavior

Split `AppComponent` along the sections already on the page:

- Protocol metadata
- Response form
- Structural summary preview
- Coded responses table

Leave `ExportService`, `LocalStorageService`, and `CardLocationMapComponent` as the seams. An optional protocol store (signal or service) may hold `responses` so the forms do not own the array. Add a router only when a second screen exists, and record it as an ADR.

## P3 — Catalog completeness, still manual

- Location combinations `WS`, `DS`, `DdS` as location codes
- Determinant gaps (active/passive, shading blends)
- Decide whether GHR/PHR stay selectable or become derived
- Remove or isolate `MAP` unless the product is intentionally dual-system
- No Z-score field until the coding model is agreed

## P4 — Scoring, only with a new decision

If ratios are added, put them behind pure functions and fixtures. Do not commit copyrighted Exner tables. Keep the disclaimer until the numbers are validated. This is not implied by the current count preview.

## Proposed, not scheduled

`docs/CODING_ASSISTANCE_ENGINE.md` describes a Coding Assistance Engine: local reference-pack search, accept-before-apply form quality and populars, location hints, and a fullscreen map. It is not approved work. The recommended storage is a gitignored static pack with in-browser search, not a protocol database.

## Explicitly not scheduled

- Accounts, multi-protocol libraries, encryption, audit logs
- A backend or database (would void ADR-001 and ADR-010 and need new ADRs)
- Auto-coding of Form Quality, Populars, GHR/PHR, or interpretation
