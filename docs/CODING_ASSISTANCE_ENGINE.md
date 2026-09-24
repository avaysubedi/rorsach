# Coding Assistance Engine — Design

Status: **proposed, not approved, not implemented**  
Last updated: 2026-09-24  
Depends on: `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/DECISIONS.md` (ADR-001, ADR-005, ADR-010)

This document is a design only. It does not change the worksheet, and it does not authorize auto-coding. Implementation waits for an owner approval of this design plus a rights decision for any reference pack.

The examiner keeps every final code. The engine suggests. Accept, dismiss, and override are explicit.

## Source reviewed

Local file `The-rorschach-volume-1-604-653.pdf` (50 scanned pages, no text layer, produced as images). The pages are appendix material:

- Location figures for blot areas (figure labels such as Figure A.1).
- Table A.1 continuing through Table A.10: for each card, columns headed by a location area (`W`, `D`, `Dd`, `Ds`, and numbered codes). Each row is a form-quality symbol beside a response or response class. Parenthetical qualifiers narrow a class (winged / not winged, midline, and similar). Card sections also carry Popular statements and Z values.

The response lists themselves are **not** copied into this repository. The PDF must not be committed. A reference pack may be loaded only after rights are documented. Until then the UI must keep the current disclaimer and the current empty-suggestion behavior.

Symbol mapping from the tables to the existing form control:

| Table symbol | `formQuality` value already in `coding-options.json` |
| --- | --- |
| `+` | `FQ+` |
| `o` | `FQo` |
| `u` | `FQu` |
| `-` | `FQ-` |

---

## A. Requirements analysis

### Product fit

Today the app records coding and counts it. ADR-005 forbids silent auto-coding of Form Quality, Populars, and Location Number beyond whole-blot `W`. This feature stays inside that rule if, and only if, suggestions never write a clinical field without an examiner action.

What “reduce manual effort” means here:

- Find a catalog row quickly from the verbatim text and the selected card.
- Show the table’s form-quality symbol, the location area it belongs to, and the citation.
- Show when the catalog marks a Popular, with the reason and the source.
- Use selected regions to narrow those hits.
- Leave `formQuality`, `popular`, and `locationNumber` unchanged until the examiner accepts.

### 1. Response autocomplete

Trigger: the examiner types in Verbatim Response, and a card is selected. Without a card, show a hint to select a card rather than searching all ten tables.

| Requirement | Design rule |
| --- | --- |
| Fast search | Search only the selected card’s rows. A card section is hundreds of rows, not the whole pack, and the index is built once when the pack loads. |
| Partial matching | Case-insensitive token and prefix match on the row label. Parenthetical qualifiers are extra tokens, not required for a hit. |
| Typo tolerance | Edit distance on tokens of length 4 or more. Distance 1 when length is 4–7. Distance 2 when length is 8 or more. Tokens shorter than 4 (`bat`, `dog`) match by exact or prefix only, so one-character noise does not flood the list. |
| Keyboard | Combobox: Arrow Up/Down move the highlight, Enter accepts the highlighted row as the **active suggestion** (it does not replace the verbatim text), Escape closes the list. |
| Confidence | Every row shows a 0–100 score. Rows under 45 stay hidden. |

The list does not overwrite Verbatim Response. The typed text remains the examinee’s words.

### 2. Form Quality assistant

Store rows shaped like the table: card, location area, label, optional qualifier, symbol. When the active suggestion or a high-confidence match has a symbol, show it next to the Form Quality field as a suggestion.

The examiner can:

- Accept, which sets `formQuality` to the mapped value and records that they accepted it.
- Dismiss, which hides the suggestion and leaves the field as it was.
- Choose any other value in the existing dropdown, which records an override.

If the pack has no row, the field stays manual and the current “official reference lookup” hint remains.

`FQ-` still requires FQ Explanation after an accepted minus. Accept does not invent the explanation.

### 3. Popular response detection

Populars in this appendix are card-level statements (often tied to a location area and a response class), not a column on every row. When the active text and card (and location, when the statement names one) match a Popular entry:

- Show Popular = Yes as a **suggestion**, not by flipping `popular` automatically.
- Show a short why-line taken from the pack’s statement field (paraphrase or a short owner-authored gloss, not a pasted page).
- Show the evidence source: table id, card, location area, and page citation stored on the entry.

Accept sets `popular` to true. Dismiss leaves the checkbox as the examiner set it. The examiner can still check or uncheck Popular with no match.

### 4. Location assistance

When `CardLocationMapComponent` emits codes:

- Filter catalog rows to those location codes.
- Show the location area the table uses, and the response labels that are common **in the pack** for that area.
- Do not write `location`, `locationNumber`, or `formQuality` from this panel.

Existing `applyLocationAutoFill` stays as it is (`W` / single-type `D` / `Dd` / `S`, mixed types cleared). Location assistance is a separate hint. Unverified starter polygons must be labeled as such in the hint, because a wrong region code will pull the wrong table column.

### 5. Fullscreen map viewer

Extend `CardLocationMapComponent`. Do not add a second location picker.

- Fullscreen modal (dialog), closed by a visible control and by Escape.
- Zoom and pan on the stage. Region hit-testing uses the same SVG after the transform.
- Desktop: map stage plus the existing palette beside it.
- Tablet (about 720–1100px): map stage first, palette in a scrollable sheet, controls in a top bar.
- Selection, whole blot, clear, labels, and the green selected / blue hover styles stay.
- Drag-to-pan must not toggle a region. A pointer movement under a small threshold is a click.

### 6. Data placement

See section E. Short version: reference data is a versioned pack loaded in the browser. Protocol text never goes to a server to be searched. GitHub Pages stays the app host.

### 7. Future datasets

One pack manifest, many dataset keys. Form Quality ships first. Populars and Z values are already implied by the same appendix and can be later keys in the same pack. Special scores, content classes, human movement, and animal movement use the same entry envelope when their sources exist. Absent keys mean “no assistance,” not an error.

### Out of scope for this design

- Structural summary ratios, constellations, GHR/PHR derivation, interpretation.
- Replacing the examiner’s verbatim text with a catalog label.
- OCR of the PDF inside the app.
- Accounts, or storing protocols in D1, Supabase, or any other host.

### Fit with the current screen

| Current piece | How assistance uses it |
| --- | --- |
| `responseForm.verbatimResponse` | Query text |
| `responseForm.cardNumber` | Required filter |
| `selectedLocationCodes` | Rank and filter |
| `formQuality` select | Accept target only |
| `popular` checkbox | Accept target only |
| `reference-status.json` | Stays `manual-required` until a pack is present and the examiner has accepted a value |
| `SavedProtocol` | Optional `assistance` object per response. Old drafts without it still load |

---

## B. UX proposal

### Suggestion anatomy

Every suggestion uses the same block, in the warning-adjacent but distinct “assist” style (not the gold disclaimer):

- Title: suggested code (`FQo`, Popular Yes, location area `D7`)
- Confidence: `82`
- Why: one line (matched label, location agreement or mismatch)
- Source: `Table A.1 · Card I · area code · p. n`
- Actions: Accept, Dismiss
- Footnote when polygons are still `starter`: “Location filter uses unverified map geometry.”

Accept and Dismiss are stroked buttons. The Form Quality dropdown and the Popular checkbox stay editable above or beside the block.

### Autocomplete

Under Verbatim Response, a listbox opens after two characters when a card is selected.

Each option:

```
Bat-like winged shape          91
Card I · W · FQo
```

- Highlight follows the keyboard.
- Enter sets that row as the active suggestion and opens the Form Quality block. The textarea keeps the examinee’s sentence.
- A click does the same.
- If several rows share a label at different locations, they are separate options. Location agreement sorts them first.

Empty pack: “No reference pack loaded. Form Quality stays manual.”

### Form Quality override

If the examiner changes the dropdown after Accept, the block switches to “You chose FQu. Catalog row was FQo.” No modal. The stored decision becomes `overridden`.

### Popular

A second block under the Popular checkbox, same actions. The why-line is the pack’s Popular statement for that card. The source line cites the table.

### Location panel

Inside the map card, under the selected chips:

- “Table areas for this selection: D1, D3”
- Up to five frequent labels for those areas, each with its symbol, as text. They are not buttons that write Location Number.
- Mixed map types keep today’s warning. The assist panel still lists rows, and it does not clear or set Location.

### Fullscreen

Toolbar on the map card: “Expand”.

```
┌──────────────────────────────────────────────┐
│ Card I          −  100%  +   Reset    Close  │
│ ┌────────────────────────────┐ ┌───────────┐ │
│ │  blot + svg (zoom/pan)     │ │ palette   │ │
│ │                            │ │ W D Dd S  │ │
│ └────────────────────────────┘ └───────────┘ │
│ Selected: D1, D3                             │
└──────────────────────────────────────────────┘
```

Tablet: palette moves under the stage. Pinch zooms. One-finger drag pans when scale is above 1. Close returns focus to the Expand button. Selection made in the modal is the same `selectedLocationCodes` the form already holds.

### Disclaimer

The page banner stays. Add one sentence when a pack is loaded: “Suggestions cite a reference pack. They are not applied until you accept them.”

---

## C. Technical design

### New seams (no second storage key, no second map)

| Piece | Role |
| --- | --- |
| `ReferencePackService` | Load the pack, expose datasets, build the per-card index once |
| `CodingAssistService` | Pure functions: normalize, score, pick FQ, pick Popular, filter by location. No DOM, no `localStorage` |
| `ResponseSuggestComponent` | Combobox bound to verbatim + card |
| `AssistSuggestionComponent` | The Accept / Dismiss block |
| `CardLocationMapComponent` | Gains fullscreen mode. Same outputs as today |

`AppComponent` (or a later response-form split) passes card, verbatim, and location codes in, and applies Accept onto the existing form controls. The assist service does not call `patchValue` itself.

### Search

Normalize: Unicode lowercase, strip punctuation to spaces, collapse whitespace. Do not stem. “Butterfly” and “butterflies” match only if the pack lists both or the owner adds an alias.

Score a row against the query for one card:

1. Exact label match → text score 1.0
2. Label is a full token of the query, or the query is a full token of the label → 0.92
3. Prefix of a token, token length ≥ 3 → 0.75
4. Edit distance within the limits above → 0.55 to 0.7 by distance
5. Otherwise discard

Location multiplier:

| Situation | Multiplier |
| --- | --- |
| No regions selected | 0.85 (card-only) |
| Row’s area is one of the selected codes | 1.0 |
| Row’s area is `W` and selection is only `W` | 1.0 |
| Row’s area is not in the selection | 0.6 |

Confidence shown = round(100 × text score × location multiplier). Hide under 45. Sort by confidence, then by longer label (a specific percept beats a one-word class when scores tie).

Show at most 8 options. Recompute on input debounce of about 80ms. Index is an array of normalized labels per card, held in memory.

No new search library in the first implementation. A few hundred rows per card are a direct scan. Add an index library only if a measurement shows the scan is slow.

### What Accept writes

| Suggestion | Writes |
| --- | --- |
| Autocomplete highlight + Enter | Nothing in the coding fields. Sets the active row id used by the FQ and Popular blocks |
| FQ Accept | `formQuality` only |
| Popular Accept | `popular = true` only |
| Location hints | Nothing |

Clear Form clears the active suggestion. Editing an existing response restores `assistance` if that object was saved.

### Decision record on the response

Optional field, ignored by today’s import check (import only requires `metadata` and `responses`):

```ts
interface AssistanceDecision {
  dataset: 'formQuality' | 'popular' | 'locationHint';
  entryId: string;
  suggestedValue: string;
  confidence: number;
  source: ReferenceCitation;
  status: 'suggested' | 'accepted' | 'dismissed' | 'overridden';
  examinerValue: string;
}
```

`RorschachResponse.assistance?: AssistanceDecision[]`

JSON export includes it when present. CSV stays lossy and does not gain columns in the first phase. Absence of the array means a pre-assistance draft.

### Fullscreen behavior

- Host: a `dialog` element or `MatDialog` with a full-viewport panel. `CardLocationMapComponent` already owns regions, so the dialog content is that component with `fullscreen` true, not a copy of the SVG.
- Zoom: CSS `transform: translate(x, y) scale(s)` on the stage only. `viewBox` stays `0 0 1000 1000`.
- Wheel zoom toward the pointer. Buttons for minus, plus, and reset. Scale clamped from 1 to 4.
- Pan: pointer capture when movement exceeds 6px. Below that, the existing polygon click runs.
- Pinch: two-pointer distance ratio on tablet.
- Escape and Close call the same exit. Selection state is the component’s existing `selectedCodes` set, so exit does not apply a second time.

### Failure behavior

| Case | UI |
| --- | --- |
| Pack file missing | Snackbar once. Suggestions hidden. Coding form works as today |
| Pack JSON invalid | Snackbar. Same fallback |
| Card with zero rows | “No catalog rows for this card.” |
| HTTP error if a later remote pack is used | Same fallback. Do not block Add Response |

### Pages deploy

Asset URLs stay relative. A gitignored pack is absent from the public build, so the public site keeps today’s manual coding. That is the correct default until rights allow publication.

---

## D. Database design

There is still no database in the app. This is the logical model. Phase 1 stores it as one JSON document. The same columns map to tables later if a read-only host is approved.

### Reference pack (read-only, not the protocol)

```ts
interface ReferencePack {
  schemaVersion: 1;
  id: string;                 // e.g. cs-appendix-a
  edition: string;            // owner-supplied label, not a pasted title page
  citation: string;           // short source line shown in the UI
  datasets: {
    formQuality?: FqEntry[];
    populars?: PopularEntry[];
    zValues?: ZEntry[];
    specialScores?: RuleEntry[];
    content?: RuleEntry[];
    humanMovement?: RuleEntry[];
    animalMovement?: RuleEntry[];
  };
}

interface ReferenceCitation {
  tableId: string;            // "A.1" … "A.10"
  card: string;               // "I" … "X"
  page?: string;              // printed page, stored by the curator
}

interface FqEntry {
  id: string;
  card: string;
  locationCode: string;       // column header: W, D7, Dd21, Ds26, …
  locationType: 'W' | 'D' | 'Dd' | 'DdS' | 'S';
  label: string;              // response or class name
  qualifier?: string;         // parenthetical note, without the parentheses
  symbol: '+' | 'o' | 'u' | '-';
  aliases?: string[];         // curator-added, for search only
  citation: ReferenceCitation;
}

interface PopularEntry {
  id: string;
  card: string;
  locationCode?: string;
  statement: string;          // why it is Popular, curator text
  matchLabels: string[];      // labels that satisfy the statement
  citation: ReferenceCitation;
}

interface ZEntry {
  id: string;
  card: string;
  w: number;
  adjacent: number;
  distant: number;
  space: number;
  citation: ReferenceCitation;
}

interface RuleEntry {
  id: string;
  card?: string;
  locationCode?: string;
  label: string;
  suggestedCode: string;      // dataset-specific code, not auto-applied
  rationale: string;
  citation: ReferenceCitation;
}
```

Naming follows `docs/DB_STANDARDS.md`: camelCase JSON, card ids as Roman numeral strings, location codes as in the tables.

`locationType` is derived by the curator from the code prefix (`DdS`/`DS` → `DdS` or `S` using the same types as `LocationRegionType`). The assist service does not invent that mapping at runtime beyond a documented function.

### Protocol document (existing key)

Still one key, `rorschach-cs-protocol-draft`. Add optional `assistance` on each response. No second key. No `schemaVersion` required for this additive field. Readers must tolerate responses that lack it.

### Later SQL shape (only if Option D’s remote half is approved)

Read-only:

- `reference_pack (id, edition, citation)`
- `fq_entry (id, pack_id, card, location_code, location_type, label, qualifier, symbol)`
- `popular_entry`, `z_entry`, `rule_entry` with the same idea
- Index: `(pack_id, card)`, and `(pack_id, card, location_code)`

No protocol tables. No stored procedures. The browser still downloads the pack (or a card slice) and searches locally.

### Ingestion

The PDF is an image scan. Building the pack is an offline curation task (manual entry or a local OCR pass on the owner’s machine). The Angular app does not read the PDF. The pack file is not generated into `src/assets` by the Pages workflow until rights are documented.

---

## E. Recommended architecture

### Options

| | Option A — static JSON | Option B — Cloudflare D1 | Option C — Supabase/Postgres | Option D — hybrid |
| --- | --- | --- | --- | --- |
| Fits GitHub Pages | Yes. `HttpClient` GET, same as today’s catalogs | No. Pages cannot query D1. Needs a Worker and a second origin | No. Needs a hosted API and a client SDK | Yes for the app. Remote half is optional and off by default |
| Growth | Fine for this appendix (thousands of rows). Painful if many editions and editors share one git file | Comfortable for read-only reference growth | Comfortable, and easy to overbuild into storing protocols | JSON now. D1 or R2 later for the pack only |
| Maintainability | Matches `coding-options.json` and `card-location-maps.json` | New deploy, CORS, and a schema path the repo does not have | Highest operational load | One `ReferencePackService`. Storage can change behind it |
| Cost | $0 | Low. Free tier covers a table this size. A Worker is an extra system | Free tier, then database pricing. Highest of the four for this job | $0 until a remote pack is actually required |
| Performance | Best. One download, then in-memory search. Works offline | A round trip per query would be slower and would send verbatim text off the device | Same problem if the query runs in Postgres | Same as A if search stays local |
| Privacy | Pack is public if it is in the Pages artifact. Protocol stays in `localStorage` | Query logs can capture response text unless search stays on device | Same risk, plus a database that will tempt protocol storage | Protocol never uploaded. Pack publication is a separate switch |
| Copyright | A committed JSON is a public copy of the tables | The API is also a public copy unless it is authenticated | Same | Pack stays gitignored and out of Pages until rights exist |

### Recommendation

**Option D, with Option A as the only implemented storage until a later ADR.**

1. `ReferencePackService` loads `assets/data/reference-pack.json` if present.
2. The file is gitignored and omitted from the public build until rights are documented. Local `ng serve` can use a pack the owner keeps on disk.
3. `CodingAssistService` searches in the browser. Verbatim text is not a query string and not a POST body.
4. Protocol persistence stays `LocalStorageService` and `ExportService`.
5. Revisit Cloudflare only if curators need to publish a new pack without rebuilding the Angular app. Prefer **R2 or a Worker that returns the same JSON pack** over querying D1 per keystroke. D1 is a reasonable store behind that Worker. It is a poor place to run search.
6. Do not adopt Supabase for this feature. It adds an account-shaped database the product does not need, and it conflicts with ADR-001 and with the rule that protocol JSON is not uploaded.

GitHub Pages remains the host of the SPA. A remote pack host, if it ever exists, is a read-only GET of a versioned file, recorded as a new ADR. It is not part of the first implementation.

---

## F. Risks

| Risk | Why it matters | Mitigation in this design |
| --- | --- | --- |
| Publishing the tables | The appendix is copyrighted reference material. JSON on GitHub Pages is a public redistribution | Pack gitignored. No PDF in the repo. No sample rows from the book in docs or fixtures |
| Suggestions treated as scores | A confident chip looks like an answer | Accept is required. Banner stays. Decision status stored as accepted or overridden |
| Wrong location column | Starter polygons and catalog-only codes (Card I `D5`/`D6` and similar) do not yet match the figures | Location mismatch lowers confidence. Hint states that maps are unverified. FQ is not filtered to a single region until the examiner has selected one |
| Short-word false matches | Many classes are short, and several locations repeat the same class with different symbols | No fuzzy match under 4 characters. Same label at two areas stays two rows. Examiner sees the area code |
| Class vs specific percept | A broad class and a narrow phrase can both match one sentence | Longer label wins ties. Qualifier is visible |
| Popular false positive | Card-level statements are broader than a single row | Popular never auto-checks. Statement and citation are visible |
| PHI in a search API | Verbatim responses are clinical text | Search runs locally even if the pack file was downloaded |
| `AppComponent` growth | The root component is already a god component | Assist UI is separate components. Scoring is a pure service |
| Draft compatibility | New fields on responses | Optional `assistance`. Old JSON still imports |
| Fullscreen gesture bugs | Pan and click share one pointer | Movement threshold. Selection outputs unchanged |
| Scope creep into scoring | Z values and special scores are adjacent | Those datasets are stored and not applied. No ratios in this design |

---

## G. Implementation phases

Each phase needs a separate approval. None of them start from this document alone.

| Phase | Delivered | Still manual | Notes |
| --- | --- | --- | --- |
| 0 | Owner accepts this design. Rights decision for the pack. ADR drafted only when storage or auto-apply changes | Everything | No application code |
| 1 | Fullscreen zoom, pan, close, same selection outputs | All coding fields | No reference data. Can ship without the pack |
| 2 | `ReferencePack` types, loader, gitignore, missing-pack snackbar | All coding fields | Public Pages build has no pack |
| 3 | Autocomplete, confidence, keyboard | FQ, Popular, location writes | Active row only |
| 4 | FQ suggestion, Accept, Dismiss, override | Popular and location writes | `FQ-` explanation rule unchanged |
| 5 | Popular suggestion with statement and citation | Location writes | Checkbox unchanged until Accept |
| 6 | Location hint panel tied to selected codes | Location Number and Location, except today’s auto-fill | Copy states maps are starter |
| 7 | Extra dataset keys (Z, special scores, content, movement) as display-only citations | Those codes | Same `RuleEntry` envelope |
| 8 | Optional remote pack GET | Protocols | New ADR. Search stays on device. Not Cloudflare-per-keystroke and not Supabase |

### Impact if Phase 4 is later approved

- `SavedProtocol` gains an optional array. Existing drafts keep working.
- GitHub Pages behavior is unchanged while the pack is absent.
- The disclaimer gains the accept-before-apply sentence.
- `reference-status.json` can stay `manual-required`, because a suggestion is not a completed lookup until Accept.

### Files a later implementation would touch

- `src/app/models/rorschach.models.ts` — pack types and optional `assistance`
- `src/app/services/reference-pack.service.ts` — new
- `src/app/services/coding-assist.service.ts` — new
- `src/app/components/card-location-map/` — fullscreen
- `src/app/app.component.ts/html/scss` — wire suggestions, or a split response-form component if that split happens first
- `src/assets/data/reference-pack.json` — local only, gitignored
- `docs/STATUS.md`, `docs/DECISIONS.md` — when a phase actually lands

Do not add those files until the owner approves the phase.
