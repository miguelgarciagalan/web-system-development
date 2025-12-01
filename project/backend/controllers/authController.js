import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserById } from '../db/usersDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET no esta definido; usando valor por defecto solo para desarrollo');
}

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push('La contraseña debe incluir letras y números');
  }
  return errors;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      return res.status(400).json({ error: pwdErrors.join('. ') });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });

    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o password' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = signToken({ id: user.id, email: user.email });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { id } = req.user || {};
    if (!id) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};
