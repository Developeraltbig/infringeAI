import { apiSlice } from "../api/apiSlice";

export const patentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Trigger Quick Analysis
    startQuickAnalysis: builder.mutation({
      query: (patentId) => ({
        url: "/patents/quick-analyze",
        method: "POST",
        body: { patent_id: patentId },
      }),
      invalidatesTags: ["Projects"], // Refreshes history lists automatically
    }),

    // 2. Fetch all projects (for Sidebar History)
    getProjects: builder.query({
      query: () => "/projects/all",
      providesTags: ["Projects"],
    }),

    // 3. Get specific project status (For the Processing Page)
    getProjectStatus: builder.query({
      query: (id) => `/projects/status/${id}`,
      // 💡 Polling: Asks server every 3s if status isn't 'completed'
      pollingInterval: (result) =>
        result?.status === "completed" || result?.status === "failed"
          ? 0
          : 3000,
    }),

    // 4. Get final report details
    getProjectDetails: builder.query({
      query: (id) => `/projects/details/${id}`,
    }),
  }),
});

export const {
  useStartQuickAnalysisMutation,
  useGetProjectsQuery,
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} = patentApiSlice;
