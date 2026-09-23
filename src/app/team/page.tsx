import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { getMembers, ROLE_GROUPS } from "@/lib/data";
import { MemberCard } from "@/components/member-card";
import { Reveal, WordReveal } from "@/components/reveal";
import { toFa } from "@/lib/format";

export const metadata: Metadata = {
  title: "تیم ما",
  description:
    "آشنایی با چهار عضو استودیو نوا — طراح رابط کاربری، توسعه‌دهندگان فرانت و بک‌اند، و مدیر پروژه.",
};

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const activeRole = role ?? "all";
  const members = await getMembers();
  const filtered =
    activeRole === "all"
      ? members
      : members.filter((m) => m.roleGroup === activeRole);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
      {/* هدر */}
      <div className="mb-12 max-w-3xl">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted">
            <Users className="h-4 w-4 text-accent" />
            {toFa(members.length)} نفر — هر کدام متخصص حوزه‌ی خودشان
          </span>
        </Reveal>
        <h1 className="text-5xl font-black leading-[1.2] tracking-tight sm:text-6xl">
          <WordReveal text="آدم‌های پشت پرده‌ی نوا" />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-6 text-lg leading-9 text-muted">
            ما به اندازه‌ی یک غول فناوری بزرگ نیستیم — و دقیقاً به همین دلیل هر
            پروژه را شخصی، با حوصله و با امضای خودمان تحویل می‌دهیم. روی هر نفر
            کلیک کنید تا رزومه‌ی کاملش را ببینید.
          </p>
        </Reveal>
      </div>

      {/* فیلتر نقش */}
      <Reveal delay={0.25} className="mb-12">
        <div className="flex flex-wrap gap-2.5 border-y border-border py-5">
          {ROLE_GROUPS.map((g) => {
            const isActive = activeRole === g.key;
            const count =
              g.key === "all"
                ? members.length
                : members.filter((m) => m.roleGroup === g.key).length;
            return (
              <Link
                key={g.key}
                href={g.key === "all" ? "/team" : `/team?role=${g.key}`}
                scroll={false}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-card text-foreground/75 hover:border-accent hover:text-accent"
                }`}
              >
                {g.label}
                <span
                  className={`tabular-fa rounded-full px-2 py-0.5 text-[11px] ${
                    isActive ? "bg-black/20" : "bg-ring text-muted"
                  }`}
                >
                  {toFa(count)}
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {/* گرید اعضا */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((member, i) => (
          <Reveal key={member.id} delay={i * 0.08}>
            <MemberCard member={member} index={i} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-muted">
          عضوی با این نقش پیدا نشد.
        </p>
      )}
    </div>
  );
}
