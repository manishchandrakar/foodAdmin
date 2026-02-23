import { Router } from "express";
import { requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { getAll, getById, create, update, remove } from "../controllers/couponController";

const router = Router();

router.get("/", requireAdminOrSubadmin, getAll);
router.get("/:id", requireAdminOrSubadmin, getById);
router.post("/", requireAdminOrSubadmin, create);
router.put("/:id", requireAdminOrSubadmin, update);
router.delete("/:id", requireAdminOrSubadmin, remove);

export default router;
