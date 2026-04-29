import React, { useState, useCallback, memo } from "react";
import { Plus, Check, ArrowRight, X } from "lucide-react";
import { useFinalizeInteractiveMutation } from "../../features/api/interactiveApiSlice";
import { toast } from "react-toastify";
import CompanyLogo from "../company-logo/CompanyLogo";
import Stepper from "../Stepper";

const TargetSelectionStep = memo(({ projectId, data }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const [finalize, { isLoading }] = useFinalizeInteractiveMutation();

  const handleToggle = useCallback((item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.company === item.company);
      if (exists) return prev.filter((i) => i.company !== item.company);
      if (prev.length >= 3) {
        toast.info("Maximum 3 companies allowed");
        return prev;
      }
      return [...prev, { company: item.company, product: item.product }];
    });
  }, []);

  const handleAddManual = () => {
    if (!manualInput.trim()) return;
    if (selectedItems.length >= 3)
      return toast.info("Maximum 3 companies allowed");
    setSelectedItems((prev) => [
      ...prev,
      {
        company: manualInput.trim(),
        product: "Custom Product",
        isManual: true,
      },
    ]);
    setManualInput("");
  };

  const handleStartAnalysis = async () => {
    try {
      await finalize({ projectId, selectedItems }).unwrap();
    } catch (err) {
      toast.error("Failed to start analysis");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-12">
      {/* 🟢 STEPPER INCLUDED */}
      <Stepper activeStep={4} />

      {/* MANUAL INPUT */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row justify-between items-center gap-4 group hover:shadow-md transition-all">
        <div className="w-full md:w-1/2 relative">
          <input
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
            placeholder="Add Company Manually..."
            className="w-full border border-slate-200 rounded-2xl py-4 pl-6 pr-16 text-sm outline-none focus:border-[#ff6b00] bg-slate-50 transition-all font-bold"
          />
          <button
            onClick={handleAddManual}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-[#ff6b00] text-white rounded-xl flex items-center justify-center hover:bg-[#e66000] transition-all"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
        <div className="flex gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[2px]">
          <span>Min: 1</span>
          <div className="w-px h-4 bg-slate-200" />
          <span>Max: 3</span>
        </div>
      </div>

      {/* SELECTED PANEL */}
      <div
        className={`bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-8 transition-all duration-500 shadow-sm ${selectedItems.length > 0 ? "opacity-100" : "opacity-40"}`}
      >
        <div className="flex-1 w-full">
          <h3 className="text-xl font-[1000] text-[#0f172a] mb-5">
            {selectedItems.length} Selected Targets
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl animate-scale-up hover:bg-white transition-colors"
              >
                <CompanyLogo companyName={item.company} size={20} />
                <span className="text-sm font-black text-[#0f172a]">
                  {item.company}
                </span>
                <X
                  size={14}
                  className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => handleToggle(item)}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          disabled={selectedItems.length === 0 || isLoading}
          onClick={handleStartAnalysis}
          className="w-full md:w-auto bg-[#ff6b00] hover:bg-[#e66000] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-100 transition-all"
        >
          {isLoading ? "Analyzing..." : "Start Analysis"}{" "}
          <ArrowRight size={22} strokeWidth={3} />
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.allDiscoveredProducts
            ?.slice(0, visibleCount)
            .map((company, idx) => {
              const isSelected = selectedItems.some(
                (s) => s.company === company.company,
              );
              const isMax = selectedItems.length >= 3 && !isSelected;
              return (
                <div
                  key={idx}
                  onClick={() => !isMax && handleToggle(company)}
                  className={`border-2 rounded-[35px] p-8 flex flex-col gap-6 transition-all duration-500 relative ${isSelected ? "border-[#ff6b00] bg-[#fff7ed]/40 shadow-xl" : isMax ? "opacity-30 grayscale cursor-not-allowed scale-95" : "border-slate-50 hover:border-slate-200 cursor-pointer bg-white shadow-sm hover:scale-[1.02]"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="p-1 bg-white rounded-xl shadow-sm border border-slate-50">
                      <CompanyLogo companyName={company.company} size={52} />
                    </div>
                    <div
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#ff6b00] border-[#ff6b00] shadow-[0_0_10px_#ff6b00]" : "border-slate-100 bg-white"}`}
                    >
                      {isSelected && (
                        <Check
                          size={18}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#0f172a] mb-2 tracking-tight truncate">
                      {company.company}
                    </h4>
                    <p className="text-slate-400 text-[11px] font-bold leading-relaxed line-clamp-3 italic">
                      "{company.description}"
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
        {visibleCount < (data?.allDiscoveredProducts?.length || 0) && (
          <button
            onClick={() => setVisibleCount((v) => v + 8)}
            className="mx-auto mt-16 block bg-slate-900 hover:bg-black text-white px-12 py-4.5 rounded-2xl font-black transition-all shadow-xl active:scale-95"
          >
            Show More Results
          </button>
        )}
      </div>
    </div>
  );
});

export default TargetSelectionStep;
