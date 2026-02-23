import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  login,
  logout,
  getMe,
  sendOtp,
  verifyOtp,
  seed,
} from "../controllers/authController";

const router = Router();

// Public routes (no auth required)
router.post("/login", login);
router.post("/logout", logout);
router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);
router.get("/seed", seed);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
