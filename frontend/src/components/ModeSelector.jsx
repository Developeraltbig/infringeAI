// import React, { memo, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setMode } from "../features/slice/analysisSlice";

// const ModeSelector = memo(() => {
//   const dispatch = useDispatch();
//   const mode = useSelector((state) => state.analysis.mode);

//   console.log(mode);

//   const handleModeChange = useCallback(
//     (id) => {
//       dispatch(setMode(id));
//     },
//     [dispatch],
//   );

//   const modes = [
//     { id: "quick", label: "Quick" },
//     { id: "interactive", label: "Interactive" },
//     { id: "bulk", label: "Bulk (Multi-Patent)" },
//   ];

//   return (
//     <div className="flex justify-center mb-10">
//       <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-300 flex space-x-1">
//         {modes.map((m) => (
//           <button
//             key={m.id}
//             onClick={() => handleModeChange(m.id)}
//             className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//               mode === m.id
//                 ? "bg-[#ff6b00] text-white shadow-md"
//                 : "text-gray-500 hover:bg-gray-50"
//             }`}
//           >
//             {m.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// });

// export default ModeSelector;

import React, { memo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMode } from "../features/slice/analysisSlice";

const ModeSelector = memo(() => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.analysis.mode);

  const handleModeChange = useCallback(
    (id) => dispatch(setMode(id)),
    [dispatch],
  );

  const modes = [
    { id: "quick", label: "Quick" },
    { id: "interactive", label: "Interactive" },
    { id: "bulk", label: "Bulk" },
  ];

  return (
    <div className="w-full flex justify-center mb-10 md:mb-14">
      <div className="bg-white p-2 rounded-[10px] md:rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-200 flex items-center w-full max-w-[320px] md:min-w-[420px]">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`flex-1 py-3 md:py-4 rounded-[15px] md:rounded-[18px] text-xs md:text-[15px] font-semibold transition-all duration-300 ${
              mode === m.id
                ? "bg-[#ff6b00] text-white shadow-[0_8px_20px_rgba(255,107,0,0.25)]"
                : "text-gray-600 hover:text-gray-600"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
});

export default ModeSelector;
