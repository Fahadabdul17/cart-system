import { Request, Response } from 'express';
import * as CartService from '../services/cartService';
import { asyncHandler } from '../utils/asyncHandler';

export const createCart = asyncHandler(async (_req: Request, res: Response) => {
  const cart = await CartService.createCart();
  res.status(201).json(cart);
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { productId, qty } = req.body;
  const item = await CartService.addItem(cartId, productId, qty);
  res.json(item);
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const cart = await CartService.getCart(cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  res.json(cart);
});