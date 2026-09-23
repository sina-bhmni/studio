import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getTestimonialByIdAdmin } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";
import { Field, TextAreaField, CheckboxField, FormActions } from "@/components/admin/form-fields";
import { updateTestimonialAction } from "../../actions";

export const metadata: Metadata = { title: "ویرایش نظر", robots: { index: false } };

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const testimonial = await getTestimonialByIdAdmin(Number(id));
  if (!testimonial) notFound();

  const updateWithId = updateTestimonialAction.bind(null, testimonial.id);

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/testimonials" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">ویرایش نظر مشتری</h1>

      <form action={updateWithId} className="flex flex-col gap-5">
        <Field label="نام مشتری" name="clientName" defaultValue={testimonial.clientName} required />
        <Field label="سمت / شرکت" name="clientRole" defaultValue={testimonial.clientRole} />
        <TextAreaField label="متن نظر" name="content" defaultValue={testimonial.content} required rows={5} />
        <Field label="امتیاز (۱ تا ۵)" name="rating" type="number" defaultValue={testimonial.rating} />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={testimonial.order} />
        <CheckboxField label="نمایش در سایت" name="isVisible" defaultChecked={testimonial.isVisible} />
        <FormActions submitLabel="ذخیره تغییرات" cancelHref="/admin/testimonials" />
      </form>
    </div>
  );
}
