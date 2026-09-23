import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import type { ProjectWithTeam } from "@/lib/data";

export function ProjectsSection({ projects }: { projects: ProjectWithTeam[] }) {
  return (
    <section className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="۰۲"
            eyebrow="نمونه‌کارها"
            title="پروژه‌هایی که بهشان افتخار می‌کنیم"
          />
          <Reveal className="mb-14 hidden sm:block">
            <Link
              href="/portfolio"
              className="group flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold transition-all duration-300 hover:border-accent hover:text-accent"
            >
              همه‌ی نمونه‌کارها
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.slice(0, 4).map((project, i) => (
            <Reveal key={project.id} delay={(i % 2) * 0.12}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center sm:hidden">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold"
          >
            همه‌ی نمونه‌کارها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
