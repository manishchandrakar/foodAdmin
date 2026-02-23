import { Router } from "express";
import { requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getStats } from "../controllers/dashboardController";

const router = Router();

router.get("/", requireAdminOrSubadmin, getStats);

export default router;
