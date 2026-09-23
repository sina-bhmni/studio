import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PROJECT_CATEGORIES, type ProjectWithTeam } from "@/lib/data";
import { toFa } from "@/lib/format";

export function ProjectCard({ project }: { project: ProjectWithTeam }) {
  return (
    <article className="group card-hover relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      {/* تصویر */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
        <span className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
          {PROJECT_CATEGORIES[project.category]}
        </span>
      </div>

      {/* بدنه */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold leading-snug">{project.title}</h3>
          {project.year && (
            <span className="tabular-fa shrink-0 text-xs font-bold text-muted">
              {toFa(project.year)}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-7 text-muted">
          {project.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          {/* تیم پروژه */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2.5" dir="ltr">
              {project.team.slice(0, 4).map(({ member }) => (
                <span
                  key={member.id}
                  title={`${member.name} — ${project.team.find((t) => t.member.id === member.id)?.roleInProject ?? ""}`}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-card"
                >
                  {member.avatar && (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  )}
                </span>
              ))}
            </div>
            <span className="text-[11px] font-medium text-muted">
              {project.team.length > 0 && `تیم ${toFa(project.team.length)} نفره`}
            </span>
          </div>

          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
            >
              مشاهده‌ی زنده
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
