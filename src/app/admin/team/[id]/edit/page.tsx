import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getMemberByIdAdmin } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Field,
  TextAreaField,
  SelectField,
  CheckboxField,
  FileField,
  FormActions,
} from "@/components/admin/form-fields";
import { updateMemberAction } from "../../actions";

export const metadata: Metadata = { title: "ویرایش عضو تیم", robots: { index: false } };

const ROLE_GROUP_OPTIONS = [
  { value: "developer", label: "توسعه" },
  { value: "designer", label: "طراحی" },
  { value: "manager", label: "مدیریت و محتوا" },
];

export default async function EditMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const { error } = await searchParams;
  const member = await getMemberByIdAdmin(Number(id));
  if (!member) notFound();

  const updateWithId = updateMemberAction.bind(null, member.id);

  return (
    <div className="mx-auto max-w-2xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/team" />
      <h1 className="mb-8 text-2xl font-black sm:text-3xl">ویرایش عضو تیم</h1>

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

      <form action={updateWithId} className="flex flex-col gap-5">
        <Field label="نام" name="name" defaultValue={member.name} required />
        <Field
          label="نامک (slug) — فقط حروف انگلیسی و خط تیره"
          name="slug"
          dir="ltr"
          defaultValue={member.slug}
          required
        />
        <Field label="سمت" name="role" defaultValue={member.role} required />
        <SelectField
          label="گروه نقش"
          name="roleGroup"
          options={ROLE_GROUP_OPTIONS}
          defaultValue={member.roleGroup}
        />
        <FileField label="تصویر پروفایل" name="avatarFile" currentUrl={member.avatar} />
        <TextAreaField label="بیوگرافی کوتاه" name="bioShort" defaultValue={member.bioShort} required rows={2} />
        <TextAreaField label="بیوگرافی کامل" name="bioFull" defaultValue={member.bioFull} required rows={6} />
        <Field label="ایمیل" name="email" dir="ltr" type="email" defaultValue={member.email} />
        <Field label="موقعیت مکانی" name="location" defaultValue={member.location} />
        <Field label="سال پیوستن" name="joinDate" defaultValue={member.joinDate} />
        <Field label="ترتیب نمایش" name="order" type="number" defaultValue={member.order} />
        <CheckboxField label="فعال (نمایش در سایت)" name="isActive" defaultChecked={member.isActive} />
        <CheckboxField
          label="آماده همکاری جدید"
          name="availableForHire"
          defaultChecked={member.availableForHire}
        />
        <FormActions submitLabel="ذخیره تغییرات" cancelHref="/admin/team" />
      </form>
    </div>
  );
}
