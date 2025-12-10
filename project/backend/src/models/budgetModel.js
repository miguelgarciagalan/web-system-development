import { all, run } from "../db/connection.js";

export const getBudgetsByMonth = (userId, month) =>
  all(
    "SELECT * FROM budgets WHERE userId = ? AND month = ? ORDER BY id DESC",
    [userId, month]
  );

export const createBudget = ({ userId, categoryId, month, amount }) =>
  run(
    "INSERT INTO budgets (userId, categoryId, month, amount) VALUES (?, ?, ?, ?)",
    [userId, categoryId, month, amount]
  ).then((result) => ({
    id: result.id,
    userId,
    categoryId,
    month,
    amount,
  }));

export const updateBudget = (id, userId, { categoryId, month, amount }) =>
  run(
    "UPDATE budgets SET categoryId = ?, month = ?, amount = ? WHERE id = ? AND userId = ?",
    [categoryId, month, amount, id, userId]
  ).then((result) => result.changes);

export const deleteBudget = (id, userId) =>
  run("DELETE FROM budgets WHERE id = ? AND userId = ?", [id, userId]).then(
    (result) => result.changes
  );
