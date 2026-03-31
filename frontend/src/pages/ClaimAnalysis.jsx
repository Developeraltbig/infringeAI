import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';

// --- MOCK DATA ---
const patentDetails = {
  id: "US6421675B1",
  title: "Search Engine",
  assignees: "Globalbrainnet Inc, S L I Systems Inc",
  publicationDate: "2002-07-16",
  priorityDate: "1998-03-16",
  inventors: "Grant James Ryan, Shaun William Ryan, Craig Matthew Ryan, Wayne Alistar Munro, Dal Robinson"
};

const claimMappings = [
  {
    id: 1,
    claimText: "A method of selecting data records in a computer readable database, each data record having at least one classification, the method comprising the steps of:",
    explanation: "This Preamble Establishes The Context For The Method. It Operates In A Network Environment, Like The Internet, With Multiple Users And A Central Server. The Method's Purpose Is To Rank Data Items (Such As Web Pages Or URLs) In A Database By Assigning Them A Weight Based On Their Importance, Which Is Determined By User Interactions.",
    support: [
      "1- The Present Invention Is Preferably Implemented In A Network Environment Wherein Each Computer Contains, Typically, A Microprocessor, Memory And Modem...",
      "2- A Plurality Of User Sites/Computers 100 A- 100 D Are Shown, As Are A Plurality Of Server Computers 102 A-B",
      "3- By Updating The Database With The Selections Of Many Different Users, The Database Can Be Updated To Prioritize Those Web Listings That Have Been Selected The Most With Respect To A Given Keyword..."
    ]
  },
  {
    id: 2,
    claimText: "Receiving at said server computer one or more keywords from user sites;",
    explanation: "This Is The Initial Step Where A User On Their Computer (A 'user Site') Enters A Search Query, Or 'keyword'. This Keyword Is Then Transmitted Over The Network To The Server Computer That Hosts The Search Engine.",
    support: [
      "1- A User Enters A Search Command Comprised Of Suitable Keywords From A Keyboard At His Personal Computer.",
      "2- The Search Command Is Transmitted To A Server Computer..."
    ]
  }
];

// --- SUB-COMPONENTS ---



const ClaimAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      
   <Stepper /> 

      {/* 2. CTA Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Claim Analysis Complete</h2>
          <p className="text-gray-500 text-sm md:text-base">
            Your Patent Claim Has Been Analysed. Ready To Identify Target Companies?
          </p>
        </div>
        <button 
          onClick={() => navigate('/target-selection')} // Update with your actual next route
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-3 rounded-lg text-[15px] font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          Select Target Companies
          <ArrowRight size={18} />
        </button>
      </div>

      {/* 3. Patent Details Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">{patentDetails.id}</h3>
        <p className="text-gray-500 text-sm mb-8">{patentDetails.title}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[#ff6b00] text-sm font-medium">Assignee(s)</span>
            <span className="text-gray-600 text-sm leading-relaxed">{patentDetails.assignees}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#ff6b00] text-sm font-medium">Publication Date</span>
            <span className="text-gray-600 text-sm leading-relaxed">{patentDetails.publicationDate}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#ff6b00] text-sm font-medium">Priority Date</span>
            <span className="text-gray-600 text-sm leading-relaxed">{patentDetails.priorityDate}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#ff6b00] text-sm font-medium">Inventors</span>
            <span className="text-gray-600 text-sm leading-relaxed">{patentDetails.inventors}</span>
          </div>
        </div>
      </div>

      {/* 4. Claim Spec Mapping Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Claim Spec Mapping</h3>
        
        <div className="flex flex-col gap-6">
          {claimMappings.map((mapping) => (
            <div 
              key={mapping.id} 
              className="bg-[#fafbfc] border border-gray-100 rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row gap-8 md:gap-12"
            >
              {/* Left Column: Number & Claim Text */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                {/* Stylized Number */}
                <span className="text-5xl font-light text-[#ffb076] leading-none select-none" style={{ fontFamily: 'serif' }}>
                  {mapping.id}
                </span>
                <p className="text-gray-900 font-medium text-[15px] leading-relaxed">
                  {mapping.claimText}
                </p>
              </div>

              {/* Right Column: Explanations */}
              <div className="w-full md:w-2/3 flex flex-col gap-8">
                {/* Explanation */}
                <div className="flex flex-col gap-3">
                  <span className="text-[#ff6b00] font-medium text-[15px]">
                    Specification Explanation
                  </span>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {mapping.explanation}
                  </p>
                </div>

                {/* Support */}
                <div className="flex flex-col gap-3">
                  <span className="text-[#ff6b00] font-medium text-[15px]">
                    Specification Support
                  </span>
                  <div className="flex flex-col gap-4">
                    {mapping.support.map((text, idx) => (
                      <p key={idx} className="text-gray-500 text-sm leading-relaxed">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ClaimAnalysis;









