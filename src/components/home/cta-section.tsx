import Link from "next/link";
import { ArrowLeft, MessagesSquare } from "lucide-react";
import { Reveal, WordReveal } from "@/components/reveal";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal>
        <div className="grain-card relative overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-bl from-accent-soft via-card to-card p-10 sm:p-16">
          {/* دایره‌ی چرخان تزئینی */}
          <div
            aria-hidden
            className="animate-spin-slow pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-dashed border-accent/25"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-accent-soft blur-2xl"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-muted">
                <MessagesSquare className="h-4 w-4 text-accent" />
                اولین جلسه‌ی مشاوره — رایگان
              </span>
              <h2 className="text-3xl font-black leading-[1.35] sm:text-5xl">
                <WordReveal text="پروژه‌ی بعدی‌تان را با هم بسازیم" />
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                درباره‌ی ایده‌تان برایمان بنویسید؛ در کمتر از یک روز کاری جواب
                می‌دهید و یک جلسه‌ی همان‌راستا برای فهم نیازتان هماهنگ می‌کنیم.
              </p>
            </div>
            <Link
              href="/contact"
              className="group glow-accent flex shrink-0 items-center gap-3 rounded-full bg-accent px-10 py-5 text-lg font-bold text-accent-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              درخواست پروژه
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
