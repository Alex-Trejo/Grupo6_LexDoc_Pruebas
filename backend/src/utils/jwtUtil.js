<<<<<<< HEAD
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "AAAAAAAAABBBBBCCCC";

// Generar token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "6h" });
=======
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'AAAAAAAAABBBBBCCCC';

// Generar token
export function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '6h' });
>>>>>>> 16d1e9ffeab75df9f1d0ef6bb6eaaf6b8bad7857
}

// Verificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}
