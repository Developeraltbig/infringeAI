import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user-auth/login",
        method: "POST",
        body: credentials,
      }),
      // 🚀 ADD THIS LINE:
      invalidatesTags: ["Auth"],
    }),

    // Check Auth — protected, requires Bearer token
    checkAuth: builder.query({
      query: () => "/user-auth/check",
      providesTags: ["Auth"],
    }),

    // Logout — clears HTTP-only cookie on server
    logout: builder.mutation({
      query: () => ({
        url: "/user-auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Refresh Token — used internally by apiSlice reauth layer
    refreshToken: builder.mutation({
      query: () => ({
        url: "/user-auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCheckAuthQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApiSlice;
