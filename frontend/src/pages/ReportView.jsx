import React, { useState, useMemo, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectDetailsQuery } from "../features/api/projectApiSlice";
import {
  ChevronDown,
  Check,
  X,
  Navigation,
  FileText,
  Building2,
  Box,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeChartIdx, setActiveChartIdx] = useState(0);
  const [isOtherProductsOpen, setIsOtherProductsOpen] = useState(false);

  // 1. Fetch Real Data
  const { data, isLoading, isError } = useGetProjectDetailsQuery(id);
  const project = data?.project;

  // 2. Logic: Determine if project failed
  const isFailed = useMemo(() => {
    if (!project) return false;
    // Project failed if status is 'failed' OR if it's 'completed' but has no results
    return (
      project.status === "failed" ||
      (project.status === "completed" &&
        (!project.results?.finalClaimChart ||
          project.results.finalClaimChart.length === 0))
    );
  }, [project]);

  // 3. Memoize current active result set
  const activeResult = useMemo(() => {
    return project?.results?.finalClaimChart?.[activeChartIdx] || null;
  }, [project, activeChartIdx]);

  // 4. Derived Stats
  const stats = useMemo(() => {
    if (!activeResult) return { found: 0, notFound: 0, unknown: 0 };
    const chart = activeResult.claimChart || [];
    return {
      found: chart.filter((c) => c.identified === "Found").length,
      notFound: chart.filter((c) => c.identified === "Not Found").length,
      unknown: chart.filter((c) => c.identified === "Unknown").length,
    };
  }, [activeResult]);

  // 🟢 RENDER: LOADING STATE
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-[#ff6b00] border-gray-200 rounded-full animate-spin"></div>
          <span className="text-gray-400 font-bold tracking-widest text-xs uppercase">
            Loading Analysis...
          </span>
        </div>
      </div>
    );

  // 🟢 RENDER: FAILURE STATE (Matches your request)
  if (isFailed || isError || !project) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center bg-[#faf9f6] p-6 overflow-auto">
        <div className="bg-white rounded-[10px]  border border-gray-100 p-12 md:p-20 max-w-2xl w-full flex flex-col items-center text-center animate-scale-up">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">
            Analysis <span className="text-red-500">Failed</span>
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed font-medium">
            We're sorry, but we encountered an error while generating your
            patent infringement analysis.
            {project?.failureReason && (
              <span className="block mt-2 text-red-400 italic">
                Reason: {project.failureReason}
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold transition-all"
            >
              <ArrowLeft size={18} /> Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all"
            >
              <RefreshCw size={18} /> Retry Load
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 RENDER: SUCCESS STATE (Existing UI)
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-5 p-6 animate-fade-in font-sans pb-20">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">
          Patent Infringement Claim Chart
        </h1>
        <div className="flex flex-wrap items-center gap-6">
          <HeaderTag
            icon={<FileText size={16} />}
            label={project.patentId.replace(/^patent\/|\/en$/gi, "")}
          />
          <HeaderTag
            icon={<Building2 size={16} />}
            label={activeResult?.company || "N/A"}
          />
          <HeaderTag
            icon={<Box size={16} />}
            label={activeResult?.productName}
          />
        </div>
      </div>

      {/* 2. Selection Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 overflow-x-auto hide-scrollbar">
        {project.results.finalClaimChart.map((chart, idx) => (
          <div
            key={idx}
            onClick={() => setActiveChartIdx(idx)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full border whitespace-nowrap cursor-pointer transition-all text-[11px] font-bold tracking-wider uppercase ${
              activeChartIdx === idx
                ? "bg-orange-50 border-[#ff6b00] text-gray-800"
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
          >
            {chart.productName}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${activeChartIdx === idx ? "bg-orange-100 text-[#ff6b00]" : "bg-gray-50 text-gray-300"}`}
            >
              {activeChartIdx === idx ? (
                <Check size={10} strokeWidth={4} />
              ) : (
                <X size={10} strokeWidth={4} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Chart */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
        <div className="bg-[#ff6b00] px-8 py-5 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold tracking-tight">
            {activeResult?.productName}
          </h2>
          <div className="bg-white/20 px-4 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md border border-white/10">
            {activeResult?.infringementScore === "H"
              ? "High Likelihood"
              : "Moderate Likelihood"}
          </div>
        </div>

        <div className="flex flex-col p-8 gap-10 bg-[#fafbfc]">
          {activeResult?.claimChart?.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 ${index !== activeResult.claimChart.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="lg:col-span-3">
                <p className="text-[14px] font-bold text-gray-800 leading-relaxed">
                  {row.claimElement}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Product Analysis
                </span>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {row.productAnalysis}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-4">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Evidence
                </span>
                <p className="text-[13px] text-gray-600 leading-relaxed italic border-l-2 border-orange-100 pl-4">
                  {row.supportingEvidence}
                </p>

                {/* 🔗 SOURCES BOX */}
                <div className="bg-[#fffcf7] border border-[#ffeed3] rounded-2xl p-5 mt-4">
                  <span className="text-[11px] font-bold text-gray-800 uppercase block mb-3 tracking-tighter">
                    Referenced Sources:
                  </span>
                  <div className="flex flex-col gap-2">
                    {row.sourceNumbers?.map((num) => (
                      <a
                        key={num}
                        href={activeResult.urlMapping?.[String(num)] || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-gray-100 rounded-xl flex items-center justify-between p-2.5 shadow-sm hover:border-orange-300 transition-colors group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-[11px] font-bold text-gray-700">
                            Source {num}:
                          </span>
                          <span className="text-[11px] text-gray-400 truncate w-40">
                            {activeResult.urlMapping?.[String(num)]}
                          </span>
                        </div>
                        <Navigation
                          size={12}
                          className="text-[#ff6b00] rotate-45 group-hover:scale-125 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 flex flex-col items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Status
                </span>
                <div
                  className={`px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm border ${row.identified === "Found" ? "bg-orange-50 border-orange-100 text-[#ff6b00]" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                >
                  {row.identified}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Summary Bar */}
      <div className="bg-[#fafbfc] border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <p className="text-[13px] text-gray-500 font-medium">
          Analysis of{" "}
          <span className="font-bold text-gray-800">
            {activeResult?.productName}
          </span>{" "}
          shows {activeResult?.infringementScore === "H" ? "high" : "moderate"}{" "}
          likelihood of infringement.
        </p>
        <div className="flex gap-6">
          <Stat text="Found" count={stats.found} color="text-[#ff6b00]" />
          <Stat text="Not Found" count={stats.notFound} color="text-red-500" />
          <Stat text="Unknown" count={stats.unknown} color="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

// --- HELPERS ---
const HeaderTag = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-gray-600">
    <div className="text-[#ff6b00]">{icon}</div> {label}
  </div>
);

const Stat = ({ text, count, color }) => (
  <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">
    {text}: <span className={color}>{count}</span>
  </span>
);

export default memo(ReportView);
