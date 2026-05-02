import React, { memo, useMemo } from "react";
import { Sparkles, Check, Search, BarChart3, Clock } from "lucide-react";

const FinalizingLoader = memo(({ status, isBulk }) => {
  const progress = status?.progressPercentage || 58;
  const cleanId =
    status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";
  const claimNum = status?.selectedClaim?.number || "21";

  // Joins the selected companies into a string for the orange badge
  const companyString =
    status?.selectedCompanies?.join(", ") || "Samsung Networks, Ericsson";

  // Dynamic Time Calculation
  const remainingTimeText = useMemo(() => {
    if (progress >= 98) return "Finishing up...";

    // Set base estimates: 180s for Quick/Interactive, 300s for Bulk
    const totalEstimatedSeconds = isBulk ? 300 : 180;

    // Calculate remaining seconds based on percentage
    const remainingSeconds = Math.max(
      15, // Minimum floor so it doesn't show 0 prematurely
      Math.round(((100 - progress) / 100) * totalEstimatedSeconds),
    );

    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    if (mins > 0) {
      return `~${mins} ${mins === 1 ? "minute" : "minutes"} ${secs > 0 ? `${secs}s` : ""} remaining`;
    }
    return `~${remainingSeconds} seconds remaining`;
  }, [progress, isBulk]);

  return (
    <div className="w-full bg-white rounded-[40px] md:rounded-[60px] shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-50 p-8 md:p-16 flex flex-col items-center text-center animate-scale-up max-w-6xl mx-auto">
      {/* 🟠 TOP BADGE */}
      <div className="mb-6">
        <span className="bg-[#fff5f0] text-[#ff6b00] px-5 py-2 rounded-full text-[10px] font-[1000] uppercase tracking-[2px] border border-orange-100 flex items-center gap-2">
          <Sparkles size={14} className="text-[#ff6b00]" />
          Interactive Analysis
        </span>
      </div>

      {/* 🟠 TITLES */}
      <h2 className="text-4xl md:text-[64px] font-[1000] text-[#0f172a] mb-4 tracking-tighter leading-tight">
        Generating Final Claim Chart
      </h2>
      <p className="text-slate-400 text-lg font-bold max-w-3xl mb-12">
        Preparing the final technical infringement report.
      </p>

      {/* 🟠 CENTRAL PROGRESS CARD */}
      <div className="w-full max-w-4xl bg-[#f8fafc] border border-slate-100 rounded-[40px] p-10 md:p-14 flex flex-col items-center mb-10 shadow-sm relative">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase">
            {cleanId}
          </h3>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[2px] mt-1 opacity-60">
            AI/ML Technical Evidence Extraction
          </p>

          {/* Selected Context Badge (Matches Image) */}
          <div className="mt-6 bg-[#fff7ed] border border-orange-200 px-5 py-2 rounded-full inline-block shadow-sm">
            <p className="text-[#ff6b00] text-xs font-[1000] uppercase tracking-wider">
              Claim {claimNum} • {companyString}
            </p>
          </div>
        </div>

        {/* PROGRESS LABELS */}
        <div className="w-full max-w-2xl flex justify-between mb-4 px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2.5px]">
            {status?.currentStepName || "Writing Target Analysis"}
          </span>
          <span className="text-[11px] font-black text-slate-500">
            {progress}%
          </span>
        </div>

        {/* PILL BAR */}
        <div className="w-full max-w-2xl h-6 bg-white border border-slate-100 rounded-full p-1 shadow-inner mb-8">
          <div
            className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff6b00] rounded-full transition-all duration-1000 ease-out shadow-lg shadow-orange-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[#0f172a] font-[1000] text-xl tracking-tight italic flex items-center gap-3">
          <Clock
            size={22}
            className="text-[#ff6b00] animate-spin"
            style={{ animationDuration: "3s" }}
          />
          {remainingTimeText}
        </p>
      </div>

      {/* 🔵 BOTTOM STATUS ICONS (Matches Image Grid) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatusBox icon={Check} label="Chart Sections" state="completed" />
        <StatusBox icon={Search} label="Target Evidence" state="active" />
        <StatusBox icon={BarChart3} label="Final Chart" state="pending" />
      </div>
    </div>
  );
});

// Helper component for the 3 boxes at the bottom
const StatusBox = ({ icon: Icon, label, state }) => {
  const variants = {
    completed: {
      bg: "bg-green-500",
      icon: "text-white",
      text: "text-green-600",
      border: "border-green-100",
      glow: "shadow-green-100",
    },
    active: {
      bg: "bg-[#ff6b00]",
      icon: "text-white",
      text: "text-[#ff6b00]",
      border: "border-orange-100",
      glow: "shadow-orange-100",
    },
    pending: {
      bg: "bg-slate-50",
      icon: "text-slate-200",
      text: "text-slate-300",
      border: "border-slate-50",
      glow: "shadow-transparent",
    },
  };

  const style = variants[state];

  return (
    <div className="bg-white border border-slate-100 rounded-[35px] p-10 flex flex-col items-center gap-5 shadow-sm transition-all hover:shadow-md">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white ${style.bg} ${style.glow} shadow-xl transition-all duration-700`}
      >
        <Icon size={24} strokeWidth={3} />
      </div>
      <span
        className={`text-[11px] font-[1000] uppercase tracking-[2px] ${style.text}`}
      >
        {label}
      </span>
    </div>
  );
};

export default FinalizingLoader;
