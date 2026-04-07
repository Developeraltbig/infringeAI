// import React, { useState, useCallback, memo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Send, Upload, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Redux Actions & API
// import {
//   addBulkPatent,
//   removeBulkPatent,
// } from "../features/slice/analysisSlice";
// import {
//   useStartBulkAnalysisMutation,
//   useStartQuickAnalysisMutation,
//   // useStartBulkAnalysisMutation,
// } from "../features/api/patentApiSlice";
// import ProcessingModal from "./ProcessingModal";

// const SearchArea = memo(() => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { mode, bulkPatents } = useSelector((state) => state.analysis);

//   const [inputValue, setInputValue] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [startQuick] = useStartQuickAnalysisMutation();
//   const [startBulk] = useStartBulkAnalysisMutation();

//   // 🟢 Handle adding/removing chips in Bulk Mode
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && inputValue.trim()) {
//       if (mode === "bulk") {
//         dispatch(addBulkPatent(inputValue.trim()));
//         setInputValue("");
//       } else {
//         handleExecute();
//       }
//     }
//   };

//   // 🚀 Trigger the Backend Workers
//   const handleExecute = useCallback(async () => {
//     // 1. Validation
//     if (mode === "bulk" && bulkPatents.length === 0)
//       return toast.info("Add at least one patent ID");
//     if (mode !== "bulk" && !inputValue.trim())
//       return toast.warning("Enter a patent ID");

//     setShowModal(true);

//     try {
//       let response;
//       if (mode === "bulk") {
//         // Send Array of IDs
//         response = await startBulk(bulkPatents).unwrap();
//         toast.success(`${bulkPatents.length} patents queued!`);

//         // In Bulk Mode, we redirect to the "My Projects" list to see all of them
//         setTimeout(() => {
//           setShowModal(false);
//           navigate("/dashboard/projects");
//         }, 1000);
//       } else {
//         // Send Single ID (Quick or Interactive)
//         response = await startQuick(inputValue.trim()).unwrap();

//         setTimeout(() => {
//           setShowModal(false);
//           navigate(`/dashboard/report-view/${response.projectId}`);
//         }, 800);
//       }
//     } catch (err) {
//       setShowModal(false);
//       toast.error(err?.data?.error || "Analysis failed to start");
//     }
//   }, [inputValue, mode, bulkPatents, startQuick, startBulk, navigate]);

//   return (
//     <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in">
//       {showModal && <ProcessingModal />}

//       {/* 1. Main Search Container */}
//       <div className="w-full bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-300 p-3 flex flex-col transition-all focus-within:shadow-lg focus-within:border-orange-200">
//         {/* Bulk Chips (Only in Bulk Mode) */}
//         {mode === "bulk" && bulkPatents.length > 0 && (
//           <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
//             {bulkPatents.map((patent, index) => (
//               <span
//                 key={index}
//                 className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-white transition-colors group"
//               >
//                 {patent}
//                 <button
//                   onClick={() => dispatch(removeBulkPatent(index))}
//                   className="text-gray-300 hover:text-[#ff6b00]"
//                 >
//                   <X size={14} strokeWidth={3} />
//                 </button>
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Input Row */}
//         <div className="flex items-center w-full relative">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder={
//               mode === "bulk"
//                 ? "Enter Patent Number (E.G., US1234567B2) and press Enter..."
//                 : "Enter Patent Number (E.G., US1234567B2)"
//             }
//             className="w-full px-6 py-3 text-lg text-gray-700 bg-transparent outline-none placeholder:text-gray-300 font-medium"
//           />
//           <button
//             onClick={handleExecute}
//             className="absolute right-4 bg-[#ff6b00] hover:bg-orange-600 text-white p-3.5 rounded-full shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95"
//           >
//             <Send size={20} fill="white" />
//           </button>
//         </div>
//       </div>

//       {/* 2. Mode-Specific Bottom Section */}
//       {mode === "bulk" ? (
//         <div className="w-full mt-10 flex flex-col items-center animate-fade-in">
//           <p className="text-gray-400 text-sm font-medium tracking-wide mb-8 uppercase opacity-80">
//             Add Multiple Patents — Each Analyzed In Parallel
//           </p>

//           <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-8">
//             <div className="h-px flex-1 bg-gray-100"></div>
//             <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">
//               or
//             </span>
//             <div className="h-px flex-1 bg-gray-100"></div>
//           </div>

//           {/* Drag & Drop Zone */}
//           <div className="w-full max-w-2xl border-2 border-gray-400 border-dashed rounded-[32px] bg-white/50 p-12 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50/30 transition-all group border-spacing-4">
//             <div className="w-14 h-14 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform">
//               <Upload size={28} strokeWidth={2.5} />
//             </div>
//             <span className="text-gray-500 font-bold text-lg tracking-tight">
//               Upload Excel/CSV
//             </span>
//             <span className="text-gray-400 text-sm mt-1">
//               Maximum 10 patents per batch
//             </span>
//           </div>
//         </div>
//       ) : (
//         <p className="mt-10 text-gray-400 text-sm font-medium tracking-wide flex items-center gap-2 opacity-70">
//           <span className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full animate-pulse"></span>
//           AI Selects The Best Claim & Targets Automatically
//         </p>
//       )}
//     </div>
//   );
// });

// export default SearchArea;

import React, { useState, useCallback, memo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  addBulkPatent,
  removeBulkPatent,
} from "../features/slice/analysisSlice";
import {
  useStartAnalysisMutation,
  useUploadBulkFileMutation,
} from "../features/api/patentApiSlice";
import ProcessingModal from "./ProcessingModal";

const SearchArea = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { mode, bulkPatents } = useSelector((state) => state.analysis);

  const [inputValue, setInputValue] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [startAnalysis] = useStartAnalysisMutation();
  const [uploadFile] = useUploadBulkFileMutation();

  const handleExecute = useCallback(async () => {
    try {
      const body =
        mode === "bulk"
          ? { mode, patentIds: bulkPatents }
          : { mode, patentId: inputValue.trim() };

      const res = await startAnalysis(body).unwrap();

      if (mode === "bulk") navigate("/dashboard/projects");
      else setActiveProjectId(res.projectId);
    } catch (err) {
      /* Toast Error */
    }
  }, [mode, bulkPatents, inputValue, startAnalysis, navigate]);

  const onFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await uploadFile(formData).unwrap();
    navigate("/dashboard/projects");
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {activeProjectId && (
        <ProcessingModal
          projectId={activeProjectId}
          onClose={() => setActiveProjectId(null)}
        />
      )}

      <div className="w-full bg-white rounded-3xl shadow-sm border p-3 flex flex-col">
        {mode === "bulk" && bulkPatents.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2">
            {bulkPatents.map((p, idx) => (
              <span
                key={idx}
                className="flex gap-2 text-sm bg-gray-50 border rounded-full px-3 py-1.5 font-medium"
              >
                {p}{" "}
                <X
                  size={14}
                  className="cursor-pointer text-orange-500"
                  onClick={() => dispatch(removeBulkPatent(idx))}
                />
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center w-full relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (mode === "bulk"
                ? dispatch(addBulkPatent(inputValue))
                : handleExecute())
            }
            placeholder="Enter Patent Number..."
            className="w-full px-6 py-5 text-lg outline-none bg-transparent"
          />
          <button
            onClick={handleExecute}
            className="absolute right-4 bg-[#ff6b00] p-3.5 rounded-full text-white shadow-lg shadow-orange-100 hover:scale-105 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {mode === "bulk" && (
        <div className="w-full mt-10 flex flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileUpload}
            accept=".csv, .xlsx"
          />
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full max-w-2xl border-2 border-gray-100 border-dashed rounded-[32px] p-12 flex flex-col items-center cursor-pointer hover:border-[#ff6b00] transition-all bg-white/50 group"
          >
            <Upload
              size={28}
              className="text-[#ff6b00] group-hover:scale-110 transition-transform mb-4"
            />
            <span className="font-bold text-gray-500">Upload Excel/CSV</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchArea;
