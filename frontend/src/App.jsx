// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import NewAnalysis from './pages/NewAnalysis';
// import Projects from './pages/MyProject';
// import Claims from './pages/Claims';
// import Processing from './components/Processing';
// import ClaimAnalysis from './pages/ClaimAnalysis';
// import TargetSelection from './pages/TargetSelection';
// import FinalReport from './components/FinalReport';
// import ReportView from './pages/ReportView';
// // import Claims from './pages/Claims';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Dashboard acts as the layout wrapper */}
//         <Route path="/" element={<Dashboard />}>
//           {/* Default view on load */}
//           <Route index element={<NewAnalysis />} />

//           {/* Sub-pages */}
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/claims" element={<Claims />} />
//           <Route path="/processing" element={<Processing />} />
//           <Route path="/analysis-complete" element={<ClaimAnalysis />} />
//           <Route path="/target-selection" element={<TargetSelection />} />
//           <Route path="/final-report" element={<FinalReport />} />
//           <Route path="/report-view" element={<ReportView />} />
//         </Route>
//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
// import AuthProvider from "./layout/AuthProvider";
import GuestLayout from "./layout/GuestLayout";
import ProtectedLayout from "./layout/ProtectedLayout";
import VerificationLayout from "./layout/VerificationLayout"; // (If you use this)

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import ClaimAnalysis from "./pages/ClaimAnalysis";
import MyProject from "./pages/MyProject";
import NewAnalysis from "./pages/NewAnalysis";
import ReportView from "./pages/ReportView";
import TargetSelection from "./pages/TargetSelection";

import "./App.css";
import AuthProvider from "./layout/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 1. PUBLIC ROUTES (Only accessible if NOT logged in) */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* 2. PROTECTED ROUTES (Only accessible IF logged in) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/claim-analysis" element={<ClaimAnalysis />} />
          <Route path="/my-project" element={<MyProject />} />
          <Route path="/new-analysis" element={<NewAnalysis />} />
          <Route path="/report-view" element={<ReportView />} />
          <Route path="/target-selection" element={<TargetSelection />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
