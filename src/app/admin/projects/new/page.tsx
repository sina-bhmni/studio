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
import { createProjectAction } from "../actions";

export const metadata: Metadata = { title: "پروژه جدید", robots: { index: false } };

const CATEGORY_OPTIONS = [
  { value: "web", label: "توسعه وب" },
  { value: "branding", label: "برندینگ" },
  { value: "uiux", label: "UI/UX" },
  { value: "marketing", label: "بازاریابی دیجیتال" },
];

export default async function NewProjectPage({
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
      <AdminNav active="/admin/projects" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">افزودن پروژه جدید</h1>

      {error && (
        <p
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500"
        >
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          {error === "slug-taken"
            ? "این نامک (slug) قبلاً برای یک پروژه‌ی دیگر استفاده شده — یک نامک دیگر انتخاب کن."
            : decodeURIComponent(error)}
        </p>
      )}

      <form action={createProjectAction} className="flex flex-col gap-5">
        <Field label="عنوان" name="title" required />
        <Field
          label="نامک (slug) — فقط حروف انگلیسی و خط تیره"
          name="slug"
          dir="ltr"
          placeholder="my-awesome-project"
          required
        />
        <TextAreaField label="توضیحات" name="description" required />
        <FileField label="تصویر بندانگشتی" name="thumbnailFile" />
        <Field label="لینک سایت زنده" name="liveUrl" dir="ltr" placeholder="https://..." />
        <Field label="نام کارفرما" name="clientName" />
        <SelectField label="دسته‌بندی" name="category" options={CATEGORY_OPTIONS} defaultValue="web" />
        <Field label="سال" name="year" placeholder="۱۴۰۳" />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={0} />
        <CheckboxField label="پروژه‌ی ویژه (نمایش در صفحه‌ی اصلی)" name="isFeatured" />
        <FormActions submitLabel="افزودن پروژه" cancelHref="/admin/projects" />
      </form>
    </div>
  );
}
