import { apiSlice } from "../api/apiSlice";

const centralAuthUrl = import.meta.env.VITE_CENTRAL_AUTH_URL

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    checkAuth: builder.query({
      query: () => `${centralAuthUrl}/user-auth/check`,
    }),
  }),
});

export const {
  
  useCheckAuthQuery, // This hook is for verifying on page load
 
} = authApiSlice;
