import { Reveal, WordReveal } from "@/components/reveal";
import { toFa } from "@/lib/format";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "start",
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={`mb-14 flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <Reveal>
        <span className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold tracking-wider text-muted">
          <span className="font-black text-accent tabular-fa">{toFa(index)}</span>
          <span className="h-3 w-px bg-border" />
          {eyebrow}
        </span>
      </Reveal>
      <h2 className="max-w-2xl text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl">
        <WordReveal text={title} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p className="max-w-xl text-base leading-8 text-muted">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
