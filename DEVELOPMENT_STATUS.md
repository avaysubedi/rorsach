# Development Status

Snapshot of the codebase as of the handover analysis (2026-09-10). Version **0.1.0**.

## What appears finished

- Standalone Angular 19 bootstrap with Material UI and a usable single-page workstation.
- Protocol metadata form and full CS-oriented response/coding form.
- Conditional validation: FQ Explanation required when `FQ-`; Missing Information required when Confidence is `Low`.
- Inquiry empty-state hint (warning, not a hard block).
- Add / update / delete coded responses with snackbar feedback.
- Structural Summary Preview as **counts only** (R, Popular, breakdowns by card, location, DQ, determinants, content, special scores, FQ).
- localStorage save / load / silent restore on startup.
- JSON export/import and CSV export of the response table.
- Card location map component: SVG polygons, hover/select, Whole Blot, clear, optional labels.
- Location auto-fill from selected regions, with a mixed-type warning.
- Coding option catalogs for cards I–X and common CS codes.
- Explicit product disclaimer: no auto-coding of reference-dependent fields.

## What appears in progress

- **Location maps:** starter polygons for **all ten cards**. I and IV came from earlier tracing; II, III, V–X were generated from Figure A.2–A.10 plus blot photos. All maps are approximate and must be verified in the app before clinical use.
- **Card images:** filenames are wired (`assets/cards/card-i.png` … `card-x.png`) but the folder only contains a README. Missing images are handled; maps still work.
- **Click-to-mark blot locations:** `LocationMark` / `imageLocations` remain in the model and in `AppComponent` methods, but the old click-on-image viewer was removed from the template. Sample `exports/*.json` still contain click marks from that earlier UI.
- **Reference-status flags:** `reference-status.json` is loaded into `referenceStatus` but never rendered; the banner is hardcoded.

## What is missing for a complete product

- Remaining eight card maps, plus clinical verification of I and IV (Card I is missing D5/D6 vs typical CS charts).
- Licensed or owner-provided blot images (do not commit copyrighted plates without rights).
- True Structural Summary (EB, Lambda, EA, es, D, AdjD, ZSum, Afr, IsolIndex, S-Constellation, PTI, DEPI, CDI, HVI, OBS, GHR/PHR algorithms, etc.).
- Lookup support for Location charts, FQ tables, and Populars (copyright-constrained; currently manual).
- Multi-protocol storage, named drafts, or examiner accounts.
- Backend, auth, encryption, audit, backup.
- Tests, lint, CI, `.gitignore`.
- Routing / multi-view layout if the God-component is split later.
- Complete CS determinant set (active/passive, shading blends FY/YF/FV/VF/FT/TF, Cn, etc.) and location combinations (`WS`, `DS`, `DdS` as **location codes**, not only region types).

## Feature audit

### Implemented

| Feature | Notes |
| --- | --- |
| Metadata capture | No validation (age unbounded, date free) |
| Response capture | Card, R#, verbatim required |
| Coding fields | Dropdowns from JSON |
| Location map (I, IV) | Starter geometry |
| Location auto-fill | Mixed types force manual confirm |
| Response table | Edit/delete |
| Count preview | Not CS ratios |
| localStorage draft | Single key, silent restore |
| JSON export/import | Shallow schema check (`metadata` + `responses` array) |
| CSV export | Subset of fields; not round-trippable |

### Partially implemented

| Feature | Gap |
| --- | --- |
| Card location maps | 2 of 10 cards; approximate polygons |
| Card images | Paths exist; files do not |
| Structural summary | Counts only (`reference-status.structuralSummary = "partial"`) |
| Image location marks | Data model + dead methods; no UI |
| Reference-status UI | Loaded, unused |
| Special scores list | Includes CS codes plus items that are derived (GHR/PHR) or R-PAS-like (MAP) |

### Placeholder / mock / experimental

- Empty `src/assets/cards/` with documented placeholder filenames.
- Starter map `source` strings: “verify/adjust before clinical use”.
- `books/*-starter.json` — authoring copies of I/IV maps.
- `exports/rorschach-protocol.json` — trial protocol with incomplete coding and leftover click marks.
- Dead CSS: `.card-viewer`, `.location-mark`, `.mark-toolbar`, `.json-preview`.

### Intentionally out of scope (current product rule)

The app **must not** silently auto-code Location Number (except `W` from whole-blot), Form Quality, Popular, GHR/PHR, or clinical interpretation. Changing that requires licensed data and a deliberate product decision.

## Production-readiness blockers

1. Clinical data in plaintext browser storage and unrestricted file export.
2. No authentication, tenancy, or PHI handling policy in software.
3. Incomplete and unverified location maps; missing blot images.
4. No tests, lint, or CI.
5. No `.gitignore` (risk of committing `node_modules`, `.angular/cache`, `dist`, and protocol exports).
6. Google Fonts runtime dependency.
7. Single 500+ line root component; no app-level error boundary beyond snackbars.
8. Structural Summary is not a CS summary — easy to over-interpret if shipped as-is.

## Suggested priority order

See [NEXT_STEPS.md](./NEXT_STEPS.md). Short version: hygiene and safety first, then finish maps/images, then split the workstation, then only then consider scoring features that require licensed reference data.
