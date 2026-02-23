import { Router } from "express";
import { requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getItems,
  addItem,
  updateItem,
  removeItem,
  checkout,
} from "../controllers/cartController";

const router = Router();

router.get("/", requireAdminOrSubadmin, getAll);
router.post("/", requireAdminOrSubadmin, create);
router.get("/:id", requireAdminOrSubadmin, getById);
router.put("/:id", requireAdminOrSubadmin, update);
router.delete("/:id", requireAdminOrSubadmin, remove);

// Cart items
router.get("/:id/items", requireAdminOrSubadmin, getItems);
router.post("/:id/items", requireAdminOrSubadmin, addItem);
router.put("/:id/items/:itemId", requireAdminOrSubadmin, updateItem);
router.delete("/:id/items/:itemId", requireAdminOrSubadmin, removeItem);

// Checkout
router.post("/:id/checkout", requireAdminOrSubadmin, checkout);

export default router;
