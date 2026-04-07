import React, { Suspense, lazy, memo } from "react";

// 🚀 Optimization: Lazy Load the heavy search component
const SearchArea = lazy(() => import("../components/SearchArea"));
const ModeSelector = lazy(() => import("../components/ModeSelector"));

const NewAnalysis = memo(() => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-8 animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
          Patent Infringement <span className="text-[#ff6b00]">Analysis</span>
        </h2>
        <p className="text-gray-500 text-lg">
          Generate Professional Claim Charts In Minutes.
        </p>
      </div>

      <ModeSelector />

      <Suspense
        fallback={
          <div className="h-20 w-full animate-pulse bg-gray-100 rounded-3xl" />
        }
      >
        <SearchArea />
      </Suspense>
    </div>
  );
});

export default NewAnalysis;
