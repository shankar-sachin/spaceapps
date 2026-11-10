import { useCallback, useRef, useState } from 'react';
import { HABITAT_PRESETS } from './data/index.js';
import Header from './components/Header.jsx';
import HabitatPicker from './components/HabitatPicker.jsx';
import Findings from './components/Findings.jsx';
import EvidenceList from './components/EvidenceList.jsx';
import CoverageChart from './components/CoverageChart.jsx';
import GravityStrip from './components/GravityStrip.jsx';
import DetailDrawer from './components/DetailDrawer.jsx';
import DataQualityPanel from './components/DataQualityPanel.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [presetId, setPresetId] = useState(HABITAT_PRESETS[1].id);
  const preset = HABITAT_PRESETS.find((p) => p.id === presetId);
  const [openAcc, setOpenAcc] = useState(null);
  const returnFocus = useRef(null);

  const open = useCallback((acc, el) => {
    if (el) returnFocus.current = el;
    setOpenAcc(acc);
  }, []);
  const close = useCallback(() => {
    setOpenAcc(null);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  return (
    <div id="top" className="flex min-h-screen flex-col overflow-x-hidden">
      <a href="#main" className="btn sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6">
        <HabitatPicker preset={preset} onSelect={setPresetId} />
        <Findings />
        <EvidenceList preset={preset} onOpen={open} />
        <CoverageChart preset={preset} />
        <GravityStrip />
        <DataQualityPanel onOpen={open} />
        <About />
      </main>
      <Footer />
      <DetailDrawer accession={openAcc} preset={preset} onClose={close} onOpen={open} />
    </div>
  );
}
