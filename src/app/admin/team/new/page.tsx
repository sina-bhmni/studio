import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Field,
  TextAreaField,
  SelectField,
  CheckboxField,
  FileField,
  FormActions,
} from "@/components/admin/form-fields";
import { createMemberAction } from "../actions";

export const metadata: Metadata = { title: "عضو جدید", robots: { index: false } };

const ROLE_GROUP_OPTIONS = [
  { value: "developer", label: "توسعه" },
  { value: "designer", label: "طراحی" },
  { value: "manager", label: "مدیریت و محتوا" },
];

export default async function NewMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/team" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">افزودن عضو جدید</h1>

      {error && (
        <p
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
        >
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          {error === "slug-taken"
            ? "این نامک (slug) قبلاً برای یک عضو دیگر استفاده شده — یک نامک دیگر انتخاب کن."
            : decodeURIComponent(error)}
        </p>
      )}

      <form action={createMemberAction} className="flex flex-col gap-5">
        <Field label="نام" name="name" required />
        <Field
          label="نامک (slug) — فقط حروف انگلیسی و خط تیره"
          name="slug"
          dir="ltr"
          placeholder="firstname-lastname"
          required
        />
        <Field label="سمت" name="role" required placeholder="مثلاً: توسعه‌دهنده فرانت‌اند" />
        <SelectField label="گروه نقش" name="roleGroup" options={ROLE_GROUP_OPTIONS} defaultValue="developer" />
        <FileField label="تصویر پروفایل" name="avatarFile" />
        <TextAreaField label="بیوگرافی کوتاه" name="bioShort" required rows={2} />
        <TextAreaField label="بیوگرافی کامل" name="bioFull" required rows={6} />
        <Field label="ایمیل" name="email" dir="ltr" type="email" />
        <Field label="موقعیت مکانی" name="location" />
        <Field label="سال پیوستن" name="joinDate" placeholder="۱۴۰۳" />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={0} />
        <CheckboxField label="فعال (نمایش در سایت)" name="isActive" defaultChecked />
        <CheckboxField label="آماده همکاری جدید" name="availableForHire" />
        <FormActions submitLabel="افزودن عضو" cancelHref="/admin/team" />
      </form>
    </div>
  );
}
