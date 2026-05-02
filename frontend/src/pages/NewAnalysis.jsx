// import React, { useState, useCallback, Suspense, lazy, memo } from "react";
// import ModeSelector from "../components/ModeSelector";
// import SearchArea from "../components/SearchArea";
// import { useSelector } from "react-redux";

// const ProcessingModal = lazy(() => import("../components/ProcessingModal"));

// const NewAnalysis = memo(() => {
//   const [activeProjectId, setActiveProjectId] = useState(null);
//   const mode = useSelector((state) => state.analysis.mode);

//   const handleStart = useCallback((id) => {
//     setActiveProjectId(id);
//   }, []);

//   const handleReset = useCallback(() => {
//     setActiveProjectId(null);
//   }, []);

//   return (
//     <div className="w-full min-h-full flex flex-col items-center">
//       {!activeProjectId ? (
//         /* 🟢 STATE A: SEARCH UI (Matches your First Screenshot) */
//         <div className="w-full flex flex-col items-center animate-fade-in py-10">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl md:text-[64px] font-black text-gray-900 mb-4 tracking-tighter leading-tight">
//               Patent Infringement{" "}
//               <span className="text-[#ff6b00]">Analysis</span>
//             </h1>
//             <p className="text-gray-400 text-lg font-medium">
//               Generate Professional Claim Charts In Minutes.
//             </p>
//           </div>

//           <ModeSelector />

//           <SearchArea onStarted={handleStart} />

//           {/* Sub-text based on Mode */}
//           <p className="mt-8 text-gray-400 text-sm font-medium tracking-wide">
//             {mode === "interactive"
//               ? "You Choose Claims & Target Companies Step By Step"
//               : "AI Selects The Best Claim & Targets Automatically"}
//           </p>
//         </div>
//       ) : (
//         /* 🟠 STATE B: WORKFLOW UI (Full Workspace) */
//         <Suspense
//           fallback={
//             <div className="p-20 text-orange-500 font-bold animate-pulse text-center">
//               INITIALIZING AI...
//             </div>
//           }
//         >
//           <div className="w-full animate-fade-in">
//             <ProcessingModal
//               projectId={activeProjectId}
//               onClose={handleReset}
//             />
//           </div>
//         </Suspense>
//       )}
//     </div>
//   );
// });

// // export default NewAnalysis;

// import React, { useState, useCallback, Suspense, lazy, memo } from "react";
// import ModeSelector from "../components/ModeSelector";
// import SearchArea from "../components/SearchArea";
// import { useSelector } from "react-redux";
// import { Sparkles } from "lucide-react";

// const ProcessingModal = lazy(() => import("../components/ProcessingModal"));

// const NewAnalysis = memo(() => {
//   const [activeProjectId, setActiveProjectId] = useState(null);

//   const handleStart = useCallback((id) => setActiveProjectId(id), []);
//   const handleReset = useCallback(() => setActiveProjectId(null), []);

//   return (
//     <div className="w-full min-h-screen flex flex-col items-center bg-[#fcfcfc] px-4">
//       {!activeProjectId ? (
//         <div className="w-full max-w-7xl flex flex-col items-center animate-fade-in py-10 md:py-20">
//           {/* 🟠 TOP BADGE */}
//           <div className="mb-6 md:mb-8">
//             <span className="bg-[#fff5f0] text-[#ff6b00] px-4 md:px-6 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[2px] border border-[#ff6b00]/10 flex items-center gap-2">
//               <Sparkles size={14} fill="#ff6b00" />
//               AI Claim Chart Generator
//             </span>
//           </div>

//           {/* 🟠 MAIN TITLES */}
//           <div className="text-center mb-10 md:mb-14 px-2">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-[#0a0a0a] mb-4 tracking-tighter leading-[1.1]">
//               Patent Infringement{" "}
//               <span className="text-[#ff6b00]">Analysis</span>
//             </h1>
//             <p className="text-gray-400 text-base md:text-xl font-medium tracking-tight max-w-2xl mx-auto">
//               Choose a mode, enter patent numbers, and generate claim charts
//             </p>
//           </div>

//           <ModeSelector />

//           <SearchArea onStarted={handleStart} />
//         </div>
//       ) : (
//         <Suspense
//           fallback={
//             <div className="p-20 text-orange-500 font-black animate-pulse text-center">
//               INITIALIZING AI...
//             </div>
//           }
//         >
//           <div className="w-full animate-fade-in py-10">
//             <ProcessingModal
//               projectId={activeProjectId}
//               onClose={handleReset}
//             />
//           </div>
//         </Suspense>
//       )}
//     </div>
//   );
// });

// export default NewAnalysis;
import React, { useCallback, Suspense, lazy, memo } from "react";
import ModeSelector from "../components/ModeSelector";
import SearchArea from "../components/SearchArea";
import { Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"; // 🟢 Added routing hooks

const ProcessingModal = lazy(() => import("../components/ProcessingModal"));

const NewAnalysis = memo(() => {
  const navigate = useNavigate();
  const { projectId } = useParams(); // 🟢 Read the ID from the URL instead of local state

  // 🟢 Navigation Logic: Instead of setting local state, we change the URL
  // This prevents the "refresh" from wiping your progress
  const handleStart = useCallback(
    (id) => {
      navigate(`/dashboard/processing/${id}`);
    },
    [navigate],
  );

  const handleReset = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#fcfcfc] px-4">
      {/* 🟢 If there is NO projectId in the URL, show the Search Form */}
      {!projectId ? (
        <div className="w-full max-w-7xl flex flex-col items-center animate-fade-in py-10 md:py-20">
          {/* 🟠 TOP BADGE */}
          <div className="mb-6 md:mb-8">
            <span className="bg-[#fff5f0] text-[#ff6b00] px-4 md:px-6 py-2 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[2px] border border-[#ff6b00]/10 flex items-center gap-2">
              <Sparkles size={14} fill="#ff6b00" />
              AI Claim Chart Generator
            </span>
          </div>

          {/* 🟠 MAIN TITLES */}
          <div className="text-center mb-10 md:mb-14 px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-[#0a0a0a] mb-4 tracking-tighter leading-[1.1]">
              Patent Infringement{" "}
              <span className="text-[#ff6b00]">Analysis</span>
            </h1>
            <p className="text-gray-400 text-base md:text-xl font-medium tracking-tight max-w-2xl mx-auto">
              Choose a mode, enter patent numbers, and generate claim charts
            </p>
          </div>

          <ModeSelector />

          <SearchArea onStarted={handleStart} />
        </div>
      ) : (
        /* 🟢 If there IS a projectId in the URL, show the Processing view */
        <Suspense
          fallback={
            <div className="p-20 text-orange-500 font-black animate-pulse text-center">
              INITIALIZING AI...
            </div>
          }
        >
          <div className="w-full animate-fade-in py-10">
            <ProcessingModal projectId={projectId} onClose={handleReset} />
          </div>
        </Suspense>
      )}
    </div>
  );
});

export default NewAnalysis;
