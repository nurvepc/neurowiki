
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Layout from '../components/Layout';
import { PublishGate } from './components/PublishGate';
import DisclaimerModal from './components/DisclaimerModal';

// Lazy load all page components for code splitting
const Home = lazy(() => import('../pages/Home'));
const Wiki = lazy(() => import('../pages/Wiki'));
const Calculators = lazy(() => import('../pages/Calculators'));
const NihssCalculator = lazy(() => import('../pages/NihssCalculator'));
const ResidentGuide = lazy(() => import('../pages/ResidentGuide'));
const TrialsPage = lazy(() => import('../pages/TrialsPage'));
const GCAPathway = lazy(() => import('../pages/GCAPathway'));
const ElanPathway = lazy(() => import('../pages/ElanPathway'));
const EvtPathway = lazy(() => import('../pages/EvtPathway'));
const StatusEpilepticusPathway = lazy(() => import('../pages/StatusEpilepticusPathway'));
const MigrainePathway = lazy(() => import('../pages/MigrainePathway'));

// Lazy load guide articles
const StrokeBasics = lazy(() => import('./pages/guide/StrokeBasics'));
const IvTpa = lazy(() => import('./pages/guide/IvTpa'));
const Thrombectomy = lazy(() => import('./pages/guide/Thrombectomy'));
const AcuteStrokeMgmt = lazy(() => import('./pages/guide/AcuteStrokeMgmt'));
const StatusEpilepticus = lazy(() => import('./pages/guide/StatusEpilepticus'));
const IchManagement = lazy(() => import('./pages/guide/IchManagement'));
const Meningitis = lazy(() => import('./pages/guide/Meningitis'));
const Gbs = lazy(() => import('./pages/guide/Gbs'));
const MyastheniaGravis = lazy(() => import('./pages/guide/MyastheniaGravis'));
const MultipleSclerosis = lazy(() => import('./pages/guide/MultipleSclerosis'));
const SeizureWorkup = lazy(() => import('./pages/guide/SeizureWorkup'));
const AlteredMentalStatus = lazy(() => import('./pages/guide/AlteredMentalStatus'));
const HeadacheWorkup = lazy(() => import('./pages/guide/HeadacheWorkup'));
const Vertigo = lazy(() => import('./pages/guide/Vertigo'));
const WeaknessWorkup = lazy(() => import('./pages/guide/WeaknessWorkup'));

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <Router>
        <DisclaimerModal />
        <Layout>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neuro-500"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
          </div>
        }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki/:topic" element={<Wiki />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/nihss" element={<PublishGate><NihssCalculator /></PublishGate>} />
          <Route path="/calculators/gca-pathway" element={<PublishGate><GCAPathway /></PublishGate>} />
          <Route path="/calculators/elan-pathway" element={<PublishGate><ElanPathway /></PublishGate>} />
          <Route path="/calculators/evt-pathway" element={<PublishGate><EvtPathway /></PublishGate>} />
          <Route path="/calculators/se-pathway" element={<PublishGate><StatusEpilepticusPathway /></PublishGate>} />
          <Route path="/calculators/migraine-pathway" element={<PublishGate><MigrainePathway /></PublishGate>} />
          <Route path="/guide" element={<ResidentGuide context="guide" />} />
          <Route path="/guide/stroke-basics" element={<PublishGate><StrokeBasics /></PublishGate>} />
          <Route path="/guide/iv-tpa" element={<PublishGate><IvTpa /></PublishGate>} />
          <Route path="/guide/tpa-eligibility" element={<PublishGate><IvTpa /></PublishGate>} />
          <Route path="/guide/thrombectomy" element={<PublishGate><Thrombectomy /></PublishGate>} />
          <Route path="/guide/acute-stroke-mgmt" element={<PublishGate><AcuteStrokeMgmt /></PublishGate>} />
          <Route path="/guide/status-epilepticus" element={<PublishGate><StatusEpilepticus /></PublishGate>} />
          <Route path="/guide/ich-management" element={<PublishGate><IchManagement /></PublishGate>} />
          <Route path="/guide/meningitis" element={<PublishGate><Meningitis /></PublishGate>} />
          <Route path="/guide/gbs" element={<PublishGate><Gbs /></PublishGate>} />
          <Route path="/guide/myasthenia-gravis" element={<PublishGate><MyastheniaGravis /></PublishGate>} />
          <Route path="/guide/multiple-sclerosis" element={<PublishGate><MultipleSclerosis /></PublishGate>} />
          <Route path="/guide/seizure-workup" element={<PublishGate><SeizureWorkup /></PublishGate>} />
          <Route path="/guide/altered-mental-status" element={<PublishGate><AlteredMentalStatus /></PublishGate>} />
          <Route path="/guide/headache-workup" element={<PublishGate><HeadacheWorkup /></PublishGate>} />
          <Route path="/guide/vertigo" element={<PublishGate><Vertigo /></PublishGate>} />
          <Route path="/guide/weakness-workup" element={<PublishGate><WeaknessWorkup /></PublishGate>} />
          <Route path="/guide/:topicId" element={<PublishGate><ResidentGuide context="guide" /></PublishGate>} />
          <Route path="/trials" element={<TrialsPage />} />
          <Route path="/trials/:topicId" element={<PublishGate><ResidentGuide context="trials" /></PublishGate>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        </Layout>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
