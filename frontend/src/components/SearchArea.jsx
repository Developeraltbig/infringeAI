// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Send, Upload, X } from 'lucide-react';
// import { addBulkPatent, removeBulkPatent } from '../features/slice/analysisSlice';
// import { useNavigate } from 'react-router-dom';

// const SearchArea = () => {
//   const dispatch = useDispatch();
//   const { mode, bulkPatents } = useSelector((state) => state.analysis);
//   const [inputValue, setInputValue] = useState('');
//   const navigate = useNavigate()

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && inputValue.trim()) {
//       if (mode === 'bulk') {
//         dispatch(addBulkPatent(inputValue.trim()));
//         setInputValue('');
//       } else if (mode === 'interactive') {
//         // Navigate to the claims page using React Router
//        navigate('/processing');
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
//       {/* Search Input Box */}
//       <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 flex flex-col">

//         {/* Bulk Chips Area (Only visible in bulk mode) */}
//         {mode === 'bulk' && bulkPatents.length > 0 && (
//           <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
//             {bulkPatents.map((patent, index) => (
//               <span key={index} className="flex items-center text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
//                 {patent}
//                 <button
//                   onClick={() => dispatch(removeBulkPatent(index))}
//                   className="ml-2 w-4 h-4 rounded-full bg-[#ff6b00] text-white flex items-center justify-center hover:bg-orange-600"
//                 >
//                   <X size={10} />
//                 </button>
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Actual Input Row */}
//         <div className="flex items-center w-full relative">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={mode === 'bulk' ? "Type patent and press Enter..." : "Enter Patent Number (E.G., US1234567B2)"}
//             className="w-full px-6 py-4 text-lg text-gray-600 bg-transparent outline-none placeholder:text-gray-400"
//           />
//          <button
//             onClick={() => handleKeyDown({ key: 'Enter' })} // Make button click work too
//             className="absolute right-4 bg-[#ff6b00] hover:bg-orange-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
//           >
//             <Send size={20} className="" />
//           </button>
//         </div>
//       </div>

//       {/* Bottom helper text / Upload Area */}
//       {mode === 'bulk' ? (
//         <div className="w-full mt-8 flex flex-col items-center animate-fade-in">
//           <p className="text-gray-400 text-sm mb-6">Add Multiple Patents — Each Analyzed In Parallel</p>
//           <div className="w-full flex items-center justify-center gap-4 text-gray-300 before:content-[''] before:h-px before:flex-1 before:bg-gray-200 after:content-[''] after:h-px after:flex-1 after:bg-gray-200">
//             or
//           </div>

//           {/* Drag & Drop Zone */}
//           <div className="mt-6 w-full max-w-xl border-2 border-gray-200 border-dashed rounded-2xl bg-white p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50 transition-all group">
//             <div className="w-12 h-12 rounded-full bg-[#ff6b00] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <Upload size={24} />
//             </div>
//             <span className="text-gray-500 font-medium">Upload Excel/CSV</span>
//           </div>
//         </div>
//       ) : (
//         <p className="mt-8 text-gray-400 text-sm">
//           AI Selects The Best Claim & Targets Automatically
//         </p>
//       )}
//     </div>
//   );
// };

// export default SearchArea;

import React, { useState, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Redux Actions & API
import {
  addBulkPatent,
  removeBulkPatent,
} from "../features/slice/analysisSlice";
import {
  useStartQuickAnalysisMutation,
  useStartBulkAnalysisMutation,
} from "../features/api/patentApiSlice";
import ProcessingModal from "./ProcessingModal";

const SearchArea = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, bulkPatents } = useSelector((state) => state.analysis);

  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [startQuick] = useStartQuickAnalysisMutation();
  const [startBulk] = useStartBulkAnalysisMutation();

  // 🟢 Handle adding/removing chips in Bulk Mode
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (mode === "bulk") {
        dispatch(addBulkPatent(inputValue.trim()));
        setInputValue("");
      } else {
        handleExecute();
      }
    }
  };

  // 🚀 Trigger the Backend Workers
  const handleExecute = useCallback(async () => {
    // 1. Validation
    if (mode === "bulk" && bulkPatents.length === 0)
      return toast.info("Add at least one patent ID");
    if (mode !== "bulk" && !inputValue.trim())
      return toast.warning("Enter a patent ID");

    setShowModal(true);

    try {
      let response;
      if (mode === "bulk") {
        // Send Array of IDs
        response = await startBulk(bulkPatents).unwrap();
        toast.success(`${bulkPatents.length} patents queued!`);

        // In Bulk Mode, we redirect to the "My Projects" list to see all of them
        setTimeout(() => {
          setShowModal(false);
          navigate("/dashboard/projects");
        }, 1000);
      } else {
        // Send Single ID (Quick or Interactive)
        response = await startQuick(inputValue.trim()).unwrap();

        setTimeout(() => {
          setShowModal(false);
          navigate(`/dashboard/report-view/${response.projectId}`);
        }, 800);
      }
    } catch (err) {
      setShowModal(false);
      toast.error(err?.data?.error || "Analysis failed to start");
    }
  }, [inputValue, mode, bulkPatents, startQuick, startBulk, navigate]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in">
      {showModal && <ProcessingModal />}

      {/* 1. Main Search Container */}
      <div className="w-full bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 p-3 flex flex-col transition-all focus-within:shadow-lg focus-within:border-orange-200">
        {/* Bulk Chips (Only in Bulk Mode) */}
        {mode === "bulk" && bulkPatents.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
            {bulkPatents.map((patent, index) => (
              <span
                key={index}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-white transition-colors group"
              >
                {patent}
                <button
                  onClick={() => dispatch(removeBulkPatent(index))}
                  className="text-gray-300 hover:text-[#ff6b00]"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center w-full relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "bulk"
                ? "Type ID and press Enter..."
                : "Enter Patent Number (E.G., US1234567B2)"
            }
            className="w-full px-6 py-5 text-lg text-gray-700 bg-transparent outline-none placeholder:text-gray-300 font-medium"
          />
          <button
            onClick={handleExecute}
            className="absolute right-4 bg-[#ff6b00] hover:bg-orange-600 text-white p-3.5 rounded-full shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} fill="white" />
          </button>
        </div>
      </div>

      {/* 2. Mode-Specific Bottom Section */}
      {mode === "bulk" ? (
        <div className="w-full mt-10 flex flex-col items-center animate-fade-in">
          <p className="text-gray-400 text-sm font-medium tracking-wide mb-8 uppercase opacity-80">
            Add Multiple Patents — Each Analyzed In Parallel
          </p>

          <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-8">
            <div className="h-px flex-1 bg-gray-100"></div>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">
              or
            </span>
            <div className="h-px flex-1 bg-gray-100"></div>
          </div>

          {/* Drag & Drop Zone */}
          <div className="w-full max-w-2xl border-2 border-gray-100 border-dashed rounded-[32px] bg-white/50 p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50/30 transition-all group border-spacing-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
              <Upload size={28} strokeWidth={2.5} />
            </div>
            <span className="text-gray-500 font-bold text-lg tracking-tight">
              Upload Excel/CSV
            </span>
            <span className="text-gray-400 text-sm mt-1">
              Maximum 10 patents per batch
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-10 text-gray-400 text-sm font-medium tracking-wide flex items-center gap-2 opacity-70">
          <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse"></span>
          AI Selects The Best Claim & Targets Automatically
        </p>
      )}
    </div>
  );
});

export default SearchArea;
