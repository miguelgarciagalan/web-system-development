import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const empty = {
  month: new Date().toISOString().slice(0, 7),
  categoryId: "",
  amount: "",
};

const BudgetsPage = ({ apiUrl, token }) => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [monthFilter, setMonthFilter] = useState(empty.month);
  const [error, setError] = useState("");
  const [monthExpenses, setMonthExpenses] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadCategories = async () => {
    const res = await fetch(`${apiUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) setCategories(data.filter((c) => c.type === "expense"));
  };

  const loadBudgets = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/budgets?month=${monthFilter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) {
      setBudgets(data);
      await loadSpendingForMonth();
    }
  };

  const loadSpendingForMonth = async () => {
    const res = await fetch(`${apiUrl}/transactions?month=${monthFilter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    const tx = await res.json();
    const sums = tx.reduce((acc, t) => {
      if (t.type === "expense") {
        const key = t.categoryId;
        acc[key] = (acc[key] || 0) + Number(t.amount);
      }
      return acc;
    }, {});
    setMonthExpenses(sums);
  };

  useEffect(() => {
    loadCategories();
  }, [apiUrl, token]);

  useEffect(() => {
    loadBudgets();
  }, [apiUrl, token, monthFilter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (Number(form.amount) <= 0) {
      setError("Amount must be positive");
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${apiUrl}/budgets/${editingId}`
      : `${apiUrl}/budgets`;
    const res = await fetch(url, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        ...form,
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
      }),
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) {
      setForm({ ...empty, month: monthFilter });
      setEditingId(null);
      loadBudgets();
    } else {
      setError(data.error || "No se pudo guardar");
    }
  };

  const handleEdit = (b) => {
    setForm({
      month: b.month,
      categoryId: b.categoryId,
      amount: b.amount,
    });
    setEditingId(b.id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}/budgets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    loadBudgets();
  };

  return (
    <main className="page">
      <h1>Budgets</h1>
      <div className="grid two">
        <section className="card" aria-labelledby="budget-form-heading">
          <h2 id="budget-form-heading" style={{ marginTop: 0 }}>
            {editingId ? "Edit budget" : "Add budget"}
          </h2>
          {error && (
            <div className="error-text" style={{ marginBottom: 6 }}>
              {error}
            </div>
          )}
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="inputs-row">
              <div className="form-field">
                <label htmlFor="budget-month">Month</label>
                <input
                  id="budget-month"
                  type="month"
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="budget-amount">Amount</label>
                <input
                  id="budget-amount"
                  type="number"
                  name="amount"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="budget-category">Expense category</label>
              <select
                id="budget-category"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select expense category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" type="submit">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...empty, month: monthFilter });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="budget-list-heading">
          <div className="section-head" style={{ marginBottom: 8 }}>
            <h2 id="budget-list-heading" style={{ margin: 0 }}>
              Budgets
            </h2>
            <div className="form-field" style={{ minWidth: 180, margin: 0 }}>
              <label htmlFor="budget-month-filter">Filter by month</label>
              <input
                id="budget-month-filter"
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="list" aria-live="polite">
            {loading && <p className="muted">Loading...</p>}
            {!loading &&
              budgets.map((b) => {
                const categoryName =
                  categories.find((c) => c.id === b.categoryId)?.name || "Category";
                const spent = monthExpenses[b.categoryId] || 0;
                const percent = b.amount
                  ? Math.min(100, Math.round((spent / b.amount) * 100))
                  : 0;
                const over = spent > b.amount;
                return (
                  <article
                    key={b.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--panel-soft)",
                    }}
                  >
                    <div>
                      <strong>{categoryName}</strong>
                      <p className="muted" style={{ margin: "4px 0" }}>
                        {b.month} • Budget ${Number(b.amount).toFixed(2)} • Spent $
                        {spent.toFixed(2)}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 6px",
                          color: over ? "#ef4444" : "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        {over ? "Over budget" : "Within budget"}
                      </p>
                      <div
                        style={{
                          height: 10,
                          background: "#e8eef7",
                          borderRadius: 999,
                          overflow: "hidden",
                          marginTop: 4,
                        }}
                        aria-label={`Spent ${percent}% of budget`}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: over ? "#ef4444" : "#3b82f6",
                            transition: "width 0.2s ease",
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn secondary small" onClick={() => handleEdit(b)}>
                        Edit
                      </button>
                      <button
                        className="btn secondary small"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            {!loading && budgets.length === 0 && (
              <p className="empty">No budgets for this month.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BudgetsPage;
