import React, { memo, useMemo } from "react";
import {
  Sparkles,
  FileText,
  Search,
  ClipboardList,
  Fingerprint,
  Layers,
} from "lucide-react";

const ProcessingState = memo(({ status }) => {
  const mode = status?.mode; // 'bulk', 'quick', or 'interactive'
  const isBulk = mode === "bulk";
  const isInteractive = mode === "interactive";

  const progress = status?.progressPercentage || 10;
  const cleanId =
    status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "US10686266B2";

  // ⏳ Dynamic Time Calculation
  const timeRemaining = useMemo(() => {
    if (progress >= 100) return "Completed";
    if (progress >= 90) return "Finalizing...";
    return progress >= 50 ? "~1 minute remaining" : "~3 minutes remaining";
  }, [progress]);

  return (
    <div className="w-full bg-white rounded-[45px] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center animate-scale-up max-w-6xl mx-auto">
      {/* 🟠 TOP BADGE */}
      <div className="mb-6">
        <span className="bg-[#fff5f0] text-[#ff6b00] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[2.5px] border border-[#ff6b00]/10 flex items-center gap-2">
          <Sparkles size={14} fill="#ff6b00" />
          {isBulk
            ? "Bulk Analysis"
            : isInteractive
              ? "Interactive Analysis"
              : "Quick Analysis"}
        </span>
      </div>

      {/* 🟠 DYNAMIC TITLE */}
      <h2 className="text-4xl md:text-[56px] font-black text-[#0a0a0a] mb-3 tracking-tighter leading-tight">
        {isBulk
          ? "Processing Bulk Analysis"
          : isInteractive
            ? "Preparing Interactive Workflow"
            : "Generating Quick Infringement Analysis"}
      </h2>

      <p className="text-gray-400 text-lg font-medium mb-12">
        {isBulk
          ? `${status?.groupProjects?.length || 0} patents are being analyzed in parallel.`
          : isInteractive
            ? "AI is extracting claims and preparing the interactive selection wizard."
            : "Preparing claim chart and target evidence."}
      </p>

      {/* 🟠 CENTRAL PROGRESS CARD */}
      <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-[40px] p-10 md:p-14 flex flex-col items-center mb-10 shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative overflow-hidden">
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            {isBulk ? "Parallel Engine Active" : cleanId}
          </h3>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1 opacity-70">
            {isInteractive
              ? "Step 1: Analyzing Independent Claims"
              : " "}
          </p>
        </div>

        {/* PROGRESS LABELS */}
        <div className="w-full max-w-2xl flex justify-between mb-4 px-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[2.5px]">
            {status?.currentStepName || "Initializing AI Workers..."}
          </span>
          <span className="text-[11px] font-black text-gray-400">
            {progress}%
          </span>
        </div>

        {/* PILL BAR */}
        <div className="w-full max-w-2xl h-8 bg-gray-50 border border-gray-100 rounded-full p-1.5 shadow-inner mb-8">
          <div
            className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000 ease-out shadow-lg shadow-orange-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-gray-900 font-black text-xl tracking-tight italic">
          {timeRemaining}
        </p>
      </div>

      {/* 🔵 BOTTOM SECTION: MODE SPECIFIC UI */}
      {isBulk ? (
        /* --- BULK VIEW (Unchanged) --- */
        <div className="w-full max-w-5xl bg-white border border-gray-100 rounded-[35px] p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {status?.groupProjects?.map((proj, idx) => (
            <div
              key={idx}
              className="bg-[#fafbfc] p-6 rounded-[22px] flex items-center gap-4"
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#ff6b00] shadow-sm">
                <Sparkles size={22} />
              </div>
              <p className="font-black text-gray-900 text-[15px]">
                {proj?.patentId}
              </p>
            </div>
          ))}
        </div>
      ) : isInteractive ? (
        /* --- 🟠 NEW: INTERACTIVE PROGRESS STEPS --- */
        <div className="w-full max-w-5xl flex items-center justify-between gap-4 px-4">
          <StepIcon
            active={progress < 30}
            done={progress >= 30}
            icon={FileText}
            label="Patent Data"
          />
          <Connector />
          <StepIcon
            active={progress >= 30 && progress < 70}
            done={progress >= 70}
            icon={Fingerprint}
            label="Claim Extract"
          />
          <Connector />
          <StepIcon
            active={progress >= 70}
            done={false}
            icon={Layers}
            label="Interactive Map"
          />
        </div>
      ) : (
        /* --- QUICK VIEW (Unchanged) --- */
        <div className="w-full max-w-5xl flex items-center justify-between gap-4 px-4">
          <StepIcon
            active={progress < 40}
            done={progress >= 40}
            icon={FileText}
            label="Patent Data"
          />
          <Connector />
          <StepIcon
            active={progress >= 40 && progress < 85}
            done={progress >= 85}
            icon={Search}
            label="Target Evidence"
          />
          <Connector />
          <StepIcon
            active={progress >= 85}
            done={progress >= 100}
            icon={ClipboardList}
            label="Claim Chart"
          />
        </div>
      )}
    </div>
  );
});

// --- HELPER COMPONENTS ---
const StepIcon = ({ icon: Icon, label, active, done }) => (
  <div
    className={`flex flex-col items-center gap-4 transition-all duration-700 ${active ? "scale-110 opacity-100" : "opacity-40"}`}
  >
    <div
      className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-xl border-4
      ${active || done ? "bg-[#ff6b00] border-orange-100 text-white shadow-orange-200" : "bg-white border-gray-50 text-gray-300"}`}
    >
      <Icon size={28} strokeWidth={2.5} />
    </div>
    <span
      className={`text-[11px] font-black uppercase tracking-[2px] ${active || done ? "text-[#ff6b00]" : "text-gray-400"}`}
    >
      {label}
    </span>
  </div>
);

const Connector = () => <div className="h-px flex-1 bg-gray-100 mt-[-30px]" />;

export default ProcessingState;

// import React, { memo, useMemo } from "react";
// import {
//   Sparkles,
//   FileText,
//   Search,
//   BarChart3,
//   Zap,
//   Clock,
// } from "lucide-react";

// const ProcessingState = memo(({ status }) => {
//   const mode = status?.mode; // 'bulk', 'quick', or 'interactive'
//   const isBulk = mode === "bulk";
//   const isInteractive = mode === "interactive";

//   const progress = status?.progressPercentage || 10;
//   const cleanId =
//     status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

//   // 🕒 1. DYNAMIC TIME ESTIMATION LOGIC
//   const remainingTimeText = useMemo(() => {
//     if (progress >= 100) return "Finalizing Results...";

//     // Total estimated time: Quick = 180s, Bulk = 300s
//     const totalSeconds = isBulk ? 300 : 180;
//     const remainingSeconds = Math.max(
//       15,
//       Math.round(((100 - progress) / 100) * totalSeconds),
//     );

//     const mins = Math.floor(remainingSeconds / 60);
//     const secs = remainingSeconds % 60;

//     if (mins > 0) {
//       return `~${mins} ${mins === 1 ? "minute" : "minutes"} ${secs > 0 ? `and ${secs}s` : ""} remaining`;
//     }
//     return `~${remainingSeconds} seconds remaining`;
//   }, [progress, isBulk]);

//   return (
//     <div className="w-full max-w-[1400px] mx-auto px-4 py-8 md:py-16 flex flex-col items-center animate-scale-up">
//       {/* 🟠 TOP BADGE */}
//       <div className="bg-[#fff7ed] px-5 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100 shadow-sm transition-all hover:scale-105">
//         <Sparkles size={14} className="text-[#ff6b00] animate-pulse" />
//         <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[2px]">
//           {isBulk
//             ? "Parallel Bulk Engine"
//             : isInteractive
//               ? "Interactive Workflow"
//               : "Neural Quick Analysis"}
//         </span>
//       </div>

//       {/* 🚀 RESPONSIVE TITLES */}
//       <h2 className="text-4xl md:text-[64px] font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-[1] text-center max-w-5xl">
//         {isBulk
//           ? "Processing Bulk Analysis"
//           : isInteractive
//             ? "Preparing Interactive View"
//             : "Generating Quick Analysis"}
//       </h2>
//       <p className="text-slate-400 text-lg md:text-xl mb-12 md:mb-20 font-bold text-center max-w-2xl leading-relaxed">
//         {isBulk
//           ? `Deploying parallel agents to analyze ${status?.groupProjects?.length || 0} patents.`
//           : "Analyzing claims and mapping technical evidence to target products."}
//       </p>

//       {/* 📦 THE CENTRAL PROGRESS CARD (The Pill Section) */}
//       <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-200/50 rounded-[48px] p-8 md:p-14 flex flex-col items-center mb-16 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
//         <div className="mb-12 text-center">
//           <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tight uppercase">
//             {isBulk ? "Batch Engines Active" : cleanId}
//           </h3>
//           <p className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest mt-1 opacity-60">
//             {isInteractive
//               ? "Extracting Independent Claims"
//               : "AI Mobility Prediction Engine"}
//           </p>
//         </div>

//         {/* PROGRESS LABELS */}
//         <div className="w-full max-w-2xl flex justify-between items-end mb-4 px-1">
//           <div className="flex flex-col gap-0.5">
//             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
//               Active Phase
//             </span>
//             <span className="text-[14px] font-black text-[#ff6b00] uppercase tracking-wider flex items-center gap-2">
//               <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-ping" />
//               {status?.currentStepName || "Processing"}
//             </span>
//           </div>
//           <span className="text-3xl md:text-4xl font-black text-[#0f172a] tabular-nums tracking-tighter">
//             {progress}
//             <span className="text-xl text-slate-300 ml-1">%</span>
//           </span>
//         </div>

//         {/* PILL BAR (Juicy & Thick) */}
//         <div className="relative w-full max-w-2xl h-8 bg-white rounded-2xl p-1.5 shadow-[inset_0_2px_10px_rgba(15,23,42,0.05)] border border-slate-200/50 mb-10">
//           <div
//             className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff6b00] rounded-xl transition-all duration-1000 ease-out relative overflow-hidden"
//             style={{ width: `${progress}%` }}
//           >
//             {/* Glossy Reflection */}
//             <div className="absolute inset-x-0 top-0 h-[40%] bg-white/20 rounded-t-lg" />
//             {/* Shimmer Effect */}
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
//           </div>
//         </div>

//         {/* ⏳ DYNAMIC TIME TAG */}
//         <div className="flex items-center gap-3 text-[#0f172a] font-[1000] text-base md:text-xl bg-white px-8 py-3 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100">
//           <Clock size={22} className="text-[#ff6b00] animate-spin-slow" />
//           {remainingTimeText}
//         </div>
//       </div>

//       {/* 🔵 BOTTOM SECTION: MODE SPECIFIC UI */}
//       <div className="w-full max-w-5xl">
//         {isBulk ? (
//           /* --- BULK GRID VIEW (Premium Update) --- */
//           <div className="border border-slate-200/50 rounded-[40px] p-6 md:p-12 bg-white shadow-sm">
//             <div className="flex justify-between items-center mb-10 px-4">
//               <h4 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tight">
//                 Patents being processed
//               </h4>
//               <div className="flex items-center gap-2 bg-[#fff7ed] px-4 py-2 rounded-xl border border-orange-100">
//                 <div className="w-2 h-2 bg-[#ff6b00] rounded-full animate-ping" />
//                 <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-[1.5px]">
//                   Engines Live
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {status?.groupProjects?.map((proj, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-[#f8fafc] border border-slate-200/40 p-6 rounded-[30px] flex items-center gap-5 transition-all hover:bg-white hover:shadow-xl hover:border-[#ff6b00]/30 group"
//                 >
//                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-orange-50 transition-all">
//                     <Zap
//                       size={20}
//                       className="text-[#ff6b00] opacity-30 group-hover:opacity-100"
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-black text-[#0f172a] text-[15px] truncate group-hover:text-[#ff6b00] transition-colors">
//                       {proj?.patentId?.replace(/^patent\/|\/en$/gi, "")}
//                     </p>
//                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
//                       Syncing Data
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           /* --- QUICK / INTERACTIVE STEPS VIEW --- */
//           <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-3 lg:gap-12">
//             <StatusIcon
//               icon={FileText}
//               label="Patent Data"
//               active={progress >= 30}
//             />
//             <Connector active={progress >= 60} />
//             <StatusIcon
//               icon={isInteractive ? Fingerprint : Search}
//               label={isInteractive ? "Claims" : "Evidence"}
//               active={progress >= 60}
//             />
//             <Connector active={progress >= 90} />
//             <StatusIcon
//               icon={isInteractive ? Layers : BarChart3}
//               label={isInteractive ? "Map View" : "Report"}
//               active={progress >= 90}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// // --- REFINED HELPER COMPONENTS ---
// const StatusIcon = ({ icon: Icon, label, active }) => (
//   <div className="flex flex-col items-center gap-3 w-full md:w-auto">
//     <div
//       className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700
//         ${active ? "bg-[#ff6b00] text-white shadow-[0_10px_25px_rgba(255,107,0,0.35)] scale-110" : "bg-white text-slate-200 border border-slate-100"}`}
//     >
//       <Icon size={24} strokeWidth={3} />
//     </div>
//     <span
//       className={`text-[10px] font-black uppercase tracking-[1.5px] transition-colors duration-500 ${active ? "text-[#ff6b00]" : "text-slate-300"}`}
//     >
//       {label}
//     </span>
//   </div>
// );

// const Connector = ({ active }) => (
//   <div
//     className={`hidden md:block h-1.5 flex-1 rounded-full transition-all duration-1000 ${active ? "bg-[#ff6b00]" : "bg-slate-100"}`}
//   />
// );

// // CSS required in global file:
// // @keyframes shimmer { 100% { transform: translateX(100%); } }
// // .animate-shimmer { animation: shimmer 2s infinite; }

// export default ProcessingState;
