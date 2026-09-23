import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * احراز هویت ساده‌ی پنل مدیریت با کوکی امضاشده (HMAC)
 * رمز عبور از process.env.ADMIN_PASSWORD خوانده می‌شود — هاردکد نیست.
 */

const COOKIE_NAME = "nova_admin";
const MAX_AGE = 60 * 60 * 6; // ۶ ساعت

function getSecret(): string {
  return (
    process.env.ADMIN_AUTH_SECRET ??
    process.env.DATABASE_URL ??
    "nova-fallback-secret"
  );
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "nova-admin-1403";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifyPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<void> {
  const payload = `admin.${Date.now()}.${MAX_AGE}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const payload = parts.slice(0, 3).join(".");
  const signature = parts[3];

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const issuedAt = Number(parts[1]);
  const maxAge = Number(parts[2]);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(maxAge)) return false;
  if (Date.now() - issuedAt > maxAge * 1000) return false;

  return true;
}
