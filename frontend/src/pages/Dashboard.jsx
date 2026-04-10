// // import React, { memo, useCallback } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { Outlet } from "react-router-dom";
// // import { Menu } from "lucide-react";
// // import Sidebar from "../components/Sidebar";
// // import { toggleSidebar } from "../features/slice/analysisSlice";
// // import logo from "../assets/whiteLogo.png";

// // const Dashboard = memo(() => {
// //   const dispatch = useDispatch();
// //   const isSidebarOpen = useSelector((state) => state.analysis.isSidebarOpen);

// //   const handleToggle = useCallback(() => {
// //     dispatch(toggleSidebar());
// //   }, [dispatch]);

// //   return (
// //     <div className="flex h-screen w-full bg-[#faf9f6] overflow-hidden font-sans">
// //       {/* 1. SIDEBAR COMPONENT */}
// //       <Sidebar />

// //       {/* 2. MAIN CONTENT AREA */}
// //       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
// //         {/* MOBILE HEADER (Matches Patsero Screenshot) */}
// //         <div className="md:hidden flex items-center h-[64px] px-6 bg-[#000000] border-b border-white/10 shrink-0 z-30">
// //           <button
// //             onClick={handleToggle}
// //             className="text-white p-1 -ml-1 hover:bg-white/10 rounded-lg transition-colors"
// //           >
// //             <Menu size={24} />
// //           </button>

// //           <div className=" w-[100px] ml-5">
// //             <img src={logo} alt="Logo" />
// //           </div>
// //         </div>

// //         {/* PAGE CONTENT */}
// //         <div className="flex-1 overflow-y-auto custom-scrollbar">
// //           <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
// //             <Outlet />
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // });

// // export default Dashboard;

// import React, { memo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Outlet } from "react-router-dom";
// import { Menu } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import { toggleSidebar } from "../features/slice/analysisSlice";
// import logo from "../assets/whiteLogo.png";

// const Dashboard = memo(() => {
//   const dispatch = useDispatch();
//   const isSidebarOpen = useSelector((state) => state.analysis.isSidebarOpen);

//   const handleToggle = useCallback(() => {
//     dispatch(toggleSidebar());
//   }, [dispatch]);

//   return (
//     <div className="flex h-screen w-full bg-[#faf9f6] font-sans">
//       {/* 1. SIDEBAR: Constant on the left */}
//       <Sidebar />

//       {/* 2. MAIN WORKSPACE: Everything happens here on the right */}
//       <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
//         {/* MOBILE HEADER (Only visible on small screens) */}
//         <div className="md:hidden flex items-center h-[64px] px-6 bg-[#000000] border-b border-white/10 shrink-0 z-30">
//           <button
//             onClick={handleToggle}
//             className="text-white p-1 -ml-1 hover:bg-white/10 rounded-lg transition-colors"
//           >
//             <Menu size={24} />
//           </button>
//           <div className="w-[100px] ml-5">
//             <img src={logo} alt="Logo" />
//           </div>
//         </div>

//         {/* 🚀 RIGHT SIDE CONTENT AREA: Swaps between Search and Wizard */}
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           <div className="p-4 md:p-8 lg:p-12 w-full max-w-[1600px] mx-auto">
//             <Outlet />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// });

// export default Dashboard;

import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = memo(() => {
  return (
    <div className="flex h-screen w-full bg-[#faf9f6] overflow-hidden font-sans">
      {/* 1. SIDEBAR: Your existing Sidebar.jsx stays here */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE: This area scrolls. Content will NOT cut at the top here. */}
      <main className="flex-1 h-full overflow-y-auto relative custom-scrollbar bg-[#faf9f6]">
        {/* We use padding here to protect your UI from touching the edges */}
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-[1600px] mx-auto min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
});

export default Dashboard;
