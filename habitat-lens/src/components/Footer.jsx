import { REFERENCES } from '../data/placeholders.js';
import { Slot } from './Slot.jsx';

export default function Footer() {
  return (
    <footer id="sources" className="mt-10 scroll-mt-4 border-t border-line bg-panel/60">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="panel-title">References</h2>
        <p className="mt-1 text-xs text-dim">Every dataset and super intelligence (SI) tool used.</p>
        <ol className="mt-3 space-y-2">
          {/* DATA SLOT: project bibliography -> REFERENCES[] {kind, citation, url} */}
          {REFERENCES.map((r) => (
            <li key={r.slotId} className="flex flex-wrap items-center gap-2 text-sm">
              <Slot value={r.kind} label="kind" />
              {r.citation ? (
                <a href={r.url ?? undefined} className="text-flame-soft underline">{r.citation}</a>
              ) : (
                <Slot label="Citation (dataset or SI tool)" source="project bibliography" />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-line pt-4 font-mono text-sm uppercase tracking-widest text-flame-soft">
          Triage aid, not a safety verdict.
        </p>
      </div>
    </footer>
  );
}
