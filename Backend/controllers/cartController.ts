import { Request, Response } from "express";
import { prisma } from "../config/db";
import {
  CartCreateSchema,
  CartUpdateSchema,
  CartItemAddSchema,
  CartItemUpdateSchema,
  CartCheckoutSchema,
  parseId,
} from "../models/schemas";

// GET /api/cart
export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const carts = await prisma.cart.findMany({
      include: { user: true, cartItems: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(carts);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch carts";
    res.status(500).json({ error: message });
  }
};

// GET /api/cart/:id
export const getById = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const cart = await prisma.cart.findUnique({
    where: { id: result.id },
    include: { user: true, cartItems: { include: { product: true } } },
  });
  if (!cart) { res.status(404).json({ error: "Not found" }); return; }
  res.json(cart);
};

// POST /api/cart
export const create = async (req: Request, res: Response): Promise<void> => {
  const parsed = CartCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const { items, ...cartData } = parsed.data;

  const cart = await prisma.$transaction(async (tx) => {
    const created = await tx.cart.create({ data: cartData });
    await tx.cartItem.createMany({
      data: items.map((item) => ({ ...item, cartId: created.id })),
    });
    return tx.cart.findUnique({
      where: { id: created.id },
      include: { user: true, cartItems: { include: { product: true } } },
    });
  });

  res.status(201).json(cart);
};

// PUT /api/cart/:id
export const update = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const parsed = CartUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const cart = await prisma.cart.update({ where: { id: result.id }, data: parsed.data });
  res.json(cart);
};

// DELETE /api/cart/:id
export const remove = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  await prisma.cart.delete({ where: { id: result.id } });
  res.json({ success: true });
};

// GET /api/cart/:id/items
export const getItems = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const items = await prisma.cartItem.findMany({
    where: { cartId: result.id },
    include: { product: true },
  });
  res.json(items);
};

// POST /api/cart/:id/items
export const addItem = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const cart = await prisma.cart.findUnique({ where: { id: result.id } });
  if (!cart) { res.status(404).json({ error: "Cart not found" }); return; }
  if (cart.status !== "active") { res.status(400).json({ error: "Cart is not active" }); return; }

  const parsed = CartItemAddSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const item = await prisma.cartItem.create({
    data: { ...parsed.data, cartId: result.id },
    include: { product: true },
  });
  res.status(201).json(item);
};

// PUT /api/cart/:id/items/:itemId
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const cartResult = parseId(req.params.id);
  const itemResult = parseId(req.params.itemId);
  if (!cartResult.success) { res.status(400).json({ error: cartResult.error }); return; }
  if (!itemResult.success) { res.status(400).json({ error: itemResult.error }); return; }

  const parsed = CartItemUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const item = await prisma.cartItem.update({
    where: { id: itemResult.id, cartId: cartResult.id },
    data: parsed.data,
    include: { product: true },
  });
  res.json(item);
};

// DELETE /api/cart/:id/items/:itemId
export const removeItem = async (req: Request, res: Response): Promise<void> => {
  const cartResult = parseId(req.params.id);
  const itemResult = parseId(req.params.itemId);
  if (!cartResult.success) { res.status(400).json({ error: cartResult.error }); return; }
  if (!itemResult.success) { res.status(400).json({ error: itemResult.error }); return; }

  await prisma.cartItem.delete({ where: { id: itemResult.id, cartId: cartResult.id } });
  res.json({ success: true });
};

// POST /api/cart/:id/checkout
export const checkout = async (req: Request, res: Response): Promise<void> => {
  const result = parseId(req.params.id);
  if (!result.success) { res.status(400).json({ error: result.error }); return; }

  const cart = await prisma.cart.findUnique({
    where: { id: result.id },
    include: { cartItems: true },
  });

  if (!cart) { res.status(404).json({ error: "Cart not found" }); return; }
  if (cart.status !== "active") { res.status(400).json({ error: "Cart is not active" }); return; }
  if (cart.cartItems.length === 0) { res.status(400).json({ error: "Cart is empty" }); return; }

  const parsed = CartCheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const totalAmount = cart.cartItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: cart.userId,
        totalAmount,
        paymentMethod: parsed.data.paymentMethod,
        address: parsed.data.address,
        couponCode: parsed.data.couponCode || null,
      },
    });

    await tx.orderItem.createMany({
      data: cart.cartItems.map((item) => ({
        orderId: created.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await tx.cart.update({ where: { id: result.id }, data: { status: "checked_out" } });

    return tx.order.findUnique({
      where: { id: created.id },
      include: { user: true, orderItems: { include: { product: true } } },
    });
  });

  res.status(201).json(order);
};
