import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { UserCreateSchema, UserUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      description: true,
      isActive: true,
      createdAt: true,
    },
  });
  res.json(users);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const user = await prisma.user.findUnique({
    where: { id: result.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      description: true,
      isActive: true,
      createdAt: true,
    },
  });
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(user);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const { password, ...rest } = parsed.data;
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { ...rest, password: hashed },
    select: {
      id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
    },
  });
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = UserUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const { password, ...rest } = parsed.data;
  const data = password ? { ...rest, password: await bcrypt.hash(password, 12) } : rest;

  const user = await prisma.user.update({
    where: { id: result.id },
    data,
    select: {
      id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
    },
  });
  res.json(user);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.user.delete({ where: { id: result.id } });
  res.json({ success: true });
};
