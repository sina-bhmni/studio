import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Inbox,
  PhoneCall,
  Archive,
  Clock3,
  User2,
  Mail,
  Phone,
  Wallet,
  Tag,
} from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getInquiries, getInquiryStats } from "@/lib/data";
import { formatDateFa, toFa } from "@/lib/format";
import { updateInquiryStatusAction } from "./actions";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const STATUS_META: Record<
  string,
  { label: string; chip: string; dot: string }
> = {
  pending: {
    label: "در انتظار بررسی",
    chip: "border-amber-500/40 bg-amber-500/10 text-amber-500",
    dot: "bg-amber-500",
  },
  contacted: {
    label: "تماس گرفته شد",
    chip: "border-sky-500/40 bg-sky-500/10 text-sky-500",
    dot: "bg-sky-500",
  },
  closed: {
    label: "بسته شد",
    chip: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
    dot: "bg-emerald-500",
  },
};

const STATUS_ORDER = ["pending", "contacted", "closed"] as const;
const STATUS_BTN: Record<string, string> = {
  pending: "انتقال به انتظار",
  contacted: "ثبت تماس",
  closed: "بستن",
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [inquiries, stats] = await Promise.all([getInquiries(), getInquiryStats()]);

  const statCards = [
    { icon: Inbox, label: "کل درخواست‌ها", value: stats.total, tint: "text-foreground" },
    { icon: Clock3, label: "در انتظار", value: stats.pending, tint: "text-amber-500" },
    { icon: PhoneCall, label: "تماس گرفته‌شده", value: stats.contacted, tint: "text-sky-500" },
    { icon: Archive, label: "بسته‌شده", value: stats.closed, tint: "text-emerald-500" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-36">
      <AdminNav active="/admin" />

      {/* هدر */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Inbox className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">مدیریت درخواست‌ها</h1>
            <p className="mt-1 text-sm text-muted">
              معادل پنل فرم تماس در Django Admin — ثبت وضعیت پیگیری هر مشتری.
            </p>
          </div>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ring">
              <c.icon className={`h-5.5 w-5.5 ${c.tint}`} strokeWidth={1.7} />
            </span>
            <div>
              <p className={`tabular-fa text-2xl font-black ${c.tint}`}>
                {toFa(c.value)}
              </p>
              <p className="text-xs font-semibold text-muted">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* لیست درخواست‌ها */}
      {inquiries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-20 text-center text-muted">
          هنوز درخواستی ثبت نشده است.
        </p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const meta = STATUS_META[inq.status];
            return (
              <article
                key={inq.id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ring text-muted">
                      <User2 className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-base font-extrabold">{inq.name}</h2>
                        <span
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${meta.chip}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <p className="tabular-fa mt-1 text-xs text-muted">
                        {formatDateFa(inq.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* اکشن‌های وضعیت */}
                  <div className="flex flex-wrap gap-2">
                    {STATUS_ORDER.filter((s) => s !== inq.status).map((s) => (
                      <form
                        key={s}
                        action={updateInquiryStatusAction.bind(null, inq.id, s)}
                      >
                        <button
                          type="submit"
                          className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 hover:brightness-110 ${STATUS_META[s].chip}`}
                        >
                          {STATUS_BTN[s]}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-xs text-muted">
                  <span className="flex items-center gap-1.5" dir="ltr">
                    <Mail className="h-3.5 w-3.5" />
                    {inq.email}
                  </span>
                  {inq.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {inq.phone}
                    </span>
                  )}
                  {inq.projectType && (
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      {inq.projectType}
                    </span>
                  )}
                  {inq.budget && (
                    <span className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5" />
                      {inq.budget}
                    </span>
                  )}
                </div>

                <p className="mt-4 rounded-xl bg-ring/50 p-4 text-sm leading-8 text-foreground/85">
                  {inq.message}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
