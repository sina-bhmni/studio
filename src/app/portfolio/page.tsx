import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { getProjects, PROJECT_CATEGORIES } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { Reveal, WordReveal } from "@/components/reveal";
import { CtaSection } from "@/components/home/cta-section";
import { toFa } from "@/lib/format";

export const metadata: Metadata = {
  title: "نمونه‌کارها",
  description:
    "پورتفولیوی استودیو نوا — طراحی و توسعه وب، برندینگ، رابط کاربری و کمپین‌های دیجیتال.",
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category ?? "all";
  const projects = await getProjects();
  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  const categories = [
    { key: "all", label: "همه" },
    ...Object.entries(PROJECT_CATEGORIES).map(([key, label]) => ({
      key,
      label,
    })),
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-muted">
              <LayoutGrid className="h-4 w-4 text-accent" />
              {toFa(projects.length)} پروژه — هر کدام یک قصه
            </span>
          </Reveal>
          <h1 className="text-5xl font-black leading-[1.2] tracking-tight sm:text-6xl">
            <WordReveal text="کارهایی که حرف می‌زنند" />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-9 text-muted">
              مجموعه‌ای از پروژه‌هایی که با تیم چهارنفره‌مان ساخته‌ایم؛ از
              فروشگاه‌های اینترنتی پرترافیک تا برندهایی که از صفر متولد شدند.
            </p>
          </Reveal>
        </div>

        {/* فیلتر دسته‌بندی */}
        <Reveal delay={0.25} className="mb-12">
          <div className="flex flex-wrap gap-2.5 border-y border-border py-5">
            {categories.map((c) => {
              const isActive = active === c.key;
              const count =
                c.key === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === c.key).length;
              return (
                <Link
                  key={c.key}
                  href={c.key === "all" ? "/portfolio" : `/portfolio?category=${c.key}`}
                  scroll={false}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-card text-foreground/75 hover:border-accent hover:text-accent"
                  }`}
                >
                  {c.label}
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

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={(i % 2) * 0.1}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted">
            در این دسته‌بندی پروژه‌ای ثبت نشده است.
          </p>
        )}
      </div>
      <CtaSection />
    </>
  );
}
