import rateLimit from 'express-rate-limit';

// Strict limiter for auth endpoints — brute-force / credential-stuffing defense.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

// Looser default limiter for general API traffic.
export const defaultLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
