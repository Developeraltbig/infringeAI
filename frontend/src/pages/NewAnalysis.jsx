import React, { useState, useCallback, Suspense, lazy, memo } from "react";
import ModeSelector from "../components/ModeSelector";
import SearchArea from "../components/SearchArea";
import { useSelector } from "react-redux";

const ProcessingModal = lazy(() => import("../components/ProcessingModal"));

const NewAnalysis = memo(() => {
  const [activeProjectId, setActiveProjectId] = useState(null);
  const mode = useSelector((state) => state.analysis.mode);

  const handleStart = useCallback((id) => {
    setActiveProjectId(id);
  }, []);

  const handleReset = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  return (
    <div className="w-full min-h-full flex flex-col items-center">
      {!activeProjectId ? (
        /* 🟢 STATE A: SEARCH UI (Matches your First Screenshot) */
        <div className="w-full flex flex-col items-center animate-fade-in py-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-[64px] font-black text-gray-900 mb-4 tracking-tighter leading-tight">
              Patent Infringement{" "}
              <span className="text-[#ff6b00]">Analysis</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              Generate Professional Claim Charts In Minutes.
            </p>
          </div>

          <ModeSelector />

          <SearchArea onStarted={handleStart} />

          {/* Sub-text based on Mode */}
          <p className="mt-8 text-gray-400 text-sm font-medium tracking-wide">
            {mode === "interactive"
              ? "You Choose Claims & Target Companies Step By Step"
              : "AI Selects The Best Claim & Targets Automatically"}
          </p>
        </div>
      ) : (
        /* 🟠 STATE B: WORKFLOW UI (Full Workspace) */
        <Suspense
          fallback={
            <div className="p-20 text-orange-500 font-bold animate-pulse text-center">
              INITIALIZING AI...
            </div>
          }
        >
          <div className="w-full animate-fade-in">
            <ProcessingModal
              projectId={activeProjectId}
              onClose={handleReset}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
});

export default NewAnalysis;
