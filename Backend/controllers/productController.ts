import { Request, Response } from "express";
import { prisma } from "../config/db";
import { ProductCreateSchema, ProductUpdateSchema, parseId } from "../models/schemas";

// GET /api/products
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const products = await prisma.product.findMany({
    include: { category: true, unit: true, gstRate: true, vendor: true },
  });
  res.json(products);
};

// GET /api/products/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const product = await prisma.product.findUnique({
    where: { id: result.id },
    include: { category: true, unit: true, gstRate: true, vendor: true },
  });
  if (!product) { res.status(404).json({ error: "Not found" }); return; }
  res.json(product);
};

// POST /api/products
export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = ProductCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const product = await prisma.product.create({
    data: parsed.data,
    include: { category: true, unit: true, gstRate: true, vendor: true },
  });
  res.status(201).json(product);
};

// PUT /api/products/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = ProductUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const product = await prisma.product.update({
    where: { id: result.id },
    data: parsed.data,
    include: { category: true, unit: true, gstRate: true, vendor: true },
  });
  res.json(product);
};

// DELETE /api/products/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.product.delete({ where: { id: result.id } });
  res.json({ success: true });
};
