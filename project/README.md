# ExpenseFlow – Personal Finance & Budget Tracker

ExpenseFlow is a full-stack web application that allows users to manage their personal finances by tracking income, expenses, categories, and monthly budgets. The application provides a clear dashboard with financial summaries to help users understand their spending habits.

---

## Project Description and Features

ExpenseFlow is designed to solve a common problem: users often do not know exactly how much they spend or where their money goes. This application centralizes all financial information in one place and presents it in a clear and accessible way.

### Main features:
- User authentication using JWT (register, login, logout).
- Full CRUD operations for categories (income and expense), including color selection.
- Full CRUD operations for transactions with filters by:
  - Month
  - Category
  - Type (income or expense)
- Full CRUD operations for monthly budgets per expense category.
- Dashboard with:
  - Total income
  - Total expenses
  - Balance
  - Expenses grouped by category
  - Budget usage and progress

---

## Technology Stack

### Frontend
- React (Vite)
- react-router-dom
- Fetch API
- CSS

### Backend
- Node.js
- Express
- sqlite3
- bcrypt
- jsonwebtoken
- dotenv
- cors

### Database
- SQLite  
- SQL schema located in `docs/database.sql`

---

## Local Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd web-system-development/project
2. Backend setup
bash
cd backend
npm install
cp .env.example .env
npm start
The backend API will run on the port defined in the .env file.

3. Frontend setup
bash
cd frontend
npm install
cp .env.example .env
npm run dev
Vite will display the local development URL in the terminal.

Make sure that frontend/.env points to the backend API:

bash
VITE_API_URL=http://localhost:<PORT>/api
Environment Variables Needed
Backend (backend/.env)
PORT
Example: 3001

JWT_SECRET
Secret key used to sign JWT tokens.

DB_FILE
Example: ./database.sqlite

Frontend (frontend/.env)
VITE_API_URL
Example: http://localhost:3001/api

Database Schema / ER Diagram
Tables
users

categories

transactions

budgets

Relationships
One user can have many categories.

One user can have many transactions.

One user can have many budgets.

Transactions belong to a category.

Budgets belong to a category.

All relationships are enforced using foreign keys to ensure data integrity.

The SQL schema is defined in:

pgsql
Copiar código
docs/database.sql
This script is executed automatically when the backend starts.

API Documentation
Authentication
POST /api/auth/register
Registers a new user.

POST /api/auth/login
Logs in a user and returns a JWT token.

Categories
GET /api/categories

POST /api/categories

PUT /api/categories/:id

DELETE /api/categories/:id

Transactions
GET /api/transactions
Optional query parameters:

month

categoryId

type

POST /api/transactions

PUT /api/transactions/:id

DELETE /api/transactions/:id

Budgets
GET /api/budgets
Optional query parameter:

month

POST /api/budgets

PUT /api/budgets/:id

DELETE /api/budgets/:id

Dashboard
GET /api/dashboard/summary?month=YYYY-MM
Returns aggregated data for the selected month:

Total income

Total expenses

Balance

Expenses by category

Budget usage

Authorization Header (Protected Routes)
All private routes require the following header:

makefile
Authorization: Bearer <token>
Useful Scripts
Backend
npm start – Start the API in production mode

npm run dev – Start the API with nodemon (development)

Frontend
npm run dev – Start the development server

npm run build – Build the production version

npm run preview – Preview the production build

Live Demo
Frontend: https://web-system-development.vercel.app

Backend API: https://web-system-development.onrender.com/api
