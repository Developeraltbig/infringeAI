import React, { memo } from 'react';

const Stepper = memo(({ activeStep }) => {
  const steps = [
    { num: 1, label: 'Enter Patent' },
    { num: 2, label: 'Claim Analysis' },
    { num: 3, label: 'Target Selection' },
    { num: 4, label: 'Final Report' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center w-full mb-6">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => {
          const isActive = step.num <= activeStep;
          const isCurrent = step.num === activeStep;

          return (
            <React.Fragment key={step.num}>
              <div className="flex items-center gap-3">
                {/* Circle Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  isActive ? 'bg-[#ff6b00] text-white shadow-lg shadow-orange-200' : 'bg-white border border-gray-300 text-gray-400'
                }`}>
                  {step.num}
                </div>
                {/* Label */}
                <span className={`text-sm font-bold transition-all ${
                  isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-16 h-[2px] mx-4 transition-all duration-700 ${
                  step.num < activeStep ? 'bg-[#ff6b00]' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

export default Stepper;