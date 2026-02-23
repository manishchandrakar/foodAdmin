import { Request, Response } from "express";
import { prisma } from "../config/db";
import { UnitCreateSchema, UnitUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const units = await prisma.unit.findMany();
  res.json(units);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const unit = await prisma.unit.findUnique({ where: { id: result.id } });
  if (!unit) { res.status(404).json({ error: "Not found" }); return; }
  res.json(unit);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = UnitCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const unit = await prisma.unit.create({ data: parsed.data });
  res.status(201).json(unit);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = UnitUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const unit = await prisma.unit.update({ where: { id: result.id }, data: parsed.data });
  res.json(unit);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.unit.delete({ where: { id: result.id } });
  res.json({ success: true });
};
