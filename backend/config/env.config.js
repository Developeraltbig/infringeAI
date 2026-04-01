import dotenv from "dotenv";
import { cleanEnv, str, port, url, email, num } from "envalid";

dotenv.config({ quiet: true });

// Validate and sanitize the environment variables
const env = cleanEnv(process.env, {
  // Application
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: port({ default: 8080 }),
  API_VERSION: str({ default: "v1" }),
  CORS_ORIGIN_URL: str(),
  USER_FRONTEND_URL: url(),
  ADMIN_FRONTEND_URL: url(),

  // Database
  MONGODB_URI: url(),

  // Redis
  REDIS_URL: str({ default: "redis://127.0.0.1:6379" }),
  USER_REDIS_CACHE_TTL_HOURS: num({ default: "1" }), // Hours
  CONTENT_REDIS_CACHE_TTL_HOURS: num({ default: "24" }), // Hours

  // JWT Auth
  JWT_ACCESS_SECRET_KEY: str(),
  JWT_REFRESH_SECRET_KEY: str(),
  JWT_COOKIE_EXPIRES_IN: num({ default: "7" }),
  JWT_ACCESS_EXPIRES_IN: str({ default: "15m" }),
  JWT_REFRESH_EXPIRES_IN: str({ default: "7d" }),

  // Email
  SENDER_EMAIL_USER: email(),
  SENDER_EMAIL_PASS: str(),

  // Token
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: num({ default: "15" }), // Minutes
  EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_HOURS: num({ default: "24" }), // Hours

  // Rate Limiting
  RATE_LIMIT_API_MAX: num({ default: 100 }),
  RATE_LIMIT_AUTH_MAX: num({ default: 10 }),
  RATE_LIMIT_API_WINDOW_MINS: num({ default: 15 }),
  RATE_LIMIT_AUTH_WINDOW_MINS: num({ default: 60 }),

  // Cookie
  USER_COOKIE_DOMAIN: str({ default: "localhost" }),
  ADMIN_COOKIE_DOMAIN: str({ default: "localhost" }),

  PATSERO_BACKEND_URL: url(),
  GEMINI_API_KEY: str(),
  EXA_API_KEY_1: str(),
  EXA_API_KEY_2: str(),
  EXA_API_KEY_3: str(),
  EXA_API_KEY_4: str(),
  EXA_API_KEY_5: str(),
  SERP_API_KEY: str(),

  BRANDFETCH_CLIENT_ID: str(),
});

export default env;
