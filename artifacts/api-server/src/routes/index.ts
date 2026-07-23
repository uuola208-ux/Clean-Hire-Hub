import { Router, type IRouter } from "express";
import healthRouter from "./health";
import applicationsRouter from "./applications";
import documentsRouter from "./documents";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(applicationsRouter);
router.use(documentsRouter);
router.use(contactRouter);

export default router;
