// import React, { useMemo, useState, useCallback, memo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Eye,
//   Download,
//   Trash2,
//   CheckSquare,
//   XSquare,
//   SquareDashed,
// } from "lucide-react";
// import {
//   useGetProjectsQuery,
//   useDeleteProjectMutation,
// } from "../features/api/projectApiSlice";
// import { toast } from "react-toastify";
// import DeleteModal from "../components/DeleteModal";

// // 🟢 Sub-Component: Memoized Stat Card
// const StatCard = memo(({ title, count, color = "text-gray-900" }) => (
//   <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full">
//     <span className="text-gray-500 text-[15px] font-medium">{title}</span>
//     <span className={`text-[34px] font-bold leading-none ${color}`}>
//       {count}
//     </span>
//   </div>
// ));

// // 🟢 Sub-Component: Memoized Status Indicator
// const StatusIndicator = memo(({ status }) => {
//   const config = {
//     completed: {
//       icon: CheckSquare,
//       color: "text-green-500",
//       label: "Complete",
//     },
//     processing: {
//       icon: SquareDashed,
//       color: "text-[#ff6b00]",
//       label: "Processing",
//     },
//     failed: { icon: XSquare, color: "text-red-500", label: "Failed" },
//   };

//   const current = config[status?.toLowerCase()] || config.processing;
//   const StatusIcon = current.icon;

//   return (
//     <div className="flex items-center gap-2">
//       <StatusIcon size={16} strokeWidth={2.5} className={current.color} />
//       <span className="text-gray-500 font-medium capitalize">
//         {current.label}
//       </span>
//     </div>
//   );
// });

// // 🟢 Sub-Component: Memoized Table Row with Regex
// const ProjectRow = memo(({ item, onNavigate, onDelete }) => {
//   const formatted = useMemo(
//     () => ({
//       // 💡 Regex: Removes 'patent/' prefix and '/en' suffix
//       cleanId: item.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A",
//       // 💡 Regex: Removes time portion from ISO string (2026-04-07T...)
//       cleanDate: item.createdAt?.replace(/T.*/, "") || "N/A",
//     }),
//     [item.patentId, item.createdAt],
//   );

//   return (
//     <tr className="border-b border-gray-100 last:border-0 hover:bg-[#fafafa] transition-colors group">
//       <td className="py-4 px-8 font-bold text-gray-700 uppercase tracking-tight">
//         {formatted.cleanId}
//       </td>
//       <td className="py-4 px-8">
//         <StatusIndicator status={item.status} />
//       </td>
//       <td className="py-4 px-8 text-gray-500 font-medium capitalize">
//         {item.mode}
//       </td>
//       <td className="py-4 px-8 text-gray-500">{formatted.cleanDate}</td>
//       <td className="py-4 px-8">
//         <div className="flex items-center gap-5">
//           <button
//             onClick={() => onNavigate(item._id)}
//             className="text-gray-400 hover:text-[#ff6b00] transition-colors"
//           >
//             <Eye size={18} strokeWidth={2} />
//           </button>
//           <button className="text-gray-400 hover:text-blue-600 transition-colors">
//             <Download size={18} strokeWidth={2} />
//           </button>
//           <button
//             onClick={() => onDelete(item._id)}
//             className="text-gray-400 hover:text-red-500 transition-colors"
//           >
//             <Trash2 size={18} strokeWidth={2} />
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// });

// const MyProject = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔌 API Hooks
//   const { data: projectsData, isLoading } = useGetProjectsQuery();
//   const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

//   const [deleteTarget, setDeleteTarget] = useState(null); // Stores { id, patentId }

//   // 💡 Optimization: Filter projects based on search input
//   const filteredProjects = useMemo(() => {
//     const list = projectsData?.projects || [];
//     if (!searchTerm) return list;
//     return list.filter((p) =>
//       p.patentId.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [projectsData, searchTerm]);

//   // 💡 Optimization: Calculate real-time stats from the array
//   const stats = useMemo(() => {
//     const list = projectsData?.projects || [];
//     return {
//       total: list.length,
//       completed: list.filter((p) => p.status === "completed").length,
//       processing: list.filter((p) => p.status === "processing").length,
//     };
//   }, [projectsData]);

//   // 🔌 Logic: Trigger Modal
//   const openDeleteModal = useCallback((id, patentId) => {
//     // Regex clean the ID for the modal display
//     const cleanId = patentId.replace(/^patent\/|\/en$/gi, "");
//     setDeleteTarget({ id, cleanId });
//   }, []);

//   // 🔌 Logic: Final Execution from Modal
//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     try {
//       await deleteProject(deleteTarget.id).unwrap();
//       toast.success("Analysis deleted");
//       setDeleteTarget(null); // Close modal
//     } catch (err) {
//       toast.error("Deletion failed");
//     }
//   };

//   const handleView = useCallback(
//     (id) => {
//       navigate(`/dashboard/report-view/${id}`);
//     },
//     [navigate],
//   );

//   if (isLoading)
//     return (
//       <div className="p-20 text-center animate-pulse text-gray-400">
//         Loading Vault...
//       </div>
//     );

//   return (
//     <div className="w-full max-w-7xl mx-auto flex flex-col animate-fade-in pb-12">
//       <DeleteModal
//         isOpen={!!deleteTarget}
//         projectName={deleteTarget?.cleanId}
//         isDeleting={isDeleting}
//         onCancel={() => setDeleteTarget(null)}
//         onConfirm={confirmDelete}
//       />

//       <div className="mb-8">
//         <h2 className="text-4xl font-bold text-gray-900 mb-2">
//           Project <span className="text-[#ff6b00]">History</span>
//         </h2>
//         <p className="text-gray-500 font-medium">
//           Manage and monitor your patent infringement reports
//         </p>
//       </div>

//       {/* Stats & Search Layout */}
//       <div className="flex flex-col xl:flex-row gap-6 mb-8 w-full items-stretch">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full xl:w-[55%]">
//           <StatCard title="Total Projects" count={stats.total} />
//           <StatCard
//             title="Completed"
//             count={stats.completed}
//             color="text-green-500"
//           />
//           <StatCard
//             title="Processing"
//             count={stats.processing}
//             color="text-[#ff6b00]"
//           />
//         </div>

//         <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full xl:w-[45%]">
//           <span className="text-gray-500 text-[15px] font-medium uppercase tracking-wider">
//             Quick Filter
//           </span>
//           <div className="relative h-[48px]">
//             <Search
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Search by Patent Number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full h-full pl-12 pr-4 bg-[#fafafa] border border-gray-100 rounded-xl outline-none focus:border-[#ff6b00] transition-all font-medium"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-[#ff6b00] text-white">
//               <tr>
//                 {["Patent ID", "Status", "Mode", "Created", "Actions"].map(
//                   (head) => (
//                     <th
//                       key={head}
//                       className="py-5 px-8 font-bold text-[13px] uppercase tracking-[2px]"
//                     >
//                       {head}
//                     </th>
//                   ),
//                 )}
//               </tr>
//             </thead>
//             <tbody className="text-[15px]">
//               {filteredProjects.length > 0 ? (
//                 filteredProjects.map((item) => (
//                   <ProjectRow
//                     key={item._id}
//                     item={item}
//                     onNavigate={handleView}
//                     onDelete={(id) => openDeleteModal(id, item.patentId)}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="py-20 text-center text-gray-400 font-medium italic"
//                   >
//                     No projects found matching your search.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProject;

import React, { useMemo, useState, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Download,
  Trash2,
  CheckSquare,
  XSquare,
  SquareDashed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "../features/api/projectApiSlice";
import { toast } from "react-toastify";
import DeleteModal from "../components/DeleteModal";

// --- Sub-Components (Unchanged) ---
const StatCard = memo(({ title, count, color = "text-gray-900" }) => (
  <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full">
    <span className="text-gray-500 text-[15px] font-medium">{title}</span>
    <span className={`text-[34px] font-bold leading-none ${color}`}>
      {count}
    </span>
  </div>
));

const StatusIndicator = memo(({ status }) => {
  // 💡 We use lowercase keys to match the database exactly
  const config = {
    completed: {
      icon: CheckSquare,
      color: "text-green-500",
      label: "Complete",
    },
    processing: {
      icon: SquareDashed,
      color: "text-[#ff6b00]",
      label: "Processing",
    },
    failed: { icon: XSquare, color: "text-red-500", label: "Failed" },
    created: { icon: SquareDashed, color: "text-gray-400", label: "Queued" },
  };

  // Convert incoming status to lowercase for comparison
  const normalizedStatus = status?.toLowerCase() || "processing";
  const current = config[normalizedStatus] || config.processing;
  const StatusIcon = current.icon;

  return (
    <div className="flex items-center gap-2">
      <StatusIcon size={16} strokeWidth={2.5} className={current.color} />
      <span className="text-gray-500 font-medium">{current.label}</span>
    </div>
  );
});

const ProjectRow = memo(({ item, onNavigate, onDelete }) => {
  const formatted = useMemo(
    () => ({
      cleanId: item.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A",
      cleanDate: item.createdAt?.replace(/T.*/, "") || "N/A",
    }),
    [item.patentId, item.createdAt],
  );

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#fafafa] transition-colors group">
      <td className="py-4 px-8 font-bold text-gray-700 uppercase tracking-tight">
        {formatted.cleanId}
      </td>
      <td className="py-4 px-8">
        <StatusIndicator status={item.status} />
      </td>
      <td className="py-4 px-8 text-gray-500 font-medium capitalize">
        {item.mode}
      </td>
      <td className="py-4 px-8 text-gray-500">{formatted.cleanDate}</td>
      <td className="py-4 px-8">
        <div className="flex items-center gap-5">
          <button
            onClick={() => onNavigate(item._id)}
            className="text-gray-400 hover:text-[#ff6b00] transition-colors"
          >
            <Eye size={18} />
          </button>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <Download size={18} />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
});

const MyProject = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // 🟢 1. PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10; // Change this number to show more/less rows

  const { data: projectsData, isLoading } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 💡 Filter projects based on search
  const filteredProjects = useMemo(() => {
    const list = projectsData?.projects || [];
    if (!searchTerm) return list;
    return list.filter((p) =>
      p.patentId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [projectsData, searchTerm]);

  // 🟢 2. PAGINATION LOGIC: Slice the data for the current page
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * projectsPerPage;
    return filteredProjects.slice(start, start + projectsPerPage);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Reset to page 1 when user types in search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = useMemo(() => {
    const list = projectsData?.projects || [];
    return {
      total: list.length,
      completed: list.filter((p) => p.status === "completed").length,
      processing: list.filter((p) => p.status === "processing").length,
    };
  }, [projectsData]);

  const openDeleteModal = useCallback((id, patentId) => {
    const cleanId = patentId.replace(/^patent\/|\/en$/gi, "");
    setDeleteTarget({ id, cleanId });
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id).unwrap();
      toast.success("Analysis deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse text-gray-400 uppercase font-bold tracking-widest">
        Loading Vault...
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col animate-fade-in pb-12">
      <DeleteModal
        isOpen={!!deleteTarget}
        projectName={deleteTarget?.cleanId}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          Project <span className="text-[#ff6b00]">History</span>
        </h2>
        <p className="text-gray-500 font-medium">
          Manage and monitor your patent infringement reports
        </p>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8 w-full items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full xl:w-[55%]">
          <StatCard title="Total Projects" count={stats.total} />
          <StatCard
            title="Completed"
            count={stats.completed}
            color="text-green-500"
          />
          <StatCard
            title="Processing"
            count={stats.processing}
            color="text-[#ff6b00]"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-[130px] w-full xl:w-[45%]">
          <span className="text-gray-500 text-[15px] font-medium uppercase tracking-wider">
            Quick Filter
          </span>
          <div className="relative h-[48px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Patent Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-12 pr-4 bg-[#fafafa] border border-gray-100 rounded-xl outline-none focus:border-[#ff6b00] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                {["Patent ID", "Status", "Mode", "Created", "Actions"].map(
                  (head) => (
                    <th
                      key={head}
                      className="py-5 px-8 font-bold text-[13px] uppercase tracking-[2px]"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="text-[15px]">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((item) => (
                  <ProjectRow
                    key={item._id}
                    item={item}
                    onNavigate={(id) =>
                      navigate(`/dashboard/report-view/${id}`)
                    }
                    onDelete={(id) => openDeleteModal(id, item.patentId)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center text-gray-400 font-medium italic"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🟢 3. PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-500 font-medium">
              Showing page{" "}
              <span className="text-gray-900 font-bold">{currentPage}</span> of{" "}
              {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-[#ff6b00] text-white" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProject;
