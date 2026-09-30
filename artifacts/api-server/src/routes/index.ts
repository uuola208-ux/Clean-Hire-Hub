import { Router, type IRouter } from "express";
import healthRouter from "./health";
import applicationsRouter from "./applications";
import documentsRouter from "./documents";
import contactRouter from "./contact";
import adminAuthRouter from "./admin-auth";
import siteSettingsRouter from "./site-settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(applicationsRouter);
router.use(documentsRouter);
router.use(contactRouter);
router.use(adminAuthRouter);
router.use(siteSettingsRouter);

export default router;
