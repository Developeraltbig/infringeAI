import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Stepper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define steps and their corresponding routes
  const steps = [
    { num: 1, label: 'Enter Patent', path: '/' },
    { num: 2, label: 'Claim Analysis', path: '/analysis-complete' },
    { num: 3, label: 'Target Selection', path: '/target-selection' },
    { num: 4, label: 'Final Report', path: '/final-report' },
  ];

  // Determine current active step based on URL
  const currentStepIndex = steps.findIndex(step => step.path === location.pathname);
  // Default to 1 if route not found in array (e.g., intermediate loading screens)
  const activeStepNum = currentStepIndex !== -1 ? steps[currentStepIndex].num : 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center overflow-x-auto hide-scrollbar w-full mb-6">
      <div className="flex items-center min-w-max">
        {steps.map((step, index) => {
          // A step is "active" (orange) if we are currently on it, or have passed it
          const isActive = step.num <= activeStepNum;

          return (
            <React.Fragment key={step.num}>
              <div 
                onClick={() => navigate(step.path)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#ff6b00] text-white group-hover:bg-[#e66000]' 
                    : 'bg-white border border-gray-300 text-gray-400 group-hover:border-[#ff6b00]'
                }`}>
                  {step.num}
                </div>
                <span className={`text-sm transition-colors ${
                  isActive ? 'text-gray-800 font-medium' : 'text-gray-400 group-hover:text-gray-600'
                }`}>
                  {step.label}
                </span>
              </div>
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-[2px] mx-3 md:mx-4 transition-colors ${
                  step.num < activeStepNum ? 'bg-[#ff6b00]' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;