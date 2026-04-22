import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { logOut, setCredentials } from "../auth/authSlice";

const centralAuthUrl = import.meta.env.VITE_PATSERO_BACKEND_URL;

const baseQuery = fetchBaseQuery({
  credentials: "include",
  baseUrl: import.meta.env.PROD
    ? import.meta.env.VITE_INFRINGMENT_BACKEND_URL
    : "http://localhost:3001/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    try {
      const refreshResult = await axios.post(
        `${centralAuthUrl}/user-auth/refresh-token`,
        {},
        { withCredentials: true },
      );
      if (refreshResult?.data) {
        const { accessToken, user } =
          refreshResult.data.data || refreshResult.data;
        api.dispatch(setCredentials({ accessToken, user }));
        result = await baseQuery(args, api, extraOptions);
      }
    } catch (err) {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Projects", "ProjectDetails"], // 🚀 Optimization: Enables auto-cache invalidation
  endpoints: () => ({}),
});
