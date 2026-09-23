"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

/** ورود مدیر — با محدودیت نرخ برای جلوگیری از Brute Force */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rl = rateLimit({ key: `admin-login:${ip}`, limit: 5, windowMs: 300_000 });
  if (!rl.success) {
    return {
      error: `تعداد تلاش‌های ورود بیش از حد مجاز است. ${Math.ceil(rl.retryAfterSeconds / 60)} دقیقه دیگر تلاش کنید.`,
    };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !verifyPassword(password)) {
    return { error: "رمز عبور اشتباه است." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

const VALID_STATUSES = ["pending", "contacted", "closed"] as const;
type Status = (typeof VALID_STATUSES)[number];

/** تغییر وضعیت درخواست تماس — فقط برای مدیر لاگین‌شده */
export async function updateInquiryStatusAction(
  id: number,
  status: string,
): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  if (!VALID_STATUSES.includes(status as Status)) return;

  await db
    .update(contactRequests)
    .set({ status: status as Status })
    .where(eq(contactRequests.id, id));

  revalidatePath("/admin");
}
