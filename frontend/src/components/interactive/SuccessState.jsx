import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SuccessState = memo(({ projectId, data, onClose }) => {
  const navigate = useNavigate();

  // 1. Logic: Check if we are in Bulk Mode
  const isBulk = data?.mode === "bulk";

  // 2. Logic: Get the list of patents to display
  // In Bulk mode, we might want to show all patents in the same bulk group.
  // For now, we use a fallback if the list isn't provided.
  const projectsList = useMemo(() => {
    if (isBulk && data?.bulkProjects) return data.bulkProjects;
    // Fallback: If it's a single project, wrap it in an array so the logic works for both
    return [data];
  }, [isBulk, data]);

  const handleNavigate = (id) => {
    onClose();
    navigate(`/dashboard/report-view/${id}`);
  };

  return (
    <div className="p-8 md:p-20 flex flex-col items-center text-center animate-fade-in bg-white rounded-[45px]">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-4xl md:text-[54px] font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Infringement Analysis{" "}
          <span className="text-[#ff6b00]">Complete!</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl font-medium leading-relaxed">
          Your Comprehensive Patent Infringement Analysis Has Been Successfully
          Completed. All Claim Charts And Evidence Have Been Generated.
        </p>
      </div>

      {/* --- ANALYSIS COMPLETE BOX (The Light Gray Container) --- */}
      <div className="w-full max-w-6xl bg-[#fafbfc] border border-gray-100 rounded-[35px] p-8 md:p-14 flex flex-col items-center shadow-sm">
        <h3 className="text-[#ff6b00] font-black uppercase tracking-[4px] text-[13px] mb-10">
          Analysis Complete
        </h3>

        {/* 🟢 DYNAMIC GRID: Switches based on number of items */}
        <div
          className={`grid gap-6 w-full ${projectsList.length > 1 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "max-w-md mx-auto"}`}
        >
          {projectsList.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-6">
              {/* White Individual Card */}
              <div className="bg-white border border-gray-100 p-10 rounded-[25px] w-full shadow-sm flex flex-col items-center transition-transform hover:scale-[1.02] duration-300 min-h-[160px] justify-center">
                <span className="text-2xl font-black text-gray-800 mb-1 tracking-tight">
                  {item?.patentId?.replace(/^patent\/|\/en$/gi, "") ||
                    "US6421675B1"}
                </span>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px] italic">
                  {item?.patentData?.biblioData?.title || "Search Engine"}
                </span>
              </div>

              {/* View Report Button for this specific card */}
              <button
                onClick={() => handleNavigate(item?._id || projectId)}
                className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-xl font-black text-[14px] flex items-center gap-3 transition-all shadow-lg shadow-orange-100 active:scale-95 group"
              >
                View Report
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                  strokeWidth={3}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer text inside gray box */}
        <p className="text-gray-400 font-medium text-[13px] mt-12">
          Your Infringement Analysis Is Complete And Ready To View
        </p>
      </div>

      {/* Close button at the very bottom */}
      <button
        onClick={onClose}
        className="mt-10 text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
      >
        Close Window
      </button>
    </div>
  );
});

export default SuccessState;
