import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.json({ message: "ExpenseFlow backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
