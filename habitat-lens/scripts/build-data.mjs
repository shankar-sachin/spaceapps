/**
 * Build-time data step. Runs before `dev` and `build`.
 *
 *   data/psi_combustion_records.csv   (PSI export, unedited)
 * + data/stated-conditions.json       (hand-curated, quote-checked)
 * = src/data/generated/psi.json       (what the site imports)
 *
 * Nothing here calls the network. The browser never calls PSI.
 * Every number the site shows is either copied from these files or counted from them.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSV = resolve(root, 'data/psi_combustion_records.csv');
const CURATED = resolve(root, 'data/stated-conditions.json');
const OUT = resolve(root, 'src/data/generated/psi.json');

const ATM_TO_PSIA = 14.696;
const TEXT_FIELDS = ['Objectives', 'Approach', 'Hypothesis', 'Research Impacts/Earth Benefits'];
// PSI exports multi-value fields joined by runs of spaces.
const LIST_SEP = /\s{3,}/;

const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const list = (s) => (s ?? '').split(LIST_SEP).map((x) => x.trim()).filter(Boolean);
const parseJson = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};
const usDate = (s) => {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec((s ?? '').trim());
  return m ? `${m[3]}-${m[1]}-${m[2]}` : null;
};

const MENTION_PATTERNS = {
  o2: /\b(oxygen|O2)\b/i,
  pressure: /\b(pressures?|psia|atm|kPa)\b/i,
  flow: /\b(air ?flow|flow speeds?|flow velocity|forced flow|opposed flow|concurrent flow|inlet velocity|co-?flow)\b/i,
};

function sentences(text) {
  return text
    .split(LIST_SEP)
    .flatMap((chunk) => chunk.split(/(?<=[.!?])\s+(?=[A-Z(])/))
    .map((s) => norm(s))
    .filter((s) => s.length > 12);
}

/* ---------- load ---------- */
const csvText = readFileSync(CSV, 'utf8').replace(/^﻿/, '');
const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
if (parsed.errors.length) {
  console.error(parsed.errors);
  throw new Error('CSV parse errors');
}
const raw = parsed.data;
const curated = JSON.parse(readFileSync(CURATED, 'utf8'));
const byAcc = new Map(raw.map((r) => [r.Accession, r]));

/* ---------- verify curated quotes ---------- */
const checkQuote = (acc, field, quote) => {
  const rec = byAcc.get(acc);
  if (!rec) throw new Error(`Curated quote references unknown accession ${acc}`);
  if (!norm(rec[field]).includes(norm(quote))) {
    throw new Error(`Quote not found verbatim in ${acc} ${field}: "${quote}"`);
  }
};
let quotesChecked = 0;
for (const c of curated.conditions) {
  checkQuote(c.accession, c.field, c.quote);
  quotesChecked += 1;
}
for (const k of curated.contradictions) {
  for (const q of k.quotes) {
    checkQuote(k.accession, q.field, q.quote);
    quotesChecked += 1;
  }
}

const toPsia = (v, unit) => (unit === 'atm' ? +(v * ATM_TO_PSIA).toFixed(2) : v);
const conditions = curated.conditions.map((c) => {
  const p = c.pressure;
  return {
    ...c,
    pressurePsia: p
      ? p.value !== undefined
        ? { value: toPsia(p.value, p.unit) }
        : { min: toPsia(p.min, p.unit), max: toPsia(p.max, p.unit) }
      : null,
    converted: p?.unit === 'atm',
  };
});

/* ---------- records ---------- */
const records = raw.map((r) => {
  const hw = parseJson(r['Experiment Hardware']) ?? {};
  const person = parseJson(r.Person) ?? {};
  const text = TEXT_FIELDS.map((f) => [f, r[f] ?? '']);
  const mentions = {};
  for (const [kind, re] of Object.entries(MENTION_PATTERNS)) {
    const hits = [];
    for (const [field, t] of text) {
      for (const s of sentences(t)) if (re.test(s)) hits.push({ field, text: s });
    }
    mentions[kind] = hits;
  }
  const pubTitles = list(r['Publication Title']);
  return {
    accession: r.Accession,
    acronym: norm(r.Acronym) || null,
    title: norm(r.Title),
    projectType: norm(r['Project Type']),
    isFlight: /microgravity/i.test(r['Project Type']),
    platform: norm(r['Flight Platform']) || null,
    subArea: norm(r['SubResearch Area']) || null,
    related: (r['Related Investigations'] ?? '').match(/PSI-\d+/g) ?? [],
    start: usDate(r['Investigation Start Date']),
    end: usDate(r['Investigation End Date']),
    released: r['Public Release Date'] ? new Date(Number(r['Public Release Date']) * 1000).toISOString().slice(0, 10) : null,
    center: norm(r['Monitoring Center']) || null,
    surnames: norm(person['Last Name']) || null,
    hardware: {
      name: norm(hw.Name) || null,
      links: (hw.Link ?? '').split(/\s+/).filter((u) => /^https?:\/\//.test(u)),
    },
    keywords: list(r.Keywords),
    objectives: list(r.Objectives),
    approach: list(r.Approach),
    hypothesis: list(r.Hypothesis),
    publications: pubTitles,
    mentions,
    conditionIds: conditions.filter((c) => c.accession === r.Accession).map((c) => c.id),
  };
});

/* ---------- data-quality flags (rule-based, reproducible) ---------- */
const flags = [];
const add = (accession, severity, type, detail) => flags.push({ accession, severity, type, detail });
for (const rec of records) {
  if (!rec.acronym) add(rec.accession, 'minor', 'missing acronym', 'Acronym field is empty.');
  if (!rec.platform) {
    if (rec.isFlight) add(rec.accession, 'missing', 'missing platform', 'Flight Platform field is empty.');
    else add(rec.accession, 'minor', 'blank platform', 'Flight Platform is blank; other ground studies use "Not Applicable".');
  }
  if (!rec.start || !rec.end)
    add(rec.accession, 'missing', 'missing dates', `Investigation ${!rec.start ? 'start' : 'end'} date is empty.`);
  if (!rec.hardware.name) add(rec.accession, 'minor', 'missing hardware', 'Experiment Hardware name is empty.');
  if (rec.hardware.name && /cygnus/i.test(rec.hardware.name) && rec.platform && !/cygnus/i.test(rec.platform))
    add(rec.accession, 'conflict', 'platform vs hardware', `Platform says "${rec.platform}" but hardware says "${rec.hardware.name}".`);
}
const seenDates = new Map();
for (const rec of records) {
  if (!rec.start || !rec.end) continue;
  const key = `${rec.start}|${rec.end}`;
  if (seenDates.has(key)) {
    const other = seenDates.get(key);
    if (!rec.related.includes(other.accession) && !other.related.includes(rec.accession)) {
      add(rec.accession, 'conflict', 'duplicate dates', `Start and end dates are identical to ${other.accession} (${other.acronym ?? other.title}), an unrelated investigation.`);
    }
  } else seenDates.set(key, rec);
}
for (const k of curated.contradictions) add(k.accession, 'conflict', 'self-contradiction', k.summary);
const SEV_ORDER = { conflict: 0, missing: 1, minor: 2 };
flags.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.accession.localeCompare(b.accession, 'en', { numeric: true }));

/* ---------- counts ---------- */
const platforms = {};
for (const r of records) if (r.isFlight) platforms[r.platform ?? 'not stated'] = (platforms[r.platform ?? 'not stated'] ?? 0) + 1;
const PARTIAL_G = /\b(lunar|moon|mars|martian|partial[- ]gravity)\b/i;
const stats = {
  total: records.length,
  flight: records.filter((r) => r.isFlight).length,
  ground: records.filter((r) => !r.isFlight).length,
  flightPlatforms: platforms,
  partialGravityPlatform: records.filter((r) => PARTIAL_G.test(r.platform ?? '')).length,
  structuredConditionFields: 0, // the export has no O2 / pressure / flow columns; see csvColumns
  mentionO2: records.filter((r) => r.mentions.o2.length).length,
  mentionPressure: records.filter((r) => r.mentions.pressure.length).length,
  mentionFlow: records.filter((r) => r.mentions.flow.length).length,
  withNumericConditions: new Set(conditions.map((c) => c.accession)).size,
  quotesChecked,
};
const csvColumns = parsed.meta.fields;
if (csvColumns.some((c) => /oxygen|o2|pressure|flow/i.test(c))) {
  throw new Error('CSV now has a condition column; update stats.structuredConditionFields logic.');
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({ source: 'data/psi_combustion_records.csv', csvColumns, stats, records, conditions, contradictions: curated.contradictions, flags }, null, 1),
);
console.log(`[data] ${records.length} records, ${conditions.length} stated conditions, ${quotesChecked} quotes verified, ${flags.length} flags -> ${OUT.replace(root + '/', '')}`);
