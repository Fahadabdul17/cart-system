import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'invalid decimal').transform(val => val),
  stock: z.number().int().nonnegative()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;