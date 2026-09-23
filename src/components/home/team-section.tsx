import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { MemberCard } from "@/components/member-card";
import type { TeamMember } from "@/db/schema";

export function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          index="۰۳"
          eyebrow="تیم ما"
          title="چهار نفر، چهار تخصص، یک مأموریت"
          description="روی کارت هر نفر کلیک کنید تا رزومه‌ی کامل، مهارت‌ها و پروژه‌هایش را ببینید."
        />
        <Reveal className="mb-14 hidden sm:block">
          <Link
            href="/team"
            className="group flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold transition-all duration-300 hover:border-accent hover:text-accent"
          >
            صفحه‌ی کامل تیم
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <Reveal key={member.id} delay={i * 0.1}>
            <MemberCard member={member} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
