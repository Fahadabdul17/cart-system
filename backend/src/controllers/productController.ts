import { Request, Response } from 'express';
import * as ProductService from '../services/productService';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const products = await ProductService.listProducts();
  res.json(products);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await ProductService.createProduct(req.body);
  res.status(201).json(created);
});
