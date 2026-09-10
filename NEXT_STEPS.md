# Next Steps

Recommended work after this handover. Do not start large features until the current architecture is reused on purpose (see Development Rules below).

## Immediate action plan

1. **Location maps (current focus):** starter spatial overlays now exist for Cards I–X. Next: open each card in the app, turn on Show Labels, and adjust any region that does not match Table A. Do not treat these polygons as verified.
2. **Confirm product boundary** with the owner: this stays a *coding worksheet* (examiner judgment + optional map assist), not an auto-scorer.
3. **Add a root `.gitignore`** covering `node_modules/`, `.angular/`, `dist/`, editor files, and local protocol dumps. Review whether `exports/` should stay in git.
4. **Do not commit blot images or Exner tables** unless rights are documented.
5. **Remove or reattach dead click-to-mark code** so the model matches the UI (`imageLocations` vs SVG region selection).
6. **Add a New Protocol / clear-draft action** that uses `LocalStorageService.clear()` with confirmation.
7. **Auto-save metadata** (debounce `metadataForm.valueChanges`) so header edits are not lost.
8. **Introduce tests** for auto-fill rules, JSON parse errors, and CSV escaping before touching scoring math.

## Roadmap priorities

### P0 — Safety and repo hygiene

- `.gitignore`, decide fate of `exports/` sample PHI-like text.
- “Clear draft” + delete confirmation.
- Document PHI handling for anyone running `ng serve` on a shared machine.
- Self-host fonts or document the Google Fonts dependency.

### P1 — Complete the workstation as designed

- Licensed/placeholder card images named as in `src/assets/cards/README.md`.
- Location maps for remaining cards; keep `source` notes and a verification flag per card.
- Align Card IV image filename between `books/` and runtime JSON.
- Surface `reference-status.json` in the UI instead of duplicating copy.
- Soften `needsReferenceLookup` (empty special scores should not always warn).

### P2 — Structure the frontend without changing behavior

Split `AppComponent` along existing seams:

- `ProtocolMetadata` form component
- `ResponseForm` component
- `StructuralSummaryPreview` component
- `CodedResponsesTable` component
- Keep `ExportService` / `LocalStorageService` as the only persistence API
- Optional: `ProtocolStore` (signal or service) so forms do not own the array

Reuse Material + reactive forms. Do **not** add a router until there is a second real screen (e.g. protocol list).

### P3 — Coding catalog completeness (still manual)

- Location combinations `WS`, `DS`, `DdS`
- Determinant gaps (a/p, shading blends)
- Decide GHR/PHR: derived vs selectable
- Remove or isolate R-PAS-only codes (e.g. MAP) unless the product is dual-system

### P4 — Scoring (only with licensed data and a product decision)

If ever added, isolate behind a pure function module with fixtures. Do not put copyrighted tables in the public repo. Keep the existing disclaimer until ratios are validated.

## Development rules (mandatory for future changes)

1. **Understand existing architecture first.** Read `ARCHITECTURE.md` and the files you will touch. The app is a client-only SPA with one protocol document.
2. **Reuse existing patterns.** Standalone components, `inject()`, Material, reactive forms, JSON assets, snackbars, `SavedProtocol` as the persistence DTO.
3. **Avoid duplicate functionality.** Do not add a second storage key, a second export format path, or a second location picker. Extend `ExportService` / `LocalStorageService` / `CardLocationMapComponent`.
4. **Preserve conventions:** `app` prefix, SCSS colocated with components, domain types in `rorschach.models.ts`, catalogs in `src/assets/data/`.
5. **Explain why any architectural change is necessary** (router, backend, state library, scoring engine) in the PR or chat before implementing it.
6. **Do not auto-code** Location Number (except current W behavior), FQ, Populars, GHR/PHR, or interpretation unless the owner explicitly expands scope **and** licensed reference data is available.
7. **Do not add copyrighted Rorschach plates or Exner tables** to the repository without documented rights.

## Future collaboration mode

Subsequent work on this repo should treat the assistant as **long-term lead engineer** for this project, carrying:

- Architecture: client-only Angular 19 workstation
- Features: coding form + partial maps + local draft + JSON/CSV
- Debt: God component, dead click-mark UI, unverified maps, no tests
- Pending: maps II–X, images, hygiene, store split
- Roadmap: P0 → P1 → P2 before P3/P4

Update these markdown files when status materially changes.
