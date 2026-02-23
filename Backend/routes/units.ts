import { Router } from "express";
import { requireAdmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/unitController";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", requireAdmin, create);
router.put("/:id", requireAdmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
