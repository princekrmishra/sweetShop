import { z } from "zod";

export const createSweetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
});

export const updateSweetSchema = createSweetSchema.partial();

export const searchSweetSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});
