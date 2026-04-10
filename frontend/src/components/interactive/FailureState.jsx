// src/components/interactive/FailureState.jsx
import React, { memo } from "react";
import { AlertTriangle, X } from "lucide-react";

const FailureState = memo(({ reason, onClose }) => {
  return (
    <div className="p-10 md:p-20 flex flex-col items-center text-center animate-fade-in">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
        <AlertTriangle size={40} className="text-red-500" />
      </div>

      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">
        Analysis <span className="text-red-500">Failed</span>
      </h2>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-10 max-w-md">
        <p className="text-red-700 text-sm font-bold leading-relaxed">
          {reason}
        </p>
      </div>

      <button
        onClick={onClose}
        className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-xl"
      >
        Close & Try Again
      </button>
    </div>
  );
});

export default FailureState;
