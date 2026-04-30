// import React, { memo, useMemo } from "react";
// import { Sparkles, Loader2 } from "lucide-react";

// const InteractiveMappingLoader = memo(({ status }) => {
//   const progress = status?.progressPercentage || 10;
//   const cleanId =
//     status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "USFRDFVBGF";
//   const claimNum = status?.selectedClaim?.number || 1;

//   return (
//     <div className="w-full bg-white rounded-[45px] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center animate-scale-up max-w-6xl mx-auto">
//       {/* 🟠 TOP BADGE */}
//       <div className="mb-6">
//         <span className="bg-[#fff5f0] text-[#ff6b00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[2px] border border-[#ff6b00]/10 flex items-center gap-2">
//           <Sparkles size={14} fill="#ff6b00" />
//           Interactive Analysis
//         </span>
//       </div>

//       {/* 🟠 TITLES */}
//       <h2 className="text-4xl md:text-[56px] font-black text-[#0a0a0a] mb-4 tracking-tighter leading-tight">
//         Preparing Claim Mapping & Target Products
//       </h2>
//       <p className="text-gray-400 text-lg font-medium max-w-3xl mb-12">
//         AI is understanding the selected claim against the patent specification
//         and finding relevant target products.
//       </p>

//       {/* 🟠 CENTRAL PROGRESS CARD */}
//       <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-[40px] p-10 md:p-14 flex flex-col items-center mb-10 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
//         <div className="mb-10 text-center">
//           <h3 className="text-3xl font-black text-gray-900 tracking-tight">
//             {cleanId} • Claim {claimNum}
//           </h3>
//           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1 opacity-70">
//             AI/ML Based Mobility Related Prediction for Handover
//           </p>
//         </div>

//         {/* PROGRESS LABELS */}
//         <div className="w-full max-w-2xl flex justify-between mb-4 px-2">
//           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2.5px]">
//             Understanding Claim Scope
//           </span>
//           <span className="text-[11px] font-black text-gray-400">
//             {progress}%
//           </span>
//         </div>

//         {/* PILL BAR */}
//         <div className="w-full max-w-2xl h-8 bg-gray-50 border border-gray-100 rounded-full p-1.5 shadow-inner mb-8">
//           <div
//             className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000 ease-out shadow-lg shadow-orange-200"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <p className="text-gray-900 font-black text-xl tracking-tight italic">
//           ~2 minutes remaining
//         </p>
//       </div>

//       {/* 🟠 BOTTOM ORANGE INFO BOX (Matches Image 4) */}
//       <div className="w-full max-w-3xl bg-[#fffaf5] border border-[#ff6b00]/10 rounded-[30px] p-8 md:p-10">
//         <p className="text-[#ff6b00] font-black text-sm md:text-base leading-relaxed tracking-tight">
//           AI is understanding Claim {claimNum} in view of the patent
//           specification, then finding target products for the next step.
//         </p>
//       </div>
//     </div>
//   );
// });

// export default InteractiveMappingLoader;
import React, { memo } from "react";
import { Search, RefreshCw, Clock } from "lucide-react";

const InteractiveMappingLoader = memo(
  ({ step, patentId, claimNumber, status }) => {
    const isInitial = step === "initializing";
    const progress = status?.progressPercentage || 10;
    const cleanId =
      patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

    return (
      <div className="w-full bg-white rounded-[40px] md:rounded-[60px] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-20 flex flex-col items-center animate-scale-up max-w-6xl mx-auto relative overflow-hidden">
        {/* 🟠 1. Badge */}
        <div className="w-full max-w-4xl flex justify-start mb-8">
          <div className="bg-[#fff7ed] px-4 py-1.5 rounded-lg flex items-center gap-2 border border-orange-100 font-black text-[#ff6b00] text-[10px] uppercase tracking-[1.5px]">
            <Search size={14} /> Finding Independent Claims
          </div>
        </div>

        {/* 🟠 2. Header */}
        <div className="w-full max-w-4xl flex flex-col items-start mb-16 relative">
          <h2 className="text-4xl pb-3 md:text-[64px] font-[1000] text-[#0f172a] tracking-tighter leading-tight">
            {isInitial
              ? "Loading patent claim data"
              : "Preparing Claim Mapping"}
          </h2>
          <p className="text-slate-400 text-xl font-bold">
            Fetching independent claims for{" "}
            <span className="text-[#0f172a]">{cleanId}</span>.
          </p>
          <div className="absolute top-4 -right-6 md:-right-10 w-16 h-16 md:w-20 md:h-20 bg-[#ff6b00] rounded-[24px] md:rounded-[28px] flex items-center justify-center shadow-2xl shadow-orange-300">
            <RefreshCw
              className="text-white animate-spin"
              size={32}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* 🟠 3. Content */}
        {isInitial ? (
          /* SKELETON LIST (Image 1) */
          <div className="w-full max-w-5xl bg-[#f8fafc]/50 border border-slate-100 rounded-[40px] p-6 md:p-10 flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/70 border border-slate-50 rounded-[30px] p-8 space-y-5 animate-pulse shadow-sm"
              >
                <div className="h-6 bg-slate-100 rounded-full w-32" />
                <div className="space-y-3">
                  <div className="h-3.5 bg-slate-100/60 rounded-full w-full" />
                  <div className="h-3.5 bg-slate-100/60 rounded-full w-[80%]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* PROGRESS CARD (Image 2) */
          <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-200 rounded-[40px] p-10 md:p-14 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-2 uppercase tracking-tighter">
              {cleanId} • Claim {claimNumber}
            </h3>
            {/* <p className="text-slate-400 text-sm font-bold mb-10 opacity-70">
              AI BASED PREDICTION ENGINE
            </p> */}
            <div className="w-full mb-8 px-2 md:px-6">
              <div className="flex justify-between mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Understanding Claim Scope</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-4 bg-white rounded-full border border-slate-100 p-1">
                <div
                  className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#0f172a] font-[1000] text-xl">
              <Clock size={22} className="text-[#ff6b00]" /> ~2 minutes
              remaining
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default InteractiveMappingLoader;
