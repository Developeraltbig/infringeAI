import logger from "../utils/winstonLogger.util.js";

const errorHandler = (err, req, res, next) => {
  logger.error("%o", err);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
