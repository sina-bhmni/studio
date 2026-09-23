import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil, MessageSquareQuote, Star, EyeOff } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllTestimonialsAdmin } from "@/lib/data";
import { toFa } from "@/lib/format";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonialAction } from "./actions";

export const metadata: Metadata = { title: "مدیریت نظرات مشتری", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const items = await getAllTestimonialsAdmin();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/testimonials" />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <MessageSquareQuote className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">مدیریت نظرات مشتری</h1>
            <p className="mt-1 text-sm text-muted">
              نظراتی که در صفحه‌ی اصلی سایت نمایش داده می‌شوند.
            </p>
          </div>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-all duration-300 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          افزودن نظر
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-20 text-center text-muted">
          هنوز نظری ثبت نشده است.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-base font-extrabold">{item.clientName}</h2>
                  {item.clientRole && (
                    <span className="text-xs text-muted">{item.clientRole}</span>
                  )}
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="tabular-fa text-xs font-bold">{toFa(item.rating)}</span>
                  </span>
                  {!item.isVisible && (
                    <span className="flex items-center gap-1 rounded-full bg-ring px-2.5 py-0.5 text-[11px] font-bold text-muted">
                      <EyeOff className="h-3 w-3" />
                      مخفی
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{item.content}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/testimonials/${item.id}/edit`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </Link>
                <DeleteButton action={deleteTestimonialAction.bind(null, item.id)} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
