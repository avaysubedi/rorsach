# Architecture

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Angular 19 standalone (no NgModules, no router) |
| UI | Angular Material 19 (`azure-blue` theme) + Angular CDK (transitive) |
| Forms | Reactive Forms via `UntypedFormBuilder` |
| HTTP | `HttpClient` loading static JSON from `src/assets` |
| Persistence | Browser `localStorage` (`rorschach-cs-protocol-draft`) |
| Styling | Global SCSS + component SCSS; Inter + Material Icons from Google Fonts |
| Language | TypeScript 5.7, `strict` + `strictTemplates` |
| Build | Angular application builder / Vite (`ng serve`, `ng build`) |
| Backend | **None** |
| Database | **None** |
| Tests | **None** (no `test` target in `angular.json`) |

Unused declared dependencies: `@angular/router` is in `package.json` but not used.

## Folder structure

```
rorsach/
├── src/
│   ├── main.ts                          # bootstrapApplication + HttpClient + animations
│   ├── index.html
│   ├── styles.scss
│   ├── app/
│   │   ├── app.component.{ts,html,scss} # entire workstation UI and orchestration
│   │   ├── models/rorschach.models.ts   # shared domain types
│   │   ├── services/
│   │   │   ├── local-storage.service.ts
│   │   │   └── export.service.ts
│   │   └── components/
│   │       └── card-location-map/       # SVG region overlay
│   └── assets/
│       ├── cards/README.md              # expected card-*.png filenames; folder otherwise empty
│       └── data/
│           ├── coding-options.json      # dropdown catalogs
│           ├── reference-status.json    # flags: manual-required / partial
│           └── card-location-maps.json  # Cards I and IV starter polygons
├── books/                               # source starter maps (I, IV) used to seed assets
├── exports/                             # sample protocol JSON from local trials
├── dist/                                # production build output
├── angular.json
├── package.json                         # version 0.1.0
└── tsconfig*.json
```

There is no `src/app/app.config.ts`, no routes, no feature modules, and no `.gitignore` at the repo root.

## Application flow

```
bootstrapApplication(AppComponent)
        │
        ▼
AppComponent.ngOnInit()
  ├── GET assets/data/coding-options.json
  ├── GET assets/data/reference-status.json
  └── restore draft from localStorage (silent)
        │
        ▼
User fills metadata + response form
  └── CardLocationMapComponent
        GET assets/data/card-location-maps.json
        emit selected codes + region objects
        AppComponent auto-fills Location / Location Number
        │
        ▼
Add / Update Response  →  in-memory responses[]  →  save localStorage
        │
        ├── Structural Summary Preview (client-side counts)
        ├── Coded Responses table (edit / delete)
        ├── Export JSON / CSV (download blob)
        └── Import JSON (FileReader → applyProtocol)
```

There is a single screen. Toolbar actions duplicate the actions band (save, load, export JSON, export CSV). Import JSON exists only in the actions band.

## Frontend architecture

**Pattern:** one root standalone component owns all protocol state. Child UI is limited to `CardLocationMapComponent`.

**State:**

- `metadataForm` — protocol header.
- `responseForm` — the response currently being entered or edited.
- `responses: RorschachResponse[]` — coded list.
- `editingId` — when set, Add becomes Update and preserves the response `id`.
- Config JSON cached on the component (`options`, `referenceStatus`).

**Domain model** (`rorschach.models.ts`): `CodingOptions`, `RorschachResponse`, `SavedProtocol`, `CardLocationMap` / `CardLocationRegion`, `StructuralSummaryPreview`, `LocationMark`.

**UI composition:** Material toolbar, cards for metadata / response / coding, sticky aside for the map, summary grid, Material table.

**Location auto-fill rules** (`applyLocationAutoFill`):

| Selected region types | Location set to |
| --- | --- |
| includes `W` | `W`, Location Number `W` |
| only `D` | `D` |
| only `Dd` and/or `DdS` | `Dd` |
| only `S` | `S` |
| mixed (e.g. D + Dd) | cleared; examiner must confirm |

`W` is exclusive on the map: selecting Whole Blot clears other codes; selecting a detail clears `W`.

## Backend architecture

None. The app is a static SPA. `HttpClient` only reads bundled JSON under `assets/`. There are no APIs, workers, or cloud services.

## Database structure

None. The persistence contract is a JSON document:

```json
{
  "metadata": { "examineeCode", "age", "gender", "date", "examiner", "notes" },
  "responses": [ { "id", coding fields, "selectedLocationCodes", "selectedLocationRegions", "imageLocations" } ]
}
```

Storage key: `rorschach-cs-protocol-draft`. One draft per browser origin. `LocalStorageService.clear()` exists but is unused.

## External integrations

| Integration | Purpose |
| --- | --- |
| Google Fonts (Inter, Material Icons) | Typography and icons (requires network at runtime unless self-hosted) |
| Official Exner tables / blot plates | **Not integrated** — examiner must look them up separately |
| Auth, analytics, crash reporting | None (`angular.json` has a CLI analytics id only) |

## Authentication / authorization model

**None.** Anyone who can open the origin can read/write the local draft and export files. There is no user identity, role, encryption, audit log, or access control.

Treat protocol JSON as **sensitive clinical data**. Do not assume the browser profile is a secure vault.
