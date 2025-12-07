import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

interface RateLimitOptions {
    requests: number;
    window: number; // in milliseconds
    headerName?: string; // Optional header name for the limit
    keyGenerator?: (c: Context) => string; // Function to generate the key
  }
  
  interface RateLimitData {
    count: number;
    resetTime: number;
  }
  
  const rateLimitStore = new Map<string, RateLimitData>();
  
  /**
   * Rate limiting middleware for Hono.js
   * @param options - Configuration options for the rate limiter.
   */
  const rateLimit = (options: RateLimitOptions) => {
    const { requests, window, headerName = 'X-RateLimit-Limit', keyGenerator } = options;
  
    return async (c: Context, next: Next) => {
      // Determine the key to use for rate limiting.
      const key = keyGenerator ? keyGenerator(c) : c.req.header('x-forwarded-for') || c.req.remoteAddr || 'unknown'; // Corrected
  
      const now = Date.now();
      let clientData = rateLimitStore.get(key);
  
      if (!clientData) {
        rateLimitStore.set(key, { count: 1, resetTime: now + window });
      } else {
        if (now < clientData.resetTime) {
          clientData.count++;
          if (clientData.count > requests) {
            const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
            c.header('Retry-After', String(retryAfter));
            c.header(headerName, String(requests)); //set the limit
            throw new HTTPException(429, { message: 'Too Many Requests' });
          }
        } else {
          rateLimitStore.set(key, { count: 1, resetTime: now + window });
        }
      }
      // Set the rate limit header
      c.header(headerName, String(requests));
      await next();
    };
  };
  
  export default rateLimit;