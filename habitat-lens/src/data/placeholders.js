/**
 * Habitat Lens: placeholder data layer.
 *
 * EVERY value the UI renders that is not user input lives in this file.
 * Real data is dropped in here later; components never need to change.
 *
 * Rules:
 *  - `null` means "no data yet". Components render a dashed placeholder for it.
 *  - The ONLY real numbers in this file are the habitat picker presets, which
 *    were supplied in the project brief. Their source citations are still slots.
 *  - Every slot is marked with a comment beginning "DATA SLOT:" naming its
 *    intended source and field. README.md lists them all.
 *  - Investigation fields come from undocumented PSI (NASA Physical Sciences
 *    Informatics) JSON endpoints, cached to static JSON at BUILD time
 *    (see scripts/cache-psi.mjs). They are never fetched live from the browser.
 */

/* ------------------------------------------------------------------------ */
/* Shapes                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * @typedef {Object} SourceRef
 * @property {string|null} label  Short human label, e.g. document title.
 * @property {string|null} url    Link to the source document.
 * @property {string|null} doi    DOI if the source has one.
 */

/**
 * @typedef {Object} HabitatPreset
 * @property {string} id
 * @property {string} label
 * @property {number} pressurePsia     Total pressure, psia.
 * @property {number} o2Percent        O2 mole fraction as a percent.
 * @property {string|null} inlineFlag  Visible caveat shown on the button.
 * @property {SourceRef|null} source   Citation for the preset (tooltip).
 */

/**
 * @typedef {Object} ParsedHabitat
 * @property {string|null} atmosphere    e.g. "10.2 psia / 26.5% O2"
 * @property {string|null} airflow       e.g. "quiescent", or a cm/s value
 * @property {string|null} fuelCategory  e.g. "solid", "liquid", "gas"
 */

/**
 * @typedef {Object} WeightCriterion
 * @property {'o2'|'pressure'|'flow'|'solidFuel'|'smoke'} key
 * @property {string} label
 * @property {string} colorClass  Tailwind bg class used for its score segment.
 */

/**
 * @typedef {Object} SubScores    Each value is 0..1, or null if not computed.
 * @property {number|null} o2
 * @property {number|null} pressure
 * @property {number|null} flow
 * @property {number|null} solidFuel
 * @property {number|null} smoke
 */

/**
 * @typedef {Object} TestedRange
 * @property {number|null} min
 * @property {number|null} max
 * @property {string|null} unit
 * @property {boolean} reported   false => show "not reported" badge.
 */

/**
 * @typedef {Object} SourceQuote
 * @property {string|null} text
 * @property {string|null} location   Page / section / field in the source.
 * @property {boolean|null} verified  true = checked against source by a human.
 */

/**
 * @typedef {'extrapolated'|'not-reported'|'metadata-corrected'} BadgeType
 */

/**
 * @typedef {Object} Investigation
 * @property {string} rowId                Stable UI key (not a real ID).
 * @property {number|null} rank
 * @property {string|null} name
 * @property {string|null} psiId           PSI investigation identifier.
 * @property {string|null} hardware        e.g. facility / rack name.
 * @property {string|null} fuelType
 * @property {string|null} objective
 * @property {string|null} doi
 * @property {SubScores} subScores
 * @property {BadgeType[]|null} badges
 * @property {{o2: TestedRange, pressure: TestedRange, flow: TestedRange}} tested
 * @property {string|null} siExplanation   Why this ranks here (SI output).
 * @property {SourceQuote} quote
 */

/**
 * @typedef {Object} TestedEnvelope   A rectangle on the coverage chart.
 * @property {string} slotId
 * @property {string|null} investigationName
 * @property {number|null} o2Min
 * @property {number|null} o2Max
 * @property {number|null} pressureMinPsia
 * @property {number|null} pressureMaxPsia
 */

/**
 * @typedef {Object} GravityColumn
 * @property {string} id
 * @property {string} label
 * @property {string} gLabel
 * @property {'slot'|'gap'} kind
 * @property {string|null} summary          Data summary text (slot).
 * @property {number|null} investigationCount
 * @property {string|null} fixedMessage     For known gaps, copy from the brief.
 */

/**
 * @typedef {Object} DataQualityFlag
 * @property {string} slotId
 * @property {string|null} flagType     e.g. "units mismatch", "missing DOI"
 * @property {'low'|'medium'|'high'|null} severity
 * @property {string|null} detail
 * @property {string|null} investigationName
 */

/**
 * @typedef {Object} TrustMetrics
 * @property {number|null} extractionAccuracyPct
 * @property {number|null} quotesVerified
 * @property {number|null} quotesTotal
 */

/**
 * @typedef {Object} Reference
 * @property {string} slotId
 * @property {'dataset'|'si-tool'|'document'|null} kind
 * @property {string|null} citation
 * @property {string|null} url
 */

/* ------------------------------------------------------------------------ */
/* Habitat presets (the only real numbers on the site, from the brief)      */
/* ------------------------------------------------------------------------ */

/** @type {HabitatPreset[]} */
export const HABITAT_PRESETS = [
  {
    id: 'sea-level',
    label: 'Sea level',
    pressurePsia: 14.7,
    o2Percent: 21,
    inlineFlag: null,
    source: null, // DATA SLOT: NASA habitat atmosphere reference document -> source {label, url, doi}
  },
  {
    id: 'lunar-a',
    label: 'Lunar habitat A',
    pressurePsia: 10.2,
    o2Percent: 26.5,
    inlineFlag: null,
    source: null, // DATA SLOT: NASA exploration atmosphere reference document -> source {label, url, doi}
  },
  {
    id: 'lunar-b',
    label: 'Lunar habitat B',
    pressurePsia: 10.2,
    o2Percent: 30,
    inlineFlag: null,
    source: null, // DATA SLOT: NASA exploration atmosphere reference document -> source {label, url, doi}
  },
  {
    id: 'lunar-c',
    label: 'Lunar habitat C',
    pressurePsia: 8.2,
    o2Percent: 34,
    inlineFlag: null,
    source: null, // DATA SLOT: NASA exploration atmosphere reference document -> source {label, url, doi}
  },
  {
    id: 'spacesuit',
    label: 'Spacesuit',
    pressurePsia: 4.3,
    o2Percent: 100,
    inlineFlag: 'another NASA source lists 85%',
    source: null, // DATA SLOT: NASA EVA suit atmosphere references (both conflicting sources) -> source {label, url, doi}
  },
];

/* ------------------------------------------------------------------------ */
/* SI parser                                                                 */
/* ------------------------------------------------------------------------ */

/** @type {ParsedHabitat} */
export const EMPTY_PARSED_HABITAT = {
  atmosphere: null, // DATA SLOT: SI parser output -> parsed.atmosphere
  airflow: null, // DATA SLOT: SI parser output -> parsed.airflow
  fuelCategory: null, // DATA SLOT: SI parser output -> parsed.fuelCategory
};

/* ------------------------------------------------------------------------ */
/* Ranking criteria (labels only; weights are UI state and compute nothing) */
/* ------------------------------------------------------------------------ */

/** @type {WeightCriterion[]} */
export const WEIGHT_CRITERIA = [
  { key: 'o2', label: 'O2 match', colorClass: 'bg-flame' },
  { key: 'pressure', label: 'Pressure match', colorClass: 'bg-flame-soft' },
  { key: 'flow', label: 'Flow match', colorClass: 'bg-amber' },
  { key: 'solidFuel', label: 'Solid-fuel relevance', colorClass: 'bg-sky-400' },
  { key: 'smoke', label: 'Smoke data available', colorClass: 'bg-violet-400' },
];

/* ------------------------------------------------------------------------ */
/* Ranked investigations (8 skeleton rows)                                   */
/* ------------------------------------------------------------------------ */

/** @returns {TestedRange} */
const emptyRange = () => ({ min: null, max: null, unit: null, reported: true });

/** @returns {Investigation} */
const emptyInvestigation = (i) => ({
  rowId: `slot-${i + 1}`,
  rank: null, // DATA SLOT: ranking engine output -> rank (computed from subScores x weights)
  name: null, // DATA SLOT: PSI JSON (build-time cache) -> investigation title
  psiId: null, // DATA SLOT: PSI JSON (build-time cache) -> investigation identifier
  hardware: null, // DATA SLOT: PSI JSON (build-time cache) -> hardware / facility
  fuelType: null, // DATA SLOT: PSI JSON (build-time cache) + SI extraction -> fuel type
  objective: null, // DATA SLOT: PSI JSON (build-time cache) -> objective / description
  doi: null, // DATA SLOT: PSI JSON (build-time cache) -> publication DOI
  subScores: {
    o2: null, // DATA SLOT: ranking engine -> subScores.o2
    pressure: null, // DATA SLOT: ranking engine -> subScores.pressure
    flow: null, // DATA SLOT: ranking engine -> subScores.flow
    solidFuel: null, // DATA SLOT: ranking engine -> subScores.solidFuel
    smoke: null, // DATA SLOT: ranking engine -> subScores.smoke
  },
  badges: null, // DATA SLOT: ranking engine + metadata audit -> badges[]
  tested: {
    o2: emptyRange(), // DATA SLOT: PSI JSON + SI extraction -> tested O2 percent range
    pressure: emptyRange(), // DATA SLOT: PSI JSON + SI extraction -> tested pressure range (psia)
    flow: emptyRange(), // DATA SLOT: PSI JSON + SI extraction -> tested flow range (cm/s)
  },
  siExplanation: null, // DATA SLOT: SI explanation generator -> siExplanation
  quote: {
    text: null, // DATA SLOT: source document (via PSI links) -> quote.text
    location: null, // DATA SLOT: source document -> quote.location
    verified: null, // DATA SLOT: human verification log -> quote.verified
  },
});

/** @type {Investigation[]} */
export const RANKED_INVESTIGATIONS = Array.from({ length: 8 }, (_, i) => emptyInvestigation(i));

/** Badge display definitions (labels only, no findings). */
export const BADGE_TYPES = [
  { type: 'extrapolated', label: 'extrapolated', tone: 'amber' },
  { type: 'not-reported', label: 'not reported', tone: 'dim' },
  { type: 'metadata-corrected', label: 'metadata corrected', tone: 'sky' },
];

/* ------------------------------------------------------------------------ */
/* Coverage chart                                                            */
/* ------------------------------------------------------------------------ */

/** @type {TestedEnvelope[]} */
export const TESTED_ENVELOPES = [
  // DATA SLOT: PSI JSON + SI extraction -> per-investigation tested O2 % and pressure psia bounds
  { slotId: 'env-1', investigationName: null, o2Min: null, o2Max: null, pressureMinPsia: null, pressureMaxPsia: null },
  { slotId: 'env-2', investigationName: null, o2Min: null, o2Max: null, pressureMinPsia: null, pressureMaxPsia: null },
  { slotId: 'env-3', investigationName: null, o2Min: null, o2Max: null, pressureMinPsia: null, pressureMaxPsia: null },
];

/* ------------------------------------------------------------------------ */
/* Gravity strip                                                             */
/* ------------------------------------------------------------------------ */

/** @type {GravityColumn[]} */
export const GRAVITY_COLUMNS = [
  {
    id: 'zero-g',
    label: 'Microgravity',
    gLabel: '0 g',
    kind: 'slot',
    summary: null, // DATA SLOT: PSI JSON (build-time cache) -> summary of 0 g investigations matching habitat
    investigationCount: null, // DATA SLOT: PSI JSON (build-time cache) -> count of 0 g investigations
    fixedMessage: null,
  },
  {
    id: 'lunar-g',
    label: 'Lunar',
    gLabel: '0.165 g',
    kind: 'gap',
    summary: null,
    investigationCount: null,
    // Copy from the project brief. Re-check against PSI before each release.
    fixedMessage: 'No partial-gravity combustion data in PSI. LUCI and FM2 pending.',
  },
  {
    id: 'one-g',
    label: 'Earth',
    gLabel: '1 g',
    kind: 'slot',
    summary: null, // DATA SLOT: 1 g ground-test literature / NASA-STD-6001 test data -> summary of 1 g comparisons
    investigationCount: null, // DATA SLOT: 1 g reference dataset -> count of 1 g comparison tests
    fixedMessage: null,
  },
];

/* ------------------------------------------------------------------------ */
/* Data quality                                                              */
/* ------------------------------------------------------------------------ */

/** @type {DataQualityFlag[]} */
export const DATA_QUALITY_FLAGS = Array.from({ length: 4 }, (_, i) => ({
  slotId: `dq-${i + 1}`,
  flagType: null, // DATA SLOT: metadata audit of PSI cache -> flagType
  severity: null, // DATA SLOT: metadata audit of PSI cache -> severity
  detail: null, // DATA SLOT: metadata audit of PSI cache -> detail
  investigationName: null, // DATA SLOT: PSI JSON -> investigation title the flag applies to
}));

/* ------------------------------------------------------------------------ */
/* Trust panel                                                               */
/* ------------------------------------------------------------------------ */

/** @type {TrustMetrics} */
export const TRUST_METRICS = {
  extractionAccuracyPct: null, // DATA SLOT: hand-verified sample evaluation -> extractionAccuracyPct
  quotesVerified: null, // DATA SLOT: human verification log -> count of verified quotes
  quotesTotal: null, // DATA SLOT: human verification log -> total quotes shown
};

/* ------------------------------------------------------------------------ */
/* References                                                                */
/* ------------------------------------------------------------------------ */

/** @type {Reference[]} */
export const REFERENCES = Array.from({ length: 3 }, (_, i) => ({
  slotId: `ref-${i + 1}`,
  kind: null, // DATA SLOT: project bibliography -> kind (dataset | si-tool | document)
  citation: null, // DATA SLOT: project bibliography -> full citation for every dataset and SI tool used
  url: null, // DATA SLOT: project bibliography -> url
}));
