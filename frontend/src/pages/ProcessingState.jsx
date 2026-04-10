import React, { memo } from "react";
import { Sparkles, BookA, ClipboardList } from "lucide-react";

const ProcessingState = memo(({ status }) => (
  <div className="w-full bg-white rounded-[45px] shadow-[0_15px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-10 md:p-20 flex flex-col items-center text-center animate-scale-up">
    <h2 className="text-4xl md:text-[64px] font-black text-gray-900 mb-6 tracking-tighter leading-tight">
      Processing Your <span className="text-[#ff6b00]">Patent</span>
    </h2>
    <p className="text-gray-400 text-lg max-w-2xl mb-12 font-medium">
      Analyzing potential infringements across multiple products. This typically
      takes 12 minutes.
    </p>

    <div className="w-full max-w-4xl bg-[#fafbfc] border border-gray-100 rounded-[35px] p-12 flex flex-col items-center mb-16">
      <span className="text-gray-400 font-bold uppercase tracking-[2px] text-[11px] mb-8 animate-pulse text-center">
        {status?.currentStepName || "Initializing AI Workers..."}
      </span>

      {/* 🚀 THE PILL BAR */}
      <div className="w-full max-w-3xl h-12 bg-white border border-gray-100 rounded-full p-1.5 shadow-inner mb-6">
        <div
          className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000 shadow-lg shadow-orange-200"
          style={{ width: `${status?.progressPercentage || 10}%` }}
        />
      </div>

      <p className="text-gray-500 font-bold text-lg">~2 Minutes Remaining</p>
    </div>

    {/* Feature Icons */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
      <IconBox icon={Sparkles} label="AI Analysis" />
      <IconBox icon={BookA} label="Evidence Search" />
      <IconBox icon={ClipboardList} label="Detailed Reports" />
    </div>
  </div>
));

const IconBox = ({ icon: Icon, label }) => (
  <div className="bg-[#fafbfc] border border-gray-50 p-10 rounded-[30px] flex flex-col items-center gap-3">
    <div className="w-14 h-14 bg-[#ff6b00] rounded-2xl flex items-center justify-center text-white shadow-lg">
      <Icon size={28} />
    </div>
    <span className="font-bold text-gray-900 text-[13px] uppercase tracking-widest">
      {label}
    </span>
  </div>
);

export default ProcessingState;
