import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { signJwt, cookieOptions } from "../middlewares/authMiddleware";
import { SESSION_COOKIE, ALLOWED_ROLES } from "../utils/constants";
import { sendOtpEmail } from "../services/email";
import {
  LoginSchema,
  SendOtpSchema,
  VerifyOtpSchema,
} from "../models/schemas";

// Simple in-memory OTP rate limiter: 3 requests per email per 15 minutes
const otpRateLimit = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const entry = otpRateLimit.get(email);
  if (!entry || entry.resetAt < now) {
    otpRateLimit.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count += 1;
  return true;
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, role: { in: ALLOWED_ROLES as unknown as string[] }, isActive: true },
  });

  if (!user || !user.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.cookie(SESSION_COOKIE, token, cookieOptions);
  res.json({ name: user.name, role: user.role });
};

// POST /api/auth/logout
export const logout = (_req: Request, res: Response): void => {
  res.cookie(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  res.json({ success: true });
};

// GET /api/auth/me
export const getMe = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(req.user);
};

// POST /api/auth/otp/send
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const parsed = SendOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email } = parsed.data;

  if (!checkRateLimit(email)) {
    res.status(429).json({ error: "Too many OTP requests. Please wait 15 minutes." });
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email, role: { in: ALLOWED_ROLES as unknown as string[] }, isActive: true },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    res.json({ success: true });
    return;
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp: otpHash, otpExpiry },
  });

  await sendOtpEmail(email, otp);
  res.json({ success: true });
};

// POST /api/auth/otp/verify
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const parsed = VerifyOtpSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, otp } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, role: { in: ALLOWED_ROLES as unknown as string[] }, isActive: true },
  });

  if (!user || !user.otp || !user.otpExpiry) {
    res.status(401).json({ error: "Invalid or expired OTP" });
    return;
  }

  if (user.otpExpiry < new Date()) {
    await prisma.user.update({ where: { id: user.id }, data: { otp: null, otpExpiry: null } });
    res.status(401).json({ error: "OTP has expired. Please request a new one." });
    return;
  }

  const otpMatch = await bcrypt.compare(otp, user.otp);
  if (!otpMatch) {
    res.status(401).json({ error: "Invalid OTP" });
    return;
  }

  await prisma.user.update({ where: { id: user.id }, data: { otp: null, otpExpiry: null } });

  const token = signJwt({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.cookie(SESSION_COOKIE, token, cookieOptions);
  res.json({ name: user.name, role: user.role });
};

// GET /api/auth/seed  (DEV ONLY)
export const seed = async (_req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    res.status(403).json({ error: "Not available in production" });
    return;
  }

  const email = process.env.ADMIN_EMAIL || "admin@foodadmin.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const name = process.env.ADMIN_NAME || "Super Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.json({ message: "Admin already exists", email });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.user.create({
    data: { name, email, password: hashed, role: "admin", isActive: true },
  });

  res.json({
    message: "Admin created",
    email: admin.email,
    note: "Change this password immediately after first login.",
  });
};
