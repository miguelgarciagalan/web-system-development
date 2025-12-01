// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const { login, setError, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError('');

    if (!email || !password) {
      setLocalError('Ingresa email y contraseña');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/calendar', { replace: true });
    } catch (err) {
      setLocalError('Credenciales incorrectas');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="calendar-title" style={{ marginBottom: '0.25rem' }}>
          StudyCalendar
        </h1>
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Inicia sesión</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Email
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </label>
          <label className="form-label">
            Contraseña
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </label>
          {(localError || error) && (
            <p className="error-text">{localError || error}</p>
          )}
          <button type="submit" className="form-submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
