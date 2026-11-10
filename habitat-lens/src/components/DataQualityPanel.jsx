import { DATA_QUALITY_FLAGS } from '../data/placeholders.js';
import { SectionHeader, Slot } from './Slot.jsx';

const SEV = {
  low: 'border-dim/60 text-dim',
  medium: 'border-amber/60 text-amber',
  high: 'border-red-400/70 text-red-300',
};

export default function DataQualityPanel() {
  return (
    <section aria-labelledby="dq-h" className="panel">
      <SectionHeader id="dq-h" kicker="05 · Data quality" title="Data quality flags" />
      <ul className="space-y-2">
        {/* DATA SLOT: metadata audit of PSI cache -> DATA_QUALITY_FLAGS[] {flagType, severity, detail} */}
        {DATA_QUALITY_FLAGS.map((f) => (
          <li key={f.slotId} className="flex flex-wrap items-center gap-2 rounded-md bg-panel2/50 px-3 py-2">
            <Slot value={f.flagType} label="Flag type" source="metadata audit" />
            {f.severity ? (
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${SEV[f.severity]}`}>
                {f.severity}
              </span>
            ) : (
              <span className="slot rounded-full font-mono text-[10px] uppercase not-italic">severity</span>
            )}
            <span className="min-w-0 flex-1 text-sm">
              <Slot value={f.detail} label="Detail" source="metadata audit" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
