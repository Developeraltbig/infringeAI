import React, { useState, useCallback, memo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Redux Actions & API Hooks
import {
  addBulkPatent,
  removeBulkPatent,
} from "../features/slice/analysisSlice";
import {
  useStartAnalysisMutation,
  useUploadBulkFileMutation,
} from "../features/api/patentApiSlice";

// Components
import ProcessingModal from "./ProcessingModal";

const SearchArea = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 1. Redux State
  const { mode, bulkPatents } = useSelector((state) => state.analysis);

  // 2. Local UI States
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [patentIdForModal, setPatentIdForModal] = useState("");

  // 3. Error Handling States for Modal
  const [isApiError, setIsApiError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 4. API Mutations
  const [startAnalysis] = useStartAnalysisMutation();
  const [uploadFile] = useUploadBulkFileMutation();

  /**
   * 🚀 EXECUTE ANALYSIS
   * Opens modal immediately and then hits the backend
   */
  const handleExecute = useCallback(async () => {
    const patentId = inputValue.trim();

    // Basic Validation
    if (mode !== "bulk" && !patentId)
      return toast.warning("Please enter a Patent ID");
    if (mode === "bulk" && bulkPatents.length === 0)
      return toast.warning("Please add at least one Patent ID");

    // 🟢 STEP 1: UI Feedback - Open Modal Instantly
    setIsApiError(false);
    setErrorMsg("");
    setPatentIdForModal(
      mode === "bulk" ? `${bulkPatents.length} Patents` : patentId,
    );
    setIsModalOpen(true);

    try {
      // 🟢 STEP 2: Prepare Payload
      const payload =
        mode === "bulk"
          ? { mode, patentIds: bulkPatents }
          : { mode: mode || "quick", patentId };

      // 🟢 STEP 3: API Call
      const res = await startAnalysis(payload).unwrap();

      // 🟢 STEP 4: Success - Update Modal State
      if (mode === "bulk") {
        // For Bulk, we might just want to show "Queued" then go to history
        setActiveProjectId("bulk_mode");
      } else {
        setActiveProjectId(res.projectId);
      }

      setInputValue(""); // Clear input field
    } catch (err) {
      // 🔴 STEP 5: Failure - Trigger "Failed" state in Modal
      setIsApiError(true);
      setErrorMsg(
        err?.data?.error || "Unable to reach the AI engine. Please try again.",
      );
      console.error("Analysis Start Error:", err);
    }
  }, [mode, bulkPatents, inputValue, startAnalysis]);

  /**
   * 📁 FILE UPLOAD HANDLER
   */
  const onFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsApiError(false);
    setPatentIdForModal(file.name);
    setIsModalOpen(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFile(formData).unwrap();

      // On success, show complete state
      setActiveProjectId(res.projectIds?.[0] || "bulk_file");
      toast.success("File uploaded and queued successfully");
    } catch (err) {
      setIsApiError(true);
      setErrorMsg(
        err?.data?.error ||
          "File upload failed. Ensure it is a valid CSV/XLSX.",
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in ">
      {/* 🔴 THE MODAL 
          Props passed: 
          - projectId: if null, shows loader. if string, shows success.
          - isError: if true, shows failure screen.
      */}
      {isModalOpen && (
        <ProcessingModal
          projectId={activeProjectId}
          patentId={patentIdForModal}
          isError={isApiError}
          errorMessage={errorMsg}
          onClose={() => {
            setIsModalOpen(false);
            setActiveProjectId(null);
            setIsApiError(false);
          }}
        />
      )}

      {/* SEARCH BAR CONTAINER */}
      <div className="w-full bg-white border border-gray-300 rounded-[18px] p-3 flex flex-col transition-all focus-within:shadow-xl focus-within:border-orange-200">
        {/* Bulk Patent Chips */}
        {mode === "bulk" && bulkPatents.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
            {bulkPatents.map((p, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-300 rounded-full px-4 py-2 font-bold text-gray-600 transition-colors hover:bg-white"
              >
                {p}
                <X
                  size={14}
                  className="cursor-pointer text-[#ff6b00] hover:scale-125 transition-transform"
                  onClick={() => dispatch(removeBulkPatent(idx))}
                />
              </span>
            ))}
          </div>
        )}

        {/* Search Input Row */}
        <div className="flex items-center w-full relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (mode === "bulk" && inputValue.trim()) {
                  dispatch(addBulkPatent(inputValue.trim()));
                  setInputValue("");
                } else {
                  handleExecute();
                }
              }
            }}
            placeholder={
              mode === "bulk"
                ? "Add multiple patents..."
                : "Enter Patent Number (E.G., US1234567)"
            }
            className="w-full px-6 py-4 text-lg outline-none bg-transparent placeholder:text-gray-300 text-gray-700"
          />
          <button
            onClick={handleExecute}
            className="absolute right-4 bg-[#ff6b00] hover:bg-orange-600 text-white p-3.5 rounded-full shadow-lg shadow-orange-100 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} fill="white" />
          </button>
        </div>
      </div>

      {/* MODE HELPER TEXT */}
      {mode !== "bulk" && (
        <p className="mt-6 text-gray-400 text-[13px] font-medium tracking-wide uppercase opacity-70">
          AI Selects The Best Claim & Targets Automatically
        </p>
      )}

      {/* BULK UPLOAD SECTION */}
      {mode === "bulk" && (
        <div className="w-full mt-10 flex flex-col items-center animate-fade-in">
          <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-8 px-10">
            <div className="h-px flex-1 bg-gray-200/60"></div>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">
              or
            </span>
            <div className="h-px flex-1 bg-gray-200/60"></div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileUpload}
            accept=".csv, .xlsx"
          />
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full max-w-2xl border-2 border-gray-300 border-dashed rounded-[15px] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50/30 transition-all bg-white/50 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
              <Upload size={28} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-600 text-lg tracking-tight">
              Upload Excel/CSV
            </span>
            <span className="text-gray-400 text-xs mt-2 font-bold tracking-widest uppercase opacity-60">
              Max 10 Patents Per Batch
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchArea;
