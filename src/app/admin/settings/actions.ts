"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { isAdminAuthenticated, verifyPassword, setAdminPassword } from "@/lib/auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSiteSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      siteName: str(formData, "siteName"),
      tagline: str(formData, "tagline"),
      heroTitle: str(formData, "heroTitle"),
      heroDescription: str(formData, "heroDescription"),
      seoDescription: str(formData, "seoDescription"),
      contactEmail: str(formData, "contactEmail") || null,
      contactPhone: str(formData, "contactPhone") || null,
      contactAddress: str(formData, "contactAddress") || null,
      socialInstagram: str(formData, "socialInstagram") || null,
      socialTelegram: str(formData, "socialTelegram") || null,
      socialLinkedin: str(formData, "socialLinkedin") || null,
      socialGithub: str(formData, "socialGithub") || null,
      socialX: str(formData, "socialX") || null,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        siteName: str(formData, "siteName"),
        tagline: str(formData, "tagline"),
        heroTitle: str(formData, "heroTitle"),
        heroDescription: str(formData, "heroDescription"),
        seoDescription: str(formData, "seoDescription"),
        contactEmail: str(formData, "contactEmail") || null,
        contactPhone: str(formData, "contactPhone") || null,
        contactAddress: str(formData, "contactAddress") || null,
        socialInstagram: str(formData, "socialInstagram") || null,
        socialTelegram: str(formData, "socialTelegram") || null,
        socialLinkedin: str(formData, "socialLinkedin") || null,
        socialGithub: str(formData, "socialGithub") || null,
        socialX: str(formData, "socialX") || null,
        updatedAt: new Date(),
      },
    });

  // چون تنظیمات در تقریباً همه‌ی صفحات استفاده می‌شود، همه را revalidate می‌کنیم
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function changePasswordAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const currentPassword = str(formData, "currentPassword");
  const newPassword = str(formData, "newPassword");
  const confirmPassword = str(formData, "confirmPassword");

  if (!(await verifyPassword(currentPassword))) {
    redirect("/admin/settings?pwError=" + encodeURIComponent("رمز فعلی اشتباه است."));
  }
  if (newPassword.length < 6) {
    redirect(
      "/admin/settings?pwError=" + encodeURIComponent("رمز جدید باید حداقل ۶ کاراکتر باشد."),
    );
  }
  if (newPassword !== confirmPassword) {
    redirect(
      "/admin/settings?pwError=" + encodeURIComponent("تکرار رمز جدید با رمز وارد‌شده یکسان نیست."),
    );
  }

  await setAdminPassword(newPassword);
  redirect("/admin/settings?pwSaved=1");
}
