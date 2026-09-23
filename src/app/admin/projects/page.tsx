import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil, Briefcase, Star, ExternalLink } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllProjectsAdmin, PROJECT_CATEGORIES } from "@/lib/data";
import { toFa } from "@/lib/format";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProjectAction } from "./actions";

export const metadata: Metadata = { title: "مدیریت پروژه‌ها", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const items = await getAllProjectsAdmin();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/projects" />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Briefcase className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">مدیریت پروژه‌ها</h1>
            <p className="mt-1 text-sm text-muted">نمونه‌کارهایی که در سایت نمایش داده می‌شوند.</p>
          </div>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-all duration-300 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          افزودن پروژه
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-20 text-center text-muted">
          هنوز پروژه‌ای ثبت نشده است.
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
                  <h2 className="text-base font-extrabold">{item.title}</h2>
                  <span className="rounded-full bg-ring px-2.5 py-0.5 text-[11px] font-bold text-muted">
                    {PROJECT_CATEGORIES[item.category] ?? item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      ویژه
                    </span>
                  )}
                  {item.year && (
                    <span className="tabular-fa text-xs text-muted">{toFa(item.year)}</span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{item.description}</p>
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex w-fit items-center gap-1.5 text-xs text-accent hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    مشاهده سایت
                  </a>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/projects/${item.id}/edit`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </Link>
                <DeleteButton action={deleteProjectAction.bind(null, item.id)} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
