// src/App.jsx
import { Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TimerPage from './pages/TimerPage.jsx';
import CalculatorPage from './pages/CalculatorPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import TimerWidget from './components/TimerWidget.jsx';
import './styles/Calendar.css';

const App = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="app-loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/calendar" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={token ? <AuthedShell /> : <Navigate to="/login" replace />}
        >
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Route>
      </Routes>
    </div>
  );
};

const AuthedShell = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <nav className="main-nav">
        <div className="nav-left">
          <span className="nav-brand">StudyCalendar</span>
          <Link className="nav-link" to="/calendar">
            Calendario / Lista
          </Link>
        </div>
        <div className="nav-right">
          {user && <span className="nav-user">Hola, {user.name}</span>}
          <Link className="nav-link" to="/timer">
            Timer
          </Link>
          <Link className="nav-link" to="/calculator">
            Calculadora
          </Link>
          <button className="nav-link nav-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <TimerWidget />
      <Outlet />
    </div>
  );
};

export default App;
