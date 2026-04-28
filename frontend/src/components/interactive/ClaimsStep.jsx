// import React, { memo, useMemo, useState } from "react";
// import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";
// import { ArrowRight } from "lucide-react";

// const ClaimsStep = memo(({ projectId, data, onProceed }) => {
//   const [selectClaim, { isLoading }] = useSelectClaimMutation();
//   const [localSelected, setLocalSelected] = useState(null);

//   const independentClaims = useMemo(
//     () => data?.allClaims?.filter((c) => c.isIndependent) || [],
//     [data],
//   );

//   const handleProceed = async () => {
//     if (!localSelected) return;
//     try {
//       await selectClaim({ projectId, claimNumber: localSelected }).unwrap();
//       onProceed();
//     } catch (err) {
//       console.error("Selection failed");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-6 animate-fade-in pb-32">
//       {/* 1. Patent Header Card */}
//       <div className="bg-white rounded-[45px] border border-slate-200 p-8 md:p-14 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
//         <div className="flex-1">
//           <div className="bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-xl inline-flex items-center mb-6">
//             <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-widest font-mono">
//               ID: {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
//             </span>
//           </div>
//           <h2 className="text-2xl md:text-3xl font-[1000] text-[#0f172a] mb-3 tracking-tighter">
//             Choose one claim
//           </h2>
//           <p className="text-slate-400 font-bold text-md leading-snug max-w-2xl">
//             {data?.patentData?.biblioData?.title ||
//               "AI/ML Mobility related Prediction for Handover"}
//           </p>
//         </div>

//         <div className="flex gap-4 self-center lg:self-auto">
//           <StatBox
//             label="Total"
//             value={data?.allClaims?.length}
//             color="bg-slate-50 text-slate-900"
//           />
//           <StatBox
//             label="Available"
//             value={independentClaims.length}
//             color="bg-[#fff7ed] text-[#ff6b00]"
//             highlight
//           />
//           <StatBox
//             label="Dependent"
//             value={data?.allClaims?.length - independentClaims.length}
//             color="bg-slate-50 text-slate-900"
//           />
//         </div>
//       </div>

//       {/* 2. Claims List */}
//       <div className="flex flex-col gap-5">
//         {independentClaims.map((claim) => (
//           <div
//             key={claim.number}
//             onClick={() => setLocalSelected(claim.number)}
//             className={`cursor-pointer bg-white rounded-[40px] p-8 md:p-12 border-2 transition-all duration-500 relative
//               ${
//                 localSelected === claim.number
//                   ? "border-[#ff6b00] shadow-2xl shadow-orange-100/50 scale-[1.01]"
//                   : "border-slate-200 hover:border-slate-200 hover:shadow-lg"
//               }`}
//           >
//             <div className="flex justify-between items-start mb-8">
//               <div className="flex items-center gap-8">
//                 <div
//                   className={`w-10 h-10 rounded-full border-4 transition-all duration-300 flex items-center justify-center
//                   ${localSelected === claim.number ? "border-[#ff6b00] bg-[#ff6b00]" : "border-slate-100 bg-white"}`}
//                 >
//                   {localSelected === claim.number && (
//                     <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]" />
//                   )}
//                 </div>
//                 <h4 className="text-3xl font-[1000] text-[#0f172a] tracking-tight">
//                   Claim {claim.number}
//                 </h4>
//               </div>
//               {localSelected === claim.number && (
//                 <span className="bg-[#ff6b00] text-white text-[11px] font-black uppercase tracking-[2px] px-6 py-2 rounded-full shadow-lg shadow-orange-200">
//                   Selected
//                 </span>
//               )}
//             </div>
//             <p className="text-slate-500 font-bold leading-relaxed text-md pl-16 pr-4 italic">
//               "{claim.text}"
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* 3. Floating Bottom Selection Bar */}
//       <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-[60]">
//         <div className="bg-[#0f172a] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] p-6 flex flex-col sm:flex-row justify-between items-center gap-6 border border-white/5 animate-slide-up">
//           <span className="font-black text-white text-xl px-4">
//             {localSelected
//               ? `Claim ${localSelected} is selected`
//               : "Please select a claim"}
//           </span>
//           <button
//             disabled={!localSelected || isLoading}
//             onClick={handleProceed}
//             className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-12 py-5 rounded-[22px] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
//           >
//             {isLoading ? "Starting AI..." : "Continue to Mapping"}
//             <ArrowRight size={24} strokeWidth={3} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });

// const StatBox = ({ label, value, color, highlight }) => (
//   <div
//     className={`${color} border ${highlight ? "border-orange-100" : "border-slate-100"} rounded-[32px] w-28 h-28 flex flex-col items-center justify-center shadow-sm`}
//   >
//     <span className="text-3xl font-[1000] leading-none mb-1 tracking-tighter">
//       {value || "0"}
//     </span>
//     <span className="text-[10px] font-black uppercase tracking-[2px] opacity-60">
//       {label}
//     </span>
//   </div>
// );

// export default ClaimsStep;
import React, { memo, useMemo, useState } from "react";
import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const ClaimsStep = memo(({ projectId, data, onProceed }) => {
  const [selectClaim, { isLoading }] = useSelectClaimMutation();
  const [localSelected, setLocalSelected] = useState(1);
  const [expandedId, setExpandedId] = useState(1); // Tracks which claim is expanded

  const independentClaims = useMemo(
    () => data?.allClaims?.filter((c) => c.isIndependent) || [],
    [data],
  );

  const handleSelect = (claimNum) => {
    setLocalSelected(claimNum);
    // Expand when selected, collapse if clicked again
    setExpandedId(expandedId === claimNum ? null : claimNum);
  };

  const handleProceed = async () => {
    if (!localSelected) return;
    try {
      await selectClaim({ projectId, claimNumber: localSelected }).unwrap();
      onProceed();
    } catch (err) {
      console.error("Selection failed");
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-fade-in pb-10 max-w-8xl mx-auto">
      {/* 🟢 COMPACT HEADER */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1">
          <div className="bg-[#fff7ed] border border-orange-100 px-3 py-1 rounded-md inline-flex items-center mb-3">
            <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-widest">
              {data?.patentId?.replace(/^patent\/|\/en$/gi, "") ||
                "US9554351B2"}
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#0f172a] mb-1 tracking-tighter">
            Choose one claim
          </h2>
          <p className="text-slate-400 font-bold text-sm leading-tight max-w-md">
            {data?.patentData?.biblioData?.title ||
              "Method for handling radio activities of multiple SIM cards..."}
          </p>
        </div>

        <div className="flex gap-3">
          <StatBox label="TOTAL" value={data?.allClaims?.length || 15} />
          <StatBox
            label="AVAILABLE"
            value={independentClaims.length || 2}
            highlight
          />
          <StatBox
            label="DEPENDENT"
            value={data?.allClaims?.length - independentClaims.length || 13}
          />
        </div>
      </div>

      {/* 🟢 COMPACT & EXPANDABLE CLAIMS LIST */}
      <div className="flex flex-col gap-4">
        {independentClaims.map((claim) => {
          const isSelected = localSelected === claim.number;
          const isExpanded = expandedId === claim.number;

          return (
            <div
              key={claim.number}
              onClick={() => handleSelect(claim.number)}
              className={`cursor-pointer bg-white rounded-[30px] p-6 md:p-8 border-2 transition-all duration-300 relative
                ${isSelected ? "border-[#ff6b00] shadow-lg shadow-orange-100/20" : "border-slate-50 hover:border-slate-200"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-5">
                  {/* Custom Radio */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? "border-[#ff6b00]" : "border-slate-200 bg-white"}`}
                  >
                    {isSelected && (
                      <div className="w-4 h-4 bg-[#ff6b00] rounded-full shadow-[0_0_8px_#ff6b00]" />
                    )}
                  </div>
                  <h4 className="text-2xl font-black text-[#0f172a]">
                    Claim {claim.number}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  {isSelected && (
                    <span className="bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      SELECTED
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-slate-300" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-300" />
                  )}
                </div>
              </div>

              <div className="pl-12">
                <p className="text-[#0f172a] font-bold text-[15px] mb-2 leading-snug">
                  Technical apparatus and method for wireless signal prediction.
                </p>
                <p
                  className={`text-slate-400 font-medium italic text-[15px] leading-relaxed transition-all duration-500
                  ${isExpanded ? "" : "line-clamp-2"}`}
                >
                  "{claim.text}"
                </p>
                {!isExpanded && (
                  <span className="text-[#ff6b00] text-xs font-bold mt-2 inline-block">
                    Read full claim...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟢 FIXED BOTTOM ACTION BAR */}
      <div className="bg-white border border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-[24px] p-5 mt-4 flex justify-between items-center px-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Selection
          </span>
          <span className="font-black text-[#0f172a] text-lg">
            {localSelected
              ? `Claim ${localSelected} is active`
              : "Choose a claim"}
          </span>
        </div>
        <button
          disabled={!localSelected || isLoading}
          onClick={handleProceed}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-2xl font-black text-base flex items-center gap-3 shadow-xl shadow-orange-200 transition-all active:scale-95 disabled:bg-slate-100"
        >
          Continue to Mapping <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
});

/* Small Stat Box Component */
const StatBox = ({ label, value, highlight }) => (
  <div
    className={`${highlight ? "bg-[#fff7ed] text-[#ff6b00] border-orange-50" : "bg-slate-50 text-slate-900 border-slate-100"} border rounded-[20px] w-24 h-20 flex flex-col items-center justify-center shadow-sm`}
  >
    <span className="text-2xl font-black leading-none mb-1 tracking-tighter">
      {value || "0"}
    </span>
    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
      {label}
    </span>
  </div>
);

export default ClaimsStep;
