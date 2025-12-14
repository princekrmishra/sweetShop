import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireAdmin } from "../../middlewares/requireAdmin";
import { purchase, restock } from "./inventory.controller";

const router = Router();

router.post(
  "/sweets/:id/purchase",
  requireAuth,
  purchase
);

router.post(
  "/sweets/:id/restock",
  requireAuth,
  requireAdmin,
  restock
);

export default router;
