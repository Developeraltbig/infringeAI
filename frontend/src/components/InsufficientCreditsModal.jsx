import React from "react";
import { X, Crown, AlertCircle, Mail } from "lucide-react";

const InsufficientCreditsModal = ({ isOpen, onClose, required, current }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-scale-up">
        <div className="h-32 bg-gradient-to-br from-[#ff6b00]/20 to-transparent flex items-center justify-center">
          <div className="w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
            <AlertCircle size={32} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-0 text-center">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
            Insufficient Credits
          </h2>
          <p className="text-gray-400 font-medium mb-8 leading-relaxed">
            This operation requires{" "}
            <span className="text-white font-bold">{required} credits</span>.
            You currently have{" "}
            <span className="text-[#ff6b00] font-bold">
              {current} remaining
            </span>
            .
          </p>

          <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-8 flex items-center gap-4 border border-white/5 text-left">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Crown size={20} className="text-[#ff6b00]" />
            </div>
            <p className="text-[12px] text-gray-300 font-medium leading-tight">
              To analyze more patents, please contact our team for a credit
              top-up or upgrade to a Pro plan.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:sales@patsero.com?subject=Credit Top-up Request"
              className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Mail size={20} /> Contact Sales
            </a>
            <button
              onClick={onClose}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
