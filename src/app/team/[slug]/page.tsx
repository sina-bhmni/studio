import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Award,
  FolderKanban,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { asc } from "drizzle-orm";
import {
  getMemberBySlug,
  getMemberSkills,
  getMemberSocials,
  getMemberExperiences,
  getMemberEducations,
  getMemberCertifications,
  getMemberProjects,
} from "@/lib/data";
import { SocialIcon, PLATFORM_LABELS } from "@/components/icons/social";
import { SkillBar } from "@/components/skill-bar";
import { PrintResumeButton } from "@/components/print-button";
import { Reveal } from "@/components/reveal";
import { toFa } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const members = await db
    .select({ slug: teamMembers.slug })
    .from(teamMembers)
    .orderBy(asc(teamMembers.order));
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) return { title: "عضو یافت نشد" };
  return {
    title: `${member.name} — ${member.role}`,
    description: member.bioShort,
  };
}

export default async function MemberProfilePage({ params }: Props) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  const [memberSkillList, socials, experienceList, educationList, certList, memberProjects, allMembers] =
    await Promise.all([
      getMemberSkills(member.id),
      getMemberSocials(member.id),
      getMemberExperiences(member.id),
      getMemberEducations(member.id),
      getMemberCertifications(member.id),
      getMemberProjects(member.id),
      db.select().from(teamMembers).orderBy(asc(teamMembers.order)),
    ]);

  const idx = allMembers.findIndex((m) => m.id === member.id);
  const prev = allMembers[(idx - 1 + allMembers.length) % allMembers.length];
  const next = allMembers[(idx + 1) % allMembers.length];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      {/* بازگشت */}
      <Reveal className="print:hidden mb-8">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-accent"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به تیم
        </Link>
      </Reveal>

      {/* کارت هدر پروفایل */}
      <Reveal>
        <header className="grain-card relative mb-16 overflow-hidden rounded-[2rem] border border-border bg-card">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[320px_1fr]">
            {/* آواتار */}
            <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-3xl border border-border lg:max-w-none">
              {member.avatar && (
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 320px, 33vw"
                  className="object-cover"
                  priority
                />
              )}
              {member.availableForHire && (
                <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  آماده‌ی پروژه‌های جدید
                </span>
              )}
            </div>

            {/* مشخصات */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  {member.name}
                </h1>
                <BadgeCheck className="h-7 w-7 text-accent" />
              </div>
              <p className="mt-3 text-lg font-bold text-accent sm:text-xl">
                {member.role}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                {member.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </span>
                )}
                {member.joinDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    عضو نوا از {member.joinDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FolderKanban className="h-4 w-4" />
                  {toFa(memberProjects.length)} پروژه در نوا
                </span>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-9 text-foreground/85">
                {member.bioFull}
              </p>

              {/* اکشن‌ها */}
              <div className="print:hidden mt-8 flex flex-wrap items-center gap-3">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
                  >
                    <SocialIcon platform="email" className="h-4.5 w-4.5" />
                    ارسال ایمیل
                  </a>
                )}
                <PrintResumeButton />
                <div className="flex items-center gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={PLATFORM_LABELS[s.platform] ?? s.platform}
                      title={PLATFORM_LABELS[s.platform] ?? s.platform}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                    >
                      <SocialIcon platform={s.platform} className="h-4.5 w-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>
      </Reveal>

      {/* مهارت‌ها + تایم‌لاین تجربه */}
      <div className="mb-20 grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        {/* مهارت‌ها */}
        <section>
          <Reveal>
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Brain className="h-5.5 w-5.5" />
              </span>
              مهارت‌های کلیدی
            </h2>
          </Reveal>
          <div className="flex flex-col gap-7 rounded-3xl border border-border bg-card p-8">
            {memberSkillList.map((ms, i) => (
              <SkillBar
                key={ms.id}
                name={ms.skill.name}
                proficiency={ms.proficiency}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* تایم‌لاین تجربه */}
        <section>
          <Reveal>
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Briefcase className="h-5.5 w-5.5" />
              </span>
              سوابق کاری
            </h2>
          </Reveal>
          <ol className="relative mr-3 space-y-10 border-r-2 border-border pr-8">
            {experienceList.map((exp, i) => (
              <Reveal key={exp.id} delay={i * 0.1}>
                <li className="relative">
                  {/* نقطه‌ی تایم‌لاین */}
                  <span
                    className={`absolute -right-[41px] top-1.5 h-4 w-4 rounded-full border-[3px] ${
                      !exp.endYear
                        ? "border-accent bg-accent/30"
                        : "border-border bg-card"
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-extrabold">{exp.title}</h3>
                    {!exp.endYear && (
                      <span className="rounded-full bg-accent px-3 py-0.5 text-[10px] font-black text-accent-foreground">
                        هم‌اکنون
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-bold text-accent">{exp.company}</p>
                  <p className="tabular-fa mt-1.5 text-xs font-semibold text-muted">
                    {exp.startYear} — {exp.endYear ?? "تا کنون"}
                  </p>
                  {exp.description && (
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {exp.description}
                    </p>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      {/* تحصیلات + مدارک */}
      <div className="mb-20 grid gap-8 lg:grid-cols-2">
        <section>
          <Reveal>
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <GraduationCap className="h-5.5 w-5.5" />
              </span>
              تحصیلات
            </h2>
          </Reveal>
          <div className="space-y-4">
            {educationList.map((edu, i) => (
              <Reveal key={edu.id} delay={i * 0.08}>
                <div className="card-hover rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-extrabold">{edu.degree}</h3>
                  <p className="mt-1.5 text-sm text-muted">{edu.institution}</p>
                  <p className="tabular-fa mt-2 text-xs font-bold text-accent">
                    {edu.startYear} — {edu.endYear ?? "ادامه دارد"}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <Reveal>
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Award className="h-5.5 w-5.5" />
              </span>
              گواهینامه‌ها
            </h2>
          </Reveal>
          <div className="space-y-4">
            {certList.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 0.08}>
                <div className="card-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Award className="h-5.5 w-5.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold leading-snug">{cert.title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {cert.issuer} —{" "}
                      <span className="tabular-fa font-bold text-accent">{cert.year}</span>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* پروژه‌هایی که روی آن‌ها کار کرده */}
      <section className="mb-20">
        <Reveal>
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <FolderKanban className="h-5.5 w-5.5" />
            </span>
            پروژه‌هایی که در نوا ساخته
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memberProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <article className="card-hover group relative overflow-hidden rounded-2xl border border-border">
                <div className="relative aspect-[16/9]">
                  {project.thumbnail && (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-extrabold">{project.title}</h3>
                    {project.roleInProject && (
                      <p className="mt-1 text-xs font-semibold text-white/75">
                        نقش: {project.roleInProject}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ناوبری بین اعضا */}
      <nav className="print:hidden grid gap-4 sm:grid-cols-2">
        <Link
          href={`/team/${prev.slug}`}
          className="card-hover group flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ChevronRight className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs text-muted">عضو قبلی</span>
            <span className="mt-1 block font-extrabold">{prev.name}</span>
          </span>
        </Link>
        <Link
          href={`/team/${next.slug}`}
          className="card-hover group flex items-center justify-end gap-4 rounded-2xl border border-border bg-card p-5 text-left"
        >
          <span>
            <span className="block text-xs text-muted">عضو بعدی</span>
            <span className="mt-1 block font-extrabold">{next.name}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ChevronLeft className="h-5 w-5" />
          </span>
        </Link>
      </nav>
    </div>
  );
}
