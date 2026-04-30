// import React, { memo, useMemo } from "react";
// import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";

// const ClaimsStep = memo(({ projectId, data, onProceed }) => {
//   const [selectClaim, { isLoading }] = useSelectClaimMutation();

//   // 💡 Filter independent claims dynamically from your 20-claim array
//   const independentClaims = useMemo(
//     () => data?.allClaims?.filter((c) => c.isIndependent) || [],
//     [data],
//   );

//   const handleSelect = async (claimNumber) => {
//     try {
//       await selectClaim({ projectId, claimNumber }).unwrap();
//       onProceed(); // Tell parent to start polling again
//     } catch (err) {
//       console.error("Selection failed");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col gap-6 bg-white animate-fade-in pb-10">
//       {/* 1. Header Card - Pixel Perfect to your Image */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
//         <h2 className="text-lg font-bold text-gray-900">
//           Select Claim To Analyse
//         </h2>
//         <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
//           <OrangeDocIcon />
//           {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
//         </div>
//       </div>

//       {/* 2. Stats Pill Row */}
//       <div className="flex flex-wrap gap-4">
//         <StatPill label="Total Claims" value={data?.allClaims?.length} />
//         <StatPill
//           label="Independent Claims"
//           value={independentClaims.length}
//           highlight
//         />
//         <StatPill
//           label="Dependent Claims"
//           value={data?.allClaims?.length - independentClaims.length}
//         />
//       </div>

//       {/* 3. Independent Claims Container */}
//       <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
//         <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">
//           Independent Claims
//         </h3>

//         <div className="space-y-6">
//           {independentClaims.map((claim) => (
//             <div
//               key={claim.number}
//               className="bg-[#fafbfc] border border-gray-50 rounded-[24px] p-8 hover:border-orange-200 transition-all group"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <span className="font-bold text-gray-800 text-lg">
//                   Claim {claim.number}
//                 </span>
//                 <button
//                   disabled={isLoading}
//                   onClick={() => handleSelect(claim.number)}
//                   className="bg-[#ff6b00] text-white px-10 py-2.5 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:bg-gray-300"
//                 >
//                   {isLoading ? "Wait..." : "Proceed"}
//                 </button>
//               </div>
//               <p className="text-gray-500 italic text-[15px] leading-relaxed pr-10">
//                 "{claim.text}"
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// });

// // Helper Components
// const StatPill = ({ label, value, highlight }) => (
//   <div className="bg-white border border-gray-100 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-sm">
//     <span
//       className={`text-xl font-black ${highlight ? "text-[#ff6b00]" : "text-gray-900"}`}
//     >
//       {value || "00"}
//     </span>
//     <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
//       {label}
//     </span>
//   </div>
// );

// const OrangeDocIcon = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="#ff6b00"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
//     <path
//       fillRule="evenodd"
//       clipRule="evenodd"
//       d="M14 2V8H20L14 2Z"
//       fill="#e66000"
//     />
//   </svg>
// );

// export default ClaimsStep;
import React, { memo, useState, useCallback, useMemo } from "react";
import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";
import { Check, ArrowRight } from "lucide-react";

const ClaimsStep = memo(({ projectId, data, onProceed }) => {
  const [selectedNum, setSelectedNum] = useState(null);
  const [expandedClaims, setExpandedClaims] = useState({}); // Track "View More" states

  const [selectClaim, { isLoading }] = useSelectClaimMutation();

  const independentClaims = useMemo(
    () => data?.allClaims?.filter((c) => c.isIndependent) || [],
    [data],
  );

  const toggleExpand = (num) => {
    setExpandedClaims((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const handleProceed = async () => {
    if (!selectedNum) return;
    try {
      const res = await selectClaim({
        projectId,
        claimNumber: selectedNum,
      }).unwrap();
      onProceed(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-24">
      {/* --- HEADER CARD --- */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left flex-1">
          <span className="bg-orange-50 text-[#ff6b00] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
            {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
          </span>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
            Choose one claim
          </h2>
          {/* <p className="text-gray-400 text-[14px] font-medium tracking-tight">
            AI/ML Based Mobility Related Prediction for Handover
          </p> */}
        </div>

        {/* Stats Pills */}
        <div className="flex gap-3">
          <StatBox label="Total" val={data?.allClaims?.length} />
          <StatBox
            label="Available"
            val={independentClaims.length}
            color="text-[#ff6b00]"
            bg="bg-orange-50"
          />
          <StatBox
            label="Dependent"
            val={data?.allClaims?.length - independentClaims.length}
          />
        </div>
      </div>

      {/* --- CLAIMS LIST --- */}
      <div className="flex flex-col gap-4">
        {independentClaims.map((claim) => {
          const isSelected = selectedNum === claim.number;
          const isExpanded = expandedClaims[claim.number];
          const textPreview = claim.text.slice(0, 250);

          return (
            <div
              key={claim.number}
              onClick={() => setSelectedNum(claim.number)}
              className={`bg-white rounded-[30px] border-2 transition-all duration-300 p-8 cursor-pointer relative group ${
                isSelected
                  ? "border-[#ff6b00] shadow-lg"
                  : "border-transparent shadow-sm hover:border-gray-200"
              }`}
            >
              <div className="flex gap-6">
                {/* Custom Radio Button */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                    isSelected
                      ? "border-[#ff6b00] bg-[#ff6b00]"
                      : "border-gray-200 group-hover:border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xl font-black text-gray-900">
                      Claim {claim.number}
                    </h4>
                    {isSelected && (
                      <span className="bg-[#ff6b00] text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-scale-up">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-gray-800 font-bold text-[15px] leading-relaxed mb-3">
                    Technical implementation of the independent claim elements.
                  </p>

                  <div className="text-gray-400 text-[14px] leading-relaxed italic">
                    "{isExpanded ? claim.text : textPreview}..."
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(claim.number);
                      }}
                      className="ml-2 text-[#ff6b00] font-black uppercase text-[11px] tracking-widest hover:underline"
                    >
                      {isExpanded ? "View Less" : "View More"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- STICKY FOOTER ACTION --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-5xl px-10 pointer-events-none">
        <div
          className={`bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[28px] p-6 shadow-2xl flex justify-between items-center transition-all duration-500 pointer-events-auto ${selectedNum ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <span className="text-gray-900 font-black text-sm uppercase tracking-widest ml-4">
            Claim {selectedNum} selected
          </span>
          <button
            onClick={handleProceed}
            disabled={isLoading}
            className="bg-[#ff6b00] text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:bg-orange-600 transition-all active:scale-95"
          >
            {isLoading ? "Analyzing..." : "Continue to Mapping"}{" "}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
});

const StatBox = ({
  label,
  val,
  color = "text-gray-900",
  bg = "bg-[#fafbfc]",
}) => (
  <div
    className={`${bg} border border-gray-100 rounded-2xl py-4 px-8 flex flex-col items-center min-w-[100px]`}
  >
    <span className={`text-2xl font-black ${color}`}>{val || 0}</span>
    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
      {label}
    </span>
  </div>
);

export default ClaimsStep;
