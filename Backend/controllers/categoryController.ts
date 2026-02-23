import { Request, Response } from "express";
import { prisma } from "../config/db";
import { CategoryCreateSchema, CategoryUpdateSchema, parseId } from "../models/schemas";

// GET /api/categories
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

// GET /api/categories/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const category = await prisma.category.findUnique({ where: { id: result.id } });
  if (!category) { res.status(404).json({ error: "Not found" }); return; }
  res.json(category);
};

// POST /api/categories
export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = CategoryCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const category = await prisma.category.create({ data: parsed.data });
  res.status(201).json(category);
};

// PUT /api/categories/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = CategoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const category = await prisma.category.update({ where: { id: result.id }, data: parsed.data });
  res.json(category);
};

// DELETE /api/categories/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.category.delete({ where: { id: result.id } });
  res.json({ success: true });
};
