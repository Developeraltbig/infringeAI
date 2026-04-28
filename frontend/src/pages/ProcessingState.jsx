import React, { memo, useMemo } from "react";
import {
  Sparkles,
  FileText,
  Search,
  BarChart3,
  Zap,
  Clock,
} from "lucide-react";

const ProcessingState = memo(({ status }) => {
  const isBulk = status?.mode === "bulk";
  const percentage = status?.progressPercentage || 10;
  const projects = status?.groupProjects || [];
  const displayId =
    status?.patentId?.replace(/^patent\/|\/en$/gi, "") || "Analyzing...";

  // 🕒 DYNAMIC TIME ESTIMATION
  const remainingTimeText = useMemo(() => {
    if (percentage >= 100) return "Finalizing...";
    const totalSeconds = isBulk ? 300 : 180;
    const remainingSeconds = Math.max(
      15,
      Math.round(((100 - percentage) / 100) * totalSeconds),
    );
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    if (mins > 0) return `~${mins}m ${secs > 0 ? `${secs}s` : ""} remaining`;
    return `~${remainingSeconds} seconds remaining`;
  }, [percentage, isBulk]);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:py-16 flex flex-col items-center animate-scale-up">
      {/* 🏷️ PREMIUM BADGE */}
      <div className="bg-orange-50/50 px-5 py-2 rounded-full flex items-center gap-2 mb-8 border border-orange-100/50">
        <Sparkles size={14} className="text-[#ff6b00] animate-pulse" />
        <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[2px]">
          {isBulk ? "Parallel Bulk Engine" : "Neural Quick Analysis"}
        </span>
      </div>

      {/* 🚀 TITLES */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-[1000] text-[#0f172a] mb-5 tracking-tighter leading-[1] text-center max-w-4xl px-2">
        {isBulk ? "Processing Bulk Analysis" : "Generating Quick Analysis"}
      </h2>
      <p className="text-slate-400 text-base md:text-xl mb-12 md:mb-20 font-bold text-center max-w-xl leading-relaxed">
        {isBulk
          ? `Running parallel agents to analyze ${projects.length} patents.`
          : "Preparing technical mapping and infringement evidence."}
      </p>

      {/* 📦 THE CENTRAL PROGRESS CARD */}
      <div className="w-full max-w-3xl bg-[#f8fafc] border border-slate-200/50 rounded-[48px] p-8 md:p-14 flex flex-col items-center mb-16 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-orange-500/[0.01] to-orange-500/0 animate-pulse pointer-events-none" />

        <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-2 text-center tracking-tight uppercase">
          {isBulk ? "Batch Analysis" : displayId}
        </h3>
        <p className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest mb-12 text-center opacity-60">
          {isBulk
            ? "Distributed Computing Mode"
            : "AI Mobility Prediction Engine"}
        </p>

        {/* 🚀 JUICY PROGRESS BAR */}
        <div className="w-full mb-10 px-0 md:px-2">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Active Phase
              </span>
              <span className="text-[14px] font-black text-[#ff6b00] uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-ping" />
                {isBulk
                  ? "Parallel Scanning"
                  : status?.currentStepName || "Initializing"}
              </span>
            </div>
            <span className="text-3xl md:text-4xl font-black text-[#0f172a] tabular-nums tracking-tighter">
              {percentage}
              <span className="text-xl text-slate-300 ml-1">%</span>
            </span>
          </div>

          {/* Enhanced Track */}
          <div className="relative w-full h-8 bg-white rounded-2xl p-1.5 shadow-[inset_0_2px_10px_rgba(15,23,42,0.05)] border border-slate-200/50">
            {/* The Actual Bar */}
            <div
              className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff6b00] rounded-xl transition-all duration-1000 ease-out relative group"
              style={{ width: `${percentage}%` }}
            >
              {/* Glassy Top Reflection */}
              <div className="absolute inset-x-0 top-0 h-[40%] bg-white/20 rounded-t-lg pointer-events-none" />

              {/* Leading Glow */}
              <div className="absolute top-0 right-0 bottom-0 w-6 bg-white/40 blur-md rounded-full" />

              {/* Animated Shimmer Stripe */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Timer Tag */}
        <div className="flex items-center gap-3 text-[#0f172a] font-black text-sm md:text-base bg-white px-8 py-3 rounded-full shadow-lg shadow-slate-200/50 border border-slate-100">
          <Clock size={18} className="text-[#ff6b00] animate-spin-slow" />
          {remainingTimeText}
        </div>
      </div>

      {/* 🏁 BOTTOM SECTION - RESPONSIVE MODES */}
      <div className="w-full max-w-5xl">
        {!isBulk ? (
          /* QUICK MODE: REFINED STEPS */
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-3 lg:gap-12">
            <StatusStep
              icon={FileText}
              label="Patent Data"
              active={percentage >= 30}
            />
            <div
              className={`hidden md:block h-1.5 flex-1 rounded-full transition-all duration-1000 ${percentage >= 60 ? "bg-[#ff6b00]" : "bg-slate-100"}`}
            />
            <StatusStep
              icon={Search}
              label="Evidence"
              active={percentage >= 60}
            />
            <div
              className={`hidden md:block h-1.5 flex-1 rounded-full transition-all duration-1000 ${percentage >= 90 ? "bg-[#ff6b00]" : "bg-slate-100"}`}
            />
            <StatusStep
              icon={BarChart3}
              label="Chart Ready"
              active={percentage >= 90}
            />
          </div>
        ) : (
          /* BULK MODE: REFINED GRID */
          <div className="border border-slate-200/50 rounded-[40px] p-6 md:p-12 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-10 px-2">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tight">
                  Active Processes
                </h4>
                <p className="text-slate-400 text-[13px] font-bold">
                  Parallel monitoring of active agents
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#fff7ed] px-4 py-2 rounded-xl border border-orange-100">
                <div className="w-2 h-2 bg-[#ff6b00] rounded-full animate-ping" />
                <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-[1.5px]">
                  Engines Live
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-[#f8fafc] border border-slate-200/40 p-6 rounded-[30px] flex items-center gap-5 transition-all hover:bg-white hover:shadow-xl hover:border-[#ff6b00]/30 group cursor-default"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-orange-50 transition-all">
                    <Zap
                      size={20}
                      className="text-[#ff6b00] opacity-30 group-hover:opacity-100 transition-all"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-black text-[#0f172a] truncate group-hover:text-[#ff6b00]">
                      {proj.patentId?.replace(/^patent\/|\/en$/gi, "")}
                    </p>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      Syncing Data
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

/* REFINED STEP ITEM */
const StatusStep = ({ icon: Icon, label, active }) => (
  <div className="flex flex-col items-center gap-3 w-full md:w-auto">
    <div
      className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700 
        ${active ? "bg-[#ff6b00] text-white shadow-[0_10px_25px_rgba(255,107,0,0.35)] scale-110" : "bg-white text-slate-200 border border-slate-100"}`}
    >
      <Icon size={24} strokeWidth={3} />
    </div>
    <span
      className={`text-[10px] font-black uppercase tracking-[1.5px] transition-colors duration-500 ${active ? "text-[#ff6b00]" : "text-slate-300"}`}
    >
      {label}
    </span>
  </div>
);

export default ProcessingState;
