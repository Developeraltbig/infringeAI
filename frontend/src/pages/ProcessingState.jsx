import React, { memo } from "react";
import { Sparkles, BookA, ClipboardList } from "lucide-react";

const ProcessingState = memo(({ status }) => (
  <div className="bg-white rounded-[45px] p-20 flex flex-col items-center text-center shadow-2xl">
    <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
      Processing Your <span className="text-[#ff6b00]">Patent</span>
    </h2>
    <p className="text-gray-400 text-lg max-w-2xl mb-12">
      Analyzing potential infringements across multiple products.
    </p>

    <div className="w-full bg-[#fafbfc] border rounded-[35px] p-12 flex flex-col items-center mb-10">
      <span className="text-gray-400 font-bold uppercase tracking-[2px] text-[11px] mb-8">
        {status?.currentStepName || "Processing..."}
      </span>
      <div className="w-full max-w-2xl h-11 bg-white border rounded-full p-1.5 shadow-inner">
        <div
          className="h-full bg-[#ff6b00] rounded-full transition-all duration-1000"
          style={{ width: `${status?.progressPercentage || 10}%` }}
        />
      </div>
      <p className="text-gray-500 font-bold mt-6">~2 Minutes Remaining</p>
    </div>

    <div className="grid grid-cols-3 gap-6 w-full">
      <IconBox icon={Sparkles} label="AI Analysis" />
      <IconBox icon={BookA} label="Evidence Gathering" />
      <IconBox icon={ClipboardList} label="Detailed Reports" />
    </div>
  </div>
));

const IconBox = ({ icon: Icon, label }) => (
  <div className="bg-[#fafbfc] p-8 rounded-[30px] flex flex-col items-center gap-3">
    <div className="w-12 h-12 bg-[#ff6b00] rounded-2xl flex items-center justify-center text-white shadow-lg">
      <Icon size={24} />
    </div>
    <span className="font-bold text-gray-900 text-sm">{label}</span>
  </div>
);

export default ProcessingState;
