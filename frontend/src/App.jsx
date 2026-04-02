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

// import React, { Suspense, lazy } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import AuthProvider from "./layout/AuthProvider";
// import GuestLayout from "./layout/GuestLayout";
// import ProtectedLayout from "./layout/ProtectedLayout";

// // Lazy Loaded Pages
// const LandingPage = lazy(() => import("./pages/LandingPage"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const NewAnalysis = lazy(() => import("./pages/NewAnalysis"));
// const Processing = lazy(() => import("./components/Processing"));
// const ReportView = lazy(() => import("./pages/ReportView"));

// const Loading = () => <div className="h-screen w-full flex items-center justify-center font-bold">LOADING...</div>;

// function App() {
//   return (
//     <Suspense fallback={<Loading />}>
//       <Routes>
//         <Route element={<AuthProvider />}>
//           <Route element={<GuestLayout />}><Route path="/" element={<LandingPage />} /></Route>

//           <Route element={<ProtectedLayout />}>
//             <Route path="/dashboard" element={<Dashboard />}>
//               <Route index element={<NewAnalysis />} />
//               <Route path="processing" element={<Processing />} />
//               <Route path="report-view/:id" element={<ReportView />} />
//             </Route>
//           </Route>

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Route>
//       </Routes>
//     </Suspense>
//   );
// }

// export default App;
