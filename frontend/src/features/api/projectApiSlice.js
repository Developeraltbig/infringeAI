import { apiSlice } from "./apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Sidebar / Dashboard List
    getProjects: builder.query({
      query: () => "/projects/all",
      providesTags: ["Projects"],
    }),

    // Real-time Polling for the Modal/Progress bar
    getProjectStatus: builder.query({
      query: (id) => `/projects/status/${id}`,
      providesTags: (result, error, id) => [{ type: "ProjectStatus", id }],
      // 🚀 Stop polling once completed or failed
      pollingInterval: (res) =>
        res?.status === "completed" || res?.status === "failed" ? 0 : 3000,
    }),

    // Full AI Results for ReportView
    getProjectDetails: builder.query({
      query: (id) => `/projects/details/${id}`,
      providesTags: (res, err, id) => [{ type: "ProjectDetails", id }],
    }),

    // Delete project
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
  useDeleteProjectMutation,
} = projectApiSlice;
