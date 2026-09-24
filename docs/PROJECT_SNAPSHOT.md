# Project Snapshot

Last updated: 2026-09-24

One-page picture of the repository. For the working session brief, read `docs/CURRENT_CONTEXT.md`. For behavior detail, read `docs/PRD.md` and `docs/ARCHITECTURE.md`.

## Identity

| | |
| --- | --- |
| Name | Rorschach CS Coding Assistant |
| Package | `rorschach-coding-assistant` `0.1.0` |
| Kind | Browser worksheet for Comprehensive System (Exner) coding |
| Users | Trained examiners, supervisors, and students |
| Live site | https://avaysubedi.github.io/rorsach/ |
| Maturity | Local prototype plus a public static deploy. Not a clinical production system |

## What it does

An examiner records protocol metadata and each response, codes CS fields by hand, optionally selects blot regions on a starter map, reviews count-only totals, and keeps one draft in the browser. JSON export/import round-trips the draft. CSV export is a spreadsheet view and cannot be imported.

The app does not score a protocol, look up official Exner tables, or write an interpretation. The only automatic location behavior is filling Location when the selected regions are a single type, including whole-blot `W`.

## Architecture in one diagram

```
Browser
  AppComponent          metadataForm, responseForm, responses[]
  CardLocationMapComponent   SVG polygons + code palette
  LocalStorageService   key rorschach-cs-protocol-draft
  ExportService         JSON and CSV downloads, JSON parse
  assets/data/*.json    catalogs and maps
  assets/cards/*.png    blot photos
```

No router. No backend. No database. No authentication. `HttpClient` only GETs static JSON.

## Seams to reuse

- `SavedProtocol` in `src/app/models/rorschach.models.ts`
- `LocalStorageService`, `ExportService`
- `CardLocationMapComponent`
- Catalogs in `src/assets/data/`

## Maturity markers

| Present | Absent |
| --- | --- |
| Single-screen workstation | Tests, lint, app error boundary |
| All ten starter location maps | Verified clinical geometry |
| Blot PNGs in git | Licensed Exner lookup tables |
| localStorage draft, JSON, CSV | Multi-protocol storage, accounts |
| GitHub Pages workflow | Encryption, audit, PHI hosting |
| Examiner-judgment disclaimer | True structural summary ratios |

## Read next

| Question | File |
| --- | --- |
| What is true this week? | `docs/CURRENT_CONTEXT.md` |
| What is done or broken? | `docs/STATUS.md` |
| What should be built later? | `docs/ROADMAP.md` |
| What must an agent obey? | `docs/AGENTS.md` |
