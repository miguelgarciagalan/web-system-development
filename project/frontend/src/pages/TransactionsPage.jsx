import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const blankForm = {
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  categoryId: "",
  type: "expense",
  description: "",
};

const TransactionsPage = ({ apiUrl, token }) => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [monthFilter, setMonthFilter] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [error, setError] = useState("");
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
    if (res.ok) setCategories(data);
  };

  const loadTransactions = async () => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/transactions?month=${monthFilter}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) setTransactions(data);
  };

  useEffect(() => {
    loadCategories();
  }, [apiUrl, token]);

  useEffect(() => {
    loadTransactions();
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
      ? `${apiUrl}/transactions/${editingId}`
      : `${apiUrl}/transactions`;

    const res = await fetch(url, {
      method,
      headers: authHeaders,
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        categoryId: Number(form.categoryId),
      }),
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) {
      setForm(blankForm);
      setEditingId(null);
      loadTransactions();
    } else {
      setError(data.error || "No se pudo guardar");
    }
  };

  const handleEdit = (tx) => {
    setForm({
      amount: tx.amount,
      date: tx.date,
      categoryId: tx.categoryId,
      type: tx.type,
      description: tx.description,
    });
    setEditingId(tx.id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    loadTransactions();
  };

  return (
    <main className="page">
      <h1>Transactions</h1>
      <div className="grid two">
        <section className="card" aria-labelledby="tx-form-heading">
          <h2 id="tx-form-heading" style={{ marginTop: 0 }}>
            {editingId ? "Edit transaction" : "Add transaction"}
          </h2>
          {error && (
            <div className="error-text" style={{ marginBottom: 6 }}>
              {error}
            </div>
          )}
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="inputs-row">
              <div className="form-field">
                <label htmlFor="tx-amount">Amount</label>
                <input
                  id="tx-amount"
                  type="number"
                  name="amount"
                  step="0.01"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="tx-date">Date</label>
                <input
                  id="tx-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="inputs-row">
              <div className="form-field">
                <label htmlFor="tx-category">Category</label>
                <select
                  id="tx-category"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="tx-type">Type</label>
                <select
                  id="tx-type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="tx-desc">Description</label>
              <textarea
                id="tx-desc"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details"
              />
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
                    setForm(blankForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card" aria-labelledby="tx-list-heading">
          <div className="section-head" style={{ marginBottom: 8 }}>
            <h2 id="tx-list-heading" style={{ margin: 0 }}>
              Transactions
            </h2>
            <div className="form-field" style={{ minWidth: 180, margin: 0 }}>
              <label htmlFor="tx-month">Filter by month</label>
              <input
                id="tx-month"
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              />
            </div>
          </div>
          {loading && <p className="muted">Loading...</p>}
          {!loading && transactions.length === 0 && (
            <p className="empty">No transactions this month.</p>
          )}
          <div className="list" aria-live="polite">
            {transactions.map((tx) => {
              const categoryName =
                categories.find((c) => c.id === tx.categoryId)?.name || "Category";
              return (
                <article
                  key={tx.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 12,
                    background: "var(--panel-soft)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>
                        ${Number(tx.amount).toFixed(2)}{" "}
                        <span className="muted">
                          • {tx.type} • {tx.date}
                        </span>
                      </p>
                      <p className="muted" style={{ margin: "0 0 6px" }}>
                        {categoryName}
                      </p>
                      {tx.description && <p style={{ margin: 0 }}>{tx.description}</p>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn secondary small" onClick={() => handleEdit(tx)}>
                        Edit
                      </button>
                      <button
                        className="btn secondary small"
                        onClick={() => handleDelete(tx.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TransactionsPage;
