// import React, { useState, useCallback, memo, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Send, Upload, X, Plus, ListFilter, ArrowRight } from "lucide-react";
// import { toast } from "react-toastify";
// import * as XLSX from "xlsx";

// // Redux Actions
// import {
//   addBulkPatent,
//   removeBulkPatent,
//   clearBulkPatents,
//   setBulkPatents,
// } from "../features/slice/analysisSlice";

// // ✅ Action to sync absolute server credits
// import { setCredits } from "../features/auth/authSlice";

// import { useStartAnalysisMutation } from "../features/api/patentApiSlice";
// import { useStartInteractiveMutation } from "../features/api/interactiveApiSlice";

// const SearchArea = memo(({ onStarted, onCreditCheck, creditsLeft = 50 }) => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const { mode, bulkPatents } = useSelector((state) => state.analysis);
//   const [inputValue, setInputValue] = useState("");
//   const [error, setError] = useState("");

//   const [startAnalysis, { isLoading: isStarting }] = useStartAnalysisMutation();
//   const [startInteractive, { isLoading: isStartingInteractive }] =
//     useStartInteractiveMutation();

//   const isLoading = isStarting || isStartingInteractive;

//   // 🛡️ Validation Logic
//   const validatePatent = (id) => {
//     const regex = /^[A-Z0-9/.-]{5,25}$/;
//     return regex.test(id);
//   };

//   /**
//    * 📁 FRONTEND FILE PARSER
//    */
//   const onFileUpload = useCallback(
//     async (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         try {
//           const data = new Uint8Array(event.target.result);
//           const workbook = XLSX.read(data, { type: "array" });
//           const sheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[sheetName];
//           const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//           const extractedIds = json
//             .flat()
//             .map((id) => String(id).trim().toUpperCase())
//             .filter((id) => id && validatePatent(id));

//           if (extractedIds.length === 0) {
//             return toast.error("No valid patent IDs found in the file.");
//           }

//           dispatch(setBulkPatents(extractedIds));
//           toast.success(`Extracted ${extractedIds.length} patents from file.`);
//           e.target.value = null;
//         } catch (err) {
//           toast.error("Error reading file. Please use CSV or XLSX.");
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     },
//     [dispatch],
//   );

//   const handleAdd = useCallback(() => {
//     const id = inputValue.trim().toUpperCase();
//     if (!id) return;
//     if (!validatePatent(id)) return setError("Invalid format.");
//     if (bulkPatents.includes(id)) return setError("Already added.");
//     dispatch(addBulkPatent(id));
//     setInputValue("");
//     setError("");
//   }, [inputValue, bulkPatents, dispatch]);

//   const handleExecute = useCallback(async () => {
//     // 1. Guard — if parent modal blocks, abort
//     if (onCreditCheck && !onCreditCheck()) return;

//     const id = inputValue.trim().toUpperCase();

//     // Prevent empty executions
//     if (mode !== "bulk" && !id)
//       return toast.error("Please enter a patent number.");
//     if (mode === "bulk" && bulkPatents.length === 0)
//       return toast.error("Please add at least one patent.");

//     // 2. Cost Logic: Exactly 1 credit per patent
//     const count = mode === "bulk" ? bulkPatents.length : 1;
//     const required = count;

//     // 3. Front-end fallback pre-check
//     if (creditsLeft < required) {
//       onCreditCheck && onCreditCheck(); // Triggers modal
//       return toast.error("Insufficient credits.");
//     }

//     try {
//       const payload =
//         mode === "bulk"
//           ? { mode, patentIds: bulkPatents }
//           : { mode, patentId: id };
//       const res =
//         mode === "interactive"
//           ? await startInteractive(id).unwrap()
//           : await startAnalysis(payload).unwrap();

//       // 4. ✅ EXACT SYNC: Update global Redux with the exact number from the backend (e.g., 49)
//       if (res && typeof res.credits === "number") {
//         dispatch(setCredits(res.credits));
//       }

//       const targetId = res.projectId || (res.projectIds && res.projectIds[0]);
//       if (targetId) onStarted(targetId);
//       setInputValue("");
//     } catch (err) {
//       // 5. Server 402 Handler
//       if (err?.data?.error === "INSUFFICIENT_CREDITS" || err?.status === 402) {
//         onCreditCheck && onCreditCheck();
//         return;
//       }
//       toast.error(err?.data?.error || "Execution failed.");
//     }
//   }, [
//     mode,
//     bulkPatents,
//     inputValue,
//     creditsLeft,
//     startAnalysis,
//     startInteractive,
//     dispatch,
//     onStarted,
//     onCreditCheck,
//   ]);

//   return (
//     <div className="w-full max-w-5xl flex flex-col items-center px-4">
//       <div className="w-full bg-white border border-gray-200 rounded-[35px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] p-2 transition-all focus-within:shadow-xl">
//         {/* INPUT ROW */}
//         <div className="flex items-center gap-2 p-1">
//           <div className="flex-1 flex items-center px-6 gap-4">
//             <div className="text-[#ff6b00] opacity-80">
//               <ListFilter size={20} />
//             </div>
//             <input
//               value={inputValue}
//               onChange={(e) => {
//                 setInputValue(e.target.value);
//                 setError("");
//               }}
//               onKeyDown={(e) =>
//                 e.key === "Enter" &&
//                 (mode === "bulk" ? handleAdd() : handleExecute())
//               }
//               placeholder="Add patent number"
//               className="w-full py-4 text-lg outline-none bg-transparent placeholder:text-gray-300 font-bold text-gray-700"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="flex items-center gap-3 pr-2">
//             {mode === "bulk" ? (
//               <>
//                 <button
//                   onClick={handleAdd}
//                   disabled={isLoading}
//                   className="bg-[#ff6b00] text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-orange-100 active:scale-95 transition-all disabled:opacity-50"
//                 >
//                   <Plus size={18} strokeWidth={4} /> Add
//                 </button>
//                 <button
//                   onClick={() => fileInputRef.current.click()}
//                   disabled={isLoading}
//                   className="bg-white border border-gray-100 text-gray-400 px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
//                 >
//                   <Upload size={18} strokeWidth={2.5} /> Upload
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleExecute}
//                 disabled={isLoading || creditsLeft <= 0}
//                 className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-lg active:scale-95 transition-all ${
//                   creditsLeft <= 0 || isLoading
//                     ? "bg-gray-400 opacity-50 cursor-not-allowed grayscale text-white"
//                     : "bg-[#ff6b00] text-white shadow-orange-200 hover:bg-[#e66000]"
//                 }`}
//               >
//                 {creditsLeft <= 0
//                   ? "No Credits"
//                   : mode === "interactive"
//                     ? "Begin"
//                     : "Analyze"}
//                 {creditsLeft > 0 && <ArrowRight size={22} strokeWidth={3} />}
//               </button>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="mx-3 mb-2 bg-red-50 border border-red-100 p-4 rounded-[20px] animate-fade-in">
//             <p className="text-red-500 font-black text-sm tracking-tight">
//               {error}
//             </p>
//           </div>
//         )}

//         {/* 🟢 CHIPS AREA */}
//         {mode === "bulk" && bulkPatents.length > 0 && (
//           <div className="px-6 py-5 border-t border-gray-50 bg-[#fafbfc]/30 mt-2 animate-fade-in">
//             <div className="flex flex-wrap gap-3 mb-8">
//               {bulkPatents.map((p, idx) => (
//                 <span
//                   key={idx}
//                   className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-2.5 text-sm font-black text-gray-700 shadow-sm transition-all hover:border-orange-200 group"
//                 >
//                   {p}
//                   <button
//                     onClick={() => dispatch(removeBulkPatent(idx))}
//                     className="text-gray-300 group-hover:text-[#ff6b00]"
//                   >
//                     <X size={14} strokeWidth={3} />
//                   </button>
//                 </span>
//               ))}
//             </div>

//             <div className="flex justify-between items-center border-t border-gray-100 pt-6">
//               <button
//                 onClick={() => dispatch(clearBulkPatents())}
//                 disabled={isLoading}
//                 className="text-gray-400 font-black text-xs uppercase tracking-[2px] hover:text-red-500 transition-colors px-2 disabled:opacity-50"
//               >
//                 Clear
//               </button>

//               <button
//                 onClick={handleExecute}
//                 disabled={isLoading || creditsLeft <= 0}
//                 className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl active:scale-95 transition-all ${
//                   creditsLeft <= 0 || isLoading
//                     ? "bg-gray-400 opacity-50 cursor-not-allowed grayscale text-white"
//                     : "bg-[#ff6b00] text-white hover:bg-[#e66000]"
//                 }`}
//               >
//                 {creditsLeft <= 0
//                   ? "No Credits Left"
//                   : `Analyze ${bulkPatents.length} ${bulkPatents.length === 1 ? "patent" : "patents"}`}
//                 {creditsLeft > 0 && <ArrowRight size={22} strokeWidth={3} />}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         accept=".csv, .xlsx"
//         onChange={onFileUpload}
//         disabled={isLoading}
//       />
//     </div>
//   );
// });

// export default SearchArea;
import React, { useState, useCallback, memo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Upload,
  X,
  Plus,
  ArrowRight,
  FileText,
  BarChart3,
  Sparkles,
  Download,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

import {
  addBulkPatent,
  removeBulkPatent,
  clearBulkPatents,
  setBulkPatents,
} from "../features/slice/analysisSlice";
import { setCredits } from "../features/auth/authSlice";
import { useStartAnalysisMutation } from "../features/api/patentApiSlice";
import { useStartInteractiveMutation } from "../features/api/interactiveApiSlice";

const SearchArea = memo(({ onStarted, onCreditCheck }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { mode, bulkPatents } = useSelector((state) => state.analysis);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const [startAnalysis, { isLoading: isStarting }] = useStartAnalysisMutation();
  const [startInteractive, { isLoading: isStartingInteractive }] =
    useStartInteractiveMutation();
  const isLoading = isStarting || isStartingInteractive;

  const validatePatent = (id) => /^[A-Z0-9/.-]{5,25}$/.test(id);

  const onFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const extractedIds = json
            .flat()
            .map((id) => String(id).trim().toUpperCase())
            .filter((id) => id && validatePatent(id));
          if (extractedIds.length === 0)
            return toast.error("No valid patents found.");
          dispatch(setBulkPatents(extractedIds));
          e.target.value = null;
        } catch (err) {
          toast.error("File error.");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [dispatch],
  );

  const handleAdd = useCallback(() => {
    const id = inputValue.trim().toUpperCase();
    if (!id) return;
    if (!validatePatent(id)) return setError("Invalid format.");
    if (bulkPatents.includes(id)) return setError("Already added.");
    dispatch(addBulkPatent(id));
    setInputValue("");
    setError("");
  }, [inputValue, bulkPatents, dispatch]);

  const handleDownloadTemplate = useCallback(() => {
    const templateData = [["Patent Number"], ["US10686266B2"], ["EP3456789A1"]];
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    worksheet["!cols"] = [{ wch: 25 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patents");
    XLSX.writeFile(workbook, "Patsero_Bulk_Template.xlsx");
  }, []);

  const handleExecute = useCallback(async () => {
    const id = inputValue.trim().toUpperCase();
    if (mode !== "bulk" && !id) return toast.error("Please enter a patent.");
    if (mode === "bulk" && bulkPatents.length === 0)
      return toast.error("Add patents first.");
    try {
      const payload =
        mode === "bulk"
          ? { mode, patentIds: bulkPatents }
          : { mode, patentId: id };
      const res =
        mode === "interactive"
          ? await startInteractive(id).unwrap()
          : await startAnalysis(payload).unwrap();
      if (res?.credits) dispatch(setCredits(res.credits));
      const targetId = res.projectId || res.projectIds?.[0];
      if (targetId) onStarted(targetId);
      setInputValue("");
    } catch (err) {
      toast.error("Execution failed.");
    }
  }, [
    mode,
    bulkPatents,
    inputValue,
    startAnalysis,
    startInteractive,
    dispatch,
    onStarted,
  ]);

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-5 animate-fade-in px-4">
      {/* 🟠 MAIN SEARCH CARD */}
      <div className="w-full bg-white border border-gray-100 rounded-[32px] md:rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] p-4 md:p-6 flex flex-col gap-5">
        {/* INPUT ROW */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-gray-50/60 border border-gray-100 rounded-full flex items-center px-5 h-14 md:h-16 transition-all focus-within:bg-white focus-within:border-orange-500/20 focus-within:shadow-sm">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm shrink-0">
              {mode === "bulk" && <Plus size={18} strokeWidth={2.5} />}
              {mode === "quick" && (
                <FileText size={18} className="opacity-40" />
              )}
              {mode === "interactive" && (
                <Sparkles size={18} fill="currentColor" />
              )}
            </div>
            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (mode === "bulk" ? handleAdd() : handleExecute())
              }
              placeholder={
                mode === "bulk"
                  ? "Add patent number"
                  : "Enter patent number, e.g. US1234567B2"
              }
              className="flex-1 bg-transparent px-4 text-base md:text-lg font-bold text-gray-700 outline-none placeholder:text-gray-300 placeholder:font-semibold"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {mode === "bulk" ? (
              <>
                <button
                  onClick={handleAdd}
                  className="h-14 md:h-16 bg-orange-600 text-white px-8 rounded-2xl md:rounded-[24px] font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all flex-1 md:flex-none"
                >
                  <Plus size={18} strokeWidth={3} /> Add
                </button>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="h-14 md:h-16 bg-white border border-gray-200 text-gray-700 px-6 rounded-2xl md:rounded-[24px] font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all flex-1 md:flex-none whitespace-nowrap"
                >
                  <Upload size={18} /> Upload Excel
                </button>
              </>
            ) : (
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="h-14 md:h-16 bg-orange-600 text-white px-10 md:px-12 rounded-2xl md:rounded-[28px] font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all w-full"
              >
                {mode === "interactive" ? "Begin" : "Analyze"}
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* HELP SECTION */}
        <div className="w-full bg-white border border-gray-50 rounded-[24px] md:rounded-[32px] p-5 md:p-7 flex flex-col md:flex-row items-center gap-5">
          {mode === "bulk" ? (
            <div className="w-full flex flex-col md:flex-row items-center gap-6">
              <div className="flex-2 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                  <Plus size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">
                    Add patents one by one.
                  </h4>
                  <p className="text-gray-400 text-xs md:text-[13px] font-semibold">
                    Use Add after each patent number. Add dozens or hundreds if
                    needed.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center h-12 w-px bg-gray-100 relative mx-2">
                <span className="absolute bg-white border border-gray-100 rounded-full px-2 py-0.5 text-[9px] font-bold text-gray-300 uppercase">
                  OR
                </span>
              </div>

              <div className="flex-2 flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                    <Upload size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">
                      Upload an Excel sheet.
                    </h4>
                    <p className="text-gray-400 text-xs md:text-[13px] font-semibold leading-tight">
                      First column only: one patent per row, no header. Download
                      the template if needed.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 border border-orange-600/10 text-orange-600 px-4 py-2.5 rounded-xl font-bold text-xs bg-orange-50/50 hover:bg-orange-50 transition-all whitespace-nowrap"
                >
                  <Download size={14} /> Download Excel Template
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5 px-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                  <FileText size={18} />
                </div>
                <p className="text-gray-700 font-bold text-sm md:text-base">
                  {mode === "interactive"
                    ? "Review claims for a single patent."
                    : "Generate a quick chart for one patent."}
                </p>
              </div>
              <div className="hidden md:block w-px h-10 bg-gray-100"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                  {mode === "interactive" ? (
                    <Search size={18} />
                  ) : (
                    <BarChart3 size={18} />
                  )}
                </div>
                <p className="text-gray-700 font-bold text-sm md:text-base">
                  {mode === "interactive"
                    ? "Pick an independent claim next."
                    : "View results instantly after processing."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BULK LIST AREA */}
        {mode === "bulk" && bulkPatents.length > 0 && (
          <div className="w-full bg-gray-50/30 border border-gray-100 rounded-[28px] md:rounded-[35px] p-6 md:p-8 flex flex-col gap-6 animate-scale-up">
            <div className="flex flex-wrap gap-3 min-h-[40px]">
              {bulkPatents.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-sm font-bold text-gray-700 text-sm group hover:border-orange-500/30 transition-all"
                >
                  {p}
                  <button
                    onClick={() => dispatch(removeBulkPatent(idx))}
                    className="text-gray-300 group-hover:text-red-500 transition-colors"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-200/60 pt-6">
              <button
                onClick={() => dispatch(clearBulkPatents())}
                className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Clear All
              </button>

              <button
                onClick={handleExecute}
                className="h-14 md:h-16 bg-orange-600 text-white px-10 md:px-12 rounded-[22px] md:rounded-[26px] font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all"
              >
                Analyze {bulkPatents.length}{" "}
                {bulkPatents.length === 1 ? "patent" : "patents"}
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">
          {error}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv, .xlsx"
        onChange={onFileUpload}
      />
    </div>
  );
});

export default SearchArea;
