import React, { memo } from "react";
import { AlertTriangle, X, ArrowLeft } from "lucide-react";

const FailureState = memo(({ reason, onClose }) => {
  return (
    <div className="bg-white rounded-[45px] p-10 md:p-20 flex flex-col items-center text-center shadow-2xl animate-scale-up border border-red-50">
      {/* Error Icon */}
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
        <AlertTriangle size={40} className="text-red-500" strokeWidth={2.5} />
      </div>

      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">
        Analysis <span className="text-red-500">Failed</span>
      </h2>

      <p className="text-gray-400 text-lg max-w-md mb-12 font-medium leading-relaxed">
        {reason ||
          "We encountered an unexpected error while processing your patent. Please verify the Patent ID and try again."}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-lg"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-white border-2 border-gray-100 text-gray-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95"
        >
          <X size={18} /> Close
        </button>
      </div>

      {/* Support text */}
      <p className="mt-10 text-xs text-gray-300 font-bold uppercase tracking-widest">
        Sub-part 01 • Internal System Error
      </p>
    </div>
  );
});

export default FailureState;
