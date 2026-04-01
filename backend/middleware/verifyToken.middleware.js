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
      // 3. Hit the Core Backend's /check endpoint!
      // We pass the Bearer token exactly as we received it.
      const response = await axios.get(
        `${PATSERO_BACKEND_URL}/user-auth/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response);

      // 4. If we get here, the Core Backend returned 200 OK!
      // Extract the user data that the core backend sent back.
      // (Adjust `response.data.data` depending on how your core backend formats its JSON response)
      const user = response.data.data || response.data.user || response.data;

      // 5. Attach the user and auth info to the request for your module's controllers to use
      req.user = user;

      // 6. Move to the next function (the controller)
      next();
    } catch (axiosError) {
      // If the Core Backend rejects the token (returns 401, 403, etc.), we catch it here.
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const errorMessage =
          axiosError.response.data?.message ||
          axiosError.response.data?.error ||
          "Authentication failed";

        throw new ApiError(statusCode, errorMessage);
      } else {
        // If the Core Backend is down or unreachable
        throw new ApiError(
          500,
          "Internal Server Error: Unable to reach Core Auth Server",
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

export default verifyUserToken;
