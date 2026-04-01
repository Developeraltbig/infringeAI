import env from "../config/env.config.js";
import RedisStore from "rate-limit-redis";
import rateLimit from "express-rate-limit";
import ApiError from "../utils/apiError.util.js";
import { redisConnection } from "../config/redisConnection.config.js";

const {
  RATE_LIMIT_API_MAX,
  RATE_LIMIT_AUTH_MAX,
  RATE_LIMIT_API_WINDOW_MINS,
  RATE_LIMIT_AUTH_WINDOW_MINS,
} = env;

// Standard API Limiter
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisConnection.call(...args),
    prefix: "rl_api:", // Unique prefix for all routes except auth
  }),
  windowMs: RATE_LIMIT_API_WINDOW_MINS * 60 * 1000, // 15 minutes
  max: RATE_LIMIT_API_MAX, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        `Too many requests from this IP, please try again after ${RATE_LIMIT_API_WINDOW_MINS} minutes`,
      ),
    );
  },
});

// Strict Auth Limiter
export const strictAuthLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisConnection.call(...args),
    prefix: "rl_auth:", // Unique prefix for auth routes
  }),
  windowMs: RATE_LIMIT_AUTH_WINDOW_MINS * 60 * 1000, // 1 Hour
  max: RATE_LIMIT_AUTH_MAX, // Limit each IP to 10 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many authentication attempts. Please try again after an hour to protect your account.",
      ),
    );
  },
});
