// import React, {
//   useState,
//   useCallback,
//   memo,
//   useRef,
//   Suspense,
//   lazy,
// } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Send, Upload, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Redux Actions
// import {
//   addBulkPatent,
//   removeBulkPatent,
// } from "../features/slice/analysisSlice";

// // API Hooks
// import {
//   useStartAnalysisMutation,
//   useUploadBulkFileMutation,
// } from "../features/api/patentApiSlice";
// import { useStartInteractiveMutation } from "../features/api/interactiveApiSlice";

// // 🚀 LAZY LOADING: Modal is only loaded when needed
// const ProcessingModal = lazy(() => import("./ProcessingModal"));

// // 🟢 Sub-Component: Memoized Chips for Bulk Mode
// const BulkChips = memo(({ patents, onRemove }) => (
//   <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
//     {patents.map((p, idx) => (
//       <span
//         key={idx}
//         className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-100 rounded-full px-4 py-2 font-bold text-gray-500 transition-all hover:bg-white"
//       >
//         {p}
//         <X
//           size={14}
//           className="cursor-pointer text-[#ff6b00] hover:scale-125 transition-transform"
//           onClick={() => onRemove(idx)}
//         />
//       </span>
//     ))}
//   </div>
// ));

// // 🔵 Sub-Component: Memoized Upload Zone
// const UploadZone = memo(({ onUpload }) => {
//   const fileInputRef = useRef(null);
//   return (
//     <div className="w-full mt-10 flex flex-col items-center animate-fade-in">
//       <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-10 px-10 font-sans">
//         <div className="h-px flex-1 bg-gray-300"></div>
//         <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">
//           or
//         </span>
//         <div className="h-px flex-1 bg-gray-300"></div>
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         onChange={onUpload}
//         accept=".csv, .xlsx"
//       />
//       <div
//         onClick={() => fileInputRef.current.click()}
//         className="w-full max-w-2xl border-2 border-gray-300 border-dashed rounded-[12px] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50 transition-all bg-white/50 group"
//       >
//         <div className="w-16 h-16 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
//           <Upload size={32} strokeWidth={2.5} />
//         </div>
//         <span className="font-bold text-gray-700 text-xl tracking-tight">
//           Upload Excel/CSV
//         </span>
//         <span className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-widest">
//           Max 10 Patents
//         </span>
//       </div>
//     </div>
//   );
// });

// const SearchArea = memo(({ onStarted }) => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const { mode, bulkPatents } = useSelector((state) => state.analysis);
//   const [inputValue, setInputValue] = useState("");

//   const [startQuickOrBulk, { isLoading: isStarting }] =
//     useStartAnalysisMutation();
//   const [startInteractive] = useStartInteractiveMutation();
//   const [uploadFile] = useUploadBulkFileMutation();

//   const handleExecute = useCallback(async () => {
//     const id = inputValue.trim();
//     if (mode === "bulk" ? bulkPatents.length === 0 : !id) {
//       return toast.warning("Please provide patent ID(s)");
//     }
//     try {
//       let res;
//       if (mode === "interactive") {
//         res = await startInteractive(id).unwrap();
//       } else if (mode === "bulk") {
//         res = await startQuickOrBulk({
//           mode: "bulk",
//           patentIds: bulkPatents,
//         }).unwrap();
//       } else {
//         res = await startQuickOrBulk({ mode: "quick", patentId: id }).unwrap();
//       }
//       const targetId = res.projectId || (res.projectIds && res.projectIds[0]);
//       if (targetId) onStarted(targetId);
//       setInputValue("");
//     } catch (err) {
//       toast.error(err?.data?.error || "Error starting analysis");
//     }
//   }, [
//     mode,
//     bulkPatents,
//     inputValue,
//     startInteractive,
//     startQuickOrBulk,
//     onStarted,
//   ]);

//   const onFileUpload = useCallback(
//     async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       try {
//         const formData = new FormData();
//         formData.append("file", file);
//         const res = await uploadFile(formData).unwrap();
//         if (res.projectIds?.length > 0) onStarted(res.projectIds[0]);
//       } catch (err) {
//         toast.error("File upload failed");
//       }
//     },
//     [uploadFile, onStarted],
//   );

//   return (
//     <div className="w-full max-w-4xl flex flex-col items-center">
//       {/* 🟢 MAIN SEARCH BOX (Matches Screenshot) */}
//       <div className="w-full bg-white border border-gray-100 rounded-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.03)] p-3 flex flex-col transition-all focus-within:shadow-xl">
//         {/* Bulk Chips Area */}
//         {mode === "bulk" && bulkPatents.length > 0 && (
//           <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
//             {bulkPatents.map((p, idx) => (
//               <span
//                 key={idx}
//                 className="flex items-center gap-2 text-[13px] bg-gray-50 border border-gray-200 rounded-full px-4 py-2 font-bold text-gray-500"
//               >
//                 {p}{" "}
//                 <X
//                   size={14}
//                   className="cursor-pointer text-[#ff6b00] hover:scale-125 transition-all"
//                   onClick={() => dispatch(removeBulkPatent(idx))}
//                 />
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Input Row */}
//         <div className="flex items-center w-full relative">
//           <input
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={(e) =>
//               e.key === "Enter" &&
//               (mode === "bulk" && inputValue.trim()
//                 ? (dispatch(addBulkPatent(inputValue.trim())),
//                   setInputValue(""))
//                 : handleExecute())
//             }
//             placeholder={
//               mode === "bulk"
//                 ? "Enter Patent Number (E.G., US1234567B2) and press Enter..."
//                 : "Enter Patent Number (E.G., US1234567B2)"
//             }
//             className="w-full px-6 py-5 text-lg outline-none bg-transparent placeholder:text-gray-300 font-medium text-gray-700"
//           />
//           <button
//             onClick={handleExecute}
//             disabled={isStarting}
//             className="absolute right-4 bg-[#ff6b00] hover:bg-[#e66000] text-white p-4 rounded-full shadow-lg transition-all active:scale-90"
//           >
//             <Send size={22} fill="white" />
//           </button>
//         </div>
//       </div>

//       {/* 🟢 BULK MODE BOTTOM SECTION (Matches Screenshot) */}
//       {mode === "bulk" && (
//         <div className="w-full mt-12 flex flex-col items-center animate-fade-in">
//           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10 opacity-70">
//             Add Multiple Patents — Each Analyzed In Parallel
//           </p>

//           {/* "or" Divider Logic */}
//           <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-10 px-20">
//             <div className="h-px flex-1 bg-gray-200"></div>
//             <span className="text-gray-400 font-black text-xs uppercase tracking-widest">
//               or
//             </span>
//             <div className="h-px flex-1 bg-gray-200"></div>
//           </div>

//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             onChange={onFileUpload}
//             accept=".csv, .xlsx"
//           />

//           {/* Dashed Upload Box */}
//           <div
//             onClick={() => fileInputRef.current.click()}
//             className="w-full max-w-3xl border-2 border-gray-200 border-dashed rounded-[35px] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50/30 group transition-all"
//           >
//             <div className="w-16 h-16 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
//               <Upload size={32} strokeWidth={2.5} />
//             </div>
//             <span className="font-bold text-gray-600 text-2xl tracking-tight">
//               Upload Excel/CSV
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// });

// export default SearchArea;


import React, { useState, useCallback, memo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send, Upload, X, Plus, ListFilter, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // 🚀 Added for frontend parsing

// Redux Actions
import { 
  addBulkPatent, 
  removeBulkPatent, 
  clearBulkPatents, 
  deductCredits,
  setBulkPatents // Ensure this exists in your slice to add multiple at once
} from "../features/slice/analysisSlice";

import { useStartAnalysisMutation } from "../features/api/patentApiSlice";
import { useStartInteractiveMutation } from "../features/api/interactiveApiSlice";

const SearchArea = memo(({ onStarted }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { mode, bulkPatents, tempCredits } = useSelector((state) => state.analysis);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const [startAnalysis, { isLoading: isStarting }] = useStartAnalysisMutation();
  const [startInteractive] = useStartInteractiveMutation();

  // 🛡️ Validation Logic
  const validatePatent = (id) => {
    const regex = /^[A-Z0-9/.-]{5,25}$/;
    return regex.test(id);
  };

  /**
   * 📁 NEW: FRONTEND FILE PARSER
   * Reads the file and adds IDs as chips instead of starting the project
   */
  const onFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Flatten array and sanitize
        const extractedIds = json
          .flat()
          .map(id => String(id).trim().toUpperCase())
          .filter(id => id && validatePatent(id));

        if (extractedIds.length === 0) {
          return toast.error("No valid patent IDs found in the file.");
        }

        // 🚀 Add all found patents to Redux chips area
        dispatch(setBulkPatents(extractedIds));
        toast.success(`Extracted ${extractedIds.length} patents from file.`);
        
        // Reset file input so user can upload the same file again if needed
        e.target.value = null;
      } catch (err) {
        toast.error("Error reading file. Please use CSV or XLSX.");
      }
    };
    reader.readAsArrayBuffer(file);
  }, [dispatch]);

  const handleAdd = useCallback(() => {
    const id = inputValue.trim().toUpperCase();
    if (!id) return;
    if (!validatePatent(id)) return setError("Invalid format.");
    if (bulkPatents.includes(id)) return setError("Already added.");
    dispatch(addBulkPatent(id));
    setInputValue("");
    setError("");
  }, [inputValue, bulkPatents, dispatch]);

  const handleExecute = useCallback(async () => {
    const id = inputValue.trim().toUpperCase();
    const count = mode === 'bulk' ? bulkPatents.length : 1;
    const required = mode === 'interactive' ? 10 : (count * 7);

    if (tempCredits < required) return toast.error("Insufficient credits.");

    try {
      const payload = mode === "bulk" ? { mode, patentIds: bulkPatents } : { mode, patentId: id };
      const res = mode === "interactive" 
        ? await startInteractive(id).unwrap() 
        : await startAnalysis(payload).unwrap();

      dispatch(deductCredits(required));
      onStarted(res.projectId);
    } catch (err) {
      toast.error("Execution failed.");
    }
  }, [mode, bulkPatents, inputValue, tempCredits, startAnalysis, startInteractive, dispatch, onStarted]);

  return (
    <div className="w-full max-w-5xl flex flex-col items-center px-4">
      <div className="w-full bg-white border border-gray-200 rounded-[35px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] p-2 transition-all focus-within:shadow-xl">
        
        {/* INPUT ROW */}
        <div className="flex items-center gap-2 p-1">
          <div className="flex-1 flex items-center px-6 gap-4">
            <div className="text-[#ff6b00] opacity-80"><ListFilter size={20} /></div>
            <input
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && (mode === 'bulk' ? handleAdd() : handleExecute())}
              placeholder="Add patent number"
              className="w-full py-4 text-lg outline-none bg-transparent placeholder:text-gray-300 font-bold text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3 pr-2">
            {mode === 'bulk' ? (
              <>
                <button onClick={handleAdd} className="bg-[#ff6b00] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-100 active:scale-95 transition-all">
                  <Plus size={18} strokeWidth={4} /> Add
                </button>
                <button onClick={() => fileInputRef.current.click()} className="bg-white border border-gray-100 text-gray-400 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                   <Upload size={18} strokeWidth={2.5} /> Upload
                </button>
              </>
            ) : (
              <button onClick={handleExecute} className="bg-[#ff6b00] text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-lg shadow-orange-200 active:scale-95 transition-all">
                {mode === 'interactive' ? 'Begin' : 'Analyze'} <ArrowRight size={22} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-3 mb-2 bg-red-50 border border-red-100 p-4 rounded-[20px] animate-fade-in">
             <p className="text-red-500 font-black text-sm tracking-tight">{error}</p>
          </div>
        )}

        {/* 🟢 CHIPS AREA (Visible after manual add OR upload) */}
        {mode === 'bulk' && bulkPatents.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-50 bg-[#fafbfc]/30 mt-2 animate-fade-in">
            <div className="flex flex-wrap gap-3 mb-8">
              {bulkPatents.map((p, idx) => (
                <span key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-2.5 text-sm font-black text-gray-700 shadow-sm transition-all hover:border-orange-200 group">
                  {p}
                  <button onClick={() => dispatch(removeBulkPatent(idx))} className="text-gray-300 group-hover:text-[#ff6b00]">
                    <X size={14} strokeWidth={3} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
               <button onClick={() => dispatch(clearBulkPatents())} className="text-gray-400 font-black text-xs uppercase tracking-[2px] hover:text-red-500 transition-colors px-2">Clear</button>
               <button onClick={handleExecute} className="bg-[#ff6b00] text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                  Analyze {bulkPatents.length} {bulkPatents.length === 1 ? 'patent' : 'patents'} <ArrowRight size={22} strokeWidth={3} />
               </button>
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={onFileUpload} />
    </div>
  );
});

export default SearchArea;