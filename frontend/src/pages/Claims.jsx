// import React from 'react';
// import { FileText } from 'lucide-react';

// const Claims = () => {
//   // Mock data representing what would typically come from an API
//   const patentNumber = "US20150173091A1";

//   const stats = [
//     { label: 'Total Claims', value: '22' },
//     { label: 'Independent Claims', value: '03' },
//     { label: 'Dependent Claims', value: '19' },
//   ];

//   const independentClaims = [
//     {
//       id: 1,
//       number: 1,
//       text: "1. A Method, Comprising: Generating, By A Network Entity, At Least One Performance Map Showing Performance For Different Portions Of Spectrum In A Wideband Radio System; Combining The At Least One Performance Map With Dynamic Information; And Selecti..."
//     },
//     {
//       id: 2,
//       number: 11,
//       text: "1. A Method, Comprising: Generating, By A Network Entity, At Least One Performance Map Showing Performance For Different Portions Of Spectrum In A Wideband Radio System; Combining The At Least One Performance Map With Dynamic Information; And Selecti..."
//     }
//   ];

//   return (
//     <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">

//       {/* 1. Header Card */}
//       <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row justify-between items-center gap-4">
//         <h2 className="text-[18px] font-semibold text-gray-900">
//           Select Claim To Analyse
//         </h2>

//         <div className="flex items-center gap-2 text-gray-500 text-[15px]">
//           {/* Custom SVG to match the solid orange document icon in the image perfectly */}
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff6b00" xmlns="http://www.w3.org/2000/svg">
//             <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
//             <path fillRule="evenodd" clipRule="evenodd" d="M14 2V8H20L14 2Z" fill="#e66000"/>
//           </svg>
//           {patentNumber}
//         </div>
//       </div>

//       {/* 2. Stats Row Card */}
//       <div className="bg-white rounded-[14px] border border-gray-100 p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-wrap items-center gap-4">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="border border-gray-100 rounded-full px-6 py-2.5 flex items-center gap-3 bg-[#fafafa]"
//           >
//             <span className="text-[#ff6b00] font-semibold text-[18px]">{stat.value}</span>
//             <span className="text-gray-500 text-[14px]">{stat.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* 3. Claims List Card */}
//       <div className="bg-white rounded-[14px] border border-gray-100 p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
//         <h3 className="text-[18px] font-bold text-gray-900 mb-6">
//           Independent Claims
//         </h3>

//         <div className="flex flex-col gap-5">
//           {independentClaims.map((claim) => (
//             <div
//               key={claim.id}
//               className="bg-[#fafbfc] border border-gray-100 rounded-xl p-6 flex flex-col transition-colors hover:bg-gray-50"
//             >
//               {/* Claim Header Row */}
//               <div className="flex items-center gap-6 mb-4">
//                 <span className="font-medium text-gray-900 text-[15px]">
//                   Claim {claim.number}
//                 </span>
//                 <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-2 rounded-md text-[14px] font-medium transition-colors">
//                   Proceed
//                 </button>
//               </div>

//               {/* Claim Text */}
//               <p className="text-gray-500 text-[14px] leading-relaxed pr-4">
//                 {claim.text}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Claims;
import React, { memo } from "react";
import { useSelectClaimMutation } from "../features/api/interactiveApiSlice";

const Claims = memo(({ projectId, data }) => {
  const [selectClaim, { isLoading }] = useSelectClaimMutation();

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Select Claim To Analyse
        </h2>
        <div className="flex gap-2 text-gray-500 font-bold items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="w-4 h-4 bg-[#ff6b00] rounded-sm italic flex items-center justify-center text-white text-[10px]">
            P
          </div>
          {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-10">
        <StatPill label="Total Claims" value={data?.allClaims?.length} />
        <StatPill
          label="Independent"
          value={data?.allClaims?.filter((c) => c.isIndependent).length}
          color="text-[#ff6b00]"
        />
        <StatPill
          label="Dependent"
          value={data?.allClaims?.filter((c) => !c.isIndependent).length}
        />
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {data?.allClaims
          ?.filter((c) => c.isIndependent)
          .map((claim) => (
            <div
              key={claim.number}
              className="bg-[#fafbfc] border border-gray-100 p-8 rounded-[25px] flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Claim {claim.number}</span>
                <button
                  onClick={() =>
                    selectClaim({ projectId, claimNumber: claim.number })
                  }
                  className="bg-[#ff6b00] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all active:scale-95"
                >
                  Proceed
                </button>
              </div>
              <p className="text-gray-500 italic text-sm leading-relaxed">
                "{claim.text}"
              </p>
            </div>
          ))}
      </div>
    </div>
  );
});

const StatPill = ({ label, value, color = "text-gray-900" }) => (
  <div className="bg-white border border-gray-100 rounded-full px-6 py-3 flex items-center gap-3 shadow-sm">
    <span className={`text-xl font-bold ${color}`}>{value || 0}</span>
    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

export default Claims;
