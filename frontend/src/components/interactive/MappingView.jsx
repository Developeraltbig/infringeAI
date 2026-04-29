import React, { memo, useMemo } from "react";
import {
  ArrowRight,
  FileText,
  Calendar,
  User,
  Users,
  BookOpen,
  Info,
} from "lucide-react";
import Stepper from "../Stepper";

const MappingView = memo(({ data, onProceed }) => {
  const biblio = useMemo(() => data?.patentData?.biblioData || {}, [data]);
  const mappings = useMemo(() => data?.results?.pcrAnalysis || [], [data]);

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in pb-12">
      {/* 🟢 STEPPER INCLUDED */}
      <Stepper activeStep={3} />

      {/* CTA BANNER */}
      <div className="bg-white rounded-[32px] shadow-sm border border-orange-100 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-md transition-all">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
            <Info size={32} className="text-[#ff6b00]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-[1000] text-[#0f172a] mb-1 tracking-tighter">
              Claim Analysis Complete
            </h2>
            <p className="text-slate-400 text-sm md:text-lg font-bold">
              Ready To Identify Target Companies?
            </p>
          </div>
        </div>
        <button
          onClick={onProceed}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-xl shadow-orange-100 flex items-center gap-3 whitespace-nowrap active:scale-95 group"
        >
          Select Target Companies{" "}
          <ArrowRight
            size={22}
            strokeWidth={3}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* PATENT DETAILS */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-14 relative overflow-hidden">
        <div className="mb-12">
          <div className="bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-lg inline-flex items-center gap-2 mb-6 font-mono font-black text-[11px] text-slate-500 uppercase tracking-widest">
            {data?.patentId?.replace(/^patent\/|\/en$/gi, "") ||
              "WO2024122867A1"}
          </div>
          <h3 className="text-3xl md:text-5xl font-[1000] text-[#0f172a] tracking-tighter leading-tight">
            {biblio.title || "Patent Specification Analysis"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <InfoItem
            label="Assignee(s)"
            value={biblio.assignees?.join(", ")}
            icon={Users}
          />
          <InfoItem
            label="Publication Date"
            value={biblio.publicationDate}
            icon={Calendar}
          />
          <InfoItem
            label="Priority Date"
            value={biblio.priorityDate}
            icon={Calendar}
          />
          <InfoItem
            label="Inventors"
            value={biblio.inventors?.map((i) => i.name).join(", ")}
            icon={User}
          />
        </div>
      </div>

      {/* CLAIM SPEC MAPPING */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-14">
        <h3 className="text-2xl font-[1000] text-[#0f172a] mb-12 uppercase tracking-tight">
          Claim Spec Mapping
        </h3>
        <div className="flex flex-col gap-10">
          {mappings.map((item, index) => (
            <div
              key={index}
              className="bg-[#f8fafc] border border-slate-100 rounded-[35px] p-8 md:p-12 flex flex-col lg:flex-row gap-10 lg:gap-20 hover:bg-white hover:shadow-xl transition-all duration-500 group"
            >
              <div className="lg:w-1/3">
                <span className="text-7xl font-black text-slate-100 mb-6 block group-hover:text-orange-100 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[#0f172a] font-[1000] text-[17px] leading-relaxed">
                  {item.claimElement}
                </p>
              </div>
              <div className="lg:w-2/3 flex flex-col gap-12 lg:border-l border-slate-200 lg:pl-20">
                <div>
                  <span className="text-[#ff6b00] font-[1000] text-[12px] uppercase tracking-[2px] block mb-4">
                    Explanation
                  </span>
                  <p className="text-slate-500 text-lg leading-relaxed font-bold">
                    {item.specExplanation}
                  </p>
                </div>
                <div>
                  <span className="text-slate-900 font-[1000] text-[12px] uppercase tracking-[2px] block mb-4">
                    Support Support
                  </span>
                  <p className="text-slate-400 italic bg-white p-6 rounded-[24px] border border-slate-50 shadow-sm leading-relaxed">
                    "{item.specSupport}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-4">
    <span className="text-[#ff6b00] text-[11px] font-[1000] uppercase tracking-[2.5px] opacity-80">
      {label}
    </span>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-slate-400" />
      </div>
      <span className="text-[#0f172a] text-[15px] font-[1000] leading-snug pt-1">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

export default MappingView;
