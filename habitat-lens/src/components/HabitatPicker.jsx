import { useId, useState } from 'react';
import { HABITAT_PRESETS, WEIGHT_CRITERIA } from '../data/placeholders.js';
import { SectionHeader, Slot } from './Slot.jsx';

// UI bounds for the airflow slider. These are control limits, not data.
const AIRFLOW_MAX_CMS = 50;

function PresetButton({ preset, active, onSelect }) {
  const tipId = useId();
  return (
    <div className="relative flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(preset)}
        aria-pressed={active}
        className={`btn h-full flex-col items-start gap-1 text-left ${active ? 'btn-primary' : ''}`}
      >
        <span className="font-semibold">{preset.label}</span>
        <span className="font-mono text-xs text-dim">
          {preset.pressurePsia} psia · {preset.o2Percent}% O2
        </span>
        {preset.inlineFlag && (
          <span className="mt-1 rounded border border-amber/60 bg-amber-bg px-1.5 py-0.5 text-[11px] font-medium not-italic text-amber">
            <span className="font-mono uppercase">flag:</span> {preset.inlineFlag}
          </span>
        )}
      </button>
      {/* Source tooltip slot: reachable by hover and keyboard focus */}
      <div className="group relative mt-1 self-start">
        <button
          type="button"
          className="rounded px-1 font-mono text-[11px] uppercase tracking-wider text-dim underline decoration-dotted underline-offset-2 hover:text-flame-soft"
          aria-describedby={tipId}
        >
          source
        </button>
        <div
          id={tipId}
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-60 rounded-md border border-line bg-panel2 p-2 text-xs shadow-xl group-focus-within:block group-hover:block"
        >
          {/* DATA SLOT: NASA atmosphere reference document -> HABITAT_PRESETS[].source {label, url, doi} */}
          {preset.source?.label ? (
            <a href={preset.source.url ?? undefined} className="text-flame-soft underline">
              {preset.source.label}
            </a>
          ) : (
            <Slot label={`Source citation for ${preset.label}`} source="NASA atmosphere reference" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function HabitatPicker({
  habitat,
  setHabitat,
  parsed,
  setParsed,
  weights,
  setWeights,
}) {
  const [description, setDescription] = useState('');
  const [parseNotice, setParseNotice] = useState(false);

  const ppO2 =
    Number.isFinite(habitat.pressurePsia) && Number.isFinite(habitat.o2Percent)
      ? habitat.pressurePsia * (habitat.o2Percent / 100)
      : null;

  const selectPreset = (p) =>
    setHabitat((h) => ({ ...h, presetId: p.id, pressurePsia: p.pressurePsia, o2Percent: p.o2Percent }));

  const setNum = (key) => (e) => {
    const v = e.target.value === '' ? NaN : Number(e.target.value);
    setHabitat((h) => ({ ...h, presetId: null, [key]: v }));
  };

  const activePreset = HABITAT_PRESETS.find((p) => p.id === habitat.presetId);

  return (
    <section aria-labelledby="picker-h" className="panel">
      <SectionHeader id="picker-h" kicker="01 · Input" title="Habitat picker">
        <span className="font-mono text-xs text-dim">
          active: <span className="text-ink">{activePreset ? activePreset.label : 'custom'}</span>
        </span>
      </SectionHeader>

      {/* Presets */}
      <fieldset>
        <legend className="field-label">Presets</legend>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-5">
          {HABITAT_PRESETS.map((p) => (
            <PresetButton key={p.id} preset={p} active={habitat.presetId === p.id} onSelect={selectPreset} />
          ))}
        </div>
      </fieldset>

      {/* Manual inputs */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="in-pressure" className="field-label">Total pressure (psia)</label>
          <input
            id="in-pressure"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            className="field"
            value={Number.isFinite(habitat.pressurePsia) ? habitat.pressurePsia : ''}
            onChange={setNum('pressurePsia')}
          />
        </div>
        <div>
          <label htmlFor="in-o2" className="field-label">O2 (%)</label>
          <input
            id="in-o2"
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            max="100"
            className="field"
            value={Number.isFinite(habitat.o2Percent) ? habitat.o2Percent : ''}
            onChange={setNum('o2Percent')}
          />
        </div>
        <div className="rounded-lg border border-flame/40 bg-flame/5 p-3" aria-live="polite">
          <p className="field-label !text-flame-soft">O2 partial pressure</p>
          <p className="font-mono text-2xl font-semibold text-ink">
            {ppO2 !== null ? ppO2.toFixed(2) : '—'} <span className="text-sm text-dim">psia</span>
          </p>
          <p className="font-mono text-[11px] text-dim">= total pressure × O2 fraction</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor="in-flow" className="field-label">
            Airflow (cm/s) <span className="ml-1 rounded border border-amber/50 px-1 normal-case tracking-normal text-amber">assumed by you</span>
          </label>
          <span className="font-mono text-sm">
            {habitat.airflowCms === null ? <span className="text-dim">not set</span> : `${habitat.airflowCms} cm/s`}
          </span>
        </div>
        <input
          id="in-flow"
          type="range"
          min="0"
          max={AIRFLOW_MAX_CMS}
          step="1"
          className="w-full"
          value={habitat.airflowCms ?? 0}
          aria-valuetext={habitat.airflowCms === null ? 'not set' : `${habitat.airflowCms} centimeters per second`}
          onChange={(e) => setHabitat((h) => ({ ...h, airflowCms: Number(e.target.value) }))}
        />
      </div>

      {/* SI describe-your-habitat */}
      <div className="mt-6 border-t border-line pt-5">
        <label htmlFor="in-describe" className="field-label">Describe your habitat</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <textarea
            id="in-describe"
            rows={2}
            className="field font-sans"
            placeholder="e.g. a lunar surface module with low cabin airflow and fabric stowage"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="button" className="btn btn-primary sm:self-start" onClick={() => setParseNotice(true)}>
            Parse
          </button>
        </div>
        {parseNotice && (
          <p className="mt-2 text-xs text-amber" role="status">
            The super intelligence (SI) parser is not connected yet. Fill the chips below by hand.
          </p>
        )}
        {/* DATA SLOT: SI parser output -> ParsedHabitat {atmosphere, airflow, fuelCategory} */}
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Parsed habitat (editable)">
          {[
            ['atmosphere', 'Atmosphere'],
            ['airflow', 'Airflow'],
            ['fuelCategory', 'Fuel category'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1 rounded-full border border-dashed border-dim/60 bg-panel2/40 py-1 pl-3 pr-1">
              <label htmlFor={`chip-${key}`} className="font-mono text-[10px] uppercase tracking-widest text-flame-soft/80">
                {label}
              </label>
              <input
                id={`chip-${key}`}
                className="w-32 rounded-full bg-transparent px-2 py-0.5 text-sm text-ink placeholder:italic placeholder:text-dim/70 focus:bg-void focus:outline-none sm:w-40"
                placeholder="SI slot"
                value={parsed[key] ?? ''}
                onChange={(e) => setParsed((p) => ({ ...p, [key]: e.target.value || null }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Weights: visual only */}
      <fieldset className="mt-6 border-t border-line pt-5">
        <legend className="field-label">Criteria weights</legend>
        <p className="mb-3 text-xs text-dim">
          Visual only for now. Ranking engine not connected, so these compute nothing.
        </p>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
          {WEIGHT_CRITERIA.map((c) => (
            <div key={c.key}>
              <label htmlFor={`w-${c.key}`} className="flex items-center gap-2 text-sm">
                <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-sm ${c.colorClass}`} />
                {c.label}
              </label>
              <input
                id={`w-${c.key}`}
                type="range"
                min="0"
                max="100"
                className="w-full"
                value={weights[c.key]}
                aria-valuetext={weights[c.key] < 34 ? 'low' : weights[c.key] < 67 ? 'medium' : 'high'}
                onChange={(e) => setWeights((w) => ({ ...w, [c.key]: Number(e.target.value) }))}
              />
              <div className="flex justify-between font-mono text-[10px] uppercase text-dim">
                <span>low</span>
                <span>high</span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
