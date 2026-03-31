import React, { useState } from 'react';
import { ArrowRight, Plus, Check } from 'lucide-react';
import Stepper from '../components/Stepper';
import { useNavigate } from 'react-router-dom';

// Mock data for target companies
const targetCompanies = [
  { id: 'alphabet', name: 'Alphabet Inc.', desc: 'Google Search Uses Clickthrough Rates To Adjust Result Rankings.', logo: 'A' },
  { id: 'microsoft', name: 'Microsoft Corporation', desc: 'Bing Search Engine Uses Clickstream Data To Rank Results.', logo: 'M' },
  { id: 'amazon', name: 'Amazon.com, Inc.', desc: 'A9 Product Search Algorithm Weights Results By User Clicks.', logo: 'a' },
  { id: 'apple', name: 'Apple Inc.', desc: 'App Store Search Ranks Apps Based On User Selections.', logo: '' },
  { id: 'meta', name: 'Meta Platforms, Inc.', desc: 'Facebook And Instagram Search Results Influenced By User Clicks.', logo: '∞' },
  { id: 'netflix', name: 'Netflix, Inc.', desc: 'Content Search Uses Post-Click Viewing Data For Ranking.', logo: 'N' },
  { id: 'disney', name: 'The Walt Disney Company', desc: 'Disney+ And Hulu Search Ranks Content By User Selections.', logo: 'D' },
  { id: 'spotify', name: 'Spotify Technology S.A.', desc: 'Music Search Uses Post-Click Plays To Weight Results.', logo: 'S' },
];

const TargetSelection = () => {
  // State to hold selected company IDs
  const [selectedIds, setSelectedIds] = useState(['alphabet', 'microsoft', 'amazon']);
 const navigate = useNavigate();

  const handleToggle = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id); // Deselect
      } else {
        if (prev.length >= 3) return prev; // Max 3 selection limit
        return [...prev, id]; // Select
      }
    });
  };

  // Get full company objects for the selected banner
  const selectedCompanies = targetCompanies.filter(c => selectedIds.includes(c.id));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 animate-fade-in pb-12">
      
      {/* 1. Interactive Stepper Component */}
      <Stepper />

      {/* 2. Top Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-1/2 relative">
          <input 
            type="text" 
            placeholder="Add Company Manually...." 
            className="w-full border border-gray-200 rounded-lg py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#ff6b00]"
          />
          <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#ff6b00] hover:bg-[#e66000] rounded-md text-white flex items-center justify-center transition-colors">
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium whitespace-nowrap">
          <span>Select Min - 1</span>
          <span className="text-[#ff6b00] h-4 w-[1px] bg-[#ff6b00] opacity-50"></span>
          <span>Select Max - 3</span>
        </div>
      </div>

      {/* 3. Selected Companies Banner (Shows if > 0 selected) */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 ${selectedIds.length > 0 ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>
        <div className="flex flex-col gap-3">
          <span className="font-bold text-gray-900">
            <span className="text-[#ff6b00]">{selectedIds.length}</span> Selected
          </span>
          <div className="flex flex-wrap items-center gap-6">
            {selectedCompanies.map((company) => (
              <div key={company.id} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                  {company.logo}
                </div>
                <span className="text-sm text-gray-600">{company.name}</span>
              </div>
            ))}
            {selectedIds.length === 0 && <span className="text-sm text-gray-400">No companies selected yet.</span>}
          </div>
        </div>
        <button 
      onClick={() => selectedIds.length > 0 && navigate('/final-report')} // STEP 4 Action!
      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
        selectedIds.length > 0 
        ? 'bg-[#ff6b00] hover:bg-[#e66000] text-white cursor-pointer' 
        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      Start Analysis
      <ArrowRight size={16} />
    </button>
      </div>

      {/* 4. Company Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {targetCompanies.map((company) => {
            const isSelected = selectedIds.includes(company.id);
            const isDisabled = !isSelected && selectedIds.length >= 3;

            return (
              <div 
                key={company.id}
                onClick={() => !isDisabled && handleToggle(company.id)}
                className={`border rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 ${
                  isSelected 
                    ? 'border-[#ff6b00] bg-orange-50/30' 
                    : isDisabled 
                      ? 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50' 
                      : 'border-gray-100 hover:border-gray-300 cursor-pointer bg-white'
                }`}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    {/* Placeholder Logo Box */}
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700 shrink-0">
                      {company.logo}
                    </div>
                    <span className="text-[15px] font-semibold text-gray-900 leading-tight">
                      {company.id === 'alphabet' ? 'View Full Claim' : company.name}
                    </span>
                  </div>
                  
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors mt-1 ${
                    isSelected ? 'bg-[#ff6b00]' : 'border border-gray-200 bg-white'
                  }`}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                </div>

                {/* Card Body */}
                <p className="text-gray-500 text-[13px] leading-relaxed">
                  {company.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        <div className="flex justify-center">
          <button className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            Show More
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TargetSelection;











