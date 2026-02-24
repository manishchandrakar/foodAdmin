import { Router } from "express";
import { requireAdmin, requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/reviewController";

const router = Router();

// Public: product detail page reads reviews
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireAdminOrSubadmin, create);
router.put("/:id", requireAdminOrSubadmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
