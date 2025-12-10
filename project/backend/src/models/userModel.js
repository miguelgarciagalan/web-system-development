import { get, run } from "../db/connection.js";

export const findByEmail = (email) =>
  get("SELECT * FROM users WHERE email = ?", [email]);

export const findById = (id) =>
  get("SELECT id, name, email, createdAt FROM users WHERE id = ?", [id]);

export const createUser = ({ name, email, passwordHash }) =>
  run(
    "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  ).then((result) => ({
    id: result.id,
    name,
    email,
  }));
