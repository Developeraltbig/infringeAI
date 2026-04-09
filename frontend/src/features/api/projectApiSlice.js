import { apiSlice } from "./apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Sidebar / Dashboard List
    getProjects: builder.query({
      query: () => "/projects/all",
      providesTags: ["Projects"],
    }),

    // Add this endpoint to your existing projectApiSlice
    getProjectStatus: builder.query({
      query: (id) => `/projects/status/${id}`,
      // 🚀 OPTIMIZATION: Polling is handled dynamically in the component
      // to prevent unnecessary server hits.
      providesTags: (result, error, id) => [{ type: "ProjectStatus", id }],
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
