import { Request, Response } from "express";
import { prisma } from "../config/db";
import { VendorCreateSchema, VendorUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const vendors = await prisma.vendor.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gstin: true,
      status: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(vendors);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const vendor = await prisma.vendor.findUnique({
    where: { id: result.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gstin: true,
      status: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
  });
  if (!vendor) { res.status(404).json({ error: "Vendor not found" }); return; }
  res.json(vendor);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = VendorCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const data = {
    ...parsed.data,
    gstin: parsed.data.gstin || null,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
  };

  const vendor = await prisma.vendor.create({
    data,
    select: {
      id: true, name: true, email: true, phone: true,
      address: true, gstin: true, status: true, createdAt: true,
    },
  });
  res.status(201).json(vendor);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = VendorUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const data: Record<string, unknown> = { ...parsed.data };
  if ("gstin" in data && !data.gstin) data.gstin = null;
  if ("phone" in data && !data.phone) data.phone = null;
  if ("address" in data && !data.address) data.address = null;

  const vendor = await prisma.vendor.update({
    where: { id: result.id },
    data,
    select: {
      id: true, name: true, email: true, phone: true,
      address: true, gstin: true, status: true, createdAt: true,
    },
  });
  res.json(vendor);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  // Unlink products before deleting vendor
  await prisma.product.updateMany({
    where: { vendorId: result.id },
    data: { vendorId: null },
  });

  await prisma.vendor.delete({ where: { id: result.id } });
  res.json({ success: true });
};
