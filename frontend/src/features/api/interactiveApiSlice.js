import { apiSlice } from "./apiSlice";

export const interactiveApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // 🚀 STEP 1: START INTERACTIVE MODE
    startInteractive: builder.mutation({
      query: (patentId) => ({
        url: "/projects/interactive/start", // 👈 Your specific API
        method: "POST",
        body: { patentId },
      }),
      invalidatesTags: ["Projects"],
    }),

    // Stage 2: Pick 1 claim from the extracted list
    selectClaim: builder.mutation({
      query: (body) => ({
        url: "/projects/interactive/select-claim",
        method: "POST",
        body,
      }),
      // Invalidate status so the frontend loader knows we moved to Stage 2
      invalidatesTags: (res, err, { projectId }) => [
        { type: "ProjectStatus", id: projectId },
      ],
    }),

    getLogoConfig: builder.query({
      // This will call: http://localhost:3001/api/v1/projects/logo-config
      query: () => "/projects/logo-config",

      // 💡 Optimization: This config never changes, so cache it for a long time
      keepUnusedDataFor: 86400, // Cache for 24 hours
    }),

    // Stage 3: Pick 1-3 companies and start Deep Dive
    finalizeInteractive: builder.mutation({
      query: (body) => ({
        url: "/projects/interactive/finalize", // 🟢 FIXED: Matches Postman URL
        method: "POST",
        body,
      }),
      invalidatesTags: (res, err, { projectId }) => [
        { type: "ProjectStatus", id: projectId },
        { type: "Projects" },
      ],
    }),
  }),
});

export const {
  useStartInteractiveMutation,
  useSelectClaimMutation,
  useGetLogoConfigQuery,
  useFinalizeInteractiveMutation,
} = interactiveApiSlice;
