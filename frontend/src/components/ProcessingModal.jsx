// import React, { memo, useMemo, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Sparkles,
//   BookA,
//   ClipboardList,
//   ArrowRight,
//   Check,
//   Search,
//   Loader2,
//   AlertCircle, // Added for failure icon
// } from "lucide-react";
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import {
//   useSelectClaimMutation,
//   useResumeInteractiveMutation,
// } from "../features/api/interactiveApiSlice";

// const ProcessingModal = memo(({ projectId, onClose }) => {
//   const navigate = useNavigate();
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 1. 🔌 API SYNC
//   const { data: status, isError: isApiError } = useGetProjectStatusQuery(
//     projectId,
//     {
//       skip: !projectId,
//       pollingInterval: 9000,
//     },
//   );

//   const { data: details } = useGetProjectDetailsQuery(projectId, {
//     skip:
//       !projectId ||
//       (status?.status !== "completed" &&
//         !["claimSelection", "targetSelection"].includes(status?.currentStep)),
//   });

//   const [selectClaim] = useSelectClaimMutation();
//   const [resumeDeepDive] = useResumeInteractiveMutation();

//   // 2. 🧠 MEMOIZED VALUES
//   const progress = useMemo(() => status?.progressPercentage || 5, [status]);
//   const isComplete = useMemo(() => status?.status === "completed", [status]);

//   // 🔴 NEW LOGIC: Detect failure
//   const isFailed = useMemo(
//     () => status?.status === "failed" || isApiError,
//     [status, isApiError],
//   );

//   const cleanId = useMemo(
//     () => status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...",
//     [status],
//   );

//   // 3. 🟢 REDIRECT LOGIC
//   useEffect(() => {
//     if (isComplete) {
//       const timer = setTimeout(() => {
//         onClose();
//         navigate(`/dashboard/report-view/${projectId}`);
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [isComplete, navigate, projectId, onClose]);

//   if (!projectId)
//     return (
//       <ModalContainer>
//         <div className="flex flex-col items-center p-20 animate-pulse">
//           <Loader2 className="text-[#ff6b00] animate-spin mb-6" size={48} />
//           <h2 className="text-2xl font-bold">Connecting to AI Engine...</h2>
//         </div>
//       </ModalContainer>
//     );

//   // 🔴 NEW STATE: FAILURE HANDLING
//   // This ensures the loader stops if the backend marks the project as failed
//   if (isFailed) {
//     return (
//       <ModalContainer
//         title="Analysis Failed"
//         subtitle="Something went wrong during processing"
//       >
//         <div className="flex flex-col items-center p-10 text-center">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
//             <AlertCircle size={40} className="text-red-500" />
//           </div>
//           <p className="text-gray-600 mb-8 max-w-sm">
//             {status?.failureReason ||
//               "The patent analysis could not be completed. Please check the patent ID and try again."}
//           </p>
//           <button
//             onClick={onClose}
//             className="bg-gray-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition-all"
//           >
//             Close & Retry
//           </button>
//         </div>
//       </ModalContainer>
//     );
//   }

//   // 🟠 STATE 2: CLAIM SELECTION (Interactive Step 1)
//   if (status?.currentStep === "claimSelection") {
//     return (
//       <ModalContainer
//         title="Select Claim to Analyse"
//         subtitle="Choose one independent claim to proceed"
//       >
//         <div className="grid gap-4 pr-2">
//           {details?.project?.allClaims
//             ?.filter((c) => c.isIndependent)
//             .map((claim) => (
//               <div
//                 key={claim.number}
//                 className="bg-[#fafbfc] border border-gray-100 p-6 rounded-[25px] flex flex-col gap-4"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-lg">
//                     Claim {claim.number}
//                   </span>
//                   <button
//                     onClick={() =>
//                       selectClaim({ projectId, claimNumber: claim.number })
//                     }
//                     className="bg-[#ff6b00] text-white px-8 py-2 rounded-xl font-bold text-sm"
//                   >
//                     Proceed
//                   </button>
//                 </div>
//                 <p className="text-sm text-gray-500 italic line-clamp-3 leading-relaxed">
//                   "{claim.text}"
//                 </p>
//               </div>
//             ))}
//         </div>
//       </ModalContainer>
//     );
//   }

//   // 🟡 STATE 3: TARGET SELECTION
//   if (status?.currentStep === "targetSelection") {
//     const filtered = details?.project?.allDiscoveredProducts?.filter((c) =>
//       c.company.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//     return (
//       <ModalContainer
//         title="Select Target Companies"
//         subtitle={`Pick up to 3 for deep analysis from ${details?.project?.allDiscoveredProducts?.length} targets`}
//       >
//         <div className="relative mb-6">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={18}
//           />
//           <input
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#ff6b00]"
//             placeholder="Search 50 companies..."
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
//           {filtered?.map((item, idx) => (
//             <div
//               key={idx}
//               onClick={() => toggleSelection(item)}
//               className={`p-5 rounded-[20px] border-2 cursor-pointer flex justify-between items-center transition-all ${selectedItems.some((c) => c.company === item.company) ? "border-[#ff6b00] bg-orange-50" : "border-gray-50 bg-white"}`}
//             >
//               <div>
//                 <h4 className="font-bold text-sm text-gray-900">
//                   {item.company}
//                 </h4>
//                 <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
//                   {item.product}
//                 </p>
//               </div>
//               {selectedItems.some((c) => c.company === item.company) && (
//                 <div className="bg-[#ff6b00] rounded-full p-1 text-white">
//                   <Check size={12} strokeWidth={4} />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="mt-8 flex justify-end">
//           <button
//             disabled={selectedItems.length === 0}
//             onClick={() => resumeDeepDive({ projectId, selectedItems })}
//             className="bg-[#0a0a0a] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 transition-all"
//           >
//             Start Deep Analysis <ArrowRight size={20} />
//           </button>
//         </div>
//       </ModalContainer>
//     );
//   }

//   // ⚪ STATE 1: PROCESSING (Image 2)
//   if (!isComplete) {
//     return (
//       <ModalContainer>
//         <div className="p-8 md:p-20 flex flex-col items-center text-center">
//           <h2 className="text-4xl md:text-[54px] font-black text-gray-900 mb-4 tracking-tighter">
//             Processing Your <span className="text-[#ff6b00]">Patent</span>
//           </h2>
//           <p className="text-gray-400 text-[15px] max-w-2xl mb-12">
//             Analysis is in progress. We're examining potential infringements.
//             This typically takes 12 minutes.
//           </p>
//           <div className="w-full bg-[#fafbfc] border rounded-[30px] p-10 flex flex-col items-center mb-10">
//             <span className="text-gray-400 font-bold uppercase tracking-[2px] text-[11px] mb-6">
//               {status?.currentStepName || "Waking up AI Workers..."}
//             </span>
//             <div className="w-full max-w-2xl h-11 bg-white border rounded-full p-1.5 shadow-inner mb-6">
//               <div
//                 className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <p className="text-gray-500 font-medium text-sm">
//               Estimated Time Remaining:{" "}
//               <span className="text-[#ff6b00] font-bold">~2 Minutes</span>
//             </p>
//           </div>
//           <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
//             <FeatureCard
//               icon={Sparkles}
//               title="AI Analysis"
//               text="Advanced Algorithms"
//             />
//             <FeatureCard
//               icon={BookA}
//               title="Evidence Gathering"
//               text="Documentation Search"
//             />
//             <FeatureCard
//               icon={ClipboardList}
//               title="Detailed Reports"
//               text="Claim Charts"
//             />
//           </div>
//         </div>
//       </ModalContainer>
//     );
//   }

//   // 🔵 STATE 4: COMPLETE (Image 3)
//   return (
//     <ModalContainer>
//       <div className="p-8 md:p-20 flex flex-col items-center text-center">
//         <h2 className="text-4xl md:text-[54px] font-black text-gray-900 mb-6 tracking-tighter leading-tight">
//           Infringement Analysis{" "}
//           <span className="text-[#ff6b00]">Complete!</span>
//         </h2>
//         <div className="w-full max-w-2xl bg-[#fafbfc] border rounded-[35px] p-12 flex flex-col items-center shadow-sm">
//           <h3 className="text-[#ff6b00] font-black tracking-[4px] text-[13px] mb-10 uppercase">
//             Analysis Ready
//           </h3>
//           <div className="bg-white border border-gray-100 p-10 rounded-[25px] w-full max-w-sm shadow-sm flex flex-col items-center mb-10">
//             <span className="text-3xl font-black text-gray-900 mb-1">
//               {cleanId}
//             </span>
//             <span className="text-gray-400 font-bold uppercase text-xs">
//               {details?.project?.patentData?.biblioData?.title ||
//                 "Search Engine Technology"}
//             </span>
//           </div>
//           <button
//             onClick={() => {
//               onClose();
//               navigate(`/dashboard/report-view/${projectId}`);
//             }}
//             className="bg-[#ff6b00] text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:shadow-xl transition-all active:scale-95"
//           >
//             View Report <ArrowRight size={22} />
//           </button>
//         </div>
//       </div>
//     </ModalContainer>
//   );
// });

// // Layout Wrapper (Unchanged)
// const ModalContainer = ({ title, subtitle, children }) => (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6]/95 backdrop-blur-md p-4 ">
//     <div className="bg-white rounded-[15px] border border-gray-100 w-full max-w-5xl my-auto animate-scale-up overflow-hidden">
//       {title && (
//         <div className="px-10 pt-12 shrink-0 text-center">
//           <h2 className="text-3xl font-black text-gray-900">{title}</h2>
//           <p className="text-gray-500 font-medium">{subtitle}</p>
//         </div>
//       )}
//       <div className="px-10 py-8">{children}</div>
//     </div>
//   </div>
// );

// const FeatureCard = ({ icon: Icon, title, text }) => (
//   <div className="bg-[#fafbfc] border border-gray-50 p-6 rounded-[25px] flex flex-col items-center group hover:bg-white transition-all">
//     <div className="w-11 h-11 bg-[#ff6b00] rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:rotate-6 transition-transform">
//       <Icon size={22} />
//     </div>
//     <h4 className="text-gray-900 font-bold text-[14px] mb-1">{title}</h4>
//     <p className="text-[12px] text-gray-400 font-medium">{text}</p>
//   </div>
// );

// export default ProcessingModal;

// import React, { useState, memo, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Sparkles,
//   BookA,
//   ClipboardList,
//   ArrowRight,
//   Check,
//   Search,
//   Loader2,
// } from "lucide-react";
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import {
//   useSelectInteractiveClaimMutation,
//   useFinalizeInteractiveTargetsMutation,
// } from "../features/api/interactiveApiSlice";

// const ProcessingModal = memo(({ projectId, onClose }) => {
//   const navigate = useNavigate();
//   const [selectedProducts, setSelectedProducts] = useState([]); // Stores {company, product}
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔌 Polling Status (Checks every 3s)
//   const { data: status } = useGetProjectStatusQuery(projectId, {
//     pollingInterval: 3000,
//   });

//   // 🔌 Fetch Details (Only when AI has generated lists)
//   const { data: details } = useGetProjectDetailsQuery(projectId, {
//     skip:
//       !["claimSelection", "targetSelection"].includes(status?.currentStep) &&
//       status?.status !== "completed",
//   });

//   const [selectClaim] = useSelectInteractiveClaimMutation();
//   const [finalizeTargets] = useFinalizeInteractiveTargetsMutation();

//   // 🟢 Logic: Toggle Product Choice
//   const toggleProduct = (item) => {
//     const isExist = selectedProducts.find((p) => p.company === item.company);
//     if (isExist)
//       setSelectedProducts((prev) =>
//         prev.filter((p) => p.company !== item.company),
//       );
//     else if (selectedProducts.length < 3)
//       setSelectedProducts((prev) => [
//         ...prev,
//         { company: item.company, product: item.product },
//       ]);
//   };

//   if (!status) return null;

//   // ==========================================
//   // VIEW 1: CLAIM SELECTION (Image 1 UI)
//   // ==========================================
//   if (status.currentStep === "claimSelection") {
//     return (
//       <WizardShell
//         title="Select Claim to Analyse"
//         subtitle="Pick one independent claim to proceed"
//       >
//         <div className="grid gap-4 mt-6">
//           {details?.project?.allClaims
//             ?.filter((c) => c.isIndependent)
//             .map((claim) => (
//               <div
//                 key={claim.number}
//                 className="bg-[#fafbfc] border border-gray-100 p-8 rounded-[25px] flex flex-col gap-5"
//               >
//                 <div className="flex justify-between items-center">
//                   <span className="text-xl font-bold text-gray-900">
//                     Claim {claim.number}
//                   </span>
//                   <button
//                     onClick={() =>
//                       selectClaim({ projectId, claimNumber: claim.number })
//                     }
//                     className="bg-[#ff6b00] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all"
//                   >
//                     Proceed
//                   </button>
//                 </div>
//                 <p className="text-gray-500 italic text-[15px] line-clamp-3 leading-relaxed">
//                   "{claim.text}"
//                 </p>
//               </div>
//             ))}
//         </div>
//       </WizardShell>
//     );
//   }

//   // ==========================================
//   // VIEW 2: TARGET SELECTION (50 Company Grid)
//   // ==========================================
//   if (status.currentStep === "targetSelection") {
//     const filtered =
//       details?.project?.allDiscoveredProducts?.filter((c) =>
//         c.company.toLowerCase().includes(searchTerm.toLowerCase()),
//       ) || [];

//     return (
//       <WizardShell
//         title="Select Target Products"
//         subtitle={`Identify the most likely infringers (Max 3)`}
//       >
//         <div className="relative mb-6">
//           <Search
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <input
//             className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#ff6b00]"
//             placeholder="Search companies..."
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//           {filtered.map((item, idx) => (
//             <div
//               key={idx}
//               onClick={() => toggleProduct(item)}
//               className={`p-5 rounded-[22px] border-2 cursor-pointer flex justify-between items-center transition-all ${
//                 selectedProducts.some((p) => p.company === item.company)
//                   ? "border-[#ff6b00] bg-orange-50"
//                   : "border-gray-50 bg-white hover:border-gray-200"
//               }`}
//             >
//               <div className="flex-1 min-w-0 pr-4">
//                 <h4 className="font-bold text-gray-900 truncate">
//                   {item.company}
//                 </h4>
//                 <p className="text-[11px] text-gray-400 font-bold uppercase mt-0.5 truncate tracking-wider">
//                   {item.product}
//                 </p>
//               </div>
//               {selectedProducts.some((p) => p.company === item.company) && (
//                 <div className="bg-[#ff6b00] rounded-full p-1 text-white shrink-0 shadow-lg">
//                   <Check size={14} strokeWidth={4} />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="mt-10 flex justify-end">
//           <button
//             disabled={selectedProducts.length === 0}
//             onClick={() =>
//               finalizeTargets({ projectId, selectedItems: selectedProducts })
//             }
//             className="bg-[#0a0a0a] text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-3 active:scale-95 transition-all shadow-xl disabled:bg-gray-200"
//           >
//             Start Deep Dive <ArrowRight size={20} />
//           </button>
//         </div>
//       </WizardShell>
//     );
//   }

//   // ==========================================
//   // VIEW 3: LOADING OR COMPLETE (Original UI logic)
//   // ==========================================
//   const isComplete = status.status === "completed";
//   const progress = status.progressPercentage || 10;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6]/95 backdrop-blur-md p-4 overflow-y-auto">
//       <div className="w-full max-w-5xl my-auto animate-scale-up">
//         <div className="bg-white rounded-[45px] shadow-2xl border border-gray-100 p-8 md:p-20 flex flex-col items-center text-center">
//           {!isComplete ? (
//             <>
//               <h2 className="text-5xl font-bold mb-4 tracking-tighter">
//                 Processing Your <span className="text-[#ff6b00]">Patent</span>
//               </h2>
//               <div className="w-full bg-[#fafbfc] border rounded-[30px] p-10 mt-6 flex flex-col items-center">
//                 <span className="text-gray-400 font-bold uppercase tracking-[2px] text-[11px] mb-8">
//                   {status.currentStepName}
//                 </span>
//                 <div className="w-full max-w-2xl h-11 bg-white border rounded-full p-1.5 shadow-inner mb-6">
//                   <div
//                     className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <h2 className="text-5xl font-bold mb-6 tracking-tighter">
//                 Analysis <span className="text-[#ff6b00]">Complete!</span>
//               </h2>
//               <div className="bg-[#fafbfc] border p-12 rounded-[35px] w-full max-w-2xl flex flex-col items-center shadow-sm">
//                 <div className="bg-white border p-10 rounded-[25px] w-full mb-10">
//                   <span className="text-3xl font-black">
//                     {status.patentId?.replace(/^patent\/|\/en$/gi, "")}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => {
//                     onClose();
//                     navigate(`/dashboard/report-view/${projectId}`);
//                   }}
//                   className="bg-[#ff6b00] text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 active:scale-95 shadow-xl"
//                 >
//                   View Report <ArrowRight size={22} />
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// // Layout Helper for Wizard Steps
// const WizardShell = ({ title, subtitle, children }) => (
//   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6]/95 backdrop-blur-md p-4">
//     <div className="bg-white rounded-[45px] shadow-2xl border border-gray-100 w-full max-w-5xl max-h-[85vh] p-12 md:p-20 flex flex-col animate-scale-up">
//       <div className="shrink-0 mb-6">
//         <h2 className="text-4xl font-bold text-gray-900 tracking-tighter">
//           {title}
//         </h2>
//         <p className="text-gray-400 font-medium text-lg">{subtitle}</p>
//       </div>
//       <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
//     </div>
//   </div>
// );

// export default ProcessingModal;

import React, { memo, useState, lazy, Suspense, useMemo } from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";

// 🚀 Lazy loaded views for maximum performance
const ClaimsView = lazy(() => import("../pages/Claims"));
const MappingAndTargetsView = lazy(
  () => import("../pages/MappingAndTargetsView"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("../pages/SuccessState"));

const ProcessingModal = memo(({ projectId, onClose }) => {
  // 1. Polling for step updates
  const { data: status } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });

  // 2. Fetch full data only when on specific selection steps
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      !["claimSelection", "targetSelection", "completed"].includes(
        status?.currentStep,
      ),
  });

  if (!status) return null;

  const renderUI = () => {
    if (status.status === "completed")
      return (
        <SuccessState
          projectId={projectId}
          data={details?.project}
          onClose={onClose}
        />
      );

    switch (status.currentStep) {
      case "claimSelection":
        return <ClaimsView projectId={projectId} data={details?.project} />;

      case "targetSelection":
        return (
          <MappingAndTargetsView
            projectId={projectId}
            data={details?.project}
          />
        );

      default:
        // Use Image 4 loader for initializing, generatingMapping, and productProcessing
        return <ProcessingState status={status} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf9f6]/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-6xl my-auto animate-scale-up">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
            </div>
          }
        >
          {renderUI()}
        </Suspense>
      </div>
    </div>
  );
});

export default ProcessingModal;
