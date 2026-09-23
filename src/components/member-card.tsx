import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, BadgeCheck } from "lucide-react";
import type { TeamMember } from "@/db/schema";

const ROLE_BADGE: Record<string, string> = {
  designer: "طراحی",
  developer: "توسعه",
  manager: "مدیریت و محتوا",
};

export function MemberCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <Link
      href={`/team/${member.slug}`}
      className="group card-hover relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
      style={{ transitionDelay: `${index * 20}ms` }}
    >
      {/* تصویر */}
      <div className="relative aspect-[4/4.4] overflow-hidden">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* نشان نقش */}
        <span className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
          {ROLE_BADGE[member.roleGroup] ?? member.role}
        </span>

        {/* دکمه‌ی ورود به پروفایل */}
        <span className="absolute bottom-4 left-4 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpLeft className="h-5 w-5" />
        </span>
      </div>

      {/* متن */}
      <div className="flex flex-1 flex-col gap-2 p-6 pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-extrabold">{member.name}</h3>
          {member.availableForHire && (
            <span
              title="آماده‌ی همکاری در پروژه"
              className="text-accent"
            >
              <BadgeCheck className="h-4.5 w-4.5" />
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-accent">{member.role}</p>
        <p className="mt-1 text-sm leading-7 text-muted">{member.bioShort}</p>
      </div>
    </Link>
  );
}
