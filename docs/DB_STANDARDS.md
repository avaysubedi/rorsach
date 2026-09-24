# Database Standards

Last updated: 2026-09-24

## Current standard: no database

There are no SQL scripts, ORMs, migrations, stored procedures, or indexes in this repository. Persistence is one JSON document in `localStorage`. Do not add a database, a SQLite file, or a hosted store as part of an ordinary UI change.

## Document structure

Storage key: `rorschach-cs-protocol-draft`  
Owner: `LocalStorageService`  
Type: `SavedProtocol` in `src/app/models/rorschach.models.ts`

```
SavedProtocol
├── metadata: ProtocolMetadata
│   ├── examineeCode: string
│   ├── age: number | null
│   ├── gender: string
│   ├── date: string          (ISO date from input type=date)
│   ├── examiner: string
│   └── notes: string
└── responses: RorschachResponse[]
    ├── id: string            (crypto.randomUUID)
    ├── cardNumber: string    (I–X)
    ├── responseNumber: number | null
    ├── verbatimResponse, inquiry, locationPointed, madeItLookLike, examinerNotes: string
    ├── imageLocations: { x: number, y: number }[]   (0–100, currently unused by UI)
    ├── location, locationNumber, developmentalQuality: string
    ├── determinants, contentCodes, specialScores: string[]
    ├── formQuality, formQualityExplanation, codingExplanation: string
    ├── popular: boolean
    ├── confidence, missingInformation: string
    ├── selectedLocationCodes?: string[]
    └── selectedLocationRegions?: CardLocationRegion[]
```

Cardinality today: one protocol per origin. Responses are an ordered array. There is no foreign key; `id` is the row identity inside that array.

## Naming conventions

| Kind | Convention | Example |
| --- | --- | --- |
| TypeScript fields | camelCase | `examineeCode`, `formQualityExplanation` |
| CS code values | Official short codes, stored as strings | `DQ+`, `FQ-`, `DdS` |
| Storage key | kebab-case, one constant | `rorschach-cs-protocol-draft` |
| Asset files | kebab-case JSON | `card-location-maps.json` |
| Card ids | Roman numerals as strings | `"I"` … `"X"` |
| Region codes | CS location numbers | `W`, `D1`, `Dd22`, `DS5` |
| Region `type` | `W` \| `D` \| `Dd` \| `DdS` \| `S` | |
| Map status | `starter` \| `catalog-only` | all current maps are `starter` |

JSON uses the same camelCase names as the TypeScript interfaces. Do not introduce snake_case columns or a parallel DTO.

Catalog option objects are `{ value, label }`. Cards add `image`.

## Static reference data

These files are read-only inputs, not user data:

| File | Contents |
| --- | --- |
| `coding-options.json` | Dropdown catalogs |
| `reference-status.json` | `manual-required` or `partial` flags |
| `card-location-maps.json` | Per-card image path, viewBox, source, spatialStatus, polygon regions |
| `card-location-catalog.json` | Per-card note and regions without geometry |

`books/*.json` and `books/generate-starter-maps.mjs` are authoring sources. The app does not read them at runtime.

## Stored procedures

None. Summary counts are pure reducers on `AppComponent` (`countByValue`, `countByArray`). New aggregates should stay pure functions over `RorschachResponse[]`, not stored procedures and not template-only math scattered in new components.

## Indexes

None. The response list is small (a protocol is typically well under 50 responses). The Material table is not virtualized. Revisit only if one document grows far past a single protocol.

## Integrity rules enforced in the client

| Rule | Where |
| --- | --- |
| New ids are UUIDs | `buildResponseFromForm` |
| Arrays default to `[]` when nullish | `buildResponseFromForm` |
| Load of corrupt JSON yields no draft | `LocalStorageService.load` |
| Import requires `metadata` and `responses` array | `ExportService.parseJson` |
| `W` exclusive with other region codes | `CardLocationMapComponent.toggleRegion` |

Not enforced: metadata types, response field types on import, unique response numbers, required `id` on import, maximum document size.

## Migration recommendations

There is no `schemaVersion` on `SavedProtocol`. Existing drafts and exported JSON are version 0 by omission.

When the document shape changes:

1. Add an optional `schemaVersion` number in one ADR and in `rorschach.models.ts`.
2. Teach `LocalStorageService.load` and `ExportService.parseJson` to accept the previous shape and map it forward in one function.
3. Keep unknown fields that the UI still round-trips (`imageLocations`, `selectedLocationRegions`) until a decision removes them.
4. Do not write a second storage key for “v2”. Migrate the existing key.
5. Do not put copyrighted Exner tables into `src/assets/data/`.

Suggested first migration, when someone next touches persistence: default missing `selectedLocationCodes` and `selectedLocationRegions` to `[]` (import already relies on callers to tolerate absence; edit does). The edit path already null-coalesces those two arrays.

## If a database is proposed later

Require an ADR first. A relational design is not approved by this file. If one is approved, start from `SavedProtocol` as the aggregate:

- One protocol row, many response rows, region selections as child rows or a JSON column matching `selectedLocationRegions`.
- Keep camelCase in the API JSON even if SQL columns are snake_case, and map in one place.
- Store clinical text only under the privacy design in `docs/SECURITY.md`.
- Prefer versioned schema migrations in the new backend repo over stored procedures for CRUD.
- Index `protocol_id` on responses. Do not index free-text verbatim fields until a search feature exists.
