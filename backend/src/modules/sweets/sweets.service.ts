import { db } from "../../db";
import { sweets } from "../../db/schema";
import { eq, and, ilike, gte, lte } from "drizzle-orm";

export async function createSweet(data: {
  name: string;
  category: string;
  price: number;
  quantity: number;
}) {
  const [sweet] = await db
    .insert(sweets)
    .values({
      name: data.name,
      category: data.category,
      price: data.price.toString(), 
      quantity: data.quantity,
    })
    .returning();

  return sweet;
}

export async function getAllSweets() {
  return db.select().from(sweets);
}

export async function updateSweet(
  id: string,
  data: Partial<{
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>
) {
  const updateData: any = {
    ...data,
    updatedAt: new Date(),
  };

  if (data.price !== undefined) {
    updateData.price = data.price.toString(); 
  }

  const [sweet] = await db
    .update(sweets)
    .set(updateData)
    .where(eq(sweets.id, id))
    .returning();

  if (!sweet) throw new Error("Sweet not found");
  return sweet;
}


export async function deleteSweet(id: string) {
  const [sweet] = await db
    .delete(sweets)
    .where(eq(sweets.id, id))
    .returning();

  if (!sweet) throw new Error("Sweet not found");
  return sweet;
}

export async function searchSweets(filters: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const conditions = [];

  if (filters.name) {
    conditions.push(ilike(sweets.name, `%${filters.name}%`));
  }

  if (filters.category) {
    conditions.push(ilike(sweets.category, `%${filters.category}%`));
  }

  if (filters.minPrice !== undefined) {
    conditions.push(gte(sweets.price, filters.minPrice.toString()));
  }

  if (filters.maxPrice !== undefined) {
    conditions.push(lte(sweets.price, filters.maxPrice.toString()));
  }

  return db
    .select()
    .from(sweets)
    .where(conditions.length ? and(...conditions) : undefined);
}
