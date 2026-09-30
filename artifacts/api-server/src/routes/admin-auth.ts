import { Router, type IRouter } from "express";
import { hasAdminSession, loginAdmin, logoutAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

router.get("/admin/auth/session", (req, res): void => {
  res.json({
    authenticated: hasAdminSession(req),
    configured: Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET),
  });
});

router.post("/admin/auth/login", (req, res): void => {
  loginAdmin(req, res);
});

router.post("/admin/auth/logout", (_req, res): void => {
  logoutAdmin(_req, res);
});

export default router;