import { PSI, recordByAcc } from '../data/index.js';
import { SectionHeader } from './SectionHeader.jsx';

const S = PSI.stats;
const ground = PSI.records.filter((r) => !r.isFlight);

// Always visible, never collapsible.
export default function GravityStrip() {
  return (
    <section aria-labelledby="gravity-h" className="panel">
      <SectionHeader id="gravity-h" kicker="04 · Gravity" title="Evidence by gravity level" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-panel2/50 p-4">
          <p className="font-mono text-2xl font-semibold">0 g</p>
          <p className="text-xs uppercase tracking-widest text-dim">Microgravity</p>
          <p className="mt-3 font-mono text-3xl text-flame">{S.flight}</p>
          <p className="text-sm text-dim">flight investigations</p>
          <ul className="mt-2 space-y-0.5 text-xs text-dim">
            {Object.entries(S.flightPlatforms).map(([p, n]) => (
              <li key={p}>
                <span className="font-mono text-ink">{n}</span> on {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border-2 border-amber bg-amber-bg p-4 text-amber" role="note">
          <p className="font-mono text-2xl font-semibold">0.165 g</p>
          <p className="text-xs uppercase tracking-widest">Lunar · evidence gap</p>
          <p className="mt-3 font-mono text-3xl">{S.partialGravityPlatform}</p>
          <p className="text-sm">records on a partial-gravity platform</p>
          <p className="mt-3 text-sm font-medium leading-relaxed">No partial-gravity combustion data in PSI. LUCI and FM2 pending.</p>
        </div>
        <div className="rounded-lg border border-line bg-panel2/50 p-4">
          <p className="font-mono text-2xl font-semibold">1 g</p>
          <p className="text-xs uppercase tracking-widest text-dim">Ground studies</p>
          <p className="mt-3 font-mono text-3xl text-ink">{S.ground}</p>
          <p className="text-sm text-dim">ground studies and the records they link to:</p>
          <ul className="mt-2 space-y-0.5 text-xs text-dim">
            {ground.map((g) => (
              <li key={g.accession}>
                <span className="font-mono text-ink">{g.accession}</span> uses{' '}
                {g.related.length
                  ? g.related.map((a) => recordByAcc.get(a)?.acronym ?? a).join(', ')
                  : 'no linked record'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
