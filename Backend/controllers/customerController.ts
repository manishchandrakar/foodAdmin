import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { signJwt, customerCookieOptions } from "../middlewares/authMiddleware";
import { CUSTOMER_COOKIE } from "../utils/constants";
import {
  CustomerRegisterSchema,
  CustomerLoginSchema,
  CustomerOrderCreateSchema,
  ReviewCreateSchema,
  UserUpdateSchema,
  parseId,
} from "../models/schemas";

// ─── Auth ─────────────────────────────────────────────────────────────────────

// POST /api/customer/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = CustomerRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Email is already registered" });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, password: hashed, role: "customer", isActive: true },
  });

  const token = signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.cookie(CUSTOMER_COOKIE, token, customerCookieOptions);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
};

// POST /api/customer/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = CustomerLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, role: "customer", isActive: true },
  });

  if (!user?.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.cookie(CUSTOMER_COOKIE, token, customerCookieOptions);
  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
};

// POST /api/customer/auth/logout
export const logout = (_req: Request, res: Response): void => {
  res.cookie(CUSTOMER_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  res.json({ success: true });
};

// GET /api/customer/auth/me
export const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(req.user);
};

// ─── Orders ───────────────────────────────────────────────────────────────────

// GET /api/customer/orders
export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
};

// GET /api/customer/orders/:id
export const getMyOrder = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const order = await prisma.order.findFirst({
    where: { id: result.id, userId: req.user!.id },
    include: { orderItems: { include: { product: true } }, payments: true },
  });
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(order);
};

// POST /api/customer/orders
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const parsed = CustomerOrderCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.format() });
    return;
  }

  const { items, couponCode, ...orderData } = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: { ...orderData, userId: req.user!.id, couponCode: couponCode || null },
    });
    await tx.orderItem.createMany({
      data: items.map((item) => ({ ...item, orderId: created.id })),
    });
    return tx.order.findUnique({
      where: { id: created.id },
      include: { orderItems: { include: { product: true } } },
    });
  });

  res.status(201).json(order);
};

// POST /api/customer/orders/:id/cancel
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const order = await prisma.order.findFirst({
    where: { id: result.id, userId: req.user!.id },
  });
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (!["pending", "confirmed"].includes(order.status)) {
    res.status(400).json({ error: "Only pending or confirmed orders can be cancelled" });
    return;
  }

  const updated = await prisma.order.update({
    where: { id: result.id },
    data: { status: "cancelled" },
  });
  res.json(updated);
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

// POST /api/customer/reviews
export const createReview = async (req: Request, res: Response): Promise<void> => {
  const parsed = ReviewCreateSchema.safeParse({
    ...req.body,
    userId: req.user!.id,
  });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.format() });
    return;
  }

  const existing = await prisma.review.findFirst({
    where: { userId: req.user!.id, productId: parsed.data.productId },
  });
  if (existing) {
    res.status(409).json({ error: "You have already reviewed this product" });
    return;
  }

  const review = await prisma.review.create({
    data: parsed.data,
    include: { user: true },
  });
  res.status(201).json(review);
};

// ─── Coupons ──────────────────────────────────────────────────────────────────

// POST /api/customer/coupons/validate
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  const code = String(req.body.code || "").trim().toUpperCase();
  if (!code) {
    res.status(400).json({ error: "Coupon code is required" });
    return;
  }

  const coupon = await prisma.coupon.findFirst({
    where: { code, status: "active" },
  });

  if (!coupon) {
    res.status(404).json({ valid: false, error: "Invalid or expired coupon" });
    return;
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    res.status(400).json({ valid: false, error: "Coupon has expired" });
    return;
  }

  res.json({ valid: true, code: coupon.code, discountPercent: coupon.discountPercent });
};

// ─── Profile ──────────────────────────────────────────────────────────────────

// PUT /api/customer/profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const parsed = UserUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  // Prevent role escalation
  const { role, password, ...safeData } = parsed.data;
  void role; void password;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: safeData,
    select: { id: true, name: true, email: true, phone: true, role: true },
  });
  res.json(user);
};
