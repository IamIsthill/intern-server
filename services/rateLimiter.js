import { rateLimit } from "express-rate-limit";
import { slowDown } from 'express-slow-down'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const slowLimiter = slowDown({
  windowMs: 1 * 1000, // 1 second
  delayAfter: 10, // Delay after 5 requests.
  delayMs: (hits) => hits * 100,
})
