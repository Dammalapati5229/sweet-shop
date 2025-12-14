import { Router } from "express";
import {
  getAllSweets,
  searchSweets,
  addSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
  purchaseSweet,
} from "./sweets.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", getAllSweets);

router.get("/search", searchSweets);

router.post("/:id/purchase", authenticate, purchaseSweet);

router.post("/", authenticate, adminOnly, addSweet);

router.put("/:id", authenticate, adminOnly, updateSweet);

router.delete("/:id", authenticate, adminOnly, deleteSweet);

router.post("/:id/restock", authenticate, adminOnly, restockSweet);

export default router;
