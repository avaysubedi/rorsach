# Location map sources

Authoring copies of card location maps. The app reads `src/assets/data/card-location-maps.json`.

## Spatial starter maps

| Card | Appendix figure | Starter JSON | Status |
| --- | --- | --- | --- |
| I | A.1 | `card-location-maps-card-i-starter.json` | starter |
| II | A.2 | `card-location-maps-card-ii-starter.json` | starter |
| III | A.3 | `card-location-maps-card-iii-starter.json` | starter |
| IV | A.4 | `card-location-maps-card-iv-starter.json` | starter |
| V | A.5 | `card-location-maps-card-v-starter.json` | starter |
| VI | A.6 | `card-location-maps-card-vi-starter.json` | starter |
| VII | A.7 | `card-location-maps-card-vii-starter.json` | starter |
| VIII | A.8 | `card-location-maps-card-viii-starter.json` | starter |
| IX | A.9 | `card-location-maps-card-ix-starter.json` | starter |
| X | A.10 | `card-location-maps-card-x-starter.json` | starter |

Appendix scans used for tracing:

- `appendix-a-card-ii.png` … `appendix-a-card-x.png`

Blot photos live in `src/assets/cards/`.

## Regenerating II–X

```
node books/generate-starter-maps.mjs
```

Then merge `books/starter-maps-ii-x.json` into `src/assets/data/card-location-maps.json`.

Polygons are **approximate starters** (same method as Card I/IV). Hover/click in the app and adjust before any clinical use.
