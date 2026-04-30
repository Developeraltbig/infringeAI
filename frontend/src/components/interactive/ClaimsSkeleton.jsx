import React, { memo } from "react";
import { Search, Loader2 } from "lucide-react";

const ClaimsSkeleton = memo(({ patentId }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="bg-white rounded-[45px] border border-gray-100 p-12 md:p-16 shadow-[0_20px_70px_rgba(0,0,0,0.03)] relative">
        {/* Top Layout: Text on left, Spinner on right */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            {/* Orange Badge */}
            <div className="flex items-center gap-2 bg-[#fff5f0] border border-[#ff6b00]/10 px-4 py-1.5 rounded-full w-fit">
              <Search size={14} className="text-[#ff6b00]" strokeWidth={3} />
              <span className="text-[#ff6b00] text-[10px] font-black uppercase tracking-[1.5px]">
                Finding Independent Claims
              </span>
            </div>

            <h2 className="text-5xl font-black text-gray-900 tracking-tight">
              Loading patent claim data
            </h2>
            <p className="text-gray-400 text-lg font-medium">
              Fetching independent claims for{" "}
              <span className="text-gray-900 font-bold">
                {patentId || "Analysis"}
              </span>
              .
            </p>
          </div>

          {/* The Floating Orange Loader Box from your image */}
          <div className="bg-[#ff6b00] w-20 h-20 rounded-[28px] flex items-center justify-center shadow-[0_15px_35px_rgba(255,107,0,0.4)] animate-pulse">
            <Loader2
              className="text-white animate-spin"
              size={32}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* The Skeleton List items from your image */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#fafbfc] border border-gray-50 rounded-[35px] p-10 space-y-4"
            >
              {/* Top Short Bar */}
              <div className="h-4 bg-gray-200/60 rounded-full w-32 animate-pulse" />

              {/* Long Text Lines */}
              <div className="space-y-3">
                <div
                  className="h-3 bg-gray-100/80 rounded-full w-full animate-pulse"
                  style={{ animationDelay: "100ms" }}
                />
                <div
                  className="h-3 bg-gray-100/80 rounded-full w-[95%] animate-pulse"
                  style={{ animationDelay: "200ms" }}
                />
                <div
                  className="h-3 bg-gray-100/80 rounded-full w-[80%] animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ClaimsSkeleton;
