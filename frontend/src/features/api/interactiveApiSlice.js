import { apiSlice } from "./apiSlice";

export const interactiveApiSlice = apiSlice.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
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

    // Stage 3: Pick 1-3 companies and start Deep Dive
    resumeInteractive: builder.mutation({
      query: (body) => ({
        url: "/projects/resume",
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

export const { useSelectClaimMutation, useResumeInteractiveMutation } =
  interactiveApiSlice;
