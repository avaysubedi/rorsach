# AI Review Skills

Last updated: 2026-09-24

Use these checklists when reviewing a change to this repository. Read `docs/AGENTS.md` and the matching design doc first. Findings should cite files and behavior. A review that invents a backend, database, or auth layer is incorrect for this codebase.

Each skill lists what to read, what to check, and what to reject.

---

## Architecture Reviewer

**Read:** `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `src/main.ts`, `src/app/app.component.ts`, `src/app/models/rorschach.models.ts`.

**Check:**

- The change still has one protocol document (`SavedProtocol`) and the existing services.
- New UI is a standalone component with `inject()` and colocated SCSS, or a direct edit of the current screen.
- Catalog data stays in `src/assets/data/`.
- A router, global store, NgModule, or second location picker is absent unless `docs/DECISIONS.md` gained an ADR for it.
- `AppComponent` growth is justified, or the split follows the existing sections (metadata, response form, summary, table, map).

**Reject:**

- A parallel storage key, export path, or HTTP API client for local draft features.
- Auto-coding of Form Quality, Populars, GHR/PHR, interpretation, or Location Number beyond the current `W` rule, without an owner decision in the ADR file.
- Copyrighted Exner tables added under `src/assets`.

---

## Security Reviewer

**Read:** `docs/SECURITY.md`, `src/app/services/local-storage.service.ts`, `src/app/services/export.service.ts`, `src/index.html`.

**Check:**

- Protocol text stays in memory, `localStorage`, or a user-initiated download.
- Import remains `JSON.parse` plus a shape check. No HTML execution of file contents.
- Templates bind response text with interpolation.
- New network calls are limited to static assets already in the repo, or an ADR describes anything else.
- Sample protocols and blot plates are not newly committed without rights.
- Shared-machine actions (clear draft, delete) fail closed with confirmation if those controls are touched.

**Reject:**

- Upload, analytics, or third-party scripts that receive protocol fields.
- Secrets, tokens, or `.env` files.
- `bypassSecurityTrustHtml` on examiner or examinee text.
- Weakening Pages workflow permissions without reason.

---

## Frontend Reviewer

**Read:** `docs/DESIGN_SYSTEM.md`, `src/app/app.component.html`, `src/app/app.component.scss`, `src/app/components/card-location-map/`.

**Check:**

- Material patterns match the screen: outline form fields, stroked secondary buttons, flat primary for the main submit, snackbars for feedback.
- The examiner-judgment disclaimer is still visible.
- Layout still collapses at 1100px and 720px if the workspace grid changed.
- Map selection still emits codes and regions; `W` stays exclusive.
- Empty, missing-image, and load-failed states still have copy.
- Forms use reactive forms. Conditional validators for `FQ-` and Low confidence still run.
- Accessibility: icon buttons keep `matTooltip`; the palette keeps an accessible name; table still has headers.

**Reject:**

- A second component library or a one-off color that duplicates an existing hex.
- Removing the summary sentence that counts are not an interpretation.
- Template references to `referenceStatus` that claim auto-coding.
- Dead click-mark methods wired back up without a visible, tested viewer.

---

## Backend Reviewer

**Read:** `docs/API_STANDARDS.md`, `docs/ARCHITECTURE.md`, `src/main.ts`.

**Check:**

- Confirm the diff does not add a server, controller, or remote client by accident.
- Static JSON fetches stay on the four asset paths (or a new asset documented in `API_STANDARDS.md` and `ARCHITECTURE.md`).
- Errors surface as snackbars or the map’s `loadFailed` / `imageMissing` flags.
- `ExportService.parseJson` remains the import gate.

**Reject:**

- Controllers, DTOs, status-code enums, or interceptors that have no ADR.
- Base URLs that break the `/rorsach/` Pages build (absolute root paths that ignore `baseHref`).
- Duplicate JSON parsers in components.

This skill exists so reviewers look for a backend and correctly report that the project does not have one, unless an ADR has changed that fact.

---

## Database Reviewer

**Read:** `docs/DB_STANDARDS.md`, `src/app/models/rorschach.models.ts`, `src/app/services/local-storage.service.ts`.

**Check:**

- Field names stay camelCase and match `SavedProtocol`.
- The storage key is still `rorschach-cs-protocol-draft`.
- Shape changes include a migration path for existing drafts and exported JSON.
- Arrays on responses stay arrays (`determinants`, `contentCodes`, `specialScores`, location selections).
- Authoring JSON in `books/` is not what the app loads at runtime.

**Reject:**

- SQL, ORMs, or a second persistence technology without an ADR.
- Snake_case JSON in the draft.
- Dropping `id` or silently rewriting imported responses.
- Committing live protocol JSON as fixtures.

---

## Performance Reviewer

**Read:** `docs/STATUS.md` performance-related notes, `src/app/app.component.ts` (`summary`, `objectEntries`), `src/app/components/card-location-map/card-location-map.component.ts`.

**Check:**

- Map JSON still loads once per map component init (`forkJoin`), not once per click.
- Summary work stays on the in-memory array. Typical R is under 50; the table is not virtualized, which is acceptable.
- Polygon hit targets are not replaced with a heavier canvas stack unless profiling shows a problem.
- New watches or getters in the template do not clone the full map file every change-detection cycle.
- Image `object-fit: contain` and the 1000×1000 viewBox stay aligned if coordinates change (`books/generate-starter-maps.mjs` assumes a 723×1024 photo in that square).

**Reject:**

- Per-keystroke writes of the entire map catalog.
- Adding virtual scroll, workers, or a state library for the current data size without a measurement.

Current volume is small. Call out real regressions (loading maps inside a click handler, unbounded import) and skip speculative micro-optimizations.

---

## Documentation Reviewer

**Read:** `docs/PROJECT_SNAPSHOT.md`, `docs/CURRENT_CONTEXT.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/ROADMAP.md`, `docs/PRD.md`, and any root markdown the diff touches.

**Check:**

- Behavior changes update `docs/STATUS.md` (completed, in progress, missing, known issues, or debt).
- Architecture changes add or revise an ADR in `docs/DECISIONS.md`.
- Docs describe the code. They do not revive the outdated claim that only cards I and IV have maps, or that card PNGs are absent, unless the code has reverted to that.
- The worksheet boundary and the disclaimer stay documented if UX copy changes.
- New assets are named in `docs/ARCHITECTURE.md` or `docs/API_STANDARDS.md`.
- No copyrighted scoring tables are pasted into markdown.

**Reject:**

- A feature described as clinically validated when `spatialStatus` is still `starter` or `reference-status.json` still says `manual-required`.
- API or database chapters that document controllers or stored procedures as if they exist.
- Status dates left stale after a behavior change.
