import type { Context, Next } from "hono";

export const requireAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Missing Authorization header" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("token", token);

  await next();
};
