import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Settings, ShieldAlert, CheckCircle2, KeyRound } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";
import { Field, TextAreaField, FormActions } from "@/components/admin/form-fields";
import { updateSiteSettingsAction, changePasswordAction } from "./actions";

export const metadata: Metadata = { title: "تنظیمات سایت", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; pwSaved?: string; pwError?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { saved, pwSaved, pwError } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/settings" />

      <div className="mb-10 flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Settings className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">تنظیمات سایت</h1>
          <p className="mt-1 text-sm text-muted">
            اسم سایت، متن بخش هیرو، اطلاعات تماس، شبکه‌های اجتماعی و سئو.
          </p>
        </div>
      </div>

      {saved === "1" && (
        <p className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-500">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          تنظیمات با موفقیت ذخیره شد.
        </p>
      )}

      <form action={updateSiteSettingsAction} className="flex flex-col gap-5">
        <h2 className="mt-2 text-base font-extrabold">هویت سایت</h2>
        <Field label="اسم سایت" name="siteName" defaultValue={settings.siteName} required />
        <TextAreaField
          label="تگ‌لاین (متن کوتاه معرفی — در فوتر و متادیتا استفاده می‌شود)"
          name="tagline"
          defaultValue={settings.tagline}
          required
          rows={2}
        />

        <h2 className="mt-4 text-base font-extrabold">بخش هیرو (صفحه‌ی اصلی)</h2>
        <Field label="عنوان بزرگ" name="heroTitle" defaultValue={settings.heroTitle} required />
        <TextAreaField
          label="توضیح زیر عنوان"
          name="heroDescription"
          defaultValue={settings.heroDescription}
          required
          rows={4}
        />

        <h2 className="mt-4 text-base font-extrabold">سئو</h2>
        <TextAreaField
          label="توضیحات متا (برای گوگل و موتورهای جست‌وجو)"
          name="seoDescription"
          defaultValue={settings.seoDescription}
          required
          rows={3}
        />

        <h2 className="mt-4 text-base font-extrabold">اطلاعات تماس</h2>
        <Field label="ایمیل" name="contactEmail" dir="ltr" type="email" defaultValue={settings.contactEmail} />
        <Field label="شماره تماس" name="contactPhone" dir="ltr" defaultValue={settings.contactPhone} />
        <Field label="آدرس" name="contactAddress" defaultValue={settings.contactAddress} />

        <h2 className="mt-4 text-base font-extrabold">شبکه‌های اجتماعی</h2>
        <Field label="اینستاگرام" name="socialInstagram" dir="ltr" placeholder="https://instagram.com/..." defaultValue={settings.socialInstagram} />
        <Field label="تلگرام" name="socialTelegram" dir="ltr" placeholder="https://t.me/..." defaultValue={settings.socialTelegram} />
        <Field label="لینکدین" name="socialLinkedin" dir="ltr" placeholder="https://linkedin.com/..." defaultValue={settings.socialLinkedin} />
        <Field label="گیت‌هاب" name="socialGithub" dir="ltr" placeholder="https://github.com/..." defaultValue={settings.socialGithub} />
        <Field label="ایکس (توییتر)" name="socialX" dir="ltr" placeholder="https://x.com/..." defaultValue={settings.socialX} />

        <FormActions submitLabel="ذخیره تنظیمات" cancelHref="/admin" />
      </form>

      <div className="mt-14 border-t border-border pt-10">
        <div className="mb-6 flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-accent" />
          <h2 className="text-base font-extrabold">تغییر رمز پنل ادمین</h2>
        </div>

        {pwSaved === "1" && (
          <p className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-500">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            رمز عبور با موفقیت تغییر کرد.
          </p>
        )}
        {pwError && (
          <p
            role="alert"
            className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
          >
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            {decodeURIComponent(pwError)}
          </p>
        )}

        <form action={changePasswordAction} className="flex flex-col gap-5">
          <Field label="رمز فعلی" name="currentPassword" type="password" dir="ltr" required />
          <Field label="رمز جدید (حداقل ۶ کاراکتر)" name="newPassword" type="password" dir="ltr" required />
          <Field label="تکرار رمز جدید" name="confirmPassword" type="password" dir="ltr" required />
          <div className="mt-2">
            <button
              type="submit"
              className="rounded-xl bg-accent px-7 py-3 text-sm font-bold text-accent-foreground transition-all duration-300 hover:brightness-110"
            >
              تغییر رمز
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
