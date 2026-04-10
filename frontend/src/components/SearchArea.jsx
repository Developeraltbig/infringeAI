import React, {
  useState,
  useCallback,
  memo,
  useRef,
  Suspense,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Redux Actions
import {
  addBulkPatent,
  removeBulkPatent,
} from "../features/slice/analysisSlice";

// API Hooks
import {
  useStartAnalysisMutation,
  useUploadBulkFileMutation,
} from "../features/api/patentApiSlice";
import { useStartInteractiveMutation } from "../features/api/interactiveApiSlice";

// 🚀 LAZY LOADING: Modal is only loaded when needed
const ProcessingModal = lazy(() => import("./ProcessingModal"));

// 🟢 Sub-Component: Memoized Chips for Bulk Mode
const BulkChips = memo(({ patents, onRemove }) => (
  <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
    {patents.map((p, idx) => (
      <span
        key={idx}
        className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-100 rounded-full px-4 py-2 font-bold text-gray-500 transition-all hover:bg-white"
      >
        {p}
        <X
          size={14}
          className="cursor-pointer text-[#ff6b00] hover:scale-125 transition-transform"
          onClick={() => onRemove(idx)}
        />
      </span>
    ))}
  </div>
));

// 🔵 Sub-Component: Memoized Upload Zone
const UploadZone = memo(({ onUpload }) => {
  const fileInputRef = useRef(null);
  return (
    <div className="w-full mt-10 flex flex-col items-center animate-fade-in">
      <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-10 px-10 font-sans">
        <div className="h-px flex-1 bg-gray-300"></div>
        <span className="text-gray-400 font-bold text-xs uppercase tracking-tighter">
          or
        </span>
        <div className="h-px flex-1 bg-gray-300"></div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onUpload}
        accept=".csv, .xlsx"
      />
      <div
        onClick={() => fileInputRef.current.click()}
        className="w-full max-w-2xl border-2 border-gray-300 border-dashed rounded-[12px] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50 transition-all bg-white/50 group"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
          <Upload size={32} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-gray-700 text-xl tracking-tight">
          Upload Excel/CSV
        </span>
        <span className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-widest">
          Max 10 Patents
        </span>
      </div>
    </div>
  );
});

const SearchArea = memo(({ onStarted }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { mode, bulkPatents } = useSelector((state) => state.analysis);
  const [inputValue, setInputValue] = useState("");

  const [startQuickOrBulk, { isLoading: isStarting }] =
    useStartAnalysisMutation();
  const [startInteractive] = useStartInteractiveMutation();
  const [uploadFile] = useUploadBulkFileMutation();

  const handleExecute = useCallback(async () => {
    const id = inputValue.trim();
    if (mode === "bulk" ? bulkPatents.length === 0 : !id) {
      return toast.warning("Please provide patent ID(s)");
    }
    try {
      let res;
      if (mode === "interactive") {
        res = await startInteractive(id).unwrap();
      } else if (mode === "bulk") {
        res = await startQuickOrBulk({
          mode: "bulk",
          patentIds: bulkPatents,
        }).unwrap();
      } else {
        res = await startQuickOrBulk({ mode: "quick", patentId: id }).unwrap();
      }
      const targetId = res.projectId || (res.projectIds && res.projectIds[0]);
      if (targetId) onStarted(targetId);
      setInputValue("");
    } catch (err) {
      toast.error(err?.data?.error || "Error starting analysis");
    }
  }, [
    mode,
    bulkPatents,
    inputValue,
    startInteractive,
    startQuickOrBulk,
    onStarted,
  ]);

  const onFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadFile(formData).unwrap();
        if (res.projectIds?.length > 0) onStarted(res.projectIds[0]);
      } catch (err) {
        toast.error("File upload failed");
      }
    },
    [uploadFile, onStarted],
  );

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* 🟢 MAIN SEARCH BOX (Matches Screenshot) */}
      <div className="w-full bg-white border border-gray-100 rounded-[24px] shadow-[0_15px_50px_rgba(0,0,0,0.03)] p-3 flex flex-col transition-all focus-within:shadow-xl">
        {/* Bulk Chips Area */}
        {mode === "bulk" && bulkPatents.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-2 animate-scale-up">
            {bulkPatents.map((p, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 text-[13px] bg-gray-50 border border-gray-200 rounded-full px-4 py-2 font-bold text-gray-500"
              >
                {p}{" "}
                <X
                  size={14}
                  className="cursor-pointer text-[#ff6b00] hover:scale-125 transition-all"
                  onClick={() => dispatch(removeBulkPatent(idx))}
                />
              </span>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-center w-full relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (mode === "bulk" && inputValue.trim()
                ? (dispatch(addBulkPatent(inputValue.trim())),
                  setInputValue(""))
                : handleExecute())
            }
            placeholder={
              mode === "bulk"
                ? "Enter Patent Number (E.G., US1234567B2) and press Enter..."
                : "Enter Patent Number (E.G., US1234567B2)"
            }
            className="w-full px-6 py-5 text-lg outline-none bg-transparent placeholder:text-gray-300 font-medium text-gray-700"
          />
          <button
            onClick={handleExecute}
            disabled={isStarting}
            className="absolute right-4 bg-[#ff6b00] hover:bg-[#e66000] text-white p-4 rounded-full shadow-lg transition-all active:scale-90"
          >
            <Send size={22} fill="white" />
          </button>
        </div>
      </div>

      {/* 🟢 BULK MODE BOTTOM SECTION (Matches Screenshot) */}
      {mode === "bulk" && (
        <div className="w-full mt-12 flex flex-col items-center animate-fade-in">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-10 opacity-70">
            Add Multiple Patents — Each Analyzed In Parallel
          </p>

          {/* "or" Divider Logic */}
          <div className="w-full flex items-center justify-center gap-6 text-gray-200 mb-10 px-20">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-gray-400 font-black text-xs uppercase tracking-widest">
              or
            </span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileUpload}
            accept=".csv, .xlsx"
          />

          {/* Dashed Upload Box */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-full max-w-3xl border-2 border-gray-200 border-dashed rounded-[35px] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#ff6b00] hover:bg-orange-50/30 group transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Upload size={32} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-600 text-2xl tracking-tight">
              Upload Excel/CSV
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

export default SearchArea;
