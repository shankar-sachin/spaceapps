import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import { HABITAT_PRESETS, PSI, recordByAcc } from '../data/index.js';
import { SectionHeader } from './SectionHeader.jsx';

const C = { ink: '#ece7df', dim: '#a39d94', line: '#2a313a', flame: '#ff7a1a', soft: '#ffa463', amber: '#f2b233', sky: '#7dd3fc', panel: '#11151a' };
const Y_RANGE_PSIA = [3, 50]; // view framing only; log scale so habitat and test pressures both fit

const nameOf = (acc) => `${recordByAcc.get(acc)?.acronym ?? acc} (${acc})`;

function conditionTraces() {
  const traces = [];
  for (const c of PSI.conditions) {
    const p = c.pressurePsia;
    const src = `${c.field}: “${c.quote}”`.replace(/(.{70}\S*)\s/g, '$1<br>');
    if (c.kind === 'range') {
      traces.push({
        type: 'scatter', mode: 'lines', fill: 'toself', name: `${nameOf(c.accession)} stated span`,
        x: [c.o2.min, c.o2.max, c.o2.max, c.o2.min, c.o2.min],
        y: [p.min, p.min, p.max, p.max, p.min],
        line: { color: C.soft, width: 1.5 }, fillcolor: 'rgba(255,164,99,0.14)',
        hovertemplate: `${nameOf(c.accession)}<br>${c.o2.min} to ${c.o2.max}% O2 · ${p.min} to ${p.max} psia<br><br>${src}<extra></extra>`,
      });
    } else if (c.kind === 'pressure-band') {
      traces.push({
        type: 'scatter', mode: 'lines', fill: 'toself', name: `${nameOf(c.accession)} pressure only`,
        x: [0, 100, 100, 0, 0], y: [p.min, p.min, p.max, p.max, p.min],
        line: { color: C.amber, width: 1, dash: 'dot' }, fillcolor: 'rgba(242,178,51,0.06)',
        hovertemplate: `${nameOf(c.accession)}<br>${p.min} to ${p.max} psia, O2 not stated<br><br>${src}<extra></extra>`,
      });
    }
  }
  const pts = PSI.conditions.filter((c) => c.kind === 'point');
  if (pts.length) {
    traces.push({
      type: 'scatter', mode: 'markers', name: `${nameOf(pts[0].accession)} named atmospheres`,
      x: pts.map((c) => c.o2.value), y: pts.map((c) => c.pressurePsia.value),
      marker: { symbol: 'circle-open', size: 16, color: C.sky, line: { width: 2 } },
      hovertemplate: pts.map((c) => `${nameOf(c.accession)}<br>%{x}% O2 · %{y} psia<br><br>${c.field}: “${c.quote}”`.replace(/(.{70}\S*)\s/g, '$1<br>') + '<extra></extra>'),
    });
  }
  return traces;
}

export default function CoverageChart({ preset }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const others = HABITAT_PRESETS.filter((p) => p.id !== preset.id);
    const data = [
      ...conditionTraces(),
      {
        type: 'scatter', mode: 'markers', name: 'Other presets', showlegend: false,
        x: others.map((p) => p.o2Percent), y: others.map((p) => p.pressurePsia), text: others.map((p) => p.label),
        marker: { symbol: 'diamond-open', size: 9, color: C.dim },
        hovertemplate: '%{text}<br>%{x}% O2 · %{y} psia<extra></extra>',
      },
      {
        type: 'scatter', mode: 'markers+text', name: preset.label,
        x: [preset.o2Percent], y: [preset.pressurePsia], text: [preset.label], textposition: 'bottom center',
        textfont: { color: C.ink, size: 12 },
        marker: { symbol: 'star', size: 20, color: C.flame, line: { color: '#ffd2ad', width: 1 } },
        hovertemplate: `${preset.label}<br>%{x}% O2 · %{y} psia<extra></extra>`,
      },
    ];
    const axisBase = { gridcolor: C.line, zerolinecolor: C.line, linecolor: C.line, tickfont: { family: 'IBM Plex Mono, monospace', color: C.dim, size: 11 }, fixedrange: true };
    Plotly.react(
      el,
      data,
      {
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: C.panel, font: { color: C.ink, family: 'IBM Plex Sans, sans-serif' },
        margin: { l: 56, r: 12, t: 8, b: 48 },
        xaxis: { ...axisBase, title: { text: 'O2 (%)', font: { color: C.dim, size: 12 } }, range: [0, 102] },
        yaxis: {
          ...axisBase, type: 'log', title: { text: 'Total pressure (psia, log)', font: { color: C.dim, size: 12 } },
          range: Y_RANGE_PSIA.map(Math.log10), tickvals: [3, 4, 5, 7, 10, 15, 20, 30, 50],
        },
        legend: { orientation: 'h', x: 0, y: -0.2, yanchor: 'top', font: { size: 11, color: C.dim } },
        hoverlabel: { bgcolor: '#171c22', bordercolor: C.line, font: { color: C.ink, size: 11 } },
      },
      { displayModeBar: false, responsive: true },
    );
  }, [preset]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => Plotly.Plots.resize(el));
    ro.observe(el);
    return () => {
      ro.disconnect();
      Plotly.purge(el);
    };
  }, []);

  return (
    <section aria-labelledby="coverage-h" className="panel">
      <SectionHeader id="coverage-h" kicker="03 · Coverage" title="Stated test conditions vs your habitat" />
      <div
        ref={ref}
        className="h-[460px] w-full sm:h-[480px]"
        role="img"
        aria-label={`O2 percent against total pressure. The star is ${preset.label}. Shapes are test conditions quoted from ${PSI.stats.withNumericConditions} PSI records; everything else is empty.`}
      />
      <p className="mt-3 text-center font-mono text-sm uppercase tracking-[0.25em] text-flame-soft">Empty space is the finding.</p>
      <p className="mx-auto mt-1 max-w-2xl text-center text-xs text-dim">
        Only {PSI.stats.withNumericConditions} of {PSI.stats.total} records state numeric conditions in their text. Pressures
        given in atm are converted to psia (1 atm = 14.696 psia). Hover a shape for its source quote.
      </p>
    </section>
  );
}
