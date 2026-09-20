import { randomUUID } from "node:crypto";
import type { User } from "../types";
import { readRows, writeRows } from "../utils";

const FILE = "users.json";

// Repository = ONLY talks to the data store (here: JSON files).
// Later you swap this file for a Postgres client and nothing else changes.

export async function findByEmail(email: string): Promise<User | null> {
  const users = await readRows<User>(FILE);
  return users.find((u) => u.email === email) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  const users = await readRows<User>(FILE);
  return users.find((u) => u.id === id) ?? null;
}

export async function create(input: { name: string; email: string; passwordHash: string }): Promise<User> {
  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  };
  const users = await readRows<User>(FILE);
  users.push(user);
  await writeRows(FILE, users);
  return user;
}