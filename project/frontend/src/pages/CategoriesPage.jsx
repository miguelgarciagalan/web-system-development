import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const empty = { name: "", type: "expense", color: "#22c55e" };

const CategoriesPage = ({ apiUrl, token }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCategories = async () => {
    setError("");
    setLoading(true);
    const res = await fetch(`${apiUrl}/categories`, {
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
      setCategories(data);
    } else {
      setError(data.error || "No se pudo cargar");
    }
  };

  useEffect(() => {
    loadCategories();
  }, [apiUrl, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) {
      setError("Name is too short");
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${apiUrl}/categories/${editingId}`
      : `${apiUrl}/categories`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    if (res.ok) {
      setForm(empty);
      setEditingId(null);
      loadCategories();
    } else {
      setError(data.error || "No se pudo guardar");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, type: cat.type, color: cat.color || "#22c55e" });
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    loadCategories();
  };

  return (
    <main className="page">
      <h1>Categories</h1>
      <div className="grid two">
        <section className="card" aria-labelledby="cat-form-heading">
          <h2 id="cat-form-heading" style={{ marginTop: 0 }}>
            {editingId ? "Edit category" : "Add category"}
          </h2>
          {error && (
            <div className="error-text" style={{ marginBottom: 6 }}>
              {error}
            </div>
          )}
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="cat-name">Name</label>
              <input
                id="cat-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="inputs-row">
              <div className="form-field">
                <label htmlFor="cat-type">Type</label>
                <select
                  id="cat-type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="cat-color">Color</label>
                <input
                  id="cat-color"
                  name="color"
                  type="color"
                  value={form.color}
                  onChange={handleChange}
                  aria-label="Category color"
                />
              </div>
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
                    setForm(empty);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
        <section className="card" aria-labelledby="cat-list-heading">
          <h2 id="cat-list-heading" style={{ marginTop: 0 }}>
            Categories
          </h2>
          <div className="list">
            {loading && <p className="muted">Loading...</p>}
            {!loading &&
              categories.map((cat) => (
                <article
                  key={cat.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--panel-soft)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: cat.color || "#22c55e",
                      }}
                    />
                    <div>
                      <strong>{cat.name}</strong>
                      <p className="muted" style={{ margin: "2px 0 0" }}>
                        {cat.type}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn secondary small" onClick={() => handleEdit(cat)}>
                      Edit
                    </button>
                    <button className="btn secondary small" onClick={() => handleDelete(cat.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            {!loading && categories.length === 0 && (
              <p className="empty">No categories yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default CategoriesPage;
