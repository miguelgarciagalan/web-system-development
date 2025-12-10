import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const privateRoute = (element) =>
    token ? element : <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      {token && <Navbar onLogout={() => setToken(null)} />}
      <main id="main-content">
        <Routes>
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage apiUrl={API_URL} onLogin={setToken} />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterPage apiUrl={API_URL} onRegister={setToken} />
              )
            }
          />
          <Route
            path="/"
            element={privateRoute(
              <DashboardPage apiUrl={API_URL} token={token} />
            )}
          />
          <Route
            path="/transactions"
            element={privateRoute(
              <TransactionsPage apiUrl={API_URL} token={token} />
            )}
          />
          <Route
            path="/categories"
            element={privateRoute(
              <CategoriesPage apiUrl={API_URL} token={token} />
            )}
          />
          <Route
            path="/budgets"
            element={privateRoute(
              <BudgetsPage apiUrl={API_URL} token={token} />
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
