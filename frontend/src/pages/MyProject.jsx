// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Search, Eye, Download, Trash2, CheckSquare, XSquare, SquareDashed, ChevronLeft, ChevronRight } from 'lucide-react';

// const StatCard = ({ title, count }) => (
//   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-32 flex-1 min-w-[200px]">
//     <span className="text-gray-500 text-sm font-medium">{title}</span>
//     <span className="text-4xl font-semibold text-gray-900">{count}</span>
//   </div>
// );

// const StatusIndicator = ({ status }) => {
//   const config = {
//     Processing: { icon: SquareDashed, color: 'text-orange-500' },
//     Complete: { icon: CheckSquare, color: 'text-green-500' },
//     Rejected: { icon: XSquare, color: 'text-red-500' }
//   };
//   const StatusIcon = config[status]?.icon;

//   return (
//     <div className="flex items-center gap-2">
//       {StatusIcon && <StatusIcon size={16} className={config[status].color} />}
//       <span className="text-gray-600 text-sm">{status}</span>
//     </div>
//   );
// };

// const MyProject = () => {
//   const { projects } = useSelector((state) => state.analysis);

//   return (
//     <div className="w-full max-w-6xl mx-auto flex flex-col relative pb-20 animate-fade-in">
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-4xl font-bold text-gray-900 mb-2">My Project</h2>
//         <p className="text-gray-500">View And Manage Your Patent Infringement Analyses</p>
//       </div>

//       {/* Stats & Search Row */}
//       <div className="flex flex-col xl:flex-row gap-6 mb-8">
//         {/* Stats Cards */}
//         <div className="flex gap-4 flex-1">
//           <StatCard title="Total Projects" count="10" />
//           <StatCard title="Completed" count="08" />
//           <StatCard title="Processing" count="07" />
//         </div>

//         {/* Filter / Search Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col justify-center gap-4">
//           <span className="text-gray-500 text-sm font-medium">Search By Patent Number...</span>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-orange-500 transition-colors"
//               />
//             </div>
//             <button className="bg-[#ff6b00] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
//               All Status
//             </button>
//             <button className="bg-[#ff6b00] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
//               All Mode
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto relative">
//         <table className="w-full text-left min-w-[800px]">
//           <thead className="bg-[#ff6b00] text-white">
//             <tr>
//               <th className="py-4 px-6 font-medium text-sm rounded-tl-xl">Patent ID</th>
//               <th className="py-4 px-6 font-medium text-sm">Status</th>
//               <th className="py-4 px-6 font-medium text-sm">Mode</th>
//               <th className="py-4 px-6 font-medium text-sm">Created</th>
//               <th className="py-4 px-6 font-medium text-sm rounded-tr-xl">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((item, index) => (
//               <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                 <td className="py-4 px-6 text-sm text-gray-600">{item.id}</td>
//                 <td className="py-4 px-6"><StatusIndicator status={item.status} /></td>
//                 <td className="py-4 px-6 text-sm text-gray-600">{item.mode}</td>
//                 <td className="py-4 px-6 text-sm text-gray-600">{item.created}</td>
//                 <td className="py-4 px-6">
//                   <div className="flex items-center gap-4">
//                     <button className="text-green-500 hover:text-green-600 transition-colors"><Eye size={18} /></button>
//                     <button className="text-blue-500 hover:text-blue-600 transition-colors"><Download size={18} /></button>
//                     <button className="text-red-500 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {/* Pagination Pill */}
//         <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 bg-[#222] text-white rounded-full flex items-center shadow-lg border border-gray-700 z-10">
//           <button className="p-3 hover:bg-[#333] rounded-l-full transition-colors border-r border-gray-700">
//             <ChevronLeft size={16} />
//           </button>
//           <button className="p-3 hover:bg-[#333] rounded-r-full transition-colors">
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProject;

















import React from 'react';
import { useSelector } from 'react-redux';
import { Search, Eye, Download, Trash2, CheckSquare, XSquare, SquareDashed } from 'lucide-react';

// Reusable Stats Card Component
const StatCard = ({ title, count }) => (
  <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full">
    <span className="text-gray-500 text-[15px]">{title}</span>
    <span className="text-[34px] font-bold text-gray-900 leading-none">{count}</span>
  </div>
);

// Custom Status Component matching exact colors and icons
const StatusIndicator = ({ status }) => {
  const config = {
    Processing: { icon: SquareDashed, color: 'text-[#ff6b00]' },
    Complete: { icon: CheckSquare, color: 'text-green-500' },
    Rejected: { icon: XSquare, color: 'text-red-500' }
  };
  const StatusIcon = config[status]?.icon;

  return (
    <div className="flex items-center gap-2">
      {StatusIcon && <StatusIcon size={16} strokeWidth={2.5} className={config[status].color} />}
      <span className="text-gray-500">{status}</span>
    </div>
  );
};

const MyProject = () => {
  // Pulling projects from Redux. (Ensure your mock data has the 6 rows shown in the image)
  const { projects } = useSelector((state) => state.analysis);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col animate-fade-in pb-12">

         <div className="mb-8">
         <h2 className="text-4xl font-bold text-gray-900 mb-2">My Project</h2>
        <p className="text-gray-500">View And Manage Your Patent Infringement Analyses</p>
       </div>
      
      {/* Top Layout: Stats + Search Filter */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8 w-full items-stretch">
        
        {/* Left Side: Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full xl:w-[55%]">
          <StatCard title="Total Projects" count="10" />
          <StatCard title="Completed" count="03" />
          <StatCard title="Processing" count="07" />
        </div>

        {/* Right Side: Search / Filter Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full xl:w-[45%]">
          <span className="text-gray-500 text-[15px]">Search By Patent Number...</span>
          <div className="flex flex-col sm:flex-row gap-3 h-[42px]">
            {/* Input Wrapper */}
            <div className="relative flex-1 h-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                className="w-full h-full pl-9 pr-4 bg-[#fafafa] border border-gray-200 rounded-lg outline-none text-sm focus:border-[#ff6b00] transition-colors"
              />
            </div>
            {/* Action Buttons */}
            <button className="h-full px-6 bg-[#ff6b00] hover:bg-[#e66000] text-white rounded-lg text-[14px] font-medium transition-colors">
              All Status
            </button>
            <button className="h-full px-6 bg-[#ff6b00] hover:bg-[#e66000] text-white rounded-lg text-[14px] font-medium transition-colors">
              All Mode
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {/* Wrapping in overflow-hidden allows the table header background to clip perfectly to the rounded corners */}
      <div className="bg-white rounded-[14px] shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                <th className="py-4 px-8 font-medium text-[15px] whitespace-nowrap">Patent ID</th>
                <th className="py-4 px-8 font-medium text-[15px] whitespace-nowrap">Status</th>
                <th className="py-4 px-8 font-medium text-[15px] whitespace-nowrap">Mode</th>
                <th className="py-4 px-8 font-medium text-[15px] whitespace-nowrap">Created</th>
                <th className="py-4 px-8 font-medium text-[15px] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            
            <tbody className="text-[15px]">
              {projects.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 last:border-0 hover:bg-[#fafafa] transition-colors"
                >
                  <td className="py-4 px-8 text-gray-500">{item.id}</td>
                  <td className="py-4 px-8"><StatusIndicator status={item.status} /></td>
                  <td className="py-4 px-8 text-gray-500">{item.mode}</td>
                  <td className="py-4 px-8 text-gray-500">{item.created}</td>
                  <td className="py-4 px-8">
                    <div className="flex items-center gap-5">
                      <button className="text-green-500 hover:text-green-600 transition-colors">
                        <Eye size={18} strokeWidth={2} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Download size={18} strokeWidth={2} />
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors">
                        <Trash2 size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default MyProject;