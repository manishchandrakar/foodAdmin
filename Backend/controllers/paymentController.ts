import { Request, Response } from "express";
import { prisma } from "../config/db";
import { PaymentCreateSchema, PaymentUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const payments = await prisma.payment.findMany({
    include: { order: { include: { user: true } } },
    orderBy: { paidAt: "desc" },
  });
  res.json(payments);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const payment = await prisma.payment.findUnique({ where: { id: result.id } });
  if (!payment) { res.status(404).json({ error: "Not found" }); return; }
  res.json(payment);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = PaymentCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const payment = await prisma.payment.create({ data: parsed.data });
  res.status(201).json(payment);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = PaymentUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const payment = await prisma.payment.update({ where: { id: result.id }, data: parsed.data });
  res.json(payment);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.payment.delete({ where: { id: result.id } });
  res.json({ success: true });
};
