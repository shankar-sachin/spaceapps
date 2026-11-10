import { PSI } from '../data/index.js';
import { SectionHeader } from './SectionHeader.jsx';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="panel scroll-mt-4">
      <SectionHeader id="about-h" kicker="About" title="What Habitat Lens does" />
      <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-dim">
        <p>
          Built for the 2026 NASA Space Apps Challenge, <span className="text-ink">Flame in Freefall</span>. Pick a crew-habitat
          atmosphere and see which of the {PSI.stats.total} NASA Physical Sciences Informatics (PSI) combustion records actually
          tested something like it.
        </p>
        <p>
          PSI stores no test conditions as data, so Habitat Lens never scores or guesses. It only shows conditions that a record
          states in its own words, each with the quote it came from. Anything not stated stays empty, and that emptiness is the result.
        </p>
      </div>
    </section>
  );
}
