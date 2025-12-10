import { Router } from "express";
import {
  addTransaction,
  editTransaction,
  listTransactions,
  removeTransaction,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listTransactions);
router.post("/", addTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", removeTransaction);

export default router;
