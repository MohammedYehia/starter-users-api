import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  // 15 minutes
  windowMs: 15 * 60 * 1000,
  // Limit each IP to 100 requests per windowMs
  max: 100,
  // Return rate limit info in `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers, legacy non-standard header
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
