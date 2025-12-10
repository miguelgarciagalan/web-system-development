import {
  createBudget,
  deleteBudget,
  getBudgetsByMonth,
  updateBudget,
} from "../models/budgetModel.js";
import { getCategoryById } from "../models/categoryModel.js";

export const listBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }
    const budgets = await getBudgetsByMonth(req.userId, month);
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

export const addBudget = async (req, res, next) => {
  try {
    const { categoryId, month, amount } = req.body;
    if (!categoryId || !month || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }
    const category = await getCategoryById(categoryId, req.userId);
    if (!category || category.type !== "expense") {
      return res.status(400).json({ error: "Budget needs an expense category" });
    }
    const budget = await createBudget({
      userId: req.userId,
      categoryId,
      month,
      amount,
    });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
};

export const editBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryId, month, amount } = req.body;
    if (!categoryId || !month || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const category = await getCategoryById(categoryId, req.userId);
    if (!category || category.type !== "expense") {
      return res.status(400).json({ error: "Budget needs an expense category" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }
    const changes = await updateBudget(id, req.userId, {
      categoryId,
      month,
      amount,
    });
    if (!changes) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const removeBudget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = await deleteBudget(id, req.userId);
    if (!changes) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
