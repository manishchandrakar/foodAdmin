import { Router } from "express";
import { requireAdmin, requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/paymentController";

const router = Router();

router.get("/", requireAdmin, getAll);
router.get("/:id", requireAdmin, getById);
router.post("/", requireAdminOrSubadmin, create);
router.put("/:id", requireAdminOrSubadmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
