/**
 * Renders a value if present, otherwise a dashed "intentional hole".
 * `label` describes what will go here; `source` names where it comes from.
 */
export function Slot({ value, label, source, mono = false, block = false, className = '' }) {
  const has = value !== null && value !== undefined && value !== '';
  if (has) {
    return <span className={`${mono ? 'font-mono' : ''} ${className}`}>{value}</span>;
  }
  const title = source ? `Data slot: ${label}. Source: ${source}` : `Data slot: ${label}`;
  if (block) {
    return (
      <div className={`slot-block ${className}`} title={title}>
        <span className="slot-tag block">data slot</span>
        <span>{label}</span>
        {source && <span className="mt-1 block text-xs not-italic text-dim/80">from: {source}</span>}
      </div>
    );
  }
  return (
    <span className={`slot ${className}`} title={title} aria-label={title}>
      {label}
    </span>
  );
}

export function SectionHeader({ id, title, kicker, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        {kicker && <p className="panel-title">{kicker}</p>}
        <h2 id={id} className="mt-1 text-lg font-semibold text-ink sm:text-xl">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
