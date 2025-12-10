import { all, get } from "../db/connection.js";

export const getSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const totals =
      (await get(
        `SELECT
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income
        FROM transactions
        WHERE userId = ? AND strftime('%Y-%m', date) = ?`,
        [req.userId, month]
      )) || {};

    const expensesByCategory = await all(
      `SELECT c.id, c.name, c.color, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON c.id = t.categoryId
       WHERE t.userId = ? AND t.type = 'expense' AND strftime('%Y-%m', t.date) = ?
       GROUP BY c.id, c.name, c.color
       ORDER BY total DESC`,
      [req.userId, month]
    );

    const budgetUsage = await all(
      `SELECT b.id, b.categoryId, c.name, b.amount as budget,
        IFNULL(SUM(t.amount), 0) as spent
       FROM budgets b
       JOIN categories c ON c.id = b.categoryId
       LEFT JOIN transactions t ON t.categoryId = b.categoryId
        AND t.userId = b.userId
        AND t.type = 'expense'
        AND strftime('%Y-%m', t.date) = b.month
       WHERE b.userId = ? AND b.month = ?
       GROUP BY b.id, b.categoryId, c.name, b.amount`,
      [req.userId, month]
    );

    const totalExpenses = totals.expenses || 0;
    const totalIncome = totals.income || 0;

    res.json({
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      budgetUsage: budgetUsage.map((b) => ({
        ...b,
        remaining: b.budget - b.spent,
      })),
    });
  } catch (err) {
    next(err);
  }
};
