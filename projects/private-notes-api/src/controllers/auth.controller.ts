import type { Request, Response } from "express";
import { z } from "zod";
import { config } from "../config";
import { signToken, toSafeUser } from "../utils";
import { login, register } from "../services/auth.service";
import type { AuthRequest } from "../types";

// Controller = HTTP layer only: parse/validate input, hand to the
// service, turn the result into a response. No business logic.

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setSessionCookie(res: Response, userId: string): void {
  res.cookie(config.cookieName, signToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const result = await register(parsed.data);
  if ("error" in result) {
    res.status(409).json({ error: result.error });
    return;
  }

  setSessionCookie(res, result.user.id);
  res.status(201).json({ user: toSafeUser(result.user) });
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const result = await login(parsed.data);
  if ("error" in result) {
    res.status(401).json({ error: result.error });
    return;
  }

  setSessionCookie(res, result.user.id);
  res.json({ user: toSafeUser(result.user) });
}

export async function handleLogout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(config.cookieName);
  res.json({ ok: true });
}

export async function handleMe(req: Request, res: Response): Promise<void> {
  const { user } = req as unknown as AuthRequest;
  res.json({ user: toSafeUser(user) });
}