import axios from "axios";
import { toast } from "react-toastify";
import { logOut, setCredentials } from "../auth/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const centralAuthUrl = import.meta.env.VITE_PATSERO_BACKEND_URL;

// Create a base query with credential inclusion
const baseQuery = fetchBaseQuery({
  credentials: "include",
  baseUrl: import.meta.env.PROD
    ? import.meta.env.VITE_INFRINGMENT_BACKEND_URL
    : "http://localhost:3001/api/v1", // Backend URL
  credentials: "include", // This is crucial for sending cookies
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// This is the magic part: a wrapper around our baseQuery
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    const statusCode = result.error.status;

    // Handle 401: Access Token is missing or expired
    if (statusCode === 401) {
      const wasLoggedIn = api.getState().auth.user !== null;

      console.log("Refresh");
      const refreshResult = await axios.post(
        `${centralAuthUrl}/user-auth/refresh-token`,
        api,
        {
          withCredentials: true, // sends cookies
        },
      );

      console.log("data", refreshResult);

      if (refreshResult?.data) {
        // Refresh Succeeded!
        const { accessToken, user } =
          refreshResult.data.data || refreshResult.data;

        // Store the new token
        api.dispatch(setCredentials({ accessToken, user }));

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh Failed!
        const refreshErrorStatus = refreshResult?.error?.status;

        if (refreshErrorStatus === 401 || refreshErrorStatus === 403) {
          // Token is dead or revoked. Log out.
          api.dispatch(logOut());

          if (wasLoggedIn) {
            toast.info("Session expired. Please log in again.", {
              toastId: "session-expired",
            });
          }
        } else if (
          refreshErrorStatus >= 500 ||
          refreshErrorStatus === "FETCH_ERROR" ||
          refreshErrorStatus === "PARSING_ERROR"
        ) {
          // Catch 500s or Network Drops specifically during the refresh attempt!
          toast.error(
            refreshErrorStatus === "FETCH_ERROR"
              ? "Unable to connect to the server. Please check your internet connection."
              : "Something went wrong on our end. Please try again later.",
            { toastId: "global-server-error" },
          );
        }
      }
    } else if (statusCode === 403) {
      // Handle 403: Account Deactivated / Banned
      api.dispatch(logOut());

      toast.error(
        result.error.data?.message ||
          "Account is deactivated. Please contact support.",
        {
          toastId: "account-deactivated",
        },
      );
    } else if (
      statusCode >= 500 ||
      statusCode === "FETCH_ERROR" ||
      statusCode === "PARSING_ERROR"
    ) {
      // Handle 500+ Internal Server Errors or Network Drops on NORMAL requests
      toast.error(
        statusCode === "FETCH_ERROR"
          ? "Unable to connect to the server. Please check your internet connection."
          : "Something went wrong on our end. Please try again later.",
        { toastId: "global-server-error" },
      );
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use custom baseQuery with re-authentication
  endpoints: (builder) => ({}),
});
