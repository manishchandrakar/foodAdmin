import { Request, Response } from "express";
import { prisma } from "../config/db";
import { CouponCreateSchema, CouponUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const coupons = await prisma.coupon.findMany();
  res.json(coupons);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const coupon = await prisma.coupon.findUnique({ where: { id: result.id } });
  if (!coupon) { res.status(404).json({ error: "Not found" }); return; }
  res.json(coupon);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = CouponCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const coupon = await prisma.coupon.create({ data: parsed.data });
  res.status(201).json(coupon);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = CouponUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const coupon = await prisma.coupon.update({ where: { id: result.id }, data: parsed.data });
  res.json(coupon);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.coupon.delete({ where: { id: result.id } });
  res.json({ success: true });
};
