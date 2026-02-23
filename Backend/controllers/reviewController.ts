import { Request, Response } from "express";
import { prisma } from "../config/db";
import { ReviewCreateSchema, ReviewUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const reviews = await prisma.review.findMany({
    include: { user: true, product: true },
  });
  res.json(reviews);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const review = await prisma.review.findUnique({
    where: { id: result.id },
    include: { user: true, product: true },
  });
  if (!review) { res.status(404).json({ error: "Not found" }); return; }
  res.json(review);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = ReviewCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const review = await prisma.review.create({ data: parsed.data });
  res.status(201).json(review);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = ReviewUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const review = await prisma.review.update({ where: { id: result.id }, data: parsed.data });
  res.json(review);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.review.delete({ where: { id: result.id } });
  res.json({ success: true });
};
