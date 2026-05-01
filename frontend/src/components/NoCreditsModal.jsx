import React from "react";
import { X, Zap, Mail, AlertCircle } from "lucide-react";

const NoCreditsModal = ({ isOpen, onClose, current = 0, required = 7 }) => {
  if (!isOpen) return null;

  const totalPossible = 50;
  // Calculate percentage for the little progress bar inside the modal
  const percentage = (current / totalPossible) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)", // Added a slight blur for a premium feel
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0e1117] border border-white/10 rounded-[28px] p-8 w-full max-w-[420px] mx-4 shadow-2xl animate-scale-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon - Changes color based on if they have 0 or just "not enough" */}
        <div
          className={`w-14 h-14 ${current === 0 ? "bg-red-500/10" : "bg-[#1a1410]"} border border-white/10 rounded-2xl flex items-center justify-center mb-6`}
        >
          <Zap
            className={current === 0 ? "text-red-500" : "text-[#ff6b00]"}
            size={26}
            strokeWidth={2}
          />
        </div>

        {/* Heading */}
        <h2 className="text-white text-[22px] font-black tracking-tight mb-2">
          {current === 0 ? "Out of Credits" : "Insufficient Credits"}
        </h2>
        <p className="text-gray-400 text-[14px] leading-relaxed mb-8">
          This analysis requires{" "}
          <span className="text-white font-bold">{required} credits</span>. You
          currently have{" "}
          <span className="text-[#ff6b00] font-bold">{current}</span>. Please
          reach out to our team to top up your balance.
        </p>

        {/* Dynamic Credit counter */}
        <div className="flex items-center gap-3 bg-[#160d06] border border-[#ff6b00]/20 rounded-2xl px-5 py-4 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#ff6b00]/10 flex items-center justify-center shrink-0">
            <span className="text-[#ff6b00] text-[13px] font-black">
              {current}
            </span>
          </div>
          <div>
            <p className="text-white text-[13px] font-bold">
              {current} {current === 1 ? "credit" : "credits"} remaining
            </p>
            <p className="text-gray-500 text-[11px]">
              {totalPossible - current} credits used
            </p>
          </div>

          {/* Dynamic bar */}
          <div className="ml-auto w-20 h-2 bg-[#1a1f26] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${current === 0 ? "bg-red-600" : "bg-[#ff6b00]"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <a
          href={`mailto:sales@patsero.com?subject=Credit%20Top-up%20Request&body=Hi%20Team,%20I%20currently%20have%20${current}%20credits%20and%20need%20more%20to%20continue%20my%20analysis.`}
          className="flex items-center justify-center gap-2 w-full h-[52px] bg-[#ff6b00] hover:bg-[#e55e00] text-white font-bold text-[15px] rounded-2xl transition-colors shadow-lg shadow-orange-900/20"
        >
          <Mail size={18} />
          Contact Sales Team
        </a>

        <p className="text-center text-gray-600 text-[12px] mt-4">
          Quick top-up?{" "}
          <a
            href="mailto:sales@patsero.com"
            className="text-[#ff6b00]/70 hover:text-[#ff6b00] transition-colors underline"
          >
            Email Us
          </a>
        </p>
      </div>
    </div>
  );
};

export default NoCreditsModal;
