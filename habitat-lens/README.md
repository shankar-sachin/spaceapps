# Habitat Lens

Base front end for the 2026 NASA Space Apps Challenge, **Flame in Freefall**.

You pick a crew-habitat atmosphere. Once the data is wired in, Habitat Lens will rank NASA microgravity combustion investigations by how close their tested conditions are to that habitat, flag what is extrapolated, and show where no evidence exists. The UI copy says "super intelligence (SI)", never "AI".

**This build has no real data.** Every place where data will go is a dashed-outline placeholder slot. The only numbers on the site are:

- the five habitat presets (taken from the project brief), and
- O2 partial pressure, worked out live as `total pressure × O2 fraction`. This is the only calculation on the site.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Other scripts: `npm run build` (static output in `dist/`), `npm run preview`, and `npm run cache:psi` (a stub for the build-time PSI cache, see below).

Stack: React 18, Vite 5, Tailwind 3, and Plotly.js (the `plotly.js-basic-dist-min` bundle) for the coverage chart. It's a single page with no backend.

## Layout

1. Header: wordmark, tagline, About / Sources links
2. Habitat picker: presets with source-tooltip slots, manual pressure and O2 inputs, live ppO2, an airflow slider marked "assumed by you", the SI "Describe your habitat" parser with editable chips, and five weight sliders (visual only)
3. Ranked results table: 8 skeleton rows. Clicking a row, or pressing Enter/Space on it, opens the detail drawer
4. Coverage chart: O2 % vs pressure psia, a star for the current habitat, and three ghost "tested envelope slot" boxes
5. Gravity strip: 0 g / 0.165 g lunar / 1 g. Always visible and can't be collapsed
6. Detail drawer: a modal dialog that traps focus, closes on Esc, and puts focus back on the row you opened it from
7. Data quality panel
8. Trust panel
9. Footer: References and "Triage aid, not a safety verdict."

## Where data goes

All placeholder content lives in **`src/data/placeholders.js`**, with JSDoc `@typedef` shapes. Swap the `null`s for real values (or import a JSON file there) and the components pick them up without any edits. A `null` renders as a dashed slot. A real value renders as normal text.

Every slot in the code has a comment starting with `DATA SLOT:` that names the intended source and field. To list them all:

```bash
grep -rn "DATA SLOT:" src scripts
```

### PSI data: cache at build time, never call live

The investigation fields come from **undocumented NASA PSI (Physical Sciences Informatics) JSON endpoints**. They must be fetched by `scripts/cache-psi.mjs` at build time and written to static JSON in `public/data/psi-investigations.json`. **The browser must never call PSI live.** The script is a stub on purpose: the endpoint URLs aren't listed because they're undocumented and the team still needs to confirm them. Once it works, hook it in as a `prebuild` step.

### DATA SLOT index

| # | Slot (export → field) | Shape | Intended source | Rendered in |
|---|---|---|---|---|
| 1 | `HABITAT_PRESETS[].source` | `SourceRef {label, url, doi}` | NASA habitat / exploration atmosphere reference documents. The spacesuit preset needs both conflicting sources (100% vs 85% O2) | `HabitatPicker` source tooltip |
| 2 | `EMPTY_PARSED_HABITAT.atmosphere` | `string \| null` | SI parser output | `HabitatPicker` chips |
| 3 | `EMPTY_PARSED_HABITAT.airflow` | `string \| null` | SI parser output | `HabitatPicker` chips |
| 4 | `EMPTY_PARSED_HABITAT.fuelCategory` | `string \| null` | SI parser output | `HabitatPicker` chips |
| 5 | `RANKED_INVESTIGATIONS[].rank` | `number \| null` | Ranking engine (sub-scores × weights) | `ResultsTable` |
| 6 | `RANKED_INVESTIGATIONS[].name` | `string \| null` | PSI JSON (build-time cache): investigation title | `ResultsTable`, `DetailDrawer` |
| 7 | `RANKED_INVESTIGATIONS[].psiId` | `string \| null` | PSI JSON: investigation identifier | (key for joins) |
| 8 | `RANKED_INVESTIGATIONS[].hardware` | `string \| null` | PSI JSON: hardware / facility | `ResultsTable`, `DetailDrawer` |
| 9 | `RANKED_INVESTIGATIONS[].fuelType` | `string \| null` | PSI JSON + SI extraction | `ResultsTable` |
| 10 | `RANKED_INVESTIGATIONS[].objective` | `string \| null` | PSI JSON: objective / description | `DetailDrawer` |
| 11 | `RANKED_INVESTIGATIONS[].doi` | `string \| null` (bare DOI, no URL prefix) | PSI JSON: publication DOI | `ResultsTable`, `DetailDrawer` |
| 12 | `RANKED_INVESTIGATIONS[].subScores` | `{o2, pressure, flow, solidFuel, smoke}`, each `0..1 \| null` | Ranking engine | `ScoreBar` |
| 13 | `RANKED_INVESTIGATIONS[].badges` | `('extrapolated'\|'not-reported'\|'metadata-corrected')[] \| null` | Ranking engine + metadata audit | `ResultsTable` |
| 14 | `RANKED_INVESTIGATIONS[].tested.o2` | `TestedRange {min, max, unit, reported}` (%) | PSI JSON + SI extraction | `DetailDrawer` |
| 15 | `RANKED_INVESTIGATIONS[].tested.pressure` | `TestedRange` (psia) | PSI JSON + SI extraction | `DetailDrawer` |
| 16 | `RANKED_INVESTIGATIONS[].tested.flow` | `TestedRange` (cm/s) | PSI JSON + SI extraction | `DetailDrawer` |
| 17 | `RANKED_INVESTIGATIONS[].siExplanation` | `string \| null` | SI explanation generator | `DetailDrawer` |
| 18 | `RANKED_INVESTIGATIONS[].quote.text` / `.location` | `string \| null` | Source document (reached through PSI links) | `DetailDrawer` |
| 19 | `RANKED_INVESTIGATIONS[].quote.verified` | `boolean \| null` | Human verification log | `DetailDrawer` badge |
| 20 | `TESTED_ENVELOPES[]` | `{investigationName, o2Min, o2Max, pressureMinPsia, pressureMaxPsia}` | PSI JSON + SI extraction | `CoverageChart` (drawn in data coordinates once filled; ghost boxes until then) |
| 21 | `GRAVITY_COLUMNS[zero-g].summary` / `.investigationCount` | `string \| null`, `number \| null` | PSI JSON (build-time cache) | `GravityStrip` |
| 22 | `GRAVITY_COLUMNS[one-g].summary` / `.investigationCount` | `string \| null`, `number \| null` | 1 g ground-test literature / NASA-STD-6001 test data | `GravityStrip` |
| 23 | `DATA_QUALITY_FLAGS[]` | `{flagType, severity: 'low'\|'medium'\|'high', detail, investigationName}` | Metadata audit of the PSI cache | `DataQualityPanel` |
| 24 | `TRUST_METRICS.extractionAccuracyPct` | `number \| null` (0–100) | Evaluation on a hand-verified sample | `TrustPanel` |
| 25 | `TRUST_METRICS.quotesVerified` / `.quotesTotal` | `number \| null` | Human verification log | `TrustPanel` |
| 26 | `REFERENCES[]` | `{kind: 'dataset'\|'si-tool'\|'document', citation, url}` | Project bibliography: every dataset and SI tool used | `Footer` |
| 27 | `PSI_ENDPOINTS` in `scripts/cache-psi.mjs` | `string[]` | Confirmed PSI JSON endpoint URLs | build-time cache |

The lunar gravity column isn't a slot. Its text ("No partial-gravity combustion data in PSI. LUCI and FM2 pending.") comes straight from the brief. Re-check it against PSI before each release.

### What isn't data

- The chart axis ranges (O2 0–100 %, 0–16 psia) only frame the view so every preset fits.
- The ghost-box positions are in Plotly paper coordinates and mean nothing.
- The airflow slider runs 0–50 cm/s. That's a control limit, and the value reads "not set" until you move the slider.
- The weight sliders start mid-scale and show no numbers. They feed no calculation.

---

Triage aid, not a safety verdict.
