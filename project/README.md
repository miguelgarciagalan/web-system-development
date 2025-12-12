# ExpenseFlow – Personal Finance & Budget Tracker

ExpenseFlow is a full-stack app to track income, expenses, categories, and monthly budgets, with a dashboard summary.

## Features
- JWT authentication (register, login, logout).
- CRUD for categories (income/expense) with color.
- CRUD for transactions with filters by month/category/type.
- CRUD for monthly budgets per expense category.
- Dashboard: totals, balance, expenses by category, budget usage.

## Quick Architecture
docs/                 Documentation (API, architecture, SQL schema)
backend/              Express + SQLite API
  src/
    db/               connection and schema bootstrap
    models/           parameterized queries
    controllers/      business logic
    routes/           resource-based routes
    middleware/       JWT auth, logger, errors
frontend/             React + Vite SPA
  src/
    pages/            views (Login, Register, Dashboard, CRUD)
    components/       Navbar, global styles

## Tech Stack
- Frontend: React (Vite), react-router-dom, fetch, CSS.
- Backend: Node.js, Express, sqlite3, bcrypt, jsonwebtoken, dotenv, cors.
- Database: SQLite (schema in `docs/database.sql`).

## Local Setup
1) Clone the repo.
2) Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env   # set your values
   npm start              # API on PORT
  Frontend:
   ```bash
    cd frontend
    npm install
    cp .env.example .env   # create and set VITE_API_URL
    npm run dev            # Vite will show the URL

Open the Vite URL and ensure frontend/.env points to the backend (http://localhost:<PORT>/api).

## Environment Variables
Backend (backend/.env):
PORT (e.g., 3001)
JWT_SECRET
DB_FILE (e.g., ./database.sqlite)
Frontend (frontend/.env):
VITE_API_URL (e.g., http://localhost:3001/api)
Database (schema / ER)
Tables: users, categories, transactions, budgets.
Relations:
users 1–* categories
users 1–* transactions (FK to categories)
users 1–* budgets (FK to categories)
SQL script: docs/database.sql (runs on backend start).

## API (summary)
Auth: POST /api/auth/register, POST /api/auth/login
Categories: GET/POST/PUT/DELETE /api/categories
Transactions: GET/POST/PUT/DELETE /api/transactions (filters: month, categoryId, type)
Budgets: GET/POST/PUT/DELETE /api/budgets (filter: month)
Dashboard: GET /api/dashboard/summary?month=YYYY-MM
Headers for private routes: Authorization: Bearer <token>

## Useful Scripts
Backend: npm start (prod), npm run dev (nodemon).
Frontend: npm run dev, npm run build, npm run preview.

