// import React, { useState, useEffect } from "react";
// import { Sparkles, BookA, ClipboardList } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const FeatureCard = ({ icon: Icon, title, description }) => (
//   <div className="bg-[#fafbfc] border border-gray-100 rounded-[14px] p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
//     <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center text-white mb-5 shadow-sm">
//       <Icon size={24} strokeWidth={2} />
//     </div>
//     <h4 className="text-[15px] font-semibold text-gray-900 mb-3">{title}</h4>
//     <p className="text-[13px] text-gray-500 leading-relaxed px-2">
//       {description}
//     </p>
//   </div>
// );

// const ProcessingModal = () => {
//   // --- BACKEND INTEGRATION READY STATES ---
//   // You will update these states via your backend polling or WebSockets
//   const [progress, setProgress] = useState(35); // Starts at 35% ("little completed")
//   const [statusText, setStatusText] = useState(
//     "Identifying Target Product Documentation...",
//   );
//   const [timeRemaining, setTimeRemaining] = useState("1 Minute");
//   const navigate = useNavigate();

//   // Simulated backend progress for demonstration (Remove this when connecting to backend)
//   useEffect(() => {
//     // Fast simulated progress for demonstration
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setStatusText("Analysis Complete! Redirecting...");
//           // STEP 2 Action: Automatically go to Claim Analysis!
//           setTimeout(() => navigate("/analysis-complete"), 600);
//           return 100;
//         }
//         return prev + 25; // Speeding up to 25% jumps for testing
//       });
//     }, 800);

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return (
//     <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
//       <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 px-8 py-14 md:px-16 md:py-16 flex flex-col items-center">
//         <h2 className="text-4xl md:text-[42px] font-bold text-gray-900 mb-4 tracking-tight">
//           Processing Your <span className="text-[#ff6b00]">Patent</span>
//         </h2>

//         <p className="text-gray-500 text-[15px] text-center max-w-3xl leading-relaxed mb-10">
//           Your Interactive Mode Infringement Analysis Is In Progress. We're
//           Thoroughly Examining Potential Infringements Across Multiple Products.
//           This Typically Takes 12 Minutes.
//         </p>

//         {/* Status & Progress Container */}
//         <div className="w-full bg-[#fafbfc] border border-gray-100 rounded-[16px] p-8 md:p-10 flex flex-col items-center mb-8">
//           <span className="text-gray-600 text-[15px] font-medium mb-6 transition-all">
//             {statusText}
//           </span>

//           {/* === DYNAMIC PROGRESS BAR === */}
//           <div className="w-full max-w-3xl h-10 bg-white border border-gray-100 rounded-full p-1 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] mb-8">
//             {/* The Fill Layer */}
//             <div
//               className="h-full bg-[#ff6b00] rounded-full transition-all duration-700 ease-out relative"
//               style={{ width: `${progress}%` }}
//             >
//               {/* Optional: Add a little highlight on the tip of the progress bar to make it pop */}
//               <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full"></div>
//             </div>
//           </div>
//           {/* ============================ */}

//           <div className="text-center flex flex-col gap-2">
//             <span className="text-gray-500 text-[15px]">
//               Estimated Time Remaining:{" "}
//               <span className="text-[#ff6b00] font-semibold">
//                 {timeRemaining}
//               </span>
//             </span>
//             <span className="text-gray-500 text-[14px]">
//               You'll Receive An Email Notification Once The Infringement
//               Analysis Is Complete.
//             </span>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
//           <FeatureCard
//             icon={Sparkles}
//             title="AI-Powered Analysis"
//             description="Advanced Algorithms Examining Claim Elements"
//           />
//           <FeatureCard
//             icon={BookA}
//             title="Evidence Gathering"
//             description="Comprehensive Technical Documentation Search"
//           />
//           <FeatureCard
//             icon={ClipboardList}
//             title="Detailed Reports"
//             description="Complete Claim Charts With Source Citations"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProcessingModal;

import React, { useState, useMemo, memo, useCallback } from "react";
import { Check, ArrowRight, Loader2, Search } from "lucide-react";
import {
  useGetProjectDetailsQuery,
  useGetProjectStatusQuery,
} from "../features/api/projectApiSlice";
import {
  useResumeInteractiveMutation,
  useSelectClaimMutation,
} from "../features/api/interactiveApiSlice";

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: status } = useGetProjectStatusQuery(projectId);
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip: !["claimSelection", "targetSelection"].includes(status?.currentStep),
  });

  const [selectClaim] = useSelectClaimMutation();
  const [resume] = useResumeInteractiveMutation();

  const handleToggle = useCallback((item) => {
    setSelectedCompanies((prev) => {
      const isExist = prev.find((c) => c.company === item.company);
      if (isExist) return prev.filter((c) => c.company !== item.company);
      return prev.length < 3
        ? [...prev, { company: item.company, product: item.product }]
        : prev;
    });
  }, []);

  // 1. CLAIM SELECTION (Image 1 UI)
  if (status?.currentStep === "claimSelection") {
    return (
      <ModalShell
        title="Select Claim to Analyze"
        subtitle="Choose an independent claim"
      >
        <div className="space-y-4">
          {details?.project?.allClaims
            ?.filter((c) => c.isIndependent)
            .map((c) => (
              <div
                key={c.number}
                className="p-6 bg-gray-50 border rounded-2xl flex flex-col gap-4"
              >
                <div className="flex justify-between items-center font-bold">
                  <span>Claim {c.number}</span>
                  <button
                    onClick={() =>
                      selectClaim({ projectId, claimNumber: c.number })
                    }
                    className="bg-[#ff6b00] text-white px-6 py-2 rounded-xl text-sm"
                  >
                    Proceed
                  </button>
                </div>
                <p className="text-sm text-gray-500 italic">"{c.text}"</p>
              </div>
            ))}
        </div>
      </ModalShell>
    );
  }

  // 2. COMPANY SELECTION (Image 2 Style - 50 Companies)
  if (status?.currentStep === "targetSelection") {
    const filtered = details?.project?.allDiscoveredProducts?.filter((p) =>
      p.company.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return (
      <ModalShell
        title="Select Targets"
        subtitle="Pick 1-3 companies for deep analysis"
      >
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl"
            placeholder="Search companies..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filtered?.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleToggle(item)}
              className={`p-4 border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${selectedCompanies.some((c) => c.company === item.company) ? "border-[#ff6b00] bg-orange-50" : "border-gray-50"}`}
            >
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  {item.company}
                </h4>
                <p className="text-[10px] text-gray-400 uppercase font-bold">
                  {item.product}
                </p>
              </div>
              {selectedCompanies.some((c) => c.company === item.company) && (
                <div className="bg-[#ff6b00] rounded-full p-1 text-white">
                  <Check size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            disabled={selectedCompanies.length === 0}
            onClick={() =>
              resume({ projectId, selectedItems: selectedCompanies })
            }
            className="bg-[#0a0a0a] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3"
          >
            Start Analysis <ArrowRight size={20} />
          </button>
        </div>
      </ModalShell>
    );
  }

  // 3. DEFAULT LOADER (Static Processing)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-16 flex flex-col items-center max-w-md shadow-2xl animate-scale-up">
        <Loader2 className="text-[#ff6b00] animate-spin mb-6" size={48} />
        <h2 className="text-2xl font-bold mb-2">Analyzing Patent</h2>
        <p className="text-gray-500 text-sm text-center">
          {status?.currentStepName || "Waking up AI workers..."}
        </p>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-10">
          <div
            className="h-full bg-[#ff6b00] transition-all duration-1000"
            style={{ width: `${status?.progressPercentage || 10}%` }}
          />
        </div>
      </div>
    </div>
  );
});

const ModalShell = ({ title, subtitle, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
    <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] shadow-2xl p-10 flex flex-col animate-scale-up">
      <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
      <p className="text-gray-500 mb-6">{subtitle}</p>
      <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);

export default ProcessingModal;
