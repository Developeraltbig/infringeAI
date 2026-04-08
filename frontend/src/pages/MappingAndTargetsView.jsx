// import React, { useState } from 'react';
// import { ArrowRight, Plus, Check } from 'lucide-react';
// import Stepper from '../components/Stepper';
// import { useNavigate } from 'react-router-dom';

// // Mock data for target companies
// const targetCompanies = [
//   { id: 'alphabet', name: 'Alphabet Inc.', desc: 'Google Search Uses Clickthrough Rates To Adjust Result Rankings.', logo: 'A' },
//   { id: 'microsoft', name: 'Microsoft Corporation', desc: 'Bing Search Engine Uses Clickstream Data To Rank Results.', logo: 'M' },
//   { id: 'amazon', name: 'Amazon.com, Inc.', desc: 'A9 Product Search Algorithm Weights Results By User Clicks.', logo: 'a' },
//   { id: 'apple', name: 'Apple Inc.', desc: 'App Store Search Ranks Apps Based On User Selections.', logo: '' },
//   { id: 'meta', name: 'Meta Platforms, Inc.', desc: 'Facebook And Instagram Search Results Influenced By User Clicks.', logo: '∞' },
//   { id: 'netflix', name: 'Netflix, Inc.', desc: 'Content Search Uses Post-Click Viewing Data For Ranking.', logo: 'N' },
//   { id: 'disney', name: 'The Walt Disney Company', desc: 'Disney+ And Hulu Search Ranks Content By User Selections.', logo: 'D' },
//   { id: 'spotify', name: 'Spotify Technology S.A.', desc: 'Music Search Uses Post-Click Plays To Weight Results.', logo: 'S' },
// ];

// const TargetSelection = () => {
//   // State to hold selected company IDs
//   const [selectedIds, setSelectedIds] = useState(['alphabet', 'microsoft', 'amazon']);
//  const navigate = useNavigate();

//   const handleToggle = (id) => {
//     setSelectedIds((prev) => {
//       if (prev.includes(id)) {
//         return prev.filter(item => item !== id); // Deselect
//       } else {
//         if (prev.length >= 3) return prev; // Max 3 selection limit
//         return [...prev, id]; // Select
//       }
//     });
//   };

//   // Get full company objects for the selected banner
//   const selectedCompanies = targetCompanies.filter(c => selectedIds.includes(c.id));

//   return (
//     <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 animate-fade-in pb-12">

//       {/* 1. Interactive Stepper Component */}
//       <Stepper />

//       {/* 2. Top Search Bar */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex w-full md:w-1/2 relative">
//           <input
//             type="text"
//             placeholder="Add Company Manually...."
//             className="w-full border border-gray-200 rounded-lg py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#ff6b00]"
//           />
//           <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#ff6b00] hover:bg-[#e66000] rounded-md text-white flex items-center justify-center transition-colors">
//             <Plus size={18} />
//           </button>
//         </div>

//         <div className="flex items-center gap-4 text-sm text-gray-500 font-medium whitespace-nowrap">
//           <span>Select Min - 1</span>
//           <span className="text-[#ff6b00] h-4 w-[1px] bg-[#ff6b00] opacity-50"></span>
//           <span>Select Max - 3</span>
//         </div>
//       </div>

//       {/* 3. Selected Companies Banner (Shows if > 0 selected) */}
//       <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 ${selectedIds.length > 0 ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>
//         <div className="flex flex-col gap-3">
//           <span className="font-bold text-gray-900">
//             <span className="text-[#ff6b00]">{selectedIds.length}</span> Selected
//           </span>
//           <div className="flex flex-wrap items-center gap-6">
//             {selectedCompanies.map((company) => (
//               <div key={company.id} className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
//                   {company.logo}
//                 </div>
//                 <span className="text-sm text-gray-600">{company.name}</span>
//               </div>
//             ))}
//             {selectedIds.length === 0 && <span className="text-sm text-gray-400">No companies selected yet.</span>}
//           </div>
//         </div>
//         <button
//       onClick={() => selectedIds.length > 0 && navigate('/final-report')} // STEP 4 Action!
//       className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
//         selectedIds.length > 0
//         ? 'bg-[#ff6b00] hover:bg-[#e66000] text-white cursor-pointer'
//         : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//       }`}
//     >
//       Start Analysis
//       <ArrowRight size={16} />
//     </button>
//       </div>

//       {/* 4. Company Grid */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {targetCompanies.map((company) => {
//             const isSelected = selectedIds.includes(company.id);
//             const isDisabled = !isSelected && selectedIds.length >= 3;

//             return (
//               <div
//                 key={company.id}
//                 onClick={() => !isDisabled && handleToggle(company.id)}
//                 className={`border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 ${
//                   isSelected
//                     ? 'border-[#ff6b00] bg-orange-50/30'
//                     : isDisabled
//                       ? 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50'
//                       : 'border-gray-100 hover:border-gray-300 cursor-pointer bg-white'
//                 }`}
//               >
//                 {/* Card Header */}
//                 <div className="flex justify-between items-start gap-3">
//                   <div className="flex items-center gap-3">
//                     {/* Placeholder Logo Box */}
//                     <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700 shrink-0">
//                       {company.logo}
//                     </div>
//                     <span className="text-[15px] font-semibold text-gray-900 leading-tight">
//                       {company.id === 'alphabet' ? 'View Full Claim' : company.name}
//                     </span>
//                   </div>

//                   {/* Custom Checkbox */}
//                   <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors mt-1 ${
//                     isSelected ? 'bg-[#ff6b00]' : 'border border-gray-200 bg-white'
//                   }`}>
//                     {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
//                   </div>
//                 </div>

//                 {/* Card Body */}
//                 <p className="text-gray-500 text-[13px] leading-relaxed">
//                   {company.desc}
//                 </p>
//               </div>
//             );
//           })}
//         </div>

//         {/* Show More Button */}
//         <div className="flex justify-center">
//           <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
//             Show More
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default TargetSelection;
import React, { useState } from "react";

import { Check, ArrowRight, Plus } from "lucide-react";
import Stepper from "../../Stepper";
import { useResumeInteractiveMutation } from "../features/api/interactiveApiSlice";

const MappingAndTargetsView = ({ projectId, data }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [resume] = useResumeInteractiveMutation();

  const handleToggle = (item) => {
    const exists = selectedItems.find((i) => i.company === item.company);
    if (exists)
      setSelectedItems((prev) =>
        prev.filter((i) => i.company !== item.company),
      );
    else if (selectedItems.length < 3)
      setSelectedItems((prev) => [
        ...prev,
        { company: item.company, product: item.product },
      ]);
  };

  return (
    <div className="bg-white rounded-[45px] p-8 md:p-14 shadow-2xl flex flex-col gap-8 max-h-[90vh] overflow-hidden border border-gray-100">
      {/* 🟢 STEPPER (From your Image 2 & 3) */}
      <div className="w-full max-w-2xl mx-auto">
        <Stepper step={3} />
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-12">
        {/* 🟠 IMAGE 2 PART: MAPPING LIST */}
        <section>
          <div className="flex justify-between items-center mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold">Claim Analysis Complete</h2>
            <p className="text-gray-400 text-sm">
              Your claim has been mapped to specifications.
            </p>
          </div>

          <h3 className="text-lg font-bold mb-6 text-gray-400 uppercase tracking-widest px-2">
            Claim Spec Mapping
          </h3>
          <div className="space-y-6">
            {data?.results?.pcrAnalysis?.map((mapping, i) => (
              <div
                key={i}
                className="bg-[#fafbfc] border border-gray-100 rounded-[30px] p-10 grid grid-cols-12 gap-12"
              >
                <div className="col-span-4">
                  <span
                    className="text-6xl font-light text-orange-100 block mb-4"
                    style={{ fontFamily: "serif" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    {mapping.claimElement}
                  </p>
                </div>
                <div className="col-span-8 flex flex-col gap-8 border-l border-gray-200 pl-10">
                  <div>
                    <h5 className="text-[#ff6b00] font-bold text-xs uppercase mb-2">
                      Explanation
                    </h5>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {mapping.specExplanation}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-[#ff6b00] font-bold text-xs uppercase mb-2">
                      Spec Support
                    </h5>
                    <p className="text-sm text-gray-500 italic">
                      "{mapping.specSupport}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🔵 IMAGE 3 PART: TARGET SELECTION */}
        <section className="border-t border-gray-100 pt-12">
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Identify Target Companies</h2>
              <div className="flex gap-4 text-xs font-bold text-gray-400">
                <span>Min 1</span> <span className="text-[#ff6b00]">|</span>{" "}
                <span>Max 3</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  placeholder="Add Company Manually..."
                  className="w-full bg-white border border-gray-200 py-3 px-5 rounded-xl outline-none focus:border-orange-500"
                />
                <button className="absolute right-2 top-2 bg-[#ff6b00] p-1.5 rounded-lg text-white">
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={() => resume({ projectId, selectedItems })}
                disabled={selectedItems.length === 0}
                className="bg-[#ff6b00] text-white px-10 rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                Start Analysis <ArrowRight size={18} className="inline ml-2" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-10">
            {data?.allDiscoveredProducts?.map((item, idx) => {
              const isPicked = selectedItems.some(
                (s) => s.company === item.company,
              );
              return (
                <div
                  key={idx}
                  onClick={() => handleToggle(item)}
                  className={`p-6 rounded-[25px] border-2 cursor-pointer transition-all ${isPicked ? "border-[#ff6b00] bg-orange-50/30 shadow-md" : "border-gray-50 hover:border-gray-200"}`}
                >
                  <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-500">
                      {item.company.charAt(0)}
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${isPicked ? "bg-[#ff6b00]" : "border border-gray-200"}`}
                    >
                      {isPicked && (
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 truncate text-[14px]">
                    {item.company}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 truncate">
                    {item.product}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MappingAndTargetsView;
