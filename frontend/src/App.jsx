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
import SearchArea from "./components/SearchArea";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* PROTECTED */}
        <Route element={<ProtectedLayout />}>
          {/* ✅ Make Dashboard a parent */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<NewAnalysis />} />
            <Route path="claims" element={<Claims />} />
            <Route path="claim-analysis" element={<ClaimAnalysis />} />
            <Route path="projects" element={<MyProject />} />
            <Route path="new-analysis" element={<NewAnalysis />} />
            <Route path="report-view" element={<ReportView />} />
            <Route path="target-selection" element={<TargetSelection />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
