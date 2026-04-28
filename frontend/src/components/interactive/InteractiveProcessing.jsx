// import React, { memo } from "react";
// import { Sparkles, Clock, RefreshCw } from "lucide-react";

// const InteractiveProcessing = memo(({ step, patentId, claimNumber }) => {
//   const isMapping = step === "mapping";
//   const isFinal = step === "finalizing";
//   const cleanId = patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

//   return (
//     <div className="w-full bg-white rounded-[60px] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-50 p-10 md:p-20 flex flex-col items-center animate-scale-up">
//       {/* 🏷️ Badge */}
//       <div className="bg-orange-50 px-6 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100">
//         <Sparkles size={14} className="text-[#ff6b00]" />
//         <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[2px]">
//           Interactive Analysis
//         </span>
//       </div>

//       {/* 🚀 Dynamic Titles */}
//       <h2 className="text-4xl md:text-[44px] font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-tight text-center">
//         {step === "initializing" && "Loading patent claim data"}
//         {isMapping && "Preparing Claim Mapping & Target Products"}
//         {isFinal && "Generating Final Claim Chart"}
//       </h2>
//       <p className="text-slate-400 text-lg mb-16 font-bold text-center">
//         {step === "initializing" &&
//           `Fetching independent claims for ${cleanId}.`}
//         {isMapping &&
//           "AI is understanding the selected claim against the patent specification."}
//         {isFinal && "Preparing the final claim chart."}
//       </p>

//       {/* 📦 Central Box */}
//       <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-100 rounded-[50px] p-10 md:p-14 flex flex-col items-center mb-10 relative overflow-hidden shadow-sm">
//         {step === "initializing" ? (
//           /* IMAGE 1: SKELETON LOADER */
//           <div className="w-full space-y-8">
//             <div className="absolute top-10 right-10 w-16 h-16 bg-[#ff6b00] rounded-[24px] flex items-center justify-center shadow-xl shadow-orange-100">
//               <RefreshCw className="text-white animate-spin" size={32} />
//             </div>
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="space-y-4">
//                 <div className="h-6 bg-slate-200/60 rounded-full w-32 animate-pulse" />
//                 <div className="h-4 bg-slate-200/40 rounded-full w-full animate-pulse" />
//                 <div className="h-4 bg-slate-200/40 rounded-full w-[85%] animate-pulse" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* IMAGES 3 & 4: PROGRESS VIEW */
//           <>
//             <h3 className="text-3xl font-black text-[#0f172a] mb-1">
//               {cleanId} {claimNumber ? `• Claim ${claimNumber}` : ""}
//             </h3>
//             <p className="text-slate-400 text-sm font-bold mb-10">
//               AI/ML Based Technical Prediction Analysis
//             </p>

//             {isFinal && (
//               <div className="bg-[#fff7ed] px-6 py-2 rounded-full border border-orange-100 mb-10">
//                 <span className="text-[#ff6b00] text-[12px] font-black uppercase tracking-widest">
//                   Claim {claimNumber} • Target Discovery Active
//                 </span>
//               </div>
//             )}

//             <div className="w-full mb-10">
//               <div className="flex justify-between mb-4 px-1">
//                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
//                   {isMapping
//                     ? "Understanding Claim Scope"
//                     : "Building Chart Sections"}
//                 </span>
//                 <span className="text-[10px] font-black text-slate-400">
//                   22%
//                 </span>
//               </div>
//               <div className="w-full h-3 bg-white rounded-full border border-slate-100 p-0.5 shadow-inner">
//                 <div
//                   className="h-full bg-[#ff6b00] rounded-full shadow-lg shadow-orange-100"
//                   style={{ width: "22%" }}
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-3 text-[#0f172a] font-[1000] text-xl bg-white px-8 py-3 rounded-2xl shadow-sm border border-slate-50">
//               <Clock size={22} className="text-[#ff6b00]" /> ~2 minutes
//               remaining
//             </div>
//           </>
//         )}
//       </div>

//       {/* FOOTER INFO (For Image 3 mapping phase) */}
//       {isMapping && (
//         <div className="bg-[#fffcf0] border border-orange-100/50 p-6 rounded-[30px] max-w-2xl text-center animate-fade-in shadow-sm">
//           <p className="text-[#ff6b00] font-black text-[15px] leading-relaxed">
//             AI is understanding Claim {claimNumber} in view of the patent
//             specification, then finding target products for the next step.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// });

// export default InteractiveProcessing;

import React, { memo } from "react";
import { Sparkles, Clock, RefreshCw, Search } from "lucide-react";

const InteractiveProcessing = memo(({ step, patentId, claimNumber }) => {
  const isMapping = step === "mapping";
  const isFinal = step === "finalizing";
  const cleanId = patentId?.replace(/^patent\/|\/en$/gi, "") || "ZXCDCS";

  return (
    <div className="w-full bg-white rounded-[60px] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-50 p-10 md:p-20 flex flex-col items-center animate-scale-up">
      {/* 1. Badge Row */}
      <div className="w-full max-w-3xl flex justify-start mb-8">
        <div className="bg-[#fff7ed] px-4 py-1.5 rounded-lg flex items-center gap-2 border border-orange-100">
          <Search size={14} className="text-[#ff6b00]" />
          <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[1.5px]">
            Finding Independent Claims
          </span>
        </div>
      </div>

      {/* 2. Main Title */}
      <div className="w-full max-w-3xl flex flex-col items-start mb-16 relative">
        <h2 className="text-[64px] font-black text-[#0f172a] tracking-tighter leading-tight">
          {step === "initializing"
            ? "Loading patent claim data"
            : "Preparing Mapping"}
        </h2>
        <p className="text-slate-400 text-xl font-bold">
          Fetching independent claims for{" "}
          <span className="text-[#0f172a]">{cleanId}</span>.
        </p>

        {/* Floating Orange Refresh Icon */}
        <div className="absolute top-4 -right-12 w-20 h-20 bg-[#ff6b00] rounded-[28px] flex items-center justify-center shadow-2xl shadow-orange-300">
          <RefreshCw
            className="text-white animate-spin"
            size={40}
            strokeWidth={3}
          />
        </div>
      </div>

      {/* 3. Skeleton Container (Matches Image 2) */}
      <div className="w-full max-w-4xl bg-[#f8fafc]/50 border border-slate-100 rounded-[50px] p-12 flex flex-col gap-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/40 border border-slate-50 rounded-[35px] p-10 space-y-6"
          >
            <div className="h-8 bg-slate-100 rounded-full w-40 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100/60 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-slate-100/60 rounded-full w-[85%] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default InteractiveProcessing;
