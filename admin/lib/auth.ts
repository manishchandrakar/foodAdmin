import { SignJWT, jwtVerify } from "jose";
import { EnumUserRole } from "@/types/enum";

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: EnumUserRole;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env variable is not set");
  return new TextEncoder().encode(secret);
};

export const signJwt = async (payload: JwtPayload): Promise<string> => {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
};

export const verifyJwt = async (token: string): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
};

export const SESSION_COOKIE = "admin_session";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};
