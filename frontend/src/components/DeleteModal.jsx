import React, { memo, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

const DeleteModal = memo(
  ({ isOpen, onCancel, onConfirm, isDeleting, projectName }) => {
    // Close on Escape key
    useEffect(() => {
      const handleEsc = (e) => {
        e.key === "Escape" && onCancel();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [onCancel]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 animate-scale-up">
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Delete Analysis?
            </h3>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-800">{projectName}</span>?
              This action cannot be undone.
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default DeleteModal;
