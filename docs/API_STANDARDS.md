# API Standards

Last updated: 2026-09-24

## Current standard: there is no HTTP API

This repository has no controllers, routes, DTOs on a server, or remote endpoints. Do not add a `controllers/` layer, a fetch wrapper, or a REST client for features that only need the seams below.

The standards that **do** exist are the client data-access patterns.

## Asset requests

`HttpClient.get` loads JSON that the build copies to `assets/`.

| Path | Type | Caller |
| --- | --- | --- |
| `assets/data/coding-options.json` | `CodingOptions` | `AppComponent.loadConfig` |
| `assets/data/reference-status.json` | `ReferenceStatus` | `AppComponent.loadConfig` |
| `assets/data/card-location-maps.json` | `Record<string, CardLocationMap>` | `CardLocationMapComponent` via `forkJoin` |
| `assets/data/card-location-catalog.json` | `CardLocationCatalog` | same `forkJoin` |

Rules:

- Paths are relative (`assets/...`), so the GitHub Pages `baseHref` `/rorsach/` resolves them.
- Parse against the interfaces in `rorschach.models.ts`.
- Do not hardcode a second copy of a catalog in TypeScript.
- Do not add query parameters, auth headers, or `HttpInterceptor`s for these files.

## Request patterns (browser)

| Action | Mechanism | Payload |
| --- | --- | --- |
| Save draft | `localStorage.setItem` | `JSON.stringify(SavedProtocol)` |
| Load draft | `localStorage.getItem` | key `rorschach-cs-protocol-draft` |
| Export JSON | `Blob` + temporary `<a download>` | pretty-printed `SavedProtocol`, filename `rorschach-protocol.json` |
| Export CSV | same download helper | `rorschach-responses.csv` |
| Import JSON | `<input type="file">` + `FileReader.readAsText` | text passed to `ExportService.parseJson` |

`ExportService.download` creates an object URL, clicks a link, and revokes the URL. New downloads should go through that helper.

## Response patterns

### `SavedProtocol`

Successful save, load, export, and import all use:

```ts
interface SavedProtocol {
  metadata: ProtocolMetadata;
  responses: RorschachResponse[];
}
```

JSON export uses `JSON.stringify(protocol, null, 2)`.

### CSV

Header row, then one row per response. Cells are quoted. Embedded `"` becomes `""`. Multi-value fields (`determinants`, `contentCodes`, `specialScores`) join with `'; '`. Popular is `Yes` or `No`. Null response number becomes an empty string.

CSV is not a response contract for import.

### Map events

| Output | Payload |
| --- | --- |
| `locationSelectionChange` | `string[]` of codes |
| `selectedRegionsChange` | `CardLocationRegion[]` |
| `regionClicked` | one `CardLocationRegion` |

The parent writes codes onto the form and derives Location from region types. Components should keep emitting these outputs rather than writing `localStorage` themselves.

## Error handling standards

| Failure | Behavior in code |
| --- | --- |
| Coding options HTTP error | Snackbar `Coding options could not be loaded.` Defaults remain empty arrays |
| Reference status HTTP error | Swallowed. In-memory defaults remain |
| Map or catalog HTTP error | `loadFailed = true`. Placeholder: location map data could not be loaded |
| Card image error | `imageMissing = true`. Overlay remains if polygons exist |
| `localStorage` JSON parse error | `load()` returns `null` |
| Import JSON syntax error or missing keys | `parseJson` throws `Imported JSON must contain metadata and responses.` Snackbar shows the message |
| Invalid response form | `markAllAsTouched()`, snackbar `Required response fields need attention.`, no write |
| Missing draft on explicit load | Snackbar `No saved protocol draft found.` |

Snackbar pattern: `this.snackBar.open(message, 'Dismiss', { duration })`. Durations in use are 2500, 3000, 3500, and 4000 ms.

Rules for new client errors:

- Show a snackbar for a user action that failed (save is implicit on add; import and catalog load are the models).
- Do not `alert()`.
- Do not send protocol bodies to a remote logger.
- `parseJson` is the gate for imports. Widen it in `ExportService` rather than adding a second parser in the component.
- There is no global `ErrorHandler` and no HTTP interceptor. Add one only with an ADR if a real remote API appears.

## Validation standard

Form validators live on `responseForm`:

- Required: `cardNumber`, `responseNumber`, `verbatimResponse`, `location`.
- Conditional: `formQualityExplanation` when value is `FQ-`; `missingInformation` when confidence is `Low`.
- Inquiry: hint only.

`ExportService.parseJson` checks shape only. It does not coerce types, fill ids, or strip unknown fields.

## If a backend is proposed later

That work is **not** this codebase. An ADR in `docs/DECISIONS.md` is required first. Until then:

- Do not invent controllers, status-code tables, or auth headers in new code.
- A future API, if approved, should accept and return `SavedProtocol` (or a versioned superset), keep clinical payloads off query strings, and document errors in the same snackbar style on the client.
- Stored procedures, ORM entities, and REST resource names are unspecified because no server exists. See `docs/DB_STANDARDS.md`.
