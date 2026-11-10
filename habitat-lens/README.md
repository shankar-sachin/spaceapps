# Habitat Lens

Built for the 2026 NASA Space Apps Challenge, **Flame in Freefall**.

You pick a crew-habitat atmosphere, and Habitat Lens shows which NASA Physical Sciences Informatics (PSI) combustion records actually tested something like it. It also shows where nothing did.

```bash
npm install
```

```bash
npm run dev
```

`npm run dev` and `npm run build` both regenerate the data first (`npm run data`). The browser never calls PSI.

## The site is built around what the data actually holds

The PSI export (`data/psi_combustion_records.csv`) has 24 combustion records and **no O2, pressure or flow columns**. Conditions only show up in the record prose. So the site:

- has **one control**: the habitat preset. The weights, airflow slider and parser are gone, because the data can't back any of them.
- has **no scores**. Records are grouped into plain yes/no tiers by what their text states (`src/lib/match.js`):
  - Tested at this atmosphere
  - Inside stated range
  - Pressure in range, O2 not stated
  - O2 in range, pressure not stated
  - Stated conditions exclude it
  - Conditions described, no numbers
  - No conditions in record
- uses **only quoted numbers**. Every condition on the chart lives in `data/stated-conditions.json` with its verbatim quote, and the build fails if a quote isn't found in the named CSV field. Pressures given in atm are converted to psia (× 14.696).

What the data turned up:

| Finding | Source |
|---|---|
| ACME BRE (PSI-20) names three of the five presets as NASA-considered atmospheres: 14.7/21, 10.2/26.5, 8.2/34 | PSI-20 Objectives |
| No record names Lunar habitat B (10.2 psia, 30%) or the spacesuit atmosphere | all records |
| FLEX-2 (PSI-68) states a tested span of 0.5–3.0 atm and 0.1–0.4 O2 mole fraction, which contains Lunar A, B and C and sea level | PSI-68 Approach |
| CFI (PSI-39) contradicts itself: 0.25–5 atm in Objectives, 0.25–0.5 atm in Approach | PSI-39 |
| SAFFIRE-I and -III list the ISS as their platform, but their hardware is "enclosure in Cygnus" | PSI-98, PSI-100 |
| SAME has exactly the same start and end dates as SAFFIRE-I, an unrelated record | PSI-102, PSI-98 |
| 0 records are on a partial-gravity platform | Flight Platform column |

## Data pipeline

| File | Role |
|---|---|
| `data/psi_combustion_records.csv` | PSI export, unedited |
| `data/stated-conditions.json` | Hand-curated numeric conditions and contradictions, each with a verbatim quote |
| `scripts/build-data.mjs` | Parses the CSV, checks the quotes, extracts condition-mention sentences, runs the metadata checks, counts the stats |
| `src/data/generated/psi.json` | Output the site imports (committed so the repo can be reviewed without a build) |
| `src/data/index.js` | Habitat presets plus the PSI data |

Adding a condition: copy the exact sentence from the CSV into `stated-conditions.json`, choose a `kind` (`point`, `range`, `pressure-band`, `o2-below`), and run `npm run data`.

Things to watch in the export:
- Multi-value fields are joined by runs of spaces.
- `Person` packs every first and last name into two strings, so they can't be reliably paired. The site shows surnames as listed.
- `Public Release Date` is in Unix seconds.

## Still open

- **Lunar habitat B and the spacesuit preset:** no PSI source. Cite a NASA document for them.
- **Lunar column text** ("LUCI and FM2 pending") comes from the project brief, not from PSI. Re-check it before release.

Triage aid, not a safety verdict.
