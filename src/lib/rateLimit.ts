import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";

// 5 attempts per 15 minutes, then blocked for another 15 minutes
export const loginRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:login",
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

// 3 registrations per hour — spam-account prevention, not typo tolerance
export const registerRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl:register",
  points: 3,
  duration: 60 * 60,
});
