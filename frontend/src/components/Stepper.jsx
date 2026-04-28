import React, { memo } from "react";
import { Check } from "lucide-react";

const Stepper = memo(({ activeStep }) => {
  const steps = [
    { num: 1, label: "Enter Patent" },
    { num: 2, label: "Select Claim" },
    { num: 3, label: "Review Mapping" },
    { num: 4, label: "Select Targets" },
    { num: 5, label: "Final Chart" },
  ];

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-4 md:p-6 w-full mb-8 overflow-x-auto hide-scrollbar">
      <div className="flex items-center justify-between max-w-5xl mx-auto min-w-max px-4">
        {steps.map((step, index) => {
          const isCompleted = step.num < activeStep;
          const isCurrent = step.num === activeStep;

          return (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 shadow-md
                  ${isCompleted || isCurrent ? "bg-[#ff6b00] text-white shadow-orange-200" : "bg-slate-50 text-slate-300 border border-slate-100"}`}
                >
                  {isCompleted ? <Check size={18} strokeWidth={4} /> : step.num}
                </div>
                <span
                  className={`text-[12px] font-black uppercase tracking-wider ${isCurrent ? "text-[#0f172a]" : "text-slate-300"}`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 rounded-full min-w-[40px] md:min-w-[80px] transition-all duration-700
                  ${step.num < activeStep ? "bg-[#ff6b00]" : "bg-slate-100"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

export default Stepper;
