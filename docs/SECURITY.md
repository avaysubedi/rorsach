# Security

Last updated: 2026-09-24

## Current security implementation

| Control | What exists |
| --- | --- |
| Transport for the app | GitHub Pages serves the static bundle over HTTPS. Local dev is `ng serve` on localhost. |
| Authentication | None |
| Authorization | None |
| Session | None |
| Encryption of protocols | None. `localStorage` and downloaded JSON/CSV are plaintext |
| Audit log | None |
| Server-side validation | None |
| CSRF / cookies | None. No credentialed requests |
| Content Security Policy | None in `index.html` |
| Dependency install in CI | `npm ci` on Node 20 in GitHub Actions |
| Secrets in repo | No `.env`. Angular CLI analytics id `448a1bb1-f387-4a70-84e2-a98a1a0544bf` is in `angular.json` (CLI telemetry, not end-user tracking) |
| Local dumps | `exports/` is gitignored |
| Authoring scans | `books/appendix-a-*.png`, `books/*.pdf`, and `pdf2png/` are gitignored |

The only “trust boundary” is the browser origin. Any script running on that origin can read `rorschach-cs-protocol-draft`.

## Data classification

Protocol documents can contain examinee codes, age, gender, dates, examiner names, notes, and verbatim responses. Treat them as sensitive clinical data (PHI/PII in many settings), including sample exports on a developer machine.

Card images and location geometry are reference materials. Several PNGs are committed under `src/assets/cards/`. `src/assets/cards/README.md` says not to redistribute copyrighted plates without rights.

## Risks discovered

| Risk | Why it matters |
| --- | --- |
| Plaintext `localStorage` | A shared computer keeps the last protocol. XSS on the origin, a malicious extension, or physical access can read it. |
| Unrestricted download | Export JSON/CSV makes it easy to email or commit a protocol. Import then writes that file back into `localStorage`. |
| Public static hosting | The Pages site has no login. That matches the product (no accounts) and also means the worksheet is world-readable as an app. Drafts stay on each visitor’s browser. |
| Shallow import | Any JSON with `metadata` and `responses` is applied. There is no size cap. Prototype risk is local (the file is not executed), but a huge file can hang the tab. |
| No delete confirmation and no clear-draft UI | Accidental delete, or a leftover draft on a shared profile. `clear()` exists and is unused. |
| Metadata loss | Header fields are not saved until another action writes the draft. Users may believe the form is durable. |
| Google Fonts | `index.html` requests `fonts.googleapis.com` / `fonts.gstatic.com`. That reveals that the app was opened and fails offline. |
| Committed blot images | Copyright and redistribution risk. File sizes vary sharply (Card I and Card IV are much larger than the other PNGs). |
| Dead click-mark code | Unused methods are not a direct exploit. They are a sign the sensitivity of stored coordinates is easy to forget. |
| CLI analytics id | Review against the organization’s telemetry policy. It is not a user analytics SDK inside the app. |
| No automated tests or dependency-audit job | Pages CI installs and builds. It does not run `npm audit` or tests. |
| Overlapping product risk | Shipping counts as if they were a CS structural summary can cause clinical misuse. This is a safety issue recorded in the disclaimer. |

No remote upload of protocols exists. Do not add one without an explicit privacy design.

## Recommendations

1. **Keep protocols off the network.** Do not add telemetry, cloud save, or a “share link” that posts `SavedProtocol`.
2. **Add Clear draft** wired to `LocalStorageService.clear()` with a confirmation dialog, and confirm before delete.
3. **Auto-save metadata** so a refresh does not drop identifiers already typed.
4. **Document shared-machine use** next to the disclaimer: export JSON and clear the draft before leaving the browser profile.
5. **Cap import size** and reject non-objects before `applyProtocol`. Still avoid executing imported content (the current `JSON.parse` path is the right shape).
6. **Self-host fonts** or ship the Material Icons font locally, and add a Content-Security-Policy that only allows `'self'` once fonts are local.
7. **Confirm rights** for every file in `src/assets/cards/` before further publication. Do not add Exner tables.
8. **Leave `exports/` gitignored.** Do not commit trial protocols.
9. **Remove or reattach** `imageLocations` so stored drafts do not silently keep click coordinates the UI cannot show.
10. **If accounts or a server are ever required,** write an ADR first: encryption at rest, access control, retention, and a decision on whether GitHub Pages is still an acceptable host. This prototype is not that design.

## Secure-development rules for agents

- Do not log protocol bodies to the console beyond the existing bootstrap `console.error`.
- Do not put examinee text in URLs, issue titles, or example fixtures committed to git.
- Do not disable GitHub Actions permissions below what Pages needs, and do not widen them.
- Do not add `eval`, `innerHTML` bindings of protocol text, or a markdown renderer for verbatim responses. Interpolation in the template is the current safe default.
