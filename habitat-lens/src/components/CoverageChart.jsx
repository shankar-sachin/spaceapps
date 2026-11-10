import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import { HABITAT_PRESETS, TESTED_ENVELOPES } from '../data/placeholders.js';
import { SectionHeader } from './Slot.jsx';

// Axis framing only (covers every preset); not data.
const X_RANGE = [0, 100];
const Y_RANGE = [0, 16];

// Where unfilled envelope slots are drawn, in PAPER coordinates (0..1 of the
// plot area). These positions are pure layout and carry no meaning.
const GHOST_POSITIONS = [
  { x0: 0.06, x1: 0.26, y0: 0.62, y1: 0.86 },
  { x0: 0.36, x1: 0.58, y0: 0.12, y1: 0.36 },
  { x0: 0.7, x1: 0.94, y0: 0.5, y1: 0.74 },
];

const C = { ink: '#ece7df', dim: '#a39d94', line: '#2a313a', flame: '#ff7a1a', panel: '#11151a' };

function buildShapes() {
  const shapes = [];
  const annotations = [];
  TESTED_ENVELOPES.forEach((env, i) => {
    const filled = [env.o2Min, env.o2Max, env.pressureMinPsia, env.pressureMaxPsia].every((v) => v !== null);
    if (filled) {
      shapes.push({
        type: 'rect', xref: 'x', yref: 'y',
        x0: env.o2Min, x1: env.o2Max, y0: env.pressureMinPsia, y1: env.pressureMaxPsia,
        line: { color: C.flame, width: 1 }, fillcolor: 'rgba(255,122,26,0.15)',
      });
      return;
    }
    // DATA SLOT: PSI JSON + SI extraction -> TESTED_ENVELOPES[i] {o2Min, o2Max, pressureMinPsia, pressureMaxPsia}
    const g = GHOST_POSITIONS[i % GHOST_POSITIONS.length];
    shapes.push({
      type: 'rect', xref: 'paper', yref: 'paper', ...g,
      line: { color: C.dim, width: 1, dash: 'dash' }, fillcolor: 'rgba(163,157,148,0.05)',
    });
    annotations.push({
      xref: 'paper', yref: 'paper', x: (g.x0 + g.x1) / 2, y: (g.y0 + g.y1) / 2,
      text: 'tested envelope<br>slot', showarrow: false,
      font: { family: 'IBM Plex Mono, monospace', size: 10, color: C.dim },
    });
  });
  return { shapes, annotations };
}

export default function CoverageChart({ habitat }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { shapes, annotations } = buildShapes();
    const hasPoint = Number.isFinite(habitat.o2Percent) && Number.isFinite(habitat.pressurePsia);
    const preset = HABITAT_PRESETS.find((p) => p.id === habitat.presetId);
    const name = preset ? preset.label : 'Custom habitat';

    const data = [
      {
        type: 'scatter', mode: 'markers+text',
        x: hasPoint ? [habitat.o2Percent] : [],
        y: hasPoint ? [habitat.pressurePsia] : [],
        text: hasPoint ? [name] : [], textposition: 'top center',
        textfont: { family: 'IBM Plex Sans, sans-serif', color: C.ink, size: 12 },
        marker: { symbol: 'star', size: 18, color: C.flame, line: { color: '#ffd2ad', width: 1 } },
        hovertemplate: `${name}<br>O2 %{x}%<br>%{y} psia<extra></extra>`,
        name,
      },
    ];
    const axis = (title, range) => ({
      title: { text: title, font: { color: C.dim, size: 12 } },
      range, gridcolor: C.line, zerolinecolor: C.line, linecolor: C.line,
      tickfont: { family: 'IBM Plex Mono, monospace', color: C.dim, size: 11 },
      fixedrange: true,
    });
    const layout = {
      paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: C.panel,
      margin: { l: 56, r: 16, t: 16, b: 52 },
      xaxis: axis('O2 (%)', X_RANGE),
      yaxis: axis('Total pressure (psia)', Y_RANGE),
      showlegend: false, shapes, annotations,
      font: { color: C.ink },
    };
    Plotly.react(el, data, layout, { displayModeBar: false, responsive: true });
  }, [habitat]);

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
      <SectionHeader id="coverage-h" kicker="03 · Coverage" title="Tested conditions vs your habitat" />
      <div
        ref={ref}
        className="h-[320px] w-full sm:h-[420px]"
        role="img"
        aria-label="Chart of O2 percent against total pressure. The star marks your selected habitat. Dashed boxes are unfilled slots for tested envelopes."
      />
      <p className="mt-3 text-center font-mono text-sm uppercase tracking-[0.25em] text-flame-soft">
        Empty space is the finding.
      </p>
      <p className="mt-1 text-center text-xs text-dim">
        Dashed boxes are layout placeholders. Their positions mean nothing until envelope data is loaded.
      </p>
    </section>
  );
}
