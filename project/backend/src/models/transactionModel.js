import { all, run } from "../db/connection.js";

export const getTransactions = (userId, { month, categoryId, type } = {}) => {
  let sql = "SELECT * FROM transactions WHERE userId = ?";
  const params = [userId];

  if (month) {
    sql += " AND strftime('%Y-%m', date) = ?";
    params.push(month);
  }

  if (categoryId) {
    sql += " AND categoryId = ?";
    params.push(categoryId);
  }

  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }

  sql += " ORDER BY date DESC";
  return all(sql, params);
};

export const createTransaction = ({
  userId,
  categoryId,
  amount,
  type,
  date,
  description,
}) =>
  run(
    "INSERT INTO transactions (userId, categoryId, amount, type, date, description) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, categoryId, amount, type, date, description]
  ).then((result) => ({
    id: result.id,
    userId,
    categoryId,
    amount,
    type,
    date,
    description,
  }));

export const updateTransaction = (
  id,
  userId,
  { categoryId, amount, type, date, description }
) =>
  run(
    "UPDATE transactions SET categoryId = ?, amount = ?, type = ?, date = ?, description = ? WHERE id = ? AND userId = ?",
    [categoryId, amount, type, date, description, id, userId]
  ).then((result) => result.changes);

export const deleteTransaction = (id, userId) =>
  run("DELETE FROM transactions WHERE id = ? AND userId = ?", [id, userId]).then(
    (result) => result.changes
  );
