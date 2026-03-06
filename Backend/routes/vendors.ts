import { Router } from "express";
import * as vendorController from "../controllers/vendorController";
import { requireAdminOrSubadmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAdminOrSubadmin, vendorController.getAll);
router.get("/:id", requireAdminOrSubadmin, vendorController.getById);
router.post("/", requireAdminOrSubadmin, vendorController.create);
router.put("/:id", requireAdminOrSubadmin, vendorController.update);
router.delete("/:id", requireAdminOrSubadmin, vendorController.remove);

export default router;
