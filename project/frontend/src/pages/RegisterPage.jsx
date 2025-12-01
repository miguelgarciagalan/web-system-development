// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const { register, setError, error } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError('');

    if (!name || !email || !password) {
      setLocalError('Completa todos los campos');
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);
      navigate('/calendar', { replace: true });
    } catch (err) {
      setLocalError('No se pudo registrar, prueba con otro email');
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
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Crea tu cuenta</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Nombre
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </label>
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
            {submitting ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
