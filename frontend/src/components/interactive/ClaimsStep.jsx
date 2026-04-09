import React, { memo, useMemo } from "react";
import { useSelectClaimMutation } from "../../features/api/interactiveApiSlice";

const ClaimsStep = memo(({ projectId, data, onProceed }) => {
  const [selectClaim, { isLoading }] = useSelectClaimMutation();

  // 💡 Filter independent claims dynamically from your 20-claim array
  const independentClaims = useMemo(
    () => data?.allClaims?.filter((c) => c.isIndependent) || [],
    [data],
  );

  const handleSelect = async (claimNumber) => {
    try {
      await selectClaim({ projectId, claimNumber }).unwrap();
      onProceed(); // Tell parent to start polling again
    } catch (err) {
      console.error("Selection failed");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 bg-white animate-fade-in pb-10">
      {/* 1. Header Card - Pixel Perfect to your Image */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900">
          Select Claim To Analyse
        </h2>
        <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <OrangeDocIcon />
          {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
        </div>
      </div>

      {/* 2. Stats Pill Row */}
      <div className="flex flex-wrap gap-4">
        <StatPill label="Total Claims" value={data?.allClaims?.length} />
        <StatPill
          label="Independent Claims"
          value={independentClaims.length}
          highlight
        />
        <StatPill
          label="Dependent Claims"
          value={data?.allClaims?.length - independentClaims.length}
        />
      </div>

      {/* 3. Independent Claims Container */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">
          Independent Claims
        </h3>

        <div className="space-y-6">
          {independentClaims.map((claim) => (
            <div
              key={claim.number}
              className="bg-[#fafbfc] border border-gray-50 rounded-[24px] p-8 hover:border-orange-200 transition-all group"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800 text-lg">
                  Claim {claim.number}
                </span>
                <button
                  disabled={isLoading}
                  onClick={() => handleSelect(claim.number)}
                  className="bg-[#ff6b00] text-white px-10 py-2.5 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:bg-gray-300"
                >
                  {isLoading ? "Wait..." : "Proceed"}
                </button>
              </div>
              <p className="text-gray-500 italic text-[15px] leading-relaxed pr-10">
                "{claim.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Helper Components
const StatPill = ({ label, value, highlight }) => (
  <div className="bg-white border border-gray-100 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-sm">
    <span
      className={`text-xl font-black ${highlight ? "text-[#ff6b00]" : "text-gray-900"}`}
    >
      {value || "00"}
    </span>
    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const OrangeDocIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#ff6b00"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2V8H20L14 2Z"
      fill="#e66000"
    />
  </svg>
);

export default ClaimsStep;
