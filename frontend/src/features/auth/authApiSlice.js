// import { apiSlice } from "../api/apiSlice";

// export const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Login
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/user-auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       // 🚀 ADD THIS LINE:
//       invalidatesTags: ["Auth"],
//     }),

//     // Check Auth — protected, requires Bearer token
//     checkAuth: builder.query({
//       query: () => "/user-auth/check",
//       providesTags: ["Auth"],
//     }),

//     // Logout — clears HTTP-only cookie on server
//     logout: builder.mutation({
//       query: () => ({
//         url: "/user-auth/logout",
//         method: "POST",
//       }),
//       invalidatesTags: ["Auth"],
//     }),

//     // Refresh Token — used internally by apiSlice reauth layer
//     refreshToken: builder.mutation({
//       query: () => ({
//         url: "/user-auth/refresh-token",
//         method: "POST",
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useCheckAuthQuery,
//   useLogoutMutation,
//   useRefreshTokenMutation,
// } = authApiSlice;
import { apiSlice } from "../api/apiSlice";
import { setCredits } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user-auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Check Auth
    // 🟢 onQueryStarted handles the background sync to stop infinite loops
    checkAuth: builder.query({
      query: () => "/user-auth/check",
      providesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: response } = await queryFulfilled;
          // Extract credits from backend structure: response.data.credits
          const newCredits = response?.data?.credits;
          if (typeof newCredits === "number") {
            dispatch(setCredits(newCredits));
          }
        } catch (err) {
          // No action needed on error, reauth layer handles 401s
        }
      },
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: "/user-auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Refresh Token
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
