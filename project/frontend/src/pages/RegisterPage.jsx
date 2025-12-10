import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = ({ apiUrl, onRegister }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      onRegister(data.token);
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
        aria-labelledby="register-heading"
      >
        <header>
          <h1 id="register-heading" style={{ margin: "0 0 6px" }}>
            Create account
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Start tracking your cash flow.
          </p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="form-grid"
          style={{ marginTop: 16 }}
        >
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 14 }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
