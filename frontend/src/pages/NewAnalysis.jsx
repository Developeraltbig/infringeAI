
import React from 'react';
import { useSelector } from 'react-redux';
import Stepper from '../components/Stepper'; // Import the Stepper
import ModeSelector from '../components/ModeSelector';
import SearchArea from '../components/SearchArea';

const NewAnalysis = () => {
  // Get the current mode from Redux
  const mode = useSelector((state) => state.analysis.mode);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-8 animate-fade-in-up">
      
      {/* Conditionally show Stepper ONLY in interactive mode */}
      {/* {mode === 'interactive' && (
        <div className="w-full max-w-5xl mb-8">
          <Stepper />
        </div>
      )} */}

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4">
          Patent Infringement <span className="text-[#ff6b00]">Analysis</span>
        </h2>
        <p className="text-gray-500 text-lg">
          Generate Professional Claim Charts In Minutes.
        </p>
      </div>
      
      <ModeSelector />
      <SearchArea />
    </div>
  );
};

export default NewAnalysis;