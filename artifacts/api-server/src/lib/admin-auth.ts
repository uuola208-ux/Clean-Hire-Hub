import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const ADMIN_COOKIE_NAME = "tj_freshspace_admin";
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000;
const attemptsByIp = new Map<string, { count: number; resetAt: number }>();

function sessionSecret(): string | undefined {
  return process.env.SESSION_SECRET;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function hasAdminSession(req: Request): boolean {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  const secret = sessionSecret();
  if (typeof token !== "string" || !secret) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = sign(payload, secret);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { expiresAt?: number; nonce?: string };
    return typeof session.expiresAt === "number" && session.expiresAt > Date.now() && typeof session.nonce === "string";
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!hasAdminSession(req)) {
    res.status(401).json({ error: "Admin sign-in required" });
    return;
  }
  next();
}

export function loginAdmin(req: Request, res: Response): void {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const secret = sessionSecret();
  if (!configuredPassword || !secret) {
    res.status(503).json({ error: "Admin access is not configured. Add ADMIN_PASSWORD and SESSION_SECRET in Replit Secrets." });
    return;
  }

  const ip = req.ip || "unknown";
  const now = Date.now();
  const current = attemptsByIp.get(ip);
  if (current && current.resetAt > now && current.count >= 5) {
    res.status(429).json({ error: "Too many sign-in attempts. Try again in 15 minutes." });
    return;
  }

  const candidate = typeof req.body?.password === "string" ? req.body.password : "";
  const expectedBytes = Buffer.from(configuredPassword);
  const candidateBytes = Buffer.from(candidate);
  const matches = expectedBytes.length === candidateBytes.length && timingSafeEqual(expectedBytes, candidateBytes);
  if (!matches) {
    const attempt = current && current.resetAt > now ? current : { count: 0, resetAt: now + 15 * 60 * 1000 };
    attempt.count += 1;
    attemptsByIp.set(ip, attempt);
    res.status(401).json({ error: "Incorrect password." });
    return;
  }

  attemptsByIp.delete(ip);
  const payload = Buffer.from(JSON.stringify({
    expiresAt: now + SESSION_LIFETIME_MS,
    nonce: randomBytes(16).toString("base64url"),
  })).toString("base64url");
  const token = `${payload}.${sign(payload, secret)}`;

  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_LIFETIME_MS,
    path: "/api",
  });
  res.json({ authenticated: true });
}

export function logoutAdmin(_req: Request, res: Response): void {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api",
  });
  res.json({ authenticated: false });
}