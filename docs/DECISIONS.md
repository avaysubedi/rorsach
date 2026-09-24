# Architecture Decision Records

Last updated: 2026-09-24

Decisions below are **observed in the codebase** or in the existing root notes. “Rationale” is what the implementation and those notes support. Where the reason is inferred, it is labeled as such.

## Index

| ID | Title | Status |
| --- | --- | --- |
| ADR-001 | Client-only SPA | Accepted |
| ADR-002 | Single screen, no router | Accepted |
| ADR-003 | One localStorage draft | Accepted |
| ADR-004 | Catalogs as static JSON | Accepted |
| ADR-005 | Worksheet, not an auto-scorer | Accepted |
| ADR-006 | Angular Material azure-blue and colocated SCSS | Accepted |
| ADR-007 | Untyped reactive forms | Accepted (incumbent) |
| ADR-008 | GitHub Pages static deploy | Accepted |
| ADR-009 | SVG regions plus a code palette | Accepted |
| ADR-010 | `SavedProtocol` is the only document shape | Accepted |
| ADR-011 | Standalone components and `inject()` | Accepted |

---

## ADR-001: Client-only SPA

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Examiners need a coding worksheet. The repo has no server project, no database scripts, and no auth module.
- **Decision:** The product is a static Angular application. `HttpClient` loads JSON from `src/assets` only.
- **Rationale:** Detectable from `main.ts` (only `provideAnimationsAsync` and `provideHttpClient`) and from the absence of any API client. Root architecture notes state the same boundary.
- **Consequences:** Protocol data stays in the browser. Multi-user sync, accounts, and server-side validation do not exist. Adding them is a new decision, not an extension of a hidden API.

## ADR-002: Single screen, no router

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** The UI is one scrollable workstation: metadata, response, coding, map, actions, summary, table.
- **Decision:** `AppComponent` is bootstrapped directly. `@angular/router` is installed and unused. There is no `app.config.ts` and no routes.
- **Rationale:** Inferred from the single template and from `NEXT_STEPS.md`, which says not to add a router until a second real screen exists.
- **Consequences:** Deep links and a protocol list are unavailable. Navigation is in-page scroll (`editResponse` scrolls to top).

## ADR-003: One localStorage draft

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** The prototype must survive refresh without a server.
- **Decision:** `LocalStorageService` uses the single key `rorschach-cs-protocol-draft`. Startup restores silently. `clear()` is implemented and not wired to the UI.
- **Rationale:** The key and the silent restore are in code. One key avoids a second storage path.
- **Consequences:** One draft per origin. Shared browsers show the last protocol. Clearing storage or switching profiles drops the draft unless JSON was exported.

## ADR-004: Catalogs as static JSON

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Coding lists and location geometry change more often than components.
- **Decision:** Dropdowns live in `coding-options.json`. Reference flags live in `reference-status.json`. Polygons live in `card-location-maps.json`. Palette codes live in `card-location-catalog.json`. Types live in `rorschach.models.ts`.
- **Rationale:** Components fetch these files instead of hardcoding option arrays. `books/generate-starter-maps.mjs` shows maps are authored outside the component.
- **Consequences:** Catalog edits do not require TypeScript changes if the JSON matches the interfaces. A bad file fails at runtime via snackbar or `loadFailed`. There is no schema validator in the build.

## ADR-005: Worksheet, not an auto-scorer

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Location charts, form quality, populars, and structural indices depend on copyrighted reference tables and examiner judgment.
- **Decision:** The app records coding and counts it. It does not auto-code Location Number except whole-blot `W`, and it does not auto-code Form Quality, Populars, GHR/PHR, or interpretation. The disclaimer is always visible. `reference-status.json` marks those areas `manual-required` and the summary `partial`.
- **Rationale:** Explicit in the template, in `applyLocationAutoFill`, and in the product rules.
- **Consequences:** The summary can be mistaken for a CS structural summary if the disclaimer is removed. Expanding into scoring needs an owner decision and licensed data (ADR-level change).

## ADR-006: Angular Material azure-blue and colocated SCSS

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** The UI needs forms, a table, and a toolbar quickly.
- **Decision:** Prebuilt theme `azure-blue.css` plus component SCSS. Global styles only set the page background, text color, and Inter stack. Schematics set component style to SCSS and prefix to `app`.
- **Rationale:** `angular.json` options. Custom layout (workspace grid, map, summary) is hand-written because Material does not provide that page structure.
- **Consequences:** Theme updates follow Angular Material. Custom hex values are duplicated across SCSS files. See `docs/DESIGN_SYSTEM.md`.

## ADR-007: Untyped reactive forms

- **Status:** Accepted (incumbent)
- **Date observed:** 2026-09-24
- **Context:** The response form has many controls, including arrays.
- **Decision:** `UntypedFormBuilder` builds `metadataForm` and `responseForm`. `buildResponseFromForm` casts the raw value to `RorschachResponse`.
- **Rationale:** Present in `app.component.ts`. A typed `FormGroup` is not used. This looks like speed of prototyping rather than a documented standard.
- **Consequences:** Strict templates do not catch a mismatched control name at the model boundary. New forms should prefer typed groups unless matching this form exactly is the smaller change.

## ADR-008: GitHub Pages static deploy

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** The README publishes https://avaysubedi.github.io/rorsach/.
- **Decision:** Push to `main` runs `ng build --configuration pages` with `baseHref: /rorsach/`, copies `index.html` to `404.html`, adds `.nojekyll`, and deploys the browser bundle with GitHub Pages actions.
- **Rationale:** `.github/workflows/deploy-pages.yml` and the `pages` configuration in `angular.json`.
- **Consequences:** The public URL serves the same client as local `ng serve`, including plaintext drafts in each visitor’s browser. There is no server-side access control on the static files. Asset URLs must respect the `/rorsach/` base href (the app already uses relative `assets/...` paths).

## ADR-009: SVG regions plus a code palette

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Examiners need location codes even when a polygon is missing or approximate.
- **Decision:** Each card map is polygons in a shared `0 0 1000 1000` viewBox over a PNG. The palette merges `card-location-catalog.json` with map regions by code. Selection emits codes and region objects to the parent, which auto-fills Location.
- **Rationale:** `CardLocationMapComponent` implements both layers. `spatialStatus` allows `starter` or `catalog-only`; every current card is `starter`.
- **Consequences:** Two JSON files must stay aligned. Catalog-only codes are clickable chips with empty `points`. Overlapping polygons hit-test in paint order. Authoring for cards II–X can be regenerated from `books/generate-starter-maps.mjs` and then merged into the asset file.

## ADR-010: `SavedProtocol` is the only document shape

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Save, load, export, and import must round-trip the same object.
- **Decision:** `SavedProtocol` is `{ metadata, responses }`. JSON export writes that object. Import requires those two keys. CSV is a lossy view of `responses` only and is not a second document format.
- **Rationale:** `ExportService` and `LocalStorageService` share the type. There is no schema version field.
- **Consequences:** Shape changes break old drafts and old JSON files unless a migration is added. Do not add a second storage key or a second export pipeline.

## ADR-011: Standalone components and `inject()`

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** Angular 19 application with two components.
- **Decision:** Both components are `standalone: true` with explicit `imports`. Services and `HttpClient` are constructor-free `inject()` calls.
- **Rationale:** Consistent in `AppComponent` and `CardLocationMapComponent`. No NgModules exist.
- **Consequences:** New UI should be standalone with a local `imports` array. Prefer splitting `AppComponent` along current sections (metadata, response form, summary, table) over adding a framework or a global store.

## ADR-012: Examiner-controlled coding assistance

- **Status:** Accepted
- **Date observed:** 2026-09-24
- **Context:** The owner approved `docs/CODING_ASSISTANCE_ENGINE.md`. Suggestions must not silently code Form Quality, Popular, or location.
- **Decision:** A gitignored `reference-pack.json` is searched in the browser. Accept writes `formQuality` or `popular`. Location hints do not write fields. Fullscreen mode stays inside `CardLocationMapComponent`. Optional `assistance` rides on `SavedProtocol` responses. The sample pack is not an official table.
- **Rationale:** Keeps ADR-001 and ADR-005. GitHub Pages does not receive the pack while the file stays gitignored.
- **Consequences:** Public Pages stays manual until a rights-cleared pack is published. Local `ng serve` uses the pack only when that file exists on disk.

## How to add a decision

When a change introduces a router, backend, database, state library, scoring engine, second storage key, or a new location picker:

1. Add the next ADR in this file before or with the change.
2. State context, decision, rationale, and consequences.
3. Update `docs/STATUS.md`.
4. Do not treat an inferred rationale above as permission to expand scope.
