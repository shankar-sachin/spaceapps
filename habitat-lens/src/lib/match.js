import { PSI } from '../data/index.js';

/**
 * How a record's STATED conditions relate to a habitat. No scores, no weights:
 * each tier is a plain yes/no test against numbers copied from the record text.
 */
export const TIERS = [
  { id: 'exact', label: 'Tested at this atmosphere', tone: 'flame', help: 'Record text names this exact pressure and O2.' },
  { id: 'inside', label: 'Inside stated range', tone: 'flame-soft', help: 'Inside the stated pressure and O2 span. Not every point in a span was necessarily run.' },
  { id: 'pressure-only', label: 'Pressure in range, O2 not stated', tone: 'amber', help: 'Pressure is inside a stated band, but the record gives no O2 numbers.' },
  { id: 'o2-only', label: 'O2 in range, pressure not stated', tone: 'amber', help: 'O2 is inside a stated limit, but the record gives no pressure numbers.' },
  { id: 'outside', label: 'Stated conditions exclude it', tone: 'dim', help: 'The record states numbers, and this habitat is outside them.' },
  { id: 'described', label: 'Conditions described, no numbers', tone: 'dim', help: 'Text mentions O2, pressure or flow, but gives no usable numbers.' },
  { id: 'none', label: 'No conditions in record', tone: 'dim', help: 'Record text never mentions O2, pressure or flow.' },
];
const ORDER = Object.fromEntries(TIERS.map((t, i) => [t.id, i]));

const within = (v, lo, hi) => v >= lo - 1e-9 && v <= hi + 1e-9;

function conditionCovers(c, h) {
  const p = c.pressurePsia;
  if (c.kind === 'point') {
    return Math.abs(p.value - h.pressurePsia) < 0.05 && Math.abs(c.o2.value - h.o2Percent) < 0.05 ? 'exact' : 'outside';
  }
  if (c.kind === 'range') {
    return within(h.pressurePsia, p.min, p.max) && within(h.o2Percent, c.o2.min, c.o2.max) ? 'inside' : 'outside';
  }
  if (c.kind === 'pressure-band') return within(h.pressurePsia, p.min, p.max) ? 'pressure-only' : 'outside';
  if (c.kind === 'o2-below') return h.o2Percent < c.o2.below ? 'o2-only' : 'outside';
  return 'outside';
}

export function tierFor(record, habitat) {
  const conds = PSI.conditions.filter((c) => c.accession === record.accession);
  if (conds.length) {
    const tiers = conds.map((c) => conditionCovers(c, habitat));
    return tiers.sort((a, b) => ORDER[a] - ORDER[b])[0];
  }
  const m = record.mentions;
  return m.o2.length || m.pressure.length || m.flow.length ? 'described' : 'none';
}

export function rankRecords(habitat) {
  return PSI.records
    .map((r) => ({ record: r, tier: tierFor(r, habitat) }))
    .sort(
      (a, b) =>
        ORDER[a.tier] - ORDER[b.tier] ||
        Number(b.record.isFlight) - Number(a.record.isFlight) ||
        a.record.accession.localeCompare(b.record.accession, 'en', { numeric: true }),
    );
}
