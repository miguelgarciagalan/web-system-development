import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../models/transactionModel.js";
import { getCategoryById } from "../models/categoryModel.js";

export const listTransactions = async (req, res, next) => {
  try {
    const { month, categoryId, type } = req.query;
    const transactions = await getTransactions(req.userId, {
      month,
      categoryId,
      type,
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

export const addTransaction = async (req, res, next) => {
  try {
    const { categoryId, amount, type, date, description } = req.body;
    if (!categoryId || !amount || !type || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }
    if (!["expense", "income"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    const category = await getCategoryById(categoryId, req.userId);
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (category.type !== type) {
      return res.status(400).json({ error: "Type must match category" });
    }
    const transaction = await createTransaction({
      userId: req.userId,
      categoryId,
      amount,
      type,
      date,
      description: description || "",
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

export const editTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryId, amount, type, date, description } = req.body;
    if (!categoryId || !amount || !type || !date) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }
    const category = await getCategoryById(categoryId, req.userId);
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (category.type !== type) {
      return res.status(400).json({ error: "Type must match category" });
    }
    if (!["expense", "income"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    const changes = await updateTransaction(id, req.userId, {
      categoryId,
      amount,
      type,
      date,
      description: description || "",
    });
    if (!changes) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const removeTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = await deleteTransaction(id, req.userId);
    if (!changes) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
