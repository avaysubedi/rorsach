# Design System

Last updated: 2026-09-24

The visual system is Angular Material 19’s prebuilt **azure-blue** theme plus a small custom SCSS layer. There is no design-token file. Colors below are the hex and rgba values written in the stylesheets and `index.html`.

## Colors currently used

### Material theme

`angular.json` loads `@angular/material/prebuilt-themes/azure-blue.css`. Primary actions use `color="primary"` on `mat-flat-button` (Add / Update Response). Other Material chrome (form fields, toolbar ripple, checkbox, table, slide toggle) comes from that theme.

### App palette (custom SCSS)

| Token role | Value | Where |
| --- | --- | --- |
| Page background | `#f5f7fa` | `body` |
| Primary text | `#1f2937` | `body` |
| Ink / titles | `#172033` | Toolbar text, SVG labels, code chips |
| Muted text | `#536074`, `#667085`, `#344054` | Hints, summary labels, readout, empty states |
| Surface | `#ffffff` | Toolbar, summary cards, table, chips |
| Hairline | `#d8dee8` | Toolbar border, summary cards, table frame |
| Map stage border | `#cfd7e3` | Map stage |
| Map stage fill | `#eef2f7` | Map stage |
| Placeholder icon | `#8a97aa` | Missing-image icon |
| Warning border | `#d3b35c` | Disclaimer and inline warnings |
| Warning fill | `#fff8e5` | Disclaimer and inline warnings |
| Warning text | `#4b3a0b` | Disclaimer and inline warnings |
| Warning hint | `#9a6700` | Empty inquiry hint |
| File button border | `#74777f` | Import JSON label |
| File button text | `#1b1b1f` | Import JSON label |
| Chip border | `#c5cdd8` | Location code chips |
| Selection green | `#1f7c54` / `#146c43` / `#e7f6ee` | Selected code chip |
| Region hover | `rgba(25, 118, 210, 0.18)` fill, `rgba(25, 118, 210, 0.75)` stroke | SVG polygon |
| Region selected | `rgba(31, 124, 84, 0.32)` fill, `rgba(31, 124, 84, 0.95)` stroke | SVG polygon |
| Label halo | `#ffffff` stroke on `#172033` fill | SVG text |
| Favicon | `#172033` tile, `#ffffff` and `#94a3b8` circles | `index.html` |

Dead rules in `app.component.scss` (no template bindings): `.card-viewer`, `.placeholder-card`, `.location-mark`, `.mark-toolbar`, `.json-preview` (`#111827` / `#d1fae5`). The live placeholder lives in the map component.

## Typography

Loaded from Google Fonts in `index.html`:

- **Inter** weights 400, 500, 600, 700
- **Material Icons** ligature font

Fallback stack in `styles.scss`: `Inter, Roboto, "Helvetica Neue", Arial, sans-serif`. Buttons, inputs, and textareas inherit it.

| Use | Size / weight |
| --- | --- |
| Section titles (`h2`) | 22px |
| Summary list titles (`h3`) | 15px |
| Summary metric value | 30px |
| Body and Material controls | theme default |
| Checkbox helper, palette titles, source note | 12px |
| Code chips | 13px / 600 |
| SVG region labels | 28px / 700 inside a 1000×1000 viewBox (scales with the stage) |
| Toolbar title under 720px | 15px |

## Component patterns

| Pattern | Implementation |
| --- | --- |
| Page chrome | `mat-toolbar` sticky at top, white, icon buttons with `matTooltip` |
| Disclaimer | Flex row, warning colors, `verified_user` icon. Copy is hardcoded |
| Sections | `mat-card` with `mat-card-header` / `mat-card-title` / `mat-card-content` |
| Fields | `mat-form-field` `appearance="outline"` inside a 2-column `.grid-form` |
| Wide fields | Class `span-2` |
| Multi-value codes | `mat-select` `multiple` |
| Boolean | `mat-checkbox` plus a 12px helper line |
| Validation | `mat-error` via `hasError` (touched or dirty). Inquiry uses `mat-hint` |
| Primary action | `mat-flat-button color="primary"` with a leading `mat-icon` |
| Secondary actions | `mat-stroked-button` |
| Row actions | `mat-icon-button` edit / delete |
| Import | `<label class="file-button">` styled as a stroked pill; input hidden |
| Feedback | `MatSnackBar`, short duration, action text `Dismiss` |
| Selected codes | `mat-chip-set` under the map, plus the map’s own readout |
| Map controls | Stroked buttons + `mat-slide-toggle` |
| Code palette | Button chips, `.is-selected` green |
| Data table | `mat-table`, horizontal scroll, min width 1240px |
| Empty table | Centered muted line: “No coded responses yet.” |
| Counts | White bordered tiles, not Material cards |

Icons are Material ligatures (`save`, `folder_open`, `data_object`, `download`, `edit`, `delete`, `add`, `check`, `warning`, `info`, `image`).

## Layout system

```
sticky toolbar
page-shell (max 1500px, centered, 24px vertical padding)
  notice
  workspace grid: form stack | sticky map column (340–440px)
  actions band (wrapping row)
  summary grid (4 columns)
  table (full width, scroll)
```

| Rule | Value |
| --- | --- |
| Page width | `min(1500px, calc(100% - 32px))` |
| Workspace columns | `minmax(0, 1fr)` and `minmax(340px, 440px)`, gap 20px |
| Form grid | 2 columns, gap `14px 16px` |
| Map stickiness | `top: 88px` (below the toolbar) |
| Map stage | Square `aspect-ratio: 1 / 1`, min-height 420px |
| Card radius | 8px |
| Pills | `border-radius: 999px` (import button, code chips) |
| Summary grid | 4 columns, gap 14px |
| Stacking | Toolbar `z-index: 10`; SVG overlay `z-index: 2` |

### Breakpoints

| Max width | Change |
| --- | --- |
| 1100px | Workspace becomes one column. Map is not sticky. Summary becomes 2 columns |
| 720px | Page gutter shrinks. Form and summary become 1 column. `span-2` resets. Map min-height 320px. Toolbar title 15px |

There is no shared layout component, container query, or spacing scale. Gaps are local (`20px`, `14px`, `12px`, `10px`, `8px`, `6px`).

## UI consistency recommendations

1. **Keep warning chrome on one recipe.** Disclaimer, mixed-location warning, and reference-lookup warning already share `.notice` / `.inline-warning`. New alerts should reuse those classes.
2. **Prefer Material buttons over one-off pills.** Import JSON restyles a `<label>` to look like `mat-stroked-button`. A Material button plus a hidden input would match the actions band.
3. **One action row.** Save, load, export JSON, and export CSV exist on the toolbar and again in the actions band. Import exists only in the band.
4. **Delete the unused viewer CSS** in `app.component.scss` when the click-to-mark UI is either restored or removed, so the palette in this file stays the live one.
5. **Name the custom colors** in `:root` custom properties if more components are split out of `AppComponent`. Today the same hex is copied between the root SCSS and the map SCSS (`#172033`, `#667085`, `#536074`, `#cfd7e3`, `#eef2f7`).
6. **Self-host Inter and Material Icons** if offline use or font privacy matters. The layout assumes those fonts.
7. **Do not introduce a second visual language** (another component library, a dark theme, or a new button radius) for a single feature. Match outline fields, 8px cards, and stroked secondary buttons.
8. **Keep the disclaimer visible** on the only screen. Summary copy already says counts are not an interpretation; leave that sentence next to the counts.
