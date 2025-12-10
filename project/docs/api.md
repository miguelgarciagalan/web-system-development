# ExpenseFlow API

Base URL: `/api` (example: `http://localhost:3000/api`)

Headers for private routes: `Authorization: Bearer <token>`

## Auth
- `POST /auth/register` — `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`

## Categories
- `GET /categories` → list user categories.
- `POST /categories` — `{ name, type, color }` → new category.
- `PUT /categories/:id` — update a category.
- `DELETE /categories/:id` — remove a category.

## Transactions
- `GET /transactions?month=YYYY-MM&categoryId=&type=` → list transactions (filters optional).
- `POST /transactions` — `{ amount, date, categoryId, type, description }`.
- `PUT /transactions/:id` — update a transaction.
- `DELETE /transactions/:id` — delete a transaction.

## Budgets
- `GET /budgets?month=YYYY-MM` → budgets for a month.
- `POST /budgets` — `{ categoryId, month, amount }`.
- `PUT /budgets/:id` — update a budget.
- `DELETE /budgets/:id` — delete a budget.

## Dashboard
- `GET /dashboard/summary?month=YYYY-MM`
  - Returns `{ totalExpenses, totalIncome, balance, expensesByCategory, budgetUsage }`
  - `budgetUsage` items include `{ id, categoryId, name, budget, spent, remaining }`.
