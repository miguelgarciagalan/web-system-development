import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ apiUrl, onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      onLogin(data.token);
      navigate("/");
    } catch (_err) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <main className="page">
      <section
        className="card"
        style={{ maxWidth: 460, margin: "60px auto" }}
        aria-labelledby="login-heading"
      >
        <header>
          <h1 id="login-heading" style={{ margin: "0 0 6px" }}>
            Log in
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Sign in to manage your spending.
          </p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="form-grid"
          style={{ marginTop: 16 }}
        >
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14 }}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
