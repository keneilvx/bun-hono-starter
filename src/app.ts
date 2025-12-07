import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import router from "./routes";
import rateLimit from "./middlewares/rateLimit";

const app = new Hono();
const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || "").split(",");

app.use("/api/*", cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    credentials: true,
  }));

app.use("/api/*", rateLimit({
  requests: 100,     
  window: 60000,    // per 60 seconds (1 minute)
  keyGenerator: (c: Context) => {
    return c.req.header('Authorization') || c.req.header('x-real-ip') || c.req.header('x-forwarded-for') || c.req.remoteAddr || 'unknown';
  },
}));

app.route("/api", router);

app.get("/health", (c: Context) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() }, 200);
});

export default app;