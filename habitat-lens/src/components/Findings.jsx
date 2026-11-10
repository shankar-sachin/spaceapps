import { PSI } from '../data/index.js';

const S = PSI.stats;

function Stat({ value, label, tone = 'ink' }) {
  return (
    <div className="rounded-lg border border-line bg-panel2/50 p-3">
      <p className={`font-mono text-3xl font-semibold ${tone === 'flame' ? 'text-flame' : tone === 'amber' ? 'text-amber' : 'text-ink'}`}>{value}</p>
      <p className="mt-1 text-xs leading-snug text-dim">{label}</p>
    </div>
  );
}

export default function Findings() {
  return (
    <section aria-labelledby="findings-h" className="panel">
      <p className="panel-title">What PSI actually holds</p>
      <h2 id="findings-h" className="mt-1 text-lg font-semibold sm:text-xl">
        {S.total} combustion records. None of them store test conditions as data.
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat value={S.flight} label="flight investigations (ISS or Cygnus)" />
        <Stat value={S.ground} label="ground studies that reuse flight data" />
        <Stat value={S.structuredConditionFields} label="O2, pressure or flow fields in the PSI export" tone="amber" />
        <Stat value={S.withNumericConditions} label="records whose text states numeric conditions" tone="flame" />
        <Stat value={S.partialGravityPlatform} label="records on a partial-gravity platform" tone="amber" />
      </div>
      <p className="mt-3 text-xs text-dim">
        Every number above is counted from the PSI export at build time. Conditions come only from quotes in the record
        text, and the build checks that each quote is verbatim ({S.quotesChecked} of {S.quotesChecked} verified).
      </p>
    </section>
  );
}
