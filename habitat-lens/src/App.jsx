import { useCallback, useRef, useState } from 'react';
import { EMPTY_PARSED_HABITAT, HABITAT_PRESETS, WEIGHT_CRITERIA } from './data/placeholders.js';
import Header from './components/Header.jsx';
import HabitatPicker from './components/HabitatPicker.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import CoverageChart from './components/CoverageChart.jsx';
import GravityStrip from './components/GravityStrip.jsx';
import DetailDrawer from './components/DetailDrawer.jsx';
import DataQualityPanel from './components/DataQualityPanel.jsx';
import TrustPanel from './components/TrustPanel.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

const initialPreset = HABITAT_PRESETS[0];

export default function App() {
  const [habitat, setHabitat] = useState({
    presetId: initialPreset.id,
    pressurePsia: initialPreset.pressurePsia,
    o2Percent: initialPreset.o2Percent,
    airflowCms: null, // user assumption; null until the user moves the slider
  });
  const [parsed, setParsed] = useState(EMPTY_PARSED_HABITAT);
  // Slider positions only (UI state, mid-scale). They feed no calculation yet.
  const [weights, setWeights] = useState(() => Object.fromEntries(WEIGHT_CRITERIA.map((c) => [c.key, 50])));
  const [selected, setSelected] = useState(null);
  const returnFocus = useRef(null);

  const openDetail = useCallback((inv, el) => {
    returnFocus.current = el;
    setSelected(inv);
  }, []);
  const closeDetail = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  return (
    <div id="top" className="flex min-h-screen flex-col overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 btn">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">
        <HabitatPicker
          habitat={habitat}
          setHabitat={setHabitat}
          parsed={parsed}
          setParsed={setParsed}
          weights={weights}
          setWeights={setWeights}
        />
        <ResultsTable onOpen={openDetail} />
        <CoverageChart habitat={habitat} />
        <GravityStrip />
        <div className="grid gap-6 lg:grid-cols-2">
          <DataQualityPanel />
          <TrustPanel />
        </div>
        <About />
      </main>
      <Footer />
      <DetailDrawer investigation={selected} onClose={closeDetail} />
    </div>
  );
}
