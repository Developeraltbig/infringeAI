// import logger from "../utils/winstonLogger.util.js";

// const errorHandler = (err, req, res, next) => {
//   // logger.error("%o", err);

//   const statusCode = err.statusCode || err.status || 500;

//   res.status(statusCode).json({
//     message: err.message || "Internal Server Error",
//   });
// };

// export default errorHandler;
// backend/middleware/error.middleware.js
import logger from "../utils/winstonLogger.util.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // 🟢 Logic: Log everything EXCEPT 401s to the file
  if (statusCode !== 401) {
    logger.error(
      `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
  } else {
    // Optional: Only log 401s to the terminal console, not the file
    console.warn(`[Auth] 401 Unauthorized at ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
