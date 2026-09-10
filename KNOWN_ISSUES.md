# Known Issues

Issues observed in the current tree. Severity is relative to a clinical coding tool, not a toy demo.

## Bugs and functional gaps

| ID | Issue | Detail |
| --- | --- | --- |
| B1 | Card maps missing for 8/10 blots | `card-location-maps.json` keys: `I`, `IV` only. Other cards show “No location map available”. |
| B2 | Card images 404 | `src/assets/cards/` has no PNGs. Map component sets `imageMissing` and shows a placeholder; SVG overlay still renders when a map exists. |
| B3 | Click-to-mark API is orphaned | `addImageLocation`, `removeImageLocation`, `clearImageLocations`, `locationMarks`, and `AppComponent.imageMissing` have no template bindings. |
| B4 | Metadata not auto-saved | Draft writes on add/update/delete/import, or explicit Save. Changing metadata alone and refreshing can lose header fields unless the user saved. |
| B5 | `needsReferenceLookup` is noisy | Treats empty `specialScores` as “lookup required”. Many responses correctly have no special scores. |
| B6 | Mixed-type warning snackbar on every mixed selection | Can fire repeatedly while toggling regions. |
| B7 | Overlapping polygons | Large regions (e.g. Card I `D7`, `W`) sit under later SVG nodes. Click hit-testing follows paint order, not clinical “most specific region” rules. |
| B8 | Card I chart likely incomplete | Starter map has D1–D4 and D7; no D5/D6. Source text says approximate. |
| B9 | Location Number overwrite | Map selection sets `locationNumber` to joined codes (or `W`). Manual Location Number can be wiped when the map emits. |
| B10 | Import validation is shallow | Any JSON with `metadata` and a `responses` array is accepted. Missing `id`s, wrong types, or extra fields are not repaired. |
| B11 | CSV is lossy | Omits inquiry extras, explanations, location regions, confidence details, metadata. Cannot re-import CSV. |
| B12 | No delete confirmation | A single click removes a coded response. |
| B13 | `referenceStatus` unused | Loaded from JSON; UI banner is hardcoded. |
| B14 | `LocalStorageService.clear()` unused | No “new protocol” / wipe-draft action in the UI. |
| B15 | Card change clears map fields only | Switching cards in the form clears codes/regions; in-progress coding of other fields is kept, which is usually desired, but map component selection can desync until `ngOnChanges`. |

## Technical debt

- **God component:** `AppComponent` (~510 lines TS + 460 lines HTML) owns forms, summary math, persistence, import, and map orchestration.
- **Untyped forms:** `UntypedFormBuilder` plus `as RorschachResponse` bypasses the strict model.
- **Subscriptions never torn down:** `valueChanges` on root component (low practical risk; still not the project pattern to copy).
- **Duplicate actions:** toolbar and actions band both save/load/export.
- **Dead SCSS** for the removed card-click viewer.
- **Duplicate map JSON:** `books/` starters vs `src/assets/data/card-location-maps.json` (Card IV book file uses `card-iv-location.png`; runtime map uses `card-iv.png`).
- **Unused package:** `@angular/router`.
- **No `.gitignore`.**
- **`tsconfig.app.json`** lists only `src/main.ts` as `files`; the application builder follows the import graph. Fine today; easy to confuse later.

## Duplicate logic

- Save / load / export JSON / export CSV appear in the toolbar and again in the actions band.
- Count aggregations `countByValue` / `countByArray` live in the component; they belong in a pure summary helper if scoring expands.
- Card image paths exist both in `coding-options.json` (`CardOption.image`) and in each location map’s `image` field. The live viewer uses the map’s path, not `selectedCard.image`.

## Dead code

- AppComponent: `addImageLocation`, `removeImageLocation`, `clearImageLocations`, `imageMissing` (component field).
- App SCSS: `.card-viewer`, `.placeholder-card` (unused in this template; map has its own), `.location-mark`, `.mark-toolbar`, `.json-preview`.
- `LocalStorageService.clear()`.
- `selectedCard.image` is never bound now that the map owns the image.

## Security and privacy

| Concern | Why it matters |
| --- | --- |
| Plaintext `localStorage` | Examinee identifiers, notes, and verbatim responses are PHI/PII in many jurisdictions. Any script on the origin can read the key. |
| Unrestricted JSON/CSV download | Easy to email or commit clinical data. `exports/` already contains trial protocol text. |
| No auth | Shared machines keep the last draft. |
| Import of arbitrary JSON | Prototype risk is low (client-only), but there is no size cap or field sanitization. |
| Google Fonts | Leaks that the app was opened (privacy); fails offline. |
| Angular CLI analytics id in `angular.json` | Not end-user tracking, but should be reviewed for the org’s policy. |

**Do not** add network upload of protocols without an explicit privacy design.

## Performance

Current data volume is tiny; performance is not the limiter. Watch-outs if maps grow:

- All map JSON loads on map `ngOnInit` (both cards). Acceptable now; split per card later.
- Material table has no virtualization (fine for typical R < 50).
- Summary getters recompute on every CD cycle from template bindings (`summary`, `objectEntries`). Fine at current size.
- Strict mode + default CD on a large form is OK for one protocol.

## Coding-system consistency (product risk)

`coding-options.json` is CS-leaning but incomplete and slightly mixed:

- Location dropdown is `W/D/Dd/S` only (no `WS` / `DS` / `DdS` as location codes). Region type `DdS` exists on Card I.
- Determinants omit active/passive and several shading blends.
- Special scores include **GHR/PHR** (normally derived) and **MAP** (R-PAS Mapping, not a CS special score).
- No Z scores / organizational activity field.

Shipping this catalog as “Complete CS” would be misleading.
