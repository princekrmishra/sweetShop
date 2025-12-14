import { db } from "../../db";
import { sweets } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

export async function purchaseSweet(sweetId: string, qty: number) {
  return db.transaction(async (tx) => {
    const [sweet] = await tx
      .select()
      .from(sweets)
      .where(eq(sweets.id, sweetId))
      .limit(1);

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    if (sweet.quantity < qty) {
      throw new Error("Insufficient stock");
    }

    const [updated] = await tx
      .update(sweets)
      .set({
        quantity: sql`${sweets.quantity} - ${qty}`,
        updatedAt: new Date(),
      })
      .where(eq(sweets.id, sweetId))
      .returning();

    return updated;
  });
}

export async function restockSweet(sweetId: string, qty: number) {
  return db.transaction(async (tx) => {
    const [sweet] = await tx
      .select()
      .from(sweets)
      .where(eq(sweets.id, sweetId))
      .limit(1);

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    const [updated] = await tx
      .update(sweets)
      .set({
        quantity: sql`${sweets.quantity} + ${qty}`,
        updatedAt: new Date(),
      })
      .where(eq(sweets.id, sweetId))
      .returning();

    return updated;
  });
}
