import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../models/categoryModel.js";

export const listCategories = async (req, res, next) => {
  try {
    const categories = await getCategories(req.userId);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const { name, type, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }
    if (!["expense", "income"].includes(type)) {
      return res.status(400).json({ error: "Invalid category type" });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: "Name is too short" });
    }
    const category = await createCategory({
      userId: req.userId,
      name,
      type,
      color: color || "#666666",
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { name, type, color } = req.body;
    const { id } = req.params;
    const exists = await getCategoryById(id, req.userId);
    if (!exists) {
      return res.status(404).json({ error: "Category not found" });
    }
    if (!["expense", "income"].includes(type)) {
      return res.status(400).json({ error: "Invalid category type" });
    }
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name is too short" });
    }
    await updateCategory(id, req.userId, { name, type, color });
    const updated = await getCategoryById(id, req.userId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = await deleteCategory(id, req.userId);
    if (!changes) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
