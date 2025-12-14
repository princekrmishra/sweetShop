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

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.get("/search", search);

router.post("/", requireAdmin, create);
router.put("/:id", requireAdmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
