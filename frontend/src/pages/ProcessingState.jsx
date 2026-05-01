// import React, { memo, useMemo } from "react";
// import { Sparkles, FileText, Search, BarChart3, Zap, Clock } from "lucide-react";

// const ProcessingState = memo(({ status }) => {
//   const mode = status?.mode;
//   const isBulk = mode === "bulk";
//   const progress = status?.progressPercentage || 10;
//   const projects = status?.groupProjects || [];
//   const displayId = status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

//   const remainingTimeText = useMemo(() => {
//     if (progress >= 100) return "Finalizing...";
//     const totalSeconds = isBulk ? 300 : 180;
//     const remainingSeconds = Math.max(15, Math.round(((100 - progress) / 100) * totalSeconds));
//     const mins = Math.floor(remainingSeconds / 60);
//     return mins > 0 ? `~${mins} minute${mins > 1 ? 's' : ''} remaining` : `~${remainingSeconds} seconds remaining`;
//   }, [progress, isBulk]);

//   return (
//     <div className="w-full max-w-[1200px] mx-auto px-4 py-12 flex flex-col items-center animate-scale-up">
//       {/* Badge */}
//       <div className="bg-[#fff7ed] px-5 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100/50">
//         <Sparkles size={14} className="text-[#ff6b00] animate-pulse" />
//         <span className="text-[#ff6b00] text-[11px] font-[1000] uppercase tracking-[2px]">
//           {isBulk ? "Bulk Analysis" : "Quick Analysis"}
//         </span>
//       </div>

//       {/* Heading */}
//       <h2 className="text-4xl md:text-6xl lg:text-[64px] font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-[1] text-center max-w-5xl">
//         {isBulk ? "Processing Bulk Analysis" : "Generating Quick Infringement Analysis"}
//       </h2>
//       <p className="text-slate-400 text-lg md:text-xl mb-16 font-bold text-center">
//         {isBulk ? `${projects.length} patents are being analyzed in parallel.` : "Preparing claim chart and target evidence."}
//       </p>

//       {/* Card */}
//       <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-200/60 rounded-[48px] p-8 md:p-14 flex flex-col items-center mb-16 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)]">
//         <h3 className="text-2xl md:text-4xl font-black text-[#0f172a] mb-1 tracking-tighter uppercase">
//             {isBulk ? `${projects.length} Patents processing in parallel` : displayId}
//         </h3>
//         <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 mb-12">
//             {isBulk ? "All submitted patents are running together." : "AI/ML Based Mobility Related Prediction for Handover"}
//         </p>

//         {/* Progress Bar */}
//         <div className="w-full mb-8 px-2 md:px-6">
//            <div className="flex justify-between items-end mb-4 px-1">
//               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">
//                 {isBulk ? "Running Parallel Analysis" : (status?.currentStepName || "Processing")}
//               </span>
//               <span className="text-xl font-black text-slate-400">{progress}%</span>
//            </div>
//            <div className="w-full h-4 bg-white rounded-full p-1 shadow-inner border border-slate-100">
//               <div className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff6b00] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
//            </div>
//         </div>
//         <div className="flex items-center gap-2 text-[#0f172a] font-[1000] text-xl italic">{remainingTimeText}</div>
//       </div>

//       {/* Bottom Switch */}
//       <div className="w-full max-w-5xl">
//         {isBulk ? (
//           /* IMAGE 2: BULK GRID */
//           <div className="border border-slate-200/60 rounded-[40px] p-8 md:p-12 bg-white shadow-sm">
//             <div className="flex justify-between items-center mb-10">
//                 <h4 className="text-xl font-black text-[#0f172a]">Patents being processed</h4>
//                 <div className="flex items-center gap-2 bg-[#fff7ed] px-4 py-2 rounded-full border border-orange-100 font-black text-[#ff6b00] text-[10px] uppercase tracking-widest">
//                     <div className="w-2 h-2 bg-[#ff6b00] rounded-full animate-pulse" /> Parallel
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {projects.map((proj, idx) => (
//                     <div key={idx} className="bg-[#f8fafc] border border-slate-100/50 p-6 rounded-[30px] flex items-center gap-5">
//                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Zap size={20} className="text-[#ff6b00] opacity-40" /></div>
//                         <div className="flex-1 min-w-0">
//                             <p className="text-[16px] font-[1000] text-[#0f172a] truncate">{proj.patentId?.replace(/^patent\/|\/en$/gi, "")}</p>
//                             <p className="text-slate-400 text-[11px] font-bold">Analyzing Technical Claims</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//           </div>
//         ) : (
//           /* IMAGE 1: QUICK ICONS */
//           <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-4 lg:gap-16 w-full">
//             <StatusIcon icon={FileText} label="Patent Data" active={progress >= 33} />
//             <Connector active={progress >= 66} />
//             <StatusIcon icon={Search} label="Target Evidence" active={progress >= 66} />
//             <Connector active={progress >= 99} />
//             <StatusIcon icon={BarChart3} label="Claim Chart" active={progress >= 99} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// const StatusIcon = ({ icon: Icon, label, active }) => (
//   <div className="flex flex-col items-center gap-4">
//     <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center transition-all duration-700
//         ${active ? "bg-[#ff6b00] text-white shadow-[0_15px_30px_rgba(255,107,0,0.3)] scale-110" : "bg-white text-slate-200 border border-slate-100"}`}>
//       <Icon size={active ? 32 : 24} strokeWidth={2.5} />
//     </div>
//     <span className={`text-[11px] font-[1000] uppercase tracking-[2px] ${active ? "text-[#ff6b00]" : "text-slate-300"}`}>{label}</span>
//   </div>
// );

// const Connector = ({ active }) => (
//   <div className={`hidden md:block h-px flex-1 rounded-full ${active ? 'bg-[#ff6b00]' : 'bg-slate-100'}`} />
// );

// export default ProcessingState;

import React, { memo, useMemo } from "react";
import {
  Sparkles,
  FileText,
  Search,
  BarChart3,
  Zap,
  Clock,
} from "lucide-react";

const ProcessingState = memo(({ status }) => {
  const isBulk = status?.mode === "bulk";
  const progress = status?.progressPercentage || 10;
  const projects = status?.groupProjects || [];
  const displayId =
    status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

  const remainingTimeText = useMemo(() => {
    if (progress >= 100) return "Finalizing...";
    const totalSeconds = isBulk ? 300 : 180;
    const remainingSeconds = Math.max(
      15,
      Math.round(((100 - progress) / 100) * totalSeconds),
    );
    const mins = Math.floor(remainingSeconds / 60);
    return mins > 0
      ? `~${mins} minute${mins > 1 ? "s" : ""} remaining`
      : `~${remainingSeconds} seconds remaining`;
  }, [progress, isBulk]);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-12 flex flex-col items-center animate-scale-up">
      {/* 🏷️ Badge */}
      <div className="bg-[#fff7ed] px-5 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100/50 shadow-sm">
        <Sparkles size={14} className="text-[#ff6b00] animate-pulse" />
        <span className="text-[#ff6b00] text-[11px] font-[1000] uppercase tracking-[2px]">
          {isBulk ? "Bulk Analysis" : "Quick Analysis"}
        </span>
      </div>

      {/* 🚀 Titles */}
      <h2 className="text-4xl md:text-6xl lg:text-[64px] pb-3 font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-[1] text-center max-w-5xl">
        {isBulk
          ? "Processing Bulk Analysis"
          : "Generating Quick Infringement Analysis"}
      </h2>
      <p className="text-slate-400 text-lg md:text-xl mb-16 font-bold text-center">
        {isBulk ? `` : "Preparing claim chart and target evidence."}
      </p>

      {/* 📦 Progress Card */}
      <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-200/60 rounded-[48px] p-8 md:p-14 flex flex-col items-center mb-16 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <h3 className="text-xl  md:text-3xl font-bold text-slate-900  mb-3 capitalize">
          {isBulk
            ? `${projects.length} Patents processing in parallel`
            : displayId}
        </h3>
        {/* <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60 mb-12">
          {isBulk
            ? "All submitted patents are running together."
            : "AI/ML Based Mobility Related Prediction for Handover"}
        </p> */}

        {/* Progress Section */}
        <div className="w-full mb-8 px-2 md:px-6 pt-3">
          <div className="flex justify-between items-end mb-4 px-1">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">
              {isBulk
                ? "Running Parallel Analysis"
                : status?.currentStepName || "Processing"}
            </span>
            <span className="text-xl font-black text-[#0f172a] tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="w-full h-4 bg-white rounded-full p-1 shadow-inner border border-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff6b00] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#0f172a] font-[1000] text-xl italic bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-50">
          {remainingTimeText}
        </div>
      </div>

      {/* 🏁 Bottom UI Switch */}
      <div className="w-full max-w-5xl">
        {isBulk ? (
          /* ============================================================
             BULK MODE GRID (Image 2)
             ============================================================ */
          <div className="border border-slate-200/60 rounded-[40px] p-8 md:p-12 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-10 px-2">
              <h4 className="text-xl font-black text-[#0f172a]">
                Patents being processed
              </h4>
              <div className="flex items-center gap-2 bg-[#fff7ed] px-4 py-2 rounded-full border border-orange-100">
                <div className="w-2 h-2 bg-[#ff6b00] rounded-full animate-pulse shadow-[0_0_8px_#ff6b00]" />
                <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-widest">
                  Parallel
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] border border-slate-100/50 p-6 rounded-[30px] flex items-center gap-5 transition-all hover:bg-white hover:shadow-xl group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap
                      size={20}
                      className="text-[#ff6b00] opacity-30 group-hover:opacity-100 transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-[1000] text-[#0f172a] truncate group-hover:text-[#ff6b00]">
                      {proj.patentId?.replace(/^patent\/|\/en$/gi, "")}
                    </p>
                    <p className="text-slate-400 text-[11px] font-bold">
                      {proj?.patentData?.biblioData?.title || " "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ============================================================
             QUICK MODE ICONS (Image 1)
             ============================================================ */
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-4 lg:gap-16 w-full px-10">
            <StatusIcon
              icon={FileText}
              label="Patent Data"
              active={progress >= 33}
            />
            <Connector active={progress >= 66} />
            <StatusIcon
              icon={Search}
              label="Target Evidence"
              active={progress >= 66}
            />
            <Connector active={progress >= 99} />
            <StatusIcon
              icon={BarChart3}
              label="Claim Chart"
              active={progress >= 99}
            />
          </div>
        )}
      </div>
    </div>
  );
});

// Helper Components
const StatusIcon = ({ icon: Icon, label, active }) => (
  <div className="flex flex-col items-center gap-4">
    <div
      className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center transition-all duration-700 
        ${active ? "bg-[#ff6b00] text-white shadow-[0_15px_30px_rgba(255,107,0,0.3)] scale-110" : "bg-white text-slate-200 border border-slate-100 shadow-sm"}`}
    >
      <Icon size={active ? 32 : 24} strokeWidth={2.5} />
    </div>
    <span
      className={`text-[11px] font-[1000] uppercase tracking-[2px] transition-colors duration-500 ${active ? "text-[#ff6b00]" : "text-slate-300"}`}
    >
      {label}
    </span>
  </div>
);

const Connector = ({ active }) => (
  <div
    className={`hidden md:block h-px flex-1 rounded-full transition-all duration-1000 ${active ? "bg-[#ff6b00]" : "bg-slate-100"}`}
  />
);

export default ProcessingState;
