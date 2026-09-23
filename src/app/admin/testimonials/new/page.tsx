import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Field, TextAreaField, CheckboxField, FormActions } from "@/components/admin/form-fields";
import { createTestimonialAction } from "../actions";

export const metadata: Metadata = { title: "نظر جدید", robots: { index: false } };

export default async function NewTestimonialPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/testimonials" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">افزودن نظر مشتری</h1>

      <form action={createTestimonialAction} className="flex flex-col gap-5">
        <Field label="نام مشتری" name="clientName" required />
        <Field label="سمت / شرکت" name="clientRole" />
        <TextAreaField label="متن نظر" name="content" required rows={5} />
        <Field label="امتیاز (۱ تا ۵)" name="rating" type="number" defaultValue={5} />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={0} />
        <CheckboxField label="نمایش در سایت" name="isVisible" defaultChecked />
        <FormActions submitLabel="افزودن نظر" cancelHref="/admin/testimonials" />
      </form>
    </div>
  );
}
