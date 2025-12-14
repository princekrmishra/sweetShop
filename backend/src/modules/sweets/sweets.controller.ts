import { Request, Response } from "express";
import {
  createSweetSchema,
  updateSweetSchema,
  searchSweetSchema,
} from "./sweets.schema";
import {
  createSweet,
  getAllSweets,
  updateSweet,
  deleteSweet,
  searchSweets,
} from "./sweets.service";

export async function create(req: Request, res: Response) {
  try {
    const data = createSweetSchema.parse(req.body);
    const sweet = await createSweet(data);
    res.status(201).json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function list(_: Request, res: Response) {
  const sweets = await getAllSweets();
  res.json(sweets);
}

export async function update(req: Request, res: Response) {
  try {
    const data = updateSweetSchema.parse(req.body);
    const sweet = await updateSweet(req.params.id, data);
    res.json(sweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const sweet = await deleteSweet(req.params.id);
    res.json(sweet);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function search(req: Request, res: Response) {
  try {
    const filters = searchSweetSchema.parse(req.query);
    const sweets = await searchSweets(filters);
    res.json(sweets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
