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
  ChevronDown,
  Filter,
  Loader2,
  AlertTriangle, // 🟢 Added icon
} from "lucide-react";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useLazyGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { toast } from "react-toastify";
import DeleteModal from "../components/DeleteModal";
import { generateDocx } from "../services/exportService";

// --- 🟢 NEW Sub-Component: Failure Modal (Strictly matches your design system) ---
const FailureModal = memo(({ isOpen, onClose, projectName, reason }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 flex flex-col items-center text-center animate-scale-up border border-red-50">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="text-red-500" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Analysis Failed
        </h3>
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold">
          {projectName}
        </p>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 w-full text-left">
          <p className="text-red-700 text-[13px] font-medium leading-relaxed italic">
            "{reason || "Unexpected error occurred during processing."}"
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest"
        >
          Close & Return
        </button>
      </div>
    </div>
  );
});

// --- Existing Sub-Components ---
const StatCard = memo(({ title, count, color = "text-gray-900" }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 flex flex-col justify-between h-[130px] w-full">
    <span className="text-gray-400 text-[14px] font-semibold uppercase tracking-wider">
      {title}
    </span>
    <span className={`text-[38px] font-bold leading-none ${color}`}>
      {count}
    </span>
  </div>
));

const StatusIndicator = memo(({ status }) => {
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
  };
  const normalizedStatus = status?.toLowerCase() || "processing";
  const current = config[normalizedStatus] || config.processing;
  const StatusIcon = current.icon;
  return (
    <div className="flex items-center gap-2">
      <StatusIcon size={18} strokeWidth={2.5} className={current.color} />
      <span className="text-gray-600 font-bold text-[14px]">
        {current.label}
      </span>
    </div>
  );
});

const ProjectRow = memo(
  ({ item, onDelete, downloadingId, handleDownload, handleViewProject }) => {
    const formatted = useMemo(
      () => ({
        cleanId: item.patentId?.replace(/^patent\/|\/en$/gi, "") || "N/A",
        cleanDate: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }),
      [item.patentId, item.createdAt],
    );

    return (
      <tr className="border-b border-gray-50 last:border-0 hover:bg-[#fafafa] transition-colors group">
        <td className="py-5 px-8 font-bold text-gray-700 uppercase tracking-tight">
          {formatted.cleanId}
        </td>
        <td className="py-5 px-8">
          <StatusIndicator status={item.status} />
        </td>
        <td className="py-5 px-8 text-gray-500 font-bold capitalize">
          {item.mode || "Quick"}
        </td>
        <td className="py-5 px-8 text-gray-400 font-medium text-center text-sm">
          {formatted.cleanDate}
        </td>
        <td className="py-5 px-8">
          <div className="flex items-center justify-end gap-5">
            <button
              onClick={() => handleViewProject(item)}
              className={`p-1 transition-colors ${item.status === "processing" ? "text-orange-500 animate-pulse" : item.status === "failed" ? "text-red-400" : "text-gray-400 text-green-500"}`}
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() => handleDownload(item._id)}
              disabled={
                downloadingId === item._id || item.status !== "completed"
              }
              className={`transition-transform hover:scale-110 ${item.status === "completed" ? "text-blue-500 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}
            >
              {downloadingId === item._id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
            </button>
            <button
              onClick={() => onDelete(item._id, formatted.cleanId)}
              className="text-gray-300 text-red-500 hover:scale-110 transition-transform"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </td>
      </tr>
    );
  },
);

const MyProject = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modeFilter, setModeFilter] = useState("All Mode");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;

  // const { data: projectsData, isLoading } = useGetProjectsQuery();

  const { data: projectsData, isLoading } = useGetProjectsQuery(undefined, {
    // 🚀 This is the magic: Ask the server for the latest status every 5 seconds.
    // It will automatically update the "Processing" pills to "Complete".
    pollingInterval: 5000,

    // Also refetch data if the user switches back to this tab from another window
    refetchOnFocus: true,
  });

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [triggerFetchDetails] = useLazyGetProjectDetailsQuery();
  const [downloadingId, setDownloadingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 🟢 NEW STATE: Track failed project to show modal
  const [failureTarget, setFailureTarget] = useState(null);

  const filteredProjects = useMemo(() => {
    const list = projectsData?.projects || [];
    return list.filter((p) => {
      const matchesSearch = p.patentId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" ||
        p.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesMode =
        modeFilter === "All Mode" ||
        (p.mode || "quick").toLowerCase() === modeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [projectsData, searchTerm, statusFilter, modeFilter]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * projectsPerPage;
    return filteredProjects.slice(start, start + projectsPerPage);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, modeFilter]);

  const stats = useMemo(() => {
    const list = projectsData?.projects || [];
    return {
      total: list.length.toString().padStart(2, "0"),
      completed: list
        .filter((p) => p.status === "completed")
        .length.toString()
        .padStart(2, "0"),
      processing: list
        .filter((p) => p.status === "processing")
        .length.toString()
        .padStart(2, "0"),
    };
  }, [projectsData]);

  const openDeleteModal = useCallback((id, cleanId) => {
    setDeleteTarget({ id, name: cleanId });
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id).unwrap();
      toast.success("Project deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleDownload = async (id) => {
    setDownloadingId(id);
    try {
      const response = await triggerFetchDetails(id).unwrap();
      const project = response.project;
      if (!project?.results?.finalClaimChart?.length)
        return toast.warning("No charts found.");
      toast.info("Generating Word document...");
      await generateDocx(project);
      toast.success("Download successful!");
    } catch (err) {
      toast.error("Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  // 🟢 LOGIC: Update handleViewProject to trigger modal on failed status
  const handleViewProject = useCallback(
    (item) => {
      if (!item || !item._id) return;
      const { _id, status } = item;

      if (status === "completed") {
        navigate(`/dashboard/report-view/${_id}`);
      } else if (status === "processing" || status === "created") {
        navigate(`/dashboard/processing/${_id}`);
      } else if (status === "failed") {
        // 🚀 Trigger Failure Modal
        setFailureTarget({
          name: item.patentId?.replace(/^patent\/|\/en$/gi, ""),
          reason: item.failureReason || "System error during AI analysis.",
        });
      }
    },
    [navigate],
  );

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">
        Synchronizing Vault...
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col animate-fade-in pb-12 px-6 lg:px-10 font-sans">
      <DeleteModal
        isOpen={!!deleteTarget}
        projectName={deleteTarget?.name}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* 🔴 RENDER FAILURE MODAL */}
      <FailureModal
        isOpen={!!failureTarget}
        onClose={() => setFailureTarget(null)}
        projectName={failureTarget?.name}
        reason={failureTarget?.reason}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-[48px] font-bold text-gray-900 leading-tight tracking-tight">
            My <span className="text-[#ff6b00]">Project</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium">
            View And Manage Your Patent Infringement Analyses
          </p>
        </div>
      </div>

      {/* Stats and Search Filter UI remains untouched */}
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 w-full xl:w-[48%] flex flex-col gap-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-gray-400 text-[11px] font-black uppercase tracking-[1.5px]">
              Search & Filters
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b00]"
                size={18}
              />
              <input
                type="text"
                placeholder="Ex: US2015017..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[48px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ff6b00] text-sm font-bold text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-[130px] h-[48px] appearance-none bg-[#ff6b00] text-white text-[13px] font-bold pl-4 pr-10 rounded-xl outline-none cursor-pointer"
                >
                  {["All Status", "Completed", "Processing", "Failed"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ),
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                />
              </div>
              <div className="relative">
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-[110px] h-[48px] appearance-none bg-gray-900 text-white text-[11px] font-bold pl-4 pr-10 rounded-xl outline-none cursor-pointer"
                >
                  {["All Mode", "Quick", "Bulk", "Interactive"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#ff6b00] text-white">
              <tr>
                {["Patent ID", "Status", "Mode", "Created", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`py-5 px-8 font-bold text-[14px] uppercase tracking-widest ${h === "Actions" ? "text-right" : h === "Created" ? "text-center" : ""}`}
                    >
                      {h}
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
                    onDelete={openDeleteModal}
                    downloadingId={downloadingId}
                    handleDownload={handleDownload}
                    handleViewProject={handleViewProject}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-24 text-center text-gray-400 font-medium italic"
                  >
                    No reports found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination logic remains identical to your code */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-white">
            <p className="text-sm text-gray-400 font-bold">
              Page <span className="text-gray-900">{currentPage}</span> of{" "}
              {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-black ${currentPage === i + 1 ? "bg-[#ff6b00] text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
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
