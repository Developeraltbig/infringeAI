import React, { memo } from "react";
import { Sparkles, Clock, RefreshCw } from "lucide-react";

const InteractiveProcessing = memo(({ step, patentId, claimNumber }) => {
  const isMapping = step === "mapping";
  const isFinal = step === "finalizing";

  const cleanId = patentId?.replace(/^patent\/|\/en$/gi, "");

  return (
    <div className="w-full bg-white rounded-[60px] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-50 p-10 md:p-20 flex flex-col items-center animate-scale-up">
      {/* Badge */}
      <div className="bg-orange-50 px-6 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100">
        <Sparkles size={14} className="text-[#ff6b00]" />
        <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[2px]">
          Interactive Analysis
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-4xl md:text-[64px] font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-tight text-center">
        {step === "initializing" && "Loading patent claim data"}
        {isMapping && "Preparing Claim Mapping & Target Products"}
        {isFinal && "Generating Final Claim Chart"}
      </h2>
      <p className="text-slate-400 text-lg mb-16 font-bold text-center">
        {step === "initializing" &&
          `Fetching independent claims for ${cleanId}.`}
        {isMapping &&
          "AI is understanding the selected claim against the patent specification."}
        {isFinal && "Preparing the final claim chart."}
      </p>

      {/* Central Box */}
      <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-100 rounded-[50px] p-10 md:p-14 flex flex-col items-center mb-10 relative overflow-hidden">
        {step === "initializing" ? (
          /* Image 1 Skeleton Loader */
          <div className="w-full space-y-6">
            <div className="absolute top-10 right-10 w-16 h-16 bg-[#ff6b00] rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200">
              <RefreshCw className="text-white animate-spin" size={32} />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-5 bg-slate-200/50 rounded-full w-24 animate-pulse" />
                <div className="h-3 bg-slate-200/30 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-slate-200/30 rounded-full w-[80%] animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          /* Image 3 & 4 Progress View */
          <>
            <h3 className="text-2xl font-black text-[#0f172a] mb-1">
              {cleanId} {claimNumber ? `• Claim ${claimNumber}` : ""}
            </h3>
            {isFinal && (
              <div className="bg-orange-50 px-4 py-1 rounded-full border border-orange-100 mt-2 mb-4">
                <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-widest">
                  Claim {claimNumber} - Discovery Active
                </span>
              </div>
            )}
            <p className="text-slate-400 text-sm font-bold mb-12">
              AI/ML Based Technical Prediction Analysis
            </p>

            <div className="w-full mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {isMapping
                    ? "Understanding Claim Scope"
                    : "Building Chart Sections"}
                </span>
                <span className="text-[10px] font-black text-slate-400">
                  22%
                </span>
              </div>
              <div className="w-full h-3 bg-white rounded-full border border-slate-100 p-0.5">
                <div
                  className="h-full bg-[#ff6b00] rounded-full"
                  style={{ width: "22%" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#0f172a] font-black text-xl">
              <Clock size={20} className="text-[#ff6b00]" /> ~2 minutes
              remaining
            </div>
          </>
        )}
      </div>

      {/* Footer Info (Image 3) */}
      {isMapping && (
        <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-[30px] max-w-2xl text-center">
          <p className="text-[#ff6b00] font-black text-sm leading-relaxed">
            AI is understanding Claim {claimNumber} in view of the patent
            specification, then finding target products for the next step.
          </p>
        </div>
      )}
    </div>
  );
});

export default InteractiveProcessing;
