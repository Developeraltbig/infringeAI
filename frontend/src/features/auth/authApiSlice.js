import { apiSlice } from "../api/apiSlice";

const centralAuthUrl = import.meta.env.VITE_PATSERO_BACKEND_URL;

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkAuth: builder.query({
      query: () => `${centralAuthUrl}/user-auth/check`,
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/user-auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCheckAuthQuery, // This hook is for verifying on page load
  useLogoutMutation,
} = authApiSlice;
