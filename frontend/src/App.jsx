import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import Projects from './pages/MyProject';
import Claims from './pages/Claims';
import Processing from './components/Processing';
import ClaimAnalysis from './pages/ClaimAnalysis';
import TargetSelection from './pages/TargetSelection';
import FinalReport from './components/FinalReport';
import ReportView from './pages/ReportView';
// import Claims from './pages/Claims';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard acts as the layout wrapper */}
        <Route path="/" element={<Dashboard />}>
          {/* Default view on load */}
          <Route index element={<NewAnalysis />} /> 
          
          {/* Sub-pages */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/processing" element={<Processing />} /> 
          <Route path="/analysis-complete" element={<ClaimAnalysis />} /> 
          <Route path="/target-selection" element={<TargetSelection />} /> 
          <Route path="/final-report" element={<FinalReport />} />
          <Route path="/report-view" element={<ReportView />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;