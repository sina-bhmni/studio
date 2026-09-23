import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Field, TextAreaField, SelectField, FormActions } from "@/components/admin/form-fields";
import { createServiceAction } from "../actions";

export const metadata: Metadata = { title: "خدمت جدید", robots: { index: false } };

const ICON_OPTIONS = [
  { value: "pen-tool", label: "قلم (طراحی)" },
  { value: "code-2", label: "کد (توسعه)" },
  { value: "fingerprint", label: "اثر انگشت (برندینگ)" },
  { value: "trending-up", label: "روند صعودی (بازاریابی)" },
  { value: "feather", label: "پر (محتوا)" },
  { value: "shield-check", label: "سپر (امنیت/کیفیت)" },
];

export default async function NewServicePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/services" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">افزودن خدمت جدید</h1>

      <form action={createServiceAction} className="flex flex-col gap-5">
        <Field label="عنوان" name="title" required />
        <TextAreaField label="توضیحات" name="description" required />
        <SelectField label="آیکون" name="icon" options={ICON_OPTIONS} defaultValue="pen-tool" />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={0} />
        <FormActions submitLabel="افزودن خدمت" cancelHref="/admin/services" />
      </form>
    </div>
  );
}
