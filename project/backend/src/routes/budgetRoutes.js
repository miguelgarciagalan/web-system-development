import { Router } from "express";
import {
  addBudget,
  editBudget,
  listBudgets,
  removeBudget,
} from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listBudgets);
router.post("/", addBudget);
router.put("/:id", editBudget);
router.delete("/:id", removeBudget);

export default router;
