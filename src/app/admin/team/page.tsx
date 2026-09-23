import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil, Users2, EyeOff, BadgeCheck } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllMembersAdmin } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMemberAction } from "./actions";

export const metadata: Metadata = { title: "مدیریت اعضای تیم", robots: { index: false } };
export const dynamic = "force-dynamic";

const ROLE_GROUP_LABELS: Record<string, string> = {
  designer: "طراحی",
  developer: "توسعه",
  manager: "مدیریت و محتوا",
};

export default async function AdminTeamPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const items = await getAllMembersAdmin();

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin/team" />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Users2 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">مدیریت اعضای تیم</h1>
            <p className="mt-1 text-sm text-muted">
              پروفایل‌هایی که در صفحه‌ی تیم و پروژه‌ها نمایش داده می‌شوند.
            </p>
          </div>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-all duration-300 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          افزودن عضو
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-20 text-center text-muted">
          هنوز عضوی ثبت نشده است.
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
                  <h2 className="text-base font-extrabold">{item.name}</h2>
                  <span className="text-sm text-muted">{item.role}</span>
                  <span className="rounded-full bg-ring px-2.5 py-0.5 text-[11px] font-bold text-muted">
                    {ROLE_GROUP_LABELS[item.roleGroup] ?? item.roleGroup}
                  </span>
                  {item.availableForHire && (
                    <span className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                      <BadgeCheck className="h-3 w-3" />
                      آماده همکاری
                    </span>
                  )}
                  {!item.isActive && (
                    <span className="flex items-center gap-1 rounded-full bg-ring px-2.5 py-0.5 text-[11px] font-bold text-muted">
                      <EyeOff className="h-3 w-3" />
                      غیرفعال
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{item.bioShort}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/team/${item.id}/edit`}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  ویرایش
                </Link>
                <DeleteButton action={deleteMemberAction.bind(null, item.id)} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
