// import React, { memo, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// const SuccessState = memo(({ projectId, data, onClose }) => {
//   const navigate = useNavigate();

//   // 1. Logic: Use groupProjects if they exist (Bulk Mode), otherwise use the single project
//   const projectsList = useMemo(() => {
//     // We check 'groupProjects' because that's what the backend Status API returns
//     if (data?.mode === "bulk" && data?.groupProjects) {
//       return data.groupProjects;
//     }
//     return [data]; // Fallback for Quick/Interactive mode
//   }, [data]);

//   const handleNavigate = (id) => {
//     onClose();
//     navigate(`/dashboard/report-view/${id}`);
//   };

//   return (
//     <div className="p-8 md:p-20 flex flex-col items-center text-center animate-fade-in bg-white rounded-[45px]">
//       {/* --- HEADER SECTION --- */}
//       <div className="flex flex-col items-center mb-10">
//         <h2 className="text-4xl md:text-[54px] font-black text-gray-900 mb-6 tracking-tighter leading-tight">
//           Infringement Analysis{" "}
//           <span className="text-[#ff6b00]">Complete!</span>
//         </h2>
//         <p className="text-gray-400 text-lg max-w-3xl font-medium leading-relaxed">
//           Your Comprehensive Patent Infringement Analysis Has Been Successfully
//           Completed. All Claim Charts And Evidence Have Been Generated.
//         </p>
//       </div>

//       {/* --- ANALYSIS COMPLETE BOX (Gray Container) --- */}
//       <div className="w-full max-w-6xl bg-[#fafbfc] border border-gray-100 rounded-[35px] p-8 md:p-14 flex flex-col items-center shadow-sm">
//         <h3 className="text-[#ff6b00] font-black uppercase tracking-[4px] text-[13px] mb-12">
//           Analysis Complete
//         </h3>

//         {/* 🟢 DYNAMIC GRID: Matches your image (3 columns for bulk) */}
//         <div
//           className={`grid gap-8 w-full ${
//             projectsList.length > 1
//               ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
//               : "max-w-md mx-auto"
//           }`}
//         >
//           {projectsList.map((item, idx) => (
//             <div
//               key={idx}
//               className="flex flex-col items-center gap-6 group  border border-gray-300 shadow-sm p-10 rounded-[15px]"
//             >
//               {/* White Individual Patent Card */}
//               <div className="bg-white border border-gray-100 p-10 rounded-[15px] w-full shadow-sm flex flex-col items-center min-h-[160px] justify-center transition-all ">
//                 <span className="text-2xl font-black text-gray-800 mb-1 tracking-tight">
//                   {/* Clean Patent ID */}
//                   {item?.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A"}
//                 </span>
//                 <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] text-center">
//                   {item?.patentData?.biblioData?.title || "Search Engine"}
//                 </span>
//               </div>

//               {/* View Report Button */}
//               <button
//                 onClick={() => handleNavigate(item?._id || projectId)}
//                 className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-xl font-black text-[13px] flex items-center gap-3 transition-all shadow-lg shadow-orange-100 active:scale-95 group"
//               >
//                 View Report
//                 <ArrowRight
//                   size={18}
//                   className="group-hover:translate-x-1 transition-transform"
//                   strokeWidth={3}
//                 />
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Footer text inside gray box */}
//         <p className="text-gray-400 font-bold text-[12px] mt-16 uppercase tracking-widest">
//           Your Infringement Analysis Is Complete And Ready To View
//         </p>
//       </div>

//       {/* Close button at the very bottom */}
//       <button
//         onClick={onClose}
//         className="mt-12 text-gray-400 hover:text-gray-600 font-bold text-[11px] uppercase tracking-[3px] transition-colors"
//       >
//         Close Window
//       </button>
//     </div>
//   );
// });

// export default SuccessState;

import React from "react";
import { Check, ArrowRight, Download, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessState = ({ projectId, data, onClose }) => {
  const navigate = useNavigate();
  const isBulk = data?.mode === "bulk";
  const projects = data?.groupProjects || [];
  const displayId = data?.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center animate-scale-up">
      {/* 🟢 SUCCESS ICON - Premium Ring Effect */}
      <div className="relative mb-8 md:mb-12">
        <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-green-100/50">
          <Check size={48} className="text-green-500" strokeWidth={3} />
        </div>
      </div>

      {/* 🚀 RESPONSIVE HEADINGS */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[64px] font-black text-[#0f172a] mb-2 tracking-tighter text-center leading-tight">
        {isBulk ? "Bulk Analysis Complete" : "Claim Chart Ready"}
      </h2>
      <p className="text-slate-400 text-sm md:text-xl font-bold mb-10 md:mb-16">
        {isBulk
          ? `${projects.length} claim charts generated.`
          : "Technical evidence mapping is complete."}
      </p>

      {/* 📦 DYNAMIC CONTENT SECTION */}
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-12 md:mb-20">
        {isBulk ? (
          /* ============================================================
             IMAGE 1: BULK MODE LIST
             ============================================================ */
          <div className="flex flex-col gap-4">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="group bg-white border border-slate-100 rounded-[30px] p-5 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-orange-100/30 transition-all duration-500"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg md:text-xl font-black text-[#0f172a] tracking-tight group-hover:text-[#ff6b00] transition-colors">
                    {proj.patentId?.replace(/^patent\/|\/en$/gi, "")}
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm font-bold truncate max-w-[280px] md:max-w-md">
                    Technical analysis and claim mapping generated
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-6 self-end sm:self-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    Ready
                  </span>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/report-view/${proj._id}`)
                    }
                    className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-3.5 rounded-2xl font-black text-[13px] flex items-center gap-2 shadow-lg shadow-orange-200/50 transition-all active:scale-95 whitespace-nowrap"
                  >
                    View Chart <ChevronRight size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ============================================================
             IMAGE 2: QUICK MODE CARD
             ============================================================ */
          <div className="bg-[#f8fafc] border border-slate-100 rounded-[40px] md:rounded-[60px] p-8 md:p-16 flex flex-col items-start shadow-sm relative overflow-hidden">
            {/* Subtle card glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 blur-[80px] rounded-full" />

            <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-4">
              Patent ID
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-3 tracking-tighter">
              {displayId}
            </h3>
            <p className="text-slate-400 text-sm md:text-xl font-bold leading-relaxed max-w-2xl">
              AI/ML Based Mobility Related Prediction for Handover
            </p>
          </div>
        )}
      </div>

      {/* 🔘 BOTTOM ACTION ROW - Fully Responsive */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
        {isBulk ? (
          /* Bulk Actions */
          <>
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
              <Download size={22} strokeWidth={2.5} /> Download All
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-400 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center active:scale-95"
            >
              Back to Projects
            </button>
          </>
        ) : (
          /* Quick Actions */
          <>
            <button
              onClick={() => navigate(`/dashboard/report-view/${projectId}`)}
              className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-12 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-orange-200/60 transition-all active:scale-95"
            >
              View Chart <ArrowRight size={24} strokeWidth={3} />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-400 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center active:scale-95"
            >
              Back to Projects
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessState;
