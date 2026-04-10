import React, { memo } from "react";

const Stepper = memo(({ activeStep }) => {
  const steps = [
    { num: 1, label: "Enter Patent" },
    { num: 2, label: "Claim Analysis" },
    { num: 3, label: "Target Selection" },
    { num: 4, label: "Final Report" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 w-full mb-6 overflow-x-auto hide-scrollbar">
      {/* 🟢 min-w-max ensures the stepper doesn't wrap or squash on mobile */}
      <div className="flex items-center justify-start md:justify-center min-w-max mx-auto px-2">
        {steps.map((step, index) => {
          const isActive = step.num <= activeStep;
          const isCurrent = step.num === activeStep;

          return (
            <React.Fragment key={step.num}>
              {/* Step Circle and Label */}
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Circle Number */}
                <div
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-500 shrink-0 ${
                    isActive
                      ? "bg-[#ff6b00] text-white shadow-lg shadow-orange-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.num}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] md:text-[13px] font-bold uppercase tracking-tight whitespace-nowrap transition-all ${
                    isCurrent ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line - Width is responsive */}
              {index < steps.length - 1 && (
                <div
                  className={`w-6 sm:w-10 md:w-20 h-[2px] mx-2 md:mx-4 rounded-full transition-all duration-700 shrink-0 ${
                    step.num < activeStep ? "bg-[#ff6b00]" : "bg-gray-100"
                  }`}
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
