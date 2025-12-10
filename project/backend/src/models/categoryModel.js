import { all, get, run } from "../db/connection.js";

export const getCategories = (userId) =>
  all("SELECT * FROM categories WHERE userId = ? ORDER BY name", [userId]);

export const createCategory = ({ userId, name, type, color }) =>
  run(
    "INSERT INTO categories (userId, name, type, color) VALUES (?, ?, ?, ?)",
    [userId, name, type, color]
  ).then((result) => ({
    id: result.id,
    userId,
    name,
    type,
    color,
  }));

export const updateCategory = (id, userId, { name, type, color }) =>
  run(
    "UPDATE categories SET name = ?, type = ?, color = ? WHERE id = ? AND userId = ?",
    [name, type, color, id, userId]
  ).then((result) => result.changes);

export const deleteCategory = (id, userId) =>
  run("DELETE FROM categories WHERE id = ? AND userId = ?", [id, userId]).then(
    (result) => result.changes
  );

export const getCategoryById = (id, userId) =>
  get("SELECT * FROM categories WHERE id = ? AND userId = ?", [id, userId]);
