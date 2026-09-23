import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getServiceByIdAdmin } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";
import { Field, TextAreaField, SelectField, FormActions } from "@/components/admin/form-fields";
import { updateServiceAction } from "../../actions";

export const metadata: Metadata = { title: "ویرایش خدمت", robots: { index: false } };

const ICON_OPTIONS = [
  { value: "pen-tool", label: "قلم (طراحی)" },
  { value: "code-2", label: "کد (توسعه)" },
  { value: "fingerprint", label: "اثر انگشت (برندینگ)" },
  { value: "trending-up", label: "روند صعودی (بازاریابی)" },
  { value: "feather", label: "پر (محتوا)" },
  { value: "shield-check", label: "سپر (امنیت/کیفیت)" },
];

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const service = await getServiceByIdAdmin(Number(id));
  if (!service) notFound();

  const updateWithId = updateServiceAction.bind(null, service.id);

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/services" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">ویرایش خدمت</h1>

      <form action={updateWithId} className="flex flex-col gap-5">
        <Field label="عنوان" name="title" defaultValue={service.title} required />
        <TextAreaField label="توضیحات" name="description" defaultValue={service.description} required />
        <SelectField label="آیکون" name="icon" options={ICON_OPTIONS} defaultValue={service.icon} />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={service.order} />
        <FormActions submitLabel="ذخیره تغییرات" cancelHref="/admin/services" />
      </form>
    </div>
  );
}
