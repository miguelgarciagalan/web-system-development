import db from './sqlite.js';

export const createUser = async ({ name, email, passwordHash }) => {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    'INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)' 
  );
  const info = stmt.run(name, email, passwordHash, now);
  return {
    id: String(info.lastInsertRowid),
    name,
    email,
    passwordHash,
    createdAt: now,
  };
};

export const getUserByEmail = async (email) => {
  const row = db
    .prepare('SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = ?')
    .get(email);
  return row ? { ...row, id: String(row.id) } : null;
};

export const getUserById = async (id) => {
  const row = db
    .prepare('SELECT id, name, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE id = ?')
    .get(id);
  return row ? { ...row, id: String(row.id) } : null;
};
