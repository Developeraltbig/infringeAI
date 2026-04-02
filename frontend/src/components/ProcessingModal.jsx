import React, { useState, useEffect } from "react";
import { Sparkles, BookA, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#fafbfc] border border-gray-100 rounded-[14px] p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
    <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center text-white mb-5 shadow-sm">
      <Icon size={24} strokeWidth={2} />
    </div>
    <h4 className="text-[15px] font-semibold text-gray-900 mb-3">{title}</h4>
    <p className="text-[13px] text-gray-500 leading-relaxed px-2">
      {description}
    </p>
  </div>
);

const ProcessingModal = () => {
  // --- BACKEND INTEGRATION READY STATES ---
  // You will update these states via your backend polling or WebSockets
  const [progress, setProgress] = useState(35); // Starts at 35% ("little completed")
  const [statusText, setStatusText] = useState(
    "Identifying Target Product Documentation...",
  );
  const [timeRemaining, setTimeRemaining] = useState("1 Minute");
  const navigate = useNavigate();

  // Simulated backend progress for demonstration (Remove this when connecting to backend)
  useEffect(() => {
    // Fast simulated progress for demonstration
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText("Analysis Complete! Redirecting...");
          // STEP 2 Action: Automatically go to Claim Analysis!
          setTimeout(() => navigate("/analysis-complete"), 600);
          return 100;
        }
        return prev + 25; // Speeding up to 25% jumps for testing
      });
    }, 800);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 px-8 py-14 md:px-16 md:py-16 flex flex-col items-center">
        <h2 className="text-4xl md:text-[42px] font-bold text-gray-900 mb-4 tracking-tight">
          Processing Your <span className="text-[#ff6b00]">Patent</span>
        </h2>

        <p className="text-gray-500 text-[15px] text-center max-w-3xl leading-relaxed mb-10">
          Your Interactive Mode Infringement Analysis Is In Progress. We're
          Thoroughly Examining Potential Infringements Across Multiple Products.
          This Typically Takes 12 Minutes.
        </p>

        {/* Status & Progress Container */}
        <div className="w-full bg-[#fafbfc] border border-gray-100 rounded-[16px] p-8 md:p-10 flex flex-col items-center mb-8">
          <span className="text-gray-600 text-[15px] font-medium mb-6 transition-all">
            {statusText}
          </span>

          {/* === DYNAMIC PROGRESS BAR === */}
          <div className="w-full max-w-3xl h-10 bg-white border border-gray-100 rounded-full p-1 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] mb-8">
            {/* The Fill Layer */}
            <div
              className="h-full bg-[#ff6b00] rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Optional: Add a little highlight on the tip of the progress bar to make it pop */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
          {/* ============================ */}

          <div className="text-center flex flex-col gap-2">
            <span className="text-gray-500 text-[15px]">
              Estimated Time Remaining:{" "}
              <span className="text-[#ff6b00] font-semibold">
                {timeRemaining}
              </span>
            </span>
            <span className="text-gray-500 text-[14px]">
              You'll Receive An Email Notification Once The Infringement
              Analysis Is Complete.
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Sparkles}
            title="AI-Powered Analysis"
            description="Advanced Algorithms Examining Claim Elements"
          />
          <FeatureCard
            icon={BookA}
            title="Evidence Gathering"
            description="Comprehensive Technical Documentation Search"
          />
          <FeatureCard
            icon={ClipboardList}
            title="Detailed Reports"
            description="Complete Claim Charts With Source Citations"
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;

// import React, { useEffect, useMemo, memo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetProjectStatusQuery } from "../features/api/patentApiSlice";

// const ProcessingModal = memo(({ projectId, onClose }) => {
//   const navigate = useNavigate();

//   // 1. Polling: RTK Query automatically fetches every 3s based on your slice config
//   const { data } = useGetProjectStatusQuery(projectId, {
//     skip: !projectId,
//     pollingInterval: 3000,
//   });

//   // 2. Logic: Redirect when status is completed
//   useEffect(() => {
//     if (data?.status === "completed") {
//       onClose(); // Clear the state in parent
//       navigate(`/dashboard/report-view/${projectId}`, { replace: true });
//     }
//   }, [data, navigate, projectId, onClose]);

//   if (!projectId) return null;

//   const progress = useMemo(() => data?.progressPercentage || 10, [data]);

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
//       <div className="bg-white rounded-[24px] shadow-2xl border border-gray-100 p-12 md:p-20 flex flex-col items-center max-w-4xl w-full animate-scale-up">
//         {/* Animated Icon / Spinner */}
//         <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 relative">
//           <div className="absolute inset-0 border-4 border-t-[#ff6b00] border-gray-100 rounded-full animate-spin"></div>
//           <span className="text-xl">⚡</span>
//         </div>

//         <h2 className="text-4xl font-bold text-gray-900 mb-2">
//           Analyzing <span className="text-[#ff6b00]">Patent</span>
//         </h2>

//         <p className="text-gray-400 mb-12 text-center">
//           {data?.currentStepName || "Initializing AI Workers..."}
//         </p>

//         {/* === THE PROGRESS BAR (From your code) === */}
//         <div className="w-full max-w-3xl h-12 bg-gray-50 border rounded-full p-1.5 relative shadow-inner">
//           <div
//             className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,107,0,0.3)]"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <p className="mt-6 font-bold text-[#ff6b00] text-xl">
//           {progress}% Complete
//         </p>

//         <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-semibold">
//           Please keep this window open
//         </p>
//       </div>
//     </div>
//   );
// });

// export default ProcessingModal;
