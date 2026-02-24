import { Router } from "express";
import { requireCustomer, authenticateCustomer } from "../middlewares/authMiddleware";
import {
  register,
  login,
  logout,
  getMe,
  getMyOrders,
  getMyOrder,
  placeOrder,
  cancelOrder,
  createReview,
  validateCoupon,
  updateProfile,
} from "../controllers/customerController";

const router = Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", authenticateCustomer, getMe);

// ─── Orders ───────────────────────────────────────────────────────────────────
router.get("/orders", requireCustomer, getMyOrders);
router.post("/orders", requireCustomer, placeOrder);
router.get("/orders/:id", requireCustomer, getMyOrder);
router.post("/orders/:id/cancel", requireCustomer, cancelOrder);

// ─── Reviews ──────────────────────────────────────────────────────────────────
router.post("/reviews", requireCustomer, createReview);

// ─── Coupons ──────────────────────────────────────────────────────────────────
router.post("/coupons/validate", validateCoupon);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.put("/profile", requireCustomer, updateProfile);

export default router;
