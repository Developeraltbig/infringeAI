import React, { memo } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";

const FinalEvidenceChart = memo(({ charts }) => {
  if (!charts || charts.length === 0)
    return (
      <div className="p-20 text-center text-gray-400 italic">
        No evidence generated yet. AI may still be processing.
      </div>
    );

  return (
    <div className="divide-y divide-gray-100">
      {charts.map((item, idx) => (
        <div key={idx} className="p-8 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {item.productName}
              </h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest mt-2 block w-fit">
                Likelihood: {item.infringementScore}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {item.claimChart?.map((row, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#fafbfc] p-6 rounded-2xl border border-gray-50"
              >
                {/* Patent Side */}
                <div className="lg:col-span-4">
                  <span className="text-[10px] font-black text-[#ff6b00] uppercase tracking-tighter mb-2 block">
                    Claim Element
                  </span>
                  <p className="text-[14px] font-bold text-gray-800 leading-relaxed">
                    {row.claimElement}
                  </p>
                </div>

                {/* AI Evidence Side */}
                <div className="lg:col-span-8 border-l border-gray-200 pl-0 lg:pl-8">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-2 block">
                    Evidence Found
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {row.productAnalysis}
                  </p>

                  {row.supportingEvidence && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-xs text-gray-500 italic flex gap-3">
                      <CheckCircle2
                        className="text-green-500 shrink-0"
                        size={16}
                      />
                      {row.supportingEvidence}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default FinalEvidenceChart;
