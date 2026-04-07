import { apiSlice } from "./apiSlice";

export const patentApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Quick & Initial Interactive Start
    startAnalysis: builder.mutation({
      query: (body) => ({
        url: "/projects/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Bulk JSON Array
    startBulkAnalysis: builder.mutation({
      query: (patentIds) => ({
        url: "/patents/bulk-quick-analyze",
        method: "POST",
        body: { patent_ids: patentIds },
      }),
      invalidatesTags: ["Projects"],
    }),

    // Bulk File Upload (Excel/CSV)
    uploadBulkFile: builder.mutation({
      query: (formData) => ({
        url: "/patents/bulk-upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useStartAnalysisMutation,
  useStartBulkAnalysisMutation,
  useUploadBulkFileMutation,
} = patentApiSlice;
