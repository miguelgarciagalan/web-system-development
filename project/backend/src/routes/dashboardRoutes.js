import { Router } from "express";
import { getSummary } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/summary", getSummary);

export default router;
