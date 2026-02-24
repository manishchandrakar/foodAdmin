import { Router } from "express";

import authRoutes from "./auth";
import customerRoutes from "./customer";
import productRoutes from "./products";
import categoryRoutes from "./categories";
import unitRoutes from "./units";
import gstRateRoutes from "./gstRates";
import userRoutes from "./users";
import couponRoutes from "./coupons";
import orderRoutes from "./orders";
import cartRoutes from "./cart";
import reviewRoutes from "./reviews";
import paymentRoutes from "./payments";
import dashboardRoutes from "./dashboard";
import uploadRoutes from "./upload";

const router = Router();

router.use("/auth", authRoutes);
router.use("/customer", customerRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/units", unitRoutes);
router.use("/gst-rates", gstRateRoutes);
router.use("/users", userRoutes);
router.use("/coupons", couponRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);

export default router;
