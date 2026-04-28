// import React from "react";
// import { X, Crown, Zap, AlertCircle } from "lucide-react";

// const InsufficientCreditsModal = ({ isOpen, onClose, required, current }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/80 backdrop-blur-md"
//         onClick={onClose}
//       />

//       {/* Modal Content */}
//       <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-scale-up">
//         {/* Top Decorative Header */}
//         <div className="h-32 bg-gradient-to-br from-[#ff6b00]/20 to-transparent flex items-center justify-center">
//           <div className="w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
//             <Crown size={32} className="text-white" />
//           </div>
//         </div>

//         <button
//           onClick={onClose}
//           className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
//         >
//           <X size={24} />
//         </button>

//         <div className="p-8 pt-0 text-center">
//           <h2 className="text-2xl font-black text-white mb-2">
//             Insufficient Credits
//           </h2>
//           <p className="text-gray-400 font-medium mb-6 leading-relaxed">
//             This analysis requires{" "}
//             <span className="text-white font-bold">{required} credits</span>.
//             You currently have{" "}
//             <span className="text-[#ff6b00] font-bold">
//               {current} remaining
//             </span>
//             .
//           </p>

//           <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-8 flex items-center gap-4 border border-white/5">
//             <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
//               <Zap size={18} className="text-[#ff6b00]" />
//             </div>
//             <p className="text-left text-sm text-gray-300 font-medium">
//               Upgrade to Pro for unlimited analyses and priority AI processing.
//             </p>
//           </div>

//           <div className="flex flex-col gap-3">
//             <button className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95">
//               Upgrade Now
//             </button>
//             <button
//               onClick={onClose}
//               className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-bold transition-all"
//             >
//               Maybe Later
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InsufficientCreditsModal;

import React from "react";
import { X, Crown, Zap } from "lucide-react";

const InsufficientCreditsModal = () => {
  // Static Values for UI Testing
  const required = 50;
  const current = 12;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Static Blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-scale-up">
        {/* Top Decorative Header */}
        <div className="h-32 bg-gradient-to-br from-[#ff6b00]/20 to-transparent flex items-center justify-center">
          <div className="w-16 h-16 bg-[#ff6b00] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
            <Crown size={32} className="text-white" />
          </div>
        </div>

        {/* Close Button */}
        <button className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-8 pt-0 text-center">
          <h2 className="text-2xl font-black text-white mb-2 font-sans tracking-tight">
            Insufficient Credits
          </h2>
          <p className="text-gray-400 font-medium mb-6 leading-relaxed">
            This analysis requires{" "}
            <span className="text-white font-bold">{required} credits</span>.
            You currently have{" "}
            <span className="text-[#ff6b00] font-bold">
              {current} remaining
            </span>
            .
          </p>

          {/* Upgrade Banner */}
          <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-8 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <Zap size={18} className="text-[#ff6b00]" />
            </div>
            <p className="text-left text-sm text-gray-300 font-medium">
              Upgrade to Pro for unlimited analyses and priority AI processing.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#ff6b00] hover:bg-[#e66000] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all active:scale-95">
              Upgrade Now
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-bold transition-all">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
