import { createHmac, timingSafeEqual } from "node:crypto";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "hc-session";

function getSecret() {
  return process.env.SESSION_SECRET ?? "gelistirme-icin-varsayilan-gizli-anahtar";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(username: string) {
  const issuedAt = Date.now();
  const payload = `${username}.${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string) {
  const [username, issuedAt, signature] = token.split(".");
  if (!username || !issuedAt || !signature) return null;

  const payload = `${username}.${issuedAt}`;
  const expected = sign(payload);

  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  return { username, issuedAt: Number(issuedAt) };
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  return verifySessionToken(session);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/giris");
  }

  return session;
}

export async function login(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "kivanc";
  const expectedHash =
    process.env.ADMIN_PASSWORD_HASH ?? "$2b$10$0w2Hd0OPv5Hi4nKwxLBzEuR0H3.ANLSd851qwL41Z8nfdXbraxprO";

  if (username !== expectedUser) {
    return false;
  }

  return bcrypt.compare(password, expectedHash);
}

export async function persistSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
