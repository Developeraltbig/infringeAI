import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Upload, X } from 'lucide-react';
import { addBulkPatent, removeBulkPatent } from '../features/slice/analysisSlice';
import { useNavigate } from 'react-router-dom';

const SearchArea = () => {
  const dispatch = useDispatch();
  const { mode, bulkPatents } = useSelector((state) => state.analysis);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate()
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (mode === 'bulk') {
        dispatch(addBulkPatent(inputValue.trim()));
        setInputValue('');
      } else if (mode === 'interactive') {
        // Navigate to the claims page using React Router
       navigate('/processing');
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Search Input Box */}
      <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 flex flex-col">
        
        {/* Bulk Chips Area (Only visible in bulk mode) */}
        {mode === 'bulk' && bulkPatents.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
            {bulkPatents.map((patent, index) => (
              <span key={index} className="flex items-center text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
                {patent}
                <button 
                  onClick={() => dispatch(removeBulkPatent(index))}
                  className="ml-2 w-4 h-4 rounded-full bg-[#ff6b00] text-white flex items-center justify-center hover:bg-orange-600"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Actual Input Row */}
        <div className="flex items-center w-full relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'bulk' ? "Type patent and press Enter..." : "Enter Patent Number (E.G., US1234567B2)"}
            className="w-full px-6 py-4 text-lg text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
          />
         <button 
            onClick={() => handleKeyDown({ key: 'Enter' })} // Make button click work too
            className="absolute right-4 bg-[#ff6b00] hover:bg-orange-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
          >
            <Send size={20} className="" /> 
          </button>
        </div>
      </div>

      {/* Bottom helper text / Upload Area */}
      {mode === 'bulk' ? (
        <div className="w-full mt-8 flex flex-col items-center animate-fade-in">
          <p className="text-gray-400 text-sm mb-6">Add Multiple Patents — Each Analyzed In Parallel</p>
          <div className="w-full flex items-center justify-center gap-4 text-gray-300 before:content-[''] before:h-px before:flex-1 before:bg-gray-200 after:content-[''] after:h-px after:flex-1 after:bg-gray-200">
            or
          </div>
          
          {/* Drag & Drop Zone */}
          <div className="mt-6 w-full max-w-xl border-2 border-gray-200 border-dashed rounded-2xl bg-white p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-[#ff6b00] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <span className="text-gray-500 font-medium">Upload Excel/CSV</span>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-gray-400 text-sm">
          AI Selects The Best Claim & Targets Automatically
        </p>
      )}
    </div>
  );
};

export default SearchArea;



















