import IORedis from "ioredis";
import env from "./config/env.config.js";

const { REDIS_URL } = env;

const redis = new IORedis(REDIS_URL || "redis://127.0.0.1:6379");

async function nuke() {
  console.log("💣 Connecting to Redis to wipe all jobs...");
  try {
    await redis.flushall();
    console.log(
      "✅ SUCCESS: All BullMQ jobs and Redis data have been deleted.",
    );
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  } finally {
    process.exit();
  }
}

nuke();

// node nuke-redis.js  --> run this code when you want to kill the job
