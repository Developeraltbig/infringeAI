import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { logOut, setCredentials } from "../auth/authSlice";

// ✅ Fixed: [import.meta.env.PROD](http://) broken link
const baseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_INFRINGMENT_BACKEND_URL
  : "http://localhost:3001/api/v1";

const centralAuthUrl = import.meta.env.VITE_PATSERO_BACKEND_URL || baseUrl;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // ✅ Fixed: slice stores token as `token`, not `accessToken`
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args?.url;

  // ✅ Fixed: also exclude /refresh-token to prevent infinite loop
  const isAuthRoute =
    url?.includes("/login") || url?.includes("/refresh-token");

  if (result?.error?.status === 401 && !isAuthRoute) {
    try {
      // ✅ Fixed: [axios.post](http://) broken link
      const refreshResult = await axios.post(
        `${centralAuthUrl}/user-auth/refresh-token`,
        {},
        { withCredentials: true },
      );

      // ✅ Fixed: [refreshResult.data.data](http://) broken link
      if (refreshResult?.data?.success) {
        const { accessToken, user } = refreshResult.data.data;

        api.dispatch(setCredentials({ accessToken, user }));

        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
      }
    } catch (err) {
      console.error("Session expired, logging out...", err?.message);
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Projects", "ProjectDetails", "Auth"],
  endpoints: () => ({}),
});
