import { Router } from "express";
import {
  addCategory,
  editCategory,
  listCategories,
  removeCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listCategories);
router.post("/", addCategory);
router.put("/:id", editCategory);
router.delete("/:id", removeCategory);

export default router;
