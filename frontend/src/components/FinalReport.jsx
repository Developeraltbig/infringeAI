import React from 'react';
import { ArrowRight } from 'lucide-react';
import Stepper from '../components/Stepper';

const FinalReport = () => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      
      {/* 1. Progress Stepper (Step 4 Active) */}
      <Stepper />

      {/* 2. Main Completion Card */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.02)] border border-gray-100 px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center mt-2">
        
        {/* Header Text */}
        <h2 className="text-4xl md:text-[42px] font-bold text-gray-900 mb-5 tracking-tight">
          Infringement Analysis <span className="text-[#ff6b00]">Complete!</span>
        </h2>
        
        <p className="text-gray-500 text-[15px] max-w-2xl leading-relaxed mb-12 px-4">
          Your Comprehensive Patent Infringement Analysis Has Been Successfully Completed. All Claim
          Charts And Evidence Have Been Generated.
        </p>

        {/* Inner Report Box */}
        <div className="w-full max-w-2xl bg-[#fafbfc] border border-gray-100 rounded-2xl p-8 md:p-12 flex flex-col items-center">
          
          <h3 className="text-[#ff6b00] text-[22px] font-semibold mb-8">
            Analysis Complete
          </h3>

          {/* White Patent ID Container */}
          <div className="bg-white border border-gray-100 rounded-xl px-8 py-10 w-full max-w-md shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-8 flex flex-col items-center justify-center">
            <span className="text-[26px] font-bold text-gray-800 mb-2 tracking-wide">
              US6421675B1
            </span>
            <span className="text-gray-500 text-[16px]">
              Search Engine
            </span>
          </div>

          <p className="text-gray-500 text-[15px] mb-8">
            Your Infringement Analysis Is Complete And Ready To View
          </p>

          <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-2">
            View Report
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default FinalReport;