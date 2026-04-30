// import React, { useState, useCallback, useMemo, memo } from "react";
// import { Plus, Check, ArrowRight, X, LayoutGrid } from "lucide-react";
// import { useFinalizeInteractiveMutation } from "../../features/api/interactiveApiSlice";
// import Stepper from "../Stepper";
// import { toast } from "react-toastify";

// const TargetSelectionStep = memo(({ projectId, data }) => {
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [manualInput, setManualInput] = useState("");
//   const [visibleCount, setVisibleCount] = useState(8); // For "Show More" logic

//   const [finalize, { isLoading }] = useFinalizeInteractiveMutation();

//   // 🟢 Logic: Toggle selection with 1-3 limit
//   const handleToggle = useCallback((item) => {
//     setSelectedItems((prev) => {
//       const exists = prev.find((i) => i.company === item.company);
//       if (exists) return prev.filter((i) => i.company !== item.company);
//       if (prev.length >= 3) {
//         toast.info("You can select a maximum of 3 companies");
//         return prev;
//       }
//       return [...prev, { company: item.company, product: item.product }];
//     });
//   }, []);

//   // 🟢 Logic: Add Manual Company
//   const handleAddManual = () => {
//     if (!manualInput.trim()) return;
//     if (selectedItems.length >= 3)
//       return toast.info("Maximum 3 companies allowed");

//     const newItem = {
//       company: manualInput.trim(),
//       product: "Custom Product",
//       isManual: true,
//     };
//     setSelectedItems((prev) => [...prev, newItem]);
//     setManualInput("");
//   };

//   const handleStartAnalysis = async () => {
//     try {
//       await finalize({ projectId, selectedItems }).unwrap();
//     } catch (err) {
//       toast.error("Failed to start analysis");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col bg-white gap-6 animate-fade-in pb-12">
//       {/* 1. STEPPER */}
//       <Stepper activeStep={3} />

//       {/* 2. MANUAL ENTRY BAR (Matches Image 3) */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex w-full md:w-1/2 relative group">
//           <input
//             value={manualInput}
//             onChange={(e) => setManualInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
//             type="text"
//             placeholder="Add Company Manually...."
//             className="w-full border border-gray-200 rounded-xl py-3 pl-5 pr-14 text-sm outline-none focus:border-[#ff6b00] transition-all bg-[#fafafa]"
//           />
//           <button
//             onClick={handleAddManual}
//             className="absolute right-2 top-2 bottom-2 aspect-square bg-[#ff6b00] hover:bg-[#e66000] rounded-lg text-white flex items-center justify-center transition-all active:scale-90"
//           >
//             <Plus size={20} strokeWidth={3} />
//           </button>
//         </div>

//         <div className="flex items-center gap-6 text-[12px] text-gray-400 font-bold uppercase tracking-widest">
//           <span>Select Min - 1</span>
//           <div className="h-4 w-[1px] bg-gray-200"></div>
//           <span>Select Max - 3</span>
//         </div>
//       </div>

//       {/* 3. SELECTED BANNER (Matches Image 3) */}
//       <div
//         className={`bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-500 ${selectedItems.length > 0 ? "opacity-100" : "opacity-40 pointer-events-none"}`}
//       >
//         <div className="flex flex-col gap-3">
//           <span className="font-bold text-gray-900 text-lg">
//             <span className="text-[#ff6b00]">{selectedItems.length}</span>{" "}
//             Selected
//           </span>
//           <div className="flex flex-wrap items-center gap-4">
//             {selectedItems.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 animate-scale-up"
//               >
//                 <div className="w-6 h-6 rounded-md bg-[#ff6b00] text-white flex items-center justify-center text-[10px] font-bold">
//                   {item.company.charAt(0)}
//                 </div>
//                 <span className="text-sm font-bold text-gray-700">
//                   {item.company}
//                 </span>
//                 <X
//                   size={14}
//                   className="text-gray-400 cursor-pointer hover:text-red-500"
//                   onClick={() => handleToggle(item)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           disabled={selectedItems.length === 0 || isLoading}
//           onClick={handleStartAnalysis}
//           className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-orange-200 transition-all active:scale-95 disabled:bg-gray-200"
//         >
//           {isLoading ? "Starting AI..." : "Start Analysis"}
//           <ArrowRight size={20} strokeWidth={3} />
//         </button>
//       </div>

//       {/* 4. COMPANY GRID (Matches Image 3) */}
//       <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
//           {data?.allDiscoveredProducts
//             ?.slice(0, visibleCount)
//             .map((company, idx) => {
//               const isSelected = selectedItems.some(
//                 (s) => s.company === company.company,
//               );
//               const isMaxReached = selectedItems.length >= 3 && !isSelected;

//               return (
//                 <div
//                   key={idx}
//                   onClick={() => !isMaxReached && handleToggle(company)}
//                   className={`border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 relative group ${
//                     isSelected
//                       ? "border-[#ff6b00] bg-orange-50/40 shadow-md"
//                       : isMaxReached
//                         ? "opacity-40 cursor-not-allowed grayscale"
//                         : "border-gray-50 hover:border-gray-200 cursor-pointer bg-white"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 group-hover:bg-white transition-colors uppercase">
//                         {company.company.charAt(0)}
//                       </div>
//                       <span className="text-[15px] font-bold text-gray-900 leading-tight truncate w-32">
//                         {company.company}
//                       </span>
//                     </div>

//                     <div
//                       className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
//                         isSelected
//                           ? "bg-[#ff6b00]"
//                           : "border-2 border-gray-100 bg-white"
//                       }`}
//                     >
//                       {isSelected && (
//                         <Check
//                           size={14}
//                           className="text-white"
//                           strokeWidth={4}
//                         />
//                       )}
//                     </div>
//                   </div>

//                   <p className="text-gray-400 text-[12px] font-medium leading-relaxed line-clamp-3">
//                     {company.description}
//                   </p>
//                 </div>
//               );
//             })}
//         </div>

//         {/* Show More Button */}
//         {visibleCount < (data?.allDiscoveredProducts?.length || 0) && (
//           <div className="flex justify-center mt-4">
//             <button
//               onClick={() => setVisibleCount((prev) => prev + 8)}
//               className="bg-gray-900 hover:bg-black text-white px-10 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
//             >
//               Show More Results <ArrowRight size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default TargetSelectionStep;

import React, { useState, useCallback, memo } from "react";
import { Plus, Check, ArrowRight, X } from "lucide-react";
import { useFinalizeInteractiveMutation } from "../../features/api/interactiveApiSlice";
import Stepper from "../Stepper";
import { toast } from "react-toastify";
import CompanyLogo from "../company-logo/CompanyLogo";
// import CompanyLogo from "../CompanyLogo"; // 🚀 Imported Logo Logic

const TargetSelectionStep = memo(({ projectId, data }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const [finalize, { isLoading }] = useFinalizeInteractiveMutation();

  const handleToggle = useCallback((item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.company === item.company);
      if (exists) return prev.filter((i) => i.company !== item.company);
      if (prev.length >= 3) {
        toast.info("You can select a maximum of 3 companies");
        return prev;
      }
      return [...prev, { company: item.company, product: item.product }];
    });
  }, []);

  const handleAddManual = () => {
    if (!manualInput.trim()) return;
    if (selectedItems.length >= 3)
      return toast.info("Maximum 3 companies allowed");

    const newItem = {
      company: manualInput.trim(),
      product: "Custom Product",
      isManual: true,
    };
    setSelectedItems((prev) => [...prev, newItem]);
    setManualInput("");
  };

  const handleStartAnalysis = async () => {
    try {
      await finalize({ projectId, selectedItems }).unwrap();
    } catch (err) {
      toast.error("Failed to start analysis");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white gap-6 animate-fade-in pb-12">
      {/* <Stepper activeStep={4} /> */}

      {/* 2. MANUAL ENTRY BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-1/2 relative group">
          <input
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
            type="text"
            placeholder="Add Company Manually...."
            className="w-full border border-gray-200 rounded-xl py-3 pl-5 pr-14 text-sm outline-none focus:border-[#ff6b00] transition-all bg-[#fafafa]"
          />
          <button
            onClick={handleAddManual}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-[#ff6b00] hover:bg-[#e66000] rounded-lg text-white flex items-center justify-center transition-all active:scale-90"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex items-center gap-6 text-[12px] text-gray-400 font-bold uppercase tracking-widest">
          <span>Select Min - 1</span>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <span>Select Max - 3</span>
        </div>
      </div>

      {/* 3. SELECTED BANNER */}
      <div
        className={`bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-500 ${selectedItems.length > 0 ? "opacity-100" : "opacity-40 pointer-events-none"}`}
      >
        <div className="flex flex-col gap-3">
          <span className="font-bold text-gray-900 text-lg">
            <span className="text-[#ff6b00]">{selectedItems.length}</span>{" "}
            Selected
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {selectedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 animate-scale-up"
              >
                {/* 🚀 LOGO REPLACED INITIALS */}
                <CompanyLogo companyName={item.company} size={24} />

                <span className="text-sm font-bold text-gray-700">
                  {item.company}
                </span>
                <X
                  size={14}
                  className="text-gray-400 cursor-pointer hover:text-red-500"
                  onClick={() => handleToggle(item)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={selectedItems.length === 0 || isLoading}
          onClick={handleStartAnalysis}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-orange-200 transition-all active:scale-95 disabled:bg-gray-200"
        >
          {isLoading ? "Starting AI..." : "Start Analysis"}
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* 4. COMPANY GRID */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {data?.allDiscoveredProducts
            ?.slice(0, visibleCount)
            .map((company, idx) => {
              const isSelected = selectedItems.some(
                (s) => s.company === company.company,
              );
              const isMaxReached = selectedItems.length >= 3 && !isSelected;

              return (
                <div
                  key={idx}
                  onClick={() => !isMaxReached && handleToggle(company)}
                  className={`border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 relative group ${
                    isSelected
                      ? "border-[#ff6b00] bg-orange-50/40 shadow-md"
                      : isMaxReached
                        ? "opacity-40 cursor-not-allowed grayscale"
                        : "border-gray-50 hover:border-gray-200 cursor-pointer bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {/* 🚀 LOGO REPLACED INITIALS */}
                      <CompanyLogo companyName={company.company} size={48} />

                      <span className="text-[15px] font-semibold text-gray-900 leading-tight truncate w-32">
                        {company.company}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#ff6b00]"
                          : "border-2 border-gray-100 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-[12px] font-medium leading-relaxed line-clamp-3">
                    {company.description}
                  </p>
                </div>
              );
            })}
        </div>

        {/* Show More Button */}
        {visibleCount < (data?.allDiscoveredProducts?.length || 0) && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="bg-gray-900 hover:bg-black text-white px-10 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              Show More Results <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default TargetSelectionStep;
