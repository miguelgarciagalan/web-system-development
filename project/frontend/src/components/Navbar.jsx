import { Link, useLocation } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  const { pathname } = useLocation();
  const isActive = (path) => (pathname === path ? "nav-link active" : "nav-link");

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          aria-label="ExpenseFlow home"
        >
          <span className="avatar" aria-hidden="true">
            E
          </span>
          <div className="brand">ExpenseFlow</div>
        </div>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link className={isActive("/")} to="/">
            Dashboard
          </Link>
          <Link className={isActive("/transactions")} to="/transactions">
            Transactions
          </Link>
          <Link className={isActive("/categories")} to="/categories">
            Categories
          </Link>
          <Link className={isActive("/budgets")} to="/budgets">
            Budgets
          </Link>
          <button className="btn secondary small" type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
