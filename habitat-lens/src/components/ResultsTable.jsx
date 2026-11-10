import { RANKED_INVESTIGATIONS, WEIGHT_CRITERIA } from '../data/placeholders.js';
import { Badge, BadgeLegend } from './Badges.jsx';
import ScoreBar from './ScoreBar.jsx';
import { SectionHeader, Slot } from './Slot.jsx';

const COLS = ['Rank', 'Investigation', 'Hardware', 'Fuel type', 'Score', 'Badges', 'DOI'];

export default function ResultsTable({ onOpen }) {
  return (
    <section aria-labelledby="results-h" className="panel">
      <SectionHeader id="results-h" kicker="02 · Output" title="Ranked investigations">
        <BadgeLegend />
      </SectionHeader>

      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dim" aria-label="Score segment legend">
        {WEIGHT_CRITERIA.map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={`h-2 w-2 rounded-sm ${c.colorClass}`} />
            {c.label}
          </span>
        ))}
      </div>

      {/* Table scrolls inside its own box on narrow screens; the page never scrolls sideways. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[820px] border-separate border-spacing-y-1 text-sm">
          <caption className="sr-only">
            Investigations ranked by closeness to the selected habitat. Select a row to open details.
          </caption>
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-dim">
              {COLS.map((c) => (
                <th key={c} scope="col" className="px-2 py-1 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* DATA SLOT: PSI JSON (build-time cache) + ranking engine -> RANKED_INVESTIGATIONS[] */}
            {RANKED_INVESTIGATIONS.map((inv) => (
              <tr
                key={inv.rowId}
                tabIndex={0}
                aria-label={`Open details for ${inv.name ?? 'unfilled investigation slot'}`}
                onClick={(e) => onOpen(inv, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpen(inv, e.currentTarget);
                  }
                }}
                className="cursor-pointer bg-panel2/50 transition hover:bg-panel2 focus-visible:bg-panel2"
              >
                <td className="rounded-l-md px-2 py-2.5 font-mono">
                  <Slot value={inv.rank} label="—" mono />
                </td>
                <td className="px-2 py-2.5">
                  <Slot value={inv.name} label="Investigation name" source="PSI JSON" />
                </td>
                <td className="px-2 py-2.5">
                  <Slot value={inv.hardware} label="Hardware" source="PSI JSON" />
                </td>
                <td className="px-2 py-2.5">
                  <Slot value={inv.fuelType} label="Fuel" source="PSI JSON + SI extraction" />
                </td>
                <td className="px-2 py-2.5">
                  <ScoreBar subScores={inv.subScores} />
                </td>
                <td className="px-2 py-2.5">
                  {inv.badges?.length ? (
                    <span className="flex flex-wrap gap-1">
                      {inv.badges.map((b) => <Badge key={b} type={b} />)}
                    </span>
                  ) : (
                    <Slot label="—" source="ranking engine + metadata audit" />
                  )}
                </td>
                <td className="rounded-r-md px-2 py-2.5 font-mono">
                  {inv.doi ? (
                    <a
                      href={`https://doi.org/${inv.doi}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-flame-soft underline"
                    >
                      {inv.doi}
                    </a>
                  ) : (
                    <Slot label="DOI" source="PSI JSON" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
