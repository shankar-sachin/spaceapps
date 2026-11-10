import { useEffect, useRef } from 'react';
import { PSI, recordByAcc } from '../data/index.js';
import { tierFor } from '../lib/match.js';
import { TierChip } from './EvidenceList.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
const psiUrl = (acc) => `https://psi.nasa.gov/physci/repo/data/investigations/${acc}`;

function Row({ label, children }) {
  return (
    <>
      <dt className="text-dim">{label}</dt>
      <dd className="min-w-0 break-words">{children ?? <span className="text-dim/70 italic">not in record</span>}</dd>
    </>
  );
}

function Mentions({ label, items }) {
  return (
    <details className="rounded-md border border-line px-3 py-2">
      <summary className="cursor-pointer text-sm">
        {label} <span className="font-mono text-xs text-dim">· {items.length} sentence{items.length === 1 ? '' : 's'}</span>
      </summary>
      {items.length ? (
        <ul className="mt-2 space-y-2">
          {items.map((m, i) => (
            <li key={i} className="border-l-2 border-line pl-2 text-xs text-dim">
              <span className="font-mono text-[10px] uppercase text-flame-soft/80">{m.field}</span>
              <span className="block text-ink/90">“{m.text}”</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-dim">Never mentioned in the record text.</p>
      )}
    </details>
  );
}

export default function DetailDrawer({ accession, preset, onClose, onOpen }) {
  const panelRef = useRef(null);
  const r = accession ? recordByAcc.get(accession) : null;

  useEffect(() => {
    if (!r) return undefined;
    const panel = panelRef.current;
    panel?.querySelector(FOCUSABLE)?.focus();
    panel?.scrollTo(0, 0);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [r, onClose]);

  if (!r) return null;
  const conds = PSI.conditions.filter((c) => c.accession === r.accession);
  const flags = PSI.flags.filter((f) => f.accession === r.accession);
  const linkedFrom = PSI.records.filter((x) => x.related.includes(r.accession)).map((x) => x.accession);
  const links = [...new Set([...r.related, ...linkedFrom])];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" onClick={onClose} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-line bg-panel shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-panel px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="panel-title">{r.accession} · {r.isFlight ? 'flight' : 'ground study'}</p>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold leading-snug">
              {r.acronym && <span className="text-flame-soft">{r.acronym} · </span>}
              {r.title}
            </h2>
            <div className="mt-2">
              <TierChip tierId={tierFor(r, preset)} /> <span className="text-xs text-dim">for {preset.label}</span>
            </div>
          </div>
          <button type="button" className="btn shrink-0" onClick={onClose} aria-label="Close detail drawer">
            Close <span className="ml-1 font-mono text-xs text-dim">esc</span>
          </button>
        </div>

        <div className="space-y-6 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-[7.5rem,1fr] gap-x-3 gap-y-2 text-sm">
            <Row label="Platform">{r.platform}</Row>
            <Row label="Hardware">
              {r.hardware.name && (
                <>
                  {r.hardware.name}
                  {r.hardware.links.map((u, i) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer" className="ml-2 font-mono text-xs text-flame-soft underline">
                      link{r.hardware.links.length > 1 ? ` ${i + 1}` : ''}
                    </a>
                  ))}
                </>
              )}
            </Row>
            <Row label="Sub-area">{r.subArea}</Row>
            <Row label="Dates">{r.start || r.end ? <span className="font-mono">{r.start ?? '?'} → {r.end ?? '?'}</span> : null}</Row>
            <Row label="Released">{r.released && <span className="font-mono">{r.released}</span>}</Row>
            <Row label="Center">{r.center}</Row>
            <Row label="Investigators">{r.surnames && <>{r.surnames} <span className="text-xs text-dim">(surnames, as listed)</span></>}</Row>
            <Row label="PSI record">
              <a href={psiUrl(r.accession)} target="_blank" rel="noreferrer" className="font-mono text-flame-soft underline">
                {r.accession}
              </a>
            </Row>
          </dl>

          <div>
            <h3 className="field-label">Stated test conditions</h3>
            {conds.length ? (
              <ul className="space-y-2">
                {conds.map((c) => (
                  <li key={c.id} className="rounded-lg border border-flame/40 bg-flame/5 p-3 text-sm">
                    <p className="font-mono text-ink">
                      {c.kind === 'point' && `${c.pressurePsia.value} psia · ${c.o2.value}% O2`}
                      {c.kind === 'range' && `${c.pressurePsia.min} to ${c.pressurePsia.max} psia · ${c.o2.min} to ${c.o2.max}% O2`}
                      {c.kind === 'pressure-band' && `${c.pressurePsia.min} to ${c.pressurePsia.max} psia · O2 not stated`}
                      {c.kind === 'o2-below' && `O2 below ${c.o2.below}% · pressure not stated`}
                    </p>
                    {c.converted && <p className="text-[11px] text-dim">converted from {c.pressure.min ?? c.pressure.value}{c.pressure.max ? ` to ${c.pressure.max}` : ''} atm</p>}
                    <blockquote className="mt-2 border-l-2 border-flame pl-2 text-xs italic text-dim">
                      “{c.quote}”
                      <footer className="mt-1 not-italic">
                        {r.accession}, {c.field}{' '}
                        <span className="ml-1 rounded border border-emerald-400/60 px-1 font-mono text-[10px] uppercase text-emerald-300">verbatim, build-checked</span>
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-dim">The record text gives no numeric O2, pressure or flow conditions.</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="field-label">Where the text mentions conditions</h3>
            <Mentions label="Oxygen" items={r.mentions.o2} />
            <Mentions label="Pressure" items={r.mentions.pressure} />
            <Mentions label="Flow" items={r.mentions.flow} />
          </div>

          {r.objectives.length > 0 && (
            <div>
              <h3 className="field-label">Objectives</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-ink/90">
                {r.objectives.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
          )}

          {links.length > 0 && (
            <div>
              <h3 className="field-label">Linked records</h3>
              <div className="flex flex-wrap gap-2">
                {links.map((a) =>
                  recordByAcc.has(a) ? (
                    <button key={a} type="button" className="btn !py-1 text-xs" onClick={() => onOpen(a)}>
                      <span className="font-mono text-dim">{a}</span>&nbsp;{recordByAcc.get(a).acronym ?? 'ground study'}
                    </button>
                  ) : (
                    <span key={a} className="slot font-mono text-xs">{a} (not in export)</span>
                  ),
                )}
              </div>
            </div>
          )}

          {flags.length > 0 && (
            <div>
              <h3 className="field-label">Metadata flags</h3>
              <ul className="space-y-1 text-xs">
                {flags.map((f, i) => (
                  <li key={i} className="text-dim">
                    <span className="font-mono uppercase text-amber">{f.type}:</span> {f.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {r.publications.length > 0 && (
            <details>
              <summary className="field-label cursor-pointer">Publications listed · {r.publications.length}</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-dim">
                {r.publications.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </details>
          )}
        </div>
      </aside>
    </div>
  );
}
