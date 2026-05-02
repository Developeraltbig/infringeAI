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

import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, FileDown, LayoutGrid } from "lucide-react";

const SuccessState = memo(({ projectId, data, onClose }) => {
  const navigate = useNavigate();

  // 1. 🧠 Logic: Determine if we show a single card or a list
  const isBulk = data?.mode === "bulk";

  // Clean IDs for display (Removes patent/ and /en)
  const cleanId = (id) => id?.replace(/^patent\/|\/en$/gi, "") || "N/A";

  // If bulk, use the group list from the status API, else wrap the single project in an array
  const displayList = useMemo(() => {
    return data?.groupProjects || [data];
  }, [data]);

  const handleView = (id) => {
    onClose();
    navigate(`/dashboard/report-view/${id}`);
  };

  return (
    <div className="w-full bg-white rounded-[45px] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-16 flex flex-col items-center text-center animate-scale-up max-w-5xl mx-auto">
      {/* 🟢 TOP SUCCESS ICON (Matches Image 1 & 2) */}
      <div className="w-16 h-16 bg-[#ebfbf5] rounded-full flex items-center justify-center mb-8 border border-[#d1f5ea]">
        <Check size={32} className="text-[#10b981]" strokeWidth={3} />
      </div>

      {/* 🟢 DYNAMIC HEADER */}
      <h2 className="text-4xl md:text-[56px] font-black text-gray-900 mb-2 tracking-tighter leading-tight">
        {isBulk ? "Bulk Analysis Complete" : "Claim Chart Ready"}
      </h2>
      <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-widest mb-12 opacity-80">
        {isBulk
          ? `${displayList.length} claim charts generated.`
          : "Analysis verified and ready to view"}
      </p>

      {/* ============================================================
          CONDITION: BULK MODE LIST (Matches your Image 2)
         ============================================================ */}
      {isBulk ? (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col gap-4 max-h-[45vh] overflow-y-auto pr-4 custom-scrollbar mb-10">
            {displayList.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-[28px] p-6 md:p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[18px] font-black text-gray-900 leading-tight">
                    {cleanId(item.patentId)}
                  </span>
                  <span className="text-[12px] text-gray-400 p-3 font-bold uppercase tracking-tight mt-1">
                    {item.patentData?.biblioData?.title ||
                      "Search Engine Technology"}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <span className="hidden md:flex items-center gap-1.5 text-[#10b981] text-[11px] font-black uppercase bg-[#ebfbf5] px-3 py-1 rounded-lg border border-[#d1f5ea]">
                    Ready
                  </span>
                  <button
                    onClick={() => handleView(item._id)}
                    className="bg-[#ff6b00] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95"
                  >
                    View Chart <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Footer Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-10 py-4 border-2 border-gray-300 rounded-2xl text-gray-500 font-black text-sm hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
              Back to Projects
            </button>
          </div>
        </div>
      ) : (
        /* ============================================================
           CONDITION: QUICK / INTERACTIVE VIEW (Matches your Image 1)
           ============================================================ */
        <div className="w-full flex flex-col items-center">
          <div className="w-full bg-[#fafbfc] border border-gray-100 rounded-[35px] p-10 md:p-16 flex flex-col items-center mb-12 shadow-inner">
            <div className="bg-white border border-gray-300 p-12 rounded-[28px] w-full max-w-2xl text-left shadow-sm transition-transform hover:scale-[1.01]">
              <span className="text-[15px] font-bold text-blue-800 uppercase tracking-[2px] mb-3 block opacity-50">
                Patent
              </span>
              <h3 className="text-3xl font-black text-gray-900 mb-1 leading-none">
                {cleanId(data?.patentId)}
              </h3>
              <p className="text-gray-400 font-bold pt-3 text-sm leading-relaxed uppercase tracking-tight">
                {data?.patentData?.biblioData?.title || " "}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleView(projectId)}
              className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-12 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-xl shadow-orange-200 transition-all active:scale-95 group"
            >
              View Chart
              <ArrowRight
                size={22}
                strokeWidth={3}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={onClose}
              className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-sm"
            >
              Back to Projects
            </button>
          </div>
        </div>
      )}

      {/* Persistent close link at bottom */}
      {/* <button
        onClick={onClose}
        className="mt-16 text-gray-500 hover:text-[#e66000] font-black text-[18px] capitalize tracking-[1px] transition-colors"
      >
        Close Window
      </button> */}
    </div>
  );
});

export default SuccessState;
