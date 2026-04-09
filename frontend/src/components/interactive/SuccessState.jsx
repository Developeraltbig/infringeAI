import React, { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SuccessState = memo(({ projectId, data, onClose }) => {
  const navigate = useNavigate();

  // 💡 Clean the Patent ID for display (Removes 'patent/' and '/en')
  const cleanId = useMemo(
    () => data?.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A",
    [data?.patentId],
  );

  const handleViewReport = () => {
    onClose(); // Close the modal
    navigate(`/dashboard/report-view/${projectId}`); // Navigate to final report
  };

  return (
    <div className="bg-white rounded-[45px] shadow-[0_15px_60px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-20 flex flex-col items-center text-center animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2
            size={40}
            className="text-green-500"
            strokeWidth={2.5}
          />
        </div>
        <h2 className="text-4xl md:text-[54px] font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Infringement Analysis{" "}
          <span className="text-[#ff6b00]">Complete!</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
          Your Comprehensive Patent Infringement Analysis Has Been Successfully
          Completed. All Claim Charts And Evidence Have Been Generated.
        </p>
      </div>

      {/* 2. Central Result Box (Matches your Image 3) */}
      <div className="w-full max-w-2xl bg-[#fafbfc] border border-gray-100 rounded-[35px] p-10 md:p-14 flex flex-col items-center shadow-sm">
        <h3 className="text-[#ff6b00] font-black uppercase tracking-[4px] text-[13px] mb-10">
          Analysis Result Ready
        </h3>

        {/* White Inner Patent Card */}
        <div className="bg-white border border-gray-100 p-12 rounded-[25px] w-full max-w-md shadow-sm flex flex-col items-center mb-10 transition-transform hover:scale-[1.02] duration-300">
          <span className="text-[36px] font-black text-gray-900 mb-2 tracking-tighter">
            {cleanId}
          </span>
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">
            {data?.patentData?.biblioData?.title || "Search Engine Technology"}
          </span>
        </div>

        <p className="text-gray-500 font-medium text-[15px] mb-10">
          Your Infringement Analysis Is Complete And Ready To View
        </p>

        {/* Action Button */}
        <button
          onClick={handleViewReport}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 transition-all shadow-xl shadow-orange-200 active:scale-95 group"
        >
          View Report
          <ArrowRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
            strokeWidth={3}
          />
        </button>
      </div>

      {/* Optional: Footer reassurance */}
      <p className="mt-12 text-xs text-gray-300 font-bold uppercase tracking-[2px]">
        Project ID: {projectId}
      </p>
    </div>
  );
});

export default SuccessState;
