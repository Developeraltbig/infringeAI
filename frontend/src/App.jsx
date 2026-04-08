import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./layout/AuthProvider";
import GuestLayout from "./layout/GuestLayout";
import ProtectedLayout from "./layout/ProtectedLayout";

// Lazy Loaded Pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewAnalysis = lazy(() => import("./pages/NewAnalysis"));
const Claims = lazy(() => import("./pages/Claims"));
const ReportView = lazy(() => import("./pages/ReportView"));
const ClaimAnalysis = lazy(() => import("./pages/ClaimAnalysis"));
const MyProject = lazy(() => import("./pages/MyProject"));
const TargetSelection = lazy(() => import("./pages/MappingAndTargetsView"));

const Loading = () => (
  <div className="h-screen w-full flex items-center justify-center font-bold">
    LOADING...
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* PROTECTED */}
          <Route element={<ProtectedLayout />}>
            {/* Make Dashboard a parent */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<NewAnalysis />} />
              <Route path="claims" element={<Claims />} />
              <Route path="claim-analysis" element={<ClaimAnalysis />} />
              <Route path="projects" element={<MyProject />} />
              <Route path="new-analysis" element={<NewAnalysis />} />
              <Route path="report-view/:id" element={<ReportView />} />
              <Route path="target-selection" element={<TargetSelection />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
