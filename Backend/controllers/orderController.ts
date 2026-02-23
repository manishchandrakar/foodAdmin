import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../config/db";
import { OrderCreateSchema, OrderUpdateSchema, parseId } from "../models/schemas";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const order = await prisma.order.findUnique({
    where: { id: result.id },
    include: { user: true, orderItems: { include: { product: true } } },
  });
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = OrderCreateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const { items, ...orderData } = parsed.data;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({ data: orderData });
    await tx.orderItem.createMany({
      data: items.map((item) => ({ ...item, orderId: created.id })),
    });
    return tx.order.findUnique({
      where: { id: created.id },
      include: { orderItems: true },
    });
  });

  res.status(201).json(order);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = OrderUpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.format() }); return; }

  const order = await prisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({ where: { id: result.id } });
    if (!current) throw new Error("Order not found");

    const updated = await tx.order.update({ where: { id: result.id }, data: parsed.data });

    // Auto-create payment when order is marked delivered
    if (parsed.data.status === "delivered" && current.status !== "delivered") {
      const existingPayment = await tx.payment.findFirst({ where: { orderId: result.id } });
      if (!existingPayment) {
        await tx.payment.create({
          data: {
            orderId: result.id,
            paymentStatus: "completed",
            transactionId: `TXN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            paidAt: new Date(),
          },
        });
      }
    }

    return updated;
  });

  res.json(order);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.order.delete({ where: { id: result.id } });
  res.json({ success: true });
};
