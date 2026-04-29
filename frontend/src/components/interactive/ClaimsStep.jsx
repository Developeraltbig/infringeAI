import React, { memo, useMemo, useState } from "react";
import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";
import { ArrowRight, ChevronDown, ChevronUp, FileText } from "lucide-react";

const ClaimsStep = memo(({ projectId, data, onProceed }) => {
  const [selectClaim, { isLoading }] = useSelectClaimMutation();
  const [localSelected, setLocalSelected] = useState(null);

  // UI States for "View More" logic
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [expandedClaims, setExpandedClaims] = useState({});

  const independentClaims = useMemo(
    () => data?.allClaims?.filter((c) => c.isIndependent) || [],
    [data],
  );

  const toggleClaimExpansion = (e, claimNumber) => {
    e.stopPropagation(); // Prevent selecting the card when just clicking "view more"
    setExpandedClaims((prev) => ({
      ...prev,
      [claimNumber]: !prev[claimNumber],
    }));
  };

  const handleProceed = async () => {
    if (!localSelected) return;
    try {
      await selectClaim({ projectId, claimNumber: localSelected }).unwrap();
      onProceed();
    } catch (err) {
      console.error("Selection failed");
    }
  };

  const patentTitle =
    data?.patentData?.biblioData?.title || "AI/ML Mobility related Prediction";

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-32">
      {/* 🟢 Patent Header Card */}
      <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 p-6 md:p-10 shadow-sm flex flex-col lg:flex-row justify-between items-start gap-8 transition-all hover:shadow-md">
        <div className="flex-1 min-w-0">
          <div className="bg-[#fff7ed] border border-orange-100 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4">
            <FileText size={14} className="text-[#ff6b00]" />
            <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-widest">
              {data?.patentId?.replace(/^patent\/|\/en$/gi, "") || "PATENT ID"}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3 tracking-tighter">
            Choose one claim
          </h2>

          <div className="relative group">
            <p
              className={`text-slate-500 font-bold text-base md:text-lg leading-relaxed transition-all duration-300 ${!isHeaderExpanded ? "line-clamp-2" : ""}`}
            >
              {patentTitle}
            </p>
            {patentTitle.length > 100 && (
              <button
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className="text-[#ff6b00] text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-1 hover:underline"
              >
                {isHeaderExpanded ? "Show Less" : "View Full Description"}
                {isHeaderExpanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid - Responsive behavior */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          <StatBox
            label="Total"
            value={data?.allClaims?.length}
            color="bg-slate-50 text-slate-900 border-slate-100"
          />
          <StatBox
            label="Available"
            value={independentClaims.length}
            color="bg-orange-50 text-[#ff6b00] border-orange-100"
          />
          <StatBox
            label="Dependent"
            value={(data?.allClaims?.length || 0) - independentClaims.length}
            color="bg-slate-50 text-slate-900 border-slate-100"
          />
        </div>
      </div>

      {/* 🟢 Claims List */}
      <div className="flex flex-col gap-4">
        {independentClaims.map((claim) => {
          const isExpanded = expandedClaims[claim.number];
          const isSelected = localSelected === claim.number;

          return (
            <div
              key={claim.number}
              onClick={() => setLocalSelected(claim.number)}
              className={`cursor-pointer bg-white rounded-[24px] md:rounded-[35px] p-6 md:p-10 border-2 transition-all duration-300 relative group
                ${isSelected ? "border-[#ff6b00] shadow-xl shadow-orange-100/30 ring-4 ring-orange-50" : "border-slate-50 hover:border-slate-200"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-4 transition-all duration-300 flex items-center justify-center
                      ${isSelected ? "border-[#ff6b00] bg-[#ff6b00] shadow-[0_0_15px_#ff6b00]" : "border-slate-200 bg-white"}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-[#0f172a] tracking-tight">
                    Claim {claim.number}
                  </h4>
                </div>

                {isSelected && (
                  <span className="bg-[#ff6b00] text-white text-[10px] font-black uppercase tracking-[2px] px-4 py-1.5 rounded-full shadow-lg shadow-orange-200 animate-in fade-in zoom-in duration-300">
                    Selected
                  </span>
                )}
              </div>

              <div className="pl-11 md:pl-14">
                <div className="relative">
                  <p
                    className={`text-slate-500 font-medium leading-relaxed text-base md:text-lg italic transition-all duration-500 ${!isExpanded ? "line-clamp-3" : ""}`}
                  >
                    "{claim.text}"
                  </p>

                  {claim.text.length > 200 && (
                    <button
                      onClick={(e) => toggleClaimExpansion(e, claim.number)}
                      className="mt-3 text-[#ff6b00] text-xs font-black uppercase tracking-widest flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {isExpanded ? "Read Less" : "Read More.."}
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟢 Bottom Action Bar */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 w-[calc(100%-2rem)] md:w-full md:max-w-4xl z-50">
        <div className="bg-[#0f172a] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[24px] md:rounded-[30px] p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-slide-up">
          <div className="flex items-center gap-3 px-4">
            <div
              className={`w-2 h-2 rounded-full ${localSelected ? "bg-green-400 animate-pulse" : "bg-slate-600"}`}
            />
            <span className="font-black text-white text-base md:text-lg tracking-tight">
              {localSelected
                ? `Claim ${localSelected} Ready`
                : "Select a claim to analyze"}
            </span>
          </div>

          <button
            disabled={!localSelected || isLoading}
            onClick={handleProceed}
            className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 md:px-12 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
          >
            {isLoading ? "Analyzing..." : "Continue to Mapping"}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
});

/* 🟢 Refined StatBox */
const StatBox = ({ label, value, color }) => (
  <div
    className={`${color} border rounded-[20px] md:rounded-[24px] flex-1 md:w-28 md:h-28 py-3 md:py-0 flex flex-col items-center justify-center shadow-sm transition-transform hover:scale-105 duration-300`}
  >
    <span className="text-xl md:text-3xl font-[1000] leading-none mb-1 tracking-tighter">
      {value || "00"}
    </span>
    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[1.5px] opacity-60">
      {label}
    </span>
  </div>
);

export default ClaimsStep;
