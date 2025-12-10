# ExpenseFlow Architecture

ExpenseFlow is a small full-stack app that tracks personal income, expenses, and budgets.

## Backend
- Node.js + Express, one app in `backend/src/app.js`.
- SQLite database (`sqlite3`) with helpers in `db/connection.js` and schema setup in `db/initDb.js`.
- Models wrap queries for users, categories, transactions, and budgets.
- Controllers hold logic and are wired through feature routes (`/api/auth`, `/api/categories`, `/api/transactions`, `/api/budgets`, `/api/dashboard`).
- JWT auth middleware protects private routes; errors flow through a basic handler.

## Frontend
- React (Vite) single-page app in `frontend/src`.
- Routing with `react-router-dom` for login/register plus dashboard, categories, transactions, and budgets pages.
- Navbar persists while logged in; token stored in `localStorage`.
- Fetch API talks to the backend using the `VITE_API_URL` base.

## Database
- SQLite tables: users, categories, transactions, budgets (see `docs/database.sql`).
- Foreign keys keep records tied to the owner; budgets link to expense categories.
- Transactions store amount, date, type, and category; budgets store month and amount.

## Flow
1. User registers or logs in; backend returns a JWT.
2. Frontend saves the token and includes it on every private request.
3. Categories and transactions are created and fetched per user.
4. Budgets are set per expense category and month.
5. Dashboard aggregates totals, category spend, and budget usage for the selected month.
