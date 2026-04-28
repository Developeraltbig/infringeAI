import axios from "axios";
import env from "../config/env.config.js";
import ApiError from "../utils/apiError.util.js";

const { PATSERO_BACKEND_URL } = env;

const verifyUserToken = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized: Access token missing");
    }

    // 1. Get the token from the header
    const token = authHeader.split(" ")[1];

    try {
      // 2. Hit the Core Backend's /check endpoint
      const response = await axios.get(
        `${PATSERO_BACKEND_URL}/user-auth/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 3. Core Backend returned 200 OK — extract user data
      // checkAuth returns: { success: true, data: { user: {...} } }
      const responseData = response.data?.data;
      const user = responseData?.user || responseData || response.data;

      if (!user || Object.keys(user).length === 0) {
        throw new ApiError(401, "Unauthorized: Could not retrieve user data");
      }

      console.log("==== WHAT CORE AUTH RETURNED ====");
      console.log(JSON.stringify(user, null, 2));
      console.log("=================================");

      // 4. Attach user to request for downstream controllers
      req.user = user;

      // 5. Move to the next middleware/controller
      next();
    } catch (axiosError) {
      // If it's the ApiError we threw above (empty user), re-throw it
      if (axiosError instanceof ApiError) {
        throw axiosError;
      }

      // If Core Backend rejected the token (401, 403, etc.)
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const errorMessage =
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          "Authentication failed";
        throw new ApiError(statusCode, errorMessage);
      }

      // Core Backend is down or unreachable
      throw new ApiError(
        500,
        "Internal Server Error: Unable to reach Core Auth Server",
      );
    }
  } catch (error) {
    next(error);
  }
};

export default verifyUserToken;
