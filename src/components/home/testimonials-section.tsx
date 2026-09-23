import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { toFa } from "@/lib/format";
import type { Testimonial } from "@/db/schema";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading
          index="۰۴"
          eyebrow="اعتماد مشتریان"
          title="حرف‌های کسانی که با ما کار کرده‌اند"
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.12}>
              <figure className="card-hover relative flex h-full flex-col gap-6 rounded-3xl border border-border bg-card p-8">
                <Quote
                  className="h-10 w-10 text-accent/25"
                  strokeWidth={1.4}
                  aria-hidden
                />
                <blockquote className="flex-1 text-base leading-9 text-foreground/90">
                  «{t.content}»
                </blockquote>
                <figcaption className="flex items-center justify-between gap-4 border-t border-border pt-5">
                  <div>
                    <p className="font-extrabold">{t.clientName}</p>
                    <p className="mt-0.5 text-xs text-muted">{t.clientRole}</p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-accent"
                    aria-label={`امتیاز ${toFa(t.rating)} از ${toFa(5)}`}
                  >
                    {Array.from({ length: t.rating }).map((_, starIdx) => (
                      <Star key={starIdx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
