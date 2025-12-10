# ExpenseFlow – Personal Finance & Budget Tracker

ExpenseFlow is a full-stack web app to track income, expenses, categories, and monthly budgets with a simple dashboard summary.

## Features
- User registration and login with JWT.
- CRUD for categories (income/expense).
- CRUD for transactions with filters by month/category/type.
- CRUD for monthly budgets on expense categories.
- Dashboard summary: totals, balance, expenses by category, budget usage.

## Tech Stack
- Frontend: React (Vite), react-router-dom, fetch, CSS.
- Backend: Node.js, Express, sqlite3, bcrypt, jsonwebtoken, dotenv, cors.
- Database: SQLite (schema in `docs/database.sql`).

## Local Setup
1. Clone the repo.
2. Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env  # ajusta variables
   npm start
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Open the frontend dev URL (Vite) and ensure `frontend/.env` points to the backend API.

## Environment Variables
- Backend (`backend/.env`):
  - `PORT` (e.g., 3001)
  - `JWT_SECRET`
  - `DB_FILE` (e.g., `./database.sqlite`)
- Frontend (`frontend/.env`):
  - `VITE_API_URL` (e.g., `http://localhost:3001/api`)

## Database Schema / ER
- Tables: users, categories, transactions, budgets.
- Relations:
  - users 1–* categories
  - users 1–* transactions (with category FK)
  - users 1–* budgets (with category FK)
- Schema SQL: see `docs/database.sql`.

## API Documentation (quick view)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Categories: `GET/POST/PUT/DELETE /api/categories`
- Transactions: `GET/POST/PUT/DELETE /api/transactions` (filters: `month`, `categoryId`, `type`)
- Budgets: `GET/POST/PUT/DELETE /api/budgets` (filter: `month`)
- Dashboard: `GET /api/dashboard/summary?month=YYYY-MM`
Headers (private routes): `Authorization: Bearer <token>`

