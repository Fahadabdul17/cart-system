import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().min(1)
});

export type AddItemInput = z.infer<typeof addItemSchema>;
