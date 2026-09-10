# Project Overview

**Rorschach CS Coding Assistant** is a browser-only Angular prototype that helps trained examiners record Comprehensive System (Exner) coding for a Rorschach protocol.

Package name: `rorschach-coding-assistant`  
Version: `0.1.0`  
Status: **local prototype — not production-ready**

## What the application does

The app is a single-page coding worksheet. An examiner:

1. Enters protocol metadata (examinee code, age, gender, date, examiner, notes).
2. Selects a blot card (I–X) and records a verbatim response plus inquiry notes.
3. Codes the response (Location, Location Number, DQ, Determinants, Form Quality, Content, Popular, Special Scores, confidence).
4. Optionally selects location regions on an SVG overlay map (Cards I and IV only, starter maps).
5. Reviews a **count-only** Structural Summary Preview.
6. Saves a draft in `localStorage`, and export/import JSON or export CSV.

The product is deliberately a **recording and counting assistant**, not an auto-coder or clinical interpreter. The UI states this explicitly: Location Number, Form Quality, Popular, GHR/PHR, special scores, and interpretation remain examiner judgment against official Exner references.

## Main business purpose

Reduce clerical load while coding a protocol by:

- Putting CS coding fields, card context, and a response table on one screen.
- Auto-filling Location (`W` / `D` / `Dd` / `S`) from selected map regions when the selection is unambiguous.
- Persisting a draft locally and allowing JSON/CSV exchange.

It does **not** replace licensed scoring software, published location charts, form-quality tables, or popular-response tables.

## Target users

| Audience | Role |
| --- | --- |
| Licensed psychologists / trained Rorschach CS examiners | Primary users; enter and code protocols |
| Supervisors / students in CS training | Possible secondary users for practice coding |
| Software maintainers | Extend maps, coding lists, and persistence |

Not intended for examinees, untrained users, or automated clinical decision-making.

## Current development status

This is an early **v0.1 workstation**:

- Core coding form, table, local draft, and export/import work as a single-component app.
- Location maps exist only for **Card I** and **Card IV**, marked as approximate starter geometry that must be verified before any clinical use.
- **No blot images** are in the repo (copyright). The map UI falls back to a placeholder while SVG regions remain usable.
- There is **no backend, no authentication, no tests, no lint script, and no production hardening**.
- Clinical data (including possible PHI) is stored in plaintext `localStorage` and in downloaded JSON/CSV.

See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) and [NEXT_STEPS.md](./NEXT_STEPS.md) for the work remaining.
