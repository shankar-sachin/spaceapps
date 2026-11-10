import { GRAVITY_COLUMNS } from '../data/placeholders.js';
import { SectionHeader, Slot } from './Slot.jsx';

// Always visible, never collapsible. Do not wrap this in a <details> or toggle.
export default function GravityStrip() {
  return (
    <section aria-labelledby="gravity-h" className="panel">
      <SectionHeader id="gravity-h" kicker="04 · Gravity" title="Evidence by gravity level" />
      <div className="grid gap-3 md:grid-cols-3">
        {GRAVITY_COLUMNS.map((col) =>
          col.kind === 'gap' ? (
            <div
              key={col.id}
              className="rounded-lg border-2 border-amber bg-amber-bg p-4 text-amber"
              role="note"
              aria-label={`${col.label} ${col.gLabel}: evidence gap`}
            >
              <p className="font-mono text-2xl font-semibold">{col.gLabel}</p>
              <p className="text-xs uppercase tracking-widest">{col.label} · evidence gap</p>
              <p className="mt-3 text-sm font-medium leading-relaxed">{col.fixedMessage}</p>
            </div>
          ) : (
            <div key={col.id} className="rounded-lg border border-line bg-panel2/50 p-4">
              <p className="font-mono text-2xl font-semibold text-ink">{col.gLabel}</p>
              <p className="text-xs uppercase tracking-widest text-dim">{col.label}</p>
              <div className="mt-3 space-y-2">
                {/* DATA SLOT: see GRAVITY_COLUMNS[].investigationCount source in placeholders.js */}
                <p className="text-sm text-dim">
                  Investigations:{' '}
                  <Slot value={col.investigationCount} label="--" mono source={col.id === 'zero-g' ? 'PSI JSON' : '1 g reference dataset'} />
                </p>
                {/* DATA SLOT: see GRAVITY_COLUMNS[].summary source in placeholders.js */}
                <Slot
                  value={col.summary}
                  block
                  label={`${col.gLabel} evidence summary`}
                  source={col.id === 'zero-g' ? 'PSI JSON (build-time cache)' : '1 g ground-test literature'}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
