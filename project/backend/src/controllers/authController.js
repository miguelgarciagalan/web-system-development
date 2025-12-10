import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findByEmail, findById } from "../models/userModel.js";

const jwtSecret = process.env.JWT_SECRET || "devsecret";
const tokenOptions = { expiresIn: "7d" };

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = jwt.sign({ userId: user.id }, jwtSecret, tokenOptions);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, tokenOptions);
    const safeUser = await findById(user.id);
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
};
