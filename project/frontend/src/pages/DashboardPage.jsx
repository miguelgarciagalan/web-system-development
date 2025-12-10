import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({ apiUrl, token }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    expensesByCategory: [],
    budgetUsage: [],
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      setError("");
      const res = await fetch(`${apiUrl}/dashboard/summary?month=${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || "No se pudo cargar");
      }
    };
    fetchSummary();
  }, [month, apiUrl, token, navigate]);

  return (
    <main className="page">
      <h1>Dashboard</h1>
      <section className="card" aria-labelledby="summary-heading">
        <div className="section-head">
          <h2 id="summary-heading" style={{ margin: 0 }}>
            Monthly summary
          </h2>
          <div className="form-field" style={{ minWidth: 180, margin: 0 }}>
            <label htmlFor="dashboard-month">Select month</label>
            <input
              id="dashboard-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginTop: 14,
          }}
          role="list"
        >
          <div className="subcard" role="listitem">
            <p className="muted" style={{ margin: 0 }}>
              Income
            </p>
            <h2 style={{ margin: "6px 0 0", color: "#3b82f6" }}>
              ${data.totalIncome?.toFixed(2)}
            </h2>
          </div>
          <div className="subcard" role="listitem">
            <p className="muted" style={{ margin: 0 }}>
              Expenses
            </p>
            <h2 style={{ margin: "6px 0 0", color: "#ef4444" }}>
              ${data.totalExpenses?.toFixed(2)}
            </h2>
          </div>
          <div className="subcard" role="listitem">
            <p className="muted" style={{ margin: 0 }}>
              Balance
            </p>
            <h2 style={{ margin: "6px 0 0", color: "#10b981" }}>
              ${data.balance?.toFixed(2)}
            </h2>
          </div>
        </div>
        {error && <div className="error-text" style={{ marginTop: 10 }}>{error}</div>}
      </section>

      <div className="grid two" style={{ marginTop: 16 }}>
        <section className="card" aria-labelledby="expense-cat-heading">
          <h2 id="expense-cat-heading" style={{ marginTop: 0 }}>
            Expenses by category
          </h2>
          {data.expensesByCategory.length === 0 && (
            <p className="empty" role="status">
              No expenses yet 😊
            </p>
          )}
          <div className="list">
            {(() => {
              const total =
                data.expensesByCategory.reduce(
                  (sum, c) => sum + Number(c.total || 0),
                  0
                ) || 1;
              return data.expensesByCategory.map((cat) => {
                const percent = Math.round((Number(cat.total) / total) * 100);
                return (
                  <div
                    key={cat.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "10px 12px",
                      background: "var(--panel-soft)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span
                          aria-hidden="true"
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: cat.color || "#3b82f6",
                          }}
                        />
                        <span>{cat.name}</span>
                      </span>
                      <strong>
                        ${Number(cat.total).toFixed(2)} ({percent}%)
                      </strong>
                    </div>
                    <div
                      style={{
                        height: 10,
                        background: "#e8eef7",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                      aria-label={`Category ${cat.name} ${percent}% of spending`}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: cat.color || "#3b82f6",
                          transition: "width 0.2s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>

        <section className="card" aria-labelledby="budgets-heading">
          <h2 id="budgets-heading" style={{ marginTop: 0 }}>
            Budgets
          </h2>
          {data.budgetUsage.length === 0 && (
            <p className="empty">No budgets set for this month.</p>
          )}
          <div className="list">
            {data.budgetUsage.map((b) => {
              const percent = b.budget
                ? Math.min(100, Math.round((b.spent / b.budget) * 100))
                : 0;
              return (
                <div key={b.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{b.name}</strong>
                      <p className="muted" style={{ margin: "4px 0" }}>
                        ${b.spent.toFixed(2)} / ${b.budget.toFixed(2)}
                      </p>
                    </div>
                    <span className="pill" aria-label={`Budget used ${percent}%`}>
                      {percent}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: "var(--panel-soft)",
                      borderRadius: 999,
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: "#22c55e",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
