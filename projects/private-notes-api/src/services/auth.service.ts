import type { User } from "../types";
import { findByEmail, create } from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils";

// Service = business rules. Controllers ask it "what should happen?",
// it decides, and uses repositories to persist. No express here.

export async function register(input: { name: string; email: string; password: string }): Promise<{ user: User } | { error: string }> {
  const existing = await findByEmail(input.email);
  if (existing) return { error: "Email already registered" };

  const user = await create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  });
  return { user };
}

export async function login(input: { email: string; password: string }): Promise<{ user: User } | { error: string }> {
  const user = await findByEmail(input.email);
  if (!user) return { error: "Invalid email or password" };

  const isMatch = await verifyPassword(input.password, user.passwordHash);
  if (!isMatch) return { error: "Invalid email or password" };

  return { user };
}