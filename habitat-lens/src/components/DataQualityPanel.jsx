import { PSI, recordByAcc } from '../data/index.js';
import { SectionHeader } from './SectionHeader.jsx';

const SEV = {
  conflict: 'border-red-400/70 text-red-300',
  missing: 'border-amber/60 text-amber',
  minor: 'border-dim/60 text-dim',
};

export default function DataQualityPanel({ onOpen }) {
  const counts = PSI.flags.reduce((a, f) => ({ ...a, [f.severity]: (a[f.severity] ?? 0) + 1 }), {});
  return (
    <section aria-labelledby="dq-h" className="panel">
      <SectionHeader id="dq-h" kicker="05 · Data quality" title="Problems in the PSI metadata">
        <span className="font-mono text-xs text-dim">
          {counts.conflict ?? 0} conflict · {counts.missing ?? 0} missing · {counts.minor ?? 0} minor
        </span>
      </SectionHeader>
      <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
        {PSI.flags.map((f, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={(e) => onOpen(f.accession, e.currentTarget)}
              className="flex w-full flex-wrap items-center gap-2 rounded-md bg-panel2/50 px-3 py-2 text-left text-sm hover:bg-panel2"
            >
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${SEV[f.severity]}`}>{f.severity}</span>
              <span className="font-mono text-xs text-dim">{f.accession}</span>
              <span className="font-medium">{recordByAcc.get(f.accession)?.acronym ?? ''}</span>
              <span className="text-xs uppercase tracking-wider text-flame-soft">{f.type}</span>
              <span className="w-full text-xs text-dim">{f.detail}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
