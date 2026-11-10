export function SectionHeader({ id, title, kicker, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && <p className="panel-title">{kicker}</p>}
        <h2 id={id} className="mt-1 text-lg font-semibold text-ink sm:text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
