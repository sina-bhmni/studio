import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

/**
 * احراز هویت ساده‌ی پنل مدیریت با کوکی امضاشده (HMAC).
 * رمز عبور اولویتش این‌طوریه: اول هش ذخیره‌شده در دیتابیس (اگر از طریق
 * پنل /admin/settings تغییر داده شده باشد)، وگرنه process.env.ADMIN_PASSWORD.
 */

const COOKIE_NAME = "nova_admin";
const MAX_AGE = 60 * 60 * 6; // ۶ ساعت
const SCRYPT_KEYLEN = 64;

function getSecret(): string {
  return (
    process.env.ADMIN_AUTH_SECRET ??
    process.env.DATABASE_URL ??
    "nova-fallback-secret"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

function verifyHashedPassword(candidate: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const derived = scryptSync(candidate, salt, SCRYPT_KEYLEN);
  const storedBuf = Buffer.from(hashHex, "hex");
  if (derived.length !== storedBuf.length) return false;
  return timingSafeEqual(derived, storedBuf);
}

function verifyEnvPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "nova-admin-1403";
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  try {
    const rows = await db
      .select({ hash: siteSettings.adminPasswordHash })
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1);
    const stored = rows[0]?.hash;
    if (stored) {
      return verifyHashedPassword(candidate, stored);
    }
  } catch {
    // جدول هنوز ساخته نشده یا خطای دیگر — به رمز env بازمی‌گردیم
  }
  return verifyEnvPassword(candidate);
}

/** رمز جدید را هش می‌کند و در دیتابیس ذخیره می‌کند (برای تغییر رمز از پنل). */
export async function setAdminPassword(newPassword: string): Promise<void> {
  const hash = hashPassword(newPassword);
  await db
    .insert(siteSettings)
    .values({ id: 1, adminPasswordHash: hash })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { adminPasswordHash: hash, updatedAt: new Date() },
    });
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
