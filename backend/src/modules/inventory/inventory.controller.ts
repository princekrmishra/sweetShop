import { Request, Response } from "express";
import { purchaseSchema, restockSchema } from "./inventory.schema";
import { purchaseSweet, restockSweet } from "./inventory.service";

export async function purchase(req: Request, res: Response) {
  try {
    const { quantity } = purchaseSchema.parse(req.body);
    const sweet = await purchaseSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function restock(req: Request, res: Response) {
  try {
    const { quantity } = restockSchema.parse(req.body);
    const sweet = await restockSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
