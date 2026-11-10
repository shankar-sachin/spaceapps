import { TRUST_METRICS as T } from '../data/placeholders.js';
import { SectionHeader } from './Slot.jsx';

const show = (v) => (v === null ? '--' : v);

export default function TrustPanel() {
  return (
    <section aria-labelledby="trust-h" className="panel">
      <SectionHeader id="trust-h" kicker="06 · Trust" title="How far to trust the SI extraction" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="slot-block !not-italic">
          <p className="slot-tag">data slot · hand-verified sample evaluation</p>
          <p className="mt-1 text-sm text-ink">Extraction accuracy on hand-verified sample</p>
          {/* DATA SLOT: hand-verified sample evaluation -> TRUST_METRICS.extractionAccuracyPct */}
          <p className="mt-1 font-mono text-3xl text-ink">{show(T.extractionAccuracyPct)}%</p>
        </div>
        <div className="slot-block !not-italic">
          <p className="slot-tag">data slot · human verification log</p>
          <p className="mt-1 text-sm text-ink">Quotes verified</p>
          {/* DATA SLOT: human verification log -> TRUST_METRICS.quotesVerified / quotesTotal */}
          <p className="mt-1 font-mono text-3xl text-ink">
            {show(T.quotesVerified)}/{show(T.quotesTotal)}
          </p>
        </div>
      </div>
    </section>
  );
}
