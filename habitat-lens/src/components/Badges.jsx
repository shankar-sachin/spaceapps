import { BADGE_TYPES } from '../data/placeholders.js';

const TONES = {
  amber: 'border-amber/60 text-amber bg-amber-bg',
  dim: 'border-dim/60 text-dim bg-panel2',
  sky: 'border-sky-400/60 text-sky-300 bg-sky-950/40',
};

export function Badge({ type }) {
  const def = BADGE_TYPES.find((b) => b.type === type);
  if (!def) return null;
  return (
    <span className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TONES[def.tone]}`}>
      {def.label}
    </span>
  );
}

export function BadgeLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Badge legend">
      <li className="font-mono text-[10px] uppercase tracking-widest text-dim">badges:</li>
      {BADGE_TYPES.map((b) => (
        <li key={b.type}>
          <Badge type={b.type} />
        </li>
      ))}
    </ul>
  );
}
