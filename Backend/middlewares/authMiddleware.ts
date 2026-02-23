import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SESSION_COOKIE, ADMIN_ROLES, ALLOWED_ROLES } from "../utils/constants";

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Extend Express Request to carry the decoded user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env variable is not set");
  return secret;
};

export const signJwt = (payload: JwtPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: "24h" });
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload;
  } catch {
    return null;
  }
};

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // lax is needed for cross-origin requests
  path: "/",
  maxAge: 60 * 60 * 24 * 1000, // 24 hours in ms (Express uses ms, not seconds)
};

// ─── Middleware: authenticate ─────────────────────────────────────────────────
// Reads the session cookie, verifies the JWT, and attaches user to req.user.
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.cookies[SESSION_COOKIE];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.user = payload;
  next();
};

// ─── Middleware: requireAdmin ─────────────────────────────────────────────────
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authenticate(req, res, () => {
    if (!req.user || !(ADMIN_ROLES as readonly string[]).includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: admin access required" });
      return;
    }
    next();
  });
};

// ─── Middleware: requireAdminOrSubadmin ───────────────────────────────────────
export const requireAdminOrSubadmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authenticate(req, res, () => {
    if (!req.user || !(ALLOWED_ROLES as readonly string[]).includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
};
