import { WEIGHT_CRITERIA } from '../data/placeholders.js';

/**
 * Stacked score bar. When every sub-score is null it renders five equal,
 * dashed, empty segments so the shape is visible without implying values.
 */
export default function ScoreBar({ subScores }) {
  const allEmpty = WEIGHT_CRITERIA.every((c) => subScores[c.key] === null);
  return (
    <div
      className="flex h-4 w-36 gap-0.5 sm:w-44"
      role="img"
      aria-label={allEmpty ? 'Score not computed: five empty sub-score slots' : 'Stacked sub-scores'}
    >
      {/* DATA SLOT: ranking engine -> Investigation.subScores {o2, pressure, flow, solidFuel, smoke} */}
      {WEIGHT_CRITERIA.map((c) => {
        const v = subScores[c.key];
        return v === null ? (
          <span
            key={c.key}
            title={`${c.label}: data slot`}
            className="flex-1 rounded-sm border border-dashed border-dim/50 bg-panel2/30"
          />
        ) : (
          <span key={c.key} title={c.label} className={`${c.colorClass} rounded-sm`} style={{ flexGrow: v }} />
        );
      })}
    </div>
  );
}
