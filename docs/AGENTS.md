# Agent rules

Last updated: 2026-09-24

These rules apply to every AI agent working in this repository. Cursor also applies `.cursor/rules/rorschach-lead-engineer.mdc`. If a root note disagrees with `docs/` or the source, follow the source and `docs/`.

## Required before any edit

1. **Read docs first.** Start with `docs/PROJECT_SNAPSHOT.md` and `docs/CURRENT_CONTEXT.md`, then `docs/STATUS.md`, `docs/ARCHITECTURE.md`, and `docs/DECISIONS.md`. Read `docs/PRD.md` when the task changes behavior, and `docs/ROADMAP.md` when choosing what to build next. Read `docs/DESIGN_SYSTEM.md`, `docs/API_STANDARDS.md`, `docs/DB_STANDARDS.md`, or `docs/SECURITY.md` when the task touches that area. Use `docs/SKILLS.md` for reviews.
2. **Analyze before coding.** Inspect the files you will change and the callers of those files. This app is one screen. A change in `AppComponent`, `SavedProtocol`, or the location map affects the whole workstation.
3. **Wait for approval before coding.** After analysis, state the plan and the files to touch. Start implementation only after the owner approves. Documentation-only tasks that the owner already asked to write are the exception.

## Required while changing the system

4. **Never make large changes without impact analysis.** A large change is a new router, backend, database, state library, scoring engine, storage key, export path, or location picker; a rewrite of `AppComponent`; or an edit that crosses several of those seams. Write the impact in the reply: what breaks for existing `localStorage` drafts and exported JSON, what happens on GitHub Pages, and which disclaimer or catalog assumption changes.
5. **Prefer existing code over creating new patterns.** Extend `SavedProtocol`, `ExportService`, `LocalStorageService`, `CardLocationMapComponent`, and `rorschach.models.ts`. Reuse Material, reactive forms, snackbars, and JSON assets.
6. **Maintain architectural consistency.** Standalone components, `inject()`, `app` prefix, colocated SCSS, catalogs in `src/assets/data/`, domain types in `src/app/models/rorschach.models.ts`. The client-only boundary in ADR-001 stays until an ADR replaces it.

## Required after implementation

7. **Update `docs/STATUS.md`** when behavior, readiness, known issues, or debt changes. Set **Last updated** to the day of the change.
8. **Update `docs/DECISIONS.md`** when the architecture changes (router, backend, database, store, scoring, second persistence path, new location model). Use the ADR format already in that file.

Also update root `DEVELOPMENT_STATUS.md`, `KNOWN_ISSUES.md`, and `NEXT_STEPS.md` when product readiness changes, so older handover notes do not contradict `docs/STATUS.md`.

## Product boundaries

- This is a coding worksheet, not an auto-scorer.
- Do not auto-code Location Number except the current whole-blot `W` behavior. Do not auto-code Form Quality, Populars, GHR/PHR, or clinical interpretation unless the owner expands scope and licensed reference data is available.
- Do not add copyrighted Rorschach plates or Exner tables without documented rights. Blot PNGs already in `src/assets/cards/` stay as they are; do not add more casually.
- Do not add a second storage key, a second export pipeline, or a second location picker.
- Keep the examiner-judgment disclaimer visible.
- Treat protocol JSON as sensitive. Do not commit files from `exports/` or paste examinee text into docs, tests, or commits.

## Implementation conventions

- Match the control flow and form style already in `app.component.ts`.
- User-facing failures use `MatSnackBar` with action `Dismiss`.
- Asset URLs stay relative (`assets/...`) so the Pages `baseHref` `/rorsach/` works.
- Do not introduce tests frameworks, lint, or CI as a drive-by. Add them only when the task asks.
- Do not commit unless the owner asks.

## Review

For a review request, follow the matching skill in `docs/SKILLS.md` and report gaps against the code, not against an imagined server.
