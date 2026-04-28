import React from "react";
import { X, Zap, Mail } from "lucide-react";

const NoCreditsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Faux viewport — avoids position:fixed which breaks iframe height
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0e1117] border border-white/10 rounded-[28px] p-8 w-full max-w-[420px] mx-4 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-[#1a1410] border border-white/10 rounded-2xl flex items-center justify-center mb-6">
          <Zap className="text-[#ff6b00]" size={26} strokeWidth={2} />
        </div>

        {/* Heading */}
        <h2 className="text-white text-[22px] font-black tracking-tight mb-2">
          You're out of credits
        </h2>
        <p className="text-gray-400 text-[14px] leading-relaxed mb-8">
          You've used all 50 of your free credits. To continue analyzing
          patents, please reach out to our sales team and we'll get you set up
          with a plan.
        </p>

        {/* Credit counter */}
        <div className="flex items-center gap-3 bg-[#160d06] border border-[#ff6b00]/20 rounded-2xl px-5 py-4 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#ff6b00]/10 flex items-center justify-center shrink-0">
            <span className="text-[#ff6b00] text-[13px] font-black">0</span>
          </div>
          <div>
            <p className="text-white text-[13px] font-bold">
              0 credits remaining
            </p>
            <p className="text-gray-500 text-[11px]">50 credits used</p>
          </div>
          {/* Exhausted bar */}
          <div className="ml-auto w-20 h-2 bg-[#1a1f26] rounded-full overflow-hidden">
            <div className="h-full w-full bg-red-600/60 rounded-full" />
          </div>
        </div>

        {/* CTA */}
        <a
          href="mailto:sales@patsero.com?subject=Credit%20Top-up%20Request"
          className="flex items-center justify-center gap-2 w-full h-[52px] bg-[#ff6b00] hover:bg-[#e55e00] text-white font-bold text-[15px] rounded-2xl transition-colors"
        >
          <Mail size={18} />
          Contact Sales Team
        </a>

        <p className="text-center text-gray-600 text-[12px] mt-4">
          Or email us at{" "}
          <a
            href="mailto:sales@patsero.com"
            className="text-[#ff6b00]/70 hover:text-[#ff6b00] transition-colors underline"
          >
            sales@patsero.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default NoCreditsModal;
