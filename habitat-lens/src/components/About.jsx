import { SectionHeader } from './Slot.jsx';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="panel scroll-mt-4">
      <SectionHeader id="about-h" kicker="About" title="What Habitat Lens does" />
      <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-dim">
        <p>
          Built for the 2026 NASA Space Apps Challenge, <span className="text-ink">Flame in Freefall</span>.
          Pick a crew-habitat atmosphere and Habitat Lens will rank NASA microgravity combustion
          investigations by how close their tested conditions are to it.
        </p>
        <p>
          It flags results that rely on extrapolation, and shows where no evidence exists at all.
          A super intelligence (SI) helps parse habitat descriptions, extract tested ranges, and
          explain rankings. Every SI output is labeled and checked against source quotes.
        </p>
        <p className="text-amber">
          This build is a base layout. Every dashed outline is a slot waiting for real data.
        </p>
      </div>
    </section>
  );
}
