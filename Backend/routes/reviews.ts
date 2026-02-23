import { Router } from "express";
import { requireAdmin, requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/reviewController";

const router = Router();

router.get("/", requireAdminOrSubadmin, getAll);
router.get("/:id", requireAdminOrSubadmin, getById);
router.post("/", requireAdminOrSubadmin, create);
router.put("/:id", requireAdminOrSubadmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
