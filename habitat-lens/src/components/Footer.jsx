import { PSI } from '../data/index.js';

export default function Footer() {
  return (
    <footer id="sources" className="mt-10 scroll-mt-4 border-t border-line bg-panel/60">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="panel-title">References</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-dim">
          <li>
            NASA Physical Sciences Informatics (PSI), combustion science investigation records, CSV export ({PSI.stats.total} records).{' '}
            <a className="text-flame-soft underline" href="https://psi.nasa.gov/physci/repo/search?q=&data_source=psi&data_type=investigation">
              psi.nasa.gov
            </a>
          </li>
          <li>
            NASA, “PSI Investigations by Research Area: Combustion Science.”{' '}
            <a className="text-flame-soft underline" href="https://www.nasa.gov/physical-sciences-informatics-psi/psi-investigations-by-research-area/">
              nasa.gov
            </a>
          </li>
          <li>Habitat presets: project brief. Three of them are also named in PSI-20 (ACME BRE), Objectives.</li>
        </ol>
        <p className="mt-8 border-t border-line pt-4 font-mono text-sm uppercase tracking-widest text-flame-soft">
          Triage aid, not a safety verdict.
        </p>
      </div>
    </footer>
  );
}
