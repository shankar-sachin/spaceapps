import { useId } from 'react';
import { HABITAT_PRESETS, presetSources, recordByAcc } from '../data/index.js';
import { SectionHeader } from './SectionHeader.jsx';

function PresetButton({ preset, active, onSelect }) {
  const tipId = useId();
  const sources = presetSources(preset);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(preset.id)}
        aria-pressed={active}
        className={`btn h-full flex-col items-start gap-1 text-left ${active ? 'btn-primary' : ''}`}
      >
        <span className="font-semibold">{preset.label}</span>
        <span className="font-mono text-xs text-dim">
          {preset.pressurePsia} psia · {preset.o2Percent}% O2
        </span>
        {preset.inlineFlag && (
          <span className="mt-1 rounded border border-amber/60 bg-amber-bg px-1.5 py-0.5 text-[11px] font-medium text-amber">
            <span className="font-mono uppercase">flag:</span> {preset.inlineFlag}
          </span>
        )}
      </button>
      <div className="group relative mt-1 self-start">
        <button
          type="button"
          aria-describedby={tipId}
          className={`rounded px-1 font-mono text-[11px] uppercase tracking-wider underline decoration-dotted underline-offset-2 hover:text-flame-soft ${
            sources.length ? 'text-dim' : 'text-amber'
          }`}
        >
          {sources.length ? 'source' : 'no PSI source'}
        </button>
        <div
          id={tipId}
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-64 rounded-md border border-line bg-panel2 p-2 text-xs shadow-xl group-focus-within:block group-hover:block"
        >
          {sources.length ? (
            <>
              <p className="text-dim">
                Named in {sources[0].accession} ({recordByAcc.get(sources[0].accession)?.acronym}), {sources[0].field}:
              </p>
              <p className="mt-1 italic text-ink">“{sources[0].quote}”</p>
            </>
          ) : (
            <p className="text-amber">No PSI record names this atmosphere. Source needed.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HabitatPicker({ preset, onSelect }) {
  const ppO2 = preset.pressurePsia * (preset.o2Percent / 100);
  return (
    <section aria-labelledby="picker-h" className="panel">
      <SectionHeader id="picker-h" kicker="01 · Pick a habitat" title="Which atmosphere is your crew breathing?">
        <div className="rounded-lg border border-flame/40 bg-flame/5 px-3 py-2" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-widest text-flame-soft">O2 partial pressure</p>
          <p className="font-mono text-xl font-semibold">
            {ppO2.toFixed(2)} <span className="text-sm text-dim">psia</span>
          </p>
        </div>
      </SectionHeader>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Habitat presets">
        {HABITAT_PRESETS.map((p) => (
          <PresetButton key={p.id} preset={p} active={p.id === preset.id} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
