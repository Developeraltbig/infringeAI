import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SuccessState = memo(({ projectId, data, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-[45px] p-20 flex flex-col items-center text-center shadow-2xl">
      <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
        Infringement Analysis <span className="text-[#ff6b00]">Complete!</span>
      </h2>
      <p className="text-gray-400 text-lg max-w-2xl mb-12">
        All claim charts and evidence have been generated successfully.
      </p>

      <div className="w-full max-w-2xl bg-[#fafbfc] border border-gray-100 p-12 rounded-[35px] flex flex-col items-center shadow-sm">
        <h3 className="text-[#ff6b00] font-black uppercase tracking-[4px] text-[13px] mb-10">
          Analysis Ready
        </h3>
        <div className="bg-white border border-gray-100 p-12 rounded-[25px] w-full shadow-sm flex flex-col items-center mb-10">
          <span className="text-3xl font-black text-gray-900 mb-2">
            {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
          </span>
          <span className="text-gray-400 font-bold uppercase text-[11px] tracking-widest">
            {data?.patentData?.biblioData?.title}
          </span>
        </div>
        <button
          onClick={() => {
            onClose();
            navigate(`/dashboard/report-view/${projectId}`);
          }}
          className="bg-[#ff6b00] text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 hover:shadow-xl transition-all active:scale-95"
        >
          View Report <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
});

export default SuccessState;
