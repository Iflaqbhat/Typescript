import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "./config";
import type { SafeUser, User } from "./types";

// ---- Tiny JSON database ---------------------------------------
// A stand-in for a real DB. Only repositories touch this file.
const DATA_DIR = path.join(process.cwd(), "src", "data");

export async function readRows<T>(file: string): Promise<T[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(raw) as T[];
}

export async function writeRows<T>(file: string, rows: T[]): Promise<void> {
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), "utf8");
}

// ---- Passwords -------------------------------------------------
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---- JWT -------------------------------------------------------
export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

// ---- File storage (the "local storage" of the task) ------------
const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "application/msword": ".doc",
};

export function isAllowedType(mimeType: string): boolean {
  return mimeType in ALLOWED_TYPES;
}

export async function saveUpload(buffer: Buffer, mimeType: string): Promise<string> {
  await fs.mkdir(config.uploadDir, { recursive: true });
  const fileName = `${randomUUID()}${ALLOWED_TYPES[mimeType]}`;
  await fs.writeFile(path.join(config.uploadDir, fileName), buffer);
  return fileName;
}

// ---- Never leak the password hash ------------------------------
export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}