import { Router } from "express";
import { requireAdmin, requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/userController";

const router = Router();

router.get("/", requireAdminOrSubadmin, getAll);
router.get("/:id", requireAdminOrSubadmin, getById);
router.post("/", requireAdmin, create);
router.put("/:id", requireAdmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
