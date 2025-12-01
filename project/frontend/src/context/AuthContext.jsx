// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  saveToken,
  getStoredToken,
  clearToken,
} from '../services/authService.js';
import { setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar token guardado y validar
  useEffect(() => {
    const init = async () => {
      const stored = getStoredToken();
      if (stored) {
        try {
          setAuthToken(stored);
          const me = await getCurrentUser();
          setUser(me);
          setToken(stored);
        } catch (err) {
          clearToken();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    setError('');
    const { user: u, token: t } = await apiLogin(email, password);
    saveToken(t);
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    setError('');
    const { user: u, token: t } = await apiRegister(name, email, password);
    saveToken(t);
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
