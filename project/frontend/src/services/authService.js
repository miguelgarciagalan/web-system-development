// src/services/authService.js
import api, { setAuthToken } from './api.js';

const TOKEN_KEY = 'studycalendar_token';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { user, token }
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data; // { user, token }
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data; // { id, name, email }
};

export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
  }
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  setAuthToken(null);
};
