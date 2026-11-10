import { useEffect, useRef } from 'react';
import { Slot } from './Slot.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function RangeRow({ label, range, unit, source }) {
  const has = range.min !== null && range.max !== null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line/60 py-2 last:border-0">
      <dt className="text-sm text-dim">{label}</dt>
      <dd className="font-mono text-sm">
        {!range.reported ? (
          <span className="text-dim">not reported</span>
        ) : has ? (
          `${range.min} to ${range.max} ${range.unit ?? unit}`
        ) : (
          <Slot label={`min to max ${unit}`} source={source} />
        )}
      </dd>
    </div>
  );
}

export default function DetailDrawer({ investigation: inv, onClose }) {
  const panelRef = useRef(null);
  const open = Boolean(inv);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    panel?.querySelector(FOCUSABLE)?.focus();
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const verified = inv.quote.verified;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" onClick={onClose} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-line bg-panel shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-panel px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="panel-title">Investigation detail</p>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">
              {/* DATA SLOT: PSI JSON (build-time cache) -> investigation title */}
              <Slot value={inv.name} label="Investigation title" source="PSI JSON" />
            </h2>
          </div>
          <button type="button" className="btn shrink-0" onClick={onClose} aria-label="Close detail drawer">
            Close <span className="ml-1 font-mono text-xs text-dim">esc</span>
          </button>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-dim">DOI</dt>
            <dd className="font-mono">
              {/* DATA SLOT: PSI JSON (build-time cache) -> publication DOI */}
              {inv.doi ? (
                <a className="text-flame-soft underline" href={`https://doi.org/${inv.doi}`}>{inv.doi}</a>
              ) : (
                <Slot label="DOI" source="PSI JSON" />
              )}
            </dd>
            <dt className="text-dim">Hardware</dt>
            <dd>
              {/* DATA SLOT: PSI JSON (build-time cache) -> hardware / facility */}
              <Slot value={inv.hardware} label="Hardware" source="PSI JSON" />
            </dd>
          </dl>

          <div>
            <h3 className="field-label">Objective</h3>
            {/* DATA SLOT: PSI JSON (build-time cache) -> objective */}
            <Slot value={inv.objective} label="Investigation objective" source="PSI JSON" block />
          </div>

          <div>
            <h3 className="field-label">Tested ranges</h3>
            <dl className="rounded-lg border border-line px-3">
              {/* DATA SLOT: PSI JSON + SI extraction -> tested.o2 / tested.pressure / tested.flow */}
              <RangeRow label="O2" range={inv.tested.o2} unit="%" source="PSI JSON + SI extraction" />
              <RangeRow label="Pressure" range={inv.tested.pressure} unit="psia" source="PSI JSON + SI extraction" />
              <RangeRow label="Flow" range={inv.tested.flow} unit="cm/s" source="PSI JSON + SI extraction" />
            </dl>
          </div>

          <div className="rounded-lg border border-flame/40 bg-flame/5 p-3">
            <h3 className="mb-2 text-sm font-semibold text-flame-soft">Why this ranks here (SI explanation)</h3>
            {/* DATA SLOT: SI explanation generator -> siExplanation */}
            <Slot value={inv.siExplanation} label="Super intelligence (SI) ranking explanation" source="SI explanation generator" block />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="field-label !mb-0">Source quote</h3>
              {/* DATA SLOT: human verification log -> quote.verified */}
              {verified === null ? (
                <span className="slot !py-0 font-mono text-[10px] uppercase not-italic">verified / unverified</span>
              ) : (
                <span
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                    verified ? 'border-emerald-400/60 text-emerald-300' : 'border-amber/60 text-amber'
                  }`}
                >
                  {verified ? 'verified' : 'unverified'}
                </span>
              )}
            </div>
            <blockquote className="border-l-2 border-flame pl-3">
              {/* DATA SLOT: source document -> quote.text, quote.location */}
              <Slot value={inv.quote.text} label="Verbatim quote from source document" source="source document via PSI" block />
              <footer className="mt-2 text-xs text-dim">
                Location: <Slot value={inv.quote.location} label="page / section" />
              </footer>
            </blockquote>
          </div>
        </div>
      </aside>
    </div>
  );
}
