import React, { memo, useMemo } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import Stepper from "../Stepper";

const MappingView = memo(({ data, onProceed }) => {
  // 💡 Memoize the biblio data for the header card
  const biblio = useMemo(() => data?.patentData?.biblioData || {}, [data]);

  // 💡 Memoize the mapping results
  const mappings = useMemo(() => data?.results?.pcrAnalysis || [], [data]);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-12">
      {/* 1. TOP STEPPER (Props driven) */}
      {/* <Stepper activeStep={3} /> */}

      {/* 2. CTA BANNER (Image 2 - Top Orange Box) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Claim Analysis Complete
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            Your Patent Claim Has Been Analysed. Ready To Identify Target
            Companies?
          </p>
        </div>
        <button
          onClick={onProceed} // Logic to scroll down or move to company grid
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-orange-100 flex items-center gap-3 whitespace-nowrap active:scale-95"
        >
          Select Target Companies
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>

      {/* 3. PATENT DETAILS CARD (Image 2 - Middle Card) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900 leading-none mb-2 tracking-tight">
            {data?.patentId?.replace(/^patent\/|\/en$/gi, "")}
          </h3>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">
            {biblio.title || "Search Engine"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
          <InfoItem
            label="Assignee(s)"
            value={biblio.assignees?.join(", ") || "N/A"}
          />
          <InfoItem label="Publication Date" value={biblio.publicationDate} />
          <InfoItem label="Priority Date" value={biblio.priorityDate} />
          <InfoItem
            label="Inventors"
            value={biblio.inventors?.map((i) => i.name).join(", ")}
          />
        </div>
      </div>

      {/* 4. CLAIM SPEC MAPPING (Image 2 - Bottom List) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
        <h3 className="text-xl font-black text-gray-900 mb-10 tracking-tight uppercase">
          Claim Spec Mapping
        </h3>

        <div className="flex flex-col gap-8">
          {mappings.map((item, index) => (
            <div
              key={index}
              className="bg-[#fafbfc] border border-gray-300 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16 group hover:border-orange-200 transition-colors"
            >
              {/* Left Column: Index & Claim text */}
              <div className="w-full md:w-1/4 flex flex-col">
                <span
                  className="text-6xl font-light text-orange-100 leading-none select-none mb-6 group-hover:text-orange-200 transition-colors"
                  style={{ fontFamily: "serif" }}
                >
                  {index + 1}
                </span>
                <p className="text-gray-800 font-bold text-[15px] leading-relaxed">
                  {item.claimElement}
                </p>
              </div>

              {/* Right Column: AI Explanations */}
              <div className="w-full md:w-2/3 flex flex-col gap-10 border-l border-gray-200 pl-0 md:pl-12">
                {/* Explanation Block */}
                <div className="flex flex-col gap-3">
                  <span className="text-[#ff6b00] font-black text-[11px] uppercase tracking-[2px]">
                    Specification Explanation
                  </span>
                  <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                    {item.specExplanation}
                  </p>
                </div>

                {/* Support Block */}
                {/* Support Block */}
                <div className="flex flex-col gap-3">
                  <span className="text-[#ff6b00] font-black text-[11px] uppercase tracking-[2px]">
                    Specification Support
                  </span>
                  <div className="flex flex-col gap-4">
                    {(() => {
                      const rawText = item.specSupport || "";

                      // 💡 This Regex finds everything inside " "
                      // It looks for a " followed by any characters that aren't a ", followed by another "
                      const quotes = rawText.match(/"([^"]+)"/g) || [rawText];

                      return quotes.map((quote, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-orange-200 transition-all group/quote relative overflow-hidden"
                        >
                          {/* Left accent border that lights up on hover */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover/quote:bg-[#ff6b00] transition-colors" />

                          <p className="text-gray-500 text-[13px] leading-relaxed italic pl-2">
                            {/* Remove the actual " symbols from the start/end for a cleaner look */}
                            {quote.replace(/^"|"$/g, "")}
                          </p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Reusable Info Helper
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[#ff6b00] text-[11px] font-black uppercase tracking-[2px]">
      {label}
    </span>
    <span className="text-gray-600 text-[13px] font-bold leading-relaxed line-clamp-3">
      {value || "N/A"}
    </span>
  </div>
);

export default MappingView;
