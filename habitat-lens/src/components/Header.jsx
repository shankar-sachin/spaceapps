export default function Header() {
  return (
    <header className="border-b border-line/70 bg-void/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <a href="#top" className="flex items-center gap-2 text-ink">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full bg-flame shadow-[0_0_14px_3px_rgba(255,122,26,0.55)]" />
            <span className="font-mono text-lg font-semibold uppercase tracking-[0.2em]">
              Habitat<span className="text-flame">Lens</span>
            </span>
          </a>
          <p className="mt-1 text-sm text-dim">What NASA's microgravity fire experiments actually tested, next to the air your crew breathes.</p>
        </div>
        <nav aria-label="Primary" className="flex gap-1 text-sm">
          <a className="btn" href="#about">About</a>
          <a className="btn" href="#sources">Sources</a>
        </nav>
      </div>
    </header>
  );
}
