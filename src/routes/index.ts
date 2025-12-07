import { Hono } from "hono";

import UserRouter from "./userRoutes";

const router = new Hono();


router.route("/user", UserRouter);

export default router;
