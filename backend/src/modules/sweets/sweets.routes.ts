import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import {
  create,
  list,
  update,
  remove,
  search,
} from "./sweets.controller";
import { db } from "../../db";
import { sweets } from "../../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.get("/search", search);

router.post("/", requireAdmin, create);
router.put("/:id", requireAdmin, update);
router.delete("/:id", requireAdmin, remove);
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const sweet = await db
    .select()
    .from(sweets)
    .where(eq(sweets.id, id))
    .limit(1);

  if (!sweet.length) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  res.json(sweet[0]);
});

export default router;
