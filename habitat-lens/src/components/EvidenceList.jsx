import { useMemo } from 'react';
import { PSI } from '../data/index.js';
import { TIERS, rankRecords } from '../lib/match.js';
import { SectionHeader } from './SectionHeader.jsx';

const TONE = {
  flame: 'border-flame text-flame bg-flame/10',
  'flame-soft': 'border-flame-soft/70 text-flame-soft bg-flame/5',
  amber: 'border-amber/60 text-amber bg-amber-bg',
  dim: 'border-line text-dim bg-panel2',
};

export function TierChip({ tierId }) {
  const t = TIERS.find((x) => x.id === tierId);
  return (
    <span title={t.help} className={`inline-flex whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TONE[t.tone]}`}>
      {t.label}
    </span>
  );
}

function MentionDots({ mentions }) {
  return (
    <span className="flex gap-1" aria-label="Conditions mentioned in record text">
      {[
        ['o2', 'O2'],
        ['pressure', 'P'],
        ['flow', 'flow'],
      ].map(([k, lab]) => {
        const on = mentions[k].length > 0;
        return (
          <span
            key={k}
            title={`${lab}: ${on ? `mentioned in ${mentions[k].length} sentence(s)` : 'not mentioned'}`}
            className={`rounded px-1 font-mono text-[10px] ${on ? 'bg-ink/10 text-ink' : 'text-dim/50 line-through'}`}
          >
            {lab}
          </span>
        );
      })}
    </span>
  );
}

export default function EvidenceList({ preset, onOpen }) {
  const ranked = useMemo(() => rankRecords(preset), [preset]);
  const groups = TIERS.map((t) => ({ tier: t, items: ranked.filter((x) => x.tier === t.id) })).filter((g) => g.items.length);

  return (
    <section aria-labelledby="evidence-h" className="panel">
      <SectionHeader id="evidence-h" kicker="02 · Evidence" title={`PSI records vs ${preset.label}`} />
      <p className="-mt-2 mb-4 max-w-3xl text-sm text-dim">
        Grouped by what the record text states, not by a similarity score. Flight investigations come before ground studies
        in each group. Struck-through tags mean the text never mentions that condition.
      </p>
      <div className="space-y-5">
        {groups.map(({ tier, items }) => (
          <div key={tier.id}>
            <h3 className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <TierChip tierId={tier.id} />
              <span className="font-mono text-xs text-dim">{items.length} of {PSI.stats.total}</span>
              <span className="text-xs text-dim">{tier.help}</span>
            </h3>
            <ul className="space-y-1">
              {items.map(({ record: r }) => (
                <li key={r.accession}>
                  <button
                    type="button"
                    onClick={(e) => onOpen(r.accession, e.currentTarget)}
                    className="grid w-full grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 rounded-md bg-panel2/50 px-3 py-2 text-left transition hover:bg-panel2 sm:grid-cols-[5.5rem,1fr,auto,auto]"
                  >
                    <span className="font-mono text-xs text-dim">{r.accession}</span>
                    <span className="min-w-0">
                      {r.acronym ? (
                        <>
                          <span className="font-semibold text-ink">{r.acronym}</span>
                          <span className="block truncate text-xs text-dim sm:inline sm:before:content-['_·_']">{r.title}</span>
                        </>
                      ) : (
                        <span className="line-clamp-2 text-sm text-ink">{r.title}</span>
                      )}
                    </span>
                    <span className="col-start-2 text-xs text-dim sm:col-start-auto">
                      {r.isFlight ? r.platform?.replace(' (ISS)', '') ?? 'platform not stated' : 'Ground study'}
                    </span>
                    <span className="col-start-2 sm:col-start-auto">
                      <MentionDots mentions={r.mentions} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
