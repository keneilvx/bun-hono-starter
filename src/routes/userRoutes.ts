// import auth
// import passport from "passport";
import { Hono, type Context } from "hono";
import authController from "../controller/authController";
import { requireAuth } from "../middlewares/loginMiddleware";
import supabase from "../config/supabaseClient";
const userRouter = new Hono();

userRouter.use("*", requireAuth);

userRouter.get("/details", async (c: Context) => {
  const token = c.get("token") as string;

  if (!token) {
    return c.json({ error: "Token missing in context" }, 401);
  }

  return authController.GetUser(c, token);
});

userRouter.get("/profile", authController.GetProfile);

userRouter.get("/auth/callback", async (c: Context) => {
  const code = c.req.query("code");
  const next = c.req.query("next") ?? "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Supabase auth error:", error.message);
      return c.text("Authentication failed", 500);
    }
  }
  return c.redirect(`/${next.slice(1)}`, 303);
});


userRouter.post("/update", authController.UpdateUser);

userRouter.post("hymns/update", authController.UpdateUserHymn);

export default userRouter;
