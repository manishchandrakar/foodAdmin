import { Request, Response } from "express";
import { prisma } from "../config/db";
import { GstRateCreateSchema, GstRateUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const gstRates = await prisma.gstRate.findMany({ orderBy: { percentage: "asc" } });
  res.json(gstRates);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const gstRate = await prisma.gstRate.findUnique({ where: { id: result.id } });
  if (!gstRate) { res.status(404).json({ error: "Not found" }); return; }
  res.json(gstRate);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = GstRateCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const gstRate = await prisma.gstRate.create({ data: parsed.data });
  res.status(201).json(gstRate);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = GstRateUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const gstRate = await prisma.gstRate.update({ where: { id: result.id }, data: parsed.data });
  res.json(gstRate);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.gstRate.delete({ where: { id: result.id } });
  res.json({ success: true });
};
